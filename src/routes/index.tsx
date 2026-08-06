import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroTown from "@/assets/hero-town.jpg";
import { HouseIntro } from "@/components/vault/HouseIntro";
import { Atmosphere } from "@/components/vault/Atmosphere";
import { GlassFilters } from "@/components/vault/GlassFilters";
import { Oracle } from "@/components/vault/Oracle";
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
import { useFavorites, useReveal } from "@/hooks/use-vault";
import { fadeOutAmbience, spookClick, startAmbience } from "@/lib/ambience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Halloween Vault — Halloween & Fall Streaming Discovery" },
      {
        name: "description",
        content:
          "A magical library of Halloween movies, horror, cartoon specials, TV episodes and cozy autumn films. Enter the Vault.",
      },
      { property: "og:title", content: "The Halloween Vault" },
      {
        property: "og:description",
        content:
          "Discover Halloween movies, spooky TV episodes, animated specials and fall favourites in one cinematic library.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VaultHome,
});

function VaultHome() {
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(true);
  const [query, setQuery] = useState("");
  const [decade, setDecade] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const favorites = useFavorites();
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

  const picks = useMemo(() => dailyPicks(), []);

  const results = useMemo(() => {
    const pool = decade ? titles.filter((t) => t.decade === decade) : titles;
    return searchVault(query, pool);
  }, [query, decade]);

  const filtering = query.trim().length > 0 || decade !== null;
  const favoriteItems = titles.filter((t) => favorites.has(t.id));
  const hero = useReveal<HTMLDivElement>();

  const toggleSound = () => {
    spookClick();
    if (muted) startAmbience();
    else fadeOutAmbience();
    setMuted(!muted);
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


      <GlassFilters />
      <Atmosphere />

      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-8">
        <nav
          aria-label="Primary"
          className="glass glass-edge glass-sheen mx-auto flex max-w-6xl items-center gap-2 rounded-full px-3 py-2"
        >
          <a
            href="#top"
            onClick={spookClick}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-moonlight"
          >
            <HauntedHouseIcon className="size-5 text-pumpkin" />
            <span className="hidden font-display text-sm tracking-wide sm:inline">
              The Halloween Vault
            </span>
          </a>

          <label className="ml-auto flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/5 px-3 py-2 sm:max-w-xs">
            <CrystalBallIcon className="size-5 shrink-0 text-pumpkin" />
            <span className="sr-only">Search the vault</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search spells, ghosts, pumpkins…"
              className="w-full bg-transparent text-sm text-moonlight outline-hidden placeholder:text-moonlight/40"
            />
          </label>

          <a
            href="#favorites"
            onClick={spookClick}
            className="grid size-11 place-items-center rounded-full text-moonlight hover:bg-white/5"
            aria-label="Favourites"
          >
            <PumpkinIcon className="size-5" />
          </a>
          <button
            onClick={toggleSound}
            aria-label={muted ? "Unmute Halloween ambience" : "Mute Halloween ambience"}
            className="grid size-11 place-items-center rounded-full text-moonlight hover:bg-white/5"
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
            className="grid size-11 place-items-center rounded-full text-moonlight hover:bg-white/5"
          >
            <CandlesIcon className="size-5" />
          </button>
        </nav>

        {menuOpen && (
          <div className="glass glass-edge mx-auto mt-3 max-w-6xl rounded-3xl p-5 text-sm text-moonlight">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-pumpkin">Sections</p>
                <ul className="space-y-1">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="text-moonlight/80 hover:text-moonlight">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-pumpkin">
                  Accessibility
                </p>
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
        {/* Featured tonight */}
        <section className="relative min-h-dvh overflow-hidden pt-28">
          <img
            src={heroTown}
            alt="A Halloween town at night beneath a full moon with a giant glowing jack-o'-lantern"
            width={1920}
            height={1088}
            className="absolute inset-0 size-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/30" />

          <div
            ref={hero.ref}
            data-visible={hero.visible}
            className="reveal relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-10"
          >
            <p className="text-xs uppercase tracking-[0.45em] text-pumpkin">Featured tonight</p>
            <h1 className="ember-glow mt-4 max-w-3xl font-display text-4xl leading-[1.05] text-moonlight sm:text-6xl">
              {featured.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-moonlight/75 sm:text-base">
              {featured.description}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-moonlight/50">
              {featured.year} · {featured.runtime} · {featured.genres.join(" · ")} ·{" "}
              {featured.streaming.join(", ")}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={featured.watchUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={spookClick}
                className="glass glass-edge glass-sheen inline-flex min-h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold text-moonlight transition-transform hover:scale-[1.04]"
              >
                <PlayPumpkinIcon className="size-5 text-pumpkin" /> Watch now
              </a>
              <button
                onClick={() => {
                  spookClick();
                  favorites.toggle(featured.id);
                }}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-7 text-sm font-medium text-moonlight/85 hover:bg-white/5"
              >
                <PumpkinIcon className="size-5" />
                {favorites.has(featured.id) ? "In your vault" : "Add to favourites"}
              </button>
            </div>

            {/* Countdown */}
            <div className="glass glass-edge mt-12 inline-flex flex-wrap items-center gap-6 rounded-3xl px-6 py-4">
              <span className="text-xs uppercase tracking-[0.3em] text-pumpkin">
                Until Halloween
              </span>
              <div className="flex gap-5">
                {(
                  [
                    ["Days", clock.days],
                    ["Hrs", clock.hours],
                    ["Min", clock.minutes],
                    ["Sec", clock.seconds],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="text-center">
                    <div className="font-display text-2xl text-moonlight tabular-nums">
                      {String(value).padStart(2, "0")}
                    </div>
                    <div className="text-[0.6rem] uppercase tracking-[0.2em] text-moonlight/50">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search / filter results */}
        {filtering && (
          <section className="mx-auto max-w-6xl px-5 py-14 sm:px-10">
            <h2 className="font-display text-2xl text-moonlight">
              {results.length} result{results.length === 1 ? "" : "s"}
              {decade ? ` from the ${decade}` : ""}
            </h2>
            <div className="row-scroll mt-6 flex gap-5 pb-4">
              {results.map((item) => (
                <TitleCard
                  key={item.id}
                  item={item}
                  isFavorite={favorites.has(item.id)}
                  onToggleFavorite={favorites.toggle}
                />
              ))}
            </div>
          </section>
        )}

        <Oracle />

        {/* Daily picks */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10">
          <h2 className="font-display text-2xl text-moonlight sm:text-3xl">
            Today&rsquo;s Halloween pick
          </h2>
          <p className="mt-1 text-sm text-moonlight/55">
            One movie, one episode, one special — new every day of October.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              ["Movie", picks.movie],
              ["Episode", picks.episode],
              ["Special", picks.special],
            ].map(([label, item]) => {
              const t = item as typeof picks.movie;
              return (
                <div key={t.id} className="glass glass-edge glass-sheen rounded-3xl p-5">
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-pumpkin">
                    {label as string}
                  </p>
                  <h3 className="mt-2 font-display text-lg text-moonlight">{t.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-moonlight/70">{t.description}</p>
                  <p className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-moonlight/45">
                    Halloween score {t.halloweenScore} · Fall score {t.fallScore}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Library sections */}
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="py-12">
            <div className="mb-6 px-5 sm:px-10">
              <h2 className="font-display text-3xl text-moonlight sm:text-4xl">{section.label}</h2>
            </div>
            <div className="space-y-14">
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

        {/* Decades */}
        <section id="decades" className="mx-auto max-w-6xl px-5 py-16 sm:px-10">
          <h2 className="font-display text-3xl text-moonlight sm:text-4xl">Decades</h2>
          <p className="mt-1 text-sm text-moonlight/55">Travel back through seventy Octobers.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {decades.map((d) => (
              <button
                key={d}
                onClick={() => {
                  spookClick();
                  setDecade(decade === d ? null : d);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                aria-pressed={decade === d}
                className={`glass glass-edge min-h-11 rounded-full px-6 text-sm text-moonlight transition-transform hover:scale-105 ${
                  decade === d ? "ring-2 ring-pumpkin" : ""
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* Favourites */}
        <section id="favorites" className="mx-auto max-w-6xl px-5 py-16 sm:px-10">
          <h2 className="font-display text-3xl text-moonlight sm:text-4xl">Your vault</h2>
          {favoriteItems.length === 0 ? (
            <div className="glass glass-edge mt-6 flex items-center gap-4 rounded-3xl p-6">
              <SpellCircleIcon className="size-8 shrink-0 text-pumpkin" />
              <p className="text-sm text-moonlight/70">
                Nothing saved yet. Tap the pumpkin heart on any title and it will appear here.
              </p>
            </div>
          ) : (
            <div className="row-scroll mt-6 flex gap-5 pb-4">
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

      <footer className="mx-auto max-w-6xl px-5 pb-16 text-xs text-moonlight/45 sm:px-10">
        <p>
          The Halloween Vault — a cinematic discovery library for Halloween, horror and autumn
          entertainment.
        </p>
      </footer>
    </>
  );
}
