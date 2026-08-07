/**
 * THE HALLOWEEN VAULT — Streaming Availability Engine
 */

import type { StreamingAvailability, StreamingOffer } from "./types";

const PROVIDER_MAPPINGS: Record<string, string> = {
  "Disney Plus": "Disney+",
  "HBO Max": "Max",
  "Amazon Prime Video": "Prime Video",
  "Apple TV": "Apple TV+",
  "Netflix": "Netflix",
  "Hulu": "Hulu",
  "Peacock": "Peacock",
  "Paramount Plus": "Paramount+",
  "Shudder": "Shudder",
  "Tubi TV": "Tubi",
};

export class StreamingAvailabilityService {
  private cache = new Map<string, StreamingAvailability>();
  private CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

  async fetchAvailability(tmdbId: string, kind: "movie" | "tv"): Promise<StreamingAvailability> {
    const cacheKey = `${kind}-${tmdbId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.lastUpdated < this.CACHE_TTL_MS) {
      return cached;
    }

    const apiKey = (import.meta as any).env?.VITE_TMDB_API_KEY;
    if (!apiKey) return this.getFallbackAvailability();

    try {
      const endpoint = kind === "movie" ? "movie" : "tv";
      const res = await fetch(`https://api.themoviedb.org/3/${endpoint}/${tmdbId}/watch/providers?api_key=${apiKey}`);
      
      if (!res.ok) return this.getFallbackAvailability();
      
      const data = await res.json();
      const usData = data.results?.US;

      if (!usData) return this.getFallbackAvailability();

      const offers: StreamingOffer[] = [];

      if (usData.flatrate) {
        usData.flatrate.forEach((p: any) => {
          offers.push({
            providerName: PROVIDER_MAPPINGS[p.provider_name] || p.provider_name,
            providerId: String(p.provider_id),
            type: "flatrate",
            logoPath: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : undefined
          });
        });
      }

      if (usData.rent) {
        usData.rent.forEach((p: any) => {
          offers.push({
            providerName: PROVIDER_MAPPINGS[p.provider_name] || p.provider_name,
            providerId: String(p.provider_id),
            type: "rent"
          });
        });
      }

      const result: StreamingAvailability = {
        region: "US",
        watchUrl: usData.link || null,
        offers,
        lastUpdated: Date.now()
      };

      this.cache.set(cacheKey, result);
      return result;
    } catch {
      return this.getFallbackAvailability();
    }
  }

  private getFallbackAvailability(): StreamingAvailability {
    return {
      region: "US",
      watchUrl: null,
      offers: [],
      lastUpdated: Date.now()
    };
  }
}

export const streamingEngine = new StreamingAvailabilityService();
