/**
 * THE HALLOWEEN VAULT — Seasonal Intent Engine (7 Metrics)
 */

import type { VaultTitle, IntentScores } from "./types";

export const SEASONAL_TAGS = [
  "Halloween", "October", "Fall", "Autumn", "Pumpkin", "Ghost", "Witch", 
  "Haunted House", "Monster", "Vampire", "Werewolf", "Slasher", "Cozy Fall", 
  "Harvest", "Thanksgiving", "Trick or Treat", "Costume Party", "Black Cat", 
  "Graveyard", "Cemetery", "Corn Maze", "Scarecrow", "Magic", "Gothic", 
  "Occult", "Creature Feature", "Full Moon", "Curse", "Folk Horror", 
  "Small Town Halloween", "Autumn Festival", "Spooky Kids", "Family Halloween", 
  "Animated Halloween", "Halloween Special"
] as const;

const KEYWORD_MAP: Record<string, string[]> = {
  halloween: ["halloween", "hallowe'en", "october 31", "trick or treat", "jack-o", "jack o"],
  fall: ["autumn", "fall", "harvest", "leaves", "october", "cider", "apple picking"],
  cozy: ["cozy", "bakery", "inn", "small town", "pie", "comfort", "warm", "cottage"],
  spooky: ["spooky", "scary", "ghost", "haunted", "mansion", "graveyard", "monster", "witch", "curse", "gore", "slasher"],
  family: ["family", "kids", "children", "disney", "animated", "toon", "nickelodeon"],
  animation: ["animated", "cartoon", "anime", "stop motion", "claymation", "cgi"],
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function calculateIntentScores(input: {
  title: string;
  description: string;
  genres: string[];
  keywords?: string[];
  year: number;
  kind: string;
}): IntentScores {
  const haystack = [
    input.title,
    input.description,
    ...input.genres,
    ...(input.keywords || [])
  ].join(" ").toLowerCase();

  const matches = (keys: string[]) => keys.some(k => haystack.includes(k));

  // 1. Halloween Intensity
  let halloween = 20;
  if (matches(KEYWORD_MAP.halloween!)) halloween += 65;
  if (haystack.includes("costume") || haystack.includes("pumpkin")) halloween += 15;

  // 2. Fall Atmosphere
  let fall = 20;
  if (matches(KEYWORD_MAP.fall!)) fall += 60;
  if (haystack.includes("corn maze") || haystack.includes("thanksgiving")) fall += 20;

  // 3. Cozy Autumn
  let cozy = 15;
  if (matches(KEYWORD_MAP.cozy!)) cozy += 50;
  if (input.genres.includes("Romance") || input.genres.includes("Comedy")) cozy += 20;
  if (input.genres.includes("Horror")) cozy -= 30; // High horror reduces cozy feeling

  // 4. Spooky Level
  let spooky = 10;
  if (matches(KEYWORD_MAP.spooky!)) spooky += 50;
  if (input.genres.includes("Horror")) spooky += 35;
  if (input.genres.includes("Thriller")) spooky += 15;

  // 5. Family Friendliness
  let family = 50;
  if (input.genres.includes("Family") || input.genres.includes("Children")) family += 40;
  if (matches(KEYWORD_MAP.family!)) family += 20;
  if (input.genres.includes("Horror") || haystack.includes("slasher") || haystack.includes("blood")) family -= 60;

  // 6. Animation Score
  let animation = input.genres.includes("Animation") || matches(KEYWORD_MAP.animation!) ? 100 : 0;

  // 7. Classic Status
  const currentYear = new Date().getFullYear();
  const age = currentYear - input.year;
  let classic = 10;
  if (age >= 40) classic = 95;
  else if (age >= 25) classic = 80;
  else if (age >= 15) classic = 50;

  // Overall Weighted Score
  const overallSeasonal = clamp(
    (halloween * 0.35) +
    (fall * 0.25) +
    (spooky * 0.20) +
    (cozy * 0.10) +
    (classic * 0.10)
  );

  return {
    halloweenIntensity: clamp(halloween),
    fallAtmosphere: clamp(fall),
    cozyAutumn: clamp(cozy),
    spookyLevel: clamp(spooky),
    familyFriendliness: clamp(family),
    animationScore: clamp(animation),
    classicStatus: clamp(classic),
    overallSeasonal,
  };
}
