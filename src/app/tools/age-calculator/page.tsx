"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  RotateCcw,
  Sparkles,
  Clock,
  Cake,
  Heart,
  CalendarDays,
  Info,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import {
  AgeResult,
  calculateAge,
  formatLocalDateInput,
} from "@/lib/calculator/age";

export default function AgeCalculatorPage() {
  const todayStr = formatLocalDateInput(new Date());

  const [dob, setDob] = useState<string>("2000-01-01");
  const [calculateOn, setCalculateOn] = useState<string>(todayStr);

  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Record recent tool visit on mount
  useEffect(() => {
    recordRecentTool("age-calculator");
  }, []);

  const handleComputeAge = React.useCallback((birthDateStr: string, calcOnStr: string) => {
    setError(null);
    if (!birthDateStr) {
      setError("Please select a valid Date of Birth.");
      setResult(null);
      return;
    }
    if (!calcOnStr) {
      setError("Please select a valid Calculate-on Date.");
      setResult(null);
      return;
    }

    try {
      const res = calculateAge(birthDateStr, calcOnStr);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to calculate age.");
      setResult(null);
    }
  }, []);

  // Initial calculation on mount & when inputs change
  useEffect(() => {
    handleComputeAge(dob, calculateOn);
  }, [dob, calculateOn, handleComputeAge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleComputeAge(dob, calculateOn);
  };

  const handleReset = () => {
    const defaultDob = "2000-01-01";
    setDob(defaultDob);
    setCalculateOn(todayStr);
    handleComputeAge(defaultDob, todayStr);
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        <ToolHeader
          title="Age Calculator"
          description="Calculate your exact age in years, months, and days, total days lived, and countdown to your next birthday."
          icon={Calendar}
          categoryName="Utilities"
          categoryHref="/tools"
          toolSlug="age-calculator"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-5 bg-white border-border">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-accent" />
                  <span>Enter Dates</span>
                </h2>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date of Birth Input */}
                <div className="space-y-1.5">
                  <label htmlFor="dob" className="text-xs font-semibold text-foreground">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    value={dob}
                    max={todayStr}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    required
                  />
                </div>

                {/* Calculate Age On Input */}
                <div className="space-y-1.5">
                  <label htmlFor="calcOn" className="text-xs font-semibold text-foreground">
                    Calculate Age On (Target Date)
                  </label>
                  <input
                    id="calcOn"
                    type="date"
                    value={calculateOn}
                    onChange={(e) => setCalculateOn(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-semibold text-xs sm:text-sm mt-2"
                >
                  Calculate Exact Age
                </Button>
              </form>
            </Card>

            <div className="p-4 rounded-xl border border-border bg-slate-50/60 text-xs text-muted-foreground space-y-1.5">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Info className="h-4 w-4 text-accent" />
                Timezone Safe & Private
              </p>
              <p className="leading-relaxed">
                Calculations process locally in your browser based on midnight calendar dates. Your Date of Birth is never uploaded or saved to localStorage.
              </p>
            </div>
          </div>

          {/* Results Dashboard Column */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <div className="space-y-5">
                {/* Main Age Hero Card */}
                <Card className="p-6 bg-gradient-to-br from-accent/5 via-white to-white border-accent/20 text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Exact Age Output
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {result.years} <span className="text-base sm:text-lg font-medium text-muted-foreground">years</span>{" "}
                    {result.months} <span className="text-base sm:text-lg font-medium text-muted-foreground">months</span>{" "}
                    {result.days} <span className="text-base sm:text-lg font-medium text-muted-foreground">days</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calculated from birth date to {calculateOn}
                  </p>
                </Card>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Total Days */}
                  <Card className="p-4 space-y-1 bg-white border-border">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Clock className="h-4 w-4 text-accent" />
                      <span>Total Days</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {result.totalDays.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-muted-foreground">days</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Total calendar days between dates
                    </p>
                  </Card>

                  {/* Next Birthday */}
                  <Card className="p-4 space-y-1 bg-white border-border">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Cake className="h-4 w-4 text-amber-500" />
                      <span>Next Birthday</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {result.daysUntilNextBirthday === 0 ? (
                        <span className="text-emerald-600">Today! 🎉</span>
                      ) : (
                        `${result.daysUntilNextBirthday} days`
                      )}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {result.nextBirthdayDate.toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </Card>

                  {/* Day of Birth */}
                  <Card className="p-4 space-y-1 bg-white border-border">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>Day of Birth</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {result.dayOfWeekBorn}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Day of the week you were born
                    </p>
                  </Card>

                  {/* Total Months & Weeks */}
                  <Card className="p-4 space-y-1 bg-white border-border">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                      <span>Equivalent Duration</span>
                    </div>
                    <p className="text-base font-bold text-foreground">
                      {result.totalMonths} months
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      ≈ {result.totalWeeks.toLocaleString()} weeks or {result.totalHours.toLocaleString()} hours
                    </p>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center text-muted-foreground text-xs space-y-2 bg-slate-50/50 border-dashed border-border">
                <Calendar className="h-8 w-8 mx-auto text-muted-foreground/60" />
                <p>Select your Date of Birth and click &ldquo;Calculate Exact Age&rdquo;.</p>
              </Card>
            )}
          </div>
        </div>

        <RelatedTools currentSlug="age-calculator" />
      </Container>
    </div>
  );
}
