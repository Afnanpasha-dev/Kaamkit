import {
  ResizeOptions,
  ResizeResult,
  SupportedImageMimeType,
} from "./types";
import {
  createSafeUrl,
  loadImageElement,
  revokeSafeUrl,
} from "./utils";

export const MIN_DIMENSION_PIXELS = 10;
export const MAX_DIMENSION_PIXELS = 8000;

export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<ResizeResult> {
  const { width, height } = options;

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < MIN_DIMENSION_PIXELS ||
    height < MIN_DIMENSION_PIXELS ||
    width > MAX_DIMENSION_PIXELS ||
    height > MAX_DIMENSION_PIXELS
  ) {
    throw new Error(
      `Dimensions must be between ${MIN_DIMENSION_PIXELS}px and ${MAX_DIMENSION_PIXELS}px.`
    );
  }

  const originalSize = file.size;
  const tempUrl = createSafeUrl(file);

  try {
    const img = await loadImageElement(tempUrl);
    const originalDimensions = {
      width: img.naturalWidth,
      height: img.naturalHeight,
    };

    const targetWidth = Math.round(width);
    const targetHeight = Math.round(height);

    // Determine output format
    let targetFormat: SupportedImageMimeType = "image/jpeg";
    const originalMime = (file.type as SupportedImageMimeType) || "image/jpeg";

    if (options.format && options.format !== "auto") {
      targetFormat = options.format;
    } else {
      targetFormat = originalMime;
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to initialize canvas 2D rendering context");
    }

    // Fill white background for JPEG
    if (targetFormat === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const quality = options.quality ?? 0.92;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (resultBlob) => {
          if (resultBlob) {
            resolve(resultBlob);
          } else {
            reject(new Error("Browser failed to render resized image blob"));
          }
        },
        targetFormat,
        quality
      );
    });

    const resultUrl = createSafeUrl(blob);

    return {
      blob,
      url: resultUrl,
      originalSize,
      resizedSize: blob.size,
      originalDimensions,
      newDimensions: {
        width: targetWidth,
        height: targetHeight,
      },
      format: targetFormat,
    };
  } finally {
    revokeSafeUrl(tempUrl);
  }
}
