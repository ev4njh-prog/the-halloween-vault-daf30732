/**
 * SEASONAL VIDEO DISCOVERY — a separate domain from the movie library.
 * --------------------------------------------------------------------
 * Vlogs, haunted attraction tours, DIY decorations, pumpkin carving, costume
 * builds, fall recipes, ambience, Halloween music, creator shorts and indie
 * horror shorts live here — never mixed into `titles` in `vault.ts`.
 *
 * No content is invented. Videos only ever enter the app through a registered,
 * *activated* provider that returns real, verifiable items. Until a provider is
 * switched on, each channel is empty by design and the UI shows its
 * architecture-ready empty state.
 */

export type VideoChannelId =
  | "halloween-vlogs"
  | "haunt-tours"
  | "diy-decor"
  | "pumpkin-carving"
  | "costume-creation"
  | "fall-recipes"
  | "autumn-ambience"
  | "halloween-music"
  | "creator-shorts"
  | "indie-horror-shorts";

export interface VideoChannel {
  id: VideoChannelId;
  label: string;
  blurb: string;
  /** Seasonal window this channel is most relevant in. */
  season: "fall" | "halloween" | "thanksgiving" | "all";
}

export const VIDEO_CHANNELS: VideoChannel[] = [
  { id: "halloween-vlogs", label: "Halloween Vlogs", blurb: "Season diaries, haul videos and countdown series.", season: "halloween" },
  { id: "haunt-tours", label: "Haunted Attraction Tours", blurb: "Walkthroughs of haunts, mazes and theme-park events.", season: "halloween" },
  { id: "diy-decor", label: "DIY Decorations", blurb: "Front-yard builds, props and lighting rigs.", season: "halloween" },
  { id: "pumpkin-carving", label: "Pumpkin Carving", blurb: "From templates to competition-grade sculpture.", season: "halloween" },
  { id: "costume-creation", label: "Costume Creation", blurb: "Patterns, prosthetics and build logs.", season: "halloween" },
  { id: "fall-recipes", label: "Fall Recipes", blurb: "Cider, pies, roasts and the Thanksgiving table.", season: "thanksgiving" },
  { id: "autumn-ambience", label: "Autumn Ambience", blurb: "Rain, fireplaces, libraries and long-form atmosphere.", season: "fall" },
  { id: "halloween-music", label: "Halloween Music", blurb: "Scores, organ pieces, spooky playlists and party sets.", season: "halloween" },
  { id: "creator-shorts", label: "Small Creator Short Films", blurb: "Seasonal shorts from independent filmmakers.", season: "all" },
  { id: "indie-horror-shorts", label: "Independent Horror Shorts", blurb: "Festival and web-published horror shorts.", season: "halloween" },
];

export interface SeasonalVideo {
  id: string;
  channel: VideoChannelId;
  title: string;
  creator: string;
  /** Absolute URL to the real, existing video. */
  url: string;
  duration?: string;
  publishedYear?: number;
  thumbnailUrl?: string;
  tags?: string[];
  providerId: VideoProviderId;
}

export type VideoProviderId = "youtube" | "vimeo" | "creator-submissions" | "curated-playlists";

export interface VideoProvider {
  id: VideoProviderId;
  label: string;
  channels: VideoChannelId[];
  active: boolean;
  /** Paged fetch so a provider can stream in thousands of real items. */
  fetch(channel: VideoChannelId, page?: number): Promise<SeasonalVideo[]>;
}

const dormant = (
  id: VideoProviderId,
  label: string,
  channels: VideoChannelId[],
): VideoProvider => ({
  id,
  label,
  channels,
  active: false,
  async fetch() {
    return [];
  },
});

export const VIDEO_PROVIDERS: VideoProvider[] = [
  dormant("youtube", "YouTube seasonal search", VIDEO_CHANNELS.map((c) => c.id)),
  dormant("vimeo", "Vimeo shorts & staff picks", ["creator-shorts", "indie-horror-shorts"]),
  dormant("creator-submissions", "Creator submissions", ["creator-shorts", "indie-horror-shorts", "diy-decor"]),
  dormant("curated-playlists", "Curated seasonal playlists", ["halloween-music", "autumn-ambience"]),
];

export const activeVideoProviders = () => VIDEO_PROVIDERS.filter((p) => p.active);

/** Fan-out across activated providers. Returns [] while none are enabled. */
export async function loadChannel(channel: VideoChannelId, page = 0): Promise<SeasonalVideo[]> {
  const providers = activeVideoProviders().filter((p) => p.channels.includes(channel));
  const results = await Promise.all(providers.map((p) => p.fetch(channel, page).catch(() => [])));
  return results.flat();
}

export const videoChannelsFor = (season: VideoChannel["season"]) =>
  VIDEO_CHANNELS.filter((c) => c.season === season || c.season === "all");
