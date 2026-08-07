/**
 * Metadata source architecture.
 * -----------------------------
 * The Vault is provider-agnostic: the local curated library is just one source.
 * Additional sources (TMDB, IMDb datasets, TV metadata databases, community
 * recommendations, curated collections, user submissions) implement the same
 * interface and are merged by `mergeRecords`, so discovery never depends on a
 * single trending feed.
 *
 * Only the local curated source is active today; the rest are registered as
 * inactive adapters so they can be switched on without reshaping the app.
 */

import type { VaultTitle } from "./vault";

export type SourceId =
  | "vault-curated"
  | "tmdb"
  | "imdb-datasets"
  | "tv-metadata"
  | "community"
  | "collections"
  | "user-submissions";

export interface SourceRecord {
  sourceId: SourceId;
  externalId?: string;
  title: string;
  year?: number;
  overview?: string;
  genres?: string[];
  keywords?: string[];
  cast?: string[];
  runtime?: string;
  posterUrl?: string;
  backdropUrl?: string;
  episode?: { show: string; season: number; number: number; summary?: string };
  /** How much this source is trusted when fields conflict (0–1). */
  confidence: number;
}

export interface MetadataSource {
  id: SourceId;
  label: string;
  /** Kinds of data this provider contributes. */
  provides: Array<"metadata" | "artwork" | "episodes" | "cast" | "curation">;
  active: boolean;
  search(query: string): Promise<SourceRecord[]>;
}

/** Merges records for the same work, preferring higher-confidence fields. */
export function mergeRecords(records: SourceRecord[]): SourceRecord | null {
  if (records.length === 0) return null;
  const ordered = [...records].sort((a, b) => b.confidence - a.confidence);
  const base = { ...ordered[0]! };
  for (const r of ordered.slice(1)) {
    base.overview ||= r.overview;
    base.runtime ||= r.runtime;
    base.posterUrl ||= r.posterUrl;
    base.backdropUrl ||= r.backdropUrl;
    base.year ??= r.year;
    base.episode ??= r.episode;
    base.genres = [...new Set([...(base.genres ?? []), ...(r.genres ?? [])])];
    base.keywords = [...new Set([...(base.keywords ?? []), ...(r.keywords ?? [])])];
    base.cast = [...new Set([...(base.cast ?? []), ...(r.cast ?? [])])];
  }
  return base;
}

/* ------------------------------------------------------------------ *
 * Artwork resolution with graceful fallback
 * ------------------------------------------------------------------ */

export interface ArtworkRequest {
  title: string;
  localArt: string;
  posterUrl?: string | null;
  backdropUrl?: string | null;
}

/**
 * Prefers real provider artwork, falls back to curated in-vault artwork and
 * never renders an empty poster frame.
 */
export function resolvePoster({ localArt, posterUrl }: ArtworkRequest) {
  return posterUrl?.startsWith("https://") ? posterUrl : localArt;
}

export function resolveBackdrop({ localArt, backdropUrl }: ArtworkRequest) {
  return backdropUrl?.startsWith("https://") ? backdropUrl : localArt;
}

/** Applied on <img onError> so a broken remote poster degrades to local art. */
export function artworkFallback(localArt: string) {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== localArt) img.src = localArt;
  };
}

/* ------------------------------------------------------------------ *
 * Registry
 * ------------------------------------------------------------------ */

const curatedSource: MetadataSource = {
  id: "vault-curated",
  label: "Vault curated library",
  provides: ["metadata", "artwork", "episodes", "cast", "curation"],
  active: true,
  async search() {
    return [];
  },
};

const inactive = (
  id: SourceId,
  label: string,
  provides: MetadataSource["provides"],
): MetadataSource => ({
  id,
  label,
  provides,
  active: false,
  async search() {
    return [];
  },
});

export const SOURCES: MetadataSource[] = [
  curatedSource,
  inactive("tmdb", "TMDB", ["metadata", "artwork", "cast", "episodes"]),
  inactive("imdb-datasets", "IMDb datasets", ["metadata", "cast"]),
  inactive("tv-metadata", "TV metadata database", ["episodes", "metadata"]),
  inactive("community", "Community recommendations", ["curation"]),
  inactive("collections", "Curated Halloween collections", ["curation"]),
  inactive("user-submissions", "User submissions", ["curation", "metadata"]),
];

export const activeSources = () => SOURCES.filter((s) => s.active);

/** Fan-out search across active sources; local library stays authoritative. */
export async function searchSources(query: string, local: VaultTitle[]) {
  const remote = await Promise.all(activeSources().map((s) => s.search(query).catch(() => [])));
  return { local, remote: remote.flat() };
}
