"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { PopularTools } from "@/components/home/PopularTools";
import { ToolCatalog } from "@/components/home/ToolCatalog";
import { ValueProps } from "@/components/home/ValueProps";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectTag = (tag: string) => {
    setSearchQuery(tag);
    // Smooth scroll down to search results or popular tools
    const targetElement = document.getElementById("tools") || document.getElementById("popular");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero with Task Search and Explore/Popular CTAs */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectTag={handleSelectTag}
      />

      {/* If user enters a search query, show filtered catalog; otherwise show the 6 Popular Tools */}
      {searchQuery.trim() ? (
        <ToolCatalog
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
        />
      ) : (
        <PopularTools />
      )}

      {/* Value Propositions */}
      <ValueProps />

      {/* 3-Step Explanation */}
      <HowItWorks />

      {/* Security & Privacy Foundation */}
      <TrustSection />
    </div>
  );
}
