import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About KaamKit",
  description:
    "Learn about KaamKit's mission: delivering clean, fast, and private digital utilities for students and everyday users in India.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 bg-background">
      <Container size="narrow">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-border pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-subtle text-accent text-xs font-semibold">
              <Wrench className="h-3.5 w-3.5" />
              Our Mission
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Built for Real Work. <br />
              <span className="text-accent">Zero Friction.</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Every day, millions of people in India need to compress a photograph for a government exam application, merge certificates into a single PDF, or inspect word count for an assignment. Most existing websites hijack this simple task with deceptive ads, forced logins, and slow performance.
            </p>
          </div>

          {/* Meaning of the Name */}
          <div className="p-6 rounded-2xl border border-border bg-slate-50/50 space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              What does &ldquo;KaamKit&rdquo; mean?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Kaam</strong> means work or task in Hindi. <br />
              <strong className="text-foreground">Kit</strong> represents a reliable toolkit of single-purpose instruments.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Together, KaamKit stands for an uncluttered, dependable digital workshop where you arrive with a task and leave with your result in seconds.
            </p>
          </div>

          {/* Core Principles */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">
              Our Core Principles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {siteConfig.principles.map((principle) => (
                <div
                  key={principle.title}
                  className="p-5 rounded-xl border border-border bg-white space-y-2"
                >
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {principle.title}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Ready to explore our growing utility collection?
            </p>
            <Link href="/tools">
              <Button variant="primary" size="md" className="gap-2 text-xs">
                Browse Digital Utilities
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
