/**
 * EMI Calculator Core Engine
 * Standard reducing balance EMI formula:
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */

export interface EmiInput {
  principal: number;
  annualRate: number;
  tenureValue: number;
  tenureUnit: "years" | "months";
}

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
  totalMonths: number;
  principalPercent: number;
  interestPercent: number;
}

export interface EmiValidation {
  isValid: boolean;
  error?: string;
}

export const MAX_PRINCIPAL = 100_00_00_000; // ₹100 Crore
export const MAX_RATE = 100; // 100% per annum
export const MAX_TENURE_YEARS = 40;
export const MAX_TENURE_MONTHS = 480;

export function validateEmiInput(input: EmiInput): EmiValidation {
  const { principal, annualRate, tenureValue, tenureUnit } = input;

  if (isNaN(principal) || principal === null || principal === undefined) {
    return { isValid: false, error: "Please enter a valid loan amount." };
  }
  if (principal <= 0) {
    return { isValid: false, error: "Loan amount must be greater than ₹0." };
  }
  if (principal > MAX_PRINCIPAL) {
    return { isValid: false, error: "Loan amount exceeds maximum limit of ₹100 Crore." };
  }

  if (isNaN(annualRate) || annualRate === null || annualRate === undefined) {
    return { isValid: false, error: "Please enter a valid interest rate." };
  }
  if (annualRate < 0) {
    return { isValid: false, error: "Interest rate cannot be negative." };
  }
  if (annualRate > MAX_RATE) {
    return { isValid: false, error: "Interest rate cannot exceed 100% p.a." };
  }

  if (isNaN(tenureValue) || tenureValue === null || tenureValue === undefined) {
    return { isValid: false, error: "Please enter a valid loan tenure." };
  }
  if (tenureValue <= 0) {
    return { isValid: false, error: "Loan tenure must be greater than 0." };
  }

  const maxTenure = tenureUnit === "years" ? MAX_TENURE_YEARS : MAX_TENURE_MONTHS;
  if (tenureValue > maxTenure) {
    return {
      isValid: false,
      error: `Loan tenure cannot exceed ${maxTenure} ${tenureUnit}.`,
    };
  }

  return { isValid: true };
}

export function calculateEmi(input: EmiInput): EmiResult {
  const validation = validateEmiInput(input);
  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid EMI input parameters.");
  }

  const { principal, annualRate, tenureValue, tenureUnit } = input;
  const n = tenureUnit === "years" ? tenureValue * 12 : tenureValue;

  if (n <= 0) {
    throw new Error("Loan tenure must be at least 1 month.");
  }

  let monthlyEmi = 0;
  let totalInterest = 0;
  let totalPayment = 0;

  // Zero interest rate special case
  if (annualRate === 0) {
    monthlyEmi = principal / n;
    totalInterest = 0;
    totalPayment = principal;
  } else {
    const r = annualRate / 12 / 100;
    const factor = Math.pow(1 + r, n);
    monthlyEmi = (principal * r * factor) / (factor - 1);
    totalPayment = monthlyEmi * n;
    totalInterest = totalPayment - principal;
  }

  // Guard against invalid floating point artifacts
  if (!isFinite(monthlyEmi) || isNaN(monthlyEmi) || monthlyEmi < 0) {
    monthlyEmi = 0;
  }
  if (!isFinite(totalInterest) || isNaN(totalInterest) || totalInterest < 0) {
    totalInterest = 0;
  }
  if (!isFinite(totalPayment) || isNaN(totalPayment) || totalPayment < 0) {
    totalPayment = 0;
  }

  const principalPercent = totalPayment > 0 ? (principal / totalPayment) * 100 : 100;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return {
    monthlyEmi: Math.round(monthlyEmi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    principal: Math.round(principal * 100) / 100,
    totalMonths: n,
    principalPercent: Math.round(principalPercent * 10) / 10,
    interestPercent: Math.round(interestPercent * 10) / 10,
  };
}

/**
 * Format numbers as Indian Rupees (INR)
 */
export function formatINR(val: number, showDecimals = false): string {
  if (!isFinite(val) || isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(val);
}
