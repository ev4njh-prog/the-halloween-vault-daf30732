/**
 * THE HALLOWEEN VAULT — Master Data & Compatibility Layer
 */

import type {
  VaultTitle,
  OracleMood,
  OracleResult,
  SearchOptions,
  IntentScores,
  ArtworkPipeline,
  StreamingAvailability,
} from "./types";
import { calculateIntentScores } from "./seasonal";
import { deduplicateAndMergeTitles, episodeEngine } from "./sources";
import { streamingEngine } from "./streaming";

import artWitch from "@/assets/art-witch.jpg";
import artMansion from "@/assets/art-mansion.jpg";
import artAutumn from "@/assets/art-autumn.jpg";
import artCartoon from "@/assets/art-cartoon.jpg";

// Controlled Hydration Throttle State
let lastHydrationTime = 0;
const HYDRATION_COOLDOWN_MS = 1000 * 60 * 15; // 15 Minute Throttling

/* ------------------------------------------------------------------ *
 * Master Seed Library (Upgraded Schema & Intent Scores)
 * ------------------------------------------------------------------ */

const SEED_LIBRARY_RAW = [
  {
    id: "hocus-pocus",
    externalIds: { tmdb: "10439" },
    kind: "movie" as const,
    title: "Hocus Pocus",
    year: 1993,
    runtime: "1h 36m",
    genres: ["Family", "Fantasy", "Comedy"],
    description:
      "A curious teen lights the Black Flame Candle and resurrects three wicked witches in Salem on Halloween night.",
    cast: ["Bette Midler", "Sarah Jessica Parker", "Kathy Najimy"],
    director: "Kenny Ortega",
    categories: ["Classic Halloween", "Family Halloween", "Witch Movies"],
    decade: "1990s",
    tags: ["Halloween", "Witch", "Salem", "Family"],
    art: artWitch,
    backdropUrl: artWitch,
    streaming: {
      region: "US",
      watchUrl: null,
      offers: [{ providerName: "Disney+", providerId: "337", type: "flatrate" as const }],
      lastUpdated: Date.now(),
    },
  },
  {
    id: "halloweentown",
    externalIds: { tmdb: "13388" },
    kind: "movie" as const,
    title: "Halloweentown",
    year: 1998,
    runtime: "1h 24m",
    genres: ["Family", "Fantasy"],
    description:
      "Marnie discovers she descends from a line of witches and steps through a portal into a town where every night is Halloween.",
    cast: ["Debbie Reynolds", "Kimberly J. Brown"],
    director: "Duwayne Dunham",
    categories: ["Family Halloween", "Witch Movies", "Classic Halloween"],
    decade: "1990s",
    tags: ["Halloween", "Witch", "Portal", "Family"],
    art: artWitch,
    backdropUrl: artWitch,
    streaming: {
      region: "US",
      watchUrl: null,
      offers: [{ providerName: "Disney+", providerId: "337", type: "flatrate" as const }],
      lastUpdated: Date.now(),
    },
  },
  {
    id: "nightmare-before-christmas",
    externalIds: { tmdb: "9479" },
    kind: "movie" as const,
    title: "The Nightmare Before Christmas",
    year: 1993,
    runtime: "1h 16m",
    genres: ["Animation", "Musical", "Fantasy"],
    description:
      "Jack Skellington, the Pumpkin King, grows tired of the same old scares and stumbles into a holiday of snow and light.",
    cast: ["Danny Elfman", "Chris Sarandon", "Catherine O'Hara"],
    director: "Henry Selick",
    categories: ["Animated Halloween", "Classic Halloween", "Monster Movies"],
    decade: "1990s",
    tags: ["Halloween", "Pumpkin King", "Animation", "Musical"],
    art: artCartoon,
    backdropUrl: artCartoon,
    streaming: {
      region: "US",
      watchUrl: null,
      offers: [{ providerName: "Disney+", providerId: "337", type: "flatrate" as const }],
      lastUpdated: Date.now(),
    },
  },
  {
    id: "sleepy-hollow",
    externalIds: { tmdb: "2668" },
    kind: "movie" as const,
    title: "Sleepy Hollow",
    year: 1999,
    runtime: "1h 45m",
    genres: ["Horror", "Fantasy", "Mystery"],
    description:
      "Ichabod Crane investigates a series of gruesome murders by a headless horseman in autumn 1799.",
    cast: ["Johnny Depp", "Christina Ricci"],
    director: "Tim Burton",
    categories: ["Horror", "Classic Halloween", "Cozy Autumn Movies"],
    decade: "1990s",
    tags: ["Fall", "Autumn", "Gothic", "Headless Horseman"],
    art: artMansion,
    backdropUrl: artMansion,
    streaming: {
      region: "US",
      watchUrl: null,
      offers: [{ providerName: "Paramount+", providerId: "531", type: "flatrate" as const }],
      lastUpdated: Date.now(),
    },
  },
  {
    id: "practical-magic",
    externalIds: { tmdb: "11619" },
    kind: "movie" as const,
    title: "Practical Magic",
    year: 1998,
    runtime: "1h 44m",
    genres: ["Romance", "Fantasy"],
    description:
      "Two sisters bound by a family curse brew midnight margaritas in a seaside house full of herbs, spells and second chances.",
    cast: ["Sandra Bullock", "Nicole Kidman"],
    director: "Griffin Dunne",
    categories: ["Witch Movies", "Fall Romance", "Cozy Autumn Movies"],
    decade: "1990s",
    tags: ["Witch", "Cozy Fall", "Romance", "Magic"],
    art: artWitch,
    backdropUrl: artWitch,
    streaming: {
      region: "US",
      watchUrl: null,
      offers: [{ providerName: "Max", providerId: "1899", type: "flatrate" as const }],
      lastUpdated: Date.now(),
    },
  },
  {
    id: "simpsons-treehouse-v",
    externalIds: { tmdb: "456" },
    kind: "episode" as const,
    title: "Treehouse of Horror V",
    year: 1994,
    runtime: "22m",
    genres: ["Animation", "Comedy", "Horror"],
    description:
      "The Shinning, Time and Punishment, and Nightmare Cafeteria — the gold standard of the Halloween anthology episode.",
    cast: ["Dan Castellaneta", "Julie Kavner"],
    episodeInfo: {
      showTitle: "The Simpsons",
      showTmdbId: "456",
      seasonNumber: 6,
      episodeNumber: 6,
      episodeTitle: "Treehouse of Horror V",
    },
    categories: ["Cartoon Specials", "Sitcom Halloween Episodes", "Animated Specials"],
    decade: "1990s",
    tags: ["Halloween", "Simpsons", "Animation", "Anthology"],
    art: artCartoon,
    backdropUrl: artCartoon,
    streaming: {
      region: "US",
      watchUrl: null,
      offers: [{ providerName: "Disney+", providerId: "337", type: "flatrate" as const }],
      lastUpdated: Date.now(),
    },
  },
  {
    id: "great-pumpkin",
    externalIds: { tmdb: "13393" },
    kind: "special" as const,
    title: "It's the Great Pumpkin, Charlie Brown",
    year: 1966,
    runtime: "25m",
    genres: ["Animation", "Family"],
    description:
      "Linus waits all night in the sincerest pumpkin patch he can find. Still the most tender Halloween special ever made.",
    cast: ["Peter Robbins", "Christopher Shea"],
    director: "Bill Melendez",
    categories: ["Animated Specials", "Cartoon Specials", "Family Halloween Episodes"],
    decade: "1960s",
    tags: ["Pumpkin", "Charlie Brown", "Animation", "Classic"],
    art: artCartoon,
    backdropUrl: artCartoon,
    streaming: {
      region: "US",
      watchUrl: null,
      offers: [{ providerName: "Apple TV+", providerId: "350", type: "flatrate" as const }],
      lastUpdated: Date.now(),
    },
  },
  {
    id: "over-the-garden-wall",
    externalIds: { tmdb: "61662" },
    kind: "show" as const,
    title: "Over the Garden Wall",
    year: 2014,
    runtime: "1h 50m",
    genres: ["Animation", "Adventure", "Fantasy"],
    description:
      "Two brothers find themselves lost in the Unknown, a strange forest adrift in time, guided by an autumnal woodsman.",
    cast: ["Elijah Wood", "Collin Dean", "Melanie Lynskey"],
    categories: ["Cozy Autumn Movies", "Animated Specials", "Harvest & Folklore"],
    decade: "2010s",
    tags: ["Autumn", "Cozy Fall", "Harvest", "Folklore", "Animation"],
    art: artAutumn,
    backdropUrl: artAutumn,
    streaming: {
      region: "US",
      watchUrl: null,
      offers: [{ providerName: "Hulu", providerId: "15", type: "flatrate" as const }],
      lastUpdated: Date.now(),
    },
  },
];

