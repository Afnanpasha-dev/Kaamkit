const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://kaamkit.com");

export const siteConfig = {
  name: "KaamKit",
  tagline: "Everyday digital tools. Zero hassle.",
  description:
    "Fast, private, mobile-first utility platform built for India. Compress images, manage PDFs, inspect text, and complete your tasks in seconds.",
  url: siteUrl,
  ogImage: `${siteUrl}/og.png`,
  creator: "KaamKit Team",
  links: {
    github: "https://github.com/kaamkit",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "All Tools", href: "/tools" },
    { label: "About", href: "/about" },
  ],
  footerLinks: {
    tools: [
      { label: "PDF Tools", href: "/tools#pdf" },
      { label: "Image Tools", href: "/tools#image" },
      { label: "Text Utilities", href: "/tools#text" },
      { label: "All Utilities", href: "/tools" },
    ],
    platform: [
      { label: "About KaamKit", href: "/about" },
      { label: "All Tools Directory", href: "/tools" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  principles: [
    {
      title: "Fast & Mobile-First",
      description: "Optimized for budget smartphones and everyday 4G networks across India.",
    },
    {
      title: "Privacy First",
      description: "Client-side processing whenever possible. Your files stay on your device.",
    },
    {
      title: "Zero Bloat",
      description: "No forced logins, no spam popups, and no artificial delays. Come, get work done, leave.",
    },
    {
      title: "Clear & Honest",
      description: "No fake AI badges or hidden limits. Clear status on what works and what is coming next.",
    },
  ],
};
