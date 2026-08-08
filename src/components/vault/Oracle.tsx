import { useMemo, useState } from "react";
import { consultOracle, ORACLE_MOODS, type OracleMood, type OracleResult } from "@/data/vault";
import { scoresOf, tagsOf } from "@/data/seasonal";
import { artworkFallback } from "@/data/sources";
import { crystalChime, drumRoll, magicReveal, pumpkinPop, spellCast } from "@/lib/ambience";
import { PlayPumpkinIcon } from "./icons";

const MOOD_GLYPH: Record<OracleMood, string> = {
  "Classic Halloween": "✶",
  "Family Fun": "❋",
  Scary: "☾",
  Supernatural: "✧",
  Witchy: "✷",
  "Ghost Stories": "❈",
  "Cozy Autumn": "✦",
  "Harvest Season": "❂",
  Animated: "✵",
  "Hidden Gems": "◈",
  "TV Episodes": "▤",
  "90s Halloween": "✹",
  "80s Halloween": "✸",
  "Campy Halloween": "☻",
  "Dark Fantasy": "✺",
};

/** THE HALLOWEEN ORACLE — the Vault's signature seasonal recommender. */
export function Oracle() {
  const [mood, setMood] = useState<OracleMood>("Classic Halloween");
  const [casting, setCasting] = useState(false);
  const [result, setResult] = useState<OracleResult | null>(null);
  const [seen, setSeen] = useState<string[]>([]);

  const blurb = useMemo(() => ORACLE_MOODS.find((m) => m.mood === mood)?.blurb, [mood]);

  const cast = () => {
    if (casting) return;
    setCasting(true);
    setResult(null);
    spellCast();
    window.setTimeout(() => drumRoll(1.1), 250);
    window.setTimeout(() => {
      const r = consultOracle(mood, seen);
      setResult(r);
      setSeen((s) => [...s.slice(-10), r.title.id]);
      setCasting(false);
      magicReveal();
    }, 1500);
  };

  return (
    <section
      id="oracle"
      aria-labelledby="oracle-heading"
      className="gutter mx-auto max-w-[1400px] py-[var(--space-section)]"
    >
      <div className="glass glass-deep glass-edge relative overflow-hidden rounded-3xl p-6 sm:p-12">
        <p className="eyebrow">Signature attraction</p>
        <h2
          id="oracle-heading"
          className="wordmark mt-3 text-3xl text-moonlight sm:text-5xl"
        >
          The Halloween Oracle
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-moonlight/65">
          Pick a mood. The Oracle weighs seasonal relevance — not popularity — and chooses what you
          watch tonight.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
          {/* Crystal ball — single static element, no particle loops */}
          <div className="relative mx-auto grid size-56 place-items-center">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full border border-pumpkin/20"
              style={{ animation: casting ? "rune-spin 6s linear infinite" : undefined }}
            />
            <div
              aria-hidden
              className="size-44 rounded-full transition-transform duration-500"
              style={{
                background:
                  "radial-gradient(circle at 34% 28%, oklch(0.95 0.03 300 / .55), oklch(0.5 0.18 20 / .5) 45%, oklch(0.16 0.07 305 / .95) 78%)",
                boxShadow:
                  "inset -18px -22px 50px oklch(0.05 0.02 300 / .8), inset 14px 16px 40px oklch(1 0 0 / .18), 0 0 80px oklch(0.55 0.24 20 / .35)",
                transform: casting ? "scale(1.06)" : "scale(1)",
              }}
            />
            <p
              aria-live="polite"
              className="absolute -bottom-6 text-[0.62rem] uppercase tracking-[0.34em] text-moonlight/45"
            >
              {casting ? "Casting" : result ? "Revealed" : "Awaiting"}
            </p>
          </div>

          {/* Controls */}
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-moonlight/50">
              Choose a mood
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {ORACLE_MOODS.map((m) => {
                const active = mood === m.mood;
                return (
                  <button
                    key={m.mood}
                    onClick={() => {
                      pumpkinPop();
                      setMood(m.mood);
                    }}
                    aria-pressed={active}
                    className={`flex min-h-14 flex-col items-start justify-center rounded-2xl border px-4 text-left transition-colors ${
                      active
                        ? "border-pumpkin/70 bg-crimson/20 text-moonlight"
                        : "border-border text-moonlight/75 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm font-semibold">
                      <span className="mr-2 text-pumpkin">{MOOD_GLYPH[m.mood]}</span>
                      {m.mood}
                    </span>
                    <span className="mt-0.5 truncate text-[0.65rem] text-moonlight/45">
                      {m.blurb}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-moonlight/50">{blurb}</p>

            <button
              onClick={cast}
              disabled={casting}
              className="mt-7 min-h-13 rounded-full bg-crimson px-10 font-display text-sm font-semibold uppercase tracking-[0.24em] text-moonlight transition-colors hover:bg-crimson/85 disabled:opacity-60"
            >
              {casting ? "Casting…" : "Cast the spell"}
            </button>

            {result && (
              <div
                className="glass glass-edge mt-8 flex flex-col gap-5 rounded-3xl p-5 sm:flex-row"
                style={{ animation: "reveal-pop .5s cubic-bezier(.22,1,.36,1)" }}
              >
                <img
                  src={result.title.art}
                  alt={`Poster for ${result.title.title}`}
                  width={320}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  onError={artworkFallback(result.title.art)}
                  className="h-44 w-30 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold text-moonlight">
                    {result.title.title}
                  </h3>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-moonlight/50">
                    {result.title.year} · {result.title.runtime} ·{" "}
                    {result.title.streaming.join(", ")}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-moonlight/75">
                    {result.title.description}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-pumpkin">{result.reason}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tagsOf(result.title)
                      .slice(0, 5)
                      .map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-moonlight/60"
                        >
                          {t}
                        </span>
                      ))}
                  </div>
                  <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-moonlight/45">
                    Seasonal {scoresOf(result.title).overall} · Halloween{" "}
                    {scoresOf(result.title).halloween} · Fall {scoresOf(result.title).fall}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={result.title.watchUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => crystalChime()}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-crimson/85 px-6 text-sm font-semibold text-moonlight hover:bg-crimson"
                    >
                      <PlayPumpkinIcon className="size-4" /> Watch now
                    </a>
                    <button
                      onClick={cast}
                      className="min-h-11 rounded-full border border-border px-6 text-sm text-moonlight/80 hover:bg-white/5"
                    >
                      Cast again
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
