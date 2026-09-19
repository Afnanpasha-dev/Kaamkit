import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 mb-8 sm:mb-12",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <Badge variant="accent" className="mb-1 text-xs">
          {eyebrow}
        </Badge>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
