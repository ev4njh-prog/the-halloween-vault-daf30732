// src/data/seasonal.ts

export type VaultKind =
  | "movie"
  | "episode"
  | "special"
  | "youtube_vlog"
  | "youtube_diy"
  | "recipe"
  | "ambience"
  | "music";

export type CountryCode =
  | "US" | "GB" | "IE" | "CA" | "AU" | "NZ"
  | "FR" | "DE" | "NO" | "SE" | "FI" | "ES" | "IT" | "JP" | "KR";

export type StreamingProviderId =
  | "netflix"
  | "disney-plus"
  | "hulu"
  | "max"
  | "prime-video"
  | "apple-tv"
  | "peacock"
  | "paramount-plus"
  | "shudder"
  | "amc-plus"
  | "tubi"
  | "youtube"
  | "custom";

export interface StreamingService {
  id: StreamingProviderId;
  name: string;
  isFree?: boolean;
}

export const STREAMING_PROVIDERS: Record<StreamingProviderId, StreamingService> = {
  netflix: { id: "netflix", name: "Netflix" },
  "disney-plus": { id: "disney-plus", name: "Disney+" },
  hulu: { id: "hulu", name: "Hulu" },
  max: { id: "max", name: "Max" },
  "prime-video": { id: "prime-video", name: "Prime Video" },
  "apple-tv": { id: "apple-tv", name: "Apple TV+" },
  peacock: { id: "peacock", name: "Peacock" },
  "paramount-plus": { id: "paramount-plus", name: "Paramount+" },
  shudder: { id: "shudder", name: "Shudder" },
  "amc-plus": { id: "amc-plus", name: "AMC+" },
  tubi: { id: "tubi", name: "Tubi", isFree: true },
  youtube: { id: "youtube", name: "YouTube", isFree: true },
  custom: { id: "custom", name: "Custom Site" },
};

export const SEASONAL_TAGS = [
  // Seasonal & Holidays
  "Halloween", "Fall", "Autumn", "Thanksgiving", "Harvest", "October", "November",
  "Pumpkin patch", "Apple orchard", "Corn maze", "Hayride", "Bonfire", "Cider", "Harvest festival",
  // Atmosphere
  "Cozy", "Spooky", "Creepy", "Magical", "Nostalgic", "Wholesome", "Mysterious", "Atmospheric",
  // Setting
  "Haunted house", "Forest", "Farm", "Small town", "Mansion", "Village", "Carnival", "Countryside",
  // Characters & Tropes
  "Witch", "Ghost", "Vampire", "Werewolf", "Zombie", "Skeleton", "Monster", "Black cat", "Scarecrow",
  // Activities & Media
  "Pumpkin carving", "Trick or treating", "Costume party", "Baking", "Decorating", "Thanksgiving dinner",
  "International", "Indie Horror", "DIY", "Vlog", "Ambience"
] as const;

export type SeasonalTag = (typeof SEASONAL_TAGS)[number];

export interface CustomSearchConfig {
  name: string;
  urlPattern: string;
}

export interface VaultTitle {
  id: string;
  kind: VaultKind;
  title: string;
  show?: string;
  season?: number;
  episode?: number;
  year: number;
  runtime: string;
  genres: string[];
  description: string;
  cast: string[];
  director?: string;
  streaming: StreamingProviderId[];
  watchUrl: string | null;
  art: string;
  categories: string[];
  decade: string;
  country?: CountryCode;
  tags?: SeasonalTag[];
  youtubeId?: string;
}

export interface SeasonalScores {
  overall: number;
  halloween: number;
  fall: number;
  autumn: number;
  october: number;
  harvest: number;
  cozy: number;
  haunted: number;
}

/* Helper functions for tags & scoring evaluation */

export function tagsOf(item: VaultTitle): SeasonalTag[] {
  if (item.tags && item.tags.length > 0) return item.tags;
  
  const text = `${item.title} ${item.description} ${item.genres.join(" ")} ${item.categories.join(" ")}`.toLowerCase();
  const matched: SeasonalTag[] = [];

  for (const tag of SEASONAL_TAGS) {
    if (text.includes(tag.toLowerCase())) {
      matched.push(tag);
    }
  }

  return matched.length > 0 ? matched : ["Spooky"];
}

export function tagCloud(items: VaultTitle[], limit = 16): { tag: SeasonalTag; count: number }[] {
  const counts = new Map<SeasonalTag, number>();

  for (const item of items) {
    const tags = tagsOf(item);
    for (const tag of tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function scoresOf(item: VaultTitle): SeasonalScores {
  const text = `${item.title} ${item.description} ${item.genres.join(" ")} ${item.categories.join(" ")}`.toLowerCase();
  
  let halloween = 50;
  let fall = 40;
  let autumn = 40;
  let october = 45;
  let harvest = 30;
  let cozy = 30;
  let haunted = 35;

  if (text.includes("halloween")) halloween += 35;
  if (text.includes("witch") || text.includes("ghost") || text.includes("pumpkin")) halloween += 20;
  if (text.includes("fall") || text.includes("autumn")) { fall += 35; autumn += 35; }
  if (text.includes("cozy") || text.includes("baking")) cozy += 40;
  if (text.includes("haunted") || text.includes("horror")) haunted += 40;
  if (text.includes("october")) october += 40;
  if (text.includes("harvest") || text.includes("thanksgiving")) harvest += 45;

  const overall = Math.min(99, Math.round((halloween + fall + autumn + october + haunted) / 5));

  return {
    overall,
    halloween: Math.min(99, halloween),
    fall: Math.min(99, fall),
    autumn: Math.min(99, autumn),
    october: Math.min(99, october),
    harvest: Math.min(99, harvest),
    cozy: Math.min(99, cozy),
    haunted: Math.min(99, haunted),
  };
}

export function evaluateTitle(item: VaultTitle) {
  return scoresOf(item);
}

export function rankSeasonal(items: VaultTitle[]): VaultTitle[] {
  return [...items].sort((a, b) => scoresOf(b).overall - scoresOf(a).overall);
}
