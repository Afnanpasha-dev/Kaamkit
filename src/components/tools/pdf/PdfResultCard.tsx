"use client";

import React from "react";
import { Download, RotateCcw, CheckCircle2, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatFileSize } from "@/lib/pdf/utils";

interface PdfResultCardProps {
  title: string;
  fileSize: number;
  pageCount?: number;
  savingsPercentage?: number;
  onDownload: () => void;
  onReset: () => void;
  downloadLabel?: string;
}

export function PdfResultCard({
  title,
  fileSize,
  pageCount,
  savingsPercentage,
  onDownload,
  onReset,
  downloadLabel = "Download PDF",
}: PdfResultCardProps) {
  return (
    <Card className="p-6 space-y-6 bg-white border-border/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground">{title}</p>
              <Badge variant="success" className="text-[10px] py-0">
                Ready
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{formatFileSize(fileSize)}</span>
              {pageCount !== undefined && (
                <>
                  <span>•</span>
                  <span>
                    {pageCount} {pageCount === 1 ? "page" : "pages"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {savingsPercentage !== undefined && savingsPercentage > 0 && (
          <Badge variant="success" className="text-xs font-bold py-1 px-3 self-start sm:self-auto">
            -{savingsPercentage}% reduced
          </Badge>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onDownload}
          className="w-full sm:flex-1 gap-2 font-semibold text-sm"
        >
          <Download className="h-4 w-4" />
          {downloadLabel}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onReset}
          className="w-full sm:w-auto text-xs"
        >
          <RotateCcw className="h-4 w-4 mr-1.5" />
          Start Over
        </Button>
      </div>
    </Card>
  );
}
