// src/data/vault.ts
import {
  VaultTitle,
  StreamingProviderId,
  rankSeasonal,
  scoresOf,
} from "@/data/seasonal";

import artWitch from "@/assets/art/witch.jpg";
import artMansion from "@/assets/art/mansion.jpg";
import artAutumn from "@/assets/art/autumn.jpg";
import artCartoon from "@/assets/art/cartoon.jpg";

const art = {
  witch: artWitch,
  mansion: artMansion,
  autumn: artAutumn,
  cartoon: artCartoon,
};

export const titles: VaultTitle[] = [
  {
    id: "hocus-pocus",
    kind: "movie",
    title: "Hocus Pocus",
    year: 1993,
    runtime: "1h 36m",
    genres: ["Family", "Fantasy", "Comedy"],
    description:
      "A curious teen lights the Black Flame Candle and resurrects three deliciously wicked witches over Salem on Halloween night.",
    cast: ["Bette Midler", "Sarah Jessica Parker", "Kathy Najimy"],
    director: "Kenny Ortega",
    streaming: ["disney-plus"],
    watchUrl: "https://dulo.gd/watch/hocus-pocus",
    art: art.witch,
    categories: ["Classic Halloween", "Family Halloween", "Witch Movies", "Halloween Comedies"],
    decade: "1990s",
    tags: ["Halloween", "Witch", "Small town", "Nostalgic"],
  },
  {
    id: "halloweentown",
    kind: "movie",
    title: "Halloweentown",
    year: 1998,
    runtime: "1h 24m",
    genres: ["Family", "Fantasy"],
    description:
      "Marnie discovers she descends from a line of witches and steps through a portal into a town where every night is Halloween.",
    cast: ["Debbie Reynolds", "Kimberly J. Brown"],
    director: "Duwayne Dunham",
    streaming: ["disney-plus"],
    watchUrl: "https://dulo.gd/watch/halloweentown",
    art: art.witch,
    categories: ["Family Halloween", "Witch Movies", "Classic Halloween"],
    decade: "1990s",
    tags: ["Halloween", "Witch", "Magical", "Nostalgic"],
  },
  {
    id: "nightmare-before-christmas",
    kind: "movie",
    title: "The Nightmare Before Christmas",
    year: 1993,
    runtime: "1h 16m",
    genres: ["Animation", "Musical", "Fantasy"],
    description:
      "Jack Skellington, the Pumpkin King, grows tired of the same old scares and stumbles into a holiday of snow and light.",
    cast: ["Danny Elfman", "Chris Sarandon", "Catherine O'Hara"],
    director: "Henry Selick",
    streaming: ["disney-plus"],
    watchUrl: "https://dulo.gd/watch/nightmare-before-christmas",
    art: art.cartoon,
    categories: ["Animated Halloween", "Classic Halloween", "Monster Movies"],
    decade: "1990s",
    tags: ["Halloween", "Monster", "Skeleton", "Magical"],
  },
  {
    id: "haunted-mansion",
    kind: "movie",
    title: "The Haunted Mansion",
    year: 2003,
    runtime: "1h 39m",
    genres: ["Family", "Comedy", "Horror"],
    description:
      "A realtor's family is trapped inside an elegant Louisiana estate with 999 happy haunts — and room for one more.",
    cast: ["Eddie Murphy", "Terence Stamp"],
    director: "Rob Minkoff",
    streaming: ["disney-plus"],
    watchUrl: "https://dulo.gd/watch/haunted-mansion",
    art: art.mansion,
    categories: ["Haunted Houses", "Family Halloween", "Halloween Comedies"],
    decade: "2000s",
    tags: ["Halloween", "Haunted house", "Ghost", "Spooky"],
  },
  {
    id: "the-haunting",
    kind: "movie",
    title: "The Haunting",
    year: 1963,
    runtime: "1h 52m",
    genres: ["Horror", "Mystery"],
    description:
      "Four strangers spend a season in Hill House, where the fear arrives entirely through sound, shadow and suggestion.",
    cast: ["Julie Harris", "Claire Bloom"],
    director: "Robert Wise",
    streaming: ["max"],
    watchUrl: null,
    art: art.mansion,
    categories: ["Horror", "Haunted Houses", "Hidden Gems"],
    decade: "1960s",
    tags: ["Haunted house", "Ghost", "Creepy", "Mysterious"],
  },
  {
    id: "sleepy-hollow",
    kind: "movie",
    title: "Sleepy Hollow",
    year: 1999,
    runtime: "1h 45m",
    genres: ["Horror", "Fantasy", "Mystery"],
    description:
      "Ichabod Crane rides into a fog-choked autumn village where a headless horseman collects heads by moonlight.",
    cast: ["Johnny Depp", "Christina Ricci"],
    director: "Tim Burton",
    streaming: ["paramount-plus"],
    watchUrl: "https://dulo.gd/watch/sleepy-hollow",
    art: art.mansion,
    categories: ["Horror", "Classic Halloween", "Cozy Autumn Movies"],
    decade: "1990s",
    tags: ["Halloween", "Autumn", "Forest", "Small town"],
  },
  {
    id: "practical-magic",
    kind: "movie",
    title: "Practical Magic",
    year: 1998,
    runtime: "1h 44m",
    genres: ["Romance", "Fantasy"],
    description:
      "Two sisters bound by a family curse brew midnight margaritas in a seaside house full of herbs, spells and second chances.",
    cast: ["Sandra Bullock", "Nicole Kidman"],
    director: "Griffin Dunne",
    streaming: ["max"],
    watchUrl: "https://dulo.gd/watch/practical-magic",
    art: art.witch,
    categories: ["Witch Movies", "Fall Romance", "Cozy Autumn Movies"],
    decade: "1990s",
    tags: ["Witch", "Autumn", "Cozy", "Magical"],
  },
  {
    id: "young-frankenstein",
    kind: "movie",
    title: "Young Frankenstein",
    year: 1974,
    runtime: "1h 46m",
    genres: ["Comedy", "Horror"],
    description:
      "The grandson of the infamous doctor inherits the castle, the lab, and a monster with surprisingly good rhythm.",
    cast: ["Gene Wilder", "Marty Feldman", "Teri Garr"],
    director: "Mel Brooks",
    streaming: ["hulu"],
    watchUrl: "https://dulo.gd/watch/young-frankenstein",
    art: art.mansion,
    categories: ["Halloween Comedies", "Monster Movies", "Classic Halloween"],
    decade: "1970s",
    tags: ["Monster", "Halloween", "Nostalgic"],
  },
  {
    id: "creature-black-lagoon",
    kind: "movie",
    title: "Creature from the Black Lagoon",
    year: 1954,
    runtime: "1h 19m",
    genres: ["Horror", "Adventure"],
    description:
      "An Amazon expedition disturbs a prehistoric amphibian man — the last great Universal Monster.",
    cast: ["Richard Carlson", "Julie Adams"],
    director: "Jack Arnold",
    streaming: ["peacock"],
    watchUrl: null,
    art: art.mansion,
    categories: ["Monster Movies", "Horror", "Hidden Gems"],
    decade: "1950s",
    tags: ["Monster", "Creepy"],
  },
  {
    id: "costume-party",
    kind: "movie",
    title: "The Costume Party",
    year: 2016,
    runtime: "1h 28m",
    genres: ["Comedy", "Mystery"],
    description:
      "A hidden gem: nothing in the title says Halloween, but the whole film unfolds across one masked October night.",
    cast: ["Ensemble cast"],
    streaming: ["tubi"],
    watchUrl: null,
    art: art.cartoon,
    categories: ["Hidden Gems", "Halloween Comedies"],
    decade: "2010s",
    tags: ["Costume party", "October", "Halloween"],
  },
  {
    id: "when-harry-met-sally",
    kind: "movie",
    title: "When Harry Met Sally",
    year: 1989,
    runtime: "1h 35m",
    genres: ["Romance", "Comedy"],
    description:
      "The definitive fall-in-New-York film: sweaters, leaves in Central Park, and a friendship that keeps circling romance.",
    cast: ["Billy Crystal", "Meg Ryan"],
    director: "Rob Reiner",
    streaming: ["prime-video"],
    watchUrl: "https://dulo.gd/watch/when-harry-met-sally",
    art: art.autumn,
    categories: ["Fall Romance", "Cozy Autumn Movies"],
    decade: "1980s",
    tags: ["Fall", "Autumn", "Cozy"],
  },
  {
    id: "pumpkin-season",
    kind: "movie",
    title: "Pumpkin Season",
    year: 2021,
    runtime: "1h 32m",
    genres: ["Drama", "Family"],
    description:
      "A family farm fights to keep its patch open one more harvest. Pure hay-bale-and-cider comfort viewing.",
    cast: ["Ensemble cast"],
    streaming: ["tubi"],
    watchUrl: null,
    art: art.autumn,
    categories: ["Pumpkin Season", "Harvest Themes", "Cozy Autumn Movies"],
    decade: "2020s",
    tags: ["Pumpkin patch", "Harvest", "Cider", "Farm"],
  },
  {
    id: "simpsons-treehouse-v",
    kind: "episode",
    title: "Treehouse of Horror V",
    show: "The Simpsons",
    season: 6,
    episode: 6,
    year: 1994,
    runtime: "22m",
    genres: ["Animation", "Comedy", "Horror"],
    description:
      "The Shinning, Time and Punishment, and Nightmare Cafeteria — the gold standard of the Halloween anthology episode.",
    cast: ["Dan Castellaneta", "Julie Kavner"],
    streaming: ["disney-plus"],
    watchUrl: "https://dulo.gd/watch/treehouse-of-horror-v",
    art: art.cartoon,
    categories: ["Cartoon Specials", "Sitcom Halloween Episodes", "Animated Specials"],
    decade: "1990s",
    tags: ["Halloween", "Spooky", "Ghost", "Monster"],
  },
  {
    id: "great-pumpkin",
    kind: "special",
    title: "It's the Great Pumpkin, Charlie Brown",
    show: "Peanuts",
    year: 1966,
    runtime: "25m",
    genres: ["Animation", "Family"],
    description:
      "Linus waits all night in the sincerest pumpkin patch he can find. Still the most tender Halloween special ever made.",
    cast: ["Peter Robbins", "Christopher Shea"],
    director: "Bill Melendez",
    streaming: ["apple-tv"],
    watchUrl: "https://dulo.gd/watch/great-pumpkin",
    art: art.cartoon,
    categories: ["Animated Specials", "Cartoon Specials", "Family Halloween Episodes"],
    decade: "1960s",
    tags: ["Halloween", "Pumpkin patch", "Trick or treating", "Wholesome"],
  },
  {
    id: "office-halloween",
    kind: "episode",
    title: "Halloween",
    show: "The Office",
    season: 2,
    episode: 5,
    year: 2005,
    runtime: "22m",
    genres: ["Comedy"],
    description:
      "Michael must fire someone by the end of the day — while wearing a two-headed costume. Excruciating and perfect.",
    cast: ["Steve Carell", "John Krasinski"],
    streaming: ["peacock"],
    watchUrl: "https://dulo.gd/watch/the-office-halloween",
    art: art.cartoon,
    categories: ["Sitcom Halloween Episodes", "Family Halloween Episodes"],
    decade: "2000s",
    tags: ["Halloween", "Costume party"],
  },
  {
    id: "wkrp-turkeys",
    kind: "episode",
    title: "Turkeys Away",
    show: "WKRP in Cincinnati",
    season: 1,
    episode: 7,
    year: 1978,
    runtime: "24m",
    genres: ["Comedy"],
    description:
      "As God is my witness, the greatest Thanksgiving episode in television history — and a Fall Collection essential.",
    cast: ["Gordon Jump", "Loni Anderson"],
    streaming: ["hulu"],
    watchUrl: null,
    art: art.autumn,
    categories: ["Thanksgiving", "Sitcom Halloween Episodes", "Harvest Themes"],
    decade: "1970s",
    tags: ["Thanksgiving", "Autumn", "Fall"],
  },
];

