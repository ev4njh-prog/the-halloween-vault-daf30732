/**
 * THE HALLOWEEN VAULT — Unified Multi-Source Ingestion Engine
 */

import type { VaultTitle, VaultKind, ArtworkPipeline } from "./types";
import { calculateIntentScores } from "./seasonal";
import { streamingEngine } from "./streaming";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// Fallback visual SVG generator
function generatePlaceholderArt(title: string, category: string): string {
  const encodedTitle = encodeURIComponent(title.length > 22 ? title.substring(0, 20) + "..." : title);
  const encodedCat = encodeURIComponent(category.toUpperCase());
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="100%" height="100%" fill="%230d0714"/><circle cx="250" cy="280" r="140" fill="%23261238"/><text x="50%" y="300" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23f97316" text-anchor="middle">${encodedTitle}</text><text x="50%" y="350" font-family="sans-serif" font-size="14" fill="%23a855f7" text-anchor="middle" letter-spacing="2">${encodedCat}</text></svg>`;
}

export function resolveArtwork(
  title: string,
  category: string,
  posterPath?: string | null,
  backdropPath?: string | null
): ArtworkPipeline {
  if (posterPath && posterPath.startsWith("http")) {
    return {
      posterUrl: posterPath,
      backdropUrl: backdropPath && backdropPath.startsWith("http") ? backdropPath : null,
      sourceType: "tmdb-poster",
      isFallback: false,
    };
  }

  if (posterPath && posterPath.startsWith("/")) {
    return {
      posterUrl: `${TMDB_IMAGE_BASE}/w500${posterPath}`,
      backdropUrl: backdropPath ? `${TMDB_IMAGE_BASE}/w1280${backdropPath}` : null,
      sourceType: "tmdb-poster",
      isFallback: false,
    };
  }

  if (backdropPath && backdropPath.startsWith("/")) {
    return {
      posterUrl: `${TMDB_IMAGE_BASE}/w780${backdropPath}`, // Use backdrop as poster frame if poster missing
      backdropUrl: `${TMDB_IMAGE_BASE}/w1280${backdropPath}`,
      sourceType: "tmdb-backdrop",
      isFallback: false,
    };
  }

  return {
    posterUrl: generatePlaceholderArt(title, category),
    backdropUrl: null,
    sourceType: "seasonal-generated",
    isFallback: true,
  };
}

/* ------------------------------------------------------------------ *
 * Title Deduplication Engine
 * ------------------------------------------------------------------ */

export function buildDeduplicationKey(title: string, year: number, kind: VaultKind, showName?: string): string {
  const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (kind === "episode" && showName) {
    return `ep:${cleanStr(showName)}:${cleanStr(title)}`;
  }
  return `${kind}:${cleanStr(title)}:${year}`;
}

export function deduplicateAndMergeTitles(existing: VaultTitle[], incoming: VaultTitle[]): VaultTitle[] {
  const map = new Map<string, VaultTitle>();

  for (const item of [...existing, ...incoming]) {
    const key = buildDeduplicationKey(
      item.title,
      item.year,
      item.kind,
      item.episodeInfo?.showTitle
    );

    if (!map.has(key)) {
      map.set(key, item);
    } else {
      // Merge records: preserve local curated data over automated external imports
      const current = map.get(key)!;
      map.set(key, {
        ...current,
        externalIds: { ...current.externalIds, ...item.externalIds },
        artwork: current.artwork.isFallback ? item.artwork : current.artwork,
        art: current.artwork.isFallback ? item.art : current.art,
        description: current.description.length > item.description.length ? current.description : item.description,
      });
    }
  }

  return Array.from(map.values());
}

/* ------------------------------------------------------------------ *
 * Extended TV & Special Discovery Engine
 * ------------------------------------------------------------------ */

export class EpisodeDiscoveryEngine {
  async discoverHalloweenEpisodes(showName: string, tmdbShowId: string): Promise<VaultTitle[]> {
    const apiKey = (import.meta as any).env?.VITE_TMDB_API_KEY;
    if (!apiKey) return [];

    try {
      // Fetch details to inspect all seasons
      const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbShowId}?api_key=${apiKey}`);
      if (!res.ok) return [];
      const showData = await res.json();

      const episodeTitles: VaultTitle[] = [];

      // Scan seasons for Halloween themes
      for (const season of (showData.seasons || []).slice(0, 15)) {
        const sRes = await fetch(`https://api.themoviedb.org/3/tv/${tmdbShowId}/season/${season.season_number}?api_key=${apiKey}`);
        if (!sRes.ok) continue;
        const sData = await sRes.json();

        for (const ep of (sData.episodes || [])) {
          const text = `${ep.name} ${ep.overview}`.toLowerCase();
          if (text.includes("halloween") || text.includes("pumpkin") || text.includes("costume") || text.includes("haunted")) {
            const year = parseInt((ep.air_date || showData.first_air_date || "2000").slice(0, 4), 10);
            const artwork = resolveArtwork(ep.name, "Halloween Episode", ep.still_path, showData.backdrop_path);

            const scores = calculateIntentScores({
              title: ep.name,
              description: ep.overview,
              genres: (showData.genres || []).map((g: any) => g.name),
              year,
              kind: "episode"
            });

            episodeTitles.push({
              id: `tmdb-ep-${tmdbShowId}-${ep.season_number}-${ep.episode_number}`,
              externalIds: { tmdb: String(ep.id) },
              kind: "episode",
              title: ep.name,
              episodeInfo: {
                showTitle: showData.name,
                showTmdbId: String(tmdbShowId),
                seasonNumber: ep.season_number,
                episodeNumber: ep.episode_number,
                episodeTitle: ep.name,
                airDate: ep.air_date
              },
              year,
              runtime: `${ep.runtime || 22}m`,
              genres: (showData.genres || []).map((g: any) => g.name),
              description: ep.overview || `A special Halloween episode of ${showData.name}.`,
              cast: [],
              intentScores: scores,
              categories: ["Halloween TV Episodes", "Sitcom Specials"],
              decade: `${Math.floor(year / 10) * 10}s`,
              tags: ["Halloween", "TV Episode"],
              artwork,
              art: artwork.posterUrl,
              backdropUrl: artwork.backdropUrl || undefined,
              streaming: { region: "US", watchUrl: null, offers: [], lastUpdated: Date.now() },
              lastRefreshed: Date.now()
            });
          }
        }
      }

      return episodeTitles;
    } catch {
      return [];
    }
  }
}

export const episodeEngine = new EpisodeDiscoveryEngine();
