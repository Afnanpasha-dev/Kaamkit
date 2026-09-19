import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF Pages Online — Extract Specific Pages",
  description:
    "Extract specific pages or page ranges from a PDF document in your browser. Simple, private, and fast.",
  keywords: [
    "split pdf online",
    "extract pages from pdf",
    "cut pdf document",
    "split pdf range free",
    "private pdf splitter India",
  ],
};

export default function SplitPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
