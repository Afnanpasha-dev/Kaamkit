"use client";

import React from "react";
import { Star } from "lucide-react";
import { useFavorites } from "@/lib/storage";

interface FavoriteButtonProps {
  toolId: string;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function FavoriteButton({
  toolId,
  showLabel = false,
  size = "sm",
  className = "",
}: FavoriteButtonProps) {
  const { isFav, toggle, isLoaded } = useFavorites();
  const favorited = isLoaded && isFav(toolId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(toolId);
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorited}
      title={favorited ? "Favorited" : "Save to favorites"}
      className={`inline-flex items-center gap-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        favorited
          ? "text-amber-500 hover:text-amber-600 bg-amber-50/80 border border-amber-200/80"
          : "text-muted-foreground hover:text-foreground hover:bg-slate-100 border border-transparent"
      } ${
        showLabel ? "px-2.5 py-1 text-xs font-medium" : "p-1.5"
      } ${className}`}
    >
      <Star
        className={`${iconSize} ${
          favorited ? "fill-amber-400 text-amber-500" : "text-muted-foreground/80 hover:text-foreground"
        } transition-transform active:scale-125`}
      />
      {showLabel && (
        <span>{favorited ? "Favorited" : "Favorite"}</span>
      )}
    </button>
  );
}
