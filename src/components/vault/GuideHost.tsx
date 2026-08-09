import { useGuide, type GuideId } from "@/data/guides";
import { CrystalBallIcon, CandlesIcon } from "@/components/vault/icons";

/**
 * Guide host — architecture placeholder.
 * Renders whichever guide the system selected (randomized presentation is
 * supported through `reroll`). Visual slots below are intentionally simple:
 * the premium effect layer mounts into `data-effect-slot` targets later.
 */
export function GuideHost({ preferred }: { preferred?: GuideId }) {
  const { guide, stage, setStage, reroll, effectSlots } = useGuide(preferred);
  const Glyph = guide.id === "crystal-ball" ? CrystalBallIcon : CandlesIcon;

  return (
    <section
      className="glass glass-edge relative overflow-hidden rounded-3xl p-6 sm:p-8"
      data-guide={guide.id}
      data-stage={stage}
      aria-label={guide.name}
    >
      {effectSlots.map((slot) => (
        <div key={slot} data-effect-slot={slot} aria-hidden className="pointer-events-none absolute inset-0" />
      ))}
      <div className="relative flex flex-wrap items-center gap-5">
        <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-crimson/30 bg-crimson/10 text-pumpkin">
          <Glyph className="size-8" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.32em] text-moonlight/50">Your guide tonight</p>
          <h3 className="font-display text-2xl text-moonlight">{guide.name}</h3>
          <p className="text-sm text-moonlight/60">{guide.tagline}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStage(stage === "idle" ? "awaken" : "idle")}
            className="rounded-full border border-border/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-moonlight/70 transition hover:text-moonlight"
          >
            {stage === "idle" ? "Wake" : "Rest"}
          </button>
          <button
            type="button"
            onClick={reroll}
            className="rounded-full border border-crimson/40 bg-crimson/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-moonlight transition hover:bg-crimson/25"
          >
            Change guide
          </button>
        </div>
      </div>
    </section>
  );
}
