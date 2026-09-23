import {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
  decodePDFRawStream,
} from "pdf-lib";
import { PdfCompressLevel, PdfCompressResult } from "./types";
import { createSafeObjectUrl } from "./utils";

interface CompressionSettings {
  maxDimension: number;
  quality: number;
  minByteSizeToCompress: number;
}

const LEVEL_SETTINGS: Record<PdfCompressLevel, CompressionSettings> = {
  low: {
    maxDimension: 2048,
    quality: 0.85,
    minByteSizeToCompress: 20 * 1024, // 20 KB
  },
  balanced: {
    maxDimension: 1600,
    quality: 0.75,
    minByteSizeToCompress: 15 * 1024, // 15 KB
  },
  strong: {
    maxDimension: 1280,
    quality: 0.65,
    minByteSizeToCompress: 10 * 1024, // 10 KB
  },
};

/**
 * Recompresses a JPEG blob to a target max dimension and quality using HTML Canvas.
 */
function recompressJpegBlob(
  blob: Blob,
  fallbackWidth: number,
  fallbackHeight: number,
  settings: CompressionSettings
): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      resolve(null);
      return;
    }

    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const origW = img.naturalWidth || fallbackWidth;
      const origH = img.naturalHeight || fallbackHeight;

      if (!origW || !origH) {
        resolve(null);
        return;
      }

      let targetW = origW;
      let targetH = origH;

      if (targetW > settings.maxDimension || targetH > settings.maxDimension) {
        const ratio = Math.min(
          settings.maxDimension / targetW,
          settings.maxDimension / targetH
        );
        targetW = Math.max(1, Math.round(targetW * ratio));
        targetH = Math.max(1, Math.round(targetH * ratio));
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        async (newBlob) => {
          if (!newBlob) {
            resolve(null);
            return;
          }
          const buf = await newBlob.arrayBuffer();
          resolve({
            bytes: new Uint8Array(buf),
            width: targetW,
            height: targetH,
          });
        },
        "image/jpeg",
        settings.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
}

/**
 * Recompresses an uncompressed Flate raw raster image into a compact JPEG stream.
 */
function recompressRawRaster(
  rawBytes: Uint8Array,
  width: number,
  height: number,
  colorSpace: string,
  settings: CompressionSettings
): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      resolve(null);
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(null);
        return;
      }

      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      if (colorSpace === "/DeviceRGB" && rawBytes.length >= width * height * 3) {
        for (let i = 0, j = 0; i < rawBytes.length && j < data.length; i += 3, j += 4) {
          data[j] = rawBytes[i];
          data[j + 1] = rawBytes[i + 1];
          data[j + 2] = rawBytes[i + 2];
          data[j + 3] = 255;
        }
      } else if (colorSpace === "/DeviceGray" && rawBytes.length >= width * height) {
        for (let i = 0, j = 0; i < rawBytes.length && j < data.length; i++, j += 4) {
          const g = rawBytes[i];
          data[j] = g;
          data[j + 1] = g;
          data[j + 2] = g;
          data[j + 3] = 255;
        }
      } else {
        resolve(null);
        return;
      }

      ctx.putImageData(imgData, 0, 0);

      // Downscale if dimensions exceed limits
      let finalCanvas = canvas;
      let targetW = width;
      let targetH = height;

      if (width > settings.maxDimension || height > settings.maxDimension) {
        const ratio = Math.min(
          settings.maxDimension / width,
          settings.maxDimension / height
        );
        targetW = Math.max(1, Math.round(width * ratio));
        targetH = Math.max(1, Math.round(height * ratio));

        const scaledCanvas = document.createElement("canvas");
        scaledCanvas.width = targetW;
        scaledCanvas.height = targetH;
        const scaledCtx = scaledCanvas.getContext("2d");
        if (scaledCtx) {
          scaledCtx.fillStyle = "#ffffff";
          scaledCtx.fillRect(0, 0, targetW, targetH);
          scaledCtx.drawImage(canvas, 0, 0, targetW, targetH);
          finalCanvas = scaledCanvas;
        }
      }

      finalCanvas.toBlob(
        async (newBlob) => {
          if (!newBlob) {
            resolve(null);
            return;
          }
          const buf = await newBlob.arrayBuffer();
          resolve({
            bytes: new Uint8Array(buf),
            width: targetW,
            height: targetH,
          });
        },
        "image/jpeg",
        settings.quality
      );
    } catch {
      resolve(null);
    }
  });
}

/**
 * Compresses a PDF file by downsampling/re-encoding embedded raster images
 * and performing structural object stream compaction.
 */
