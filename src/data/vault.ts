import artWitch from "@/assets/art-witch.jpg";
import artMansion from "@/assets/art-mansion.jpg";
import artAutumn from "@/assets/art-autumn.jpg";
import artCartoon from "@/assets/art-cartoon.jpg";
import { rankSeasonal, scoresOf } from "./seasonal";
import { realCatalog, relatedIds } from "./library";

export type VaultKind = "movie" | "episode" | "special";

export interface VaultTitle {
  id: string;
  kind: VaultKind;
  title: string;
  show?: string;
  season?: number;
  episode?: number;
  year: number;
  runtime: string;
  genres: string[];
  description: string;
  cast: string[];
  director?: string;
  halloweenScore: number;
  fallScore: number;
  streaming: string[];
  watchUrl: string | null;
  art: string;
  categories: string[];
  decade: string;
  /** Extra discovery signals (plot keywords, community/user tags). */
  keywords?: string[];
  userTags?: string[];
  /** Franchise / series relationship used for "more like this". */
  franchise?: string;
  /** Internal seasonal theme id used for similar-content relationships. */
  themeId?: string;
  network?: string;
  /** Remote artwork candidates, resolved through the artwork chain. */
  posterUrl?: string | null;
  backdropUrl?: string | null;

}

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
    halloweenScore: 99,
    fallScore: 82,
    streaming: ["Disney+"],
    watchUrl: "https://dulo.gd/watch/hocus-pocus",
    art: art.witch,
    categories: ["Classic Halloween", "Family Halloween", "Witch Movies", "Halloween Comedies"],
    decade: "1990s",
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
    halloweenScore: 97,
    fallScore: 78,
    streaming: ["Disney+"],
    watchUrl: "https://dulo.gd/watch/halloweentown",
    art: art.witch,
    categories: ["Family Halloween", "Witch Movies", "Classic Halloween"],
    decade: "1990s",
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
    halloweenScore: 100,
    fallScore: 74,
    streaming: ["Disney+"],
    watchUrl: "https://dulo.gd/watch/nightmare-before-christmas",
    art: art.cartoon,
    categories: ["Animated Halloween", "Classic Halloween", "Monster Movies"],
    decade: "1990s",
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
    halloweenScore: 88,
    fallScore: 60,
    streaming: ["Disney+"],
    watchUrl: "https://dulo.gd/watch/haunted-mansion",
    art: art.mansion,
    categories: ["Haunted Houses", "Family Halloween", "Halloween Comedies"],
    decade: "2000s",
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
    halloweenScore: 91,
    fallScore: 55,
    streaming: ["Max"],
    watchUrl: null,
    art: art.mansion,
    categories: ["Horror", "Haunted Houses", "Hidden Gems"],
    decade: "1960s",
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
    halloweenScore: 94,
    fallScore: 96,
    streaming: ["Paramount+"],
    watchUrl: "https://dulo.gd/watch/sleepy-hollow",
    art: art.mansion,
    categories: ["Horror", "Classic Halloween", "Cozy Autumn Movies"],
    decade: "1990s",
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
    halloweenScore: 84,
    fallScore: 93,
    streaming: ["Max"],
    watchUrl: "https://dulo.gd/watch/practical-magic",
    art: art.witch,
    categories: ["Witch Movies", "Fall Romance", "Cozy Autumn Movies"],
    decade: "1990s",
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
    halloweenScore: 86,
    fallScore: 50,
    streaming: ["Hulu"],
    watchUrl: "https://dulo.gd/watch/young-frankenstein",
    art: art.mansion,
    categories: ["Halloween Comedies", "Monster Movies", "Classic Halloween"],
    decade: "1970s",
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
    halloweenScore: 82,
    fallScore: 40,
    streaming: ["Peacock"],
    watchUrl: null,
    art: art.mansion,
    categories: ["Monster Movies", "Horror", "Hidden Gems"],
    decade: "1950s",
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
    halloweenScore: 71,
    fallScore: 66,
    streaming: ["Tubi"],
    watchUrl: null,
    art: art.cartoon,
    categories: ["Hidden Gems", "Halloween Comedies"],
    decade: "Modern",
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
    halloweenScore: 12,
    fallScore: 98,
    streaming: ["Prime Video"],
    watchUrl: "https://dulo.gd/watch/when-harry-met-sally",
    art: art.autumn,
    categories: ["Fall Romance", "Cozy Autumn Movies"],
    decade: "1980s",
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
    halloweenScore: 44,
    fallScore: 95,
    streaming: ["Tubi"],
    watchUrl: null,
    art: art.autumn,
    categories: ["Pumpkin Season", "Harvest Themes", "Cozy Autumn Movies"],
    decade: "Modern",
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
    halloweenScore: 98,
    fallScore: 45,
    streaming: ["Disney+"],
    watchUrl: "https://dulo.gd/watch/treehouse-of-horror-v",
    art: art.cartoon,
    categories: ["Cartoon Specials", "Sitcom Halloween Episodes", "Animated Specials"],
    decade: "1990s",
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
    halloweenScore: 96,
    fallScore: 88,
    streaming: ["Apple TV+"],
    watchUrl: "https://dulo.gd/watch/great-pumpkin",
    art: art.cartoon,
    categories: ["Animated Specials", "Cartoon Specials", "Family Halloween Episodes"],
    decade: "1960s",
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
    halloweenScore: 90,
    fallScore: 52,
    streaming: ["Peacock"],
    watchUrl: "https://dulo.gd/watch/the-office-halloween",
    art: art.cartoon,
    categories: ["Sitcom Halloween Episodes", "Family Halloween Episodes"],
    decade: "2000s",
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
    halloweenScore: 8,
    fallScore: 94,
    streaming: ["Hulu"],
    watchUrl: null,
    art: art.autumn,
    categories: ["Thanksgiving", "Sitcom Halloween Episodes", "Harvest Themes"],
    decade: "1970s",
  },
];

