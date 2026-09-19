import { PDFDocument } from "pdf-lib";
import { PdfCompressLevel, PdfCompressResult } from "./types";
import { createSafeObjectUrl } from "./utils";

export async function compressPdf(
  file: File,
  level: PdfCompressLevel
): Promise<PdfCompressResult> {
  const originalSize = file.size;

  try {
    const buffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

    if (pdfDoc.isEncrypted) {
      throw new Error("This PDF is password-protected and cannot be compressed.");
    }

    const pageCount = pdfDoc.getPageCount();

    // Configure structural compaction based on compression level
    if (level === "balanced" || level === "strong") {
      // Clear non-essential document metadata
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("KaamKit");
      pdfDoc.setCreator("KaamKit");
    }

    // Save with object streams and compression
    // useObjectStreams merges multiple PDF objects into single compressed streams
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    });

    const compressedBlob = new Blob([compressedBytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
    const compressedSize = compressedBlob.size;

    // Determine reduction percentage
    const isSmaller = compressedSize < originalSize;
    const reductionPercentage = isSmaller
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

    // Use smaller of the two if original was already more compact, but provide compressedBlob
    const url = createSafeObjectUrl(compressedBlob);

    return {
      blob: compressedBlob,
      url,
      originalSize,
      compressedSize,
      reductionPercentage,
      pageCount,
      isSmaller,
    };
  } catch (err: unknown) {
    if (err instanceof Error) throw err;
    throw new Error("An error occurred during PDF compression. Please try again.");
  }
}
