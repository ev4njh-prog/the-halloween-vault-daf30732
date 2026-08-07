/**
 * Ambient background layer.
 *
 * PERFORMANCE: intentionally static and CSS-only — no scroll listeners, no
 * React state, no particle systems. This is the placeholder surface where the
 * dedicated atmosphere system (fog, bats, leaves) can later be mounted without
 * touching page layout.
 */
export function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Moonlight silver, not gold */}
      <div
        className="absolute right-[8%] top-[7%] size-28 rounded-full opacity-60 sm:size-40"
        style={{
          background:
            "radial-gradient(circle at 38% 34%, oklch(0.97 0.01 300), oklch(0.76 0.02 300))",
          boxShadow: "0 0 160px oklch(0.9 0.02 300 / .28)",
        }}
      />

      {/* Deep crimson horizon haze */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%] opacity-55"
        style={{
          background:
            "radial-gradient(55% 60% at 22% 100%, oklch(0.42 0.09 320 / .38), transparent 72%), radial-gradient(50% 55% at 80% 100%, oklch(0.4 0.14 22 / .3), transparent 72%)",
        }}
      />

      {/* Vignette keeps content hierarchy readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, transparent 40%, oklch(0.05 0.01 300 / .75) 100%)",
        }}
      />
    </div>
  );
}
