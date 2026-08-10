/**
 * CATALOG QUERY LAYER
 * -------------------
 * The UI never touches the raw title array. Everything goes through
 * `queryCatalog()`, which is paginated by default and backed by a swappable
 * `CatalogSource`. Today the source is the bundled in-memory library; when the
 * library moves to a database or an API, implement `CatalogSource` and call
 * `setCatalogSource()` — no component changes required.
 *
 * PERFORMANCE CONTRACT
 *  - indexes are built lazily on first query, never at module import
 *  - every read is paginated: no screen may render an unbounded list
 *  - row definitions are declarative and materialised on demand + memoised
 */

import { searchVault, titles, type VaultKind, type VaultTitle } from "./vault";
import { rankSeasonal, tagsOf, type SeasonalTag } from "./seasonal";

export interface CatalogQuery {
  q?: string;
  kind?: VaultKind;
  /** Match any of these library categories. */
  categories?: string[];
  tag?: SeasonalTag | null;
  decade?: string | null;
  ids?: string[];
  page?: number;
  /** Hard-capped at 60 so a single render can never mount thousands of cards. */
  pageSize?: number;
  sort?: "seasonal" | "relevance" | "year";
}

export interface CatalogPage {
  items: VaultTitle[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface CatalogSource {
  id: string;
  query(input: CatalogQuery): CatalogPage;
  byId(id: string): VaultTitle | undefined;
  stats(): { total: number; movies: number; episodes: number; specials: number };
}

const MAX_PAGE_SIZE = 60;

/* ------------------------------------------------------------------ *
 * Lazy indexes (built once, on first use)
 * ------------------------------------------------------------------ */

interface Indexes {
  byId: Map<string, VaultTitle>;
  byCategory: Map<string, VaultTitle[]>;
  byDecade: Map<string, VaultTitle[]>;
  byKind: Map<VaultKind, VaultTitle[]>;
  byTag: Map<string, VaultTitle[]>;
}

let indexes: Indexes | null = null;

function push<K>(map: Map<K, VaultTitle[]>, key: K, t: VaultTitle) {
  const arr = map.get(key);
  if (arr) arr.push(t);
  else map.set(key, [t]);
}

function ensureIndexes(): Indexes {
  if (indexes) return indexes;
  const ix: Indexes = {
    byId: new Map(),
    byCategory: new Map(),
    byDecade: new Map(),
    byKind: new Map(),
    byTag: new Map(),
  };
  for (const t of titles) {
    ix.byId.set(t.id, t);
    push(ix.byKind, t.kind, t);
    push(ix.byDecade, t.decade, t);
    for (const c of t.categories) push(ix.byCategory, c, t);
    for (const tag of tagsOf(t)) push(ix.byTag, tag, t);
  }
  indexes = ix;
  return ix;
}

/** Call after mutating the underlying library (e.g. a source swap). */
export const invalidateCatalogIndexes = () => {
  indexes = null;
  rowCache.clear();
};

/* ------------------------------------------------------------------ *
 * In-memory source (the current implementation)
 * ------------------------------------------------------------------ */

function narrowest(input: CatalogQuery, ix: Indexes): VaultTitle[] {
  if (input.ids?.length) {
    return input.ids.map((id) => ix.byId.get(id)).filter((t): t is VaultTitle => Boolean(t));
  }
  const pools: VaultTitle[][] = [];
  if (input.categories?.length) {
    const seen = new Set<string>();
    const merged: VaultTitle[] = [];
    for (const c of input.categories) {
      for (const t of ix.byCategory.get(c) ?? []) {
        if (!seen.has(t.id)) {
          seen.add(t.id);
          merged.push(t);
        }
      }
    }
    pools.push(merged);
  }
  if (input.tag) pools.push(ix.byTag.get(input.tag) ?? []);
  if (input.decade) pools.push(ix.byDecade.get(input.decade) ?? []);
  if (input.kind) pools.push(ix.byKind.get(input.kind) ?? []);
  if (pools.length === 0) return titles;
  // Start from the smallest pool, then intersect — keeps work proportional to
  // the result size rather than to the size of the library.
  pools.sort((a, b) => a.length - b.length);
  let out = pools[0]!;
  for (const p of pools.slice(1)) {
    const set = new Set(p.map((t) => t.id));
    out = out.filter((t) => set.has(t.id));
  }
  return out;
}

const memorySource: CatalogSource = {
  id: "bundled-library",
  query(input) {
    const ix = ensureIndexes();
    let pool = narrowest(input, ix);

    const q = input.q?.trim() ?? "";
    if (q) pool = searchVault(q, pool);

    const sort = input.sort ?? (q ? "relevance" : "seasonal");
    if (sort === "seasonal") pool = rankSeasonal(pool);
    else if (sort === "year") pool = [...pool].sort((a, b) => b.year - a.year);

    const pageSize = Math.min(Math.max(input.pageSize ?? 24, 1), MAX_PAGE_SIZE);
    const page = Math.max(input.page ?? 1, 1);
    const total = pool.length;
    const start = (page - 1) * pageSize;
    return {
      items: pool.slice(start, start + pageSize),
      total,
      page,
      pageSize,
      pageCount: Math.max(Math.ceil(total / pageSize), 1),
    };
  },
  byId: (id) => ensureIndexes().byId.get(id),
  stats() {
    const ix = ensureIndexes();
    return {
      total: titles.length,
      movies: ix.byKind.get("movie")?.length ?? 0,
      episodes: ix.byKind.get("episode")?.length ?? 0,
      specials: ix.byKind.get("special")?.length ?? 0,
    };
  },
};

let source: CatalogSource = memorySource;

/** Swap in a database/API-backed catalog without touching the UI. */
export function setCatalogSource(next: CatalogSource) {
  source = next;
  invalidateCatalogIndexes();
}

export const queryCatalog = (input: CatalogQuery = {}): CatalogPage => source.query(input);
export const catalogById = (id: string) => source.byId(id);
export const catalogStats = () => source.stats();

/* ------------------------------------------------------------------ *
 * Declarative rows — materialised on demand, memoised per row id
 * ------------------------------------------------------------------ */

export type RowGroup = "halloween" | "autumn" | "thanksgiving" | "specials" | "discover";

export interface RowDef {
  id: string;
  group: RowGroup;
  label: string;
  blurb: string;
  query: CatalogQuery;
}

export interface MaterialisedRow {
  id: string;
  label: string;
  blurb: string;
  items: VaultTitle[];
}

/** Row width cap. Rows are horizontal rails, never full catalog dumps. */
const ROW_LIMIT = 20;

export const ROW_DEFS: RowDef[] = [
  {
    id: "classic",
    group: "halloween",
    label: "Classic Halloween",
    blurb: "The canon. Watched every October, without exception.",
    query: { categories: ["Classic Halloween"] },
  },
  {
    id: "family",
    group: "halloween",
    label: "Family Halloween",
    blurb: "Spooky enough to thrill, gentle enough for everyone.",
    query: { categories: ["Family Halloween"] },
  },
  {
    id: "witches",
    group: "halloween",
    label: "Witch Movies",
    blurb: "Black flame candles, herb gardens and midnight covens.",
    query: { categories: ["Witch Movies"] },
  },
  {
    id: "haunted",
    group: "halloween",
    label: "Haunted Houses & Monsters",
    blurb: "Elegant estates and the things that live in them.",
    query: { categories: ["Haunted Houses", "Monster Movies"] },
  },
  {
    id: "horror",
    group: "halloween",
    label: "Horror",
    blurb: "For the lights-off hours after the trick-or-treaters leave.",
    query: { categories: ["Horror"] },
  },
  {
    id: "comedies",
    group: "halloween",
    label: "Halloween Comedies",
    blurb: "Laughs with a little fog machine.",
    query: { categories: ["Halloween Comedies"] },
  },
  {
    id: "hidden",
    group: "halloween",
    label: "Hidden Halloween Gems",
    blurb: "Found by reading descriptions, not just titles.",
    query: { categories: ["Hidden Gems"] },
  },

  {
    id: "sitcom",
    group: "specials",
    label: "Sitcom Halloween Episodes",
    blurb: "Twenty-two perfect minutes of costume chaos.",
    query: { categories: ["Sitcom Halloween Episodes"] },
  },
  {
    id: "cartoons",
    group: "specials",
    label: "Cartoon & Animated Specials",
    blurb: "The specials that made October feel like October.",
    query: { categories: ["Cartoon Specials", "Animated Specials"] },
  },
  {
    id: "anthology",
    group: "specials",
    label: "Anthology Episodes",
    blurb: "One story, one night, no survivors guaranteed.",
    query: { categories: ["Anthology Episodes"] },
  },
  {
    id: "events",
    group: "specials",
    label: "Annual Halloween Events",
    blurb: "Spooktaculars, live tours and pumpkin nights, year by year.",
    query: { categories: ["Seasonal Events"] },
  },
  {
    id: "holiday-specials",
    group: "specials",
    label: "Holiday Specials",
    blurb: "Broadcast in the last week of October, every October.",
    query: { categories: ["Holiday Specials"] },
  },

  {
    id: "cozy",
    group: "autumn",
    label: "Cozy Autumn Movies",
    blurb: "Sweaters, cider, and light through amber leaves.",
    query: { categories: ["Cozy Autumn Movies"] },
  },
  {
    id: "harvest",
    group: "autumn",
    label: "Pumpkin Season & Harvest",
    blurb: "Patches, farms and the long amber afternoon.",
    query: { categories: ["Pumpkin Season", "Harvest Themes"] },
  },
  {
    id: "romance",
    group: "autumn",
    label: "Fall Romance",
    blurb: "Love, in the best month for walking.",
    query: { categories: ["Fall Romance"] },
  },
  {
    id: "harvest-episodes",
    group: "autumn",
    label: "Autumn & Harvest Episodes",
    blurb: "Hayrides, cider contests and the fall dance.",
    query: { kind: "episode", categories: ["Harvest Themes", "Cozy Autumn Movies"] },
  },

  {
    id: "thanksgiving",
    group: "thanksgiving",
    label: "Thanksgiving & Family Gatherings",
    blurb: "The long table, the parade, and everyone home at once.",
    query: { categories: ["Thanksgiving", "Family Gatherings"] },
  },
  {
    id: "fall-cooking",
    group: "thanksgiving",
    label: "Fall Cooking & Traditions",
    blurb: "Kitchens, feasts and the rituals that make the season.",
    query: { categories: ["Fall Cooking", "Autumn Traditions"] },
  },
  {
    id: "thanksgiving-episodes",
    group: "thanksgiving",
    label: "Thanksgiving Episodes",
    blurb: "Friendsgiving, football and the year's loudest dinner.",
    query: { kind: "episode", categories: ["Thanksgiving", "Family Gatherings"] },
  },
];

const rowCache = new Map<string, MaterialisedRow>();

export function getRow(id: string): MaterialisedRow | null {
  const cached = rowCache.get(id);
  if (cached) return cached;
  const def = ROW_DEFS.find((r) => r.id === id);
  if (!def) return null;
  const row: MaterialisedRow = {
    id: def.id,
    label: def.label,
    blurb: def.blurb,
    items: queryCatalog({ ...def.query, pageSize: ROW_LIMIT }).items,
  };
  rowCache.set(id, row);
  return row;
}

/** Rows for a section, skipping any that resolved empty. */
export function getRows(group: RowGroup): MaterialisedRow[] {
  return ROW_DEFS.filter((r) => r.group === group)
    .map((r) => getRow(r.id))
    .filter((r): r is MaterialisedRow => Boolean(r) && r!.items.length > 0);
}
