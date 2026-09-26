"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Wrench, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleCloseNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  // Listen to search events across pages
  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (typeof customEvent.detail === "string") {
        setHeaderSearch(customEvent.detail);
      }
    };
    window.addEventListener("kaamkit:search", handleSync);
    return () => window.removeEventListener("kaamkit:search", handleSync);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHeaderSearch(val);
    window.dispatchEvent(new CustomEvent("kaamkit:search", { detail: val }));
    if (pathname !== "/" && pathname !== "/tools" && val.trim()) {
      router.push(`/tools?q=${encodeURIComponent(val)}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && headerSearch.trim()) {
      if (pathname !== "/" && pathname !== "/tools") {
        router.push(`/tools?q=${encodeURIComponent(headerSearch.trim())}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container size="default">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Mark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none shrink-0"
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

          {/* Minimal Search Bar in Header (Desktop / Tablet) */}
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm mx-2 lg:mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search for tools..."
                value={headerSearch}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="w-full h-9 pl-9 pr-8 text-xs sm:text-sm text-slate-900 caret-accent bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-border/60 focus:border-accent rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-muted-foreground/70"
                aria-label="Search for tools"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
              />
              {headerSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setHeaderSearch("");
                    window.dispatchEvent(new CustomEvent("kaamkit:search", { detail: "" }));
                  }}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {siteConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label={mobileNavOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-navigation"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={handleCloseNav}
      />
    </header>
  );
}