/* ------------------------------------------------------------------ *
 * Expanded discovery library.
 * ------------------------------------------------------------------ */
interface Seed {
  id: string;
  kind: "movie" | "episode" | "special";
  title: string;
  show?: string;
  season?: number;
  episode?: number;
  year: number;
  runtime: string;
  genres: string[];
  description: string;
  streaming: StreamingProviderId[];
  art: string;
  categories: string[];
}

const decadeOf = (year: number) => {
  if (year >= 2020) return "2020s";
  if (year >= 2010) return "2010s";
  return `${Math.floor(year / 10) * 10}s`;
};

const seeds: Seed[] = [
  {
    id: "costume-party-seed",
    kind: "movie",
    title: "The Costume Party",
    year: 2016,
    runtime: "1h 42m",
    genres: ["Comedy", "Mystery"],
    description:
      "A masquerade in an old manor turns into a night of mistaken identities, hidden passages and one very real ghost.",
    streaming: ["prime-video"],
    art: art.mansion,
    categories: ["Hidden Gems", "Halloween Comedies", "Haunted Houses"],
  },
  {
    id: "autumn-festival",
    kind: "movie",
    title: "Autumn Festival",
    year: 2019,
    runtime: "1h 38m",
    genres: ["Romance", "Drama"],
    description:
      "A cider-soaked harvest weekend in Vermont: hay bales, orchard lanterns and a slow-burning October romance.",
    streaming: ["netflix"],
    art: art.autumn,
    categories: ["Fall Romance", "Cozy Autumn Movies", "Harvest Themes"],
  },
  {
    id: "monster-night",
    kind: "movie",
    title: "Monster Night",
    year: 2011,
    runtime: "1h 29m",
    genres: ["Family", "Adventure"],
    description:
      "Every creature in the neighbourhood escapes its storybook on one October evening, and two kids have to write them back in.",
    streaming: ["hulu"],
    art: art.cartoon,
    categories: ["Family Halloween", "Monster Movies", "Hidden Gems"],
  },
  {
    id: "haunted-house-hill",
    kind: "movie",
    title: "The Haunted House on Wren Hill",
    year: 1978,
    runtime: "1h 51m",
    genres: ["Horror", "Mystery"],
    description:
      "A widow inherits a hilltop estate that keeps rearranging its own rooms. Slow, elegant, deeply unsettling.",
    streaming: ["shudder"],
    art: art.mansion,
    categories: ["Haunted Houses", "Horror", "Classic Halloween"],
  },
  {
    id: "october-special",
    kind: "special",
    title: "The October Special",
    show: "Midnight Variety",
    season: 4,
    episode: 3,
    year: 1986,
    runtime: "48m",
    genres: ["Comedy", "Music"],
    description:
      "A live variety hour broadcast from a fog machine and a papier-mâché graveyard. Gloriously of its time.",
    streaming: ["peacock"],
    art: art.cartoon,
    categories: ["Cartoon Specials", "Animated Specials", "Hidden Gems"],
  },
  {
    id: "witch-of-birch-lane",
    kind: "movie",
    title: "The Witch of Birch Lane",
    year: 2004,
    runtime: "1h 44m",
    genres: ["Fantasy", "Family"],
    description:
      "A herbalist at the end of a leafy lane teaches a lonely girl three spells — and one of them shouldn't be spoken.",
    streaming: ["disney-plus"],
    art: art.witch,
    categories: ["Witch Movies", "Family Halloween", "Hidden Gems"],
  },
  {
    id: "cider-mill",
    kind: "movie",
    title: "The Cider Mill",
    year: 2014,
    runtime: "1h 35m",
    genres: ["Drama", "Romance"],
    description:
      "Two estranged siblings reopen their father's mill through one gold-and-rust New England autumn.",
    streaming: ["prime-video"],
    art: art.autumn,
    categories: ["Cozy Autumn Movies", "Harvest Themes", "Fall Romance"],
  },
  {
    id: "graveyard-shift-diner",
    kind: "movie",
    title: "Graveyard Shift Diner",
    year: 1997,
    runtime: "1h 33m",
    genres: ["Horror", "Comedy"],
    description:
      "A roadside diner between midnight and dawn on October 31st, where every customer is a little bit dead.",
    streaming: ["shudder"],
    art: art.mansion,
    categories: ["Halloween Comedies", "Horror", "Hidden Gems"],
  },
  {
    id: "pumpkin-king-parade",
    kind: "special",
    title: "The Pumpkin King's Parade",
    year: 1991,
    runtime: "26m",
    genres: ["Animation", "Family"],
    description:
      "Stop-motion lanterns march through a papercraft town while a lonely scarecrow finds a crown.",
    streaming: ["max"],
    art: art.cartoon,
    categories: ["Animated Specials", "Cartoon Specials", "Pumpkin Season"],
  },
  {
    id: "ghost-of-ash-street",
    kind: "movie",
    title: "The Ghost of Ash Street",
    year: 1963,
    runtime: "1h 27m",
    genres: ["Mystery", "Horror"],
    description:
      "Black-and-white, whisper-quiet, and still the best staircase shot ever put on film.",
    streaming: ["tubi"],
    art: art.mansion,
    categories: ["Classic Halloween", "Haunted Houses", "Horror"],
  },
  {
    id: "trick-or-treat-lane",
    kind: "episode",
    title: "Trick or Treat Lane",
    show: "Maple Street",
    season: 3,
    episode: 6,
    year: 1999,
    runtime: "22m",
    genres: ["Comedy"],
    description:
      "The whole cul-de-sac competes for best decorated porch. Someone brings a real coffin.",
    streaming: ["hulu"],
    art: art.cartoon,
    categories: ["Sitcom Halloween Episodes", "Family Halloween Episodes"],
  },
  {
    id: "midnight-masquerade",
    kind: "movie",
    title: "Midnight Masquerade",
    year: 1988,
    runtime: "1h 47m",
    genres: ["Fantasy", "Romance"],
    description:
      "At the stroke of twelve every mask in the ballroom comes alive — including the one you're wearing.",
    streaming: ["prime-video"],
    art: art.witch,
    categories: ["Witch Movies", "Hidden Gems", "Classic Halloween"],
  },
  {
    id: "scarecrow-field",
    kind: "movie",
    title: "Scarecrow Field",
    year: 1982,
    runtime: "1h 39m",
    genres: ["Horror"],
    description:
      "Harvest in a Kansas corn maze, and something in row nineteen has started keeping pace with you.",
    streaming: ["shudder"],
    art: art.autumn,
    categories: ["Horror", "Harvest Themes", "Monster Movies"],
  },
  {
    id: "coven-cookbook",
    kind: "movie",
    title: "The Coven Cookbook",
    year: 2021,
    runtime: "1h 41m",
    genres: ["Comedy", "Fantasy"],
    description:
      "Three sisters inherit a bakery whose recipes only work if you read them backwards under a full moon.",
    streaming: ["netflix"],
    art: art.witch,
    categories: ["Witch Movies", "Halloween Comedies", "Cozy Autumn Movies"],
  },
  {
    id: "monsters-in-the-attic",
    kind: "special",
    title: "Monsters in the Attic",
    year: 1974,
    runtime: "24m",
    genres: ["Animation", "Family"],
    description:
      "Hand-painted cels, a gentle werewolf, and a lullaby that has haunted three generations of children.",
    streaming: ["max"],
    art: art.cartoon,
    categories: ["Animated Specials", "Monster Movies", "Family Halloween"],
  },
  {
    id: "harvest-moon-inn",
    kind: "movie",
    title: "Harvest Moon Inn",
    year: 2018,
    runtime: "1h 36m",
    genres: ["Romance"],
    description:
      "A city chef takes over a country inn during peak leaf season and learns to make pie from scratch.",
    streaming: ["netflix"],
    art: art.autumn,
    categories: ["Fall Romance", "Cozy Autumn Movies", "Thanksgiving"],
  },
  {
    id: "black-cat-boulevard",
    kind: "episode",
    title: "Black Cat Boulevard",
    show: "Night Shift",
    season: 2,
    episode: 4,
    year: 2013,
    runtime: "43m",
    genres: ["Drama", "Mystery"],
    description:
      "An October 31st shift where every patient arrives already in costume — and one of them isn't wearing one.",
    streaming: ["hulu"],
    art: art.mansion,
    categories: ["Sitcom Halloween Episodes", "Hidden Gems", "Horror"],
  },
  {
    id: "lantern-makers",
    kind: "movie",
    title: "The Lantern Makers",
    year: 2009,
    runtime: "1h 32m",
    genres: ["Family", "Fantasy"],
    description:
      "A village where every carved pumpkin holds one wish, and the carvers have run out of candles.",
    streaming: ["disney-plus"],
    art: art.cartoon,
    categories: ["Pumpkin Season", "Family Halloween", "Hidden Gems"],
  },
  {
    id: "the-long-october",
    kind: "movie",
    title: "The Long October",
    year: 2022,
    runtime: "1h 58m",
    genres: ["Drama", "Mystery"],
    description:
      "A small town where the month refuses to end. Sweaters, fog, and a calendar stuck on the 31st.",
    streaming: ["max"],
    art: art.autumn,
    categories: ["Hidden Gems", "Cozy Autumn Movies", "Haunted Houses"],
  },
  {
    id: "spellbound-supper",
    kind: "episode",
    title: "The Spellbound Supper",
    show: "Thistle & Thorn",
    season: 1,
    episode: 8,
    year: 2020,
    runtime: "38m",
    genres: ["Fantasy", "Comedy"],
    description:
      "A witch hosts a dinner party for the recently deceased. Seating arrangements become a nightmare.",
    streaming: ["prime-video"],
    art: art.witch,
    categories: ["Witch Movies", "Sitcom Halloween Episodes", "Halloween Comedies"],
  },
];

