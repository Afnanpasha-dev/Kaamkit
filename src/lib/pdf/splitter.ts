import { PDFDocument } from "pdf-lib";
import { PdfSplitResult } from "./types";
import { createSafeObjectUrl } from "./utils";

export interface RangeParseResult {
  isValid: boolean;
  pageIndices: number[]; // 0-indexed
  error?: string;
}

/**
 * Parses user input strings like "1-3, 5, 7-10" into 0-indexed page numbers.
 * Validates syntax, bounds against totalPages, and eliminates duplicates.
 */
export function parsePageRangeString(
  input: string,
  totalPages: number
): RangeParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      pageIndices: [],
      error: "Please enter at least one page number or range (e.g., 1-3, 5).",
    };
  }

  const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
  const selectedPagesSet = new Set<number>();

  for (const part of parts) {
    if (part.includes("-")) {
      const rangeParts = part.split("-").map((p) => p.trim());
      if (rangeParts.length !== 2) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Invalid range format "${part}". Use format like 1-5.`,
        };
      }

      const start = parseInt(rangeParts[0], 10);
      const end = parseInt(rangeParts[1], 10);

      if (isNaN(start) || isNaN(end)) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Non-numeric page value in range "${part}".`,
        };
      }

      if (start < 1 || end < 1) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Page numbers must be 1 or higher in range "${part}".`,
        };
      }

      if (start > end) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Invalid range "${part}": Start page (${start}) cannot be greater than end page (${end}).`,
        };
      }

      if (end > totalPages) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Page ${end} is out of bounds. This document only has ${totalPages} pages.`,
        };
      }

      for (let p = start; p <= end; p++) {
        selectedPagesSet.add(p - 1);
      }
    } else {
      const singlePage = parseInt(part, 10);
      if (isNaN(singlePage)) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Invalid page number "${part}". Please enter numbers only.`,
        };
      }

      if (singlePage < 1) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Page numbers must be 1 or higher.`,
        };
      }

      if (singlePage > totalPages) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Page ${singlePage} is out of bounds. This document only has ${totalPages} pages.`,
        };
      }

      selectedPagesSet.add(singlePage - 1);
    }
  }

  const sortedIndices = Array.from(selectedPagesSet).sort((a, b) => a - b);

  if (sortedIndices.length === 0) {
    return {
      isValid: false,
      pageIndices: [],
      error: "No valid pages were selected.",
    };
  }

  return {
    isValid: true,
    pageIndices: sortedIndices,
  };
}

/**
 * Extracts specified pages from a PDF file into a new PDF document.
 */
export async function splitPdf(
  file: File,
  pageIndices: number[]
): Promise<PdfSplitResult> {
  if (!pageIndices || pageIndices.length === 0) {
    throw new Error("No pages were selected for extraction.");
  }

  try {
    const buffer = await file.arrayBuffer();
    const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

    if (sourceDoc.isEncrypted) {
      throw new Error("This PDF is password-protected and cannot be split.");
    }

    const totalDocPages = sourceDoc.getPageCount();
    // Verify bounds
    for (const idx of pageIndices) {
      if (idx < 0 || idx >= totalDocPages) {
        throw new Error(
          `Requested page ${idx + 1} does not exist in this document (${totalDocPages} total pages).`
        );
      }
    }

    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices);

    for (const page of copiedPages) {
      newDoc.addPage(page);
    }

    const newPdfBytes = await newDoc.save();
    const blob = new Blob([newPdfBytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
    const url = createSafeObjectUrl(blob);

    return {
      blob,
      url,
      pageCount: copiedPages.length,
      fileSize: blob.size,
    };
  } catch (err: unknown) {
    if (err instanceof Error) throw err;
    throw new Error("An error occurred while splitting the PDF. Please try again.");
  }
}
