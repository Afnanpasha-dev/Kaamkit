import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Images Converter — Convert PDF Pages to JPG & PNG",
  description:
    "Render and convert PDF pages into high-resolution JPG or PNG images directly in your browser. Download individual pages or a single ZIP file.",
  keywords: [
    "pdf to image converter",
    "pdf to jpg online",
    "pdf to png high quality",
    "extract images from pdf",
    "free pdf to images India",
  ],
  alternates: {
    canonical: "/tools/pdf-to-images",
  },
};

export default function PdfToImagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
