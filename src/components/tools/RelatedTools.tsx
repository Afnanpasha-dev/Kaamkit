import React from "react";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { getRelatedTools } from "@/config/tools";
import { ToolCard } from "@/components/home/ToolCard";

interface RelatedToolsProps {
  currentSlug: string;
}

export function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const related = getRelatedTools(currentSlug);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border/80" aria-label="Related digital tools">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <Wrench className="h-3.5 w-3.5 text-accent" />
            <span>Need Another Tool?</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Frequently Used Together
          </h2>
        </div>

        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors group self-start sm:self-auto"
        >
          <span>All tools</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {related.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
