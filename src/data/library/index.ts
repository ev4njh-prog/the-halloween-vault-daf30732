/**
 * The real-content library.
 * -------------------------
 * Every record here expands from compact verified rows or from a series
 * generator — no fictional titles, no hand-written thousand-entry arrays.
 * The catalog grows by (a) appending rows, or (b) activating a content source
 * in `src/data/sources.ts` which streams further real records in at runtime.
 */

import type { VaultTitle } from "../vault";
import { expandEpisode, expandFilm } from "./schema";
import { FALL_FILMS, HALLOWEEN_FILMS } from "./films";
import { HALLOWEEN_EPISODES, SPECIALS, TREEHOUSE_ROWS } from "./television";

export const realCatalog: VaultTitle[] = [
  ...HALLOWEEN_FILMS.map((r) => expandFilm(r)),
  ...FALL_FILMS.map((r) => expandFilm(r)),
  ...SPECIALS.map((r) => expandFilm(r, "special")),
  ...HALLOWEEN_EPISODES.map(expandEpisode),
  ...TREEHOUSE_ROWS.map(expandEpisode),
];

/** Similar/related content: franchise first, then shared categories & era. */
export function relatedIds(all: VaultTitle[], t: VaultTitle, limit = 8) {
  const score = (o: VaultTitle) => {
    if (o.id === t.id) return -1;
    let s = 0;
    if (o.franchise && o.franchise === t.franchise) s += 10;
    if (o.show && o.show === t.show) s += 8;
    s += o.categories.filter((c) => t.categories.includes(c)).length * 3;
    s += o.genres.filter((g) => t.genres.includes(g)).length * 2;
    if (o.decade === t.decade) s += 1;
    return s;
  };
  return all
    .map((o) => ({ o, s: score(o) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.o.id);
}

export { expandEpisode, expandFilm } from "./schema";
