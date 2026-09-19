import { ImageDimensions, SupportedImageMimeType } from "./types";

/**
 * Formats a byte number into a human-readable file size string (B, KB, MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

/**
 * Loads an image from a URL string into an HTMLImageElement safely.
 */
export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image into browser memory"));
    img.src = src;
  });
}

/**
 * Extracts width and height dimensions from a File or Blob.
 */
export async function getImageDimensions(fileOrBlob: File | Blob): Promise<ImageDimensions> {
  const objectUrl = URL.createObjectURL(fileOrBlob);
  try {
    const img = await loadImageElement(objectUrl);
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Creates an object URL for a Blob or File.
 */
export function createSafeUrl(blobOrFile: Blob | File): string {
  return URL.createObjectURL(blobOrFile);
}

/**
 * Revokes an object URL to release browser memory.
 */
export function revokeSafeUrl(url: string | null | undefined): void {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Formats an output filename with appropriate suffix and file extension.
 */
export function getSanitizedFilename(
  originalName: string,
  suffix: string,
  mimeType?: SupportedImageMimeType
): string {
  const lastDot = originalName.lastIndexOf(".");
  const baseName = lastDot !== -1 ? originalName.slice(0, lastDot) : originalName;

  let extension = "jpg";
  if (mimeType === "image/png") extension = "png";
  else if (mimeType === "image/webp") extension = "webp";
  else if (mimeType === "image/jpeg") extension = "jpg";
  else if (lastDot !== -1) {
    extension = originalName.slice(lastDot + 1).toLowerCase();
  }

  // Sanitize basename to remove special characters
  const cleanBase = baseName.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${cleanBase}-${suffix}.${extension}`;
}

/**
 * Triggers a browser file download for a given Blob.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
