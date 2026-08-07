// src/hooks/use-streaming.ts
import { useState, useEffect, useCallback } from "react";
import { StreamingProviderId, ALL_STREAMING_PROVIDERS, VaultTitle } from "@/data/seasonal";

const STORAGE_KEY = "autumn_vault_streaming_providers";

export function useStreaming() {
  const [selectedProviders, setSelectedProviders] = useState<StreamingProviderId[]>(() => {
    if (typeof window === "undefined") {
      return ALL_STREAMING_PROVIDERS.map((p) => p.id);
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as StreamingProviderId[];
        }
      }
    } catch {
      // Fallback on error
    }
    // Default to all providers enabled if none saved
    return ALL_STREAMING_PROVIDERS.map((p) => p.id);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProviders));
    } catch (e) {
      console.error("Failed to save streaming preferences:", e);
    }
  }, [selectedProviders]);

  const toggleProvider = useCallback((id: StreamingProviderId) => {
    setSelectedProviders((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedProviders(ALL_STREAMING_PROVIDERS.map((p) => p.id));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedProviders([]);
  }, []);

  const isAvailable = useCallback(
    (item: VaultTitle) => {
      if (!item.streaming || item.streaming.length === 0) return true;
      return item.streaming.some((provider) => selectedProviders.includes(provider));
    },
    [selectedProviders]
  );

  return {
    selectedProviders,
    toggleProvider,
    selectAll,
    clearAll,
    isAvailable,
  };
}
