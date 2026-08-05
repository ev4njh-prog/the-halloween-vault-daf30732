import { useRef } from "react";
import { toast } from "sonner";
import type { VaultTitle, VaultRow } from "@/data/vault";
import { HeartIcon, PlayPumpkinIcon } from "./icons";
import { spookClick, magicSparkle } from "@/lib/ambience";
import { useReveal } from "@/hooks/use-vault";

function watch(item: VaultTitle) {
  spookClick();
  if (item.watchUrl) {
    magicSparkle();
    window.open(item.watchUrl, "_blank", "noopener,noreferrer");
  } else {
    toast("Streaming location unavailable", {
      description: `${item.title} has no verified watch destination right now.`,
    });
  }
}

export function TitleCard({
  item,
  isFavorite,
  onToggleFavorite,
}: {
  item: VaultTitle;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <article className="group relative w-[240px] shrink-0 snap-start sm:w-[268px]">
      <div className="glass glass-edge glass-sheen overflow-hidden rounded-3xl transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.03] group-focus-within:-translate-y-2">
        <div className="relative aspect-2/3 overflow-hidden">
          <img
            src={item.art}
            alt={`Artwork for ${item.title}`}
            loading="lazy"
            width={640}
            height={960}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(70% 55% at 50% 100%, oklch(0.55 0.24 20 / .45), transparent 70%)" }}
          />
          <button
            onClick={() => {
              spookClick();
              onToggleFavorite(item.id);
            }}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remove ${item.title} from favourites` : `Add ${item.title} to favourites`}
            className="glass absolute right-3 top-3 grid size-11 place-items-center rounded-full text-moonlight transition-transform hover:scale-110"
          >
            <HeartIcon className={`size-5 ${isFavorite ? "fill-crimson text-crimson" : ""}`} />
          </button>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-display text-base leading-snug text-moonlight">{item.title}</h3>
            <p className="mt-1 text-xs text-moonlight/60">
              {item.show ? `${item.show} · S${item.season}E${item.episode} · ` : ""}
              {item.year} · {item.runtime} · {item.genres[0]}
            </p>
          </div>
        </div>

        <div className="max-h-0 overflow-hidden px-4 opacity-0 transition-all duration-500 group-hover:max-h-56 group-hover:pb-4 group-hover:opacity-100 group-focus-within:max-h-56 group-focus-within:pb-4 group-focus-within:opacity-100">
          <p className="pt-3 text-xs leading-relaxed text-moonlight/75">{item.description}</p>
          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-pumpkin">
            {item.streaming.join(" · ")}
          </p>
          <button
            onClick={() => watch(item)}
            className="glass glass-edge mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold text-moonlight transition-transform hover:scale-[1.02]"
          >
            <PlayPumpkinIcon className="size-4" /> Watch now
          </button>
        </div>
      </div>

      {/* Always-visible mobile actions */}
      <div className="mt-3 flex gap-2 sm:hidden">
        <button
          onClick={() => watch(item)}
          className="glass glass-edge flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full text-xs font-semibold text-moonlight"
        >
          <PlayPumpkinIcon className="size-4" /> Watch
        </button>
      </div>
    </article>
  );
}

export function Row({
  row,
  favorites,
  onToggleFavorite,
}: {
  row: VaultRow;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const scroller = useRef<HTMLDivElement>(null);

  if (row.items.length === 0) return null;

  return (
    <div ref={ref} data-visible={visible} className="reveal">
      <div className="mb-4 flex items-end justify-between gap-4 px-5 sm:px-10">
        <div>
          <h3 className="font-display text-xl text-moonlight sm:text-2xl">{row.label}</h3>
          <p className="mt-1 text-xs text-moonlight/55 sm:text-sm">{row.blurb}</p>
        </div>
        <div className="hidden gap-2 sm:flex">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              aria-label={dir < 0 ? `Scroll ${row.label} left` : `Scroll ${row.label} right`}
              onClick={() => scroller.current?.scrollBy({ left: dir * 560, behavior: "smooth" })}
              className="glass grid size-11 place-items-center rounded-full text-moonlight transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d={dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div ref={scroller} className="row-scroll flex gap-5 px-5 pb-4 sm:px-10">
        {row.items.map((item) => (
          <TitleCard
            key={item.id + row.id}
            item={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