/* ------------------------------------------------------------------ *
 * Expanded discovery library.
 *
 * These entries are matched by keyword/description analysis rather than by
 * having "Halloween" in the title — costume parties, autumn festivals,
 * monster nights and October specials all surface through the tag engine.
 * ------------------------------------------------------------------ */
interface Seed {
  id: string;
  kind: VaultKind;
  title: string;
  show?: string;
  season?: number;
  episode?: number;
  year: number;
  runtime: string;
  genres: string[];
  description: string;
  h: number;
  f: number;
  streaming: string[];
  art: string;
  categories: string[];
}

const decadeOf = (year: number) => (year >= 2010 ? "Modern" : `${Math.floor(year / 10) * 10}s`);

const seeds: Seed[] = [
  {
    id: "costume-party",
    kind: "movie",
    title: "The Costume Party",
    year: 2016,
    runtime: "1h 42m",
    genres: ["Comedy", "Mystery"],
    description:
      "A masquerade in an old manor turns into a night of mistaken identities, hidden passages and one very real ghost.",
    h: 84,
    f: 61,
    streaming: ["Prime Video"],
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
    h: 22,
    f: 96,
    streaming: ["Netflix"],
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
    h: 88,
    f: 55,
    streaming: ["Hulu"],
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
    h: 92,
    f: 48,
    streaming: ["Shudder"],
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
    h: 86,
    f: 60,
    streaming: ["Peacock"],
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
    h: 90,
    f: 74,
    streaming: ["Disney+"],
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
    h: 14,
    f: 97,
    streaming: ["Prime Video"],
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
    h: 94,
    f: 40,
    streaming: ["Shudder"],
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
    h: 97,
    f: 78,
    streaming: ["Max"],
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
    h: 89,
    f: 45,
    streaming: ["Criterion"],
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
    h: 91,
    f: 66,
    streaming: ["Hulu"],
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
    h: 87,
    f: 58,
    streaming: ["Prime Video"],
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
    h: 90,
    f: 82,
    streaming: ["Shudder"],
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
    h: 85,
    f: 88,
    streaming: ["Netflix"],
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
    h: 88,
    f: 62,
    streaming: ["Max"],
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
    h: 18,
    f: 95,
    streaming: ["Netflix"],
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
    h: 93,
    f: 50,
    streaming: ["Hulu"],
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
    h: 95,
    f: 84,
    streaming: ["Disney+"],
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
    h: 80,
    f: 92,
    streaming: ["Max"],
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
    h: 89,
    f: 70,
    streaming: ["Prime Video"],
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
    halloweenScore: s.h,
    fallScore: s.f,
    streaming: s.streaming,
    watchUrl: `https://dulo.gd/watch/${s.id}`,
    art: s.art,
    categories: s.categories,
    decade: decadeOf(s.year),
  });
}

