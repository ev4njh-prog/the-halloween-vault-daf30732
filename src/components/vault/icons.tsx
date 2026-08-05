import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

/** Home — haunted house */
export const HauntedHouseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 11 12 4l9 7" />
    <path d="M5 10.5V20h14v-9.5" />
    <path d="M10 20v-4.5h4V20" />
    <path d="M8.5 12.5h1.2M14.3 12.5h1.2" />
    <path d="M16.5 6.6V4.2h1.8v3.7" />
  </svg>
);

/** Search — crystal ball */
export const CrystalBallIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="10" r="6.2" />
    <path d="M9.4 8.2c.6-1.2 1.7-1.9 2.9-2" />
    <path d="M7.4 18.4c1-1 2.7-1.6 4.6-1.6s3.6.6 4.6 1.6c.6.6.2 1.6-.7 1.6H8.1c-.9 0-1.3-1-.7-1.6Z" />
  </svg>
);

/** Favorites — pumpkin */
export const PumpkinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 6.6c-1.2-1-3-1-4.3 0C5.9 8 5.2 10 5.2 12.3c0 3.5 2.2 6.5 4.6 6.5.9 0 1.5-.4 2.2-.4s1.3.4 2.2.4c2.4 0 4.6-3 4.6-6.5 0-2.3-.7-4.3-2.5-5.7-1.3-1-3.1-1-4.3 0Z" />
    <path d="M12 6.6c0 3.6 0 8.4 0 12.2" />
    <path d="M12 6.4c0-1.6.5-2.7 2.2-3.2" />
  </svg>
);

/** Menu — three candles */
export const CandlesIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 10v9M12 8v11M18 11v8" />
    <path d="M6 7.6c1-.9.4-1.9 0-2.4-.5.6-1 1.5 0 2.4ZM12 5.6c1-.9.4-1.9 0-2.4-.5.6-1 1.5 0 2.4ZM18 8.6c1-.9.4-1.9 0-2.4-.5.6-1 1.5 0 2.4Z" />
  </svg>
);

/** Play — glowing pumpkin button */
export const PlayPumpkinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 5.8c-1.2-1-3-1-4.3 0C5.9 7.2 5.2 9.2 5.2 11.5c0 3.5 2.2 6.5 4.6 6.5.9 0 1.5-.4 2.2-.4s1.3.4 2.2.4c2.4 0 4.6-3 4.6-6.5 0-2.3-.7-4.3-2.5-5.7-1.3-1-3.1-1-4.3 0Z" />
    <path d="m10.6 9.4 4 2.6-4 2.6V9.4Z" fill="currentColor" stroke="none" />
  </svg>
);

/** Pause — frozen ghost */
export const GhostPauseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5.5 19V10a6.5 6.5 0 0 1 13 0v9l-2.2-1.6-2.1 1.6-2.2-1.6L9.8 19l-2.1-1.6L5.5 19Z" />
    <path d="M10 9.5v3M14 9.5v3" />
  </svg>
);

/** Loading — magic spell circle */
export const SpellCircleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="m12 4.4 6.7 11.6H5.3L12 4.4Z" />
    <circle cx="12" cy="12" r="2.4" />
  </svg>
);

export const BatIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M2.5 9.5c2 0 3-1.2 4-2.4.2 1.6 1 2.6 2.3 3.1.6-1 1.8-1.6 3.2-1.6s2.6.6 3.2 1.6c1.3-.5 2.1-1.5 2.3-3.1 1 1.2 2 2.4 4 2.4-1.6 1.3-2 3-2 5-1.6-.9-3-.6-4.2.5-1 .9-1.6 2-3.3 2s-2.3-1.1-3.3-2c-1.2-1.1-2.6-1.4-4.2-.5 0-2-.4-3.7-2-5Z" />
  </svg>
);

export const SoundOnIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 9.5h3l4-3v11l-4-3H5v-5Z" />
    <path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 7a7.4 7.4 0 0 1 0 10" />
  </svg>
);

export const SoundOffIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 9.5h3l4-3v11l-4-3H5v-5Z" />
    <path d="m16 10 4 4M20 10l-4 4" />
  </svg>
);

export const HeartIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 19.5S4.5 15 4.5 9.9A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7.5 1.9c0 5.1-7.5 9.6-7.5 9.6Z" />
  </svg>
);
