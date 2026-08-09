/**
 * Library schema & row expander.
 * ------------------------------
 * The Vault never hardcodes thousands of objects. Content lives as compact,
 * human-editable rows (one line per real title) that are expanded into full
 * `VaultTitle` records at load time, and as *source adapters* that stream
 * further real records in from external providers (TMDB, TV metadata, curated
 * collections). Adding content means adding lines or enabling a source —
 * never editing application code.
 *
 * HARD RULE: only real, verifiable titles may be added here. No invented
 * films, shows, episodes, specials or metadata.
 */

import artWitch from "@/assets/art-witch.jpg";
import artMansion from "@/assets/art-mansion.jpg";
import artAutumn from "@/assets/art-autumn.jpg";
import artCartoon from "@/assets/art-cartoon.jpg";
import type { VaultTitle } from "../vault";

export const ART = {
  witch: artWitch,
  mansion: artMansion,
  autumn: artAutumn,
  cartoon: artCartoon,
};

export function decadeOf(year: number) {
  if (year >= 2010) return "Modern";
  return `${Math.floor(year / 10) * 10}s`;
}

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Chooses curated in-vault artwork from a title's categories/genres. */
export function artFor(categories: string[], genres: string[]) {
  const hay = [...categories, ...genres].join(" ").toLowerCase();
  if (/animat|cartoon|stop-motion|special/.test(hay)) return ART.cartoon;
  if (/witch|magic|fantasy/.test(hay)) return ART.witch;
  if (/fall|autumn|harvest|thanksgiving|romance|cozy/.test(hay)) return ART.autumn;
  return ART.mansion;
}

/**
 * Compact film row:
 * `title | year | runtime | genres; | categories; | streaming; | halloween | fall | description`
 */
export type FilmRow = string;

/**
 * Compact episode row:
 * `show | season | episode | title | year | runtime | genres; | categories; | streaming; | halloween | fall | description`
 */
export type EpisodeRow = string;

const list = (s: string) =>
  s
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean);

export function expandFilm(row: FilmRow, kind: VaultTitle["kind"] = "movie"): VaultTitle {
  const [title, year, runtime, genres, categories, streaming, h, f, description] = row
    .split("|")
    .map((x) => x.trim());
  const cats = list(categories ?? "");
  const gen = list(genres ?? "");
  const y = Number(year);
  const id = `${slug(title ?? "")}-${y}`;
  return {
    id,
    kind,
    title: title ?? "",
    year: y,
    runtime: runtime ?? "",
    genres: gen,
    description: description ?? "",
    cast: [],
    halloweenScore: Number(h ?? 0),
    fallScore: Number(f ?? 0),
    streaming: list(streaming ?? ""),
    watchUrl: `https://dulo.gd/watch/${id}`,
    art: artFor(cats, gen),
    categories: cats,
    decade: decadeOf(y),
    keywords: [],
    userTags: cats,
  };
}

export function expandEpisode(row: EpisodeRow): VaultTitle {
  const [show, season, episode, title, year, runtime, genres, categories, streaming, h, f, description] =
    row.split("|").map((x) => x.trim());
  const cats = list(categories ?? "");
  const gen = list(genres ?? "");
  const y = Number(year);
  const id = `${slug(show ?? "")}-s${season}e${episode}`;
  return {
    id,
    kind: "episode",
    title: title ?? "",
    show: show ?? "",
    season: Number(season),
    episode: Number(episode),
    year: y,
    runtime: runtime ?? "",
    genres: gen,
    description: description ?? "",
    cast: [],
    halloweenScore: Number(h ?? 0),
    fallScore: Number(f ?? 0),
    streaming: list(streaming ?? ""),
    watchUrl: `https://dulo.gd/watch/${id}`,
    art: artFor(cats, gen),
    categories: cats,
    decade: decadeOf(y),
    keywords: [],
    userTags: cats,
    franchise: show ?? "",
  };
}
