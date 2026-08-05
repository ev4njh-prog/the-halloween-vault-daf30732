import artWitch from "@/assets/art-witch.jpg";
import artMansion from "@/assets/art-mansion.jpg";
import artAutumn from "@/assets/art-autumn.jpg";
import artCartoon from "@/assets/art-cartoon.jpg";

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
  titles.filter((t) => t.categories.some((c) => cats.includes(c)));

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
  const year = now.getMonth() > 9 || (now.getMonth() === 9 && now.getDate() > 31)
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
