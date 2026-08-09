/**
 * THE FALL SEASON MODEL
 * ---------------------
 * The Vault celebrates September → Thanksgiving, not just October 31. Every
 * phase declares which seasonal scores and tags it favours, so rows, the
 * Oracle and the calendar can re-weight discovery as the season advances
 * without any new UI or hardcoded lists.
 */

import { rankSeasonal, scoresOf, tagsOf, type SeasonalTag } from "./seasonal";
import type { VaultTitle } from "./vault";

export type SeasonPhaseId =
  | "early-fall"
  | "harvest"
  | "halloween-season"
  | "halloween-night"
  | "late-autumn"
  | "thanksgiving"
  | "off-season";

export interface SeasonPhase {
  id: SeasonPhaseId;
  label: string;
  blurb: string;
  /** Inclusive [month, day] bounds (month is 1-based). */
  from: [number, number];
  to: [number, number];
  /** Seasonal score dimension used to rank content during this phase. */
  rankBy: keyof ReturnType<typeof scoresOf>;
  tags: SeasonalTag[];
}

export const SEASON_PHASES: SeasonPhase[] = [
  {
    id: "early-fall",
    label: "Early Fall",
    blurb: "First cold mornings, back to school, the light going gold.",
    from: [9, 1],
    to: [9, 22],
    rankBy: "fall",
    tags: ["September", "Sweater Weather", "Autumn Traditions", "Football Season"],
  },
  {
    id: "harvest",
    label: "Harvest Season",
    blurb: "Orchards, hayrides, corn mazes and the harvest moon.",
    from: [9, 23],
    to: [10, 9],
    rankBy: "harvest",
    tags: ["Harvest", "Apple Orchard", "Harvest Festival", "Pumpkin Patch", "Harvest Moon"],
  },
  {
    id: "halloween-season",
    label: "Halloween Season",
    blurb: "Three weeks of costumes, candles and haunted attractions.",
    from: [10, 10],
    to: [10, 30],
    rankBy: "halloween",
    tags: ["Halloween", "October", "Costume Party", "Haunted House", "Trick or Treat"],
  },
  {
    id: "halloween-night",
    label: "Halloween Night",
    blurb: "The one night the Vault was built for.",
    from: [10, 31],
    to: [10, 31],
    rankBy: "halloween",
    tags: ["Halloween", "October Night", "Trick or Treat", "Classic Halloween"],
  },
  {
    id: "late-autumn",
    label: "Late Autumn",
    blurb: "Bare branches, early dark, long coats and longer films.",
    from: [11, 1],
    to: [11, 19],
    rankBy: "autumn",
    tags: ["November", "Fall Foliage", "Cozy Fall", "Fall Road Trip", "Autumn Traditions"],
  },
  {
    id: "thanksgiving",
    label: "Thanksgiving",
    blurb: "The long table, the parade, and everyone home at once.",
    from: [11, 20],
    to: [11, 30],
    rankBy: "harvest",
    tags: ["Thanksgiving", "Family Gathering", "Fall Cooking", "Friendsgiving"],
  },
];

const OFF_SEASON: SeasonPhase = {
  id: "off-season",
  label: "The Long Wait",
  blurb: "Out of season — the Vault keeps the lanterns lit anyway.",
  from: [12, 1],
  to: [8, 31],
  rankBy: "overall",
  tags: ["Halloween", "Cozy Fall"],
};

const ord = (m: number, d: number) => m * 100 + d;

export function currentPhase(date = new Date()): SeasonPhase {
  const v = ord(date.getMonth() + 1, date.getDate());
  return (
    SEASON_PHASES.find((p) => v >= ord(...p.from) && v <= ord(...p.to)) ?? OFF_SEASON
  );
}

/** Season-aware ordering: the same library, re-weighted as autumn advances. */
export function rankForSeason(pool: VaultTitle[], date = new Date()) {
  const phase = currentPhase(date);
  const boosted = new Set(phase.tags);
  return rankSeasonal(pool, phase.rankBy).sort((a, b) => {
    const bonus = (t: VaultTitle) => tagsOf(t).filter((x) => boosted.has(x)).length * 4;
    return (
      scoresOf(b)[phase.rankBy] + bonus(b) - (scoresOf(a)[phase.rankBy] + bonus(a))
    );
  });
}

/** Countdown to the next major fall milestone (Halloween or Thanksgiving). */
export function nextMilestone(now = new Date()) {
  const year = now.getFullYear();
  const halloween = new Date(year, 9, 31);
  // US Thanksgiving: fourth Thursday of November.
  const nov1 = new Date(year, 10, 1);
  const firstThu = 1 + ((11 - nov1.getDay()) % 7);
  const thanksgiving = new Date(year, 10, firstThu + 21);
  const upcoming = [
    { label: "Halloween", date: halloween },
    { label: "Thanksgiving", date: thanksgiving },
    { label: "Halloween", date: new Date(year + 1, 9, 31) },
  ].find((m) => m.date.getTime() >= now.getTime())!;
  const ms = upcoming.date.getTime() - now.getTime();
  return { label: upcoming.label, days: Math.max(0, Math.ceil(ms / 86400000)) };
}
