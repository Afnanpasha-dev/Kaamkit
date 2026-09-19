/**
 * Inspects the initial bytes of a buffer to verify the standard '%PDF-' magic header.
 */
export function validatePdfMagicBytes(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 5) return false;
  const header = new Uint8Array(buffer.slice(0, 5));
  // %PDF- in ASCII is [37, 80, 68, 70, 45]
  return (
    header[0] === 0x25 && // %
    header[1] === 0x50 && // P
    header[2] === 0x44 && // D
    header[3] === 0x46 && // F
    header[4] === 0x2d // -
  );
}

/**
 * Creates an object URL for a Blob.
 */
export function createSafeObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Revokes an object URL to release browser memory.
 */
export function revokeSafeObjectUrl(url: string | null | undefined): void {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Formats bytes into a human-readable string.
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
 * Formats a clean output filename with an appropriate suffix and .pdf extension.
 */
export function generatePdfFilename(originalName: string, suffix: string): string {
  const lastDot = originalName.lastIndexOf(".");
  const baseName = lastDot !== -1 ? originalName.slice(0, lastDot) : originalName;
  const cleanBase = baseName.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${cleanBase}-${suffix}.pdf`;
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
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
