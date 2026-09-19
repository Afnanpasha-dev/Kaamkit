"use client";

import { useState, useEffect } from "react";

const FAVORITES_KEY = "kaamkit_favorites";
const RECENT_TOOLS_KEY = "kaamkit_recent_tools";
const STORAGE_EVENT_NAME = "kaamkit_storage_update";
const MAX_RECENT_TOOLS = 5;

export interface RecentToolItem {
  toolId: string;
  timestamp: number;
}

/**
 * Checks if browser localStorage is available.
 */
function isStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function dispatchStorageUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(STORAGE_EVENT_NAME));
  }
}

// --------------------------------------------------
// FAVORITES OPERATIONS
// --------------------------------------------------

export function getFavorites(): string[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(toolId: string): boolean {
  const favs = getFavorites();
  return favs.includes(toolId);
}

export function toggleFavorite(toolId: string): boolean {
  if (!isStorageAvailable()) return false;
  try {
    const favs = getFavorites();
    const index = favs.indexOf(toolId);
    let updated: string[];
    let nowFavorited: boolean;

    if (index !== -1) {
      updated = favs.filter((id) => id !== toolId);
      nowFavorited = false;
    } else {
      updated = [...favs, toolId];
      nowFavorited = true;
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    dispatchStorageUpdate();
    return nowFavorited;
  } catch {
    return false;
  }
}

// --------------------------------------------------
// RECENTLY USED TOOLS OPERATIONS
// --------------------------------------------------

export function getRecentTools(): RecentToolItem[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(RECENT_TOOLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is RecentToolItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.toolId === "string" &&
        typeof item.timestamp === "number"
    );
  } catch {
    return [];
  }
}

/**
 * Records a tool visit, strictly deduplicating existing entries
 * and updating the timestamp to the newest position.
 * Safe against React StrictMode duplicate invocations.
 */
export function recordRecentTool(toolId: string): void {
  if (!isStorageAvailable() || !toolId) return;

  try {
    const existing = getRecentTools();
    // Filter out any previous occurrences of this toolId to deduplicate
    const filtered = existing.filter((item) => item.toolId !== toolId);

    // Prepend as the most recent item with current timestamp
    const updated: RecentToolItem[] = [
      { toolId, timestamp: Date.now() },
      ...filtered,
    ].slice(0, MAX_RECENT_TOOLS);

    localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));
    dispatchStorageUpdate();
  } catch {
    // Graceful silent fallback if storage is restricted
  }
}

export function clearRecentTools(): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(RECENT_TOOLS_KEY);
    dispatchStorageUpdate();
  } catch {
    // Graceful fallback
  }
}

// --------------------------------------------------
// REACT HOOKS FOR REACTIVE UI UPDATES
// --------------------------------------------------

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setIsLoaded(true);

    const handleUpdate = () => {
      setFavorites(getFavorites());
    };

    window.addEventListener(STORAGE_EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    favorites,
    isLoaded,
    isFav: (toolId: string) => favorites.includes(toolId),
    toggle: (toolId: string) => toggleFavorite(toolId),
  };
}

export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<RecentToolItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setRecentTools(getRecentTools());
    setIsLoaded(true);

    const handleUpdate = () => {
      setRecentTools(getRecentTools());
    };

    window.addEventListener(STORAGE_EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    recentTools,
    isLoaded,
    clear: clearRecentTools,
  };
}
