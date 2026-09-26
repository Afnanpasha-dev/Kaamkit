import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Calculator — Calculate Monthly Loan EMI | KaamKit",
  description:
    "Calculate your monthly loan EMI, total interest, and total repayment breakdown instantly with KaamKit's free browser-based EMI calculator.",
  keywords: [
    "emi",
    "emi calculator",
    "loan emi",
    "home loan emi",
    "car loan emi",
    "personal loan emi",
    "monthly installment",
    "interest calculator",
    "loan repayment",
  ],
  alternates: {
    canonical: "/tools/emi-calculator",
  },
};

export default function EmiCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
