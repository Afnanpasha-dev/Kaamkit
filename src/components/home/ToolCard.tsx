import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolDefinition } from "@/types/tools";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: ToolDefinition;
}

// Color map tailored to Smallpdf style & KaamKit brand palette
const TOOL_ICON_COLORS: Record<string, string> = {
  "pdf-to-word": "bg-blue-600",
  "merge-pdf": "bg-purple-600",
  "images-to-pdf": "bg-amber-500",
  "split-pdf": "bg-sky-500",
  "compress-pdf": "bg-orange-500",
  "pdf-to-images": "bg-rose-500",
  "image-compressor": "bg-emerald-600",
  "image-resizer": "bg-indigo-600",
  "image-to-text": "bg-teal-600",
  "word-character-counter": "bg-violet-600",
  "qr-code-generator": "bg-cyan-600",
  "age-calculator": "bg-blue-700",
};

export function ToolCard({ tool }: ToolCardProps) {
  const isReady = tool.status === "active";
  const iconBg = TOOL_ICON_COLORS[tool.slug] || "bg-accent";

  return (
    <Link
      href={isReady ? `/tools/${tool.slug}` : `/tools#${tool.slug}`}
      className="group flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-border/80 hover:border-accent/40 shadow-subtle hover:shadow-hover transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Icon in rounded colored box */}
      <div
        className={cn(
          "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white group-hover:scale-105 transition-transform duration-200",
          iconBg
        )}
      >
        <ToolIcon name={tool.iconName} className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.2]" />
      </div>

      {/* Tool Name & Short Description */}
      <div className="flex-1 min-w-0 pr-1">
        <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-accent transition-colors truncate">
          {tool.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Right Arrow Icon */}
      <div className="shrink-0 pl-1">
        <ChevronRight className="h-5 w-5 text-muted-foreground/60 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </Link>
  );
}