/* The curated core above is the editorial spine. The real-content library
 * (compact verified rows + series generators + future content sources) scales
 * the Vault without a single fictional entry. */
const seen = new Set(titles.map((t) => t.title.toLowerCase() + t.year));
for (const t of realCatalog) {
  const key = t.title.toLowerCase() + t.year;
  if (seen.has(key)) continue;
  seen.add(key);
  titles.push(t);
}

/* ------------------------------------------------------------------ *
 * Tag engine — seasonal discovery without relying on titles.
 * ------------------------------------------------------------------ */

export const VAULT_TAGS = [
  "Halloween",
  "Fall",
  "October",
  "Spooky",
  "Cozy",
  "Witch",
  "Monster",
  "Ghost",
  "Pumpkin",
  "Haunted",
  "Autumn",
] as const;

export type VaultTag = (typeof VAULT_TAGS)[number];

const TAG_KEYWORDS: Record<VaultTag, string[]> = {
  Halloween: [
    "halloween",
    "trick or treat",
    "october 31",
    "costume",
    "masquerade",
    "mask",
    "candy",
  ],
  Fall: ["fall", "leaf", "leaves", "cider", "sweater", "orchard", "thanksgiving"],
  October: ["october", "31st", "midnight", "season"],
  Spooky: ["spooky", "eerie", "creepy", "unsettling", "chill", "dark", "fog", "shadow"],
  Cozy: ["cozy", "warm", "inn", "bakery", "pie", "gentle", "lullaby", "romance"],
  Witch: ["witch", "coven", "spell", "cackle", "broom", "hex", "herbalist", "potion"],
  Monster: ["monster", "creature", "werewolf", "vampire", "beast", "goblin"],
  Ghost: ["ghost", "spirit", "haunting", "deceased", "dead", "poltergeist", "phantom"],
  Pumpkin: ["pumpkin", "jack-o", "lantern", "patch", "carve", "gourd"],
  Haunted: ["haunted", "manor", "mansion", "estate", "attic", "graveyard", "cemetery", "crypt"],
  Autumn: ["autumn", "harvest", "corn", "maze", "hay", "amber", "november"],
};

/** Derives discovery tags from every text signal on a title. */
export function tagsFor(t: VaultTitle): VaultTag[] {
  const hay = [
    t.title,
    t.show ?? "",
    t.description,
    ...t.genres,
    ...t.categories,
    ...(t.keywords ?? []),
    ...(t.userTags ?? []),
  ]
    .join(" ")
    .toLowerCase();
  const found = VAULT_TAGS.filter((tag) => TAG_KEYWORDS[tag].some((k) => hay.includes(k)));
  if (t.halloweenScore >= 80 && !found.includes("Halloween")) found.push("Halloween");
  if (t.fallScore >= 85 && !found.includes("Fall")) found.push("Fall");
  return found;
}

const tagIndex = new Map<string, VaultTag[]>();
export function getTags(t: VaultTitle): VaultTag[] {
  let v = tagIndex.get(t.id);
  if (!v) {
    v = tagsFor(t);
    tagIndex.set(t.id, v);
  }
  return v;
}

/** Semantic-ish search: title, cast, description, genres, categories and tags. */
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
        ...(t.keywords ?? []),
        ...(t.userTags ?? []),
        t.franchise ?? "",
        ...getTags(t),
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

export function byTag(tag: VaultTag) {
  return titles.filter((t) => getTags(t).includes(tag));
}

/* ------------------------------------------------------------------ *
 * The Halloween Oracle — mood-driven picks.
 * Every result is drawn from the indexed library and validated before it is
 * returned, so the Oracle can never recommend something that does not exist.
 * ------------------------------------------------------------------ */

export type OracleMood =
  | "Classic Halloween"
  | "Family Fun"
  | "Scary"
  | "Supernatural"
  | "Witchy"
  | "Ghost Stories"
  | "Cozy Autumn"
  | "Harvest Season"
  | "Animated"
  | "Hidden Gems"
  | "TV Episodes"
  | "90s Halloween"
  | "80s Halloween"
  | "Campy Halloween"
  | "Dark Fantasy";

