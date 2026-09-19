"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileType,
  Download,
  RotateCcw,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ScanText,
  Info,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import { formatFileSize, downloadBlob, revokeSafeObjectUrl } from "@/lib/pdf/utils";
import { validatePdfFile } from "@/lib/pdf/validator";
import { convertPdfToWord, PdfToWordResult } from "@/lib/pdf/pdfToWord";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>("");

  const [result, setResult] = useState<PdfToWordResult | null>(null);
  const activeResultUrlRef = useRef<string | null>(null);

  // Record recent tool visit on mount
  useEffect(() => {
    recordRecentTool("pdf-to-word");
  }, []);

  // Clean up result object URL on unmount
  useEffect(() => {
    return () => {
      revokeSafeObjectUrl(activeResultUrlRef.current);
    };
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setResult(null);
    revokeSafeObjectUrl(activeResultUrlRef.current);

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

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setProgressMsg("Analyzing PDF text structure...");

    try {
      revokeSafeObjectUrl(activeResultUrlRef.current);

      const res = await convertPdfToWord(file, (current, total) => {
        setProgressMsg(`Extracting text from page ${current} of ${total}...`);
      });

      if (res.isScanned) {
        setResult(res);
      } else {
        activeResultUrlRef.current = res.url;
        setResult(res);
      }
    } catch (err: any) {
      setError(err.message || "Failed to convert PDF to Word. Please check the file.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleDownload = () => {
    if (result && result.blob) {
      downloadBlob(result.blob, result.filename);
    }
  };

  const handleReset = () => {
    revokeSafeObjectUrl(activeResultUrlRef.current);
    setFile(null);
    setPageCount(0);
    setError(null);
    setResult(null);
    setProgressMsg("");
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        <ToolHeader
          title="PDF to Word"
          description="Convert text-based PDF documents into editable Word (.docx) files directly in your browser."
          icon={FileType}
          categoryName="PDF Tools"
          categoryHref="/tools"
          toolSlug="pdf-to-word"
        />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* State 1: Dropzone if no file selected */}
        {!file && (
          <div className="max-w-2xl mx-auto space-y-6">
            <FileDropzone
              accept=".pdf,application/pdf"
              maxSizeBytes={50 * 1024 * 1024}
              onFileSelect={handleFileSelect}
              title="Click or Drag & Drop PDF Here"
              subtitle="Supports text-based PDF documents up to 50 MB"
            />
          </div>
        )}

        {/* State 2: Selected PDF Info & Conversion */}
        {file && !result && (
          <div className="max-w-xl mx-auto space-y-6">
            <Card className="p-6 space-y-5 bg-white border-border">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <h3 className="text-sm font-bold text-foreground">Selected Document</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="text-xs h-8"
                >
                  Change PDF
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-border space-y-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)} • {pageCount} {pageCount === 1 ? "page" : "pages"}
                </p>
              </div>

              {isProcessing ? (
                <div className="p-6 text-center space-y-3 bg-slate-50/70 rounded-xl border border-border">
                  <Loader2 className="h-6 w-6 text-accent animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-foreground">{progressMsg}</p>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleConvert}
                  className="w-full font-semibold text-sm gap-2"
                >
                  <FileType className="h-4 w-4" />
                  Convert to Word (.docx)
                </Button>
              )}
            </Card>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-800 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Info className="h-4 w-4 text-amber-600" />
                Conversion Limitations
              </p>
              <p className="leading-relaxed">
                This converter works best with text-based PDFs. Complex layouts, tables, images, and scanned PDFs may require editing after conversion.
              </p>
            </div>
          </div>
        )}

        {/* State 3: Conversion Result */}
        {result && (
          <div className="max-w-xl mx-auto space-y-6">
            {result.isScanned ? (
              /* Scanned / Image-based PDF Banner */
              <Card className="p-6 space-y-4 bg-white border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">
                      Scanned / Image-Based PDF Detected
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This PDF appears to be scanned or image-based. Text extraction is not available for this document.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Link href="/tools/image-to-text" className="w-full sm:flex-1">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      className="w-full text-xs font-semibold gap-1.5"
                    >
                      <ScanText className="h-4 w-4" />
                      <span>Use Image to Text (OCR)</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>

                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleReset}
                    className="w-full sm:w-auto text-xs"
                  >
                    Try Another PDF
                  </Button>
                </div>
              </Card>
            ) : (
              /* Success DOCX Card */
              <Card className="p-6 text-center space-y-5 bg-white border-border">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div>
                  <Badge variant="success" className="mb-2">
                    Word Document Ready
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground">
                    {result.filename}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.pageCount} {result.pageCount === 1 ? "page" : "pages"} • ~{result.wordCount.toLocaleString()} words extracted
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleDownload}
                    className="w-full sm:flex-1 gap-2 text-sm font-semibold"
                  >
                    <Download className="h-4 w-4" />
                    Download Word Document
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    className="w-full sm:w-auto text-xs"
                  >
                    <RotateCcw className="h-4 w-4 mr-1.5" />
                    Convert Another
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        <RelatedTools currentSlug="pdf-to-word" />
      </Container>
    </div>
  );
}
