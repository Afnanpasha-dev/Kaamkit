"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FileImage,
  FileText,
  AlertCircle,
  RefreshCw,
  Download,
  Archive,
  Layers,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { PdfPageSelector } from "@/components/tools/pdf/PdfPageSelector";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import { validatePdfFile } from "@/lib/pdf/validator";
import { renderPdfToImages, createPdfImagesZip } from "@/lib/pdf/renderer";
import {
  formatFileSize,
  downloadBlob,
  revokeSafeObjectUrl,
} from "@/lib/pdf/utils";
import { RenderedPdfPage } from "@/lib/pdf/types";

export default function PdfToImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedIndices, setSelectedIndices] = useState<number[] | null>(null);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [error, setError] = useState<string | null>(null);

  // Processing & Progress
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  // Results
  const [renderedPages, setRenderedPages] = useState<RenderedPdfPage[]>([]);
  const renderedUrlsRef = useRef<string[]>([]);

  // Record recent tool visit on mount
  useEffect(() => {
    recordRecentTool("pdf-to-images");
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      renderedUrlsRef.current.forEach((url) => revokeSafeObjectUrl(url));
    };
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    handleReset();

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

  const handlePerformRender = async () => {
    if (!file || !selectedIndices || selectedIndices.length === 0) {
      setError("Please select at least one page to convert.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress({ current: 0, total: selectedIndices.length });

    try {
      const result = await renderPdfToImages(
        file,
        {
          format,
          pageIndices: selectedIndices,
          scale: 1.5,
        },
        (current, total) => {
          setProgress({ current, total });
        }
      );

      // Clean prior URLs
      renderedUrlsRef.current.forEach((url) => revokeSafeObjectUrl(url));
      renderedUrlsRef.current = result.pages.map((p) => p.url);

      setRenderedPages(result.pages);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An error occurred while rendering PDF pages. Please try again.";
      setError(msg);
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleDownloadSingle = (page: RenderedPdfPage) => {
    if (!file) return;
    const cleanBase = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${cleanBase}-page-${page.pageNumber}.${page.format}`;
    downloadBlob(page.blob, filename);
  };

  const handleDownloadAllZip = async () => {
    if (!file || renderedPages.length === 0) return;
    setIsZipping(true);
    try {
      const zipBlob = await createPdfImagesZip(renderedPages, file.name);
      const cleanBase = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
      downloadBlob(zipBlob, `${cleanBase}-images.zip`);
    } catch {
      setError("Failed to generate ZIP archive. You can still download individual page images.");
    } finally {
      setIsZipping(false);
    }
  };

  const handleReset = () => {
    renderedUrlsRef.current.forEach((url) => revokeSafeObjectUrl(url));
    renderedUrlsRef.current = [];
    setFile(null);
    setPageCount(0);
    setSelectedIndices(null);
    setRenderedPages([]);
    setError(null);
    setProgress(null);
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        {/* Tool Header */}
        <ToolHeader
          title="PDF to Images"
          description="Render and convert PDF document pages into high-resolution PNG or JPG images directly in your browser."
          icon={FileImage}
          categoryName="PDF Tools"
          categoryHref="/tools"
          toolSlug="pdf-to-images"
        />

        {/* State 1: Dropzone if no file selected */}
        {!file && renderedPages.length === 0 && (
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

            {/* Explanatory Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground pt-4">
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">PNG & JPG Support</p>
                <p>Choose crisp lossless PNG or compact JPG with clean white canvas backgrounds.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Batch ZIP Download</p>
                <p>Download individual pages or package the entire document into a single ZIP archive.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">100% Client-Side</p>
                <p>Pages are rendered using browser Canvas. No PDF content is transferred to any server.</p>
              </div>
            </div>
          </div>
        )}

        {/* State 2: File loaded, configure pages and format */}
        {file && renderedPages.length === 0 && (
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

            {/* Options Card */}
            <Card className="p-5 space-y-5 bg-white border-border/90">
              {/* Format selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Output Image Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormat("image/png")}
                    disabled={isProcessing}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                      format === "image/png"
                        ? "border-accent bg-accent-subtle/30 ring-1 ring-accent"
                        : "border-border hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">PNG Format</span>
                      <Badge variant="accent" className="text-[10px] py-0">
                        Sharp
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                      Lossless, crisp text and illustrations
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat("image/jpeg")}
                    disabled={isProcessing}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                      format === "image/jpeg"
                        ? "border-accent bg-accent-subtle/30 ring-1 ring-accent"
                        : "border-border hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">JPG Format</span>
                      <Badge variant="default" className="text-[10px] py-0">
                        Compact
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                      Smaller file size, solid white background
                    </span>
                  </button>
                </div>
              </div>

              {/* Page Range Selector */}
              <div className="pt-2 border-t border-border">
                <PdfPageSelector
                  totalPages={pageCount}
                  onValidSelectionChange={setSelectedIndices}
                  disabled={isProcessing}
                />
              </div>

              {/* Progress indicator */}
              {isProcessing && progress && (
                <div className="p-3 rounded-xl bg-accent-subtle text-accent text-xs font-medium space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span>Rendering page {progress.current} of {progress.total}...</span>
                    <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all duration-200"
                      style={{
                        width: `${(progress.current / progress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handlePerformRender}
                  isLoading={isProcessing}
                  disabled={!selectedIndices || selectedIndices.length === 0 || isProcessing}
                  className="w-full sm:flex-1 font-semibold text-sm"
                >
                  Convert to Images
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

        {/* State 3: Images rendered successfully */}
        {renderedPages.length > 0 && file && (
          <div className="space-y-6">
            {/* Action Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-white shadow-subtle">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Converted {renderedPages.length} {renderedPages.length === 1 ? "Image" : "Images"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  From &ldquo;{file.name}&rdquo; ({format === "image/png" ? "PNG" : "JPG"} format)
                </p>
              </div>

              <div className="flex items-center gap-2">
                {renderedPages.length > 1 && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadAllZip}
                    isLoading={isZipping}
                    className="text-xs gap-1.5"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    Download All as ZIP
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs gap-1.5"
                >
                  <RefreshCw className="h-3 w-3" />
                  Convert Another PDF
                </Button>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderedPages.map((page) => (
                <Card
                  key={page.pageNumber}
                  className="overflow-hidden flex flex-col justify-between bg-white border-border hover:shadow-card transition-shadow"
                >
                  {/* Image Preview */}
                  <div className="relative w-full h-64 bg-slate-100 flex items-center justify-center p-2 border-b border-border">
                    <Image
                      src={page.url}
                      alt={`Page ${page.pageNumber}`}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>

                  {/* Card Footer Info & Download */}
                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Page {page.pageNumber}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {page.width} × {page.height} px • {formatFileSize(page.blob.size)}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadSingle(page)}
                      className="text-xs h-8 gap-1.5"
                    >
                      <Download className="h-3 w-3" />
                      Save
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Related Tools Section */}
        <RelatedTools currentSlug="pdf-to-images" />
      </Container>
    </div>
  );
}
