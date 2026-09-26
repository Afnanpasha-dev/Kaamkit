"use client";

import React from "react";
import { ToolCatalog } from "@/components/home/ToolCatalog";
import { ValueProps } from "@/components/home/ValueProps";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile-First Card-Based Tools Listing */}
      <ToolCatalog
        showSearchInput={true}
        showFavoritesAndRecent={true}
      />

      {/* Value Propositions */}
      <ValueProps />

      {/* 3-Step Explanation */}
      <HowItWorks />

      {/* Security & Privacy Foundation */}
      <TrustSection />
    </div>
  );
}
