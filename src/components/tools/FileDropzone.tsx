"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeBytes?: number;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export function FileDropzone({
  onFileSelect,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeBytes = 25 * 1024 * 1024,
  errorMessage,
  onClearError,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (onClearError) onClearError();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onClearError) onClearError();
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const maxMb = Math.round(maxSizeBytes / (1024 * 1024));

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openPicker}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center select-none outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent ${
          isDragOver
            ? "border-accent bg-accent-subtle/50 scale-[1.01]"
            : "border-border bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-label="Upload an image"
        />

        <div className="h-14 w-14 rounded-2xl bg-white border border-border shadow-subtle flex items-center justify-center text-accent mb-4">
          <UploadCloud className="h-7 w-7" />
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-foreground">
          Choose an image or drag & drop here
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm">
          Supports JPG, PNG, and WebP photos up to {maxMb} MB
        </p>

        <Button
          type="button"
          variant="primary"
          size="sm"
          className="mt-5 text-xs pointer-events-none"
        >
          <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
          Select from Device
        </Button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-800">Upload Issue</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
