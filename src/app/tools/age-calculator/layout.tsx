import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator — Calculate Your Exact Age | KaamKit",
  description:
    "Calculate your exact age in years, months, and days with KaamKit's free age calculator.",
  keywords: [
    "age",
    "age calculator",
    "calculate age",
    "birthday calculator",
    "exact age",
    "dob calculator",
    "how old am i",
  ],
  alternates: {
    canonical: "/tools/age-calculator",
  },
};

export default function AgeCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
