import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor — Reduce Photo Size in KB & MB",
  description:
    "Free, private browser-side image compressor. Shrink JPG, PNG, and WebP file sizes for Indian exam portals, job forms, and documents without uploading files to any server.",
  keywords: [
    "compress image 50 kb",
    "photo compressor for SSC",
    "UPSC photo compression",
    "reduce image file size online",
    "free image compressor India",
  ],
  alternates: {
    canonical: "/tools/image-compressor",
  },
};

export default function ImageCompressorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
