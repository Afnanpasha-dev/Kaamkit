"use client";

import React, { useState, useEffect } from "react";
import { Layers, AlertCircle, CheckCircle2 } from "lucide-react";
import { parsePageRangeString } from "@/lib/pdf/splitter";
import { Badge } from "@/components/ui/Badge";

interface PdfPageSelectorProps {
  totalPages: number;
  onValidSelectionChange: (selectedIndices: number[] | null) => void;
  disabled?: boolean;
}

export function PdfPageSelector({
  totalPages,
  onValidSelectionChange,
  disabled = false,
}: PdfPageSelectorProps) {
  const [rangeInput, setRangeInput] = useState(`1-${totalPages}`);
  const [parseResult, setParseResult] = useState(() =>
    parsePageRangeString(`1-${totalPages}`, totalPages)
  );

  useEffect(() => {
    const result = parsePageRangeString(rangeInput, totalPages);
    setParseResult(result);
    if (result.isValid) {
      onValidSelectionChange(result.pageIndices);
    } else {
      onValidSelectionChange(null);
    }
  }, [rangeInput, totalPages, onValidSelectionChange]);

  const handleSelectAll = () => setRangeInput(`1-${totalPages}`);
  const handleSelectFirst3 = () => setRangeInput(`1-${Math.min(3, totalPages)}`);

  const handleSelectOdd = () => {
    const odds: number[] = [];
    for (let i = 1; i <= totalPages; i += 2) odds.push(i);
    setRangeInput(odds.join(", "));
  };

  const handleSelectEven = () => {
    const evens: number[] = [];
    for (let i = 2; i <= totalPages; i += 2) evens.push(i);
    setRangeInput(evens.length > 0 ? evens.join(", ") : "1");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-accent" />
          Select Page Range
        </label>
        <Badge variant="outline" className="text-xs font-mono">
          Total: {totalPages} {totalPages === 1 ? "page" : "pages"}
        </Badge>
      </div>

      <div className="relative">
        <input
          type="text"
          value={rangeInput}
          onChange={(e) => setRangeInput(e.target.value)}
          disabled={disabled}
          placeholder="e.g. 1-3, 5, 8-10"
          className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Pages to extract"
        />
      </div>

      {/* Quick Selection Helper Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-muted-foreground mr-1">Quick Select:</span>
        <button
          type="button"
          onClick={handleSelectAll}
          disabled={disabled}
          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] font-medium text-slate-700 transition-colors"
        >
          All ({totalPages})
        </button>
        {totalPages >= 3 && (
          <button
            type="button"
            onClick={handleSelectFirst3}
            disabled={disabled}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] font-medium text-slate-700 transition-colors"
          >
            First 3
          </button>
        )}
        {totalPages >= 2 && (
          <>
            <button
              type="button"
              onClick={handleSelectOdd}
              disabled={disabled}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] font-medium text-slate-700 transition-colors"
            >
              Odd Pages
            </button>
            <button
              type="button"
              onClick={handleSelectEven}
              disabled={disabled}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] font-medium text-slate-700 transition-colors"
            >
              Even Pages
            </button>
          </>
        )}
      </div>

      {/* Feedback Message */}
      {parseResult.isValid ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 pt-1">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>
            Selected <strong>{parseResult.pageIndices.length}</strong>{" "}
            {parseResult.pageIndices.length === 1 ? "page" : "pages"}: (
            {parseResult.pageIndices.map((idx) => idx + 1).join(", ")})
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{parseResult.error}</span>
        </div>
      )}
    </div>
  );
}
