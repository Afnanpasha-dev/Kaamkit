import React from "react";
import Image from "next/image";
import { RefreshCw, FileText } from "lucide-react";
import { formatFileSize } from "@/lib/image/utils";
import { ImageDimensions } from "@/lib/image/types";
import { Button } from "@/components/ui/Button";

interface ImageFileInfoProps {
  fileName: string;
  fileSize: number;
  dimensions?: ImageDimensions;
  previewUrl: string;
  onReset: () => void;
  disabled?: boolean;
}

export function ImageFileInfo({
  fileName,
  fileSize,
  dimensions,
  previewUrl,
  onReset,
  disabled = false,
}: ImageFileInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-white shadow-subtle">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative h-14 w-14 rounded-lg border border-border overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={previewUrl}
            alt={fileName}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate" title={fileName}>
            {fileName}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>{formatFileSize(fileSize)}</span>
            {dimensions && (
              <>
                <span>•</span>
                <span>
                  {dimensions.width} × {dimensions.height} px
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        disabled={disabled}
        className="self-start sm:self-auto text-xs shrink-0"
      >
        <RefreshCw className="h-3 w-3 mr-1.5" />
        Change Image
      </Button>
    </div>
  );
}
