"use client";

import React, { useState, useEffect, useRef } from "react";
import { Layers, FileText, AlertCircle, Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { PdfFileList } from "@/components/tools/pdf/PdfFileList";
import { PdfResultCard } from "@/components/tools/pdf/PdfResultCard";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import { validatePdfFile } from "@/lib/pdf/validator";
import { mergePdfs } from "@/lib/pdf/merger";
import { downloadBlob, revokeSafeObjectUrl } from "@/lib/pdf/utils";
import { PdfFileInfo, PdfMergeResult } from "@/lib/pdf/types";

export default function MergePdfPage() {
  const [fileList, setFileList] = useState<PdfFileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PdfMergeResult | null>(null);
  const activeUrlRef = useRef<string | null>(null);

  useEffect(() => {
    recordRecentTool("merge-pdf");
  }, []);

  useEffect(() => {
    return () => {
      revokeSafeObjectUrl(activeUrlRef.current);
    };
  }, []);

  const handleFilesSelect = async (selectedFiles: File[]) => {
    setError(null);
    const newItems: PdfFileInfo[] = [];

    for (const f of selectedFiles) {
      const validation = await validatePdfFile(f);
      if (!validation.isValid) {
        setError(validation.error || `Could not validate "${f.name}".`);
        return;
      }

      newItems.push({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
        file: f,
        name: f.name,
        size: f.size,
        pageCount: validation.pageCount,
      });
    }

    setFileList((prev) => [...prev, ...newItems]);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setFileList((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    setFileList((prev) => {
      if (index >= prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleRemove = (index: number) => {
    setFileList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (fileList.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const mergeResult = await mergePdfs(fileList.map((item) => item.file));
      if (activeUrlRef.current) {
        revokeSafeObjectUrl(activeUrlRef.current);
      }
      activeUrlRef.current = mergeResult.url;
      setResult(mergeResult);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to merge PDF files. Please try again.";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, "kaamkit-merged.pdf");
  };

  const handleReset = () => {
    revokeSafeObjectUrl(activeUrlRef.current);
    activeUrlRef.current = null;
    setFileList([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        {/* Tool Header */}
        <ToolHeader
          title="Merge PDF"
          description="Combine multiple PDF documents into a single organized file in seconds. Order your pages freely."
          icon={Layers}
          categoryName="PDF Tools"
          categoryHref="/tools"
          toolSlug="merge-pdf"
        />

        {/* State 1: Dropzone (when 0 files selected) */}
        {fileList.length === 0 && !result && (
          <div className="max-w-2xl mx-auto space-y-6">
            <FileDropzone
              onFilesSelect={handleFilesSelect}
              multiple={true}
              accept="application/pdf,.pdf"
              maxSizeBytes={50 * 1024 * 1024}
              title="Choose PDF files or drag & drop here"
              subtitle="Select 2 or more PDF documents (up to 50 MB each)"
              buttonLabel="Select PDF Files"
              icon={FileText}
              errorMessage={error}
              onClearError={() => setError(null)}
            />

            {/* Practical Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground pt-4">
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Custom Ordering</p>
                <p>Move files up or down to set the exact sequence before combining.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Certificates & Forms</p>
                <p>Ideal for combining marks cards, IDs, and job application attachments.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-1">
                <p className="font-semibold text-foreground">Private & Local</p>
                <p>Documents are combined directly in your browser without uploading to any server.</p>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Files selected, review order & merge */}
        {fileList.length > 0 && !result && (
          <div className="max-w-2xl mx-auto space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <PdfFileList
              files={fileList}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onRemove={handleRemove}
              onAddMore={() => {
                const hiddenInput = document.getElementById("pdf-add-more-input");
                hiddenInput?.click();
              }}
              disabled={isProcessing}
            />

            {/* Hidden file input for adding more files */}
            <input
              id="pdf-add-more-input"
              type="file"
              accept="application/pdf,.pdf"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFilesSelect(Array.from(e.target.files));
                  e.target.value = "";
                }
              }}
              className="hidden"
            />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleMerge}
                isLoading={isProcessing}
                disabled={fileList.length < 2 || isProcessing}
                className="w-full sm:flex-1 font-semibold text-sm"
              >
                Merge {fileList.length} PDFs
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleReset}
                disabled={isProcessing}
                className="w-full sm:w-auto text-xs"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* State 3: Merge result ready */}
        {result && (
          <div className="max-w-xl mx-auto space-y-6">
            <PdfResultCard
              title="Merged Document Ready"
              fileSize={result.totalSize}
              pageCount={result.totalPages}
              onDownload={handleDownload}
              onReset={handleReset}
              downloadLabel="Download Merged PDF"
            />
          </div>
        )}

        {/* Related Tools Section */}
        <RelatedTools currentSlug="merge-pdf" />
      </Container>
    </div>
  );
}
