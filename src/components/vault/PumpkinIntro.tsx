import { useCallback, useEffect, useRef, useState } from "react";
import {
  cinematicBoom,
  crystalChime,
  doorCreak,
  distantThunder,
  scoreMotif,
  spellCast,
  startAmbience,
  witchLaugh,
} from "@/lib/ambience";

interface Props {
  onEnter: (withSound: boolean) => void;
}

/**
 * THE HALLOWEEN VAULT — cinematic opening.
 *
 * Beats: darkness → the pumpkin emerges → a spark ignites inside →
 * eyes and mouth light → the laugh → bats burst → the haunted town reveals →
 * the logo blooms → the vault doors open into the app.
 */
export function PumpkinIntro({ onEnter }: Props) {
  const [started, setStarted] = useState(false);
  const [sound, setSound] = useState(true);
  const [phase, setPhase] = useState(0);
  const [opening, setOpening] = useState(false);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  const enter = useCallback(
    (withSound: boolean) => {
      clear();
      setOpening(true);
      if (withSound) {
        doorCreak(1);
        window.setTimeout(() => cinematicBoom(), 500);
      }
      window.setTimeout(() => onEnter(withSound), 1500);
    },
    [onEnter],
  );

  const begin = (withSound: boolean) => {
    setSound(withSound);
    setStarted(true);
    if (withSound) {
      startAmbience();
      window.setTimeout(() => scoreMotif(), 900);
    }

    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(300, () => setPhase(1)); // pumpkin emerges from black
    at(2600, () => {
      setPhase(2); // the spark
      if (withSound) crystalChime();
    });
    at(4000, () => {
      setPhase(3); // eyes ignite
      if (withSound) spellCast();
    });
    at(5400, () => {
      setPhase(4); // mouth glows, the laugh
      if (withSound) witchLaugh(true);
    });
    at(7400, () => {
      setPhase(5); // bats burst
      if (withSound) distantThunder();
    });
    at(8600, () => setPhase(6)); // the haunted town reveals
    at(10400, () => {
      setPhase(7); // logo
      if (withSound) crystalChime();
    });
  };

  useEffect(() => clear, []);

  const lit = phase >= 3;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black"
      role="dialog"
      aria-label="The Halloween Vault opening sequence"
    >
      {/* ---------------- The scene ---------------- */}
      <div
        className="absolute inset-0"
        style={{
          animation: started ? "scene-push-in 12s cubic-bezier(.22,1,.36,1) forwards" : undefined,
        }}
      >
        {/* Night sky */}
        <div
          className="absolute inset-0 transition-opacity duration-[2500ms]"
          style={{
            opacity: phase >= 6 ? 1 : phase >= 1 ? 0.35 : 0,
            background:
              "radial-gradient(90% 70% at 74% 12%, oklch(0.38 0.07 300 / .7), transparent 62%), radial-gradient(130% 100% at 50% 118%, oklch(0.32 0.15 32 / .45), transparent 66%), linear-gradient(180deg, oklch(0.09 0.03 300), oklch(0.05 0.02 300))",
          }}
        />

        {/* Stars */}
        {phase >= 6 &&
          Array.from({ length: 60 }).map((_, i) => (
            <span
              key={`s${i}`}
              aria-hidden
              className="absolute size-[2px] rounded-full bg-moonlight"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 17) % 55}%`,
                opacity: 0.15 + ((i * 13) % 60) / 100,
                animation: `flicker ${3 + (i % 5)}s ease-in-out ${i * 0.13}s infinite`,
              }}
            />
          ))}

        {/* Moon */}
        <div
          className="absolute right-[12%] top-[9%] size-28 rounded-full sm:size-44"
          style={{
            opacity: phase >= 6 ? 0.95 : 0,
            transition: "opacity 2s ease",
            animation: phase >= 6 ? "moon-rise 3.5s cubic-bezier(.22,1,.36,1) forwards" : undefined,
            background:
              "radial-gradient(circle at 38% 32%, oklch(0.98 0.02 90), oklch(0.86 0.03 85) 55%, oklch(0.7 0.03 85))",
            boxShadow: "0 0 180px oklch(0.92 0.06 90 / .5), inset -14px -10px 30px oklch(0.55 0.03 90 / .5)",
          }}
        />

        {/* Haunted town silhouette */}
        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-[42%] w-full transition-opacity duration-[2200ms]"
          style={{ opacity: phase >= 6 ? 1 : 0 }}
          aria-hidden
        >
          <defs>
            <linearGradient id="townFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.14 0.05 305)" />
              <stop offset="100%" stopColor="oklch(0.05 0.02 300)" />
            </linearGradient>
          </defs>
          <path
            d="M0 420V250l70-24 26-58 30 58 64 16v-70l52-46 50 46v58l70 12 22-96 34 96 76 18V196l60-58 62 58v104l88 14 30-70 34 70 80 10v-92l56-52 58 52v96l84 18 28-56 30 56 66 14v-64l54-48 56 48v78l60 16v66Z"
            fill="url(#townFill)"
          />
          {/* Warm windows */}
          {[
            [120, 300], [300, 296], [470, 268], [640, 260], [800, 292], [960, 268], [1130, 300], [1290, 284],
          ].map(([x, y], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width="13"
              height="17"
              rx="2"
              fill="oklch(0.82 0.17 62)"
              opacity="0.9"
              style={{ animation: `flicker ${3.4 + (i % 4)}s ease-in-out ${i * 0.4}s infinite` }}
            />
          ))}
        </svg>

        {/* Little pumpkin lanterns on the ground */}
        {phase >= 6 &&
          [8, 22, 78, 91].map((x, i) => (
            <span
              key={`p${i}`}
              aria-hidden
              className="absolute bottom-[7%] size-3 rounded-full"
              style={{
                left: `${x}%`,
                background: "radial-gradient(circle at 40% 35%, #ffd166, #ff7a18)",
                boxShadow: "0 0 26px oklch(0.78 0.19 60 / .8)",
                animation: `flicker ${2.8 + i}s ease-in-out infinite`,
              }}
            />
          ))}

        {/* Volumetric fog banks */}
        <div
          className="pointer-events-none absolute inset-x-[-25%] bottom-0 h-3/5 transition-opacity duration-[2500ms]"
          style={{
            opacity: phase >= 5 ? 0.75 : phase >= 2 ? 0.3 : 0,
            filter: "url(#vault-smoke)",
            background:
              "radial-gradient(55% 55% at 28% 100%, oklch(0.55 0.06 320 / .35), transparent 70%), radial-gradient(50% 50% at 72% 100%, oklch(0.5 0.1 22 / .3), transparent 70%)",
            animation: "fog-drift 24s ease-in-out infinite alternate",
          }}
        />

        {/* ---------------- The jack-o'-lantern ---------------- */}
        <div
          className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transition: "opacity 2.2s ease, transform 2.2s cubic-bezier(.22,1,.36,1)",
            transform: `translate(-50%, -50%) scale(${phase >= 1 ? 1 : 0.86})`,
            animation: phase >= 4 ? "float-soft 7s ease-in-out infinite" : undefined,
          }}
        >
          <svg
            width="420"
            height="360"
            viewBox="0 0 420 360"
            className="max-w-[86vw]"
            role="img"
            aria-label="A giant enchanted jack-o'-lantern glowing in the dark"
          >
            <defs>
              <radialGradient id="rind" cx="40%" cy="30%" r="78%">
                <stop offset="0%" stopColor="#ffa24a" />
                <stop offset="42%" stopColor="#e8681a" />
                <stop offset="78%" stopColor="#95350a" />
                <stop offset="100%" stopColor="#3d1403" />
              </radialGradient>
              <radialGradient id="innerFire" cx="50%" cy="55%" r="60%">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="45%" stopColor="#ffb020" />
                <stop offset="100%" stopColor="#ff5a00" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffb44d" stopOpacity=".8" />
                <stop offset="60%" stopColor="#ff6a12" stopOpacity=".28" />
                <stop offset="100%" stopColor="#ff4a00" stopOpacity="0" />
              </radialGradient>
              <filter id="bigBlur"><feGaussianBlur stdDeviation="14" /></filter>
              <filter id="midBlur"><feGaussianBlur stdDeviation="4" /></filter>
              <clipPath id="bodyClip">
                <ellipse cx="210" cy="212" rx="168" ry="122" />
              </clipPath>
            </defs>

            {/* Volumetric halo */}
            <ellipse
              cx="210"
              cy="212"
              rx="230"
              ry="185"
              fill="url(#halo)"
              opacity={lit ? 1 : 0}
              filter="url(#bigBlur)"
              style={{ transition: "opacity 1.6s ease", animation: lit ? "flicker 3.8s ease-in-out infinite" : undefined }}
            />

            {/* Stem */}
            <path
              d="M204 90c-4-18 6-32 24-38-4 17 3 28 15 34"
              stroke="#4c7b2c"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M206 92c-3-13 4-23 17-27" stroke="#78a84c" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".8" />

            {/* Body with carved skin relief */}
            <g filter="url(#pumpkin-skin)">
              <ellipse cx="210" cy="212" rx="168" ry="122" fill="url(#rind)" />
            </g>

            {/* Ridges */}
            <g clipPath="url(#bodyClip)" fill="none" strokeLinecap="round">
              {[-118, -74, -30, 30, 74, 118].map((dx, i) => (
                <path
                  key={i}
                  d={`M${210 + dx} 92 C ${210 + dx * 1.35} 150, ${210 + dx * 1.35} 274, ${210 + dx} 332`}
                  stroke="#5d1f04"
                  strokeOpacity={0.45}
                  strokeWidth={6 - Math.abs(dx) / 60}
                />
              ))}
              {[-96, -52, -8, 52, 96].map((dx, i) => (
                <path
                  key={`h${i}`}
                  d={`M${212 + dx} 96 C ${212 + dx * 1.3} 152, ${212 + dx * 1.3} 272, ${212 + dx} 330`}
                  stroke="#ffb06a"
                  strokeOpacity={0.16}
                  strokeWidth="2"
                />
              ))}
              <ellipse cx="150" cy="150" rx="70" ry="42" fill="#ffb367" opacity=".12" filter="url(#midBlur)" />
            </g>

            {/* Inner candle glow bleeding through the rind */}
            <ellipse
              cx="210"
              cy="228"
              rx="120"
              ry="86"
              fill="url(#innerFire)"
              opacity={phase >= 2 ? (lit ? 0.55 : 0.2) : 0}
              filter="url(#bigBlur)"
              style={{ transition: "opacity 1.4s ease", animation: phase >= 2 ? "candle-breathe 2.4s ease-in-out infinite" : undefined }}
            />

            {/* Eyes */}
            <g
              style={{
                transition: "opacity 1.5s ease",
                opacity: lit ? 1 : 0,
                animation: lit ? "flicker 4.4s ease-in-out infinite" : undefined,
              }}
            >
              <path d="M132 196 178 162 182 210 138 220Z" fill="#fff0b8" />
              <path d="M288 196 242 162 238 210 282 220Z" fill="#fff0b8" />
              <path d="M132 196 178 162 182 210 138 220Z" fill="#ffb020" opacity=".5" filter="url(#midBlur)" />
              <path d="M288 196 242 162 238 210 282 220Z" fill="#ffb020" opacity=".5" filter="url(#midBlur)" />
              {/* Volumetric light shafts out of the eyes */}
              <path d="M132 196 178 162 260 60 60 90Z" fill="#ffbe4d" opacity={lit ? 0.1 : 0} filter="url(#bigBlur)" />
              <path d="M288 196 242 162 160 60 360 90Z" fill="#ffbe4d" opacity={lit ? 0.1 : 0} filter="url(#bigBlur)" />
            </g>

            {/* Nose */}
            <path
              d="M210 232 194 216 186 236Z"
              fill="#fff0b8"
              style={{ transition: "opacity 1.2s ease .2s", opacity: lit ? 1 : 0 }}
            />

            {/* Mischievous grin */}
            <g style={{ transition: "opacity 1.2s ease", opacity: phase >= 4 ? 1 : 0 }}>
              <path
                d="M124 252c18 44 52 62 86 62s68-18 86-62c-16 12-30 10-42 0-10 14-24 16-34 6-12 12-26 10-34-2-12 10-32 12-62-4Z"
                fill="#ffe08a"
              />
              <path
                d="M124 252c18 44 52 62 86 62s68-18 86-62c-16 12-30 10-42 0-10 14-24 16-34 6-12 12-26 10-34-2-12 10-32 12-62-4Z"
                fill="#ff9c1f"
                opacity=".55"
                filter="url(#midBlur)"
                style={{ animation: phase >= 4 ? "candle-breathe 1.6s ease-in-out infinite" : undefined }}
              />
            </g>
          </svg>

          {/* Ignition sparks */}
          {phase >= 2 &&
            phase < 5 &&
            Array.from({ length: 16 }).map((_, i) => (
              <span
                key={`sp${i}`}
                aria-hidden
                className="absolute left-1/2 top-[62%] size-1 rounded-full bg-pumpkin"
                style={
                  {
                    boxShadow: "0 0 12px #ffd166",
                    "--sx": `${(i % 2 ? -1 : 1) * (10 + i * 8)}px`,
                    animation: `spark-rise ${1.6 + (i % 5) * 0.3}s ease-out ${i * 0.11}s infinite`,
                  } as React.CSSProperties
                }
              />
            ))}
        </div>

        {/* Bats bursting from behind the pumpkin */}
        {phase >= 5 &&
          Array.from({ length: 18 }).map((_, i) => (
            <span
              key={`b${i}`}
              aria-hidden
              className="absolute left-1/2 top-[52%] text-[oklch(0.16_0.03_300)]"
              style={
                {
                  "--bx": `${(i % 2 ? -1 : 1) * (12 + i * 5)}vw`,
                  "--by": `${-18 - (i % 7) * 9}vh`,
                  animation: `bat-fly ${2.2 + i * 0.15}s cubic-bezier(.3,.7,.4,1) ${i * 0.07}s forwards`,
                } as React.CSSProperties
              }
            >
              <svg width={20 + (i % 4) * 8} height={20 + (i % 4) * 8} viewBox="0 0 24 24" fill="currentColor" style={{ animation: "wing .2s ease-in-out infinite" }}>
                <path d="M2.5 9.5c2 0 3-1.2 4-2.4.2 1.6 1 2.6 2.3 3.1.6-1 1.8-1.6 3.2-1.6s2.6.6 3.2 1.6c1.3-.5 2.1-1.5 2.3-3.1 1 1.2 2 2.4 4 2.4-1.6 1.3-2 3-2 5-1.6-.9-3-.6-4.2.5-1 .9-1.6 2-3.3 2s-2.3-1.1-3.3-2c-1.2-1.1-2.6-1.4-4.2-.5 0-2-.4-3.7-2-5Z" />
              </svg>
            </span>
          ))}

        {/* Autumn leaves */}
        {phase >= 6 &&
          Array.from({ length: 18 }).map((_, i) => (
            <span
              key={`l${i}`}
              aria-hidden
              className="absolute top-0 block size-2.5 rounded-[40%_60%_50%_50%]"
              style={{
                left: `${(i * 5.7) % 100}%`,
                background: i % 3 === 0 ? "oklch(0.62 0.19 40)" : "oklch(0.74 0.18 58)",
                opacity: 0.75,
                animation: `leaf-fall ${8 + (i % 6)}s linear ${i * 0.4}s infinite`,
              }}
            />
          ))}

        {/* Magical floating lights */}
        {phase >= 6 &&
          Array.from({ length: 14 }).map((_, i) => (
            <span
              key={`m${i}`}
              aria-hidden
              className="absolute size-1.5 rounded-full bg-pumpkin"
              style={
                {
                  left: `${(i * 13 + 5) % 96}%`,
                  bottom: `${8 + (i % 5) * 7}%`,
                  boxShadow: "0 0 18px oklch(0.8 0.18 60)",
                  "--px": `${(i % 2 ? -1 : 1) * 40}px`,
                  "--py": "-220px",
                  animation: `particle-float ${9 + (i % 5) * 2}s linear ${i * 0.7}s infinite`,
                } as React.CSSProperties
              }
            />
          ))}
      </div>

      {/* ---------------- Gate (first interaction) ---------------- */}
      {!started && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-6 text-center">
          <div className="max-w-md">
            <p className="text-[0.65rem] uppercase tracking-[0.55em] text-pumpkin">Presenting</p>
            <h1 className="ember-glow mt-4 font-display text-3xl leading-tight text-moonlight sm:text-5xl">
              THE HALLOWEEN VAULT
            </h1>
            <p className="mt-4 text-sm text-moonlight/60">
              Best experienced with sound. Nothing plays until you choose.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => begin(true)}
              className="glass glass-edge glass-sheen min-h-12 rounded-full px-8 text-sm font-semibold text-moonlight"
            >
              Begin with sound
            </button>
            <button
              onClick={() => begin(false)}
              className="min-h-12 rounded-full border border-border px-8 text-sm font-medium text-moonlight/80 transition-colors hover:bg-white/5"
            >
              Begin silently
            </button>
          </div>
        </div>
      )}

      {/* ---------------- Logo & entrance ---------------- */}
      {started && (
        <div
          className="absolute inset-x-0 bottom-[9%] z-20 flex flex-col items-center gap-6 px-6 text-center transition-all duration-1000"
          style={{ opacity: phase >= 7 ? 1 : 0, transform: `translateY(${phase >= 7 ? 0 : 26}px)` }}
        >
          <div className="glass glass-deep glass-edge glass-sheen rounded-[2rem] px-8 py-7">
            <p className="text-[0.62rem] uppercase tracking-[0.55em] text-pumpkin">Enter the</p>
            <h1
              className="ember-glow mt-3 font-display text-3xl leading-tight text-moonlight sm:text-5xl"
              style={{ animation: phase >= 7 ? "title-bloom 1.8s cubic-bezier(.22,1,.36,1) forwards" : undefined }}
            >
              THE HALLOWEEN VAULT
            </h1>
            <p className="mt-3 max-w-md text-sm text-moonlight/70">
              A cinematic library of Halloween, horror and autumn entertainment.
            </p>
          </div>
          <button
            onClick={() => enter(sound)}
            className="glass glass-edge glass-sheen min-h-12 rounded-full px-9 text-sm font-semibold text-moonlight"
          >
            Open the vault
          </button>
        </div>
      )}

      {/* Skip */}
      {started && !opening && (
        <button
          onClick={() => enter(sound)}
          className="absolute right-5 top-5 z-30 rounded-full border border-border px-5 py-2 text-xs uppercase tracking-[0.2em] text-moonlight/70 hover:bg-white/5"
        >
          Skip
        </button>
      )}

      {/* ---------------- Vault doors ---------------- */}
      {opening && (
        <>
          <div
            className="absolute inset-y-0 left-0 z-40 w-1/2 border-r border-crimson/40"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.05 0.02 300), oklch(0.12 0.05 315) 70%, oklch(0.2 0.1 20))",
              animation: "vault-door-left 1.4s cubic-bezier(.7,0,.3,1) .1s forwards",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 z-40 w-1/2 border-l border-crimson/40"
            style={{
              background:
                "linear-gradient(270deg, oklch(0.05 0.02 300), oklch(0.12 0.05 315) 70%, oklch(0.2 0.1 20))",
              animation: "vault-door-right 1.4s cubic-bezier(.7,0,.3,1) .1s forwards",
            }}
          />
        </>
      )}
    </div>
  );
}
