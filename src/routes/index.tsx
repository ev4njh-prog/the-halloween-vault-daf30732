import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { HouseIntro } from "@/components/vault/HouseIntro";
import { HalloweenCalendar } from "@/components/vault/Calendar";
import { Row, TitleCard } from "@/components/vault/Row";
import { GuideHost } from "@/components/vault/GuideHost";
import { PlayPumpkinIcon } from "@/components/vault/icons";
import { getRows } from "@/data/catalog";
import { countdownToHalloween, dailyPicks, featured, libraryStats } from "@/data/vault";
import { scoresOf, tagsOf } from "@/data/seasonal";
import { artworkFallbackHandler } from "@/data/artwork";
import { useFavorites, useHydrated } from "@/hooks/use-vault";
import { spookClick, startAmbience } from "@/lib/ambience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Halloween Vault — Seasonal Streaming Discovery" },
      {
        name: "description",
        content:
          "A cinematic Halloween and autumn discovery platform: featured tonight, the October countdown, daily picks, the Halloween Oracle and thousands of seasonally-ranked titles.",
      },
      { property: "og:title", content: "The Halloween Vault" },
      {
        property: "og:description",
        content:
          "Featured tonight, the October countdown, daily picks and the Halloween Oracle — ranked by seasonal relevance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

/** Intro plays once per browser session, never on internal navigation. */
function useIntro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("vault:intro")) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);
  const dismiss = () => {
    try {
      sessionStorage.setItem("vault:intro", "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };
  return { show, dismiss };
}

function Countdown() {
  const hydrated = useHydrated();
  const [t, setT] = useState(() => countdownToHalloween());

  useEffect(() => {
    const id = window.setInterval(() => setT(countdownToHalloween()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const cells = [
    { v: t.days, l: "Days" },
    { v: t.hours, l: "Hrs" },
    { v: t.minutes, l: "Min" },
    { v: t.seconds, l: "Sec" },
  ];

  return (
    <div className="glass glass-edge inline-flex items-center gap-4 rounded-2xl px-5 py-3">
      {cells.map((c) => (
        <div key={c.l} className="text-center">
          <p className="font-display text-xl font-semibold leading-none text-pumpkin tabular-nums">
            {hydrated ? String(c.v).padStart(2, "0") : "--"}
          </p>
          <p className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-moonlight/45">{c.l}</p>
        </div>
      ))}
    </div>
  );
}

function HomePage() {
  const intro = useIntro();
  const favorites = useFavorites();
  const hydrated = useHydrated();

  const rows = getRows("discover");
  const stats = useMemo(() => libraryStats(), []);
  // Daily picks are date-derived; render after hydration to avoid drift.
  const picks = useMemo(() => (hydrated ? dailyPicks() : null), [hydrated]);

  const scores = scoresOf(featured);
  const tags = tagsOf(featured).slice(0, 4);

  return (
    <>
      {intro.show && (
        <HouseIntro
          onEnter={(withSound) => {
            if (withSound) startAmbience();
            intro.dismiss();
          }}
        />
      )}

      {/* FEATURED TONIGHT ------------------------------------------------ */}
      <section className="gutter mx-auto max-w-[1400px] pt-4" aria-label="Featured tonight">
        <div className="glass glass-edge relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0">
            <img
              src={featured.art}
              alt=""
              aria-hidden
              onError={artworkFallbackHandler({
                id: featured.id,
                title: featured.title,
                localArt: featured.art,
              })}
              className="size-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/25" />
          </div>

          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow">Featured tonight</p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] text-moonlight sm:text-6xl">
                {featured.title}
              </h1>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-moonlight/55">
                {featured.year} · {featured.runtime} · Halloween {scores.halloween} · Fall{" "}
                {scores.fall}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-moonlight/70">
                {featured.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-3 py-1 text-[0.6rem] uppercase tracking-[0.14em] text-pumpkin/85"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={featured.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={spookClick}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-crimson px-7 text-sm font-semibold text-moonlight transition-colors hover:bg-crimson/85"
                >
                  <PlayPumpkinIcon className="size-4" /> Watch
                </a>
                <Link
                  to="/oracle"
                  onClick={spookClick}
                  className="inline-flex min-h-12 items-center rounded-full border border-border px-7 text-sm font-medium text-moonlight/85 transition-colors hover:bg-white/5"
                >
                  Ask the Oracle
                </Link>
                <Link
                  to="/discover"
                  search={{ q: "", tag: "", decade: "" }}
                  onClick={spookClick}
                  className="inline-flex min-h-12 items-center rounded-full border border-border px-7 text-sm font-medium text-moonlight/85 transition-colors hover:bg-white/5"
                >
                  Browse all {stats.total}
                </Link>
              </div>
            </div>

            <div className="lg:pb-2">
              <p className="eyebrow mb-2">Countdown to Halloween</p>
              <Countdown />
            </div>
          </div>
        </div>
      </section>

      {/* DAILY PICKS ----------------------------------------------------- */}
      <section className="gutter mx-auto mt-14 max-w-[1400px]" aria-label="Today's picks">
        <h2 className="font-display text-2xl font-semibold text-moonlight sm:text-3xl">
          Today’s picks
        </h2>
        <p className="mt-1 text-sm text-moonlight/55">
          One film, one episode and one special, chosen fresh each day.
        </p>
        <div className="mt-5 flex flex-wrap gap-5">
          {picks ? (
            [picks.movie, picks.episode, picks.special].map((item) => (
              <TitleCard
                key={item.id}
                item={item}
                priority
                isFavorite={favorites.ids.includes(item.id)}
                onToggleFavorite={favorites.toggle}
              />
            ))
          ) : (
            <div className="h-[420px] w-full" />
          )}
        </div>
      </section>

      {/* CALENDAR -------------------------------------------------------- */}
      <section className="mt-16" aria-label="Halloween calendar">
        <HalloweenCalendar />
      </section>

      {/* GUIDE ----------------------------------------------------------- */}
      <section className="gutter mx-auto mt-16 max-w-[1400px]">
        <GuideHost />
      </section>

      {/* DISCOVERY RAILS -------------------------------------------------- */}
      <div className="mt-16 space-y-12 pb-20">
        {rows.map((row) => (
          <Row
            key={row.id}
            row={row}
            favorites={favorites.ids}
            onToggleFavorite={favorites.toggle}
          />
        ))}
      </div>
    </>
  );
}
