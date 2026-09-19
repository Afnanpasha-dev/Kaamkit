import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-muted-foreground ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        {/* Home Item */}
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isCurrent;
          return (
            <li key={item.label} className="inline-flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  className="font-medium text-foreground truncate max-w-[160px] sm:max-w-none"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors truncate max-w-[140px] sm:max-w-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
