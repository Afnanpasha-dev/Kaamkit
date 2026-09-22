"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Home,
  Wrench,
  Star,
  History,
  Info,
  HelpCircle,
  Headphones,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when pathname changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const menuItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "All Tools", href: "/tools", icon: Wrench },
    { label: "Favorites", href: "/#favorites", icon: Star },
    { label: "Recent", href: "/#recent", icon: History },
    { label: "About", href: "/about", icon: Info },
    { label: "Help", href: "/#how-it-works", icon: HelpCircle },
    {
      label: "Customer Support",
      href: "mailto:support@kaamkit.com?subject=KaamKit%20Support%20Request",
      icon: Headphones,
      isExternal: true,
    },
  ];

  const handleNavClick = (href: string) => {
    onClose();
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (pathname === "/") {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const drawerContent = (
    <div
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className="fixed inset-0 z-[9999] md:hidden"
    >
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Solid drawer panel with isolated stacking context */}
      <aside className="fixed inset-y-0 right-0 w-full max-w-[340px] bg-white text-slate-900 shadow-2xl z-[10000] border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white shrink-0">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-subtle">
              <Wrench className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                Kaam<span className="text-accent">Kit</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-slate-500">
                Digital Utilities
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          <nav className="space-y-1.5" aria-label="Mobile menu links">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Menu
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href === "/tools"
                  ? pathname === "/tools"
                  : item.href === "/about"
                  ? pathname === "/about"
                  : false;

              if (item.isExternal) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-accent-subtle text-accent font-bold shadow-xs"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 ${
                      isActive ? "text-accent" : "text-slate-400"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Solid Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Fast, private & built for everyday work</span>
          </div>
          <Link href="/tools" onClick={onClose} className="block w-full">
            <Button variant="primary" className="w-full text-xs font-semibold h-10">
              Explore All Tools
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