export const ORACLE_MOODS: { mood: OracleMood; blurb: string }[] = [
  { mood: "Classic Halloween", blurb: "The canon of October." },
  { mood: "Family Fun", blurb: "Spooky enough for everyone." },
  { mood: "Scary", blurb: "Lights off. Doors locked." },
  { mood: "Supernatural", blurb: "Things that shouldn't be here." },
  { mood: "Witchy", blurb: "Covens, hexes and herb gardens." },
  { mood: "Ghost Stories", blurb: "Cold rooms and patient guests." },
  { mood: "Cozy Autumn", blurb: "Cider, sweaters, amber light." },
  { mood: "Harvest Season", blurb: "Barns, mazes and the long table." },
  { mood: "Animated", blurb: "Cels, puppets and specials." },
  { mood: "Hidden Gems", blurb: "Under-seen, over-qualified." },
  { mood: "TV Episodes", blurb: "Twenty-two minutes of chaos." },
  { mood: "90s Halloween", blurb: "VHS orange and purple." },
  { mood: "80s Halloween", blurb: "Practical effects, real fog." },
  { mood: "Campy Halloween", blurb: "Gloriously silly monsters." },
  { mood: "Dark Fantasy", blurb: "Portals, prophecies, autumn kingdoms." },
];

const hasCat = (t: VaultTitle, ...cats: string[]) =>
  t.categories.some((c) => cats.some((x) => c.toLowerCase().includes(x.toLowerCase())));
const hasUserTag = (t: VaultTitle, ...tags: string[]) =>
  (t.userTags ?? []).some((x) => tags.includes(x));

const MOOD_MATCH: Record<OracleMood, (t: VaultTitle) => boolean> = {
  "Classic Halloween": (t) => hasCat(t, "Classic Halloween") || t.halloweenScore >= 92,
  "Family Fun": (t) => t.genres.includes("Family") || hasCat(t, "Family"),
  Scary: (t) => t.genres.includes("Horror") || hasCat(t, "Horror"),
  Supernatural: (t) =>
    hasUserTag(t, "Paranormal", "Ghost Story", "Magic", "Dark Fantasy") ||
    hasCat(t, "Haunted", "Monster"),
  Witchy: (t) => hasCat(t, "Witch") || hasUserTag(t, "Witch", "Magic"),
  "Ghost Stories": (t) => hasUserTag(t, "Ghost Story", "Paranormal") || hasCat(t, "Haunted"),
  "Cozy Autumn": (t) => t.fallScore >= 80 && t.halloweenScore < 80,
  "Harvest Season": (t) => hasCat(t, "Harvest", "Thanksgiving", "Pumpkin"),
  Animated: (t) => t.genres.includes("Animation") || hasCat(t, "Animated", "Cartoon"),
  "Hidden Gems": (t) => hasCat(t, "Hidden Gems") || t.streaming.length <= 1,
  "TV Episodes": (t) => t.kind === "episode",
  "90s Halloween": (t) => t.year >= 1990 && t.year <= 1999,
  "80s Halloween": (t) => t.year >= 1980 && t.year <= 1989,
  "Campy Halloween": (t) =>
    hasUserTag(t, "Campy Halloween", "Retro Halloween") ||
    (t.genres.includes("Comedy") && t.halloweenScore >= 78),
  "Dark Fantasy": (t) => hasUserTag(t, "Dark Fantasy", "Wizard") || hasCat(t, "Witch Movies"),
};

export interface OracleResult {
  title: VaultTitle;
  reason: string;
}

/** True only for titles that exist in the index and carry displayable metadata. */
export function verifyTitle(t: VaultTitle | undefined): t is VaultTitle {
  return Boolean(
    t &&
      titleIndex.has(t.id) &&
      t.title?.trim() &&
      t.description?.trim() &&
      t.art &&
      t.year > 1900 &&
      t.genres.length > 0,
  );
}

const titleIndex = new Map(titles.map((t) => [t.id, t]));
export const getTitle = (id: string) => titleIndex.get(id);

