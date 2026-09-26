import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GST Calculator — Calculate GST Amounts, CGST, SGST & IGST | KaamKit",
  description:
    "Calculate GST amounts, final prices, and CGST/SGST or IGST tax breakdowns instantly with KaamKit's free browser-based GST calculator.",
  keywords: [
    "gst",
    "gst calculator",
    "calculate gst",
    "add gst",
    "remove gst",
    "cgst",
    "sgst",
    "igst",
    "tax calculator",
    "goods and services tax",
    "invoice tax",
  ],
  alternates: {
    canonical: "/tools/gst-calculator",
  },
};

export default function GstCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
