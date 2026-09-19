import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Word Converter — Convert PDF to DOCX | KaamKit",
  description:
    "Convert text-based PDF files into editable Word DOCX documents with KaamKit.",
  keywords: [
    "pdf word",
    "pdf to docx",
    "pdf converter",
    "convert pdf",
    "pdf document",
    "pdf to word online",
  ],
  alternates: {
    canonical: "/tools/pdf-to-word",
  },
};

export default function PdfToWordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
