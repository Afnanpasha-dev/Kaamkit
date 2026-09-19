import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getPopularTools } from "@/config/tools";
import { Container } from "@/components/ui/Container";
import { ToolCard } from "./ToolCard";

export function PopularTools() {
  const popularTools = getPopularTools();

  return (
    <section id="popular" className="py-14 sm:py-20 bg-background border-b border-border/60">
      <Container size="default">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Most Used Utilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Popular Tools
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              The utilities people reach for most often.
            </p>
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors group self-start sm:self-auto"
          >
            <span>Explore all tools</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </Container>
    </section>
  );
}
