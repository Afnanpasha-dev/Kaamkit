"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  QrCode,
  Download,
  RotateCcw,
  AlertTriangle,
  Globe,
  FileText,
  Phone,
  Mail,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { recordRecentTool } from "@/lib/storage";
import { downloadBlob } from "@/lib/image/utils";
import {
  QrContentType,
  QrOptions,
  QrResult,
  formatQrPayload,
  generateQrCode,
  calculateContrastRatio,
} from "@/lib/qr/generator";

export default function QrCodeGeneratorPage() {
  const [contentType, setContentType] = useState<QrContentType>("url");
  const [rawInput, setRawInput] = useState<string>("https://kaamkit.com");

  const [options, setOptions] = useState<QrOptions>({
    size: 300,
    errorCorrectionLevel: "M",
    foregroundColor: "#000000",
    backgroundColor: "#ffffff",
  });

  const [qrResult, setQrResult] = useState<QrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Record recent tool visit on mount
  useEffect(() => {
    recordRecentTool("qr-code-generator");
  }, []);

  const formattedPayload = useMemo(() => {
    return formatQrPayload(contentType, rawInput);
  }, [contentType, rawInput]);

  const contrastRatio = useMemo(() => {
    return calculateContrastRatio(options.foregroundColor, options.backgroundColor);
  }, [options.foregroundColor, options.backgroundColor]);

  const isLowContrast = contrastRatio < 3.0;

  // Generate QR code whenever payload or options change
  useEffect(() => {
    if (!formattedPayload) {
      setQrResult(null);
      return;
    }

    let isSubscribed = true;
    generateQrCode(formattedPayload, options)
      .then((res) => {
        if (isSubscribed) {
          setQrResult(res);
          setError(null);
        }
      })
      .catch((err: any) => {
        if (isSubscribed) {
          setError(err.message || "Could not generate QR code.");
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [formattedPayload, options]);

  const handleDownloadPng = () => {
    if (!qrResult) return;
    const a = document.createElement("a");
    a.href = qrResult.pngDataUrl;
    a.download = "kaamkit-qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = () => {
    if (!qrResult) return;
    const blob = new Blob([qrResult.svgString], { type: "image/svg+xml;charset=utf-8" });
    downloadBlob(blob, "kaamkit-qrcode.svg");
  };

  const handleReset = () => {
    setContentType("url");
    setRawInput("https://kaamkit.com");
    setOptions({
      size: 300,
      errorCorrectionLevel: "M",
      foregroundColor: "#000000",
      backgroundColor: "#ffffff",
    });
    setError(null);
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        <ToolHeader
          title="QR Code Generator"
          description="Create clean, downloadable QR codes for website URLs, text, phone numbers, and emails."
          icon={QrCode}
          categoryName="Utilities"
          categoryHref="/tools"
          toolSlug="qr-code-generator"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Content Type Tabs */}
            <Card className="p-5 space-y-4 bg-white border-border">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                1. Select Content Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setContentType("url")}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    contentType === "url"
                      ? "bg-accent text-accent-foreground border-accent shadow-subtle"
                      : "bg-slate-50 text-muted-foreground border-border hover:bg-slate-100 hover:text-foreground"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>Website URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContentType("text")}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    contentType === "text"
                      ? "bg-accent text-accent-foreground border-accent shadow-subtle"
                      : "bg-slate-50 text-muted-foreground border-border hover:bg-slate-100 hover:text-foreground"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Plain Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContentType("phone")}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    contentType === "phone"
                      ? "bg-accent text-accent-foreground border-accent shadow-subtle"
                      : "bg-slate-50 text-muted-foreground border-border hover:bg-slate-100 hover:text-foreground"
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContentType("email")}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    contentType === "email"
                      ? "bg-accent text-accent-foreground border-accent shadow-subtle"
                      : "bg-slate-50 text-muted-foreground border-border hover:bg-slate-100 hover:text-foreground"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
              </div>

              {/* Dynamic Input Field */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">
                  {contentType === "url" && "Website Address (URL)"}
                  {contentType === "text" && "Text Message"}
                  {contentType === "phone" && "Phone Number"}
                  {contentType === "email" && "Email Address"}
                </label>

                {contentType === "text" ? (
                  <textarea
                    rows={4}
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Enter the text message to encode in the QR code..."
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                ) : (
                  <input
                    type={contentType === "email" ? "email" : contentType === "phone" ? "tel" : "text"}
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder={
                      contentType === "url"
                        ? "e.g. https://example.com"
                        : contentType === "phone"
                        ? "e.g. +91 9876543210"
                        : "e.g. name@example.com"
                    }
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                )}
              </div>
            </Card>

            {/* Customization Settings */}
            <Card className="p-5 space-y-4 bg-white border-border">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Sliders className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold text-foreground">Customization & Colors</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Foreground Color */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Foreground Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={options.foregroundColor}
                      onChange={(e) =>
                        setOptions((prev) => ({ ...prev, foregroundColor: e.target.value }))
                      }
                      className="h-9 w-12 rounded-lg border border-border cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={options.foregroundColor}
                      onChange={(e) =>
                        setOptions((prev) => ({ ...prev, foregroundColor: e.target.value }))
                      }
                      className="w-full text-xs p-2 rounded-lg border border-border font-mono uppercase bg-white"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={options.backgroundColor}
                      onChange={(e) =>
                        setOptions((prev) => ({ ...prev, backgroundColor: e.target.value }))
                      }
                      className="h-9 w-12 rounded-lg border border-border cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={options.backgroundColor}
                      onChange={(e) =>
                        setOptions((prev) => ({ ...prev, backgroundColor: e.target.value }))
                      }
                      className="w-full text-xs p-2 rounded-lg border border-border font-mono uppercase bg-white"
                    />
                  </div>
                </div>

                {/* Image Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Export Resolution</label>
                  <select
                    value={options.size}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, size: Number(e.target.value) }))
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value={200}>200 × 200 px (Compact)</option>
                    <option value={300}>300 × 300 px (Standard)</option>
                    <option value={400}>400 × 400 px (High Res)</option>
                    <option value={500}>500 × 500 px (Print Quality)</option>
                  </select>
                </div>

                {/* Error Correction */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Error Correction Level</label>
                  <select
                    value={options.errorCorrectionLevel}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, errorCorrectionLevel: e.target.value as any }))
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="L">Low (7% recovery)</option>
                    <option value="M">Medium (15% recovery)</option>
                    <option value="Q">Quartile (25% recovery)</option>
                    <option value="H">High (30% recovery)</option>
                  </select>
                </div>
              </div>

              {/* Contrast Warning Banner */}
              {isLowContrast && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Low contrast may make this QR code difficult to scan.</span>
                </div>
              )}
            </Card>
          </div>

          {/* Preview & Download Column */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 text-center space-y-5 bg-white border-border flex flex-col items-center justify-between min-h-[400px]">
              <div className="w-full flex items-center justify-between border-b border-border pb-3">
                <Badge variant="success" className="text-[11px] font-medium gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Live Browser Preview</span>
                </Badge>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* QR Image Display */}
              <div className="my-auto p-4 rounded-2xl border border-border bg-slate-50/50 flex flex-col items-center justify-center">
                {qrResult ? (
                  <div className="relative p-3 rounded-xl bg-white shadow-subtle border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrResult.pngDataUrl}
                      alt="Generated QR Code"
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-48 flex items-center justify-center text-muted-foreground text-xs">
                    {error || "Type content above to generate QR code"}
                  </div>
                )}
              </div>

              {/* Download Buttons */}
              <div className="w-full space-y-2 pt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={!qrResult}
                  onClick={handleDownloadPng}
                  className="w-full gap-2 text-xs sm:text-sm font-semibold"
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!qrResult}
                  onClick={handleDownloadSvg}
                  className="w-full text-xs"
                >
                  Download Vector SVG
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <RelatedTools currentSlug="qr-code-generator" />
      </Container>
    </div>
  );
}
