/**
 * Optical filters for the Vault's true liquid-glass surfaces.
 *
 * These are real SVG displacement filters — the backdrop behind a glass panel
 * is refracted (bent) rather than blurred, so content stays readable while the
 * edges warp like thick blood-red crystal.
 */
export function GlassFilters() {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0" focusable="false">
      <defs>
        {/* Gentle lens refraction used on every glass panel. */}
        <filter id="vault-refract" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="7" result="warp" />
          <feGaussianBlur in="warp" stdDeviation="3" result="warpSoft" />
          <feDisplacementMap in="SourceGraphic" in2="warpSoft" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Stronger bend for hovered / active surfaces. */}
        <filter id="vault-refract-strong" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.016" numOctaves="2" seed="3" result="warp">
            <animate attributeName="baseFrequency" dur="18s" values="0.008 0.016;0.013 0.009;0.008 0.016" repeatCount="indefinite" />
          </feTurbulence>
          <feGaussianBlur in="warp" stdDeviation="2" result="warpSoft" />
          <feDisplacementMap in="SourceGraphic" in2="warpSoft" scale="30" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Chromatic edge dispersion — light splitting through crystal. */}
        <filter id="vault-dispersion" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feOffset in="SourceGraphic" dx="1.2" dy="0" result="r" />
          <feOffset in="SourceGraphic" dx="-1.2" dy="0" result="b" />
          <feColorMatrix
            in="r"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"
            result="rc"
          />
          <feColorMatrix
            in="b"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 .45 0"
            result="bc"
          />
          <feBlend in="rc" in2="bc" mode="screen" result="fringe" />
          <feBlend in="SourceGraphic" in2="fringe" mode="screen" />
        </filter>

        {/* Volumetric candle smoke used inside the intro. */}
        <filter id="vault-smoke" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="11" result="n">
            <animate attributeName="baseFrequency" dur="26s" values="0.012;0.02;0.012" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="52" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="7" />
        </filter>

        {/* Carved-pumpkin surface relief. */}
        <filter id="pumpkin-skin" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves="4" seed="5" result="grain" />
          <feDiffuseLighting in="grain" lightingColor="#ffb066" surfaceScale="1.4" result="relief">
            <feDistantLight azimuth="215" elevation="58" />
          </feDiffuseLighting>
          <feComposite in="relief" in2="SourceGraphic" operator="in" result="reliefClipped" />
          <feBlend in="SourceGraphic" in2="reliefClipped" mode="multiply" />
        </filter>
      </defs>
    </svg>
  );
}
