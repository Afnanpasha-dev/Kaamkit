"use client";

import React from "react";
import { Search, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTag: (tag: string) => void;
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  onSelectTag,
}: HeroSectionProps) {
  const popularSearches = [
    "Merge PDF",
    "Compress Image",
    "Split PDF",
    "Resize Photo",
    "PDF to Images",
    "Word Counter",
    "QR Generator",
    "Age Calculator",
  ];

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative pt-12 pb-14 sm:pt-20 sm:pb-20 border-b border-border/60 bg-gradient-to-b from-slate-50/70 to-background">
      <Container size="default">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Indian Context Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-subtle border border-accent/20 text-accent text-xs font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping opacity-75" />
            <span>India-First Digital Utilities • 100% Free to Use</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Everyday digital tasks. <br />
            <span className="text-accent">Zero hassle.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Simple tools for PDFs, images, text, and everyday digital tasks. No forced signups, no intrusive popups, and no waiting.
          </p>

          {/* Honest Security & Browser Processing Note */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 text-xs text-emerald-800 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Many KaamKit tools process files directly in your browser.</span>
          </div>

          {/* Interactive Search Bar */}
          <div className="w-full max-w-xl pt-2">
            <div className="relative flex items-center shadow-subtle rounded-2xl border-2 border-border bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all duration-200">
              <div className="pl-3.5 sm:pl-4 text-muted-foreground shrink-0 flex items-center">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  isMobile
                    ? "Search tools (e.g. compress, merge)..."
                    : "What task do you want to get done? (e.g. compress image, merge pdf)"
                }
                className="w-full min-w-0 flex-1 py-3 sm:py-3.5 pl-2.5 sm:pl-3 pr-3 sm:pr-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 bg-transparent rounded-2xl focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                aria-label="Search digital utilities"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="mr-2.5 sm:mr-3 shrink-0 px-2 py-1 text-xs text-muted-foreground hover:text-foreground font-medium rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Popular Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 pt-1 text-xs">
              <span className="text-muted-foreground font-medium flex items-center gap-1 mr-1">
                <Sparkles className="h-3 w-3 text-amber-600" />
                Popular:
              </span>
              {popularSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelectTag(item)}
                  className="px-2.5 py-1 rounded-full bg-muted/80 hover:bg-slate-200 text-slate-700 font-medium transition-colors border border-border/50 text-[11px] sm:text-xs"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Guarantees Mini-Chips */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>No Registration Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Browser-Side Processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Works Fast on 4G & Mobile</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
