/**
 * THE HALLOWEEN VAULT — Core Type Architecture
 */

export type VaultKind = "movie" | "episode" | "special" | "show";

export interface StreamingOffer {
  providerName: string;
  providerId: string;
  type: "flatrate" | "rent" | "buy" | "free";
  quality?: "HD" | "4K" | "SD";
  deepLink?: string;
  logoPath?: string;
}

export interface StreamingAvailability {
  region: string; // e.g. 'US'
  watchUrl: string | null;
  offers: StreamingOffer[];
  lastUpdated: number;
}

export interface IntentScores {
  halloweenIntensity: number; // 0-100: Raw Halloween focus
  fallAtmosphere: number;     // 0-100: Autumn leaves, harvests
  cozyAutumn: number;         // 0-100: Warm, pie, blankets
  spookyLevel: number;        // 0-100: Scares, fog, monsters
  familyFriendliness: number; // 0-100: Kid-safe ratio
  animationScore: number;     // 0-100: Animation intensity
  classicStatus: number;      // 0-100: Historical/Nostalgic iconic value
  overallSeasonal: number;    // Calculated weighted index
}

export interface ArtworkPipeline {
  posterUrl: string;
  backdropUrl: string | null;
  sourceType: "tmdb-poster" | "tmdb-backdrop" | "seasonal-generated" | "local-fallback";
  isFallback: boolean;
}

export interface EpisodeRef {
  showTitle: string;
  showTmdbId?: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle: string;
  airDate?: string;
}

export interface VaultTitle {
  id: string;
  externalIds: {
    tmdb?: string;
    imdb?: string;
    tvdb?: string;
  };
  kind: VaultKind;
  title: string;
  episodeInfo?: EpisodeRef;
  year: number;
  runtime: string;
  genres: string[];
  description: string;
  cast: string[];
  director?: string;
  
  // Intelligence Layer
  intentScores: IntentScores;
  categories: string[];
  decade: string;
  tags: string[];

  // Streaming & Media Layer
  artwork: ArtworkPipeline;
  art: string; // Legacy UI contract compatibility
  backdropUrl?: string;
  streaming: StreamingAvailability;
  
  // Audit
  lastRefreshed: number;
}

export type OracleMood = 
  | "Scary" 
  | "Funny" 
  | "Family" 
  | "Cozy Fall" 
  | "Classic" 
  | "Animated"
  | "Spooky";

export interface OracleResult {
  title: VaultTitle;
  reason: string;
  matchedScoreKey: keyof IntentScores;
}
