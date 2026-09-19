import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "accent" | "success" | "warning" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-muted text-foreground border border-border/80",
    secondary: "bg-slate-100 text-slate-700 border-transparent",
    accent: "bg-accent-subtle text-accent border border-accent/20 font-medium",
    success: "bg-success-subtle text-success border border-success/20 font-medium",
    warning: "bg-warning-subtle text-warning border border-warning/20 font-medium",
    outline: "text-foreground border border-border bg-transparent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
