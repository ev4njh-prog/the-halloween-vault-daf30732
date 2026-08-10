import { memo, useRef } from "react";
import { toast } from "sonner";
import type { VaultTitle, VaultRow } from "@/data/vault";
import { scoresOf, tagsOf } from "@/data/seasonal";
import { artworkFallbackHandler } from "@/data/artwork";
import { HeartIcon, PlayPumpkinIcon } from "./icons";
import { spookClick } from "@/lib/ambience";
import { useReveal } from "@/hooks/use-vault";

function watch(item: VaultTitle) {
  spookClick();
  if (item.watchUrl) {
    window.open(item.watchUrl, "_blank", "noopener,noreferrer");
  } else {
    toast("Streaming location unavailable", {
      description: `${item.title} has no verified watch destination right now.`,
    });
  }
}

export const TitleCard = memo(function TitleCard({
  item,
  isFavorite,
  onToggleFavorite,
  priority = false,
}: {
  item: VaultTitle;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  priority?: boolean;
}) {
  const scores = scoresOf(item);
  const tags = tagsOf(item).slice(0, 3);

  return (
    <article className="group relative w-[190px] shrink-0 snap-start sm:w-[228px]">
      <div className="glass glass-edge overflow-hidden rounded-2xl transition-transform duration-300 ease-out will-change-transform group-hover:-translate-y-1.5 group-focus-within:-translate-y-1.5">
        <div className="relative aspect-2/3 overflow-hidden bg-midnight">
          <img
            src={item.art}
            alt={`Artwork for ${item.title}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onError={artworkFallback(item.art)}
            width={640}
            height={960}
            className="size-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          <span className="absolute left-2.5 top-2.5 rounded-full bg-background/70 px-2 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-pumpkin">
            {scores.overall}
          </span>

          <button
            onClick={() => {
              spookClick();
              onToggleFavorite(item.id);
            }}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Remove ${item.title} from your vault`
                : `Save ${item.title} to your vault`
            }
            className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-background/65 text-moonlight transition-colors hover:bg-background/85"
          >
            <HeartIcon className={`size-4 ${isFavorite ? "fill-crimson text-crimson" : ""}`} />
          </button>
        </div>

        <div className="p-3">
          <h3 className="truncate font-display text-[0.95rem] font-semibold leading-tight text-moonlight">
            {item.title}
          </h3>
          <p className="mt-1 truncate text-[0.68rem] text-moonlight/55">
            {item.show ? `${item.show} · S${item.season}E${item.episode} · ` : ""}
            {item.year} · {item.runtime}
          </p>
          <p className="mt-1.5 truncate text-[0.62rem] uppercase tracking-[0.14em] text-pumpkin/80">
            {(tags.length ? tags : item.genres).join(" · ")}
          </p>

          {/* Expansion: kept inside the card so rows never reflow the page. */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="pt-2 text-[0.7rem] leading-relaxed text-moonlight/70 line-clamp-3">
                {item.description}
              </p>
              <p className="mt-2 text-[0.62rem] uppercase tracking-[0.14em] text-moonlight/45">
                {item.streaming.join(" · ")}
              </p>
            </div>
          </div>

          <button
            onClick={() => watch(item)}
            className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-crimson/85 text-xs font-semibold text-moonlight transition-colors hover:bg-crimson"
          >
            <PlayPumpkinIcon className="size-4" /> Watch
          </button>
        </div>
      </div>
    </article>
  );
});

export const Row = memo(function Row({
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
    <section
      ref={ref}
      data-visible={visible}
      className="reveal content-auto"
      style={{ containIntrinsicSize: "440px" }}
      aria-label={row.label}
    >
      <div className="gutter mb-3 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold text-moonlight sm:text-xl">
            {row.label}
          </h3>
          <p className="mt-0.5 truncate text-xs text-moonlight/50">{row.blurb}</p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              aria-label={dir < 0 ? `Scroll ${row.label} left` : `Scroll ${row.label} right`}
              onClick={() => scroller.current?.scrollBy({ left: dir * 620, behavior: "smooth" })}
              className="grid size-9 place-items-center rounded-full border border-border text-moonlight/80 transition-colors hover:bg-white/5"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  d={dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Only mount cards once the row has been seen — keeps deep scrolls light. */}
      <div ref={scroller} className="row-scroll gutter edge-fade flex gap-4 pb-3">
        {visible ? (
          row.items.map((item, i) => (
            <TitleCard
              key={item.id}
              item={item}
              priority={i < 4}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="h-[400px]" />
        )}
      </div>
    </section>
  );
});
