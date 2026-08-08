import { useMemo } from "react";
import { calendarDay, countdownToHalloween, libraryStats } from "@/data/vault";
import { scoresOf } from "@/data/seasonal";
import { artworkChainFallback } from "@/data/sources";
import { useHydrated } from "@/hooks/use-vault";
import { spookClick } from "@/lib/ambience";

/** THE HALLOWEEN CALENDAR — a dedicated October experience. */
export function HalloweenCalendar() {
  const hydrated = useHydrated();
  const day = useMemo(() => (hydrated ? calendarDay() : null), [hydrated]);
  const stats = useMemo(() => libraryStats(), []);
  const clock = useMemo(() => (hydrated ? countdownToHalloween() : null), [hydrated]);

  return (
    <section
      id="calendar"
      aria-labelledby="calendar-heading"
      className="gutter mx-auto max-w-[1400px] scroll-mt-32 py-[var(--space-section)]"
    >
      <p className="eyebrow">The October experience</p>
      <h2 id="calendar-heading" className="mt-2 font-display text-3xl font-bold text-moonlight sm:text-4xl">
        The Halloween Calendar
      </h2>
      <p className="mt-2 max-w-xl text-sm text-moonlight/55">
        {day?.label ?? "Today"} — a Halloween pick, a Fall pick, an episode, a themed collection and
        one piece of trivia. Refreshed every day of the season.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ["Halloween pick", day?.halloweenPick],
              ["Fall pick", day?.fallPick],
              ["TV episode", day?.episodePick],
            ] as const
          ).map(([label, t]) => (
            <article key={label} className="glass glass-edge overflow-hidden rounded-3xl">
              {t && (
                <img
                  src={t.art}
                  alt={`Artwork for ${t.title}`}
                  loading="lazy"
                  decoding="async"
                  onError={artworkChainFallback({ title: t.title, localArt: t.art })}
                  className="h-32 w-full object-cover opacity-80"
                />
              )}
              <div className="p-5">
                <p className="eyebrow">{label}</p>
                {t ? (
                  <>
                    <h3 className="mt-2 font-display text-lg font-semibold text-moonlight">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-moonlight/45">
                      {t.kind === "episode" ? `${t.show} · S${t.season}E${t.episode}` : t.year} ·
                      Seasonal {scoresOf(t).overall}
                    </p>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-moonlight/65">
                      {t.description}
                    </p>
                    {t.watchUrl && (
                      <a
                        href={t.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={spookClick}
                        className="mt-4 inline-flex min-h-10 items-center rounded-full bg-crimson px-5 text-xs font-semibold text-moonlight hover:bg-crimson/85"
                      >
                        Watch
                      </a>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-xs text-moonlight/45">Consulting the calendar…</p>
                )}
              </div>
            </article>
          ))}
        </div>

        <aside className="glass glass-edge rounded-3xl p-5">
          <p className="eyebrow">Countdown</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(
              [
                ["Days", clock?.days ?? 0],
                ["Hrs", clock?.hours ?? 0],
                ["Min", clock?.minutes ?? 0],
                ["Sec", clock?.seconds ?? 0],
              ] as const
            ).map(([l, v]) => (
              <div key={l} className="text-center">
                <div className="font-display text-xl font-bold tabular-nums text-moonlight">
                  {String(v).padStart(2, "0")}
                </div>
                <div className="text-[0.55rem] uppercase tracking-[0.18em] text-moonlight/45">{l}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-border pt-4 text-[0.65rem] uppercase tracking-[0.2em] text-pumpkin">
            Daily trivia
          </p>
          <p className="mt-2 text-xs leading-relaxed text-moonlight/65">{day?.trivia ?? "…"}</p>
          <p className="mt-5 border-t border-border pt-4 text-[0.68rem] leading-relaxed text-moonlight/50">
            {stats.total.toLocaleString()} titles · {stats.movies.toLocaleString()} movies ·{" "}
            {stats.episodes.toLocaleString()} episodes · {stats.specials.toLocaleString()} specials ·{" "}
            {stats.shows} series indexed.
          </p>
        </aside>
      </div>

      {day && day.collection.items.length > 0 && (
        <div className="mt-10">
          <p className="eyebrow">Today&rsquo;s collection</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-moonlight">
            {day.collection.label}
          </h3>
          <p className="mt-1 text-sm text-moonlight/55">{day.collection.blurb}</p>
          <div className="row-scroll edge-fade mt-5 flex gap-3 pb-2">
            {day.collection.items.map((t) => (
              <a
                key={t.id}
                href={t.watchUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={spookClick}
                className="glass glass-edge w-40 shrink-0 rounded-2xl p-3 hover:bg-white/5"
              >
                <img
                  src={t.art}
                  alt={`Artwork for ${t.title}`}
                  loading="lazy"
                  decoding="async"
                  onError={artworkChainFallback({ title: t.title, localArt: t.art })}
                  className="h-24 w-full rounded-xl object-cover"
                />
                <p className="mt-2 line-clamp-2 text-xs font-semibold text-moonlight">{t.title}</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.14em] text-moonlight/45">
                  {t.kind} · {t.year}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
