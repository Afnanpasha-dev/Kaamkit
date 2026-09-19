import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Files Online — Combine Documents Free",
  description:
    "Combine multiple PDF documents into a single organized file in seconds. Fast, private, and runs directly inside your web browser.",
  keywords: [
    "merge pdf free",
    "combine pdf files online",
    "join pdf documents",
    "merge pdf in browser India",
    "private pdf merger",
  ],
  alternates: {
    canonical: "/tools/merge-pdf",
  },
};

export default function MergePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
