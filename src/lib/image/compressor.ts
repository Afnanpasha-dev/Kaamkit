import {
  CompressionOptions,
  CompressionResult,
  SupportedImageMimeType,
} from "./types";
import {
  createSafeUrl,
  loadImageElement,
  revokeSafeUrl,
} from "./utils";

export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  const originalSize = file.size;
  const tempUrl = createSafeUrl(file);

  try {
    const img = await loadImageElement(tempUrl);
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;

    // Calculate dimensions
    let targetWidth = originalWidth;
    let targetHeight = originalHeight;

    if (options.maxWidth && targetWidth > options.maxWidth) {
      const ratio = options.maxWidth / targetWidth;
      targetWidth = Math.round(targetWidth * ratio);
      targetHeight = Math.round(targetHeight * ratio);
    }

    if (options.maxHeight && targetHeight > options.maxHeight) {
      const ratio = options.maxHeight / targetHeight;
      targetWidth = Math.round(targetWidth * ratio);
      targetHeight = Math.round(targetHeight * ratio);
    }

    // Determine target format
    let targetFormat: SupportedImageMimeType = "image/jpeg";
    const originalMime = (file.type as SupportedImageMimeType) || "image/jpeg";

    if (options.format && options.format !== "auto") {
      targetFormat = options.format;
    } else {
      // Default auto
      if (originalMime === "image/png" && options.quality < 0.95) {
        // PNG doesn't support lossy compression via canvas toBlob; convert to WebP or JPEG for real reduction
        targetFormat = "image/webp";
      } else {
        targetFormat = originalMime;
      }
    }

    // Setup canvas
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to initialize canvas 2D rendering context");
    }

    // If target is JPEG, fill background with white in case original has transparency
    if (targetFormat === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Perform compression
    const quality = Math.min(Math.max(options.quality, 0.05), 1.0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (resultBlob) => {
          if (resultBlob) {
            resolve(resultBlob);
          } else {
            reject(new Error("Browser failed to generate compressed image blob"));
          }
        },
        targetFormat,
        quality
      );
    });

    const compressedSize = blob.size;
    const reductionPercentage =
      originalSize > 0
        ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
        : 0;

    const resultUrl = createSafeUrl(blob);

    return {
      blob,
      url: resultUrl,
      originalSize,
      compressedSize,
      reductionPercentage,
      dimensions: {
        width: targetWidth,
        height: targetHeight,
      },
      format: targetFormat,
    };
  } finally {
    revokeSafeUrl(tempUrl);
  }
}
