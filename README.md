# KaamKit — India-First Digital Utility Platform

**KaamKit** is a fast, lightweight, mobile-first utility platform built for everyday Indian users.

> **"Kaam"** (work/task) + **"Kit"** (collection of tools) = A simple, dependable workspace where you come with a task and get your result in seconds.

---

## 🎯 Guiding Principles

- **Useful > Flashy**: Single-purpose tools that solve real problems without distracting clutter.
- **Quality > Quantity**: Clean, strictly typed components and zero deceptive mock features.
- **Security & Privacy**: Client-side execution inside the browser whenever technically feasible. No permanent file retention.
- **Made for India**: Optimized for budget smartphones, 4G networks, and real Indian use cases (government forms, exam photo resizing, college study aids).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with CSS Variables design tokens
- **Icons**: Lucide Icons (Featherweight, tree-shaken SVGs)
- **Deployment**: Vercel-ready static/edge configuration

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+

### Development
```bash
npm run dev
```

### Type Checking & Linting
```bash
npm run typecheck
npm run lint
```

### Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── layout.tsx             # Root layout with SEO metadata, JSON-LD, Header & Footer
│   ├── page.tsx               # Homepage with instant task search & tool catalog
│   ├── loading.tsx            # Global skeleton loading state
│   ├── error.tsx              # Resilient error boundary
│   ├── not-found.tsx          # 404 handler
│   ├── robots.ts              # Dynamic robots.txt
│   ├── sitemap.ts             # Dynamic XML sitemap
│   ├── icon.svg               # Brand SVG mark
│   ├── tools/
│   │   ├── page.tsx           # All tools directory
│   │   └── word-counter/      # Real, client-side active utility
│   ├── about/page.tsx         # Platform mission & principles
│   ├── privacy/page.tsx       # Plain-language, honest privacy policy
│   └── terms/page.tsx         # Clear fair usage terms
├── components/
│   ├── layout/                # Header, Footer, MobileNav
│   ├── home/                  # HeroSection, ToolCatalog, ToolCard, ValueProps, HowItWorks, TrustSection
│   └── ui/                    # Button, Card, Badge, Input, Container, SectionHeader, ToolIcon
├── config/
│   ├── site.ts                # Site metadata & navigation links
│   └── tools.ts               # Strongly typed registry for all utilities
├── types/
│   └── tools.ts               # TypeScript contracts
└── lib/
    └── utils.ts               # cn() helper combining clsx and tailwind-merge
```
