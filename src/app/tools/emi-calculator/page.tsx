"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calculator,
  RotateCcw,
  Copy,
  Check,
  Percent,
  Banknote,
  Calendar,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import {
  calculateEmi,
  formatINR,
  validateEmiInput,
  EmiResult,
  MAX_PRINCIPAL,
  MAX_RATE,
} from "@/lib/calculator/emi";

const LOAN_PRESETS = [
  { label: "₹1 Lakh", value: 100000 },
  { label: "₹5 Lakh", value: 500000 },
  { label: "₹10 Lakh", value: 1000000 },
  { label: "₹25 Lakh", value: 2500000 },
  { label: "₹50 Lakh", value: 5000000 },
];

const RATE_PRESETS = [7.5, 8.5, 9.5, 10.5, 12];

const TENURE_YEAR_PRESETS = [1, 3, 5, 10, 15, 20];
const TENURE_MONTH_PRESETS = [6, 12, 24, 36, 60, 120];

export default function EmiCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState<string>("500000");
  const [interestRate, setInterestRate] = useState<string>("8.5");
  const [tenureValue, setTenureValue] = useState<string>("5");
  const [tenureUnit, setTenureUnit] = useState<"years" | "months">("years");

  const [result, setResult] = useState<EmiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Record tool visit on mount
  useEffect(() => {
    recordRecentTool("emi-calculator");
  }, []);

  const handleCompute = useCallback(
    (principalStr: string, rateStr: string, tenureStr: string, unit: "years" | "months") => {
      setError(null);

      const p = parseFloat(principalStr);
      const r = parseFloat(rateStr);
      const t = parseFloat(tenureStr);

      const validation = validateEmiInput({
        principal: p,
        annualRate: r,
        tenureValue: t,
        tenureUnit: unit,
      });

      if (!validation.isValid) {
        setError(validation.error || "Please check your inputs.");
        setResult(null);
        return;
      }

      try {
        const res = calculateEmi({
          principal: p,
          annualRate: r,
          tenureValue: t,
          tenureUnit: unit,
        });
        setResult(res);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to calculate EMI.";
        setError(message);
        setResult(null);
      }
    },
    []
  );

  // Real-time calculation on input change
  useEffect(() => {
    handleCompute(loanAmount, interestRate, tenureValue, tenureUnit);
  }, [loanAmount, interestRate, tenureValue, tenureUnit, handleCompute]);

  const handleReset = () => {
    setLoanAmount("500000");
    setInterestRate("8.5");
    setTenureValue("5");
    setTenureUnit("years");
    setError(null);
  };

  const handleCopySummary = async () => {
    if (!result) return;
    const summary = [
      `KaamKit EMI Calculation Summary:`,
      `• Loan Amount: ${formatINR(result.principal)}`,
      `• Interest Rate: ${interestRate}% p.a.`,
      `• Loan Tenure: ${tenureValue} ${tenureUnit} (${result.totalMonths} months)`,
      `• Monthly EMI: ${formatINR(result.monthlyEmi, true)}`,
      `• Total Interest Payable: ${formatINR(result.totalInterest, true)}`,
      `• Total Repayment Amount: ${formatINR(result.totalPayment, true)}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const parsedPrincipal = useMemo(() => {
    const num = parseFloat(loanAmount);
    return isFinite(num) && num > 0 ? num : 0;
  }, [loanAmount]);

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        <ToolHeader
          title="EMI Calculator"
          description="Calculate monthly loan EMI, total interest, and total repayment."
          icon={Calculator}
          categoryName="Utilities"
          categoryHref="/tools"
          toolSlug="emi-calculator"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Column */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-5 sm:p-6 space-y-6 bg-white border-border shadow-subtle">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-accent" />
                  <span>Loan Details</span>
                </h2>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-muted-foreground hover:text-accent flex items-center gap-1.5 transition-colors focus-visible:outline-none"
                  title="Reset to default values"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 1. Loan Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="loanAmount" className="text-xs sm:text-sm font-semibold text-foreground">
                    Loan Amount
                  </label>
                  {parsedPrincipal > 0 && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatINR(parsedPrincipal)}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground font-semibold text-sm">
                    ₹
                  </div>
                  <input
                    id="loanAmount"
                    type="number"
                    min="1"
                    max={MAX_PRINCIPAL}
                    step="1000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full h-11 pl-9 pr-4 text-base text-slate-900 bg-white border border-border rounded-xl focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {LOAN_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setLoanAmount(preset.value.toString())}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        loanAmount === preset.value.toString()
                          ? "bg-accent-subtle text-accent border-accent/30 font-semibold"
                          : "bg-slate-50 text-muted-foreground border-border hover:border-slate-300 hover:text-foreground"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Interest Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="interestRate" className="text-xs sm:text-sm font-semibold text-foreground">
                    Interest Rate (% p.a.)
                  </label>
                  <span className="text-xs text-muted-foreground">Annual</span>
                </div>
                <div className="relative">
                  <input
                    id="interestRate"
                    type="number"
                    min="0"
                    max={MAX_RATE}
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="e.g. 8.5"
                    className="w-full h-11 pl-4 pr-9 text-base text-slate-900 bg-white border border-border rounded-xl focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground font-semibold text-sm">
                    %
                  </div>
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {RATE_PRESETS.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setInterestRate(rate.toString())}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        interestRate === rate.toString()
                          ? "bg-accent-subtle text-accent border-accent/30 font-semibold"
                          : "bg-slate-50 text-muted-foreground border-border hover:border-slate-300 hover:text-foreground"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Loan Tenure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="tenureValue" className="text-xs sm:text-sm font-semibold text-foreground">
                    Loan Tenure
                  </label>
                  {/* Years / Months toggle */}
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-border">
                    <button
                      type="button"
                      onClick={() => {
                        if (tenureUnit !== "years") {
                          const val = parseFloat(tenureValue);
                          const converted = isFinite(val) && val > 0 ? Math.round(val / 12) || 1 : 5;
                          setTenureValue(converted.toString());
                          setTenureUnit("years");
                        }
                      }}
                      className={`text-xs px-2.5 py-0.5 rounded-md font-medium transition-all ${
                        tenureUnit === "years"
                          ? "bg-white text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Years
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (tenureUnit !== "months") {
                          const val = parseFloat(tenureValue);
                          const converted = isFinite(val) && val > 0 ? val * 12 : 60;
                          setTenureValue(converted.toString());
                          setTenureUnit("months");
                        }
                      }}
                      className={`text-xs px-2.5 py-0.5 rounded-md font-medium transition-all ${
                        tenureUnit === "months"
                          ? "bg-white text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Months
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    id="tenureValue"
                    type="number"
                    min="1"
                    max={tenureUnit === "years" ? 40 : 480}
                    step="1"
                    value={tenureValue}
                    onChange={(e) => setTenureValue(e.target.value)}
                    placeholder={tenureUnit === "years" ? "e.g. 5" : "e.g. 60"}
                    className="w-full h-11 pl-4 pr-16 text-base text-slate-900 bg-white border border-border rounded-xl focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground text-xs font-semibold uppercase">
                    {tenureUnit}
                  </div>
                </div>

                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(tenureUnit === "years" ? TENURE_YEAR_PRESETS : TENURE_MONTH_PRESETS).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTenureValue(preset.toString())}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        tenureValue === preset.toString()
                          ? "bg-accent-subtle text-accent border-accent/30 font-semibold"
                          : "bg-slate-50 text-muted-foreground border-border hover:border-slate-300 hover:text-foreground"
                      }`}
                    >
                      {preset} {tenureUnit === "years" ? "Yr" : "Mo"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </Card>
          </div>

          {/* Outputs Column */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <div className="space-y-6">
                {/* Primary Card: Monthly EMI */}
                <Card className="p-6 sm:p-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-subtle border-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                        Monthly EMI Amount
                      </span>
                      <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                        {formatINR(result.monthlyEmi, true)}
                      </div>
                      <p className="text-xs text-emerald-100/90 mt-1.5">
                        Payable every month for {result.totalMonths} installments
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-semibold backdrop-blur transition-colors self-start sm:self-center"
                      title="Copy calculation summary"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                      <span>{copied ? "Copied!" : "Copy Summary"}</span>
                    </button>
                  </div>
                </Card>

                {/* Secondary Output Grid: Total Interest & Total Payable */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="p-5 bg-white border-border shadow-subtle">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Total Interest
                    </span>
                    <div className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                      {formatINR(result.totalInterest, true)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                      <span>{result.interestPercent}% of total payment</span>
                    </div>
                  </Card>

                  <Card className="p-5 bg-white border-border shadow-subtle">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Total Amount Payable
                    </span>
                    <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                      {formatINR(result.totalPayment, true)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
                      <span>Principal + Total Interest</span>
                    </div>
                  </Card>
                </div>

                {/* Repayment Breakdown Bar */}
                <Card className="p-5 sm:p-6 bg-white border-border shadow-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">Repayment Breakdown</h3>
                    <span className="text-xs text-muted-foreground">
                      Principal vs. Interest
                    </span>
                  </div>

                  {/* Two-tone percentage bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      style={{ width: `${result.principalPercent}%` }}
                      className="bg-emerald-600 h-full transition-all duration-300"
                      title={`Principal: ${result.principalPercent}%`}
                    />
                    <div
                      style={{ width: `${result.interestPercent}%` }}
                      className="bg-amber-500 h-full transition-all duration-300"
                      title={`Interest: ${result.interestPercent}%`}
                    />
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                        <span className="text-muted-foreground font-medium">Principal Amount</span>
                      </div>
                      <div className="font-bold text-foreground">
                        {formatINR(result.principal)}
                        <span className="text-muted-foreground font-normal ml-1">
                          ({result.principalPercent}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-muted-foreground font-medium">Total Interest</span>
                      </div>
                      <div className="font-bold text-foreground">
                        {formatINR(result.totalInterest)}
                        <span className="text-muted-foreground font-normal ml-1">
                          ({result.interestPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Formula Explanation Note */}
                <div className="p-4 rounded-xl bg-slate-50 border border-border text-xs text-muted-foreground space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <HelpCircle className="h-3.5 w-3.5 text-accent" />
                    <span>How is EMI calculated?</span>
                  </div>
                  <p className="leading-relaxed">
                    KaamKit uses the standard reducing balance method:{" "}
                    <code className="text-[11px] font-mono bg-white px-1.5 py-0.5 rounded border border-border">
                      EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ − 1]
                    </code>
                    , where <strong>P</strong> is loan principal, <strong>r</strong> is monthly interest rate, and <strong>n</strong> is tenure in months.
                  </p>
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center bg-white border-dashed border-border flex flex-col items-center justify-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground">
                  <Calculator className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Enter loan details to view EMI</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Specify your principal amount, annual interest rate, and tenure on the left to view monthly installments and interest breakdown.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Frequently Used Together */}
        <RelatedTools currentSlug="emi-calculator" />
      </Container>
    </div>
  );
}
