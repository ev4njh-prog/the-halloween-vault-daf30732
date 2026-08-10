import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CandlesIcon,
  CrystalBallIcon,
  HauntedHouseIcon,
  PumpkinIcon,
  SoundOffIcon,
  SoundOnIcon,
} from "@/components/vault/icons";
import { Atmosphere } from "@/components/vault/Atmosphere";
import { fadeOutAmbience, spookClick, startAmbience } from "@/lib/ambience";

/**
 * APP SHELL — one header, one footer, one atmosphere layer for every route.
 * Each nav destination has a single, distinct purpose (see docs/ARCHITECTURE.md).
 */
export const NAV = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/halloween", label: "Halloween" },
  { to: "/autumn", label: "Autumn" },
  { to: "/thanksgiving", label: "Thanksgiving" },
  { to: "/specials", label: "TV & Specials" },
  { to: "/oracle", label: "Oracle" },
  { to: "/guides", label: "Guides" },
  { to: "/videos", label: "Videos" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("vault-reduced-motion", reducedMotion);
    document.documentElement.classList.toggle("vault-contrast", contrast);
  }, [reducedMotion, contrast]);

  const toggleSound = useCallback(() => {
    spookClick();
    setMuted((m) => {
      if (m) startAmbience();
      else fadeOutAmbience();
      return !m;
    });
  }, []);

  return (
    <>
      <Atmosphere />

      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
        <nav
          aria-label="Primary"
          className="glass glass-edge mx-auto flex max-w-[1400px] items-center gap-1.5 rounded-full px-2.5 py-1.5 sm:gap-2 sm:px-4"
        >
          <Link
            to="/"
            onClick={spookClick}
            className="flex shrink-0 items-center gap-2 rounded-full px-2 py-2 text-moonlight"
          >
            <HauntedHouseIcon className="size-5 text-crimson" />
            <span className="wordmark hidden text-[0.72rem] sm:inline">Halloween Vault</span>
          </Link>

          <div className="hidden min-w-0 items-center gap-0.5 xl:flex">
            {NAV.slice(1).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={spookClick}
                activeProps={{ className: "bg-crimson/25 text-moonlight" }}
                className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium text-moonlight/70 transition-colors hover:bg-white/5 hover:text-moonlight"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              spookClick();
              void navigate({ to: "/discover", search: { q: term, tag: "", decade: "" } });
            }}
            className="ml-auto flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/6 px-3 py-2 sm:max-w-[240px]"
          >
            <CrystalBallIcon className="size-4 shrink-0 text-pumpkin" />
            <label className="sr-only" htmlFor="vault-search">
              Search the vault
            </label>
            <input
              id="vault-search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search titles, tags, moods…"
              className="w-full min-w-0 bg-transparent text-sm text-moonlight outline-hidden placeholder:text-moonlight/40"
            />
          </form>

          <Link
            to="/my-vault"
            onClick={spookClick}
            aria-label="Your saved titles"
            className="grid size-10 shrink-0 place-items-center rounded-full text-moonlight hover:bg-white/5"
          >
            <PumpkinIcon className="size-5" />
          </Link>
          <button
            onClick={toggleSound}
            aria-label={muted ? "Unmute Halloween ambience" : "Mute Halloween ambience"}
            className="grid size-10 shrink-0 place-items-center rounded-full text-moonlight hover:bg-white/5"
          >
            {muted ? (
              <SoundOffIcon className="size-5" />
            ) : (
              <SoundOnIcon className="size-5 text-pumpkin" />
            )}
          </button>
          <button
            onClick={() => {
              spookClick();
              setMenuOpen((o) => !o);
            }}
            aria-expanded={menuOpen}
            aria-label="Open menu"
            className="grid size-10 shrink-0 place-items-center rounded-full text-moonlight hover:bg-white/5 xl:hidden"
          >
            <CandlesIcon className="size-5" />
          </button>
          <button
            onClick={() => {
              spookClick();
              setMenuOpen((o) => !o);
            }}
            aria-expanded={menuOpen}
            aria-label="Accessibility options"
            className="hidden size-10 shrink-0 place-items-center rounded-full text-moonlight hover:bg-white/5 xl:grid"
          >
            <CandlesIcon className="size-5" />
          </button>
        </nav>

        {menuOpen && (
          <div className="glass glass-edge mx-auto mt-2 max-h-[70vh] max-w-[1400px] overflow-y-auto rounded-3xl p-5 text-sm text-moonlight">
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              <div className="xl:hidden">
                <p className="eyebrow mb-2">Browse</p>
                <ul className="space-y-1.5">
                  {NAV.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="text-moonlight/75 hover:text-moonlight"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/my-vault"
                      onClick={() => setMenuOpen(false)}
                      className="text-moonlight/75 hover:text-moonlight"
                    >
                      My Vault
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-2">Accessibility</p>
                <label className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                  />
                  Reduced motion
                </label>
                <label className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={contrast}
                    onChange={(e) => setContrast(e.target.checked)}
                  />
                  High contrast
                </label>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="top" className="pt-20 sm:pt-24">
        {children}
      </main>

      <footer className="gutter mx-auto max-w-[1400px] border-t border-border/60 py-10 text-xs text-moonlight/45">
        <p className="wordmark text-moonlight/70">The Halloween Vault</p>
        <p className="mt-2 max-w-xl leading-relaxed">
          A seasonal discovery platform for Halloween and Fall entertainment. Titles are ranked by
          seasonal relevance scored from genres, keywords, plot and episode summaries — never by
          popularity. Metadata and artwork merge curated collections with external providers as they
          come online.
        </p>
      </footer>
    </>
  );
}

/** Shared page header so every route has identical hierarchy and spacing. */
export function PageHeader({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="gutter mx-auto max-w-[1400px] pb-8 pt-6 sm:pt-10">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-moonlight sm:text-5xl">
        {title}
      </h1>
      {blurb && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-moonlight/60">{blurb}</p>}
    </div>
  );
}
