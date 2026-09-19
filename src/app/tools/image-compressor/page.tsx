"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ImageDown,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  FileImage,
  Layers,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ImageFileInfo } from "@/components/tools/ImageFileInfo";
import {
  validateImageFile,
} from "@/lib/image/validator";
import {
  compressImage,
} from "@/lib/image/compressor";
import {
  formatFileSize,
  createSafeUrl,
  revokeSafeUrl,
  getSanitizedFilename,
  downloadBlob,
} from "@/lib/image/utils";
import {
  CompressionResult,
  ImageDimensions,
  SupportedImageMimeType,
} from "@/lib/image/types";

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<ImageDimensions | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // Compression Settings
  const [quality, setQuality] = useState<number>(75); // 10 to 100
  const [outputFormat, setOutputFormat] = useState<SupportedImageMimeType | "auto">("auto");
  const [isProcessing, setIsProcessing] = useState(false);

  // Result
  const [result, setResult] = useState<CompressionResult | null>(null);
  const activeResultUrlRef = useRef<string | null>(null);

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
    if (!validation.isValid) {
      setError(validation.error || "Selected file could not be processed.");
      setFile(null);
      setOriginalUrl(null);
      return;
    }

    const preview = createSafeUrl(selectedFile);
    setFile(selectedFile);
    setOriginalUrl(preview);
    setDimensions(validation.dimensions);

    // Run initial compression automatically with default quality
    performCompression(selectedFile, 75, "auto");
  };

  const performCompression = async (
    targetFile: File,
    targetQuality: number,
    format: SupportedImageMimeType | "auto"
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const compressionResult = await compressImage(targetFile, {
        quality: targetQuality / 100,
        format,
      });

      // Cleanup prior result URL
      if (activeResultUrlRef.current) {
        revokeSafeUrl(activeResultUrlRef.current);
      }
      activeResultUrlRef.current = compressionResult.url;
      setResult(compressionResult);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "That image couldn't be compressed. Try another image or a smaller file.";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (file) {
      performCompression(file, newQuality, outputFormat);
    }
  };

  const handleFormatChange = (newFormat: SupportedImageMimeType | "auto") => {
    setOutputFormat(newFormat);
    if (file) {
      performCompression(file, quality, newFormat);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const downloadFilename = getSanitizedFilename(
      file.name,
      "compressed",
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
    setDimensions(undefined);
    setResult(null);
    setError(null);
    setQuality(75);
    setOutputFormat("auto");
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        {/* Tool Header */}
        <ToolHeader
          title="Image Compressor"
          description="Reduce image file sizes for job portals, government exams, and websites without losing visible quality."
          icon={ImageDown}
          categoryName="Image Tools"
          categoryHref="/tools"
          toolSlug="image-compressor"
        />

        {/* Step 1: Dropzone if no file selected */}
        {!file && (
          <div className="max-w-2xl mx-auto space-y-6">
            <FileDropzone
              onFileSelect={handleFileSelect}
              errorMessage={error}
              onClearError={() => setError(null)}
            />

            {/* Quick Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground pt-4">
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Exam Portals</p>
                <p>Easily shrink photographs to under 50 KB or 100 KB for SSC, UPSC, and State exam forms.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Format Support</p>
                <p>Supports modern JPG, PNG, and WebP photos taken from Android phones, iPhones, or cameras.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Private & Local</p>
                <p>Compression happens inside your browser canvas. No image data is saved on our servers.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 & 3: File loaded, compression controls & results */}
        {file && originalUrl && (
          <div className="space-y-6">
            {/* Image Metadata Bar */}
            <ImageFileInfo
              fileName={file.name}
              fileSize={file.size}
              dimensions={dimensions}
              previewUrl={originalUrl}
              onReset={handleReset}
              disabled={isProcessing}
            />

            {/* Controls & Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Compression Controls */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-5 space-y-5 bg-white border-border/90">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-accent" />
                      Compression Settings
                    </h2>
                    <Badge variant="outline" className="text-xs font-mono">
                      Quality: {quality}%
                    </Badge>
                  </div>

                  {/* Quality Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Smaller File</span>
                      <span className="font-medium text-foreground">{quality}%</span>
                      <span>Higher Quality</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      step="5"
                      value={quality}
                      onChange={(e) => handleQualityChange(Number(e.target.value))}
                      disabled={isProcessing}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent focus-visible:outline-none"
                      aria-label="Compression quality slider"
                    />
                  </div>

                  {/* Quality Presets */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Quick Presets:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={quality === 85 ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleQualityChange(85)}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        High (85%)
                      </Button>
                      <Button
                        type="button"
                        variant={quality === 70 ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleQualityChange(70)}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        Balanced (70%)
                      </Button>
                      <Button
                        type="button"
                        variant={quality === 40 ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleQualityChange(40)}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        Max (40%)
                      </Button>
                    </div>
                  </div>

                  {/* Output Format Selector */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <FileImage className="h-3.5 w-3.5 text-muted-foreground" />
                      Output Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={outputFormat === "auto" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleFormatChange("auto")}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        Auto
                      </Button>
                      <Button
                        type="button"
                        variant={outputFormat === "image/jpeg" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleFormatChange("image/jpeg")}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        JPG
                      </Button>
                      <Button
                        type="button"
                        variant={outputFormat === "image/webp" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleFormatChange("image/webp")}
                        disabled={isProcessing}
                        className="text-xs h-8"
                      >
                        WebP
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Processing State Indicator */}
                {isProcessing && (
                  <div className="p-3 rounded-xl bg-accent-subtle text-accent text-xs font-medium flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    Compressing image in browser...
                  </div>
                )}
              </div>

              {/* Right Column: Result Comparison & Download */}
              <div className="lg:col-span-7 space-y-6">
                {result ? (
                  <Card className="p-5 space-y-5 bg-white border-border/90">
                    {/* Size Comparison Card */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-border">
                      <div>
                        <p className="text-[11px] font-medium uppercase text-muted-foreground">
                          Original Size
                        </p>
                        <p className="text-lg font-bold text-foreground line-through decoration-slate-400">
                          {formatFileSize(result.originalSize)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-[11px] font-medium uppercase text-emerald-700">
                            Compressed Size
                          </p>
                          <p className="text-2xl font-extrabold text-emerald-600">
                            {formatFileSize(result.compressedSize)}
                          </p>
                        </div>
                      </div>

                      {/* Savings Badge */}
                      <Badge
                        variant={result.reductionPercentage > 0 ? "success" : "default"}
                        className="text-xs font-bold py-1 px-3"
                      >
                        {result.reductionPercentage > 0
                          ? `-${result.reductionPercentage}% saved`
                          : "Optimized"}
                      </Badge>
                    </div>

                    {/* Image Preview */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Compressed Preview</span>
                        <span>
                          {result.dimensions.width} × {result.dimensions.height} px
                        </span>
                      </div>
                      <div className="relative w-full h-64 sm:h-80 rounded-xl border border-border bg-slate-100 overflow-hidden flex items-center justify-center">
                        <Image
                          src={result.url}
                          alt="Compressed Preview"
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={handleDownload}
                        className="w-full sm:flex-1 gap-2 text-sm font-semibold"
                      >
                        <Download className="h-4 w-4" />
                        Download Compressed Image
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
                  !isProcessing && (
                    <div className="p-12 rounded-2xl border border-dashed border-border bg-slate-50/50 text-center flex flex-col items-center justify-center space-y-2">
                      <Layers className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">
                        Ready to Compress
                      </p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        Adjust the quality slider on the left to see the compressed file size.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
