import { PDFDocument } from "pdf-lib";
import { PdfMergeResult } from "./types";
import { createSafeObjectUrl } from "./utils";
import { MAX_COMBINED_MERGE_SIZE_BYTES } from "./validator";

export async function mergePdfs(files: File[]): Promise<PdfMergeResult> {
  if (!files || files.length < 2) {
    throw new Error("Please select at least 2 PDF files to merge.");
  }

  // Validate combined file size
  const totalCombinedSize = files.reduce((acc, f) => acc + f.size, 0);
  if (totalCombinedSize > MAX_COMBINED_MERGE_SIZE_BYTES) {
    throw new Error(
      "The combined size of all PDFs exceeds the 100 MB limit. Please remove or compress some files."
    );
  }

  try {
    const mergedPdf = await PDFDocument.create();
    let totalPagesMerged = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      if (sourceDoc.isEncrypted) {
        throw new Error(
          `File "${file.name}" is password-protected and cannot be merged. Please remove the password first.`
        );
      }

      const pageIndices = sourceDoc.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(sourceDoc, pageIndices);

      for (const page of copiedPages) {
        mergedPdf.addPage(page);
        totalPagesMerged++;
      }
    }

    if (totalPagesMerged === 0) {
      throw new Error("None of the selected PDFs contained readable pages.");
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
    const url = createSafeObjectUrl(blob);

    return {
      blob,
      url,
      totalPages: totalPagesMerged,
      totalSize: blob.size,
      fileCount: files.length,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to merge PDF documents. Please try again with valid PDF files.");
  }
}