export async function compressPdf(
  file: File,
  level: PdfCompressLevel,
  onProgress?: (status: string) => void
): Promise<PdfCompressResult> {
  const originalSize = file.size;
  const settings = LEVEL_SETTINGS[level] || LEVEL_SETTINGS.balanced;

  try {
    if (onProgress) onProgress("Parsing PDF structure...");
    const buffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

    if (pdfDoc.isEncrypted) {
      throw new Error("This PDF is password-protected and cannot be compressed.");
    }

    const pageCount = pdfDoc.getPageCount();

    // 1. Scan for and recompress embedded images
    let imagesOptimizedCount = 0;
    const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
    const imageObjects: Array<{ ref: any; obj: PDFRawStream }> = [];

    for (const [ref, obj] of indirectObjects) {
      if (
        obj instanceof PDFRawStream &&
        obj.dict.get(PDFName.of("Subtype"))?.toString() === "/Image"
      ) {
        imageObjects.push({ ref, obj });
      }
    }

    if (imageObjects.length > 0 && onProgress) {
      onProgress(`Optimizing ${imageObjects.length} embedded images...`);
    }

    for (let i = 0; i < imageObjects.length; i++) {
      const { ref, obj } = imageObjects[i];

      try {
        // Skip images with SMask (transparency mask) to avoid mask coordinate misalignment
        if (obj.dict.get(PDFName.of("SMask"))) {
          continue;
        }

        const filterObj = obj.dict.get(PDFName.of("Filter"));
        const filter = filterObj ? filterObj.toString() : "";

        const widthVal = obj.dict.get(PDFName.of("Width"));
        const heightVal = obj.dict.get(PDFName.of("Height"));
        const width =
          widthVal && typeof (widthVal as any).numberValue === "number"
            ? (widthVal as any).numberValue
            : 0;
        const height =
          heightVal && typeof (heightVal as any).numberValue === "number"
            ? (heightVal as any).numberValue
            : 0;

        const contents = obj.getContents();
        if (!contents || contents.length < settings.minByteSizeToCompress) {
          continue;
        }

        let recompressed: { bytes: Uint8Array; width: number; height: number } | null = null;

        if (filter === "/DCTDecode") {
          const blob = new Blob([contents as BlobPart], { type: "image/jpeg" });
          recompressed = await recompressJpegBlob(blob, width, height, settings);
        } else if (filter === "/FlateDecode" && width > 0 && height > 0) {
          const colorSpace = obj.dict.get(PDFName.of("ColorSpace"))?.toString() || "/DeviceRGB";
          const rawBytes = decodePDFRawStream(obj).decode();
          recompressed = await recompressRawRaster(rawBytes, width, height, colorSpace, settings);
        }

        // Only replace if new bytes achieve actual reduction (at least 5% savings)
        if (recompressed && recompressed.bytes.length < contents.length * 0.95) {
          obj.dict.set(PDFName.of("Width"), PDFNumber.of(recompressed.width));
          obj.dict.set(PDFName.of("Height"), PDFNumber.of(recompressed.height));
          obj.dict.set(PDFName.of("Length"), PDFNumber.of(recompressed.bytes.length));
          obj.dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
          obj.dict.set(PDFName.of("ColorSpace"), PDFName.of("DeviceRGB"));
          obj.dict.set(PDFName.of("BitsPerComponent"), PDFNumber.of(8));
          obj.dict.delete(PDFName.of("DecodeParms"));

          const newStream = PDFRawStream.of(obj.dict, recompressed.bytes);
          pdfDoc.context.assign(ref, newStream);
          imagesOptimizedCount++;
        }
      } catch {
        // Individual image failure: skip safely to preserve PDF validity
      }
    }

    if (onProgress) onProgress("Compacting document object streams...");

    // 2. Clear non-essential document metadata
    if (level === "balanced" || level === "strong") {
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("KaamKit");
      pdfDoc.setCreator("KaamKit");
    }

    // 3. Save with object streams and structural compression
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    });

    const compressedBlob = new Blob([compressedBytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });

    // If compressed output is smaller, use it; otherwise fallback to original
    const isSmaller = compressedBlob.size < originalSize;
    const finalBlob = isSmaller ? compressedBlob : file;
    const finalSize = finalBlob.size;

    const reductionPercentage = isSmaller
      ? Math.round(((originalSize - finalSize) / originalSize) * 100)
      : 0;

    const url = createSafeObjectUrl(finalBlob);

    return {
      blob: finalBlob,
      url,
      originalSize,
      compressedSize: finalSize,
      reductionPercentage,
      pageCount,
      isSmaller,
      imagesOptimizedCount,
    };
  } catch (err: unknown) {
    if (err instanceof Error) throw err;
    throw new Error("An error occurred during PDF compression. Please try again.");
  }
}
