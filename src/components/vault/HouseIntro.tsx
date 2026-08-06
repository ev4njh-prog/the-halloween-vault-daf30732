import { useEffect, useRef, useState } from "react";
import {
  chainRattle,
  cinematicBoom,
  distantThunder,
  doorCreak,
  emberIgnite,
  houseGroan,
  magicReveal,
  reverseWhoosh,
  tryAutoStartAmbience,
  woodLock,
} from "@/lib/ambience";

/**
 * THE HALLOWEEN VAULT — brand identity sequence.
 *
 * A derelict Victorian manor magically reassembles itself out of the dark,
 * its windows ignite blood-red, the wordmark blooms in liquid crystal and the
 * whole frame dissolves into the app. No enter button: audio is attempted
 * immediately and armed on first gesture if the browser refuses.
 */

type Piece = {
  /** delay in seconds before this piece flies home */
  d: number;
  /** origin offset + rotation of the floating fragment */
  fx: string;
  fy: string;
  fr: string;
  el: React.ReactNode;
};

const WALL = "oklch(0.19 0.02 300)";
const WALL_DARK = "oklch(0.13 0.02 300)";
const WOOD = "oklch(0.24 0.03 40)";
const ROOF = "oklch(0.15 0.025 320)";
const EDGE = "oklch(0.42 0.09 20 / 0.55)";

/** Ordered so the silhouette grows from the ground up. */
const PIECES: Piece[] = [
  // Foundation stones
  {
    d: 0.0,
    fx: "0px",
    fy: "220px",
    fr: "-6deg",
    el: <path d="M120 540h560l-28 34H148Z" fill={WALL_DARK} stroke={EDGE} strokeWidth="1.2" />,
  },
  // Main body
  {
    d: 0.35,
    fx: "-420px",
    fy: "90px",
    fr: "-18deg",
    el: <path d="M215 300h370v242H215Z" fill={WALL} stroke={EDGE} strokeWidth="1.4" />,
  },
  // Weathered board seams
  {
    d: 0.62,
    fx: "-260px",
    fy: "-160px",
    fr: "22deg",
    el: (
      <g stroke="oklch(0.28 0.03 30 / .7)" strokeWidth="1">
        {[330, 366, 402, 438, 474, 510].map((y) => (
          <line key={y} x1="215" y1={y} x2="585" y2={y} />
        ))}
      </g>
    ),
  },
  // Left tower
  {
    d: 0.8,
    fx: "-360px",
    fy: "-120px",
    fr: "-26deg",
    el: <path d="M124 268h96v274h-96Z" fill={WALL_DARK} stroke={EDGE} strokeWidth="1.3" />,
  },
  // Right tower (slightly crooked)
  {
    d: 0.98,
    fx: "380px",
    fy: "-130px",
    fr: "24deg",
    el: (
      <path
        d="M580 250h100l6 292h-106Z"
        fill={WALL_DARK}
        stroke={EDGE}
        strokeWidth="1.3"
        transform="rotate(1.2 630 400)"
      />
    ),
  },
  // Main roof — crooked
  {
    d: 1.2,
    fx: "0px",
    fy: "-320px",
    fr: "-14deg",
    el: (
      <path d="M196 306 400 168l208 138-16 16-192-124-188 124Z" fill={ROOF} stroke={EDGE} strokeWidth="1.4" />
    ),
  },
  {
    d: 1.34,
    fx: "-180px",
    fy: "-260px",
    fr: "16deg",
    el: <path d="M212 306 400 186l188 120v10H212Z" fill="oklch(0.11 0.02 315)" opacity="0.95" />,
  },
  // Roof shingles / broken slats
  {
    d: 1.5,
    fx: "150px",
    fy: "-280px",
    fr: "-20deg",
    el: (
      <g stroke="oklch(0.26 0.03 330 / .8)" strokeWidth="1">
        <path d="M250 292 400 196l150 96" fill="none" />
        <path d="M276 272 400 214l124 58" fill="none" />
        <path d="M304 252 400 232l96 20" fill="none" />
      </g>
    ),
  },
  // Left tower roof
  {
    d: 1.62,
    fx: "-300px",
    fy: "-300px",
    fr: "-34deg",
    el: <path d="M112 270 172 168l60 102Z" fill={ROOF} stroke={EDGE} strokeWidth="1.3" />,
  },
  // Right tower spire
  {
    d: 1.76,
    fx: "330px",
    fy: "-320px",
    fr: "30deg",
    el: <path d="M568 252 632 122l60 130Z" fill={ROOF} stroke={EDGE} strokeWidth="1.3" />,
  },
  // Chimney
  {
    d: 1.9,
    fx: "90px",
    fy: "-380px",
    fr: "-18deg",
    el: <path d="M470 214h34v58l-34-22Z" fill={WALL_DARK} stroke={EDGE} strokeWidth="1.1" />,
  },
  // Porch roof + posts
  {
    d: 2.02,
    fx: "0px",
    fy: "180px",
    fr: "8deg",
    el: (
      <g fill={WOOD} stroke={EDGE} strokeWidth="1.1">
        <path d="M300 452h200v14H300Z" />
        <path d="M306 466h10v76h-10Z" />
        <path d="M484 466h10v76h-10Z" />
      </g>
    ),
  },
  // Door
  {
    d: 2.2,
    fx: "0px",
    fy: "260px",
    fr: "-10deg",
    el: (
      <g>
        <path d="M368 476q32-46 64 0v66h-64Z" fill="oklch(0.16 0.04 25)" stroke={EDGE} strokeWidth="1.3" />
        <circle cx="418" cy="512" r="3" fill="oklch(0.5 0.08 60 / .8)" />
      </g>
    ),
  },
  // Windows (frames only — glass ignites later)
  {
    d: 2.34,
    fx: "-240px",
    fy: "60px",
    fr: "-12deg",
    el: (
      <g fill="none" stroke="oklch(0.3 0.04 30 / .85)" strokeWidth="2">
        <path d="M250 362a27 27 0 0 1 54 0v46h-54Z" />
        <path d="M372 364a28 28 0 0 1 56 0v44h-56Z" />
        <path d="M496 362a27 27 0 0 1 54 0v46h-54Z" />
        <path d="M146 346a25 25 0 0 1 50 0v42h-50Z" />
        <path d="M606 330a25 25 0 0 1 50 0v42h-50Z" />
      </g>
    ),
  },
  // Broken boards nailed over a window
  {
    d: 2.5,
    fx: "300px",
    fy: "-90px",
    fr: "34deg",
    el: (
      <g fill={WOOD} opacity="0.9">
        <path d="M488 356l68 -12 3 11 -68 12Z" />
        <path d="M486 382l70 -8 3 11 -70 8Z" />
      </g>
    ),
  },
  // Torn curtains hint
  {
    d: 2.6,
    fx: "-120px",
    fy: "-120px",
    fr: "18deg",
    el: (
      <g fill="oklch(0.22 0.05 20 / .8)">
        <path d="M374 338h16l-4 30 6 22-18-8Z" />
        <path d="M410 338h16v44l-16 10 6-24Z" />
      </g>
    ),
  },
  // Twisted trees
  {
    d: 2.72,
    fx: "-320px",
    fy: "140px",
    fr: "-24deg",
    el: (
      <g stroke="oklch(0.17 0.02 40)" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M76 560c6-60-16-92-6-130 6-24 26-30 22-58" />
        <path d="M74 470c-22-12-30-32-30-52M78 430c20-14 24-34 22-54M70 500c-18-4-28-16-34-30" />
      </g>
    ),
  },
  {
    d: 2.84,
    fx: "340px",
    fy: "150px",
    fr: "26deg",
    el: (
      <g stroke="oklch(0.17 0.02 40)" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M726 566c-4-64 14-96 4-134-6-24-24-30-20-58" />
        <path d="M728 476c20-12 28-32 28-52M724 436c-20-14-24-34-22-54" />
      </g>
    ),
  },
  // Weather-vane — the final piece
  {
    d: 3.0,
    fx: "0px",
    fy: "-420px",
    fr: "180deg",
    el: (
      <g stroke="oklch(0.45 0.09 25)" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M400 168v-40" />
        <path d="M382 140h36" />
        <path d="M400 128l14 10-14 10Z" fill="oklch(0.45 0.09 25)" />
      </g>
    ),
  },
];

