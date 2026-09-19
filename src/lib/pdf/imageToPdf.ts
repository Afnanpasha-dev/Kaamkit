import { PDFDocument, PageSizes } from "pdf-lib";

export type ImageToPdfPageSize = "a4" | "letter" | "original";
export type ImageToPdfOrientation = "portrait" | "landscape";
export type ImageToPdfFit = "fit" | "fill";
export type ImageToPdfMargin = "none" | "small" | "medium" | "large";

export interface ImageToPdfOptions {
  pageSize: ImageToPdfPageSize;
  orientation: ImageToPdfOrientation;
  fit: ImageToPdfFit;
  margin: ImageToPdfMargin;
}

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  size: number;
  width: number;
  height: number;
  previewUrl: string;
}

const MARGIN_VALUES: Record<ImageToPdfMargin, number> = {
  none: 0,
  small: 18,
  medium: 36,
  large: 54,
};

/**
 * Loads an image file into an HTMLImageElement to obtain dimensions and raster canvas if WebP.
 */
export async function loadImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const dims = { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
      URL.revokeObjectURL(url);
      resolve(dims);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}

/**
 * Converts WebP or unusual image types to PNG bytes via Canvas.
 */
async function fileToEmbeddableBytes(file: File): Promise<{ bytes: Uint8Array; type: "jpeg" | "png" }> {
  const isJpeg = file.type === "image/jpeg" || file.type === "image/jpg" || file.name.match(/\.(jpe?g)$/i);
  const isPng = file.type === "image/png" || file.name.match(/\.png$/i);

  if (isJpeg || isPng) {
    const arrayBuf = await file.arrayBuffer();
    return { bytes: new Uint8Array(arrayBuf), type: isJpeg ? "jpeg" : "png" };
  }

  // WebP or others: rasterize on canvas to PNG
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not get 2D canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) {
          reject(new Error("Failed to convert image on canvas"));
          return;
        }
        blob.arrayBuffer().then((buf) => {
          resolve({ bytes: new Uint8Array(buf), type: "png" });
        }).catch(reject);
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to rasterize image: ${file.name}`));
    };
    img.src = url;
  });
}

export async function convertImagesToPdf(
  images: ImageItem[],
  options: ImageToPdfOptions
): Promise<{ blob: Blob; url: string; pageCount: number; totalSize: number }> {
  if (images.length === 0) {
    throw new Error("Please select at least one image to convert.");
  }

  const pdfDoc = await PDFDocument.create();
  const marginPt = MARGIN_VALUES[options.margin];

  for (const item of images) {
    const { bytes, type } = await fileToEmbeddableBytes(item.file);
    const embeddedImg = type === "jpeg" ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);

    const imgWidth = embeddedImg.width;
    const imgHeight = embeddedImg.height;

    // Calculate Page Dimensions
    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === "original") {
      pageWidth = imgWidth + marginPt * 2;
      pageHeight = imgHeight + marginPt * 2;
    } else {
      const standardSize = options.pageSize === "a4" ? PageSizes.A4 : PageSizes.Letter; // [w, h]
      if (options.orientation === "landscape") {
        pageWidth = Math.max(standardSize[0], standardSize[1]);
        pageHeight = Math.min(standardSize[0], standardSize[1]);
      } else {
        pageWidth = Math.min(standardSize[0], standardSize[1]);
        pageHeight = Math.max(standardSize[0], standardSize[1]);
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Available drawing area
    const drawAreaWidth = Math.max(1, pageWidth - marginPt * 2);
    const drawAreaHeight = Math.max(1, pageHeight - marginPt * 2);

    let renderWidth = drawAreaWidth;
    let renderHeight = drawAreaHeight;
    let drawX = marginPt;
    let drawY = marginPt;

    if (options.fit === "fit") {
      const scale = Math.min(drawAreaWidth / imgWidth, drawAreaHeight / imgHeight);
      renderWidth = imgWidth * scale;
      renderHeight = imgHeight * scale;
      drawX = marginPt + (drawAreaWidth - renderWidth) / 2;
      drawY = marginPt + (drawAreaHeight - renderHeight) / 2;
    } else {
      // fill (cover or stretch to draw area)
      renderWidth = drawAreaWidth;
      renderHeight = drawAreaHeight;
    }

    page.drawImage(embeddedImg, {
      x: drawX,
      y: drawY,
      width: renderWidth,
      height: renderHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  return {
    blob,
    url,
    pageCount: images.length,
    totalSize: blob.size,
  };
}
