/**
 * GST Calculator Core Engine
 * Supports Add GST (Exclusive to Inclusive) and Remove GST (Inclusive to Exclusive)
 * with CGST + SGST (Intra-state) and IGST (Inter-state) splits.
 */

export type GstMode = "add" | "remove";
export type GstTaxType = "cgst_sgst" | "igst";

export interface GstInput {
  amount: number;
  rate: number;
  mode: GstMode;
  taxType: GstTaxType;
}

export interface GstResult {
  mode: GstMode;
  taxType: GstTaxType;
  rate: number;
  baseAmount: number;
  gstAmount: number;
  finalAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export interface GstValidation {
  isValid: boolean;
  error?: string;
}

export const MAX_GST_AMOUNT = 100_00_00_000; // ₹100 Crore
export const MAX_GST_RATE = 100; // 100%
export const COMMON_GST_RATES = [0, 5, 12, 18, 28];

export function validateGstInput(input: GstInput): GstValidation {
  const { amount, rate } = input;

  if (isNaN(amount) || amount === null || amount === undefined) {
    return { isValid: false, error: "Please enter a valid amount." };
  }
  if (amount <= 0) {
    return { isValid: false, error: "Amount must be greater than ₹0." };
  }
  if (amount > MAX_GST_AMOUNT) {
    return { isValid: false, error: "Amount exceeds maximum limit of ₹100 Crore." };
  }

  if (isNaN(rate) || rate === null || rate === undefined) {
    return { isValid: false, error: "Please enter a valid GST rate." };
  }
  if (rate < 0) {
    return { isValid: false, error: "GST rate cannot be negative." };
  }
  if (rate > MAX_GST_RATE) {
    return { isValid: false, error: "GST rate cannot exceed 100%." };
  }

  return { isValid: true };
}

export function calculateGst(input: GstInput): GstResult {
  const validation = validateGstInput(input);
  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid GST input parameters.");
  }

  const { amount, rate, mode, taxType } = input;

  let baseAmount = 0;
  let gstAmount = 0;
  let finalAmount = 0;

  if (mode === "add") {
    // Adding GST to base net amount
    baseAmount = amount;
    gstAmount = (amount * rate) / 100;
    finalAmount = baseAmount + gstAmount;
  } else {
    // Removing GST from gross inclusive amount
    finalAmount = amount;
    if (rate === 0) {
      baseAmount = amount;
      gstAmount = 0;
    } else {
      baseAmount = amount / (1 + rate / 100);
      gstAmount = amount - baseAmount;
    }
  }

  // Guard against invalid floating point artifacts
  if (!isFinite(baseAmount) || isNaN(baseAmount) || baseAmount < 0) baseAmount = 0;
  if (!isFinite(gstAmount) || isNaN(gstAmount) || gstAmount < 0) gstAmount = 0;
  if (!isFinite(finalAmount) || isNaN(finalAmount) || finalAmount < 0) finalAmount = 0;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (taxType === "cgst_sgst") {
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
    igst = 0;
  } else {
    cgst = 0;
    sgst = 0;
    igst = gstAmount;
  }

  return {
    mode,
    taxType,
    rate,
    baseAmount: Math.round(baseAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    finalAmount: Math.round(finalAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
  };
}

/**
 * Format numbers as Indian Rupees (INR) with standard 2 decimal precision
 */
export function formatGstINR(val: number): string {
  if (!isFinite(val) || isNaN(val)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}
