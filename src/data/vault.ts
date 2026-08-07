import type { VaultTitle, OracleMood, OracleResult, SearchOptions, IntentScores } from "./types";
import { calculateIntentScores } from "./seasonal";
import { deduplicateAndMergeTitles, resolveArtwork, episodeEngine } from "./sources";
import { streamingEngine } from "./streaming";

import artWitch from "@/assets/art-witch.jpg";
import artMansion from "@/assets/art-mansion.jpg";
import artAutumn from "@/assets/art-autumn.jpg";
import artCartoon from "@/assets/art-cartoon.jpg";

// Controlled Hydration State
let lastHydrationTime = 0;
const HYDRATION_COOLDOWN_MS = 1000 * 60 * 15; // 15 Minute Throttling

/* Seed Vault Entries */
const SEED_LIBRARY: VaultTitle[] = [
  {
    id: "hocus-pocus",
    externalIds: { tmdb: "10439" },
    kind: "movie",
    title: "Hocus Pocus",
    year: 1993,
    runtime: "1h 36m",
    genres: ["Family", "Fantasy", "Comedy"],
    description: "A curious teen lights the Black Flame Candle and resurrects three wicked witches in Salem on Halloween night.",
    cast: ["Bette Midler", "Sarah Jessica Parker", "Kathy Najimy"],
    intentScores: calculateIntentScores({
      title: "Hocus Pocus",
      description: "A curious teen lights the Black Flame Candle resurrects witches in Salem on Halloween night.",
      genres: ["Family", "Fantasy", "Comedy"],
      year: 1993,
      kind: "movie"
    }),
    categories: ["Classic Halloween", "Family Halloween", "Witch Movies"],
    decade: "1990s",
    tags: ["Halloween", "Witch", "Salem", "Family"],
    artwork: { posterUrl: artWitch, backdropUrl: artWitch, sourceType: "local-fallback", isFallback: false },
    art: artWitch,
    backdropUrl: artWitch,
    streaming: { region: "US", watchUrl: null, offers: [{ providerName: "Disney+", providerId: "337", type: "flatrate" }], lastUpdated: Date.now() },
    lastRefreshed: Date.now()
  },
  {
    id: "sleepy-hollow",
    externalIds: { tmdb: "2668" },
    kind: "movie",
    title: "Sleepy Hollow",
    year: 1999,
    runtime: "1h 45m",
    genres: ["Horror", "Fantasy", "Mystery"],
    description: "Ichabod Crane investigates a series of gruesome murders by a headless horseman in autumn 1799.",
    cast: ["Johnny Depp", "Christina Ricci"],
    intentScores: calculateIntentScores({
      title: "Sleepy Hollow",
      description: "Ichabod Crane investigates a series of gruesome murders by a headless horseman in autumn 1799.",
      genres: ["Horror", "Fantasy", "Mystery"],
      year: 1999,
      kind: "movie"
    }),
    categories: ["Horror", "Cozy Autumn Movies"],
    decade: "1990s",
    tags: ["Fall", "Autumn", "Gothic", "Headless Horseman"],
    artwork: { posterUrl: artMansion, backdropUrl: artMansion, sourceType: "local-fallback", isFallback: false },
    art: artMansion,
    backdropUrl: artMansion,
    streaming: { region: "US", watchUrl: null, offers: [{ providerName: "Paramount+", providerId: "531", type: "flatrate" }], lastUpdated: Date.now() },
    lastRefreshed: Date.now()
  }
];

let masterVaultStore: VaultTitle[] = [...SEED_LIBRARY];

export const titles = masterVaultStore;
export const featured = masterVaultStore[0]!;

/* ------------------------------------------------------------------ *
 * Controlled Background Hydration with Rate-Limit & Caching Guard
 * ------------------------------------------------------------------ */

export async function hydrateVaultBackground(force = false): Promise<void> {
  const now = Date.now();
  if (!force && now - lastHydrationTime < HYDRATION_COOLDOWN_MS) {
    return; // Rate-limit protected
  }
  lastHydrationTime = now;

  try {
    // Background TV Episode Discovery example (The Simpsons, Buffy)
    const simpsonsEps = await episodeEngine.discoverHalloweenEpisodes("The Simpsons", "456");
    const buffyEps = await episodeEngine.discoverHalloweenEpisodes("Buffy the Vampire Slayer", "1426");

    const discovered = [...simpsonsEps, ...buffyEps];
    masterVaultStore = deduplicateAndMergeTitles(masterVaultStore, discovered);
  } catch {
    // Fail gracefully without interrupting user session
  }
}

