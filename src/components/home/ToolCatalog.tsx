"use client";

import React, { useState, useMemo } from "react";
import { SearchX, Filter, Search, Star, History, Trash2 } from "lucide-react";
import { ToolCategory, ToolDefinition } from "@/types/tools";
import { getActiveTools, getActiveCategories, getToolBySlug } from "@/config/tools";
import { useFavorites, useRecentTools } from "@/lib/storage";
import { Container } from "@/components/ui/Container";
import { ToolCard } from "./ToolCard";
import { Button } from "@/components/ui/Button";

interface ToolCatalogProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  showSearchInput?: boolean;
  showFavoritesAndRecent?: boolean;
  initialCategory?: ToolCategory | "all";
}

export function ToolCatalog({
  searchQuery: externalSearchQuery,
  onClearSearch,
  showSearchInput = false,
  showFavoritesAndRecent = true,
  initialCategory = "all",
}: ToolCatalogProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">(
    initialCategory
  );

  const activeTools = useMemo(() => getActiveTools(), []);
  const activeCategories = useMemo(() => getActiveCategories(), []);

  const { favorites, isLoaded: favsLoaded } = useFavorites();
  const { recentTools, isLoaded: recentsLoaded, clear: clearRecent } = useRecentTools();

  const activeSearch =
    externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;

  const handleClear = () => {
    if (onClearSearch) {
      onClearSearch();
    } else {
      setInternalSearchQuery("");
    }
  };

  // Resolve Favorite Tools (only active ones)
  const favoritedTools = useMemo(() => {
    if (!favsLoaded) return [];
    return favorites
      .map((id) => getToolBySlug(id))
      .filter((t): t is ToolDefinition => Boolean(t && t.status === "active"));
  }, [favorites, favsLoaded]);

  // Resolve Recently Used Tools (only active ones, preserving deduplicated order)
  const recentToolDefs = useMemo(() => {
    if (!recentsLoaded) return [];
    return recentTools
      .map((item) => getToolBySlug(item.toolId))
      .filter((t): t is ToolDefinition => Boolean(t && t.status === "active"));
  }, [recentTools, recentsLoaded]);

  // Filter tools by active category and search query
  const filteredTools = useMemo(() => {
    const normalizedQuery = activeSearch.trim().toLowerCase();

    return activeTools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      if (normalizedQuery === "") {
        return matchesCategory;
      }

      const nameMatch = tool.name.toLowerCase().includes(normalizedQuery);
      const descMatch = tool.description.toLowerCase().includes(normalizedQuery);
      const catMatch = tool.categoryLabel.toLowerCase().includes(normalizedQuery);
      const catIdMatch = tool.category.toLowerCase().includes(normalizedQuery);
      const keywordMatch = tool.keywords?.some((k) =>
        k.toLowerCase().includes(normalizedQuery)
      );

      const matchesQuery =
        nameMatch || descMatch || catMatch || catIdMatch || Boolean(keywordMatch);

      return matchesCategory && matchesQuery;
    });
  }, [activeTools, selectedCategory, activeSearch]);

  const isSearching = activeSearch.trim().length > 0;

  return (
    <section id="tools" className="py-8 sm:py-12 bg-background">
      <Container size="default">
        {/* Optional Search Input if rendered standalone (e.g. on /tools) */}
        {showSearchInput && (
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative flex items-center shadow-subtle rounded-2xl border-2 border-border bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all duration-200">
              <div className="pl-4 text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={activeSearch}
                onChange={(e) => setInternalSearchQuery(e.target.value)}
                placeholder="Search tools by name, task, or keywords..."
                className="w-full py-3 pl-3 pr-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 bg-transparent rounded-2xl focus:outline-none"
                aria-label="Search all tools"
              />
              {activeSearch && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="mr-3 px-2 py-1 text-xs text-muted-foreground hover:text-foreground font-medium rounded-md hover:bg-muted"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Search Results Mode */}
        {isSearching ? (
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-border text-sm text-muted-foreground">
              <span>
                Showing results for &ldquo;
                <strong className="text-foreground">{activeSearch}</strong>&rdquo; (
                {filteredTools.length} found)
              </span>
              <button
                onClick={handleClear}
                className="text-accent hover:underline font-medium text-xs sm:text-sm"
              >
                Clear search
              </button>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
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
          </div>
        ) : (
          /* Normal Discovery Mode */
          <div className="space-y-12">
            {/* Section 1: Favorites (Only if user has >= 1 favorite) */}
            {showFavoritesAndRecent && favsLoaded && favoritedTools.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/70 pb-3">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    Favorites
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {favoritedTools.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {favoritedTools.map((tool) => (
                    <ToolCard key={`fav-${tool.id}`} tool={tool} />
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Recently Used (Only if user has >= 1 recent tool) */}
            {showFavoritesAndRecent && recentsLoaded && recentToolDefs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-accent" />
                    <h2 className="text-lg font-bold tracking-tight text-foreground">
                      Recently Used
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-subtle text-accent border border-accent/20">
                      {recentToolDefs.length}
                    </span>
                  </div>
                  <button
                    onClick={clearRecent}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 rounded px-1.5 py-0.5"
                    aria-label="Clear recent history"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear history</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recentToolDefs.map((tool) => (
                    <ToolCard key={`recent-${tool.id}`} tool={tool} />
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: All Tools & Category Filter */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    All Tools
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Browse utilities by category. Everything processes locally in your browser.
                  </p>
                </div>

                {/* Category Filter Tabs - Only active categories displayed */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      selectedCategory === "all"
                        ? "bg-accent text-accent-foreground shadow-subtle"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-slate-200"
                    }`}
                  >
                    <Filter className="h-3 w-3" />
                    <span>All</span>
                    <span className="text-[11px] opacity-80">({activeTools.length})</span>
                  </button>
                  {activeCategories.map((cat) => {
                    const count = activeTools.filter((t) => t.category === cat.id).length;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-accent text-accent-foreground shadow-subtle"
                            : "bg-muted text-muted-foreground hover:text-foreground hover:bg-slate-200"
                        }`}
                      >
                        <span>{cat.name.replace(" Tools", "")}</span>
                        <span className="text-[11px] opacity-80">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid of Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
