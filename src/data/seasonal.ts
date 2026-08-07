/**
 * THE HALLOWEEN VAULT — Seasonal Discovery Engine
 * ------------------------------------------------
 * The Vault is not a general movie database. Nothing is surfaced because it is
 * popular; everything is surfaced because it is *seasonally relevant*.
 *
 * Every title is scored from its own metadata (title, plot/episode summary,
 * genres, curated categories, keywords) against a large Halloween/Fall
 * taxonomy. Scores drive rows, search ranking, the Oracle and recommendations.
 */

import type { VaultTitle } from "./vault";

/* ------------------------------------------------------------------ *
 * 1. Tag taxonomy
 * ------------------------------------------------------------------ */

export const SEASONAL_TAGS = [
  "Halloween",
  "October",
  "Fall",
  "Autumn",
  "Pumpkin",
  "Ghost",
  "Witch",
  "Monster",
  "Haunted",
  "Haunted House",
  "Scarecrow",
  "Harvest",
  "Corn Maze",
  "Costume",
  "Trick or Treat",
  "Black Cat",
  "Vampire",
  "Werewolf",
  "Magic",
  "Spooky Kids",
  "Small Town Halloween",
  "Autumn Festival",
  "Halloween Party",
  "Seasonal Special",
  "Animated Halloween",
  "Family Halloween",
  "Cozy Fall",
  "Gothic",
  "Occult",
  "Slasher",
  "Creature Feature",
  "Graveyard",
  "Full Moon",
  "Curse",
  "Folk Horror",
] as const;

export type SeasonalTag = (typeof SEASONAL_TAGS)[number];

/** Keyword signals per tag. Matched against every text field of a title. */
const TAG_SIGNALS: Record<SeasonalTag, string[]> = {
  Halloween: ["halloween", "all hallows", "hallowe'en", "october 31", "31st of october"],
  October: ["october", "autumn night", "halloween season"],
  Fall: ["fall", "sweater", "cider", "orchard", "apple picking", "thanksgiving"],
  Autumn: ["autumn", "amber", "falling leaves", "november", "equinox"],
  Pumpkin: ["pumpkin", "jack-o", "jack o'", "lantern", "gourd", "carve", "patch"],
  Ghost: ["ghost", "spirit", "poltergeist", "phantom", "apparition", "seance", "haunting"],
  Witch: ["witch", "coven", "spell", "cackle", "broom", "hex", "potion", "herbalist", "sorcer"],
  Monster: ["monster", "creature", "beast", "goblin", "mummy", "frankenstein", "gremlin"],
  Haunted: ["haunted", "cursed", "possessed", "restless", "unquiet"],
  "Haunted House": ["haunted house", "manor", "mansion", "estate", "old house", "attic", "cellar"],
  Scarecrow: ["scarecrow", "straw man", "cornfield"],
  Harvest: ["harvest", "farm", "barn", "hay", "thanksgiving", "feast"],
  "Corn Maze": ["corn maze", "cornfield", "maize"],
  Costume: ["costume", "mask", "masquerade", "disguise", "dress up"],
  "Trick or Treat": ["trick or treat", "trick-or-treat", "candy", "doorbell", "treats"],
  "Black Cat": ["black cat", "familiar", "cat"],
  Vampire: ["vampire", "dracula", "fangs", "bloodsucker", "nosferatu"],
  Werewolf: ["werewolf", "wolf man", "lycan", "howl"],
  Magic: ["magic", "magical", "enchant", "portal", "conjure", "wizard", "supernatural"],
  "Spooky Kids": ["kids", "children", "teen", "middle school", "young"],
  "Small Town Halloween": ["small town", "village", "town square", "neighborhood", "suburb"],
  "Autumn Festival": ["festival", "fair", "carnival", "parade", "celebration"],
  "Halloween Party": ["party", "costume party", "dance", "ball", "gathering"],
  "Seasonal Special": ["special", "episode", "annual", "tradition"],
  "Animated Halloween": ["animated", "animation", "cartoon", "stop-motion", "puppet"],
  "Family Halloween": ["family", "kid-friendly", "all ages"],
  "Cozy Fall": ["cozy", "warm", "inn", "bakery", "pie", "romance", "gentle", "hearth"],
  Gothic: ["gothic", "victorian", "candelabra", "crypt", "cathedral", "moor"],
  Occult: ["occult", "ritual", "cult", "demon", "exorcis", "grimoire", "summon"],
  Slasher: ["slasher", "killer", "masked", "stalk", "babysitter", "final girl"],
  "Creature Feature": ["creature", "swamp", "lagoon", "experiment", "laboratory"],
  Graveyard: ["graveyard", "cemetery", "tomb", "grave", "crypt", "undead", "zombie"],
  "Full Moon": ["full moon", "moonlit", "moonlight", "midnight"],
  Curse: ["curse", "cursed", "doomed", "prophecy", "omen"],
  "Folk Horror": ["folk", "ritual", "harvest festival", "pagan", "village elders"],
};

