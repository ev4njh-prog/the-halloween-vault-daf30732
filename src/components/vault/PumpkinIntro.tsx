import { useEffect, useState } from "react";
import { pumpkinLaugh, startAmbience } from "@/lib/ambience";

interface Props {
  onEnter: (withSound: boolean) => void;
}

/**
 * Cinematic opening: a giant enchanted jack-o'-lantern wakes in a dark
 * Halloween town, bats burst out, leaves fall, the vault opens.
 */
export function PumpkinIntro({ onEnter }: Props) {
  const [phase, setPhase] = useState(0); // 0 dark · 1 pumpkin · 2 eyes · 3 bats · 4 title
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 400),
      window.setTimeout(() => setPhase(2), 1800),
      window.setTimeout(() => setPhase(3), 3000),
      window.setTimeout(() => setPhase(4), 3900),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const enter = (withSound: boolean) => {
    if (withSound) {
      startAmbience();
      pumpkinLaugh();
    }
    setLeaving(true);
    window.setTimeout(() => onEnter(withSound), 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black"
      style={leaving ? { animation: "vault-open 0.9s ease-in forwards" } : undefined}
      role="dialog"
      aria-label="The Halloween Vault opening sequence"
    >
      {/* Night sky + moon */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms]"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          background:
            "radial-gradient(80% 60% at 78% 18%, oklch(0.35 0.06 300 / .55), transparent 60%), radial-gradient(120% 90% at 50% 110%, oklch(0.3 0.14 30 / .35), transparent 65%)",
        }}
      />
      <div
        className="absolute right-[14%] top-[10%] size-24 rounded-full transition-all duration-[2500ms] sm:size-36"
        style={{
          opacity: phase >= 1 ? 0.9 : 0,
          background: "radial-gradient(circle at 38% 34%, oklch(0.97 0.02 90), oklch(0.78 0.03 90))",
          boxShadow: "0 0 120px oklch(0.9 0.05 90 / .45)",
        }}
      />

      {/* Fog */}
      <div
        className="pointer-events-none absolute inset-x-[-20%] bottom-0 h-1/2 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 100%, oklch(0.5 0.06 320 / .3), transparent 70%), radial-gradient(50% 50% at 75% 100%, oklch(0.45 0.1 20 / .25), transparent 70%)",
          animation: "fog-drift 22s ease-in-out infinite alternate",
        }}
      />

      {/* Bats */}
      {phase >= 3 &&
        Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute left-1/2 top-[58%] text-crimson"
            style={
              {
                "--bx": `${(i % 2 ? -1 : 1) * (18 + i * 7)}vw`,
                "--by": `${-25 - i * 5}vh`,
                animation: `bat-fly ${2.4 + i * 0.22}s ease-out ${i * 0.09}s forwards`,
              } as React.CSSProperties
            }
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ animation: "wing .22s ease-in-out infinite" }}>
              <path d="M2.5 9.5c2 0 3-1.2 4-2.4.2 1.6 1 2.6 2.3 3.1.6-1 1.8-1.6 3.2-1.6s2.6.6 3.2 1.6c1.3-.5 2.1-1.5 2.3-3.1 1 1.2 2 2.4 4 2.4-1.6 1.3-2 3-2 5-1.6-.9-3-.6-4.2.5-1 .9-1.6 2-3.3 2s-2.3-1.1-3.3-2c-1.2-1.1-2.6-1.4-4.2-.5 0-2-.4-3.7-2-5Z" />
            </svg>
          </span>
        ))}

      {/* Falling leaves */}
      {phase >= 3 &&
        Array.from({ length: 14 }).map((_, i) => (
          <span
            key={`l${i}`}
            aria-hidden
            className="absolute top-0 block size-2 rounded-[40%_60%_50%_50%] bg-pumpkin/70"
            style={{
              left: `${(i * 7.3) % 100}%`,
              animation: `leaf-fall ${7 + (i % 5)}s linear ${i * 0.5}s infinite`,
            }}
          />
        ))}

      {/* The pumpkin */}
      <div
        className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 transition-all duration-[1600ms]"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${phase >= 1 ? 1 : 0.82})`,
          animation: phase >= 2 ? "float-soft 6s ease-in-out infinite" : undefined,
        }}
      >
        <svg width="300" height="240" viewBox="0 0 300 240" className="max-w-[80vw]" role="img" aria-label="A giant glowing jack-o'-lantern">
          <defs>
            <radialGradient id="flesh" cx="42%" cy="34%">
              <stop offset="0%" stopColor="#ff9a3c" />
              <stop offset="55%" stopColor="#e0651a" />
              <stop offset="100%" stopColor="#7a2b06" />
            </radialGradient>
            <radialGradient id="glow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#ffe08a" />
              <stop offset="60%" stopColor="#ff8a1f" />
              <stop offset="100%" stopColor="#ff5b00" stopOpacity="0" />
            </radialGradient>
            <filter id="soft"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>

          <ellipse cx="150" cy="140" rx="140" ry="110" fill="url(#glow)" opacity={phase >= 2 ? 0.45 : 0} filter="url(#soft)" style={{ animation: phase >= 2 ? "flicker 3.6s ease-in-out infinite" : undefined }} />
          <path d="M148 40c-2-12 4-22 16-26-2 12 2 20 10 24" stroke="#4a7a2a" strokeWidth="10" fill="none" strokeLinecap="round" />
          <ellipse cx="150" cy="150" rx="120" ry="86" fill="url(#flesh)" />
          <path d="M92 78c-16 40-16 104 0 144M208 78c16 40 16 104 0 144M150 66c-8 44-8 124 0 168" stroke="#8c3608" strokeOpacity=".55" strokeWidth="5" fill="none" />

          <g opacity={phase >= 2 ? 1 : 0} style={{ transition: "opacity 1.1s ease", animation: phase >= 2 ? "flicker 4.2s ease-in-out infinite" : undefined }}>
            <path d="M96 128 130 108 132 140 100 146Z" fill="#ffd166" />
            <path d="M204 128 170 108 168 140 200 146Z" fill="#ffd166" />
            <path d="M150 148 138 138 132 150Z" fill="#ffd166" />
          </g>
          <g opacity={phase >= 3 ? 1 : 0} style={{ transition: "opacity 1s ease .2s" }}>
            <path d="M96 172c14 26 40 38 54 38s40-12 54-38c-12 6-22 4-30-2-6 8-16 10-24 4-8 6-18 4-24-4-8 6-18 8-30 2Z" fill="#ffcf5c" />
          </g>
        </svg>
      </div>

      {/* Crimson glass title panel */}
      <div
        className="absolute inset-x-0 bottom-[8%] flex flex-col items-center gap-6 px-6 text-center transition-all duration-1000"
        style={{ opacity: phase >= 4 ? 1 : 0, transform: `translateY(${phase >= 4 ? 0 : 24}px)` }}
      >
        <div className="glass glass-edge glass-sheen rounded-3xl px-8 py-6">
          <p className="text-[0.7rem] uppercase tracking-[0.5em] text-pumpkin">Welcome to</p>
          <h1 className="ember-glow mt-3 font-display text-3xl leading-tight text-moonlight sm:text-5xl">
            THE HALLOWEEN VAULT
          </h1>
          <p className="mt-3 max-w-md text-sm text-moonlight/70">
            A magical library of Halloween, horror and autumn entertainment.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => enter(true)}
            className="glass glass-edge rounded-full px-7 py-3 text-sm font-semibold text-moonlight transition-transform duration-300 hover:scale-[1.04]"
          >
            Enter with sound
          </button>
          <button
            onClick={() => enter(false)}
            className="rounded-full border border-border px-7 py-3 text-sm font-medium text-moonlight/80 transition-colors hover:bg-white/5"
          >
            Enter silently
          </button>
        </div>
      </div>
    </div>
  );
}
