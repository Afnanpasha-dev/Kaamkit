export interface PdfFileInfo {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

export interface PdfValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
  pageCount?: number;
}

export interface PdfMergeResult {
  blob: Blob;
  url: string;
  totalPages: number;
  totalSize: number;
  fileCount: number;
}

export interface PdfSplitOptions {
  pageIndices: number[]; // 0-indexed page numbers
}

export interface PdfSplitResult {
  blob: Blob;
  url: string;
  pageCount: number;
  fileSize: number;
}

export type PdfCompressLevel = "low" | "balanced" | "strong";

export interface PdfCompressResult {
  blob: Blob;
  url: string;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
  pageCount: number;
  isSmaller: boolean;
}

export interface PdfToImageOptions {
  format: "image/png" | "image/jpeg";
  scale?: number; // default 1.5 for crisp DPI
  quality?: number; // 0.1 to 1.0 for jpeg
  pageIndices?: number[]; // 0-indexed, default all
}

export interface RenderedPdfPage {
  pageNumber: number; // 1-indexed
  blob: Blob;
  url: string;
  width: number;
  height: number;
  format: "png" | "jpeg";
}

export interface PdfToImageResult {
  pages: RenderedPdfPage[];
  totalPages: number;
  zipBlob?: Blob;
  zipUrl?: string;
}
