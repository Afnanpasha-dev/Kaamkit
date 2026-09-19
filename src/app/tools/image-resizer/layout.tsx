import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Resizer — Resize Photo & Signature Dimensions",
  description:
    "Resize photo and signature dimensions in exact pixels for government exams, passport applications, and identity forms. 100% browser-side processing.",
  keywords: [
    "photo resizer for exam",
    "signature resize 140x60",
    "passport photo size 200x230",
    "SSC photo resizer",
    "UPSC signature resizer",
  ],
};

export default function ImageResizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
