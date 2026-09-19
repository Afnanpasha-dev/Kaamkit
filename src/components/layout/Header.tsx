"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Wrench } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container size="default">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Mark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-subtle">
              <Wrench className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground leading-tight">
                Kaam<span className="text-accent">Kit</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground">
                Digital Utilities
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {siteConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-accent bg-accent-subtle font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Area & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <Link href="/tools" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                Find a Tool
              </Button>
            </Link>

            <button
              type="button"
              className="inline-flex md:hidden items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </header>
  );
}
