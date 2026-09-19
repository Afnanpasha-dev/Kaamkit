import React from "react";
import type { Metadata } from "next";
import { ToolCatalog } from "@/components/home/ToolCatalog";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "All Tools — KaamKit",
  description:
    "Simple tools for everyday digital tasks. Compress images, merge PDFs, resize photos, and count words directly in your browser.",
};

export default function ToolsDirectoryPage() {
  return (
    <div className="py-8 sm:py-12 bg-background min-h-screen">
      <Container size="default">
        {/* Clean Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 pb-6 border-b border-border/60">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            All tools, one place.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
            Simple tools for everyday digital tasks.
          </p>
        </div>
      </Container>
      <ToolCatalog showSearchInput={true} showFavoritesAndRecent={true} />
    </div>
  );
}
