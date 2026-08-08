import type { EffectProps } from "./effects/placeholders";
import { useEffectAudio, useEffectStage } from "./effects/placeholders";

/**
 * CRYSTAL BALL — placeholder implementation.
 * Renders a deliberately simple, cheap orb today. The structure, stage machine
 * and audio/visual hooks below are the contract the premium implementation
 * (AI-generated animation assets, refractive shader, particle scrying) will
 * fill in without changing any call site.
 */
export interface CrystalBallProps extends EffectProps {
  /** Drives the future scrying animation. */
  active?: boolean;
  status?: string;
  size?: number;
}

export function CrystalBallPlaceholder({
  active = false,
  status,
  size = 224,
  className,
}: CrystalBallProps) {
  const { stage } = useEffectStage(active, 400);
  useEffectAudio("crystal-ball"); // premium layer: hum, chime, reveal

  return (
    <div
      className={`relative mx-auto grid place-items-center ${className ?? ""}`}
      style={{ width: size, height: size }}
      data-effect-slot="crystal-ball"
      data-stage={stage}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full border border-pumpkin/20"
        style={{ animation: active ? "rune-spin 6s linear infinite" : undefined }}
      />
      <div
        aria-hidden
        className="rounded-full transition-transform duration-500"
        style={{
          width: size * 0.79,
          height: size * 0.79,
          background:
            "radial-gradient(circle at 34% 28%, oklch(0.95 0.03 300 / .55), oklch(0.5 0.18 20 / .5) 45%, oklch(0.16 0.07 305 / .95) 78%)",
          boxShadow:
            "inset -18px -22px 50px oklch(0.05 0.02 300 / .8), inset 14px 16px 40px oklch(1 0 0 / .18), 0 0 80px oklch(0.55 0.24 20 / .35)",
          transform: active ? "scale(1.06)" : "scale(1)",
        }}
      />
      {status && (
        <p
          aria-live="polite"
          className="absolute -bottom-6 text-[0.62rem] uppercase tracking-[0.34em] text-moonlight/45"
        >
          {status}
        </p>
      )}
    </div>
  );
}
