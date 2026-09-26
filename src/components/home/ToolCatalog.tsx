"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SearchX, Search, Star, History, Trash2, X } from "lucide-react";
import { ToolCategory, ToolDefinition } from "@/types/tools";
import { getActiveTools, getActiveCategories, getToolBySlug } from "@/config/tools";
import { useFavorites, useRecentTools } from "@/lib/storage";
import { Container } from "@/components/ui/Container";
import { ToolCard } from "./ToolCard";
import { Button } from "@/components/ui/Button";

interface ToolCatalogProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onClearSearch?: () => void;
  showSearchInput?: boolean;
  showFavoritesAndRecent?: boolean;
  initialCategory?: ToolCategory | "all";
}

export function ToolCatalog({
  searchQuery: externalSearchQuery,
  onSearchChange,
  onClearSearch,
  showSearchInput = true,
  showFavoritesAndRecent = true,
  initialCategory = "all",
}: ToolCatalogProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(
    externalSearchQuery ?? ""
  );
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">(
    initialCategory
  );

  const activeTools = useMemo(() => getActiveTools(), []);
  const activeCategories = useMemo(() => getActiveCategories(), []);

  const { favorites, isLoaded: favsLoaded } = useFavorites();
  const { recentTools, isLoaded: recentsLoaded, clear: clearRecent } = useRecentTools();

  // Sync internal state when externalSearchQuery prop changes
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setInternalSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // Listen to header search events or URL params
  useEffect(() => {
    const handleCustomSearch = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (typeof customEvent.detail === "string") {
        setInternalSearchQuery(customEvent.detail);
      }
    };
    window.addEventListener("kaamkit:search", handleCustomSearch);

    // Read URL param ?q= if present on initial load
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        setInternalSearchQuery(q);
      }
    }

    return () => window.removeEventListener("kaamkit:search", handleCustomSearch);
  }, []);

  const isControlled = externalSearchQuery !== undefined && onSearchChange !== undefined;
  const activeSearch = isControlled ? externalSearchQuery : internalSearchQuery;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalSearchQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("kaamkit:search", { detail: val })
      );
    }
  };

  const handleClear = () => {
    if (onClearSearch) {
      onClearSearch();
    }
    if (onSearchChange) {
      onSearchChange("");
    }
    setInternalSearchQuery("");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kaamkit:search", { detail: "" }));
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
    <section id="tools" className="py-6 sm:py-10 bg-background">
      <Container size="default">
        {/* Clean, Minimal Search Bar matching Smallpdf specification */}
        {showSearchInput && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={activeSearch}
                onChange={handleInputChange}
                placeholder="Search for tools..."
                className="w-full py-3.5 pl-12 pr-11 text-base text-slate-900 placeholder:text-muted-foreground/70 bg-white border border-border rounded-2xl shadow-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all duration-200 caret-accent"
                aria-label="Search for tools"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
              />
              {activeSearch && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground focus-visible:outline-none"
                  aria-label="Clear search"
                >
                  <span className="p-1 rounded-lg hover:bg-muted transition-colors flex items-center justify-center">
                    <X className="h-4 w-4" />
                  </span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
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
                  We couldn&apos;t find any tool matching &ldquo;{activeSearch}&rdquo;. Try another keyword or browse all tools.
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
          <div className="space-y-10">
            {/* Section 1: Favorites (Only if user has >= 1 favorite) */}
            {showFavoritesAndRecent && favsLoaded && favoritedTools.length > 0 && (
              <div id="favorites" className="space-y-3.5 scroll-mt-20">
                <div className="flex items-center gap-2 border-b border-border/70 pb-2.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                    Favorites
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {favoritedTools.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {favoritedTools.map((tool) => (
                    <ToolCard key={`fav-${tool.id}`} tool={tool} />
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Recently Used (Only if user has >= 1 recent tool) */}
            {showFavoritesAndRecent && recentsLoaded && recentToolDefs.length > 0 && (
              <div id="recent" className="space-y-3.5 scroll-mt-20">
                <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-accent" />
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {recentToolDefs.map((tool) => (
                    <ToolCard key={`recent-${tool.id}`} tool={tool} />
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Our Tools (Main Card List) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    Our Tools
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Simple. Fast. Useful. 12 tools to get things done.
                  </p>
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      selectedCategory === "all"
                        ? "bg-accent text-accent-foreground shadow-xs"
                        : "bg-slate-100 text-muted-foreground hover:text-foreground hover:bg-slate-200"
                    }`}
                  >
                    <span>All</span>
                    <span className="text-[10px] opacity-80">({activeTools.length})</span>
                  </button>
                  {activeCategories.map((cat) => {
                    const count = activeTools.filter((t) => t.category === cat.id).length;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-accent text-accent-foreground shadow-xs"
                            : "bg-slate-100 text-muted-foreground hover:text-foreground hover:bg-slate-200"
                        }`}
                      >
                        <span>{cat.name.replace(" Tools", "")}</span>
                        <span className="text-[10px] opacity-80">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1 Column on Mobile, 2 Columns on Tablet/Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
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
