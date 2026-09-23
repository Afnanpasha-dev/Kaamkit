export interface OcrProgress {
  status: string;
  percent: number;
}

/**
 * Lazy-loads tesseract.js and extracts text from an image file in the browser.
 */
export async function extractTextFromImage(
  file: File,
  onProgress?: (progress: OcrProgress) => void
): Promise<string> {
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker("eng", 1, {
    workerPath: "/tesseract/worker.min.js",
    corePath: "/tesseract/core",
    langPath: "/tesseract/lang-data",
    gzip: true,
    logger: (m) => {
      if (m.status && onProgress) {
        const percent = Math.round((m.progress || 0) * 100);
        let statusMsg = "Processing image...";

        if (m.status === "loading tesseract core") statusMsg = "Loading OCR Engine...";
        else if (m.status === "initializing tesseract") statusMsg = "Initializing Worker...";
        else if (m.status === "loading language traineddata") statusMsg = "Loading Language Models...";
        else if (m.status === "initializing api") statusMsg = "Preparing Recognition...";
        else if (m.status === "recognizing text") statusMsg = `Recognizing text (${percent}%)...`;
        else statusMsg = `${m.status} (${percent}%)`;

        onProgress({ status: statusMsg, percent });
      }
    },
  });

  const url = URL.createObjectURL(file);
  try {
    const ret = await worker.recognize(url);
    await worker.terminate();
    return ret.data.text || "";
  } catch (err) {
    await worker.terminate().catch(() => {});
    throw err;
  } finally {
    URL.revokeObjectURL(url);
  }
}
