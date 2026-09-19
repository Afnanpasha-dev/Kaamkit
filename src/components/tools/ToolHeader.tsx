import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  categoryName: string;
  categoryHref?: string;
  toolSlug: string;
}

export function ToolHeader({
  title,
  description,
  icon: Icon,
  categoryName,
  categoryHref = "/tools",
}: ToolHeaderProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Tools
          </Link>
          <span>/</span>
          <Link
            href={categoryHref}
            className="hover:text-foreground transition-colors"
          >
            {categoryName}
          </Link>
        </div>

        {/* Honest Privacy Badge */}
        <Badge
          variant="success"
          className="text-[11px] font-medium gap-1.5 py-1 px-3"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Local Browser Processing</span>
        </Badge>
      </div>

      {/* Main Title & Description */}
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="h-11 w-11 rounded-xl bg-accent-subtle text-accent flex items-center justify-center border border-accent/20 shrink-0 mt-0.5 sm:mt-0">
          <Icon className="h-6 w-6 stroke-[2]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Trust Notice */}
      <div className="p-3 rounded-lg bg-slate-50 border border-border/80 text-[11px] text-muted-foreground flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span>
          Processed directly in your browser. Your files are not uploaded to KaamKit servers.
        </span>
      </div>
    </div>
  );
}
