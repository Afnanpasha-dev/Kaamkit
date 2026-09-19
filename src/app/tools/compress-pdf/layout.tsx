import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Online — Reduce File Size Privately",
  description:
    "Compress PDF documents directly in your browser. Streamline PDFs for online application portals with transparent optimization.",
  keywords: [
    "compress pdf online",
    "reduce pdf file size",
    "shrink pdf free",
    "compress pdf for government forms",
    "private pdf compressor India",
  ],
  alternates: {
    canonical: "/tools/compress-pdf",
  },
};

export default function CompressPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
