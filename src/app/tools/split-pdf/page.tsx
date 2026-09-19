"use client";

import React, { useState, useEffect, useRef } from "react";
import { Scissors, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { PdfPageSelector } from "@/components/tools/pdf/PdfPageSelector";
import { PdfResultCard } from "@/components/tools/pdf/PdfResultCard";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import { validatePdfFile } from "@/lib/pdf/validator";
import { splitPdf } from "@/lib/pdf/splitter";
import { formatFileSize, downloadBlob, revokeSafeObjectUrl, generatePdfFilename } from "@/lib/pdf/utils";
import { PdfSplitResult } from "@/lib/pdf/types";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedIndices, setSelectedIndices] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PdfSplitResult | null>(null);
  const activeUrlRef = useRef<string | null>(null);

  useEffect(() => {
    recordRecentTool("split-pdf");
  }, []);

  useEffect(() => {
    return () => {
      revokeSafeObjectUrl(activeUrlRef.current);
    };
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setResult(null);
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

  const handlePerformSplit = async () => {
    if (!file || !selectedIndices || selectedIndices.length === 0) {
      setError("Please select at least one page to extract.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const splitResult = await splitPdf(file, selectedIndices);
      if (activeUrlRef.current) {
        revokeSafeObjectUrl(activeUrlRef.current);
      }
      activeUrlRef.current = splitResult.url;
      setResult(splitResult);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An error occurred while splitting the PDF. Please try again.";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const downloadName = generatePdfFilename(file.name, `extracted-${result.pageCount}pages`);
    downloadBlob(result.blob, downloadName);
  };

  const handleReset = () => {
    revokeSafeObjectUrl(activeUrlRef.current);
    activeUrlRef.current = null;
    setFile(null);
    setPageCount(0);
    setSelectedIndices(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        {/* Tool Header */}
        <ToolHeader
          title="Split PDF"
          description="Extract specific pages or custom page ranges from any PDF document into a clean, new file."
          icon={Scissors}
          categoryName="PDF Tools"
          categoryHref="/tools"
          toolSlug="split-pdf"
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

            {/* Quick Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground pt-4">
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Custom Ranges</p>
                <p>Extract single pages or ranges like 1-3, 5, 8-10 with automatic syntax checking.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Separate Certificates</p>
                <p>Isolate your specific marks card or diploma from a bulky college booklet.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Private Processing</p>
                <p>Document pages are extracted directly on your device without leaving your browser.</p>
              </div>
            </div>
          </div>
        )}

        {/* State 2: File loaded, configure page selection */}
        {file && !result && (
          <div className="max-w-xl mx-auto space-y-6">
            {/* Source File Info Card */}
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
                    {formatFileSize(file.size)} • {pageCount} {pageCount === 1 ? "page" : "pages"} total
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

            {/* Error banner */}
            {error && (
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Page Range Selector Card */}
            <Card className="p-5 space-y-5 bg-white border-border/90">
              <PdfPageSelector
                totalPages={pageCount}
                onValidSelectionChange={setSelectedIndices}
                disabled={isProcessing}
              />

              <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handlePerformSplit}
                  isLoading={isProcessing}
                  disabled={!selectedIndices || selectedIndices.length === 0 || isProcessing}
                  className="w-full sm:flex-1 font-semibold text-sm"
                >
                  Extract Selected Pages
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

        {/* State 3: Extraction result ready */}
        {result && (
          <div className="max-w-xl mx-auto space-y-6">
            <PdfResultCard
              title="Extracted PDF Ready"
              fileSize={result.fileSize}
              pageCount={result.pageCount}
              onDownload={handleDownload}
              onReset={handleReset}
              downloadLabel="Download Extracted PDF"
            />
          </div>
        )}

        {/* Related Tools Section */}
        <RelatedTools currentSlug="split-pdf" />
      </Container>
    </div>
  );
}