/* ------------------------------------------------------------------ *
 * Required Legacy Export 1: titles
 * ------------------------------------------------------------------ */

export const titles: VaultTitle[] = SEED_LIBRARY_RAW.map((item) => {
  const intentScores: IntentScores = calculateIntentScores({
    title: item.title,
    description: item.description,
    genres: item.genres,
    year: item.year,
    kind: item.kind,
  });

  const artwork: ArtworkPipeline = {
    posterUrl: item.art,
    backdropUrl: item.backdropUrl || null,
    sourceType: "local-fallback",
    isFallback: false,
  };

  return {
    ...item,
    intentScores,
    artwork,
    lastRefreshed: Date.now(),
  };
});

let masterVaultStore: VaultTitle[] = [...titles];

/* ------------------------------------------------------------------ *
 * Required Legacy Export 2: featured
 * ------------------------------------------------------------------ */

export const featured: VaultTitle = titles[0]!;

/* ------------------------------------------------------------------ *
 * Required Legacy Export 3: dailyPicks
 * ------------------------------------------------------------------ */

export const dailyPicks: VaultTitle[] = titles.slice(0, 4);

/* ------------------------------------------------------------------ *
 * Required Legacy Export 4: decades
 * ------------------------------------------------------------------ */

export const decades: string[] = [
  "All",
  "2020s",
  "2010s",
  "2000s",
  "1990s",
  "1980s",
  "1970s",
  "1960s",
  "1950s & Earlier",
];