const WINDOW_PATHS = [
  "M255 363a22 22 0 0 1 44 0v40h-44Z",
  "M377 365a23 23 0 0 1 46 0v38h-46Z",
  "M501 363a22 22 0 0 1 44 0v40h-44Z",
  "M151 347a20 20 0 0 1 40 0v36h-40Z",
  "M611 331a20 20 0 0 1 40 0v36h-40Z",
] as const;

type Phase = "build" | "ignite" | "title" | "exit";

export function HouseIntro({ onEnter }: { onEnter: (withSound: boolean) => void }) {
  const [phase, setPhase] = useState<Phase>("build");
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    setPhase("exit");
    window.setTimeout(() => onEnter(true), 1200);
  };

  useEffect(() => {
    tryAutoStartAmbience();
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    at(200, () => houseGroan(0.7));
    at(700, () => distantThunder());
    PIECES.forEach((p, i) => {
      at(p.d * 1000 + 120, () => reverseWhoosh(0.75, i % 3 === 0 ? 0.6 : 0.4));
      at(p.d * 1000 + 1050, () => woodLock(i === PIECES.length - 1 ? 0.9 : 0.45));
    });
    at(1500, () => doorCreak(0.45));
    at(2400, () => chainRattle(0.5));
    at(4150, () => cinematicBoom());

    at(4500, () => {
      setPhase("ignite");
      emberIgnite();
    });
    at(6200, () => {
      setPhase("title");
      magicReveal();
    });
    at(11400, finish);

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", skip);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lit = phase !== "build";

  return (
    <div
      data-intro
      role="presentation"
      onClick={finish}
      className="fixed inset-0 z-[100] overflow-hidden bg-[oklch(0.06_0.01_300)]"
      style={{
        animation: phase === "exit" ? "vault-dissolve 1.15s cubic-bezier(.7,0,.3,1) forwards" : undefined,
      }}
    >
      {/* Moon wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 26%, oklch(0.28 0.05 300 / .55), transparent 70%), radial-gradient(80% 60% at 50% 100%, oklch(0.14 0.05 20 / .6), transparent 70%)",
        }}
      />

      {/* Rolling ground fog */}
      <div
        className="absolute inset-x-[-20%] bottom-0 h-[46%] opacity-70"
        style={{
          background:
            "radial-gradient(55% 70% at 30% 100%, oklch(0.42 0.06 315 / .45), transparent 72%), radial-gradient(50% 60% at 74% 100%, oklch(0.36 0.1 20 / .4), transparent 72%)",
          animation: "mist-roll 18s ease-in-out infinite alternate",
        }}
      />

      {/* Magical embers */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute bottom-[22%] size-[3px] rounded-full bg-[oklch(0.68_0.18_35)]"
          style={
            {
              left: `${6 + ((i * 37) % 88)}%`,
              "--sx": `${(i % 2 ? 1 : -1) * (10 + (i % 5) * 8)}px`,
              animation: `spark-drift ${6 + (i % 4) * 2}s linear ${i * 0.5}s infinite`,
              boxShadow: "0 0 10px oklch(0.6 0.2 30 / .9)",
            } as React.CSSProperties
          }
        />
      ))}

      {/* The manor */}
      <div className="absolute inset-0 grid place-items-center px-6">
        <div className="w-full max-w-3xl">
          <svg viewBox="0 0 800 620" className="w-full drop-shadow-[0_40px_80px_oklch(0.05_0.02_300)]">
            <defs>
              <radialGradient id="hv-window" cx="50%" cy="45%" r="65%">
                <stop offset="0%" stopColor="oklch(0.5 0.19 25)" />
                <stop offset="55%" stopColor="oklch(0.34 0.16 22)" />
                <stop offset="100%" stopColor="oklch(0.18 0.1 18)" />
              </radialGradient>
              <filter id="hv-window-glow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="7" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {PIECES.map((p, i) => (
              <g
                key={i}
                style={
                  {
                    "--fx": p.fx,
                    "--fy": p.fy,
                    "--fr": p.fr,
                    opacity: 0,
                    transformOrigin: "400px 380px",
                    animation: `piece-fly-in 1.25s cubic-bezier(.16,.9,.24,1) ${p.d}s forwards`,
                  } as React.CSSProperties
                }
              >
                {p.el}
              </g>
            ))}

            {/* Window glass — ignites after the build */}
            {lit && (
              <g filter="url(#hv-window-glow)">
                {WINDOW_PATHS.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="url(#hv-window)"
                    style={{
                      opacity: 0,
                      animation: `window-ignite 1.6s ease-out ${i * 0.22}s forwards, window-pulse ${
                        3.4 + i * 0.4
                      }s ease-in-out ${1.6 + i * 0.22}s infinite`,
                    }}
                  />
                ))}
                <path
                  d="M368 476q32-46 64 0v66h-64Z"
                  fill="oklch(0.34 0.17 24 / .45)"
                  style={{ opacity: 0, animation: "window-ignite 2s ease-out 1s forwards" }}
                />
              </g>
            )}
          </svg>

          {/* Wordmark */}
          <div className="relative mt-4 h-24 sm:mt-8">
            {phase !== "build" && phase !== "ignite" && (
              <div className="relative mx-auto w-fit overflow-hidden px-2">
                <h1
                  className="relative whitespace-nowrap bg-clip-text text-center font-display text-[clamp(1rem,4.2vw,2.5rem)] uppercase leading-none text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, oklch(0.92 0.05 30), oklch(0.62 0.22 25) 52%, oklch(0.36 0.15 20))",
                    textShadow: "0 0 60px oklch(0.5 0.2 25 / .5)",
                    animation: "brand-liquid 1.8s cubic-bezier(.2,.8,.2,1) forwards",
                  }}
                >
                  The Halloween Vault
                </h1>
                <span
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[oklch(1_0_0_/_.35)] to-transparent"
                  style={{ animation: "brand-sheen 2.4s ease-in-out 1.2s infinite" }}
                />
                <p
                  className="mt-3 text-center text-[0.6rem] uppercase tracking-[0.55em] text-moonlight/45"
                  style={{ animation: "fade-in .9s ease-out .9s both" }}
                >
                  A cinematic Halloween library
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={finish}
        className="absolute bottom-6 right-6 rounded-full border border-border/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-moonlight/50 transition-colors hover:text-moonlight"
      >
        Skip
      </button>
    </div>
  );
}
