"use client";

import React from "react";
import { FileText, ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { PdfFileInfo } from "@/lib/pdf/types";
import { formatFileSize } from "@/lib/pdf/utils";
import { Button } from "@/components/ui/Button";

interface PdfFileListProps {
  files: PdfFileInfo[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
  onAddMore: () => void;
  disabled?: boolean;
}

export function PdfFileList({
  files,
  onMoveUp,
  onMoveDown,
  onRemove,
  onAddMore,
  disabled = false,
}: PdfFileListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Files to Merge ({files.length})
        </h3>
        <span className="text-xs text-muted-foreground">
          Reorder files using arrows to control final order
        </span>
      </div>

      <div className="space-y-2">
        {files.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-white shadow-subtle hover:border-slate-300 transition-colors"
          >
            {/* Order Badge & Info */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="h-7 w-7 rounded-lg bg-accent-subtle text-accent text-xs font-bold flex items-center justify-center shrink-0">
                #{index + 1}
              </span>

              <div className="min-w-0">
                <p
                  className="text-sm font-semibold text-foreground truncate"
                  title={item.name}
                >
                  {item.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span>{formatFileSize(item.size)}</span>
                  {item.pageCount !== undefined && (
                    <>
                      <span>•</span>
                      <span>
                        {item.pageCount} {item.pageCount === 1 ? "page" : "pages"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Reorder and Delete Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onMoveUp(index)}
                disabled={disabled || index === 0}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                aria-label={`Move ${item.name} up`}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onMoveDown(index)}
                disabled={disabled || index === files.length - 1}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                aria-label={`Move ${item.name} down`}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                disabled={disabled}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 ml-1"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddMore}
          disabled={disabled}
          className="w-full text-xs border-dashed gap-1.5 h-9"
        >
          <Plus className="h-3.5 w-3.5" />
          Add More PDF Files
        </Button>
      </div>
    </div>
  );
}