/* ------------------------------------------------------------------ *
 * 2. Seasonal scores
 * ------------------------------------------------------------------ */

export interface SeasonalScores {
  /** How strongly this belongs to Halloween night itself. */
  halloween: number;
  /** Broad autumn/fall-season relevance. */
  fall: number;
  /** Autumn imagery: leaves, amber light, late-year melancholy. */
  autumn: number;
  /** How well it fits a night in October specifically. */
  october: number;
  /** Farms, harvest, Thanksgiving, hayrides. */
  harvest: number;
  /** Comfort watching: warm, gentle, low-fear. */
  cozy: number;
  /** Ghosts, manors, dread. */
  haunted: number;
  /** Blended relevance used for default ordering. */
  overall: number;
}

/** Tag → score contributions. Keeps scoring explainable and tunable. */
const TAG_WEIGHTS: Partial<
  Record<SeasonalTag, Partial<Record<keyof Omit<SeasonalScores, "overall">, number>>>
> = {
  Halloween: { halloween: 30, october: 24 },
  October: { october: 18, halloween: 8 },
  Fall: { fall: 22, autumn: 12 },
  Autumn: { autumn: 24, fall: 14 },
  Pumpkin: { halloween: 14, harvest: 14, autumn: 10 },
  Ghost: { haunted: 24, halloween: 12 },
  Witch: { halloween: 20, october: 10 },
  Monster: { halloween: 16, october: 8 },
  Haunted: { haunted: 20, halloween: 10 },
  "Haunted House": { haunted: 26, halloween: 12 },
  Scarecrow: { harvest: 20, autumn: 12, halloween: 8 },
  Harvest: { harvest: 26, fall: 16, autumn: 10 },
  "Corn Maze": { harvest: 22, autumn: 12 },
  Costume: { halloween: 18, october: 10 },
  "Trick or Treat": { halloween: 26, october: 14 },
  "Black Cat": { halloween: 8, haunted: 6 },
  Vampire: { halloween: 16, haunted: 10 },
  Werewolf: { halloween: 16, haunted: 8 },
  Magic: { halloween: 10, october: 6 },
  "Spooky Kids": { halloween: 8, cozy: 8 },
  "Small Town Halloween": { halloween: 14, cozy: 10, autumn: 8 },
  "Autumn Festival": { autumn: 18, harvest: 14, fall: 12 },
  "Halloween Party": { halloween: 20, october: 12 },
  "Seasonal Special": { halloween: 10, october: 10 },
  "Animated Halloween": { halloween: 10, cozy: 12 },
  "Family Halloween": { halloween: 12, cozy: 16 },
  "Cozy Fall": { cozy: 28, fall: 18, autumn: 12 },
  Gothic: { haunted: 18, october: 8 },
  Occult: { haunted: 16, halloween: 10 },
  Slasher: { halloween: 14, haunted: 10 },
  "Creature Feature": { halloween: 12, haunted: 8 },
  Graveyard: { haunted: 22, halloween: 12 },
  "Full Moon": { halloween: 10, haunted: 8 },
  Curse: { haunted: 14, halloween: 8 },
  "Folk Horror": { harvest: 16, haunted: 14, autumn: 10 },
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function haystack(t: VaultTitle) {
  return [t.title, t.show ?? "", t.description, ...t.genres, ...t.categories, ...(t.cast ?? [])]
    .join(" ")
    .toLowerCase();
}

/** Tags derived from every text signal — works even when "Halloween" is never said. */
export function deriveTags(t: VaultTitle): SeasonalTag[] {
  const hay = haystack(t);
  const found = SEASONAL_TAGS.filter((tag) => TAG_SIGNALS[tag].some((k) => hay.includes(k)));
  if (t.kind !== "movie" && !found.includes("Seasonal Special")) found.push("Seasonal Special");
  return found;
}

function computeScores(t: VaultTitle, tags: SeasonalTag[]): SeasonalScores {
  // Curated editorial baselines seed the model; tags refine it.
  const s = {
    halloween: t.halloweenScore * 0.55,
    fall: t.fallScore * 0.55,
    autumn: t.fallScore * 0.4,
    october: t.halloweenScore * 0.4,
    harvest: t.fallScore * 0.25,
    cozy: t.fallScore * 0.3,
    haunted: t.halloweenScore * 0.3,
  };

  for (const tag of tags) {
    const w = TAG_WEIGHTS[tag];
    if (!w) continue;
    for (const [key, value] of Object.entries(w)) {
      s[key as keyof typeof s] += value as number;
    }
  }

  // Gentle genre corrections.
  if (t.genres.includes("Horror")) s.cozy -= 22;
  if (t.genres.includes("Family")) s.cozy += 10;
  if (t.genres.includes("Romance")) s.cozy += 8;

  const scores = {
    halloween: clamp(s.halloween),
    fall: clamp(s.fall),
    autumn: clamp(s.autumn),
    october: clamp(s.october),
    harvest: clamp(s.harvest),
    cozy: clamp(s.cozy),
    haunted: clamp(s.haunted),
  };

  const overall = clamp(
    scores.halloween * 0.42 +
      scores.october * 0.18 +
      scores.fall * 0.16 +
      scores.autumn * 0.1 +
      scores.haunted * 0.08 +
      scores.harvest * 0.03 +
      scores.cozy * 0.03,
  );

  return { ...scores, overall };
}

export interface SeasonalProfile {
  tags: SeasonalTag[];
  scores: SeasonalScores;
  /** Human-readable justification, used in the Oracle and card details. */
  rationale: string;
}

const cache = new Map<string, SeasonalProfile>();

export function seasonalProfile(t: VaultTitle): SeasonalProfile {
  let hit = cache.get(t.id);
  if (hit) return hit;

  const tags = deriveTags(t);
  const scores = computeScores(t, tags);
  const top = (Object.entries(scores) as [keyof SeasonalScores, number][])
    .filter(([k]) => k !== "overall")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k, v]) => `${k} ${v}`)
    .join(" · ");

  hit = {
    tags,
    scores,
    rationale: `Seasonal relevance ${scores.overall}/100 — ${top}${
      tags.length ? ` — ${tags.slice(0, 4).join(", ")}` : ""
    }.`,
  };
  cache.set(t.id, hit);
  return hit;
}

export const scoresOf = (t: VaultTitle) => seasonalProfile(t).scores;
export const tagsOf = (t: VaultTitle) => seasonalProfile(t).tags;

/** Seasonal-first ordering. Popularity is deliberately never an input. */
export function rankSeasonal(pool: VaultTitle[], key: keyof SeasonalScores = "overall") {
  return [...pool].sort((a, b) => scoresOf(b)[key] - scoresOf(a)[key]);
}

export function withTag(pool: VaultTitle[], tag: SeasonalTag) {
  return rankSeasonal(pool.filter((t) => tagsOf(t).includes(tag)));
}

/** Under-seen titles that still score highly — the Vault's hidden gems. */
export function hiddenGems(pool: VaultTitle[], limit = 12) {
  return rankSeasonal(pool.filter((t) => scoresOf(t).overall >= 55 && t.streaming.length <= 2))
    .slice(0, limit);
}

/** Tags surfaced as browsable chips, ordered by how much of the library they cover. */
export function tagCloud(pool: VaultTitle[], limit = 18) {
  const counts = new Map<SeasonalTag, number>();
  for (const t of pool) for (const tag of tagsOf(t)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}
