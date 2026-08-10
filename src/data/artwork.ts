/**
 * ARTWORK PIPELINE — provider agnostic, cache-backed, fail-safe.
 * ---------------------------------------------------------------
 * No artwork API is connected. This module defines the *shape* every future
 * provider must implement (TMDB, IMDb datasets, Fanart, a custom CDN, the
 * local bundled library) plus the resolution order, an in-memory cache and a
 * graceful <img onError> fallback walker.
 *
 * Integration point for a real provider:
 *   1. implement `ArtworkProvider`
 *   2. `registerArtworkProvider(myProvider)` (higher `priority` wins)
 *   3. nothing else in the UI changes — components only call
 *      `artworkCandidates()` / `artworkFallbackHandler()`.
 *
 * Guarantees:
 *   - resolution never throws; a provider that misbehaves is skipped
 *   - the local bundled asset always terminates the chain, so a poster frame
 *     is never empty and a broken remote URL can never blank the UI
 */

import type { SyntheticEvent } from "react";

export type ArtworkKind = "poster" | "backdrop" | "episode" | "show" | "logo";

export interface ArtworkRequest {
  /** Stable id of the work — used as the cache key. */
  id: string;
  title: string;
  year?: number;
  kind?: "movie" | "episode" | "special";
  show?: string;
  season?: number;
  episode?: number;
  /** Bundled asset shipped with the app — the guaranteed last resort. */
  localArt: string;
  /** Optional URLs already attached to the record by a metadata source. */
  posterUrl?: string | null;
  backdropUrl?: string | null;
}

export interface ArtworkProvider {
  id: string;
  label: string;
  kinds: ArtworkKind[];
  /** Higher runs first. Local library is 0 and always last. */
  priority: number;
  active: boolean;
  /**
   * Return an absolute https URL or null. Must be synchronous and cheap:
   * network providers should populate `posterUrl`/`backdropUrl` upstream in
   * the metadata layer, or be added later as an async prefetch step.
   */
  resolve(req: ArtworkRequest, kind: ArtworkKind): string | null;
}

const httpsOnly = (url?: string | null): string | null =>
  typeof url === "string" && url.startsWith("https://") ? url : null;

/* ------------------------------------------------------------------ *
 * Registry
 * ------------------------------------------------------------------ */

const providers: ArtworkProvider[] = [
  {
    id: "record-metadata",
    label: "Metadata source artwork",
    kinds: ["poster", "backdrop", "episode", "show"],
    priority: 100,
    active: true,
    resolve: (req, kind) => httpsOnly(kind === "backdrop" ? req.backdropUrl : req.posterUrl),
  },
  {
    id: "local-library",
    label: "Bundled Vault artwork",
    kinds: ["poster", "backdrop", "episode", "show", "logo"],
    priority: 0,
    active: true,
    resolve: (req) => req.localArt || null,
  },
];

export function registerArtworkProvider(provider: ArtworkProvider) {
  const i = providers.findIndex((p) => p.id === provider.id);
  if (i >= 0) providers.splice(i, 1, provider);
  else providers.push(provider);
  cache.clear();
}

export const artworkProviders = () => [...providers].sort((a, b) => b.priority - a.priority);

/* ------------------------------------------------------------------ *
 * Cache
 * ------------------------------------------------------------------ */

/** Bounded LRU-ish cache: candidate chains are cheap but recomputed often. */
const cache = new Map<string, string[]>();
const CACHE_MAX = 2000;

function remember(key: string, value: string[]) {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
  return value;
}

export const clearArtworkCache = () => cache.clear();

/* ------------------------------------------------------------------ *
 * Resolution
 * ------------------------------------------------------------------ */

/** Ordered list of every URL worth attempting, best first, local art last. */
export function artworkCandidates(req: ArtworkRequest, kind: ArtworkKind = "poster"): string[] {
  const key = `${kind}:${req.id}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const urls: string[] = [];
  for (const p of artworkProviders()) {
    if (!p.active || !p.kinds.includes(kind)) continue;
    try {
      const url = p.resolve(req, kind);
      if (url) urls.push(url);
    } catch {
      /* a broken provider must never break rendering */
    }
  }
  if (req.localArt) urls.push(req.localArt);
  return remember(key, [...new Set(urls)]);
}

/** Best available URL right now. */
export const artworkFor = (req: ArtworkRequest, kind: ArtworkKind = "poster") =>
  artworkCandidates(req, kind)[0] ?? req.localArt;

/**
 * <img onError> handler that walks the whole chain instead of giving up on
 * the first failure. Ends on the bundled asset, so slots never render empty.
 */
export function artworkFallbackHandler(req: ArtworkRequest, kind: ArtworkKind = "poster") {
  const chain = artworkCandidates(req, kind);
  return (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const next = chain[chain.indexOf(img.src) + 1] ?? req.localArt;
    if (next && img.src !== next) img.src = next;
    else img.style.visibility = "hidden"; // graceful: no broken-image icon
  };
}
