/**
 * SEASONAL GUIDES — architecture only.
 * ------------------------------------
 * The Vault has two hosts: the Lantern Keeper and the Crystal Ball Oracle.
 * Either may greet a visitor, and the system supports randomized presentation.
 * Final visual effects (AI-generated animation, liquid glass, particle work)
 * are NOT implemented here — each guide exposes stable animation, effect and
 * audio integration points so a premium layer can be dropped in later without
 * touching feature code.
 */

import { useEffect, useMemo, useState } from "react";

export type GuideId = "lantern-keeper" | "crystal-ball";

export type GuideStage = "idle" | "awaken" | "speak" | "reveal" | "rest";

export interface GuideDefinition {
  id: GuideId;
  name: string;
  tagline: string;
  /** Stages a future animation layer is expected to implement. */
  stages: GuideStage[];
  /** Named effect slots reserved for the premium visual layer. */
  effectSlots: string[];
  /** Named audio cues the ambience engine will bind to. */
  audioCues: string[];
}

export const GUIDES: GuideDefinition[] = [
  {
    id: "lantern-keeper",
    name: "The Lantern Keeper",
    tagline: "Keeper of the vault's flame. Knows every door in October.",
    stages: ["idle", "awaken", "speak", "reveal", "rest"],
    effectSlots: ["lantern-flame", "ember-drift", "keeper-silhouette", "glass-refraction"],
    audioCues: ["emberIgnite", "doorCreak", "houseGroan"],
  },
  {
    id: "crystal-ball",
    name: "The Crystal Ball Oracle",
    tagline: "Reads the season in the glass and answers with a title.",
    stages: ["idle", "awaken", "speak", "reveal", "rest"],
    effectSlots: ["orb-swirl", "rune-ring", "smoke-inner", "glass-refraction"],
    audioCues: ["crystalChime", "spellCast", "witchLaugh"],
  },
];

export const getGuide = (id: GuideId) => GUIDES.find((g) => g.id === id)!;

/** Deterministic per-day pick so SSR and hydration agree, plus manual reroll. */
export function pickGuide(date = new Date(), offset = 0): GuideDefinition {
  const seed = date.getFullYear() * 372 + (date.getMonth() + 1) * 31 + date.getDate() + offset;
  return GUIDES[seed % GUIDES.length]!;
}

export interface GuideRuntime {
  guide: GuideDefinition;
  stage: GuideStage;
  setStage: (s: GuideStage) => void;
  /** Swaps to the other guide — the randomized presentation entry point. */
  reroll: () => void;
  /** Integration point: the premium layer registers effects against these. */
  effectSlots: string[];
  audioCues: string[];
}

export function useGuide(preferred?: GuideId): GuideRuntime {
  const [offset, setOffset] = useState(0);
  const [stage, setStage] = useState<GuideStage>("idle");
  const guide = useMemo(
    () => (preferred ? getGuide(preferred) : pickGuide(new Date(0), offset)),
    [preferred, offset],
  );

  useEffect(() => {
    setStage("idle");
  }, [guide.id]);

  return {
    guide,
    stage,
    setStage,
    reroll: () => setOffset((o) => o + 1),
    effectSlots: guide.effectSlots,
    audioCues: guide.audioCues,
  };
}
