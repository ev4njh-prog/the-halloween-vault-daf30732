import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import heroTown from "@/assets/hero-town.jpg";
import { HouseIntro } from "@/components/vault/HouseIntro";
import { Atmosphere } from "@/components/vault/Atmosphere";
import { Oracle } from "@/components/vault/Oracle";
import { GuideHost } from "@/components/vault/GuideHost";
import { VideoDiscovery } from "@/components/vault/VideoDiscovery";
import { HalloweenCalendar } from "@/components/vault/Calendar";
import { Row, TitleCard } from "@/components/vault/Row";
import {
  CandlesIcon,
  CrystalBallIcon,
  HauntedHouseIcon,
  PlayPumpkinIcon,
  PumpkinIcon,
  SoundOffIcon,
  SoundOnIcon,
  SpellCircleIcon,
} from "@/components/vault/icons";
import {
  countdownToHalloween,
  dailyPicks,
  decades,
  featured,
  sections,
  searchVault,
  titles,
} from "@/data/vault";
import { rankSeasonal, scoresOf, tagCloud, tagsOf, type SeasonalTag } from "@/data/seasonal";
import { useDebouncedValue, useFavorites, useHydrated } from "@/hooks/use-vault";
import { fadeOutAmbience, spookClick, startAmbience } from "@/lib/ambience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Halloween Vault — Halloween & Fall Streaming Discovery" },
      {
        name: "description",
        content:
          "A seasonal discovery platform for Halloween movies, spooky TV episodes, animated specials and cozy autumn films. Enter the Vault.",
      },
      { property: "og:title", content: "The Halloween Vault" },
      {
        property: "og:description",
        content:
          "Halloween and Fall entertainment ranked by seasonal relevance, not popularity — movies, episodes, specials and hidden gems.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VaultHome,
});

const SEARCH_PAGE = 18;

