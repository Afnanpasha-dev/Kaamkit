import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  applicationName: "KaamKit",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KaamKit",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  title: {
    default: "KaamKit — Everyday Digital Utilities for India",
    template: "%s | KaamKit",
  },
  description: siteConfig.description,
  keywords: [
    "digital utilities India",
    "compress image online",
    "merge pdf free",
    "word counter tool",
    "photo resizer for SSC UPSC",
    "fast mobile tools India",
    "KaamKit",
  ],
  authors: [{ name: "KaamKit Team" }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: "KaamKit — Everyday Digital Utilities for India",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: "KaamKit — Everyday Digital Utilities for India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KaamKit — Everyday Digital Utilities for India",
    description: siteConfig.description,
    creator: "@kaamkit",
    images: [`${siteConfig.url}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "KaamKit",
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/tools?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
