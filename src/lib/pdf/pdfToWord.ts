export interface PdfToWordResult {
  blob: Blob;
  url: string;
  filename: string;
  pageCount: number;
  wordCount: number;
  isScanned?: boolean;
}

/**
 * Initializes pdfjs-dist on client.
 */
async function getPdfJs() {
  const pdfjsLib = await import("pdfjs-dist");
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }
  return pdfjsLib;
}

/**
 * Extracts text from a PDF file page-by-page and converts it into a clean Word (.docx) document.
 * Detects scanned / image-based PDFs without meaningful selectable text.
 */
export async function convertPdfToWord(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<PdfToWordResult> {
  const pdfjsLib = await getPdfJs();
  const buffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  });

  const pdfDoc = await loadingTask.promise;
  const pageCount = pdfDoc.numPages;

  const pagesText: string[][] = [];
  let totalMeaningfulChars = 0;
  let totalWords = 0;

  for (let i = 1; i <= pageCount; i++) {
    if (onProgress) onProgress(i, pageCount);

    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    const pageLines: string[] = [];
    let currentLine = "";

    for (const item of textContent.items) {
      if ("str" in item) {
        const text = item.str;
        if (item.hasEOL) {
          currentLine += text;
          if (currentLine.trim()) {
            pageLines.push(currentLine.trim());
          }
          currentLine = "";
        } else {
          currentLine += (currentLine && !currentLine.endsWith(" ") && !text.startsWith(" ") ? " " : "") + text;
        }
      }
    }
    if (currentLine.trim()) {
      pageLines.push(currentLine.trim());
    }

    pagesText.push(pageLines);

    // Count words and meaningful chars
    const pageFullText = pageLines.join(" ");
    const alphaNumericOnly = pageFullText.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, "");
    totalMeaningfulChars += alphaNumericOnly.length;

    const words = pageFullText.trim().split(/\s+/).filter(Boolean);
    totalWords += words.length;
  }

  // Scanned PDF detection rule:
  // If across the document there is ZERO meaningful alphanumeric text extracted,
  // then treat as scanned / image-only.
  if (totalMeaningfulChars === 0) {
    return {
      blob: new Blob(),
      url: "",
      filename: "kaamkit-pdf-to-word.docx",
      pageCount,
      wordCount: 0,
      isScanned: true,
    };
  }

  // Lazy load docx
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const docParagraphs: any[] = [];

  pagesText.forEach((lines, pageIndex) => {
    // Add Page Indicator Header if multi-page
    if (pageCount > 1) {
      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `--- Page ${pageIndex + 1} ---`,
              bold: true,
              color: "666666",
              size: 20, // 10pt
            }),
          ],
          spacing: { before: 240, after: 120 },
        })
      );
    }

    if (lines.length === 0) {
      docParagraphs.push(
        new Paragraph({
          children: [new TextRun({ text: "[Empty Page]", italics: true, color: "888888" })],
          spacing: { after: 120 },
        })
      );
    } else {
      lines.forEach((line) => {
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                font: "Calibri",
                size: 24, // 12pt
              }),
            ],
            spacing: { after: 120 },
          })
        );
      });
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docParagraphs,
      },
    ],
  });

  const docxBlob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(docxBlob);

  return {
    blob: docxBlob,
    url,
    filename: "kaamkit-pdf-to-word.docx",
    pageCount,
    wordCount: totalWords,
    isScanned: false,
  };
}
