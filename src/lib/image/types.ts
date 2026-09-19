export type SupportedImageMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp";

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
  dimensions?: ImageDimensions;
}

export interface CompressionOptions {
  quality: number; // 0.1 to 1.0
  format?: SupportedImageMimeType | "auto";
  maxWidth?: number;
  maxHeight?: number;
}

export interface CompressionResult {
  blob: Blob;
  url: string;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
  dimensions: ImageDimensions;
  format: SupportedImageMimeType;
}

export interface ResizeOptions {
  width: number;
  height: number;
  format?: SupportedImageMimeType | "auto";
  quality?: number; // 0.1 to 1.0 (default 0.92)
}

export interface ResizeResult {
  blob: Blob;
  url: string;
  originalSize: number;
  resizedSize: number;
  originalDimensions: ImageDimensions;
  newDimensions: ImageDimensions;
  format: SupportedImageMimeType;
}
