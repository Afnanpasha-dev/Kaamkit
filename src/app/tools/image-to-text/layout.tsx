import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to Text OCR — Extract Text from Images | KaamKit",
  description: "Extract text from images using browser-based OCR with KaamKit.",
  keywords: [
    "image text",
    "ocr",
    "extract text",
    "photo text",
    "image ocr",
    "photo to text",
    "scanned text extractor",
  ],
};

export default function ImageToTextLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
