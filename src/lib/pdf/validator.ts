import { PDFDocument } from "pdf-lib";
import { PdfValidationResult } from "./types";
import { validatePdfMagicBytes } from "./utils";

export const MAX_SINGLE_PDF_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_COMBINED_MERGE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

/**
 * Validates that a file is a readable, uncorrupted, unencrypted PDF document.
 */
export async function validatePdfFile(file: File): Promise<PdfValidationResult> {
  if (!file) {
    return {
      isValid: false,
      error: "No file was selected. Please choose a PDF file to proceed.",
    };
  }

  // 1. File Size Validation
  if (file.size === 0) {
    return {
      isValid: false,
      error: "The selected file is empty (0 bytes). Please select a valid PDF document.",
    };
  }

  if (file.size > MAX_SINGLE_PDF_SIZE_BYTES) {
    return {
      isValid: false,
      error: "This PDF exceeds the 50 MB limit. Please select a smaller document.",
    };
  }

  // 2. MIME & Extension Checks
  const fileName = file.name.toLowerCase();
  const hasPdfExtension = fileName.endsWith(".pdf");
  const isPdfMime = file.type === "application/pdf" || file.type === "";

  if (!hasPdfExtension && !isPdfMime) {
    return {
      isValid: false,
      error: "Unsupported file type. Please upload a document ending in .pdf.",
    };
  }

  // 3. Binary Magic Byte Inspection (%PDF-)
  try {
    const buffer = await file.arrayBuffer();
    const hasValidHeader = validatePdfMagicBytes(buffer);

    if (!hasValidHeader) {
      return {
        isValid: false,
        error: "This file does not have a valid PDF structure. It may be corrupted or renamed.",
      };
    }

    // 4. Structural Integrity & Encryption Inspection
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

    if (pdfDoc.isEncrypted) {
      return {
        isValid: false,
        error: "This PDF is password-protected. Please unlock or remove the password before uploading.",
      };
    }

    const pageCount = pdfDoc.getPageCount();
    if (pageCount === 0) {
      return {
        isValid: false,
        error: "This PDF contains no readable pages.",
      };
    }

    return {
      isValid: true,
      file,
      pageCount,
    };
  } catch (err: unknown) {
    return {
      isValid: false,
      error: "This file could not be opened as a PDF. Please try another file.",
    };
  }
}
