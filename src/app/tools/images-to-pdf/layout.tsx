import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Images to PDF Converter — Convert JPG & PNG to PDF | KaamKit",
  description:
    "Convert multiple images to a PDF online with page and layout controls. Process images directly in your browser with KaamKit.",
  keywords: [
    "images to pdf",
    "jpg to pdf",
    "png to pdf",
    "photo to pdf",
    "pictures to pdf",
    "convert images to pdf",
    "image compiler",
  ],
};

export default function ImagesToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
