import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word & Character Counter — Real-Time Text Utility",
  description:
    "Free, private word counter, character counter, sentence counter, and reading time estimator. All calculations run directly in your web browser.",
  keywords: [
    "word counter",
    "character counter",
    "reading time calculator",
    "UPSC essay word count",
    "text counter online India",
  ],
  alternates: {
    canonical: "/tools/word-character-counter",
  },
};

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
