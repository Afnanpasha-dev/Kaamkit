"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ScanText,
  Copy,
  Download,
  RotateCcw,
  Check,
  FileText,
  AlertCircle,
  Sparkles,
  Info,
  Loader2,
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
import { downloadBlob, createSafeUrl, revokeSafeUrl } from "@/lib/image/utils";
import { validateImageFile } from "@/lib/image/validator";
import { extractTextFromImage, OcrProgress } from "@/lib/ocr/extractor";

export default function ImageToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OcrProgress | null>(null);

  const [extractedText, setExtractedText] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Record recent tool visit on mount
  useEffect(() => {
    recordRecentTool("image-to-text");
  }, []);

  // Cleanup object URLs on unmount or file reset
  useEffect(() => {
    return () => {
      revokeSafeUrl(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setExtractedText("");
    setProgress(null);
    revokeSafeUrl(previewUrl);

    const validation = await validateImageFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.error || "The selected image file could not be processed.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    const url = createSafeUrl(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(url);
  };

  const handleExtractText = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setProgress({ status: "Initializing OCR Engine...", percent: 0 });

    try {
      const text = await extractTextFromImage(file, (p) => {
        setProgress(p);
      });

      setExtractedText(text);
      if (!text.trim()) {
        setError("No readable text could be recognized from this image.");
      }
    } catch (err: any) {
      setError(err.message || "OCR could not be initialized or failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleCopyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, "kaamkit-extracted-text.txt");
  };

  const handleReset = () => {
    revokeSafeUrl(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setExtractedText("");
    setProgress(null);
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        <ToolHeader
          title="Image to Text (OCR)"
          description="Extract editable text from scanned documents, notes, photos, and images directly in your browser."
          icon={ScanText}
          categoryName="Image Tools"
          categoryHref="/tools"
          toolSlug="image-to-text"
        />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700">
            {error}
          </div>
        )}

        {/* State 1: Dropzone if no file selected */}
        {!file && (
          <div className="max-w-2xl mx-auto space-y-6">
            <FileDropzone
              accept="image/jpeg,image/png,image/webp"
              maxSizeBytes={20 * 1024 * 1024}
              onFileSelect={handleFileSelect}
              title="Click or Drag & Drop Image Here"
              subtitle="Supports JPG, PNG, and WebP up to 20 MB"
            />
          </div>
        )}

        {/* State 2: Selected Image & OCR Action */}
        {file && previewUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Image Preview Column */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-4 space-y-4 bg-white border-border">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-sm font-bold text-foreground">Uploaded Image</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={isProcessing}
                    className="text-xs h-8"
                  >
                    Change Image
                  </Button>
                </div>

                <div className="relative w-full h-64 sm:h-72 bg-slate-100 rounded-xl overflow-hidden border border-border flex items-center justify-center p-2">
                  <Image
                    src={previewUrl}
                    alt={file.name}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>

                <ImageFileInfo
                  fileName={file.name}
                  fileSize={file.size}
                  previewUrl={previewUrl}
                  onReset={handleReset}
                />

                {!extractedText && (
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleExtractText}
                    isLoading={isProcessing}
                    className="w-full font-semibold text-sm gap-2"
                  >
                    <ScanText className="h-4 w-4" />
                    Extract Text (OCR)
                  </Button>
                )}
              </Card>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-800 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-amber-600" />
                  OCR Limitations
                </p>
                <p className="leading-relaxed">
                  OCR accuracy depends on image quality, font, lighting, handwriting, and layout. Always review extracted text.
                </p>
              </div>
            </div>

            {/* Results / Progress Column */}
            <div className="lg:col-span-7 space-y-4">
              {/* Progress State */}
              {isProcessing && progress && (
                <Card className="p-8 text-center space-y-4 bg-white border-border">
                  <div className="h-12 w-12 rounded-2xl bg-accent-subtle text-accent flex items-center justify-center mx-auto animate-spin">
                    <Loader2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-foreground">
                      {progress.status}
                    </h3>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                      <div
                        className="bg-accent h-full transition-all duration-300"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Running local Web Worker recognition. No image data is sent to external servers.
                  </p>
                </Card>
              )}

              {/* Extracted Text State */}
              {extractedText && (
                <Card className="p-5 space-y-4 bg-white border-border">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent" />
                      <h3 className="text-sm font-bold text-foreground">Extracted Text</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyText}
                        className="text-xs h-8 gap-1.5"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? "Copied!" : "Copy Text"}</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadTxt}
                        className="text-xs h-8 gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download TXT</span>
                      </Button>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-border bg-slate-50 text-foreground font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="text-xs gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Extract Another Image</span>
                    </Button>

                    <span className="text-[11px] text-muted-foreground">
                      {extractedText.trim().split(/\s+/).filter(Boolean).length} words extracted
                    </span>
                  </div>
                </Card>
              )}

              {!isProcessing && !extractedText && (
                <Card className="p-12 text-center text-muted-foreground text-xs space-y-2 bg-slate-50/50 border-dashed border-border">
                  <ScanText className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <p>Click &ldquo;Extract Text (OCR)&rdquo; to analyze the uploaded image.</p>
                </Card>
              )}
            </div>
          </div>
        )}

        <RelatedTools currentSlug="image-to-text" />
      </Container>
    </div>
  );
}
