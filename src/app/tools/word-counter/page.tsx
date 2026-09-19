"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Trash2,
  Check,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Real-time calculations
  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsWithoutSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: "0 sec",
        speakingTime: "0 sec",
      };
    }

    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s+/g, "").length;
    const sentences = trimmed.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // Reading time: avg 200 words/min
    const readMinutes = words / 200;
    const readSecs = Math.ceil(readMinutes * 60);
    const readingTime =
      readSecs < 60
        ? `${readSecs} sec`
        : `${Math.floor(readSecs / 60)}m ${readSecs % 60}s`;

    // Speaking time: avg 130 words/min
    const speakMinutes = words / 130;
    const speakSecs = Math.ceil(speakMinutes * 60);
    const speakingTime =
      speakSecs < 60
        ? `${speakSecs} sec`
        : `${Math.floor(speakSecs / 60)}m ${speakSecs % 60}s`;

    return {
      words,
      charsWithSpaces,
      charsWithoutSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    };
  }, [text]);

  // Text Transform helpers
  const toUppercase = () => setText((prev) => prev.toUpperCase());
  const toLowercase = () => setText((prev) => prev.toLowerCase());
  const toTitleCase = () => {
    setText((prev) =>
      prev.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      })
    );
  };
  const toSentenceCase = () => {
    setText((prev) =>
      prev
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    );
  };

  const copyToClipboard = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const clearAll = () => setText("");

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Tools
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="text-xs">
              100% Client-Side
            </Badge>
          </div>
        </div>

        {/* Tool Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent-subtle text-accent flex items-center justify-center border border-accent/20">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Word & Character Counter
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Live statistics, reading speed estimator, and instant case conversion.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <Card className="p-4 text-center bg-white">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Words
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats.words.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Characters
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats.charsWithSpaces.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              No Spaces
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats.charsWithoutSpaces.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sentences
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats.sentences.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Paragraphs
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats.paragraphs.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Reading Time
            </p>
            <p className="text-2xl font-bold text-accent mt-1">
              {stats.readingTime}
            </p>
          </Card>
        </div>

        {/* Editor Area */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here to inspect word count, characters, and reading duration..."
              rows={12}
              className="w-full rounded-2xl border-2 border-border bg-white p-4 sm:p-6 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 shadow-subtle focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 resize-y"
              aria-label="Text to count and analyze"
            />
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl border border-border bg-slate-50">
            {/* Quick transformations */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={toUppercase}
                disabled={!text}
                className="text-xs bg-white"
              >
                UPPERCASE
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toLowercase}
                disabled={!text}
                className="text-xs bg-white"
              >
                lowercase
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toTitleCase}
                disabled={!text}
                className="text-xs bg-white"
              >
                Title Case
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toSentenceCase}
                disabled={!text}
                className="text-xs bg-white"
              >
                Sentence case
              </Button>
            </div>

            {/* Utility actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={copyToClipboard}
                disabled={!text}
                className="text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={!text}
                className="text-xs text-muted-foreground hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Security & Privacy Notice */}
        <div className="mt-8 p-4 rounded-xl border border-border/80 bg-slate-50/70 flex items-start gap-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-foreground">Privacy Note:</strong> This utility runs entirely inside your browser JavaScript runtime. Your text is never transmitted over the internet or logged on any server.
          </p>
        </div>
      </Container>
    </div>
  );
}
