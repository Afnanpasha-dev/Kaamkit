import React from "react";
import Link from "next/link";
import { Wrench, Shield, Zap, Lock } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-slate-50/50 mt-auto">
      <Container size="default">
        {/* Core Pillars Mini-Bar */}
        <div className="py-8 border-b border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-xs">Fast & Lightweight</p>
              <p className="text-[11px] leading-normal">Optimized to load fast on any network</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent shrink-0">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-xs">Client-Side First</p>
              <p className="text-[11px] leading-normal">Your files are processed in your browser</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent shrink-0">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-xs">Zero Spam & Popups</p>
              <p className="text-[11px] leading-normal">No forced signups or dark patterns</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
                <Wrench className="h-4 w-4 stroke-[2.2]" />
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">
                Kaam<span className="text-accent">Kit</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              An India-first digital utility platform. Simple, reliable tools to get your daily digital tasks done in seconds.
            </p>
            <div className="pt-2 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">Kaam</span> (work) + <span className="font-semibold text-foreground">Kit</span> (toolkit)
            </div>
          </div>

          {/* Tools Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Tool Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {siteConfig.footerLinks.tools.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              {siteConfig.footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Trust & Transparency
            </h4>
            <ul className="space-y-2 text-xs">
              {siteConfig.footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
              We never store or sell your sensitive documents. No hidden tracking.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {currentYear} KaamKit. Built for everyday Indian users.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
