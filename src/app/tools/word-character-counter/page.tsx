"use client";

import React, { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  Copy,
  Trash2,
  Check,
  RotateCcw,
  BookOpen,
  Sparkles,
  Info,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ToolHeader } from "@/components/tools/ToolHeader";

export default function WordCharacterCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Real-time calculations with Unicode and Indian language support
  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        characters: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: "0 min",
        speakingTime: "0 min",
      };
    }

    // 1. Total Characters
    const characters = text.length;

    // 2. Characters without whitespace
    const charsNoSpaces = text.replace(/\s/g, "").length;

    // 3. Words: Handles English, Unicode, and Indic scripts using regex or boundary
    // Match consecutive non-whitespace or word sequences
    const wordMatches = trimmed.match(/[\p{L}\p{N}'-]+/gu);
    const words = wordMatches ? wordMatches.length : trimmed.split(/\s+/).filter(Boolean).length;

    // 4. Sentences: Support English (. ! ?) and Indic punctuation (danda । and double danda ॥)
    const sentenceMatches = trimmed.split(/[.!?।॥]+/).map((s) => s.trim()).filter(Boolean);
    const sentences = sentenceMatches.length;

    // 5. Paragraphs: Separated by one or more newlines
    const paragraphs = text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0).length;

    // 6. Reading time estimate (avg 200 words per minute)
    const readMinutes = Math.ceil(words / 200);
    const readingTime = words === 0 ? "0 min" : `${readMinutes} min`;

    // 7. Speaking time estimate (avg 130 words per minute)
    const speakMinutes = Math.ceil(words / 130);
    const speakingTime = words === 0 ? "0 min" : `${speakMinutes} min`;

    return {
      words,
      characters,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    };
  }, [text]);

  // Actions
  const handleClear = () => setText("");

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API restricted
    }
  };

  const handleLoadSample = () => {
    setText(
      "KaamKit provides simple, fast, and private digital utilities designed for everyday Indian users. Whether you are formatting an essay for a competitive exam or preparing a resume, all analysis happens securely in your web browser. नमस्ते भारत! यह एक तेज़ और उपयोगी टूल है।"
    );
  };

  // Text Case Transformations
  const toUppercase = () => setText((prev) => prev.toUpperCase());
  const toLowercase = () => setText((prev) => prev.toLowerCase());
  const toTitleCase = () => {
    setText((prev) =>
      prev.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
      })
    );
  };
  const toSentenceCase = () => {
    setText((prev) =>
      prev
        .toLowerCase()
        .replace(/(^\s*\w|[.!?।॥]\s*\w)/gu, (c) => c.toUpperCase())
    );
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[85vh]">
      <Container size="default">
        {/* Tool Header */}
        <ToolHeader
          title="Word & Character Counter"
          description="Instant word, character, and sentence counter with reading time estimation and case conversion."
          icon={FileSpreadsheet}
          categoryName="Text & Writing"
          categoryHref="/tools"
          toolSlug="word-character-counter"
        />

        {/* Statistics Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <Card className="p-4 text-center bg-white border-border/90">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Words
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              {stats.words.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white border-border/90">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Characters
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              {stats.characters.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white border-border/90">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              No Spaces
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              {stats.charsNoSpaces.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white border-border/90">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Sentences
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              {stats.sentences.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white border-border/90">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Paragraphs
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              {stats.paragraphs.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white border-border/90">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Reading Time
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-accent mt-1">
              {stats.readingTime}
            </p>
          </Card>
        </div>

        {/* Text Area Input */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here to inspect live word count, character count, and reading duration..."
              rows={12}
              className="w-full rounded-2xl border-2 border-border bg-white p-4 sm:p-6 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 shadow-subtle focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 resize-y"
              aria-label="Text to count and analyze"
            />
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-slate-50/70">
            {/* Case transformations */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toUppercase}
                disabled={!text}
                className="text-xs bg-white h-8"
              >
                UPPERCASE
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toLowercase}
                disabled={!text}
                className="text-xs bg-white h-8"
              >
                lowercase
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toTitleCase}
                disabled={!text}
                className="text-xs bg-white h-8"
              >
                Title Case
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toSentenceCase}
                disabled={!text}
                className="text-xs bg-white h-8"
              >
                Sentence case
              </Button>
            </div>

            {/* Utility Actions */}
            <div className="flex items-center gap-2">
              {!text && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadSample}
                  className="text-xs text-accent hover:text-accent-hover h-8 gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Load Sample
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                disabled={!text}
                className="text-xs h-8 gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Text
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={!text}
                className="text-xs text-muted-foreground hover:text-red-600 h-8 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Helpful Usage & Guidelines Section */}
        <div className="mt-12 pt-8 border-t border-border/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-muted-foreground">
          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
              <BookOpen className="h-4 w-4 text-accent" />
              Indian Exam Guidelines
            </div>
            <p className="leading-relaxed">
              Standard civil services essays (e.g. UPSC CSE) typically require 1,000 to 1,200 words. State PSC descriptive answers range between 150 and 250 words.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              Multilingual & Unicode
            </div>
            <p className="leading-relaxed">
              Word count engine correctly processes Latin characters, Devanagari (Hindi/Marathi), Bengali, Tamil, Telugu, and native punctuation including danda (।).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-white space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
              <Info className="h-4 w-4 text-accent" />
              Speaking & Reading Speeds
            </div>
            <p className="leading-relaxed">
              Reading time is calculated at 200 words per minute. Speaking duration for presentations and speeches averages approximately 130 words per minute.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
