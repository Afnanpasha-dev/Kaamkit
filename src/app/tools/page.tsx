import React from "react";
import type { Metadata } from "next";
import { ToolCatalog } from "@/components/home/ToolCatalog";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "All Digital Utilities & Tools",
  description:
    "Explore the complete directory of KaamKit digital tools. PDF converters, image compressors, text utilities, and study aids.",
};

export default function ToolsDirectoryPage() {
  return (
    <div className="py-8">
      <Container size="default">
        <div className="mb-2 pb-6 border-b border-border">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            All Digital Utilities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse our full catalog of fast, private tools for students, job applicants, and professionals.
          </p>
        </div>
      </Container>
      <ToolCatalog showSearchInput={true} />
    </div>
  );
}