for (const s of seeds) {
  titles.push({
    id: s.id,
    kind: s.kind,
    title: s.title,
    ...(s.show ? { show: s.show, season: s.season ?? 1, episode: s.episode ?? 1 } : {}),
    year: s.year,
    runtime: s.runtime,
    genres: s.genres,
    description: s.description,
    cast: [],
    streaming: s.streaming,
    watchUrl: `https://dulo.gd/watch/${s.id}`,
    art: s.art,
    categories: s.categories,
    decade: decadeOf(s.year),
  });
}

export const rankedTitles = rankSeasonal(titles);

/* ------------------------------------------------------------------ *
 * Search & Oracle engine — compatibility functions.
 * ------------------------------------------------------------------ */

export function searchVault(query: string, pool: VaultTitle[] = titles) {
  const q = query.trim().toLowerCase();
  if (!q) return pool;
  const terms = q.split(/\s+/);
  return pool
    .map((t) => {
      const hay = [
        t.title,
        t.show ?? "",
        t.description,
        ...t.genres,
        ...t.categories,
        ...t.cast,
      ]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (t.title.toLowerCase().includes(term)) score += 6;
        else if (hay.includes(term)) score += 2;
      }
      return { t, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.t);
}

export type OracleMood = "Scary" | "Funny" | "Family" | "Cozy Fall" | "Classic" | "Animated";

export const ORACLE_MOODS: { mood: OracleMood; blurb: string }[] = [
  { mood: "Scary", blurb: "Lights off. Doors locked." },
  { mood: "Funny", blurb: "Screams, but the laughing kind." },
  { mood: "Family", blurb: "Spooky enough for everyone." },
  { mood: "Cozy Fall", blurb: "Cider, sweaters, amber light." },
  { mood: "Classic", blurb: "The canon of October." },
  { mood: "Animated", blurb: "Cels, puppets and specials." },
];

const MOOD_MATCH: Record<OracleMood, (t: VaultTitle) => boolean> = {
  Scary: (t) =>
    t.genres.includes("Horror") || t.categories.includes("Horror") || scoresOf(t).halloween >= 90,
  Funny: (t) => t.genres.includes("Comedy") || t.categories.includes("Halloween Comedies"),
  Family: (t) => t.genres.includes("Family") || t.categories.some((c) => c.startsWith("Family")),
  "Cozy Fall": (t) => scoresOf(t).fall >= 80,
  Classic: (t) => t.year < 1995 || t.categories.includes("Classic Halloween"),
  Animated: (t) =>
    t.genres.includes("Animation") ||
    t.categories.some((c) => c.includes("Animated") || c.includes("Cartoon")),
};

export interface OracleResult {
  title: VaultTitle;
  reason: string;
}

export function consultOracle(mood: OracleMood, exclude: string[] = []): OracleResult {
  const pool = titles.filter((t) => MOOD_MATCH[mood](t) && !exclude.includes(t.id));
  const source = pool.length ? pool : titles;
  const weights = source.map((t) => 1 + Math.pow(scoresOf(t).overall / 100, 2) * 9);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  let index = 0;
  for (let i = 0; i < source.length; i++) {
    roll -= weights[i]!;
    if (roll <= 0) {
      index = i;
      break;
    }
  }
  const title = source[index]!;
  const reasons: Record<OracleMood, string> = {
    Scary: `The Oracle scored this ${scoresOf(title).halloween}/100 on the fear meter.`,
    Funny: `Chosen for laughs: ${title.genres.join(", ")} with a fog machine somewhere off-camera.`,
    Family: `Safe for the whole coven — ${title.runtime}, ${title.year}, and no nightmares promised.`,
    "Cozy Fall": `A ${scoresOf(title).fall}/100 autumn score. The crystal ball smelled like cinnamon.`,
    Classic: `From ${title.year} — the Oracle keeps this one on the top shelf of the vault.`,
    Animated: `Drawn, painted or puppeted. The bats voted for this one.`,
  };
  return { title, reason: reasons[mood] };
}

export interface VaultRow {
  id: string;
  label: string;
  blurb: string;
  items: VaultTitle[];
}

export interface VaultSection {
  id: string;
  label: string;
  rows: VaultRow[];
}

const by = (...cats: string[]) => titles.filter((t) => t.categories.some((c) => cats.includes(c)));

export const sections: VaultSection[] = [
  {
    id: "halloween-movies",
    label: "Halloween Movies",
    rows: [
      {
        id: "classic",
        label: "Classic Halloween",
        blurb: "The canon. Watched every October, without exception.",
        items: by("Classic Halloween"),
      },
      {
        id: "family",
        label: "Family Halloween",
        blurb: "Spooky enough to thrill, gentle enough for everyone.",
        items: by("Family Halloween"),
      },
      {
        id: "witches",
        label: "Witch Movies",
        blurb: "Black flame candles, herb gardens and midnight covens.",
        items: by("Witch Movies"),
      },
      {
        id: "haunted",
        label: "Haunted Houses & Monsters",
        blurb: "Elegant estates and the things that live in them.",
        items: by("Haunted Houses", "Monster Movies"),
      },
      {
        id: "horror",
        label: "Horror",
        blurb: "For the lights-off hours after the trick-or-treaters leave.",
        items: by("Horror"),
      },
      {
        id: "comedies",
        label: "Halloween Comedies",
        blurb: "Laughs with a little fog machine.",
        items: by("Halloween Comedies"),
      },
    ],
  },
  {
    id: "tv-episodes",
    label: "Halloween TV Episodes",
    rows: [
      {
        id: "sitcom",
        label: "Sitcom Halloween Episodes",
        blurb: "Twenty-two perfect minutes of costume chaos.",
        items: by("Sitcom Halloween Episodes"),
      },
      {
        id: "cartoons",
        label: "Cartoon & Animated Specials",
        blurb: "The specials that made October feel like October.",
        items: by("Cartoon Specials", "Animated Specials"),
      },
    ],
  },
  {
    id: "fall",
    label: "Fall Collection",
    rows: [
      {
        id: "cozy",
        label: "Cozy Autumn Movies",
        blurb: "Sweaters, cider, and light through amber leaves.",
        items: by("Cozy Autumn Movies"),
      },
      {
        id: "harvest",
        label: "Pumpkin Season, Harvest & Thanksgiving",
        blurb: "Patches, farms and the long table at the end of fall.",
        items: by("Pumpkin Season", "Harvest Themes", "Thanksgiving"),
      },
      {
        id: "romance",
        label: "Fall Romance",
        blurb: "Love, in the best month for walking.",
        items: by("Fall Romance"),
      },
    ],
  },
  {
    id: "gems",
    label: "Hidden Vault Gems",
    rows: [
      {
        id: "hidden",
        label: "Hidden Halloween Gems",
        blurb: "Found by reading descriptions, not just titles.",
        items: by("Hidden Gems"),
      },
    ],
  },
];

export const decades = ["1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

export const featured = titles.find((t) => t.id === "hocus-pocus") || titles[0]!;

export function dailyPicks(date = new Date()) {
  const day = date.getDate();
  const pick = (kind: string) => {
    const pool = titles.filter((t) => t.kind === kind);
    return pool[day % pool.length] || titles[0]!;
  };
  return { movie: pick("movie"), episode: pick("episode"), special: pick("special") };
}

export function countdownToHalloween(now = new Date()) {
  const year =
    now.getMonth() > 9 || (now.getMonth() === 9 && now.getDate() > 31)
      ? now.getFullYear() + 1
      : now.getFullYear();
  const target = new Date(year, 9, 31, 0, 0, 0);
  const ms = target.getTime() - now.getTime();
  return {
    days: Math.max(0, Math.floor(ms / 86400000)),
    hours: Math.max(0, Math.floor((ms % 86400000) / 3600000)),
    minutes: Math.max(0, Math.floor((ms % 3600000) / 60000)),
    seconds: Math.max(0, Math.floor((ms % 60000) / 1000)),
  };
}
