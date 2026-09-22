"use client";

import React, { useState } from "react";
import { ToolCatalog } from "@/components/home/ToolCatalog";
import { ValueProps } from "@/components/home/ValueProps";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile-First Card-Based Tools Listing */}
      <ToolCatalog
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
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