function VaultHome() {
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(true);
  const [query, setQuery] = useState("");
  const [decade, setDecade] = useState<string | null>(null);
  const [tag, setTag] = useState<SeasonalTag | null>(null);
  const [limit, setLimit] = useState(SEARCH_PAGE);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const favorites = useFavorites();
  const hydrated = useHydrated();
  const [clock, setClock] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setClock(countdownToHalloween());
    const t = window.setInterval(() => setClock(countdownToHalloween()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("vault-reduced-motion", reducedMotion);
    document.documentElement.classList.toggle("vault-contrast", contrast);
  }, [reducedMotion, contrast]);

  // Date-dependent → client only, so SSR and hydration always agree.
  const picks = useMemo(() => (hydrated ? dailyPicks() : null), [hydrated]);

  const debouncedQuery = useDebouncedValue(query, 200);
  const chips = useMemo(() => tagCloud(titles, 16), []);

  const results = useMemo(() => {
    let pool = titles;
    if (decade) pool = pool.filter((t) => t.decade === decade);
    if (tag) pool = pool.filter((t) => tagsOf(t).includes(tag));
    const found = searchVault(debouncedQuery, pool);
    // Seasonal relevance is the tiebreaker — never popularity.
    return debouncedQuery.trim() ? found : rankSeasonal(found);
  }, [debouncedQuery, decade, tag]);

  useEffect(() => setLimit(SEARCH_PAGE), [debouncedQuery, decade, tag]);

  const filtering = debouncedQuery.trim().length > 0 || decade !== null || tag !== null;
  const favoriteItems = useMemo(
    () => titles.filter((t) => favorites.ids.includes(t.id)),
    [favorites.ids],
  );
  const featuredScore = scoresOf(featured);

  const toggleSound = useCallback(() => {
    spookClick();
    setMuted((m) => {
      if (m) startAmbience();
      else fadeOutAmbience();
      return !m;
    });
  }, []);

  const clearFilters = () => {
    setQuery("");
    setDecade(null);
    setTag(null);
  };

  return (
    <>
      {!entered && (
        <HouseIntro
          onEnter={(withSound) => {
            setEntered(true);
            setMuted(!withSound);
          }}
        />
      )}

      <Atmosphere />

      {/* ---------------- Navigation ---------------- */}
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
        <nav
          aria-label="Primary"
          className="glass glass-edge mx-auto flex max-w-[1400px] items-center gap-1.5 rounded-full px-2.5 py-1.5 sm:gap-3 sm:px-4"
        >
          <a
            href="#top"
            onClick={spookClick}
            className="flex shrink-0 items-center gap-2 rounded-full px-2 py-2 text-moonlight"
          >
            <HauntedHouseIcon className="size-5 text-crimson" />
            <span className="wordmark hidden text-[0.72rem] sm:inline">Halloween Vault</span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={spookClick}
                className="rounded-full px-3 py-2 text-xs font-medium text-moonlight/70 transition-colors hover:bg-white/5 hover:text-moonlight"
              >
                {s.label}
              </a>
            ))}
            <a
              href="#oracle"
              onClick={spookClick}
              className="rounded-full px-3 py-2 text-xs font-medium text-pumpkin transition-colors hover:bg-white/5"
            >
              Oracle
            </a>
          </div>

          <label className="ml-auto flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/6 px-3 py-2 sm:max-w-[260px]">
            <CrystalBallIcon className="size-4 shrink-0 text-pumpkin" />
            <span className="sr-only">Search the vault</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, tags, moods…"
              className="w-full bg-transparent text-sm text-moonlight outline-hidden placeholder:text-moonlight/40"
            />
          </label>

          <a
            href="#favorites"
            onClick={spookClick}
            className="grid size-10 shrink-0 place-items-center rounded-full text-moonlight hover:bg-white/5"
            aria-label="Your vault"
          >
            <PumpkinIcon className="size-5" />
          </a>
          <button
            onClick={toggleSound}
            aria-label={muted ? "Unmute Halloween ambience" : "Mute Halloween ambience"}
            className="grid size-10 shrink-0 place-items-center rounded-full text-moonlight hover:bg-white/5"
          >
            {muted ? (
              <SoundOffIcon className="size-5" />
            ) : (
              <SoundOnIcon className="size-5 text-pumpkin" />
            )}
          </button>
          <button
            onClick={() => {
              spookClick();
              setMenuOpen((o) => !o);
            }}
            aria-expanded={menuOpen}
            aria-label="Open menu"
            className="grid size-10 shrink-0 place-items-center rounded-full text-moonlight hover:bg-white/5"
          >
            <CandlesIcon className="size-5" />
          </button>
        </nav>

        {menuOpen && (
          <div className="glass glass-edge mx-auto mt-2 max-w-[1400px] rounded-3xl p-5 text-sm text-moonlight">
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              <div>
                <p className="eyebrow mb-2">Browse</p>
                <ul className="space-y-1.5">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="text-moonlight/75 hover:text-moonlight"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#decades"
                      onClick={() => setMenuOpen(false)}
                      className="text-moonlight/75 hover:text-moonlight"
                    >
                      Decades
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-2">Accessibility</p>
                <label className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                  />
                  Reduced motion
                </label>
                <label className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={contrast}
                    onChange={(e) => setContrast(e.target.checked)}
                  />
                  High contrast
                </label>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* ---------------- Featured tonight ---------------- */}
        <section className="relative overflow-hidden pt-24" aria-labelledby="featured-heading">
          <img
            src={heroTown}
            alt=""
            width={1920}
            height={1088}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

          <div className="gutter relative mx-auto grid max-w-[1400px] gap-10 pb-14 pt-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p className="eyebrow">Featured tonight</p>
              <h1
                id="featured-heading"
                className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.02] text-moonlight sm:text-6xl lg:text-7xl"
              >
                {featured.title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-moonlight/70 sm:text-base">
                {featured.description}
              </p>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-moonlight/50">
                <span className="rounded-full bg-crimson/25 px-2.5 py-1 text-pumpkin">
                  Seasonal {featuredScore.overall}
                </span>
                <span>{featured.year}</span>
                <span>{featured.runtime}</span>
                <span>{featured.genres.join(" · ")}</span>
                <span>{featured.streaming.join(", ")}</span>
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={featured.watchUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={spookClick}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-crimson px-7 text-sm font-semibold text-moonlight transition-colors hover:bg-crimson/85"
                >
                  <PlayPumpkinIcon className="size-5" /> Watch now
                </a>
                <button
                  onClick={() => {
                    spookClick();
                    favorites.toggle(featured.id);
                  }}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-7 text-sm font-medium text-moonlight/85 hover:bg-white/5"
                >
                  <PumpkinIcon className="size-5" />
                  {favorites.has(featured.id) ? "In your vault" : "Add to vault"}
                </button>
                <a
                  href="#oracle"
                  onClick={spookClick}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-pumpkin/45 px-7 text-sm font-medium text-pumpkin hover:bg-white/5"
                >
                  <SpellCircleIcon className="size-5" /> Ask the Oracle
                </a>
              </div>
            </div>

            {/* Countdown */}
            <div className="glass glass-edge rounded-3xl p-5">
              <p className="eyebrow">Until Halloween</p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {(
                  [
                    ["Days", clock.days],
                    ["Hrs", clock.hours],
                    ["Min", clock.minutes],
                    ["Sec", clock.seconds],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="text-center">
                    <div className="font-display text-2xl font-bold tabular-nums text-moonlight">
                      {String(value).padStart(2, "0")}
                    </div>
                    <div className="text-[0.58rem] uppercase tracking-[0.18em] text-moonlight/45">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-border pt-3 text-[0.68rem] leading-relaxed text-moonlight/50">
                {titles.length} titles indexed and scored for seasonal relevance.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- Browse rail ---------------- */}
        <section
          aria-label="Browse by seasonal tag"
          className="sticky top-[4.6rem] z-30 border-y border-border/60 bg-background/70 py-2.5 backdrop-blur-md"
        >
          <div className="gutter row-scroll edge-fade mx-auto flex max-w-[1400px] items-center gap-2">
            <button
              onClick={clearFilters}
              aria-pressed={!filtering}
              className={`min-h-9 shrink-0 rounded-full px-4 text-xs font-medium transition-colors ${
                !filtering
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
                  setTag(tag === t ? null : t);
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
        </section>

        {/* ---------------- Search / filter results ---------------- */}
        {filtering && (
          <section className="gutter mx-auto max-w-[1400px] py-12" aria-live="polite">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-moonlight">
                {results.length} result{results.length === 1 ? "" : "s"}
                {tag ? ` tagged ${tag}` : ""}
                {decade ? ` from the ${decade}` : ""}
              </h2>
              <button
                onClick={clearFilters}
                className="text-xs uppercase tracking-[0.18em] text-pumpkin hover:underline"
              >
                Clear filters
              </button>
            </div>

            {results.length === 0 ? (
              <p className="mt-4 text-sm text-moonlight/60">
                Nothing in the Vault matches yet. Try a mood, a tag, or ask the Oracle.
              </p>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] justify-items-center gap-5">
                  {results.slice(0, limit).map((item, i) => (
                    <TitleCard
                      key={item.id}
                      item={item}
                      priority={i < 6}
                      isFavorite={favorites.ids.includes(item.id)}
                      onToggleFavorite={favorites.toggle}
                    />
                  ))}
                </div>
                {results.length > limit && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setLimit((l) => l + SEARCH_PAGE)}
                      className="min-h-11 rounded-full border border-border px-8 text-sm text-moonlight/85 hover:bg-white/5"
                    >
                      Show more ({results.length - limit} left)
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        <HalloweenCalendar />

        {/* ---------------- Today's picks ---------------- */}
        <section className="gutter mx-auto max-w-[1400px] py-[var(--space-section)]">
          <p className="eyebrow">Curated daily</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-moonlight sm:text-4xl">
            Today&rsquo;s Halloween picks
          </h2>
          <p className="mt-2 max-w-xl text-sm text-moonlight/55">
            One movie, one episode, one special — chosen for the season, refreshed every day.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {picks
              ? (
                  [
                    ["Movie", picks.movie],
                    ["Episode", picks.episode],
                    ["Special", picks.special],
                  ] as const
                ).map(([label, t]) => {
                  const s = scoresOf(t);
                  return (
                    <article key={t.id} className="glass glass-edge rounded-3xl p-5">
                      <p className="eyebrow">{label}</p>
                      <h3 className="mt-2 font-display text-lg font-semibold text-moonlight">
                        {t.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-moonlight/65 line-clamp-4">
                        {t.description}
                      </p>
                      <p className="mt-4 text-[0.62rem] uppercase tracking-[0.16em] text-moonlight/45">
                        Seasonal {s.overall} · Halloween {s.halloween} · Fall {s.fall}
                      </p>
                    </article>
                  );
                })
              : [0, 1, 2].map((i) => (
                  <div key={i} className="glass glass-edge h-44 rounded-3xl" aria-hidden />
                ))}
          </div>
        </section>

        <section className="gutter mx-auto max-w-[1400px] py-[calc(var(--space-section)*0.4)]">
          <GuideHost />
        </section>

        <Oracle />

        {/* ---------------- Library ---------------- */}
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="content-auto scroll-mt-32 py-[calc(var(--space-section)*0.55)]"
            style={{ containIntrinsicSize: "1200px" }}
          >
            <div className="gutter mx-auto mb-6 max-w-[1400px]">
              <p className="eyebrow">Collection</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-moonlight sm:text-4xl">
                {section.label}
              </h2>
            </div>
            <div className="space-y-10">
              {section.rows.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  favorites={favorites.ids}
                  onToggleFavorite={favorites.toggle}
                />
              ))}
            </div>
          </section>
        ))}

        {/* ---------------- Decades ---------------- */}
        <section
          id="decades"
          className="gutter mx-auto max-w-[1400px] scroll-mt-32 py-[var(--space-section)]"
        >
          <p className="eyebrow">Time travel</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-moonlight sm:text-4xl">
            Decades
          </h2>
          <p className="mt-2 text-sm text-moonlight/55">Seventy Octobers, one shelf.</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {decades.map((d) => (
              <button
                key={d}
                onClick={() => {
                  spookClick();
                  setDecade(decade === d ? null : d);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                aria-pressed={decade === d}
                className={`min-h-11 rounded-full px-6 text-sm transition-colors ${
                  decade === d
                    ? "bg-crimson text-moonlight"
                    : "border border-border text-moonlight/80 hover:bg-white/5"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* ---------------- Favourites ---------------- */}
        <section
          id="favorites"
          className="gutter mx-auto max-w-[1400px] scroll-mt-32 py-[var(--space-section)]"
        >
          <p className="eyebrow">Saved</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-moonlight sm:text-4xl">
            Your vault
          </h2>
          {favoriteItems.length === 0 ? (
            <div className="glass glass-edge mt-6 flex items-center gap-4 rounded-3xl p-6">
              <SpellCircleIcon className="size-8 shrink-0 text-pumpkin" />
              <p className="text-sm text-moonlight/65">
                Nothing saved yet. Tap the heart on any title and it will appear here.
              </p>
            </div>
          ) : (
            <div className="row-scroll edge-fade mt-6 flex gap-4 pb-3">
              {favoriteItems.map((item) => (
                <TitleCard
                  key={item.id}
                  item={item}
                  isFavorite
                  onToggleFavorite={favorites.toggle}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="gutter mx-auto max-w-[1400px] border-t border-border/60 py-10 text-xs text-moonlight/45">
        <p className="wordmark text-moonlight/70">The Halloween Vault</p>
        <p className="mt-2 max-w-xl leading-relaxed">
          A seasonal discovery platform for Halloween and Fall entertainment. Titles are ranked by
          seasonal relevance scored from genres, keywords, plot and episode summaries — never by
          popularity. Metadata merges curated collections with external providers as they come
          online.
        </p>
      </footer>
    </>
  );
}
