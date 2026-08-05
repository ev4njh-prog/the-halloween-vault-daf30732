import { useState } from "react";
import { consultOracle, ORACLE_MOODS, type OracleMood, type OracleResult } from "@/data/vault";
import { crystalChime, drumRoll, magicReveal, pumpkinPop, spellCast, witchLaugh } from "@/lib/ambience";
import { PlayPumpkinIcon } from "./icons";

/** THE HALLOWEEN ORACLE — a magical mood-driven movie picker. */
export function Oracle() {
  const [mood, setMood] = useState<OracleMood>("Scary");
  const [casting, setCasting] = useState(false);
  const [result, setResult] = useState<OracleResult | null>(null);
  const [seen, setSeen] = useState<string[]>([]);

  const cast = () => {
    if (casting) return;
    setCasting(true);
    setResult(null);
    spellCast();
    window.setTimeout(() => drumRoll(1.8), 300);
    window.setTimeout(() => witchLaugh(false), 1500);
    window.setTimeout(() => {
      const r = consultOracle(mood, seen);
      setResult(r);
      setSeen((s) => [...s.slice(-8), r.title.id]);
      setCasting(false);
      magicReveal();
    }, 2600);
  };

  return (
    <section id="oracle" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-10">
      <div className="glass glass-deep glass-edge glass-sheen relative overflow-hidden rounded-[2rem] p-7 sm:p-12">
        {/* Bats circling the attraction */}
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            aria-hidden
            className="pointer-events-none absolute text-crimson/40"
            style={
              {
                left: i % 2 ? "6%" : "88%",
                top: `${16 + i * 18}%`,
                "--bx": i % 2 ? "70vw" : "-70vw",
                "--by": `${-6 - i * 3}vh`,
                animation: `bat-fly ${12 + i * 3}s linear ${i * 2.5}s infinite`,
              } as React.CSSProperties
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ animation: "wing .25s ease-in-out infinite" }}>
              <path d="M2.5 9.5c2 0 3-1.2 4-2.4.2 1.6 1 2.6 2.3 3.1.6-1 1.8-1.6 3.2-1.6s2.6.6 3.2 1.6c1.3-.5 2.1-1.5 2.3-3.1 1 1.2 2 2.4 4 2.4-1.6 1.3-2 3-2 5-1.6-.9-3-.6-4.2.5-1 .9-1.6 2-3.3 2s-2.3-1.1-3.3-2c-1.2-1.1-2.6-1.4-4.2-.5 0-2-.4-3.7-2-5Z" />
            </svg>
          </span>
        ))}

        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-pumpkin">Step inside</p>
        <h2 className="ember-glow mt-3 font-display text-3xl text-moonlight sm:text-5xl">THE HALLOWEEN ORACLE</h2>
        <p className="mt-3 max-w-lg text-sm text-moonlight/70">
          Choose your mood, cast the spell, and let the crystal ball decide what you watch tonight.
        </p>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[320px_1fr]">
          {/* Crystal ball */}
          <div className="relative mx-auto grid size-64 place-items-center">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full border border-pumpkin/25"
              style={{ animation: "rune-spin 26s linear infinite" }}
            >
              {["✷", "✶", "☾", "✦", "✵", "❋"].map((r, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-0 -translate-x-1/2 text-pumpkin/70"
                  style={{ transform: `rotate(${i * 60}deg) translateY(-2px)`, transformOrigin: "0 128px" }}
                >
                  {r}
                </span>
              ))}
            </div>
            <div
              className="relative size-48 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 34% 28%, oklch(0.95 0.03 300 / .6), oklch(0.5 0.18 20 / .5) 45%, oklch(0.18 0.08 305 / .9) 78%)",
                boxShadow:
                  "inset -18px -22px 50px oklch(0.05 0.02 300 / .8), inset 14px 16px 40px oklch(1 0 0 / .25), 0 0 90px oklch(0.55 0.24 20 / .5)",
                animation: casting ? "orb-swirl 1.1s ease-in-out infinite" : "orb-swirl 7s ease-in-out infinite",
              }}
            >
              {casting &&
                Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-pumpkin"
                    style={
                      {
                        boxShadow: "0 0 14px #ffd166",
                        "--px": `${Math.cos(i) * 90}px`,
                        "--py": `${Math.sin(i) * 90}px`,
                        animation: `particle-float ${1 + (i % 4) * 0.3}s linear ${i * 0.08}s infinite`,
                      } as React.CSSProperties
                    }
                  />
                ))}
            </div>
            {/* Pedestal */}
            <div aria-hidden className="absolute -bottom-2 h-6 w-40 rounded-[50%] bg-black/70 blur-md" />
          </div>

          {/* Controls */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-pumpkin">Choose a mood</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {ORACLE_MOODS.map((m) => (
                <button
                  key={m.mood}
                  onClick={() => {
                    pumpkinPop();
                    setMood(m.mood);
                  }}
                  aria-pressed={mood === m.mood}
                  className={`glass glass-edge min-h-11 rounded-full px-5 text-sm text-moonlight ${
                    mood === m.mood ? "ring-2 ring-pumpkin" : ""
                  }`}
                >
                  {m.mood}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-moonlight/55">
              {ORACLE_MOODS.find((m) => m.mood === mood)?.blurb}
            </p>

            <button
              onClick={cast}
              disabled={casting}
              className="glass glass-edge glass-sheen mt-7 min-h-14 rounded-full px-10 font-display text-base tracking-[0.2em] text-moonlight disabled:opacity-70"
            >
              {casting ? "CASTING…" : "CAST THE SPELL"}
            </button>

            {result && (
              <div
                className="glass glass-edge mt-8 flex flex-col gap-5 rounded-[1.5rem] p-5 sm:flex-row"
                style={{ animation: "reveal-pop .8s cubic-bezier(.22,1,.36,1)" }}
              >
                <img
                  src={result.title.art}
                  alt={`Poster for ${result.title.title}`}
                  width={320}
                  height={480}
                  className="h-48 w-32 shrink-0 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="font-display text-xl text-moonlight">{result.title.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-moonlight/50">
                    {result.title.year} · {result.title.runtime} · {result.title.streaming.join(", ")}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-moonlight/75">{result.title.description}</p>
                  <p className="mt-3 text-xs leading-relaxed text-pumpkin">{result.reason}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={result.title.watchUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => crystalChime()}
                      className="glass glass-edge inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-moonlight"
                    >
                      <PlayPumpkinIcon className="size-4 text-pumpkin" /> Watch now
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