/* ------------------------------------------------------------------ *
 * Required Legacy Export 5: sections
 * ------------------------------------------------------------------ */

export const sections: { id: string; title: string; subtitle: string; category: string }[] = [
  {
    id: "classic-halloween",
    title: "Classic Halloween Essentials",
    subtitle: "The definitive seasonal lineup that defined October 31st.",
    category: "Classic Halloween",
  },
  {
    id: "family-halloween",
    title: "Family Halloween Magic",
    subtitle: "Spooky fun and magical adventures for every coven member.",
    category: "Family Halloween",
  },
  {
    id: "cozy-autumn",
    title: "Cozy Autumn & Harvest Comfort",
    subtitle: "Warm drinks, falling leaves, and gentle crisp October vibes.",
    category: "Cozy Autumn Movies",
  },
  {
    id: "witch-movies",
    title: "Witches, Spells & Covens",
    subtitle: "Cauldrons, black cats, and moonlight enchantments.",
    category: "Witch Movies",
  },
  {
    id: "animated-specials",
    title: "Animated Halloween & Specials",
    subtitle: "Nostalgic cartoon hits and claymation seasonal masterpieces.",
    category: "Animated Halloween",
  },
];

/* ------------------------------------------------------------------ *
 * Required Legacy Export 6: countdownToHalloween
 * ------------------------------------------------------------------ */