/* ------------------------------------------------------------------ *
 * Query Engine (Ranked by Intent Scores)
 * ------------------------------------------------------------------ */

export async function queryVault(opts: SearchOptions = {}): Promise<{ results: VaultTitle[]; total: number }> {
  const { query = "", mood, kind, genre, decade, limit = 20, offset = 0 } = opts;

  let pool = [...masterVaultStore];

  if (query.trim()) {
    const q = query.toLowerCase();
    pool = pool.filter((t) => {
      const searchHaystack = [
        t.title,
        t.description,
        t.episodeInfo?.showTitle || "",
        ...t.genres,
        ...t.categories,
        ...t.tags,
      ].join(" ").toLowerCase();
      return searchHaystack.includes(q);
    });
  }

  if (kind) pool = pool.filter((t) => t.kind === kind);
  if (genre) pool = pool.filter((t) => t.genres.includes(genre));
  if (decade) pool = pool.filter((t) => t.decade === decade);

  // Sorting based on Intent Engine Overall Seasonal metric
  pool.sort((a, b) => b.intentScores.overallSeasonal - a.intentScores.overallSeasonal);

  const paginated = pool.slice(offset, offset + limit);

  // Hydrate streaming asynchronously for visible slice
  paginated.forEach((item) => {
    if (item.externalIds.tmdb && item.streaming.offers.length === 0) {
      streamingEngine.fetchAvailability(item.externalIds.tmdb, item.kind === "episode" || item.kind === "show" ? "tv" : "movie")
        .then((avail) => { item.streaming = avail; });
    }
  });

  return { results: paginated, total: pool.length };
}

/* ------------------------------------------------------------------ *
 * Upgraded Halloween Oracle (Multi-Dimensional)
 * ------------------------------------------------------------------ */

export function consultOracle(mood: OracleMood, excludeIds: string[] = []): OracleResult {
  const pool = masterVaultStore.filter((t) => !excludeIds.includes(t.id));
  const activePool = pool.length ? pool : masterVaultStore;

  const scoreMap: Record<OracleMood, keyof IntentScores> = {
    "Scary": "spookyLevel",
    "Spooky": "spookyLevel",
    "Funny": "familyFriendliness",
    "Family": "familyFriendliness",
    "Cozy Fall": "cozyAutumn",
    "Classic": "classicStatus",
    "Animated": "animationScore"
  };

  const targetMetric = scoreMap[mood] || "overallSeasonal";

  const ranked = [...activePool].sort((a, b) => b.intentScores[targetMetric] - a.intentScores[targetMetric]);
  const winner = ranked[0] || masterVaultStore[0]!;

  return {
    title: winner,
    reason: `Chosen by the Oracle for its high score (${winner.intentScores[targetMetric]}/100) in ${mood} seasonal attributes.`,
    matchedScoreKey: targetMetric,
  };
}
// Legacy frontend compatibility exports

export const countdownToHalloween = () => {
  const halloween = new Date(new Date().getFullYear(), 9, 31);
  const now = new Date();

  if (now > halloween) {
    halloween.setFullYear(halloween.getFullYear() + 1);
  }

  const diff = halloween.getTime() - now.getTime();

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};


export const dailyPicks = masterVaultStore.slice(0, 5);


export const decades = [
  ...new Set(masterVaultStore.map((title) => title.decade))
];


export const sections = [
  {
    title: "Featured Halloween",
    items: masterVaultStore.filter(
      (title) => title.intentScores.halloweenIntensity >= 70
    ),
  },
  {
    title: "Cozy Fall",
    items: masterVaultStore.filter(
      (title) => title.intentScores.cozyAutumn >= 50
    ),
  },
  {
    title: "Scary Picks",
    items: masterVaultStore.filter(
      (title) => title.intentScores.spookyLevel >= 50
    ),
  },
];


export async function searchVault(query: string) {
  return queryVault({ query }).then((result) => result.results);
}