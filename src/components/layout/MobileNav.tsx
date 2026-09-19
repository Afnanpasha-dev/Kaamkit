"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight, ShieldCheck, Layers } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CATEGORIES } from "@/config/tools";
import { Button } from "@/components/ui/Button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background shadow-2xl p-6 flex flex-col justify-between border-l border-border transition-transform">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                KK
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">
                Kaam<span className="text-accent">Kit</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>
            {siteConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent-subtle text-accent font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 opacity-40" />
                </Link>
              );
            })}
          </nav>

          {/* Categories Quick Jump */}
          <div className="space-y-1 pt-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Tool Categories
            </div>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/tools?category=${cat.id}`}
                className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer info in drawer */}
        <div className="pt-6 border-t border-border space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Fast, private & built for everyday work</span>
          </div>
          <Link href="/tools" className="block w-full">
            <Button variant="primary" className="w-full text-xs">
              Explore All Tools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