export function countdownToHalloween(): { days: number; hours: number; minutes: number } {
  const now = new Date();
  const currentYear = now.getFullYear();
  let halloween = new Date(currentYear, 9, 31, 0, 0, 0); // Oct 31

  if (now.getTime() > halloween.getTime()) {
    halloween = new Date(currentYear + 1, 9, 31, 0, 0, 0);
  }

  const diffMs = halloween.getTime() - now.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return { days, hours, minutes };
}

/* ------------------------------------------------------------------ *
 * Required Legacy Export 7: searchVault
 * ------------------------------------------------------------------ */

export function searchVault(query: string, pool: VaultTitle[] = masterVaultStore): VaultTitle[] {
  const q = query.trim().toLowerCase();
  if (!q) return pool;
  const terms = q.split(/\s+/);
  return pool.filter((t) =>
    terms.every((term) =>
      [
        t.title,
        t.description,
        t.episodeInfo?.showTitle || "",
        ...t.genres,
        ...t.categories,
        ...t.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    )
  );
}

/* ------------------------------------------------------------------ *
 * Upgraded Data Pipeline & Helper Functions
 * ------------------------------------------------------------------ */

export async function hydrateVaultBackground(force = false): Promise<void> {
  const now = Date.now();
  if (!force && now - lastHydrationTime < HYDRATION_COOLDOWN_MS) {
    return;
  }
  lastHydrationTime = now;

  try {
    const simpsonsEps = await episodeEngine.discoverHalloweenEpisodes("The Simpsons", "456");
    const buffyEps = await episodeEngine.discoverHalloweenEpisodes("Buffy the Vampire Slayer", "1426");

    const discovered = [...simpsonsEps, ...buffyEps];
    masterVaultStore = deduplicateAndMergeTitles(masterVaultStore, discovered);
  } catch {
    // Soft error boundary - fallback to seed titles if remote discovery fails
  }
}

export async function queryVault(
  opts: SearchOptions = {}
): Promise<{ results: VaultTitle[]; total: number }> {
  const { query = "", kind, genre, decade, limit = 20, offset = 0 } = opts;

  let pool = [...masterVaultStore];

  if (query.trim()) {
    pool = searchVault(query, pool);
  }

  if (kind) pool = pool.filter((t) => t.kind === kind);
  if (genre) pool = pool.filter((t) => t.genres.includes(genre));
  if (decade) pool = pool.filter((t) => t.decade === decade);

  // Rank using the 7-Metric Overall Intent Index
  pool.sort((a, b) => b.intentScores.overallSeasonal - a.intentScores.overallSeasonal);

  const paginated = pool.slice(offset, offset + limit);

  // Background hydration for watch availability
  paginated.forEach((item) => {
    if (item.externalIds?.tmdb && item.streaming.offers.length === 0) {
      streamingEngine
        .fetchAvailability(
          item.externalIds.tmdb,
          item.kind === "episode" || item.kind === "show" ? "tv" : "movie"
        )
        .then((avail: StreamingAvailability) => {
          item.streaming = avail;
        });
    }
  });

  return { results: paginated, total: pool.length };
}

export function consultOracle(mood: OracleMood, excludeIds: string[] = []): OracleResult {
  const pool = masterVaultStore.filter((t) => !excludeIds.includes(t.id));
  const activePool = pool.length ? pool : masterVaultStore;

  const scoreMap: Record<OracleMood, keyof IntentScores> = {
    Scary: "spookyLevel",
    Spooky: "spookyLevel",
    Funny: "familyFriendliness",
    Family: "familyFriendliness",
    "Cozy Fall": "cozyAutumn",
    Classic: "classicStatus",
    Animated: "animationScore",
  };

  const targetMetric = scoreMap[mood] || "overallSeasonal";

  const ranked = [...activePool].sort(
    (a, b) => b.intentScores[targetMetric] - a.intentScores[targetMetric]
  );
  const winner = ranked[0] || masterVaultStore[0]!;

  return {
    title: winner,
    reason: `Selected for scoring ${winner.intentScores[targetMetric]}/100 in the ${mood} seasonal profile.`,
    matchedScoreKey: targetMetric,
  };
}
