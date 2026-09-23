import {
  PdfToImageOptions,
  PdfToImageResult,
  RenderedPdfPage,
} from "./types";
import { createSafeObjectUrl } from "./utils";
import JSZip from "jszip";

/**
 * Initializes pdfjs-dist on the client and sets up the worker.
 */
async function getPdfJs() {
  const pdfjsLib = await import("pdfjs-dist");
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }
  return pdfjsLib;
}

/**
 * Renders selected pages of a PDF to high-resolution images in the browser.
 */
export async function renderPdfToImages(
  file: File,
  options: PdfToImageOptions,
  onProgress?: (current: number, total: number) => void
): Promise<PdfToImageResult> {
  const pdfjsLib = await getPdfJs();
  const buffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  });

  const pdfDoc = await loadingTask.promise;
  const totalDocPages = pdfDoc.numPages;

  // Determine pages to render (1-indexed for pdf.js)
  let pagesToRender: number[] = [];
  if (options.pageIndices && options.pageIndices.length > 0) {
    pagesToRender = options.pageIndices.map((idx) => idx + 1);
  } else {
    for (let i = 1; i <= totalDocPages; i++) {
      pagesToRender.push(i);
    }
  }

  const renderedPages: RenderedPdfPage[] = [];
  const format = options.format || "image/png";
  const scale = options.scale || 1.5;
  const extension = format === "image/jpeg" ? "jpeg" : "png";

  for (let i = 0; i < pagesToRender.length; i++) {
    const pageNum = pagesToRender[i];
    if (pageNum < 1 || pageNum > totalDocPages) continue;

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to create canvas 2D rendering context");
    }

    // White background for JPEG format
    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    // Render page
    await page.render(renderContext).promise;

    // Export to Blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (resultBlob) => {
          if (resultBlob) resolve(resultBlob);
          else reject(new Error(`Failed to rasterize page ${pageNum}`));
        },
        format,
        options.quality ?? 0.92
      );
    });

    const url = createSafeObjectUrl(blob);

    renderedPages.push({
      pageNumber: pageNum,
      blob,
      url,
      width: canvas.width,
      height: canvas.height,
      format: extension,
    });

    if (onProgress) {
      onProgress(i + 1, pagesToRender.length);
    }
  }

  return {
    pages: renderedPages,
    totalPages: totalDocPages,
  };
}

/**
 * Creates a ZIP archive containing all rendered page images in browser memory.
 */
export async function createPdfImagesZip(
  pages: RenderedPdfPage[],
  baseFilename: string
): Promise<Blob> {
  const zip = new JSZip();

  const lastDot = baseFilename.lastIndexOf(".");
  const cleanBase =
    lastDot !== -1 ? baseFilename.slice(0, lastDot) : baseFilename;
  const safeName = cleanBase.replace(/[^a-zA-Z0-9_-]/g, "_");

  for (const page of pages) {
    const pageFileName = `${safeName}-page-${page.pageNumber}.${page.format}`;
    zip.file(pageFileName, page.blob);
  }

  return await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}
