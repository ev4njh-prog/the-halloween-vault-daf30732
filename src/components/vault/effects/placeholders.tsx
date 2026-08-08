/**
 * FUTURE VISUAL EFFECT ARCHITECTURE — placeholders only.
 * ------------------------------------------------------
 * These are intentionally inert, dependency-free stubs. They define the
 * component boundaries, hook signatures and prop contracts that the premium
 * effect layer (AI-generated animation assets, WebGL/liquid-glass shaders,
 * scroll-driven creature systems) will implement later, so the future upgrade
 * is a swap of internals — never a redesign.
 *
 * Every effect follows the same contract:
 *   • `enabled`   — the host decides; effects are opt-in.
 *   • `intensity` — 0…1, so reduced-motion can dial anything to 0.
 *   • `useEffectStage` — shared lifecycle/animation hook.
 *   • `useEffectAudio` — audio cue hook, wired to the ambience engine later.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type EffectStage = "idle" | "arming" | "playing" | "settled";

export interface EffectProps {
  enabled?: boolean;
  /** 0 = off, 1 = full premium effect. Reduced motion should pass 0. */
  intensity?: number;
  className?: string;
}

/* ------------------------------------------------------------------ *
 * Shared hooks
 * ------------------------------------------------------------------ */

/** Lifecycle for a future timeline-driven effect. Currently a no-op stage machine. */
export function useEffectStage(enabled = false, autoPlayMs = 0) {
  const [stage, setStage] = useState<EffectStage>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !autoPlayMs) return;
    setStage("arming");
    timer.current = window.setTimeout(() => setStage("playing"), autoPlayMs);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [enabled, autoPlayMs]);

  const play = useCallback(() => setStage("playing"), []);
  const settle = useCallback(() => setStage("settled"), []);
  const reset = useCallback(() => setStage("idle"), []);
  return { stage, play, settle, reset };
}

/** Audio cue hook. The premium layer binds these to the ambience engine. */
export function useEffectAudio(_id: string) {
  return {
    cue: (_name: string) => {
      /* placeholder — wired to procedural ambience in the premium layer */
    },
    stop: () => {},
  };
}

/** Scroll trigger hook — one-shot, IntersectionObserver based, cheap. */
export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(margin = "0px") {
  const ref = useRef<T | null>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || triggered) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTriggered(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, triggered]);
  return { ref, triggered };
}

/* ------------------------------------------------------------------ *
 * Placeholder layers — render nothing visible today
 * ------------------------------------------------------------------ */

const Placeholder = ({ id, className }: { id: string; className?: string }) => (
  <div aria-hidden data-effect-slot={id} className={className} />
);

/** Liquid glass refraction layer (future: SVG/WebGL displacement). */
export const LiquidGlassPlaceholder = ({ className }: EffectProps) => (
  <Placeholder id="liquid-glass" className={className} />
);

/** Scroll-triggered seasonal animation host (fog, leaves, lightning). */
export const ScrollEffectsPlaceholder = ({ className }: EffectProps) => {
  const { ref } = useScrollTrigger("-10% 0px");
  return <div ref={ref} aria-hidden data-effect-slot="scroll-effects" className={className} />;
};

/** Skeleton interaction layer. */
export const SkeletonPlaceholder = ({ className }: EffectProps) => (
  <Placeholder id="skeletons" className={className} />
);

/** Bat swarm interaction layer. */
export const BatPlaceholder = ({ className }: EffectProps) => (
  <Placeholder id="bats" className={className} />
);

/** Ghost appearance layer. */
export const GhostPlaceholder = ({ className }: EffectProps) => (
  <Placeholder id="ghosts" className={className} />
);

/** Haunted house intro sequence slot (the current intro renders separately). */
export const HauntedIntroPlaceholder = ({ className }: EffectProps) => (
  <Placeholder id="haunted-intro" className={className} />
);

/** Registry so the premium layer can be swapped in one place. */
export const EFFECT_SLOTS = [
  { id: "liquid-glass", label: "Liquid Glass refraction", component: LiquidGlassPlaceholder },
  { id: "scroll-effects", label: "Scroll-triggered seasonal effects", component: ScrollEffectsPlaceholder },
  { id: "skeletons", label: "Skeleton interactions", component: SkeletonPlaceholder },
  { id: "bats", label: "Bat interactions", component: BatPlaceholder },
  { id: "ghosts", label: "Ghost appearances", component: GhostPlaceholder },
  { id: "haunted-intro", label: "Haunted house intro sequence", component: HauntedIntroPlaceholder },
] as const;