/** Casts the spell: a validated, weighted random pick with an explanation. */
export function consultOracle(mood: OracleMood, exclude: string[] = []): OracleResult {
  const match = MOOD_MATCH[mood];
  const strict = titles.filter((t) => match(t) && verifyTitle(t) && !exclude.includes(t.id));
  const source = strict.length ? strict : titles.filter(verifyTitle);

  // Seasonal-relevance weighted draw with a variety floor, so hidden gems and
  // deep-catalog episodes still surface instead of the same ten classics.
  const weights = source.map((t) => 0.6 + Math.pow(scoresOf(t).overall / 100, 1.6) * 6);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  let index = Math.floor(Math.random() * source.length);
  for (let i = 0; i < source.length; i++) {
    roll -= weights[i]!;
    if (roll <= 0) {
      index = i;
      break;
    }
  }
  const title = source[index]!;
  const tags = [...getTags(title), ...(title.userTags ?? [])].slice(0, 3).join(" · ");
  const s = scoresOf(title);
  const where = title.kind === "episode" ? `${title.show} · S${title.season}E${title.episode}` : `${title.year}`;
  return {
    title,
    reason: `${mood}: seasonal relevance ${s.overall}/100 (Halloween ${s.halloween}, Fall ${s.fall}). ${where} · ${title.runtime} · ${title.streaming.join(", ") || "Vault archive"}. Tags: ${tags || "Halloween"}.`,
  };
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

const by = (...cats: string[]) =>
  rankSeasonal(titles.filter((t) => t.categories.some((c) => cats.includes(c)))).slice(0, 24);

const byKind = (kind: VaultKind, ...cats: string[]) =>
  rankSeasonal(
    titles.filter(
      (t) => t.kind === kind && (cats.length === 0 || t.categories.some((c) => cats.includes(c))),
    ),
  ).slice(0, 24);

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
      {
        id: "anthology",
        label: "Anthology Episodes",
        blurb: "One story, one night, no survivors guaranteed.",
        items: by("Anthology Episodes"),
      },
      {
        id: "school-episodes",
        label: "School & Family Halloween Episodes",
        blurb: "Costume parades, assemblies and the fall dance.",
        items: byKind("episode", "Family Halloween", "Sitcom Halloween Episodes"),
      },
      {
        id: "harvest-episodes",
        label: "Autumn & Harvest Episodes",
        blurb: "Hayrides, cider contests and the long table.",
        items: byKind("episode", "Harvest Themes", "Thanksgiving", "Cozy Autumn Movies"),
      },
    ],
  },
  {
    id: "specials",
    label: "Specials & Seasonal Events",
    rows: [
      {
        id: "events",
        label: "Annual Halloween Events",
        blurb: "Spooktaculars, live tours and pumpkin nights, year by year.",
        items: by("Seasonal Events"),
      },
      {
        id: "holiday-specials",
        label: "Holiday Specials",
        blurb: "Broadcast in the last week of October, every October.",
        items: by("Holiday Specials"),
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

export const decades = ["1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "Modern"];

export const featured = titles.find((t) => t.id === "hocus-pocus")!;

/** Deterministic daily pick so every October day has its own trio. */
export function dailyPicks(date = new Date()) {
  const day = date.getDate();
  const pick = (kind: VaultKind) => {
    const pool = titles.filter((t) => t.kind === kind);
    return pool[day % pool.length]!;
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

/* ------------------------------------------------------------------ *
 * The Halloween Calendar — a dedicated October experience.
 * All picks are deterministic per calendar day (no hydration drift) and
 * validated against the index before being surfaced.
 * ------------------------------------------------------------------ */

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

function dayHash(d: Date, salt: string) {
  const str = `${dayKey(d)}:${salt}`;
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

function pickFor(pool: VaultTitle[], d: Date, salt: string) {
  const valid = pool.filter(verifyTitle);
  if (!valid.length) return undefined;
  const ranked = rankSeasonal(valid).slice(0, Math.max(20, Math.floor(valid.length * 0.25)));
  return ranked[Math.floor(dayHash(d, salt) * ranked.length)]!;
}

export interface CalendarDay {
  date: Date;
  label: string;
  halloweenPick?: VaultTitle | undefined;
  fallPick?: VaultTitle | undefined;
  episodePick?: VaultTitle | undefined;
  collection: { label: string; blurb: string; items: VaultTitle[] };
  trivia: string;
}

const TRIVIA = [
  "Jack-o’-lanterns were originally carved from turnips — pumpkins were the New World upgrade.",
  "The word “Halloween” is a contraction of All Hallows’ Even, the night before All Saints’ Day.",
  "Black cats were once carried on ships for luck, not bad omens.",
  "Trick-or-treating as we know it was popularised in North America in the 1930s and 40s.",
  "Bobbing for apples began as a Roman harvest ritual honouring Pomona, goddess of orchards.",
  "The first feature-length stop-motion Halloween film crews often cite is a 76-minute labour of 109,440 frames.",
  "A “harvest moon” is simply the full moon closest to the autumn equinox.",
  "Scarecrows appear in farming records over 3,000 years old.",
  "Candy corn was originally called “chicken feed” when it launched in the 1880s.",
  "Sleepy Hollow’s Headless Horseman rides from a story published in 1820.",
  "Barmbrack, an Irish Halloween bread, hides charms that predict the eater’s year.",
  "Orange and black got their Halloween pairing from harvest gold and the dark of winter.",
  "The record for the heaviest pumpkin sits well over a tonne.",
  "Anthology horror TV boomed in the 1960s because each episode could reuse one standing set.",
  "Fog machines on classic sets used heated mineral oil long before dry ice became standard.",
];

const COLLECTION_ROTATION: { label: string; blurb: string; cats: string[] }[] = [
  { label: "Witching Hour", blurb: "Covens, hexes and herb gardens.", cats: ["Witch Movies"] },
  { label: "Haunted Estates", blurb: "Elegant houses with bad habits.", cats: ["Haunted Houses"] },
  { label: "Pumpkin Season", blurb: "Patches, carving and lantern light.", cats: ["Pumpkin Season"] },
  { label: "Cozy Autumn", blurb: "Cider, sweaters, amber light.", cats: ["Cozy Autumn Movies"] },
  { label: "Monster Night", blurb: "Creatures, labs and fog.", cats: ["Monster Movies"] },
  { label: "Sitcom October", blurb: "Twenty-two minutes of costume chaos.", cats: ["Sitcom Halloween Episodes"] },
  { label: "Animated October", blurb: "Cels, puppets and specials.", cats: ["Animated Specials", "Cartoon Specials"] },
  { label: "Harvest Table", blurb: "Barns, fairs and the long table.", cats: ["Harvest Themes", "Thanksgiving"] },
  { label: "Hidden Gems", blurb: "Under-seen, over-qualified.", cats: ["Hidden Gems"] },
  { label: "Anthology Night", blurb: "One story, one night.", cats: ["Anthology Episodes"] },
];

export function calendarDay(date = new Date()): CalendarDay {
  const movies = titles.filter((t) => t.kind !== "episode");
  const episodes = titles.filter((t) => t.kind === "episode");
  const cozy = titles.filter((t) => t.fallScore >= 78);

  const rotation =
    COLLECTION_ROTATION[Math.floor(dayHash(date, "collection") * COLLECTION_ROTATION.length)]!;
  const items = rankSeasonal(
    titles.filter((t) => t.categories.some((c) => rotation.cats.includes(c))),
  ).slice(0, 18);

  return {
    date,
    label: date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
    halloweenPick: pickFor(movies, date, "halloween"),
    fallPick: pickFor(cozy, date, "fall"),
    episodePick: pickFor(episodes, date, "episode"),
    collection: { label: rotation.label, blurb: rotation.blurb, items },
    trivia: TRIVIA[Math.floor(dayHash(date, "trivia") * TRIVIA.length)]!,
  };
}

/** The full October grid — every day of the month with its own pick. */
export function octoberGrid(year = new Date().getFullYear()) {
  return Array.from({ length: 31 }, (_, i) => {
    const d = new Date(year, 9, i + 1);
    return { day: i + 1, date: d, pick: pickFor(titles, d, "grid"), trivia: TRIVIA[Math.floor(dayHash(d, "trivia") * TRIVIA.length)]! };
  });
}

/** Library statistics used across the UI. */
export const libraryStats = () => ({
  total: titles.length,
  movies: titles.filter((t) => t.kind === "movie").length,
  episodes: titles.filter((t) => t.kind === "episode").length,
  specials: titles.filter((t) => t.kind === "special").length,
  shows: new Set(titles.filter((t) => t.show).map((t) => t.show)).size,
});

/** Similar / franchise-related titles for a given entry. */
export function relatedTitles(t: VaultTitle, limit = 12) {
  return relatedIds(titles, t, limit)
    .map((id) => titleIndex.get(id))
    .filter(verifyTitle)
    .slice(0, limit);
}
