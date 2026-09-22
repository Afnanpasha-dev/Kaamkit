"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Crop,
  Download,
  RotateCcw,
  Lock,
  Unlock,
  Sparkles,
  Info,
  Maximize2,
  AlertCircle,
  FileImage,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ImageFileInfo } from "@/components/tools/ImageFileInfo";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import {
  validateImageFile,
} from "@/lib/image/validator";
import {
  resizeImage,
  MIN_DIMENSION_PIXELS,
  MAX_DIMENSION_PIXELS,
} from "@/lib/image/resizer";
import {
  formatFileSize,
  createSafeUrl,
  revokeSafeUrl,
  getSanitizedFilename,
  downloadBlob,
} from "@/lib/image/utils";
import {
  ResizeResult,
  ImageDimensions,
  SupportedImageMimeType,
} from "@/lib/image/types";

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Resize Form State
  const [targetWidth, setTargetWidth] = useState<string>("");
  const [targetHeight, setTargetHeight] = useState<string>("");
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<SupportedImageMimeType | "auto">("auto");
  const [isProcessing, setIsProcessing] = useState(false);

  // Result
  const [result, setResult] = useState<ResizeResult | null>(null);
  const activeResultUrlRef = useRef<string | null>(null);

  // Record recent tool visit on mount
  useEffect(() => {
    recordRecentTool("image-resizer");
  }, []);

  // Clean up object URLs on unmount or file reset
  useEffect(() => {
    return () => {
      revokeSafeUrl(originalUrl);
      revokeSafeUrl(activeResultUrlRef.current);
    };
  }, [originalUrl]);

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    revokeSafeUrl(originalUrl);
    revokeSafeUrl(activeResultUrlRef.current);
    setResult(null);

    const validation = await validateImageFile(selectedFile);
    if (!validation.isValid || !validation.dimensions) {
      setError(validation.error || "Selected file could not be processed.");
      setFile(null);
      setOriginalUrl(null);
      return;
    }

    const preview = createSafeUrl(selectedFile);
    setFile(selectedFile);
    setOriginalUrl(preview);
    setOriginalDimensions(validation.dimensions);
    setTargetWidth(validation.dimensions.width.toString());
    setTargetHeight(validation.dimensions.height.toString());
  };

  const handleWidthChange = (val: string) => {
    setTargetWidth(val);
    const num = parseInt(val, 10);
    if (isAspectRatioLocked && originalDimensions && !isNaN(num) && num > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setTargetHeight(Math.round(num * ratio).toString());
    }
  };

  const handleHeightChange = (val: string) => {
    setTargetHeight(val);
    const num = parseInt(val, 10);
    if (isAspectRatioLocked && originalDimensions && !isNaN(num) && num > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setTargetWidth(Math.round(num * ratio).toString());
    }
  };

  // Percentage scaling helper
  const handleScalePercent = (percent: number) => {
    if (!originalDimensions) return;
    const w = Math.round((originalDimensions.width * percent) / 100);
    const h = Math.round((originalDimensions.height * percent) / 100);
    setTargetWidth(w.toString());
    setTargetHeight(h.toString());
  };

  // Common preset helper (Indian Exam / Document Presets)
  const handlePresetSelect = (w: number, h: number) => {
    setIsAspectRatioLocked(false);
    setTargetWidth(w.toString());
    setTargetHeight(h.toString());
  };

  const handlePerformResize = async () => {
    if (!file || !originalDimensions) return;

    const widthNum = parseInt(targetWidth, 10);
    const heightNum = parseInt(targetHeight, 10);

    if (isNaN(widthNum) || isNaN(heightNum)) {
      setError("Please enter valid numerical dimensions for width and height.");
      return;
    }

    if (
      widthNum < MIN_DIMENSION_PIXELS ||
      heightNum < MIN_DIMENSION_PIXELS ||
      widthNum > MAX_DIMENSION_PIXELS ||
      heightNum > MAX_DIMENSION_PIXELS
    ) {
      setError(
        `Dimensions must be between ${MIN_DIMENSION_PIXELS}px and ${MAX_DIMENSION_PIXELS}px.`
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const resizeResult = await resizeImage(file, {
        width: widthNum,
        height: heightNum,
        format: outputFormat,
      });

      if (activeResultUrlRef.current) {
        revokeSafeUrl(activeResultUrlRef.current);
      }
      activeResultUrlRef.current = resizeResult.url;
      setResult(resizeResult);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "That image couldn't be resized. Try another image or smaller dimensions.";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const downloadFilename = getSanitizedFilename(
      file.name,
      `resized-${result.newDimensions.width}x${result.newDimensions.height}`,
      result.format
    );
    downloadBlob(result.blob, downloadFilename);
  };

  const handleReset = () => {
    revokeSafeUrl(originalUrl);
    revokeSafeUrl(activeResultUrlRef.current);
    activeResultUrlRef.current = null;
    setFile(null);
    setOriginalUrl(null);
    setOriginalDimensions(null);
    setTargetWidth("");
    setTargetHeight("");
    setIsAspectRatioLocked(true);
    setResult(null);
    setError(null);
    setOutputFormat("auto");
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        {/* Tool Header */}
        <ToolHeader
          title="Image Resizer"
          description="Resize photo dimensions in exact pixels for job portals, government exams, and identity cards."
          icon={Crop}
          categoryName="Image Tools"
          categoryHref="/tools"
          toolSlug="image-resizer"
        />

        {/* Step 1: Dropzone */}
        {!file && (
          <div className="max-w-2xl mx-auto space-y-6">
            <FileDropzone
              onFileSelect={handleFileSelect}
              errorMessage={error}
              onClearError={() => setError(null)}
            />

            {/* Explanatory Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground pt-4">
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Exact Dimensions</p>
                <p>Set custom width and height in pixels with optional aspect ratio locking.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Common Presets</p>
                <p>Quick sizing for standard exam passport photos and official signatures.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Private & Local</p>
                <p>All pixel resampling is computed in your browser. No files travel over the network.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Controls & Resize Form */}
        {file && originalUrl && originalDimensions && (
          <div className="space-y-6">
            {/* Image Metadata Bar */}
            <ImageFileInfo
              fileName={file.name}
              fileSize={file.size}
              dimensions={originalDimensions}
              previewUrl={originalUrl}
              onReset={handleReset}
              disabled={isProcessing}
            />

            {/* Error Message if any */}
            {error && (
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Resize Form & Presets */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-5 space-y-5 bg-white border-border/90">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Maximize2 className="h-4 w-4 text-accent shrink-0" />
                      Target Dimensions
                    </h2>
                    <Badge variant="outline" className="text-xs font-mono shrink-0">
                      Original: {originalDimensions.width}×{originalDimensions.height}
                    </Badge>
                  </div>

                  {/* Width & Height Inputs with Aspect Ratio Lock */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 items-end">
                      {/* Width Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">
                          Width (pixels)
                        </label>
                        <input
                          type="number"
                          min={MIN_DIMENSION_PIXELS}
                          max={MAX_DIMENSION_PIXELS}
                          value={targetWidth}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          disabled={isProcessing}
                          className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          placeholder="e.g. 200"
                        />
                      </div>

                      {/* Height Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">
                          Height (pixels)
                        </label>
                        <input
                          type="number"
                          min={MIN_DIMENSION_PIXELS}
                          max={MAX_DIMENSION_PIXELS}
                          value={targetHeight}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          disabled={isProcessing}
                          className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          placeholder="e.g. 230"
                        />
                      </div>
                    </div>

                    {/* Aspect Ratio Lock Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsAspectRatioLocked(!isAspectRatioLocked)}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground font-medium py-1 focus-visible:outline-none"
                    >
                      {isAspectRatioLocked ? (
                        <>
                          <Lock className="h-3.5 w-3.5 text-accent" />
                          <span>Aspect ratio locked (proportional)</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Aspect ratio unlocked (free stretch)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Scale Presets (Percentage) */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Scale by Percentage:
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleScalePercent(25)}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        25%
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleScalePercent(50)}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        50%
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleScalePercent(75)}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        75%
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleScalePercent(100)}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        100%
                      </Button>
                    </div>
                  </div>

                  {/* Common Presets for Indian Portals */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="text-[11px] font-semibold text-foreground">
                        Common Presets:
                      </p>
                      <Badge variant="default" className="text-[10px] shrink-0">
                        Exam & ID
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetSelect(200, 230)}
                        disabled={isProcessing}
                        className="w-full h-auto min-h-[50px] justify-center text-left bg-slate-50/50 hover:bg-slate-100 flex flex-col items-start py-2 px-3 border border-border rounded-lg transition-colors"
                      >
                        <span className="font-semibold text-[11px] leading-tight text-foreground">Passport Photo</span>
                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5">200 × 230 px</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetSelect(140, 60)}
                        disabled={isProcessing}
                        className="w-full h-auto min-h-[50px] justify-center text-left bg-slate-50/50 hover:bg-slate-100 flex flex-col items-start py-2 px-3 border border-border rounded-lg transition-colors"
                      >
                        <span className="font-semibold text-[11px] leading-tight text-foreground">Signature</span>
                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5">140 × 60 px</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetSelect(350, 450)}
                        disabled={isProcessing}
                        className="w-full h-auto min-h-[50px] justify-center text-left bg-slate-50/50 hover:bg-slate-100 flex flex-col items-start py-2 px-3 border border-border rounded-lg transition-colors"
                      >
                        <span className="font-semibold text-[11px] leading-tight text-foreground">Standard ID Photo</span>
                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5">350 × 450 px</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetSelect(1200, 630)}
                        disabled={isProcessing}
                        className="w-full h-auto min-h-[50px] justify-center text-left bg-slate-50/50 hover:bg-slate-100 flex flex-col items-start py-2 px-3 border border-border rounded-lg transition-colors"
                      >
                        <span className="font-semibold text-[11px] leading-tight text-foreground">Social / Landscape</span>
                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5">1200 × 630 px</span>
                      </Button>
                    </div>

                    {/* Disclaimer Note required by user */}
                    <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed mt-2">
                      <Info className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <p>
                        <strong>Note:</strong> Sizing requirements vary across portals (UPSC, SSC, IBPS, State PSCs). Always verify the specific guidelines of your exam notification before final submission.
                      </p>
                    </div>
                  </div>

                  {/* Output Format */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <FileImage className="h-3.5 w-3.5 text-muted-foreground" />
                      Save As Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={outputFormat === "auto" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setOutputFormat("auto")}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        Original
                      </Button>
                      <Button
                        type="button"
                        variant={outputFormat === "image/jpeg" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setOutputFormat("image/jpeg")}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        JPG
                      </Button>
                      <Button
                        type="button"
                        variant={outputFormat === "image/png" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setOutputFormat("image/png")}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        PNG
                      </Button>
                    </div>
                  </div>

                  {/* Resize Action Button */}
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handlePerformResize}
                    isLoading={isProcessing}
                    className="w-full font-semibold text-sm"
                  >
                    Resize Image
                  </Button>
                </Card>
              </div>

              {/* Right Column: Result Preview & Download */}
              <div className="lg:col-span-7 space-y-6">
                {result ? (
                  <Card className="p-5 space-y-5 bg-white border-border/90">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-border">
                      <div>
                        <p className="text-[11px] font-medium uppercase text-muted-foreground">
                          Original Dimensions
                        </p>
                        <p className="text-base font-bold text-foreground">
                          {result.originalDimensions.width} × {result.originalDimensions.height} px
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] font-medium uppercase text-accent">
                          Resized Dimensions
                        </p>
                        <p className="text-xl font-extrabold text-accent font-mono">
                          {result.newDimensions.width} × {result.newDimensions.height} px
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase text-muted-foreground">
                          File Size
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatFileSize(result.resizedSize)}
                        </p>
                      </div>
                    </div>

                    {/* Resized Image Preview */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Resized Preview</span>
                        <span>Scaled in Browser</span>
                      </div>
                      <div className="relative w-full h-64 sm:h-80 rounded-xl border border-border bg-slate-100 overflow-hidden flex items-center justify-center">
                        <Image
                          src={result.url}
                          alt="Resized Preview"
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={handleDownload}
                        className="w-full sm:flex-1 gap-2 text-sm font-semibold"
                      >
                        <Download className="h-4 w-4" />
                        Download Resized Image
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleReset}
                        className="w-full sm:w-auto text-xs"
                      >
                        <RotateCcw className="h-4 w-4 mr-1.5" />
                        Reset
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="p-12 rounded-2xl border border-dashed border-border bg-slate-50/50 text-center flex flex-col items-center justify-center space-y-2">
                    <Maximize2 className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      Ready to Resize
                    </p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Enter your desired pixel dimensions or choose a common preset, then click &ldquo;Resize Image&rdquo;.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Related Tools Section */}
        <RelatedTools currentSlug="image-resizer" />
      </Container>
    </div>
  );
}
