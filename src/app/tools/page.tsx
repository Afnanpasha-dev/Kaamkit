import React from "react";
import type { Metadata } from "next";
import { ToolCatalog } from "@/components/home/ToolCatalog";

export const metadata: Metadata = {
  title: "All Tools — KaamKit",
  description:
    "Simple tools for everyday digital tasks. Compress images, merge PDFs, resize photos, and count words directly in your browser.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsDirectoryPage() {
  return (
    <div className="bg-background min-h-screen py-4 sm:py-6">
      <ToolCatalog showSearchInput={true} showFavoritesAndRecent={true} />
    </div>
  );
}
