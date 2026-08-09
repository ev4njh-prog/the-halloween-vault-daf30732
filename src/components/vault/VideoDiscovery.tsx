import { useEffect, useState } from "react";
import { VIDEO_CHANNELS, activeVideoProviders, loadChannel, type SeasonalVideo, type VideoChannelId } from "@/data/videos";

/**
 * Seasonal video discovery — deliberately separate from the movie library.
 * Nothing is invented: items appear only when a real provider is activated in
 * `src/data/videos.ts`. Until then each channel shows its architecture state.
 */
export function VideoDiscovery() {
  const [channel, setChannel] = useState<VideoChannelId>("halloween-vlogs");
  const [items, setItems] = useState<SeasonalVideo[]>([]);
  const providers = activeVideoProviders();

  useEffect(() => {
    let live = true;
    loadChannel(channel).then((v) => live && setItems(v));
    return () => {
      live = false;
    };
  }, [channel]);

  const active = VIDEO_CHANNELS.find((c) => c.id === channel)!;

  return (
    <section className="gutter mx-auto max-w-[1400px]" aria-label="Seasonal video discovery">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-moonlight/50">Separate from the library</p>
          <h2 className="font-display text-3xl text-moonlight">Seasonal Video Discovery</h2>
          <p className="text-sm text-moonlight/60">{active.blurb}</p>
        </div>
        <p className="text-xs text-moonlight/45">
          {providers.length
            ? `${providers.length} source${providers.length > 1 ? "s" : ""} connected`
            : "No video source connected yet"}
        </p>
      </div>

      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
        {VIDEO_CHANNELS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setChannel(c.id)}
            aria-pressed={c.id === channel}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
              c.id === channel
                ? "border-crimson/50 bg-crimson/20 text-moonlight"
                : "border-border/60 text-moonlight/60 hover:text-moonlight"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="glass glass-edge rounded-3xl p-8 text-sm text-moonlight/55">
          <p className="mb-2 font-display text-xl text-moonlight">{active.label}</p>
          <p>
            This channel is wired and waiting for a verified video source. Only real, published
            videos from an activated provider will ever appear here — nothing is generated.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((v) => (
            <li key={v.id} className="glass rounded-2xl p-4">
              <a href={v.url} target="_blank" rel="noreferrer" className="text-sm text-moonlight">
                {v.title}
              </a>
              <p className="mt-1 text-xs text-moonlight/50">{v.creator}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
