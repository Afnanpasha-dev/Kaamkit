import QRCode from "qrcode";

export type QrContentType = "url" | "text" | "phone" | "email";
export type QrErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QrOptions {
  size: number;
  errorCorrectionLevel: QrErrorCorrectionLevel;
  foregroundColor: string; // e.g. "#000000"
  backgroundColor: string; // e.g. "#ffffff"
}

export interface QrResult {
  pngDataUrl: string;
  svgString: string;
  warning?: string;
}

/**
 * Parses hex color to RGB [0-255].
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "").trim();
  let r = 0, g = 0, b = 0;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  return { r: isNaN(r) ? 0 : r, g: isNaN(g) ? 0 : g, b: isNaN(b) ? 0 : b };
}

/**
 * Calculates relative luminance for WCAG contrast calculation.
 */
function getRelativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const R = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const G = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const B = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates contrast ratio between two hex colors.
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): number {
  const fgRgb = hexToRgb(fgHex);
  const bgRgb = hexToRgb(bgHex);
  const l1 = getRelativeLuminance(fgRgb);
  const l2 = getRelativeLuminance(bgRgb);
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

/**
 * Formats raw input text based on QR content type.
 */
export function formatQrPayload(contentType: QrContentType, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  switch (contentType) {
    case "url":
      if (!/^https?:\/\//i.test(trimmed)) {
        return `https://${trimmed}`;
      }
      return trimmed;
    case "phone":
      return `tel:${trimmed.replace(/\s+/g, "")}`;
    case "email":
      return `mailto:${trimmed}`;
    case "text":
    default:
      return trimmed;
  }
}

/**
 * Generates PNG data URL and raw SVG string for a QR code locally in browser.
 */
export async function generateQrCode(payload: string, options: QrOptions): Promise<QrResult> {
  if (!payload) {
    throw new Error("QR content cannot be empty.");
  }

  const contrastRatio = calculateContrastRatio(options.foregroundColor, options.backgroundColor);
  let warning: string | undefined;
  if (contrastRatio < 3.0) {
    warning = "Low contrast may make this QR code difficult to scan.";
  }

  const qrOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel,
    width: options.size,
    margin: 2,
    color: {
      dark: options.foregroundColor,
      light: options.backgroundColor,
    },
  };

  const pngDataUrl = await QRCode.toDataURL(payload, qrOptions);
  const svgString = await QRCode.toString(payload, {
    ...qrOptions,
    type: "svg",
  });

  return {
    pngDataUrl,
    svgString,
    warning,
  };
}
