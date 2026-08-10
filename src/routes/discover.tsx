import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TitleCard } from "@/components/vault/Row";
import { PageHeader } from "@/components/vault/AppShell";
import { queryCatalog } from "@/data/catalog";
import { tagCloud, type SeasonalTag } from "@/data/seasonal";
import { decades, titles } from "@/data/vault";
import { useDebouncedValue, useFavorites } from "@/hooks/use-vault";
import { spookClick } from "@/lib/ambience";

export const Route = createFileRoute("/discover")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
    tag: typeof search["tag"] === "string" ? search["tag"] : "",
    decade: typeof search["decade"] === "string" ? search["decade"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Discover — Search The Halloween Vault" },
      {
        name: "description",
        content:
          "Search and filter the whole Vault by seasonal tag, decade, mood or keyword. Results are paginated and ranked by seasonal relevance.",
      },
      { property: "og:title", content: "Discover — The Halloween Vault" },
      {
        property: "og:description",
        content: "Search every title by tag, decade, mood or keyword — never by popularity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiscoverPage,
});

const PAGE_SIZE = 24;

function DiscoverPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const favorites = useFavorites();

  const [query, setQuery] = useState(search.q);
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(query, 200);

  const tag = (search.tag || null) as SeasonalTag | null;
  const decade = search.decade || null;

  // Tag counts are derived once — the chip rail never re-scans the library.
  const chips = useMemo(() => tagCloud(titles, 14), []);

  const result = useMemo(
    () => queryCatalog({ q: debounced, tag, decade, page, pageSize: PAGE_SIZE }),
    [debounced, tag, decade, page],
  );

  const setFilter = (next: Partial<{ tag: string; decade: string }>) => {
    setPage(1);
    void navigate({ search: (prev) => ({ ...prev, ...next }), replace: true });
  };

  const active = Boolean(debounced.trim() || tag || decade);

  return (
    <>
      <PageHeader
        eyebrow="Search everything"
        title="Discover"
        blurb="One place to search the entire Vault. Filter by seasonal tag or decade, or type a mood — results are ranked by seasonal relevance and loaded a page at a time."
      />

      <div className="gutter mx-auto max-w-[1400px] pb-20">
        <label className="glass glass-edge flex items-center gap-3 rounded-full px-5 py-3">
          <span className="sr-only">Search titles, tags and moods</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Try “corn maze”, “costume party”, “haunted mansion”…"
            className="w-full bg-transparent text-sm text-moonlight outline-hidden placeholder:text-moonlight/40"
          />
        </label>

        <div className="row-scroll edge-fade mt-5 flex gap-2 pb-1">
          <button
            onClick={() => {
              setQuery("");
              setFilter({ tag: "", decade: "" });
            }}
            aria-pressed={!active}
            className={`min-h-9 shrink-0 rounded-full px-4 text-xs font-medium transition-colors ${
              !active
                ? "bg-crimson text-moonlight"
                : "border border-border text-moonlight/70 hover:bg-white/5"
            }`}
          >
            All
          </button>
          {chips.map(({ tag: t, count }) => (
            <button
              key={t}
              onClick={() => {
                spookClick();
                setFilter({ tag: tag === t ? "" : t });
              }}
              aria-pressed={tag === t}
              className={`min-h-9 shrink-0 rounded-full px-4 text-xs font-medium transition-colors ${
                tag === t
                  ? "bg-crimson text-moonlight"
                  : "border border-border text-moonlight/70 hover:bg-white/5"
              }`}
            >
              {t} <span className="text-moonlight/35">{count}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {decades.map((d) => (
            <button
              key={d}
              onClick={() => {
                spookClick();
                setFilter({ decade: decade === d ? "" : d });
              }}
              aria-pressed={decade === d}
              className={`min-h-9 rounded-full px-4 text-xs transition-colors ${
                decade === d
                  ? "bg-crimson text-moonlight"
                  : "border border-border text-moonlight/70 hover:bg-white/5"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <p className="mt-8 text-sm text-moonlight/55" aria-live="polite">
          {result.total} result{result.total === 1 ? "" : "s"}
          {tag ? ` tagged ${tag}` : ""}
          {decade ? ` from the ${decade}` : ""} · page {result.page} of {result.pageCount}
        </p>

        {result.items.length === 0 ? (
          <p className="mt-6 text-sm text-moonlight/60">
            Nothing in the Vault matches yet. Try a mood, a tag, or ask the Oracle.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] justify-items-center gap-5">
            {result.items.map((item, i) => (
              <TitleCard
                key={item.id}
                item={item}
                priority={i < 6}
                isFavorite={favorites.ids.includes(item.id)}
                onToggleFavorite={favorites.toggle}
              />
            ))}
          </div>
        )}

        {result.pageCount > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={result.page <= 1}
              className="min-h-11 rounded-full border border-border px-6 text-sm text-moonlight/85 disabled:opacity-35 hover:enabled:bg-white/5"
            >
              Previous
            </button>
            <span className="text-xs uppercase tracking-[0.18em] text-moonlight/50">
              {result.page} / {result.pageCount}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(result.pageCount, p + 1))}
              disabled={result.page >= result.pageCount}
              className="min-h-11 rounded-full border border-border px-6 text-sm text-moonlight/85 disabled:opacity-35 hover:enabled:bg-white/5"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
