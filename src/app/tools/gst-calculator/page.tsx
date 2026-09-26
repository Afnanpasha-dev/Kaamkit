"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Receipt,
  RotateCcw,
  Copy,
  Check,
  Percent,
  PlusCircle,
  MinusCircle,
  Info,
  AlertCircle,
  Building2,
  Globe2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import {
  calculateGst,
  formatGstINR,
  validateGstInput,
  GstMode,
  GstTaxType,
  GstResult,
  COMMON_GST_RATES,
  MAX_GST_AMOUNT,
  MAX_GST_RATE,
} from "@/lib/calculator/gst";

const AMOUNT_PRESETS = [
  { label: "₹1,000", value: 1000 },
  { label: "₹5,000", value: 5000 },
  { label: "₹10,000", value: 10000 },
  { label: "₹25,000", value: 25000 },
  { label: "₹50,000", value: 50000 },
  { label: "₹1 Lakh", value: 100000 },
];

export default function GstCalculatorPage() {
  const [mode, setMode] = useState<GstMode>("add");
  const [taxType, setTaxType] = useState<GstTaxType>("cgst_sgst");
  const [amount, setAmount] = useState<string>("10000");
  const [rate, setRate] = useState<string>("18");

  const [result, setResult] = useState<GstResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Record tool visit on mount
  useEffect(() => {
    recordRecentTool("gst-calculator");
  }, []);

  const handleCompute = useCallback(
    (amtStr: string, rateStr: string, currentMode: GstMode, currentTaxType: GstTaxType) => {
      setError(null);

      const parsedAmt = parseFloat(amtStr);
      const parsedRate = parseFloat(rateStr);

      const validation = validateGstInput({
        amount: parsedAmt,
        rate: parsedRate,
        mode: currentMode,
        taxType: currentTaxType,
      });

      if (!validation.isValid) {
        setError(validation.error || "Please check your inputs.");
        setResult(null);
        return;
      }

      try {
        const res = calculateGst({
          amount: parsedAmt,
          rate: parsedRate,
          mode: currentMode,
          taxType: currentTaxType,
        });
        setResult(res);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to calculate GST.";
        setError(message);
        setResult(null);
      }
    },
    []
  );

  // Real-time calculation on input change
  useEffect(() => {
    handleCompute(amount, rate, mode, taxType);
  }, [amount, rate, mode, taxType, handleCompute]);

  const handleReset = () => {
    setMode("add");
    setTaxType("cgst_sgst");
    setAmount("10000");
    setRate("18");
    setError(null);
  };

  const handleCopySummary = async () => {
    if (!result) return;
    const summaryLines = [
      `KaamKit GST Calculation Summary:`,
      `• Mode: ${result.mode === "add" ? "Add GST (Exclusive to Inclusive)" : "Remove GST (Inclusive to Exclusive)"}`,
      `• GST Rate: ${result.rate}%`,
      `• Original / Base Amount: ${formatGstINR(result.baseAmount)}`,
      `• Total GST Amount: ${formatGstINR(result.gstAmount)}`,
    ];

    if (result.taxType === "cgst_sgst") {
      summaryLines.push(
        `• CGST (${result.rate / 2}%): ${formatGstINR(result.cgst)}`,
        `• SGST (${result.rate / 2}%): ${formatGstINR(result.sgst)}`
      );
    } else {
      summaryLines.push(`• IGST (${result.rate}%): ${formatGstINR(result.igst)}`);
    }

    summaryLines.push(`• Final Amount: ${formatGstINR(result.finalAmount)}`);

    try {
      await navigator.clipboard.writeText(summaryLines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const parsedAmount = useMemo(() => {
    const num = parseFloat(amount);
    return isFinite(num) && num > 0 ? num : 0;
  }, [amount]);

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        <ToolHeader
          title="GST Calculator"
          description="Calculate GST amounts, final prices, and CGST/SGST or IGST breakdowns."
          icon={Receipt}
          categoryName="Utilities"
          categoryHref="/tools"
          toolSlug="gst-calculator"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Column */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-5 sm:p-6 space-y-6 bg-white border-border shadow-subtle">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-accent" />
                  <span>GST Configuration</span>
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

              {/* 1. Mode Selector: Add GST vs Remove GST */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-foreground block">
                  Calculation Mode
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 border border-border">
                  <button
                    type="button"
                    onClick={() => setMode("add")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      mode === "add"
                        ? "bg-white text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <PlusCircle className="h-4 w-4 text-emerald-600" />
                    <span>Add GST</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("remove")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      mode === "remove"
                        ? "bg-white text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MinusCircle className="h-4 w-4 text-indigo-600" />
                    <span>Remove GST</span>
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {mode === "add"
                    ? "Enter base price (excluding GST) to calculate GST and total price."
                    : "Enter gross invoice price (including GST) to find base price and GST deducted."}
                </p>
              </div>

              {/* 2. Amount Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="amount" className="text-xs sm:text-sm font-semibold text-foreground">
                    {mode === "add" ? "Base Amount (Excl. GST)" : "Total Amount (Incl. GST)"}
                  </label>
                  {parsedAmount > 0 && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatGstINR(parsedAmount)}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground font-semibold text-sm">
                    ₹
                  </div>
                  <input
                    id="amount"
                    type="number"
                    min="1"
                    max={MAX_GST_AMOUNT}
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full h-11 pl-9 pr-4 text-base text-slate-900 bg-white border border-border rounded-xl focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {AMOUNT_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setAmount(preset.value.toString())}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        amount === preset.value.toString()
                          ? "bg-accent-subtle text-accent border-accent/30 font-semibold"
                          : "bg-slate-50 text-muted-foreground border-border hover:border-slate-300 hover:text-foreground"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. GST Rate Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="rate" className="text-xs sm:text-sm font-semibold text-foreground">
                    GST Rate (%)
                  </label>
                  <span className="text-xs text-muted-foreground">Applicable slab</span>
                </div>

                {/* Common Presets */}
                <div className="grid grid-cols-5 gap-1.5">
                  {COMMON_GST_RATES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRate(r.toString())}
                      className={`text-xs py-1.5 rounded-lg border font-semibold transition-colors text-center ${
                        rate === r.toString()
                          ? "bg-accent text-white border-accent shadow-xs"
                          : "bg-slate-50 text-muted-foreground border-border hover:border-slate-300 hover:text-foreground"
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>

                {/* Custom rate input */}
                <div className="relative pt-1">
                  <input
                    id="rate"
                    type="number"
                    min="0"
                    max={MAX_GST_RATE}
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="Custom rate, e.g. 18"
                    className="w-full h-11 pl-4 pr-9 text-base text-slate-900 bg-white border border-border rounded-xl focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground font-semibold text-sm">
                    %
                  </div>
                </div>
              </div>

              {/* 4. Tax Type: CGST + SGST vs IGST */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-foreground block">
                  Tax Breakdown Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 border border-border">
                  <button
                    type="button"
                    onClick={() => setTaxType("cgst_sgst")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      taxType === "cgst_sgst"
                        ? "bg-white text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5 text-accent" />
                    <span>CGST + SGST</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxType("igst")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      taxType === "igst"
                        ? "bg-white text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Globe2 className="h-3.5 w-3.5 text-indigo-600" />
                    <span>IGST</span>
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {taxType === "cgst_sgst"
                    ? "Intra-state (same state transaction): split equally between Central and State."
                    : "Inter-state (different states transaction): Integrated GST collected as a single tax."}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Disclaimer Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-border text-[11px] text-muted-foreground flex items-start gap-2 leading-relaxed">
                <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>
                  Enter the GST rate applicable to your product or service. This calculator performs standard mathematical calculations based on the rate entered and does not constitute legal or tax advice.
                </span>
              </div>
            </Card>
          </div>

          {/* Outputs Column */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <div className="space-y-6">
                {/* Primary Result Card */}
                <Card className="p-6 sm:p-8 bg-gradient-to-br from-indigo-700 to-blue-800 text-white rounded-2xl shadow-subtle border-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                        {result.mode === "add" ? "Total Gross Amount (Incl. GST)" : "Net Base Amount (Excl. GST)"}
                      </span>
                      <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                        {formatGstINR(result.mode === "add" ? result.finalAmount : result.baseAmount)}
                      </div>
                      <p className="text-xs text-indigo-200/90 mt-1.5">
                        {result.mode === "add"
                          ? `Includes ${formatGstINR(result.gstAmount)} GST (${result.rate}%)`
                          : `Original amount before adding ${result.rate}% GST`}
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

                {/* Secondary Cards: Base & GST */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="p-5 bg-white border-border shadow-subtle">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Base / Net Amount
                    </span>
                    <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                      {formatGstINR(result.baseAmount)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                      <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
                      <span>Original price excluding tax</span>
                    </div>
                  </Card>

                  <Card className="p-5 bg-white border-border shadow-subtle">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Total GST ({result.rate}%)
                    </span>
                    <div className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1">
                      {formatGstINR(result.gstAmount)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Tax payable on transaction</span>
                    </div>
                  </Card>
                </div>

                {/* Tax Breakdown Breakdown Card */}
                <Card className="p-5 sm:p-6 bg-white border-border shadow-subtle space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="text-sm font-bold text-foreground">Tax Split & Invoice Summary</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {result.taxType === "cgst_sgst" ? "Intra-state (CGST + SGST)" : "Inter-state (IGST)"}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    {/* Base Row */}
                    <div className="flex items-center justify-between py-1.5 text-muted-foreground">
                      <span>Base / Net Amount</span>
                      <span className="font-semibold text-foreground">{formatGstINR(result.baseAmount)}</span>
                    </div>

                    {/* Tax Breakdown Rows */}
                    {result.taxType === "cgst_sgst" ? (
                      <>
                        <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span>CGST ({result.rate / 2}%)</span>
                          </span>
                          <span className="font-bold text-foreground">{formatGstINR(result.cgst)}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>SGST ({result.rate / 2}%)</span>
                          </span>
                          <span className="font-bold text-foreground">{formatGstINR(result.sgst)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                          <span>IGST ({result.rate}%)</span>
                        </span>
                        <span className="font-bold text-foreground">{formatGstINR(result.igst)}</span>
                      </div>
                    )}

                    {/* Total GST Row */}
                    <div className="flex items-center justify-between py-1.5 text-indigo-700 font-semibold border-t border-slate-100 pt-2">
                      <span>Total GST Amount</span>
                      <span>+{formatGstINR(result.gstAmount)}</span>
                    </div>

                    {/* Final Gross Row */}
                    <div className="flex items-center justify-between py-2 text-sm sm:text-base font-bold text-foreground border-t border-border pt-2.5">
                      <span>Final Invoice Amount</span>
                      <span className="text-indigo-700">{formatGstINR(result.finalAmount)}</span>
                    </div>
                  </div>
                </Card>

                {/* Mathematical Formula Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-border text-xs text-muted-foreground space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Info className="h-3.5 w-3.5 text-accent" />
                    <span>Calculation Formulas</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] leading-relaxed">
                    {result.mode === "add" ? (
                      <>
                        <p>GST Amount = Base Amount × (GST Rate ÷ 100)</p>
                        <p>Final Amount = Base Amount + GST Amount</p>
                      </>
                    ) : (
                      <>
                        <p>Base Amount = Inclusive Amount ÷ (1 + GST Rate ÷ 100)</p>
                        <p>GST Amount = Inclusive Amount − Base Amount</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center bg-white border-dashed border-border flex flex-col items-center justify-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground">
                  <Receipt className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Enter an amount to calculate GST</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Choose Add or Remove GST, specify your amount, and select an applicable GST rate to view the detailed tax breakdown.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Frequently Used Together */}
        <RelatedTools currentSlug="gst-calculator" />
      </Container>
    </div>
  );
}
