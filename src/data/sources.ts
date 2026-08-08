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
    if (!base.overview && r.overview) base.overview = r.overview;
    if (!base.runtime && r.runtime) base.runtime = r.runtime;
    if (!base.posterUrl && r.posterUrl) base.posterUrl = r.posterUrl;
    if (!base.backdropUrl && r.backdropUrl) base.backdropUrl = r.backdropUrl;
    if (base.year === undefined && r.year !== undefined) base.year = r.year;
    if (!base.episode && r.episode) base.episode = r.episode;
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

/* ------------------------------------------------------------------ *
 * Artwork acquisition chain
 * ------------------------------------------------------------------ *
 * Artwork is never sourced from a single provider. Each request walks an
 * ordered chain of candidates and stops at the first usable one; the curated
 * in-vault artwork always terminates the chain, so a poster frame is never
 * empty. Providers are registered here and enabled as they come online.
 */

export type ArtworkKind = "poster" | "backdrop" | "episode" | "show";

export interface ArtworkProvider {
  id: SourceId;
  label: string;
  kinds: ArtworkKind[];
  priority: number;
  active: boolean;
  /** Returns an absolute https URL, or null when this provider has nothing. */
  resolve(req: ArtworkRequest, kind: ArtworkKind): string | null;
}

const httpsOnly = (url?: string | null) =>
  typeof url === "string" && url.startsWith("https://") ? url : null;

export const ARTWORK_PROVIDERS: ArtworkProvider[] = [
  {
    id: "tmdb",
    label: "TMDB artwork",
    kinds: ["poster", "backdrop", "episode", "show"],
    priority: 100,
    active: false,
    resolve: (req, kind) => httpsOnly(kind === "poster" ? req.posterUrl : req.backdropUrl),
  },
  {
    id: "tv-metadata",
    label: "TV metadata artwork",
    kinds: ["episode", "show", "poster"],
    priority: 80,
    active: false,
    resolve: (req, kind) => httpsOnly(kind === "poster" ? req.posterUrl : req.backdropUrl),
  },
  {
    id: "imdb-datasets",
    label: "IMDb artwork",
    kinds: ["poster"],
    priority: 60,
    active: false,
    resolve: (req) => httpsOnly(req.posterUrl),
  },
  {
    id: "collections",
    label: "Curated collection artwork",
    kinds: ["poster", "backdrop"],
    priority: 40,
    active: true,
    resolve: (req, kind) => httpsOnly(kind === "poster" ? req.posterUrl : req.backdropUrl),
  },
  {
    id: "vault-curated",
    label: "Vault curated artwork",
    kinds: ["poster", "backdrop", "episode", "show"],
    priority: 10,
    active: true,
    resolve: (req) => req.localArt,
  },
];

/** Ordered list of every artwork URL worth attempting, best first. */
export function artworkChain(req: ArtworkRequest, kind: ArtworkKind = "poster"): string[] {
  const urls = ARTWORK_PROVIDERS.filter((p) => p.active && p.kinds.includes(kind))
    .sort((a, b) => b.priority - a.priority)
    .map((p) => p.resolve(req, kind))
    .filter((u): u is string => Boolean(u));
  return [...new Set([...urls, req.localArt])];
}

/**
 * onError handler that walks the whole chain instead of failing to one image:
 * each broken candidate advances to the next provider, ending on local art.
 */
export function artworkChainFallback(req: ArtworkRequest, kind: ArtworkKind = "poster") {
  const chain = artworkChain(req, kind);
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const idx = chain.indexOf(img.src);
    const next = chain[idx + 1] ?? req.localArt;
    if (img.src !== next) img.src = next;
  };
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
