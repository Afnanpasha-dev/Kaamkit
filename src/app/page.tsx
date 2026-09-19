"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ToolCatalog } from "@/components/home/ToolCatalog";
import { ValueProps } from "@/components/home/ValueProps";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectTag = (tag: string) => {
    setSearchQuery(tag);
    // Smooth scroll down to tool catalog if needed
    const catalogElement = document.getElementById("tools");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero with Task Search */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectTag={handleSelectTag}
      />

      {/* Directory & Interactive Tool Grid */}
      <ToolCatalog
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
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
