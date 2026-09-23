"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Minimize2,
  FileText,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Info,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import { validatePdfFile } from "@/lib/pdf/validator";
import { compressPdf } from "@/lib/pdf/compressor";
import {
  formatFileSize,
  downloadBlob,
  revokeSafeObjectUrl,
  generatePdfFilename,
} from "@/lib/pdf/utils";
import { PdfCompressLevel, PdfCompressResult } from "@/lib/pdf/types";

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [level, setLevel] = useState<PdfCompressLevel>("balanced");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [result, setResult] = useState<PdfCompressResult | null>(null);
  const activeUrlRef = useRef<string | null>(null);

  useEffect(() => {
    recordRecentTool("compress-pdf");
  }, []);

  useEffect(() => {
    return () => {
      revokeSafeObjectUrl(activeUrlRef.current);
    };
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setResult(null);
    setProcessingStatus("");
    revokeSafeObjectUrl(activeUrlRef.current);

    const validation = await validatePdfFile(selectedFile);
    if (!validation.isValid || !validation.pageCount) {
      setError(validation.error || "The selected file could not be read as a PDF.");
      setFile(null);
      setPageCount(0);
      return;
    }

    setFile(selectedFile);
    setPageCount(validation.pageCount);
  };

  const handlePerformCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProcessingStatus("Optimizing PDF document...");
    setError(null);

    try {
      const compressResult = await compressPdf(file, level, (status) => {
        setProcessingStatus(status);
      });
      if (activeUrlRef.current) {
        revokeSafeObjectUrl(activeUrlRef.current);
      }
      activeUrlRef.current = compressResult.url;
      setResult(compressResult);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An error occurred during PDF compression. Please try again.";
      setError(msg);
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const downloadName = generatePdfFilename(file.name, "compressed");
    downloadBlob(result.blob, downloadName);
  };

  const handleReset = () => {
    revokeSafeObjectUrl(activeUrlRef.current);
    activeUrlRef.current = null;
    setFile(null);
    setPageCount(0);
    setLevel("balanced");
    setResult(null);
    setError(null);
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        {/* Tool Header */}
        <ToolHeader
          title="Compress PDF"
          description="Optimize PDF structure and stream compaction directly in your browser. Fast, private, and transparent."
          icon={Minimize2}
          categoryName="PDF Tools"
          categoryHref="/tools"
          toolSlug="compress-pdf"
        />

        {/* State 1: Dropzone if no file selected */}
        {!file && !result && (
          <div className="max-w-2xl mx-auto space-y-6">
            <FileDropzone
              onFileSelect={handleFileSelect}
              accept="application/pdf,.pdf"
              maxSizeBytes={50 * 1024 * 1024}
              title="Choose a PDF file or drag & drop here"
              subtitle="Select a PDF document up to 50 MB"
              buttonLabel="Select PDF File"
              icon={FileText}
              errorMessage={error}
              onClearError={() => setError(null)}
            />

            {/* Honest Technical Note */}
            <div className="p-4 rounded-xl border border-border bg-slate-50/70 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Info className="h-4 w-4 text-accent" />
                How PDF Compression Works
              </div>
              <p className="leading-relaxed">
                Unlike images, PDFs often contain text vectors and pre-compressed data streams. This tool performs structural object reorganization and stream compaction without modifying document text or destroying legibility.
              </p>
            </div>
          </div>
        )}

        {/* State 2: File loaded, select compression level */}
        {file && !result && (
          <div className="max-w-xl mx-auto space-y-6">
            {/* File Info Bar */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-white shadow-subtle">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-accent-subtle text-accent flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatFileSize(file.size)} • {pageCount} {pageCount === 1 ? "page" : "pages"}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isProcessing}
                className="text-xs shrink-0"
              >
                <RefreshCw className="h-3 w-3 mr-1.5" />
                Change File
              </Button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Compression Options Card */}
            <Card className="p-5 space-y-5 bg-white border-border/90">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-accent" />
                  Select Compression Level
                </h2>
                <p className="text-xs text-muted-foreground">
                  Choose the degree of structural optimization applied to your document.
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Option 1: Low */}
                <label
                  onClick={() => setLevel("low")}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    level === "low"
                      ? "border-accent bg-accent-subtle/30 ring-1 ring-accent"
                      : "border-border hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="compression-level"
                    checked={level === "low"}
                    onChange={() => setLevel("low")}
                    className="mt-0.5 accent-accent"
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">
                      Low Compression (Standard Compaction)
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Reorganizes object streams while preserving all document metadata and outlines.
                    </p>
                  </div>
                </label>

                {/* Option 2: Balanced */}
                <label
                  onClick={() => setLevel("balanced")}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    level === "balanced"
                      ? "border-accent bg-accent-subtle/30 ring-1 ring-accent"
                      : "border-border hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="compression-level"
                    checked={level === "balanced"}
                    onChange={() => setLevel("balanced")}
                    className="mt-0.5 accent-accent"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-foreground">
                        Balanced (Recommended)
                      </p>
                      <Badge variant="accent" className="text-[10px] py-0">
                        Popular
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Stream compaction and strips redundant non-essential document metadata.
                    </p>
                  </div>
                </label>

                {/* Option 3: Strong */}
                <label
                  onClick={() => setLevel("strong")}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    level === "strong"
                      ? "border-accent bg-accent-subtle/30 ring-1 ring-accent"
                      : "border-border hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="compression-level"
                    checked={level === "strong"}
                    onChange={() => setLevel("strong")}
                    className="mt-0.5 accent-accent"
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">
                      Strong (Maximum Stream Optimization)
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Aggressively compresses streams and cleans all non-content metadata entries.
                    </p>
                  </div>
                </label>
              </div>

              {isProcessing && processingStatus && (
                <p className="text-xs text-center text-accent font-medium animate-pulse">
                  {processingStatus}
                </p>
              )}

              <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handlePerformCompress}
                  isLoading={isProcessing}
                  className="w-full sm:flex-1 font-semibold text-sm"
                >
                  Compress PDF
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="w-full sm:w-auto text-xs"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* State 3: Compression Result */}
        {result && file && (
          <div className="max-w-xl mx-auto space-y-6">
            <Card className="p-6 space-y-6 bg-white border-border/90">
              {/* Size Comparison */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-border">
                <div>
                  <p className="text-[11px] font-medium uppercase text-muted-foreground">
                    Original Size
                  </p>
                  <p className="text-base font-bold text-foreground line-through decoration-slate-400">
                    {formatFileSize(result.originalSize)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-[11px] font-medium uppercase text-emerald-700">
                      Output Size
                    </p>
                    <p className="text-2xl font-extrabold text-emerald-600">
                      {formatFileSize(result.compressedSize)}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={result.reductionPercentage >= 5 ? "success" : "default"}
                  className="text-xs font-bold py-1 px-3"
                >
                  {result.reductionPercentage > 0
                    ? `-${result.reductionPercentage}% saved`
                    : "Pre-Optimized"}
                </Badge>
              </div>

              {/* Meaningful Savings Summary */}
              {result.reductionPercentage >= 5 && (
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <p>
                    Successfully saved{" "}
                    <strong>{formatFileSize(result.originalSize - result.compressedSize)}</strong>
                    {result.imagesOptimizedCount && result.imagesOptimizedCount > 0
                      ? ` by recompressing ${result.imagesOptimizedCount} embedded image${
                          result.imagesOptimizedCount > 1 ? "s" : ""
                        } and compacting document streams.`
                      : " via structural stream compaction."}
                  </p>
                </div>
              )}

              {/* Honest Explanation for Already Optimized or Limited Compressible Content */}
              {result.reductionPercentage < 5 && (
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
                  <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Document Has Limited Compressible Content</p>
                    <p className="mt-0.5 text-amber-800">
                      {result.reductionPercentage > 0
                        ? `Saved ${formatFileSize(result.originalSize - result.compressedSize)} (${result.reductionPercentage}%). This PDF was already heavily compacted by its creator or primarily consists of vector text. Further reduction without degrading text legibility was not possible.`
                        : "This PDF was already heavily compacted by its creator or primarily consists of vector text. Further reduction without degrading text legibility was not possible."}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleDownload}
                  className="w-full sm:flex-1 gap-2 font-semibold text-sm"
                >
                  Download Optimized PDF
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  className="w-full sm:w-auto text-xs"
                >
                  Compress Another PDF
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Related Tools Section */}
        <RelatedTools currentSlug="compress-pdf" />
      </Container>
    </div>
  );
}
