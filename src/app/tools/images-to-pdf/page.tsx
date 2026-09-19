"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Images,
  Download,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import { formatFileSize, downloadBlob } from "@/lib/image/utils";
import {
  ImageItem,
  ImageToPdfOptions,
  loadImageDimensions,
  convertImagesToPdf,
} from "@/lib/pdf/imageToPdf";

export default function ImagesToPdfPage() {
  const [imageList, setImageList] = useState<ImageItem[]>([]);
  const [options, setOptions] = useState<ImageToPdfOptions>({
    pageSize: "a4",
    orientation: "portrait",
    fit: "fit",
    margin: "small",
  });

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; pageCount: number; totalSize: number } | null>(null);
  const activeResultUrlRef = useRef<string | null>(null);

  // Record recent tool visit on mount
  useEffect(() => {
    recordRecentTool("images-to-pdf");
  }, []);

  // Clean up result object URL on unmount
  useEffect(() => {
    return () => {
      if (activeResultUrlRef.current) {
        URL.revokeObjectURL(activeResultUrlRef.current);
      }
    };
  }, []);

  const handleFilesSelect = async (files: File[]) => {
    setError(null);
    setResult(null);

    const validFiles = files.filter((f) =>
      f.type.startsWith("image/") || f.name.match(/\.(jpe?g|png|webp)$/i)
    );

    if (validFiles.length === 0) {
      setError("Please select valid image files (JPG, PNG, or WebP).");
      return;
    }

    const newItems: ImageItem[] = [];
    for (const f of validFiles) {
      try {
        const dims = await loadImageDimensions(f);
        const previewUrl = URL.createObjectURL(f);
        newItems.push({
          id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
          file: f,
          name: f.name,
          size: f.size,
          width: dims.width,
          height: dims.height,
          previewUrl,
        });
      } catch (err: any) {
        setError(err.message || `Failed to process image: ${f.name}`);
        return;
      }
    }

    setImageList((prev) => [...prev, ...newItems]);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setImageList((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === imageList.length - 1) return;
    setImageList((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleRemoveItem = (id: string) => {
    setImageList((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleClearAll = () => {
    imageList.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setImageList([]);
    setResult(null);
    setError(null);
  };

  const applyPreset = (preset: "a4-doc" | "a4-photo" | "full-photo") => {
    if (preset === "a4-doc") {
      setOptions({ pageSize: "a4", orientation: "portrait", fit: "fit", margin: "small" });
    } else if (preset === "a4-photo") {
      setOptions({ pageSize: "a4", orientation: "portrait", fit: "fit", margin: "none" });
    } else if (preset === "full-photo") {
      setOptions({ pageSize: "original", orientation: "portrait", fit: "fill", margin: "none" });
    }
  };

  const handleConvert = async () => {
    if (imageList.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      if (activeResultUrlRef.current) {
        URL.revokeObjectURL(activeResultUrlRef.current);
      }
      const res = await convertImagesToPdf(imageList, options);
      activeResultUrlRef.current = res.url;
      setResult({
        blob: res.blob,
        url: res.url,
        pageCount: res.pageCount,
        totalSize: res.totalSize,
      });
    } catch (err: any) {
      setError(err.message || "Failed to convert images to PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBlob(result.blob, "kaamkit-images-to-pdf.pdf");
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        <ToolHeader
          title="Images to PDF"
          description="Combine multiple JPG, PNG, or WebP images into one organized PDF document directly in your browser."
          icon={Images}
          categoryName="PDF Tools"
          categoryHref="/tools"
          toolSlug="images-to-pdf"
        />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700">
            {error}
          </div>
        )}

        {/* State 1: Dropzone if no images selected */}
        {imageList.length === 0 && !result && (
          <div className="max-w-2xl mx-auto space-y-6">
            <FileDropzone
              accept="image/jpeg,image/png,image/webp"
              maxSizeBytes={20 * 1024 * 1024}
              multiple={true}
              onFilesSelect={handleFilesSelect}
              title="Click or Drag & Drop Images Here"
              subtitle="Supports JPG, PNG, and WebP up to 20 MB each"
            />
          </div>
        )}

        {/* State 2: Images List & Options */}
        {imageList.length > 0 && !result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image List & Reordering Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h2 className="text-base font-bold text-foreground">
                  Selected Images ({imageList.length})
                </h2>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>Add More</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFilesSelect(Array.from(e.target.files));
                        }
                      }}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-xs h-8 text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {imageList.map((item, index) => (
                  <Card
                    key={item.id}
                    className="p-3 flex items-center justify-between gap-3 bg-white border-border hover:border-border/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="h-6 w-6 rounded-md bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="relative h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border border-border shrink-0">
                        <Image
                          src={item.previewUrl}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.width} × {item.height} px • {formatFileSize(item.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === imageList.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove Image"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Controls & Options Column */}
            <div className="space-y-5">
              <Card className="p-5 space-y-4 bg-white border-border">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Sliders className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-bold text-foreground">PDF Settings</h3>
                </div>

                {/* Presets */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Presets
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPreset("a4-doc")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                    >
                      A4 Document (Small Margins)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("a4-photo")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                    >
                      A4 Photo Document (No Margins)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("full-photo")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                    >
                      Full Page Photo (Original Size)
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-1 italic">
                    Common preset — verify the requirements of the specific exam, portal, or organization.
                  </p>
                </div>

                {/* Page Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Page Size</label>
                  <select
                    value={options.pageSize}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, pageSize: e.target.value as any }))
                    }
                    className="w-full text-xs p-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="letter">Letter (8.5 × 11 in)</option>
                    <option value="original">Original Image Size</option>
                  </select>
                </div>

                {/* Orientation */}
                {options.pageSize !== "original" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Orientation</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOptions((prev) => ({ ...prev, orientation: "portrait" }))}
                        className={`py-1.5 text-xs font-medium rounded-lg border ${
                          options.orientation === "portrait"
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-white border-border text-muted-foreground hover:bg-slate-50"
                        }`}
                      >
                        Portrait
                      </button>
                      <button
                        type="button"
                        onClick={() => setOptions((prev) => ({ ...prev, orientation: "landscape" }))}
                        className={`py-1.5 text-xs font-medium rounded-lg border ${
                          options.orientation === "landscape"
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-white border-border text-muted-foreground hover:bg-slate-50"
                        }`}
                      >
                        Landscape
                      </button>
                    </div>
                  </div>
                )}

                {/* Image Fitting */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Image Fitting</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOptions((prev) => ({ ...prev, fit: "fit" }))}
                      className={`py-1.5 text-xs font-medium rounded-lg border ${
                        options.fit === "fit"
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-white border-border text-muted-foreground hover:bg-slate-50"
                      }`}
                    >
                      Fit to Page
                    </button>
                    <button
                      type="button"
                      onClick={() => setOptions((prev) => ({ ...prev, fit: "fill" }))}
                      className={`py-1.5 text-xs font-medium rounded-lg border ${
                        options.fit === "fill"
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-white border-border text-muted-foreground hover:bg-slate-50"
                      }`}
                    >
                      Fill Page
                    </button>
                  </div>
                </div>

                {/* Margins */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Margins</label>
                  <select
                    value={options.margin}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, margin: e.target.value as any }))
                    }
                    className="w-full text-xs p-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="none">None (0 pt)</option>
                    <option value="small">Small (18 pt)</option>
                    <option value="medium">Medium (36 pt)</option>
                    <option value="large">Large (54 pt)</option>
                  </select>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleConvert}
                  isLoading={isProcessing}
                  className="w-full font-semibold text-sm mt-2"
                >
                  Convert {imageList.length} {imageList.length === 1 ? "Image" : "Images"} to PDF
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* State 3: Result Card */}
        {result && (
          <div className="max-w-xl mx-auto space-y-6">
            <Card className="p-6 text-center space-y-5 bg-white border-border">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <Badge variant="success" className="mb-2">
                  PDF Created Successfully
                </Badge>
                <h3 className="text-xl font-bold text-foreground">
                  kaamkit-images-to-pdf.pdf
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.pageCount} {result.pageCount === 1 ? "page" : "pages"} • {formatFileSize(result.totalSize)}
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
                  Download PDF
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleClearAll}
                  className="w-full sm:w-auto text-xs"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  Convert Another
                </Button>
              </div>
            </Card>
          </div>
        )}

        <RelatedTools currentSlug="images-to-pdf" />
      </Container>
    </div>
  );
}
