import { useScrollProgress } from "@/hooks/use-vault";

/** Scroll-driven atmosphere: drifting fog, bats, leaves and a rising moon. */
export function Atmosphere() {
  const p = useScrollProgress();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Moon rides with scroll */}
      <div
        className="absolute right-[8%] size-28 rounded-full opacity-70 transition-transform duration-300 sm:size-40"
        style={{
          top: `${6 + p * 10}%`,
          transform: `translateY(${-p * 60}px)`,
          background:
            "radial-gradient(circle at 38% 34%, oklch(0.96 0.02 90), oklch(0.74 0.03 90))",
          boxShadow: "0 0 140px oklch(0.9 0.05 90 / .35)",
        }}
      />

      {/* Fog banks */}
      <div
        className="absolute inset-x-[-25%] bottom-0 h-[55%] opacity-50"
        style={{
          background:
            "radial-gradient(50% 60% at 25% 100%, oklch(0.5 0.07 320 / .35), transparent 70%), radial-gradient(45% 50% at 78% 100%, oklch(0.45 0.12 20 / .28), transparent 70%)",
          animation: "fog-drift 26s ease-in-out infinite alternate",
        }}
      />

      {/* Bats that cross while the page is scrolled */}
      {[0.18, 0.42, 0.68].map((trigger, i) =>
        p > trigger && p < trigger + 0.16 ? (
          <span
            key={i}
            className="absolute text-crimson/70"
            style={
              {
                left: i % 2 ? "80%" : "8%",
                top: `${28 + i * 14}%`,
                "--bx": i % 2 ? "-60vw" : "60vw",
                "--by": "-16vh",
                animation: "bat-fly 4.5s linear forwards",
              } as React.CSSProperties
            }
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ animation: "wing .24s ease-in-out infinite" }}
            >
              <path d="M2.5 9.5c2 0 3-1.2 4-2.4.2 1.6 1 2.6 2.3 3.1.6-1 1.8-1.6 3.2-1.6s2.6.6 3.2 1.6c1.3-.5 2.1-1.5 2.3-3.1 1 1.2 2 2.4 4 2.4-1.6 1.3-2 3-2 5-1.6-.9-3-.6-4.2.5-1 .9-1.6 2-3.3 2s-2.3-1.1-3.3-2c-1.2-1.1-2.6-1.4-4.2-.5 0-2-.4-3.7-2-5Z" />
            </svg>
          </span>
        ) : null,
      )}

      {/* Leaves */}
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={`leaf-${i}`}
          className="absolute top-0 block size-2 rounded-[40%_60%_50%_50%] bg-pumpkin/40"
          style={{
            left: `${(i * 11) % 100}%`,
            animation: `leaf-fall ${11 + (i % 4) * 3}s linear ${i * 1.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
