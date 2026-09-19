"use client";

import React, { useState, useMemo } from "react";
import { SearchX, Filter, Search } from "lucide-react";
import { ToolCategory } from "@/types/tools";
import { TOOLS, CATEGORIES } from "@/config/tools";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToolCard } from "./ToolCard";
import { Button } from "@/components/ui/Button";

interface ToolCatalogProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  showSearchInput?: boolean;
  initialCategory?: ToolCategory | "all";
}

export function ToolCatalog({
  searchQuery: externalSearchQuery,
  onClearSearch,
  showSearchInput = false,
  initialCategory = "all",
}: ToolCatalogProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">(
    initialCategory
  );

  const activeSearch =
    externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;

  const handleClear = () => {
    if (onClearSearch) {
      onClearSearch();
    } else {
      setInternalSearchQuery("");
    }
  };

  // Filter tools by active category and search query
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      const normalizedQuery = activeSearch.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery === "" ||
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery) ||
        tool.categoryLabel.toLowerCase().includes(normalizedQuery) ||
        tool.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, activeSearch]);

  return (
    <section id="tools" className="py-14 sm:py-20 bg-background">
      <Container size="default">
        {/* Section Heading */}
        <SectionHeader
          eyebrow="Utility Directory"
          title="Tools Built for Quick Results"
          description="Pick a tool below. Most tasks are handled directly inside your browser without uploading your files to any external server."
        />

        {/* Optional Search Input if rendered standalone (e.g. on /tools) */}
        {showSearchInput && (
          <div className="max-w-md mx-auto mb-8">
            <div className="relative flex items-center shadow-subtle rounded-xl border border-border bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
              <div className="pl-3.5 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={activeSearch}
                onChange={(e) => setInternalSearchQuery(e.target.value)}
                placeholder="Search tools by name, task, or format..."
                className="w-full py-2.5 pl-3 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 bg-transparent rounded-xl focus:outline-none"
              />
              {activeSearch && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="mr-3 px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground font-medium rounded hover:bg-muted"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none sm:justify-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === "all"
                ? "bg-accent text-accent-foreground shadow-subtle"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-slate-200"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            All Tools ({TOOLS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = TOOLS.filter((t) => t.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-accent text-accent-foreground shadow-subtle"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-slate-200"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Feedback / Filter Status */}
        {activeSearch && (
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-border text-xs text-muted-foreground">
            <span>
              Showing results for &ldquo;
              <strong className="text-foreground">{activeSearch}</strong>&rdquo; (
              {filteredTools.length} found)
            </span>
            <button
              onClick={handleClear}
              className="text-accent hover:underline font-medium"
            >
              Reset filter
            </button>
          </div>
        )}

        {/* Tool Cards Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center space-y-3 bg-slate-50/50">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <SearchX className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No utilities match your search
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              We couldn&apos;t find any tool matching &ldquo;{activeSearch}&rdquo;. Try another keyword or browse by category.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="mt-2 text-xs"
            >
              Clear Search
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
