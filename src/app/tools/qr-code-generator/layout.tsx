import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator — Free Online QR Tool | KaamKit",
  description:
    "Create downloadable QR codes for URLs, text, phone numbers, and email addresses with KaamKit.",
  keywords: [
    "qr",
    "qr code",
    "qr generator",
    "barcode",
    "url qr",
    "link qr",
    "text qr",
    "scan qr",
  ],
};

export default function QrCodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
