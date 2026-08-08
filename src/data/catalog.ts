/**
 * THE HALLOWEEN VAULT — Procedural seasonal catalog
 * -------------------------------------------------
 * The curated library in `vault.ts` is the editorial core. This module expands
 * it into a catalog at platform scale: thousands of movies, TV episodes,
 * animated specials, anthology instalments and seasonal events, each generated
 * deterministically from a themed template model so that:
 *
 *   • every record has full metadata (plot, keywords, user tags, franchise,
 *     similar-title relationships, artwork candidates),
 *   • discovery never depends on the word "Halloween" being in the title,
 *   • the same catalog is produced on the server and the client (no hydration
 *     mismatch, no randomness at render time).
 *
 * When real providers (TMDB / IMDb / TV metadata) are switched on in
 * `sources.ts`, these records are replaced field-by-field by higher-confidence
 * data — the shape is identical.
 */

import artWitch from "@/assets/art-witch.jpg";
import artMansion from "@/assets/art-mansion.jpg";
import artAutumn from "@/assets/art-autumn.jpg";
import artCartoon from "@/assets/art-cartoon.jpg";
import type { VaultTitle } from "./vault";

/* ------------------------------------------------------------------ *
 * Deterministic pseudo-randomness
 * ------------------------------------------------------------------ */

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(arr: readonly T[], r: () => number) => arr[Math.floor(r() * arr.length)]!;
const pickN = <T>(arr: readonly T[], n: number, r: () => number) => {
  const out: T[] = [];
  const pool = [...arr];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]!);
  return out;
};
const between = (min: number, max: number, r: () => number) =>
  Math.round(min + r() * (max - min));

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const art = { witch: artWitch, mansion: artMansion, autumn: artAutumn, cartoon: artCartoon };
type ArtKey = keyof typeof art;

const decadeOf = (year: number) => (year >= 2010 ? "Modern" : `${Math.floor(year / 10) * 10}s`);

/* ------------------------------------------------------------------ *
 * Seasonal theme model — the heart of discovery depth
 * ------------------------------------------------------------------ */

interface Theme {
  id: string;
  /** Human label used in titles and collections. */
  label: string;
  artKey: ArtKey;
  h: [number, number];
  f: [number, number];
  keywords: string[];
  userTags: string[];
  categories: string[];
  titleForms: string[];
  plots: string[];
}

const THEMES: Theme[] = [
  {
    id: "costume-party",
    label: "Costume Party",
    artKey: "witch",
    h: [86, 98],
    f: [52, 70],
    keywords: ["costume", "costume party", "masquerade", "halloween party", "disguise", "mask"],
    userTags: ["Costume Party", "Halloween Party", "Teen Halloween"],
    categories: ["Sitcom Halloween Episodes", "Halloween Comedies", "Classic Halloween"],
    titleForms: [
      "The Costume Party",
      "Masks Off",
      "Best Costume Wins",
      "The Masquerade",
      "Come As You Fear",
      "Costume Contest",
    ],
    plots: [
      "Everyone turns up in the same costume on Halloween night, and the argument that follows outlasts the candy.",
      "A masquerade at the old town hall goes sideways when nobody will admit which guest wasn't invited.",
      "The annual costume contest is rigged, and the judge has been wearing a mask since October began.",
    ],
  },
  {
    id: "trick-or-treat",
    label: "Trick or Treat",
    artKey: "cartoon",
    h: [90, 100],
    f: [50, 68],
    keywords: ["trick or treat", "candy", "doorbell", "treats", "october 31", "halloween night"],
    userTags: ["Trick or Treat", "Candy", "Kids Halloween", "Family Halloween"],
    categories: ["Family Halloween", "Animated Specials", "Classic Halloween"],
    titleForms: [
      "Trick or Treat",
      "The Candy Route",
      "One More House",
      "The Last Doorbell",
      "Full-Size Candy Bars",
      "The Treat Map",
    ],
    plots: [
      "A carefully mapped trick-or-treat route falls apart three houses in, and the night gets much longer.",
      "The kids chase a rumour about the one house on the hill giving out full-size candy bars.",
      "A pillowcase of candy goes missing before midnight and the investigation takes the whole neighbourhood.",
    ],
  },
  {
    id: "haunted-house",
    label: "Haunted House",
    artKey: "mansion",
    h: [88, 99],
    f: [46, 62],
    keywords: ["haunted house", "manor", "mansion", "attic", "cellar", "haunting", "old house"],
    userTags: ["Haunted House", "Haunted Mansion", "Paranormal", "Ghost Story"],
    categories: ["Haunted Houses", "Horror", "Hidden Gems"],
    titleForms: [
      "The House on the Hill",
      "Room for One More",
      "The Attic Door",
      "Cellar Light",
      "The Groaning Stair",
      "Vacancy at the Manor",
    ],
    plots: [
      "A derelict Victorian on the edge of town is opened for one night, and the tour never quite ends.",
      "A family inherits a manor where the attic door is warm to the touch every October.",
      "Renovations at the old estate uncover a room that appears on no blueprint.",
    ],
  },
  {
    id: "ghost-story",
    label: "Ghost Story",
    artKey: "mansion",
    h: [84, 96],
    f: [48, 66],
    keywords: ["ghost", "spirit", "apparition", "seance", "phantom", "poltergeist"],
    userTags: ["Ghost Story", "Paranormal", "Ghost Tour", "Mystery Night"],
    categories: ["Horror", "Hidden Gems", "Haunted Houses"],
    titleForms: [
      "The Quiet Guest",
      "Seance at Eight",
      "Cold Spot",
      "The Long Hallway",
      "Someone Sat Down",
      "The Unfinished Letter",
    ],
    plots: [
      "A seance held as a joke produces a polite, patient answer that nobody in the room wants to claim.",
      "A cold spot follows one person around town for the last week of October.",
      "An old recording plays back one more voice than there were people in the room.",
    ],
  },
  {
    id: "witch",
    label: "Witchcraft",
    artKey: "witch",
    h: [86, 98],
    f: [58, 78],
    keywords: ["witch", "coven", "spell", "hex", "potion", "grimoire", "broom"],
    userTags: ["Witch", "Magic", "Dark Fantasy", "Magical Autumn"],
    categories: ["Witch Movies", "Classic Halloween", "Family Halloween"],
    titleForms: [
      "The Coven Next Door",
      "A Small Hex",
      "The Borrowed Spell",
      "Herbs and Consequences",
      "The Third Sister",
      "Brew Night",
    ],
    plots: [
      "A borrowed spellbook turns a quiet October week into a very loud one for an unprepared coven.",
      "Three sisters reopen the family herb shop and discover the recipes still work far too well.",
      "A hex meant for one house drifts down the whole street on the last wind of October.",
    ],
  },
  {
    id: "pumpkin-patch",
    label: "Pumpkin Patch",
    artKey: "autumn",
    h: [72, 90],
    f: [80, 96],
    keywords: ["pumpkin", "pumpkin patch", "jack-o-lantern", "gourd", "carve", "lantern"],
    userTags: ["Pumpkin", "Pumpkin Patch", "Harvest", "Cozy Fall"],
    categories: ["Pumpkin Season", "Family Halloween", "Cozy Autumn Movies"],
    titleForms: [
      "The Great Pumpkin Patch",
      "Carving Night",
      "Lantern Season",
      "The Prize Gourd",
      "Pick of the Patch",
      "One Hundred Lanterns",
    ],
    plots: [
      "The town's carving competition returns, and this year one of the lanterns keeps relighting itself.",
      "A family farm races to sell its last pumpkins before the first frost of the season.",
      "A patch grown from unlabeled seeds produces gourds that nobody can identify.",
    ],
  },
  {
    id: "harvest-festival",
    label: "Harvest Festival",
    artKey: "autumn",
    h: [52, 74],
    f: [88, 99],
    keywords: ["harvest", "festival", "fair", "hayride", "barn", "cider", "orchard"],
    userTags: ["Harvest Festival", "Autumn Festival", "Cozy Fall", "Harvest Moon"],
    categories: ["Harvest Themes", "Cozy Autumn Movies", "Thanksgiving"],
    titleForms: [
      "The Harvest Fair",
      "Cider and Consequences",
      "Blue Ribbon Season",
      "The Last Hayride",
      "Barn Dance",
      "Under the Harvest Moon",
    ],
    plots: [
      "The autumn fair returns to a town that has quietly forgotten why it started celebrating.",
      "A cider contest becomes a decades-old rivalry played out over apples and pride.",
      "The final hayride of the season takes a route the driver swears he has never taken before.",
    ],
  },
  {
    id: "corn-maze",
    label: "Corn Maze",
    artKey: "autumn",
    h: [70, 88],
    f: [78, 94],
    keywords: ["corn maze", "cornfield", "maize", "scarecrow", "farm"],
    userTags: ["Corn Maze", "Scarecrow", "Fall Adventure", "Folk Horror"],
    categories: ["Harvest Themes", "Horror", "Hidden Gems"],
    titleForms: [
      "The Corn Maze",
      "Row Nine",
      "Straw Man",
      "The Field After Dark",
      "No Exit at the Farm",
      "The Scarecrow Moved",
    ],
    plots: [
      "The maze is cut differently this year, and the exit is no longer where the map says it is.",
      "A scarecrow at the centre of the field is wearing a jacket that went missing last October.",
      "Two friends walk into the corn at dusk and come out arguing about how long they were gone.",
    ],
  },
  {
    id: "monster",
    label: "Monsters",
    artKey: "cartoon",
    h: [82, 96],
    f: [44, 62],
    keywords: ["monster", "creature", "beast", "mummy", "frankenstein", "goblin", "laboratory"],
    userTags: ["Monster", "Creature", "Retro Halloween", "Campy Halloween"],
    categories: ["Monster Movies", "Animated Specials", "Halloween Comedies"],
    titleForms: [
      "The Monster Next Door",
      "Creature Comforts",
      "It Came Up the Drive",
      "The Lab Downstairs",
      "Something in the Fog",
      "Meet the Monsters",
    ],
    plots: [
      "A misunderstood creature moves into the neighbourhood and immediately joins the block committee.",
      "An experiment escapes the basement lab the same week the town holds its costume parade.",
      "A monster movie marathon at the drive-in attracts an audience member who isn't in costume.",
    ],
  },
  {
    id: "vampire",
    label: "Vampires",
    artKey: "mansion",
    h: [84, 96],
    f: [42, 60],
    keywords: ["vampire", "fangs", "coffin", "crypt", "bloodsucker", "midnight"],
    userTags: ["Vampire", "Gothic", "Dark Fantasy", "Classic Halloween"],
    categories: ["Monster Movies", "Horror", "Classic Halloween"],
    titleForms: [
      "The Midnight Tenant",
      "Fangs and Manners",
      "Invitation Only",
      "The Coffin Delivery",
      "Nightshade Manor",
      "One Bite Rule",
    ],
    plots: [
      "A polite new tenant only views the apartment after sunset and never accepts a dinner invitation.",
      "A crate arrives at the docks addressed to a house that has been empty for ninety years.",
      "A vampire tries, and fails, to keep a low profile during the busiest week of October.",
    ],
  },
  {
    id: "werewolf",
    label: "Werewolves",
    artKey: "cartoon",
    h: [82, 95],
    f: [56, 74],
    keywords: ["werewolf", "full moon", "howl", "lycan", "moonlight", "woods"],
    userTags: ["Werewolf", "Full Moon", "Moonlight", "Fall Adventure"],
    categories: ["Monster Movies", "Horror", "Hidden Gems"],
    titleForms: [
      "Under a Full Moon",
      "The Howling Field",
      "Moonrise at the Treeline",
      "Fur and Feathers",
      "The Long Howl",
      "Three Nights a Month",
    ],
    plots: [
      "The October full moon lands on Halloween, and one family has planned their whole month around it.",
      "Something large crosses the road outside town every night the moon is bright.",
      "A hiker returns from the woods with a story and a torn jacket nobody believes.",
    ],
  },
  {
    id: "zombie",
    label: "Undead",
    artKey: "mansion",
    h: [80, 94],
    f: [40, 58],
    keywords: ["zombie", "undead", "graveyard", "cemetery", "grave", "risen"],
    userTags: ["Zombie", "Cemetery", "Campy Halloween", "Retro Halloween"],
    categories: ["Horror", "Halloween Comedies", "Monster Movies"],
    titleForms: [
      "The Cemetery Shift",
      "Late to the Grave",
      "Everyone Came Back",
      "Plot Twelve",
      "The Groundskeeper",
      "Six Feet, Give or Take",
    ],
    plots: [
      "The night groundskeeper at the town cemetery notices the headcount is off by one, then two.",
      "A graveyard tour books out for Halloween and the guide begins recognising the guests.",
      "The dead of a small town return, mostly polite, mostly hungry, entirely inconvenient.",
    ],
  },
  {
    id: "school-halloween",
    label: "School Halloween",
    artKey: "cartoon",
    h: [78, 92],
    f: [58, 74],
    keywords: ["school", "class", "teacher", "students", "assembly", "costume parade", "kids"],
    userTags: ["School Halloween Event", "Kids Halloween", "Teen Halloween", "Family Halloween"],
    categories: ["Family Halloween", "Sitcom Halloween Episodes", "Animated Specials"],
    titleForms: [
      "The Costume Parade",
      "Room 12 Goes Spooky",
      "The Halloween Assembly",
      "Class Project: Ghosts",
      "Hall Pass to the Haunted Wing",
      "The Fall Dance",
    ],
    plots: [
      "The school costume parade is threatened by a rule nobody remembers voting on.",
      "A class project about local ghost stories turns up a name still on the school register.",
      "The autumn dance committee has one week, no budget and a gym full of hay bales.",
    ],
  },
  {
    id: "small-town",
    label: "Spooky Town",
    artKey: "autumn",
    h: [80, 95],
    f: [78, 94],
    keywords: ["small town", "town square", "neighborhood", "village", "main street", "fog"],
    userTags: ["Small Town Halloween", "Spooky Town", "Fog", "October Night"],
    categories: ["Classic Halloween", "Cozy Autumn Movies", "Hidden Gems"],
    titleForms: [
      "Main Street After Dark",
      "The Town That Waits",
      "Fog on the Square",
      "Population: October",
      "The Long Way Home",
      "Every Porch Light On",
    ],
    plots: [
      "A town where the fog arrives on the first of October and lifts on the first of November.",
      "The whole village decorates for one night and nobody will say who started the tradition.",
      "A newcomer notices every porch light on Main Street goes out at exactly the same minute.",
    ],
  },
  {
    id: "cozy-fall",
    label: "Cozy Autumn",
    artKey: "autumn",
    h: [26, 52],
    f: [88, 100],
    keywords: ["cozy", "cider", "sweater", "bakery", "inn", "pie", "leaves", "fireplace"],
    userTags: ["Cozy Fall", "Magical Autumn", "Fall Road Trip", "Autumn"],
    categories: ["Cozy Autumn Movies", "Fall Romance", "Thanksgiving"],
    titleForms: [
      "The Cider House Year",
      "Leaves Enough for Two",
      "Sweater Weather",
      "The Bakery on Elm",
      "Autumn, Slowly",
      "The Inn at Amber Road",
    ],
    plots: [
      "Two people keep meeting at the same orchard, one weekend at a time, from September to November.",
      "A failing bakery bets its last season on a pie recipe found behind a loose brick.",
      "A road trip through leaf country turns into a long, quiet reckoning and a very good playlist.",
    ],
  },
  {
    id: "campfire",
    label: "Campfire Tales",
    artKey: "autumn",
    h: [74, 90],
    f: [72, 90],
    keywords: ["campfire", "woods", "story", "lantern", "tent", "legend"],
    userTags: ["Campfire", "Mystery Night", "Fall Adventure", "Folk Horror"],
    categories: ["Hidden Gems", "Horror", "Harvest Themes"],
    titleForms: [
      "Around the Fire",
      "One More Story",
      "The Light in the Trees",
      "Tell It Again",
      "Embers",
      "The Story That Followed Us Back",
    ],
    plots: [
      "Four friends trade ghost stories in the woods until one of them tells a story the others recognise.",
      "A camping trip in late October ends with a lantern nobody packed.",
      "Every story told at the fire that night turns out to have happened within a mile of it.",
    ],
  },
  {
    id: "urban-legend",
    label: "Urban Legend",
    artKey: "mansion",
    h: [80, 94],
    f: [50, 68],
    keywords: ["legend", "rumor", "curse", "omen", "myth", "folk", "ritual"],
    userTags: ["Mystery Night", "Folk Horror", "Paranormal", "Dark Fantasy"],
    categories: ["Horror", "Hidden Gems", "Classic Halloween"],
    titleForms: [
      "They Say at Midnight",
      "The Rule of Three Knocks",
      "Local Legend",
      "Don't Say It Twice",
      "The Mirror Game",
      "What the Old Map Shows",
    ],
    plots: [
      "A local legend is tested by people who are certain it's nonsense, right up until it isn't.",
      "The rules of an old children's game turn out to have been written down for a reason.",
      "A podcast investigating a small-town curse runs out of sceptical explanations.",
    ],
  },
  {
    id: "thanksgiving",
    label: "Harvest Table",
    artKey: "autumn",
    h: [18, 40],
    f: [86, 99],
    keywords: ["thanksgiving", "feast", "family dinner", "harvest", "november", "gravy"],
    userTags: ["Harvest", "Cozy Fall", "Family", "Autumn"],
    categories: ["Thanksgiving", "Harvest Themes", "Cozy Autumn Movies"],
    titleForms: [
      "The Long Table",
      "Everyone Comes Home",
      "The Gravy Incident",
      "Second Helping",
      "November, Together",
      "The Last Guest to Arrive",
    ],
    plots: [
      "The whole family returns for the harvest dinner, and so does an argument from four years ago.",
      "A first attempt at hosting the November feast goes wrong in every possible order.",
      "A table set for twelve has thirteen chairs, and nobody will admit to adding one.",
    ],
  },
  {
    id: "black-cat",
    label: "Black Cats & Omens",
    artKey: "witch",
    h: [76, 92],
    f: [58, 76],
    keywords: ["black cat", "familiar", "omen", "superstition", "luck", "crow"],
    userTags: ["Black Cat", "Magic", "Retro Halloween", "Mystery Night"],
    categories: ["Witch Movies", "Halloween Comedies", "Hidden Gems"],
    titleForms: [
      "The Familiar",
      "Nine Lives, Two Left",
      "Bad Luck, Good Company",
      "The Cat on the Porch",
      "Crows on the Wire",
      "Sign and Omen",
    ],
    plots: [
      "A stray black cat adopts a household in early October and starts running the place by the 31st.",
      "Every superstition in a small town comes true, one gentle inconvenience at a time.",
      "A familiar goes looking for a new witch and picks the least suitable candidate available.",
    ],
  },
  {
    id: "dark-fantasy",
    label: "Dark Fantasy",
    artKey: "witch",
    h: [78, 94],
    f: [64, 84],
    keywords: ["portal", "enchant", "kingdom", "sorcer", "prophecy", "realm", "wizard"],
    userTags: ["Dark Fantasy", "Magic", "Wizard", "Magical Autumn"],
    categories: ["Witch Movies", "Family Halloween", "Hidden Gems"],
    titleForms: [
      "The Autumn Gate",
      "The Wizard of Amber Hollow",
      "Doorway in the Orchard",
      "The Kingdom Under October",
      "The Last Enchantment",
      "Where the Leaves Go",
    ],
    plots: [
      "A door in the orchard opens once a year onto a kingdom where autumn never ends.",
      "An apprentice wizard is handed the seasonal spellwork and immediately drops it.",
      "A prophecy tied to the harvest moon comes due, decades late and badly worded.",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * TV shows — sitcoms, cartoons, anthologies, family and drama series
 * ------------------------------------------------------------------ */

interface ShowSeed {
  name: string;
  format: "sitcom" | "cartoon" | "anthology" | "family" | "drama" | "reality";
  genres: string[];
  start: number;
  seasons: number;
  streaming: string[];
  runtime: string;
  themes: string[];
}

const SHOWS: ShowSeed[] = [
  { name: "Maple Street", format: "sitcom", genres: ["Comedy"], start: 1988, seasons: 9, streaming: ["Hulu"], runtime: "22m", themes: ["costume-party", "trick-or-treat", "school-halloween"] },
  { name: "The Corner Office", format: "sitcom", genres: ["Comedy"], start: 2004, seasons: 8, streaming: ["Peacock"], runtime: "21m", themes: ["costume-party", "monster", "urban-legend"] },
  { name: "Hollow Creek High", format: "family", genres: ["Family", "Comedy"], start: 1996, seasons: 6, streaming: ["Disney+"], runtime: "24m", themes: ["school-halloween", "costume-party", "ghost-story"] },
  { name: "Bramble & Bone", format: "cartoon", genres: ["Animation", "Family"], start: 2011, seasons: 7, streaming: ["Max"], runtime: "11m", themes: ["monster", "pumpkin-patch", "witch"] },
  { name: "The Midnight Files", format: "drama", genres: ["Mystery", "Drama"], start: 1994, seasons: 9, streaming: ["Hulu"], runtime: "44m", themes: ["ghost-story", "urban-legend", "haunted-house"] },
  { name: "Thistle & Thorn", format: "family", genres: ["Fantasy", "Comedy"], start: 2018, seasons: 5, streaming: ["Prime Video"], runtime: "38m", themes: ["witch", "dark-fantasy", "black-cat"] },
  { name: "Sunday at the Harrows", format: "drama", genres: ["Drama"], start: 2009, seasons: 6, streaming: ["Netflix"], runtime: "51m", themes: ["thanksgiving", "harvest-festival", "cozy-fall"] },
  { name: "Pumpkin Hollow", format: "family", genres: ["Family", "Fantasy"], start: 2015, seasons: 5, streaming: ["Disney+"], runtime: "26m", themes: ["pumpkin-patch", "small-town", "trick-or-treat"] },
  { name: "Tales After Dark", format: "anthology", genres: ["Horror", "Anthology"], start: 1986, seasons: 8, streaming: ["Shudder"], runtime: "30m", themes: ["urban-legend", "ghost-story", "campfire"] },
  { name: "The Late Rounds", format: "drama", genres: ["Drama", "Mystery"], start: 2012, seasons: 6, streaming: ["Hulu"], runtime: "43m", themes: ["haunted-house", "zombie", "ghost-story"] },
  { name: "Crumb & Custard", format: "cartoon", genres: ["Animation", "Comedy"], start: 1999, seasons: 8, streaming: ["Max"], runtime: "11m", themes: ["trick-or-treat", "monster", "black-cat"] },
  { name: "Amber Road", format: "drama", genres: ["Romance", "Drama"], start: 2017, seasons: 4, streaming: ["Netflix"], runtime: "47m", themes: ["cozy-fall", "harvest-festival", "thanksgiving"] },
  { name: "Grim & Tidy", format: "sitcom", genres: ["Comedy", "Fantasy"], start: 2013, seasons: 6, streaming: ["Peacock"], runtime: "23m", themes: ["vampire", "monster", "costume-party"] },
  { name: "The Coven Club", format: "family", genres: ["Fantasy", "Family"], start: 2007, seasons: 7, streaming: ["Disney+"], runtime: "25m", themes: ["witch", "school-halloween", "dark-fantasy"] },
  { name: "Northfield", format: "drama", genres: ["Drama", "Mystery"], start: 1991, seasons: 7, streaming: ["Max"], runtime: "45m", themes: ["small-town", "urban-legend", "corn-maze"] },
  { name: "Boo Crew", format: "cartoon", genres: ["Animation", "Family"], start: 2016, seasons: 6, streaming: ["Netflix"], runtime: "12m", themes: ["ghost-story", "trick-or-treat", "school-halloween"] },
  { name: "The Orchard Line", format: "reality", genres: ["Reality", "Documentary"], start: 2014, seasons: 8, streaming: ["Prime Video"], runtime: "42m", themes: ["harvest-festival", "pumpkin-patch", "corn-maze"] },
  { name: "Wick & Hollow", format: "drama", genres: ["Fantasy", "Drama"], start: 2020, seasons: 4, streaming: ["Max"], runtime: "52m", themes: ["dark-fantasy", "witch", "small-town"] },
  { name: "Two Doors Down", format: "sitcom", genres: ["Comedy"], start: 2001, seasons: 9, streaming: ["Hulu"], runtime: "22m", themes: ["costume-party", "trick-or-treat", "black-cat"] },
  { name: "Cider & Sons", format: "sitcom", genres: ["Comedy", "Family"], start: 2010, seasons: 7, streaming: ["Peacock"], runtime: "22m", themes: ["harvest-festival", "cozy-fall", "thanksgiving"] },
  { name: "The Nightwatch", format: "drama", genres: ["Horror", "Drama"], start: 2019, seasons: 4, streaming: ["Shudder"], runtime: "48m", themes: ["zombie", "haunted-house", "ghost-story"] },
  { name: "Moonrise Ridge", format: "drama", genres: ["Fantasy", "Drama"], start: 2008, seasons: 6, streaming: ["Netflix"], runtime: "44m", themes: ["werewolf", "campfire", "small-town"] },
  { name: "Little Lanterns", format: "cartoon", genres: ["Animation", "Family"], start: 2021, seasons: 4, streaming: ["Disney+"], runtime: "9m", themes: ["pumpkin-patch", "trick-or-treat", "cozy-fall"] },
  { name: "The Sleepless Hour", format: "anthology", genres: ["Horror", "Anthology"], start: 1972, seasons: 7, streaming: ["Shudder"], runtime: "50m", themes: ["ghost-story", "urban-legend", "vampire"] },
  { name: "Harvest High", format: "family", genres: ["Family", "Drama"], start: 2005, seasons: 6, streaming: ["Prime Video"], runtime: "42m", themes: ["school-halloween", "harvest-festival", "corn-maze"] },
  { name: "Bats in the Belfry", format: "cartoon", genres: ["Animation", "Comedy"], start: 1993, seasons: 7, streaming: ["Max"], runtime: "11m", themes: ["monster", "vampire", "costume-party"] },
  { name: "The Quiet Precinct", format: "drama", genres: ["Crime", "Mystery"], start: 2000, seasons: 8, streaming: ["Hulu"], runtime: "43m", themes: ["urban-legend", "small-town", "ghost-story"] },
  { name: "Bramblewood Inn", format: "drama", genres: ["Romance", "Drama"], start: 2016, seasons: 5, streaming: ["Netflix"], runtime: "45m", themes: ["cozy-fall", "thanksgiving", "harvest-festival"] },
  { name: "Skele-Crew Sports", format: "cartoon", genres: ["Animation", "Comedy"], start: 2018, seasons: 4, streaming: ["Peacock"], runtime: "12m", themes: ["monster", "school-halloween", "costume-party"] },
  { name: "The Hollow Hour", format: "anthology", genres: ["Horror", "Anthology"], start: 2003, seasons: 6, streaming: ["Shudder"], runtime: "40m", themes: ["haunted-house", "corn-maze", "urban-legend"] },
  { name: "Fern & Fable", format: "family", genres: ["Fantasy", "Family"], start: 2012, seasons: 6, streaming: ["Disney+"], runtime: "28m", themes: ["dark-fantasy", "witch", "black-cat"] },
  { name: "Roommates & Revenants", format: "sitcom", genres: ["Comedy", "Fantasy"], start: 2015, seasons: 5, streaming: ["Hulu"], runtime: "24m", themes: ["ghost-story", "costume-party", "monster"] },
  { name: "Cranberry Lane", format: "family", genres: ["Family", "Comedy"], start: 1997, seasons: 8, streaming: ["Prime Video"], runtime: "23m", themes: ["trick-or-treat", "thanksgiving", "small-town"] },
  { name: "The Long Road North", format: "drama", genres: ["Drama", "Adventure"], start: 2011, seasons: 5, streaming: ["Netflix"], runtime: "49m", themes: ["cozy-fall", "campfire", "werewolf"] },
  { name: "Graveyard Shift Radio", format: "drama", genres: ["Mystery", "Drama"], start: 2006, seasons: 6, streaming: ["Max"], runtime: "41m", themes: ["zombie", "ghost-story", "urban-legend"] },
  { name: "The Sweet Shop", format: "sitcom", genres: ["Comedy", "Family"], start: 2019, seasons: 4, streaming: ["Peacock"], runtime: "21m", themes: ["trick-or-treat", "costume-party", "pumpkin-patch"] },
  { name: "Wolves of Wexler", format: "drama", genres: ["Horror", "Drama"], start: 2013, seasons: 5, streaming: ["Shudder"], runtime: "47m", themes: ["werewolf", "small-town", "campfire"] },
  { name: "Ghostly Business", format: "sitcom", genres: ["Comedy", "Fantasy"], start: 2009, seasons: 6, streaming: ["Hulu"], runtime: "22m", themes: ["ghost-story", "haunted-house", "black-cat"] },
  { name: "Mrs. Pennywhistle's Class", format: "cartoon", genres: ["Animation", "Family"], start: 1990, seasons: 8, streaming: ["Max"], runtime: "11m", themes: ["school-halloween", "trick-or-treat", "monster"] },
  { name: "The Old Estate", format: "drama", genres: ["Mystery", "Drama"], start: 2021, seasons: 3, streaming: ["Netflix"], runtime: "53m", themes: ["haunted-house", "ghost-story", "dark-fantasy"] },
  { name: "Pie Contest", format: "reality", genres: ["Reality"], start: 2015, seasons: 8, streaming: ["Prime Video"], runtime: "40m", themes: ["thanksgiving", "cozy-fall", "harvest-festival"] },
  { name: "Trick Street", format: "cartoon", genres: ["Animation", "Comedy"], start: 2007, seasons: 7, streaming: ["Peacock"], runtime: "11m", themes: ["trick-or-treat", "monster", "costume-party"] },
  { name: "Hallow Falls", format: "drama", genres: ["Fantasy", "Mystery"], start: 2017, seasons: 5, streaming: ["Max"], runtime: "46m", themes: ["small-town", "witch", "urban-legend"] },
  { name: "The Undertakers' Guild", format: "drama", genres: ["Drama", "Comedy"], start: 2002, seasons: 6, streaming: ["Shudder"], runtime: "44m", themes: ["zombie", "haunted-house", "black-cat"] },
  { name: "Autumn Kitchen", format: "reality", genres: ["Reality", "Documentary"], start: 2013, seasons: 7, streaming: ["Netflix"], runtime: "38m", themes: ["cozy-fall", "thanksgiving", "harvest-festival"] },
  { name: "Monster Mailroom", format: "cartoon", genres: ["Animation", "Comedy"], start: 2020, seasons: 4, streaming: ["Disney+"], runtime: "12m", themes: ["monster", "vampire", "school-halloween"] },
  { name: "The Second Sister", format: "drama", genres: ["Fantasy", "Drama"], start: 2010, seasons: 6, streaming: ["Prime Video"], runtime: "50m", themes: ["witch", "dark-fantasy", "ghost-story"] },
  { name: "Bus Route 31", format: "sitcom", genres: ["Comedy"], start: 1998, seasons: 7, streaming: ["Hulu"], runtime: "22m", themes: ["trick-or-treat", "school-halloween", "urban-legend"] },
  { name: "The Lantern Society", format: "family", genres: ["Family", "Mystery"], start: 2019, seasons: 4, streaming: ["Disney+"], runtime: "34m", themes: ["pumpkin-patch", "ghost-story", "small-town"] },
  { name: "Hay Bale Country", format: "reality", genres: ["Reality"], start: 2016, seasons: 6, streaming: ["Peacock"], runtime: "39m", themes: ["corn-maze", "harvest-festival", "pumpkin-patch"] },
];

const EP_SUFFIX = [
  "",
  ", Part One",
  ", Part Two",
  " Returns",
  " Again",
  " Night",
  ": The Reckoning",
  " Revisited",
];

function makeEpisodes(): VaultTitle[] {
  const out: VaultTitle[] = [];
  const themeById = new Map(THEMES.map((t) => [t.id, t]));

  for (const show of SHOWS) {
    const showSlug = slug(show.name);
    for (let season = 1; season <= show.seasons; season++) {
      const r = rng(`${showSlug}-s${season}`);
      const count = between(2, 4, r);
      for (let i = 0; i < count; i++) {
        const theme = themeById.get(pick(show.themes, r))!;
        const er = rng(`${showSlug}-s${season}-e${i}`);
        const base = pick(theme.titleForms, er);
        const title = `${base}${pick(EP_SUFFIX, er)}`;
        const year = show.start + season - 1;
        const episodeNo = between(2, 22, er);
        const id = `${showSlug}-s${season}-e${episodeNo}-${slug(base)}`;
        if (out.some((t) => t.id === id)) continue;

        const isAnimated = show.format === "cartoon";
        const categories = [...theme.categories];
        if (show.format === "sitcom") categories.push("Sitcom Halloween Episodes");
        if (isAnimated) categories.push("Cartoon Specials", "Animated Specials");
        if (show.format === "anthology") categories.push("Anthology Episodes");
        if (show.format === "family") categories.push("Family Halloween");

        out.push({
          id,
          kind: "episode",
          title,
          show: show.name,
          season,
          episode: episodeNo,
          year,
          runtime: show.runtime,
          genres: [...new Set([...show.genres, ...(isAnimated ? ["Animation"] : [])])],
          description: `${pick(theme.plots, er)} A ${theme.label.toLowerCase()} instalment of ${show.name}, season ${season}.`,
          cast: [],
          halloweenScore: between(theme.h[0], theme.h[1], er),
          fallScore: between(theme.f[0], theme.f[1], er),
          streaming: show.streaming,
          watchUrl: `https://dulo.gd/watch/${id}`,
          art: art[theme.artKey],
          categories: [...new Set(categories)],
          decade: decadeOf(year),
          keywords: theme.keywords,
          userTags: theme.userTags,
          franchise: show.name,
          network: show.streaming[0]!,
          themeId: theme.id,
        });
      }
    }
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Movies, specials and seasonal events
 * ------------------------------------------------------------------ */

const MOVIE_PREFIX = [
  "The",
  "Return to",
  "Night of",
  "Tales of",
  "Beneath",
  "The Last",
  "A Season of",
  "Welcome to",
];
const MOVIE_PLACE = [
  "Amber Hollow",
  "Ravenglass",
  "Thornwood",
  "Marrow Hill",
  "Pumpkin Bend",
  "Ashgrove",
  "Widow's Orchard",
  "Cinder Lane",
  "Mistfall",
  "Harrow Point",
  "Blackbriar",
  "Elderberry Creek",
  "Gallows Field",
  "Hallow Green",
  "Wren Hollow",
  "Copper Valley",
  "Nightshade Row",
  "Larkspur Farm",
  "Grimsby Landing",
  "Sable Ridge",
];
const MOVIE_NOUN = [
  "Lanterns",
  "Ghosts",
  "Witches",
  "the Harvest",
  "the Long Night",
  "the Hollow",
  "the Coven",
  "the Orchard",
  "the Scarecrow",
  "the Manor",
  "the Autumn Fair",
  "the Black Cat",
  "the Moon",
  "the Cellar",
  "the Corn",
];
const DIRECTORS = [
  "Marguerite Vane",
  "Isadore Quill",
  "Tobias Rooke",
  "Nell Harrow",
  "Casimir Bell",
  "Odile Frost",
  "Rhys Marlowe",
  "Ingrid Sable",
  "August Crane",
  "Perpetua Finch",
];
const ACTORS = [
  "Marlowe Fenn",
  "Delphine Ashe",
  "Roman Vasquez",
  "Ida Sallow",
  "Beatrix Crowe",
  "Emmett Thorne",
  "Juno Delacroix",
  "Silas Rook",
  "Priya Halloran",
  "Otto Grange",
  "Wren Castellan",
  "Nadia Beaumont",
  "Callum Frost",
  "Esme Ravensworth",
];
const STREAMERS = ["Netflix", "Disney+", "Max", "Hulu", "Prime Video", "Peacock", "Shudder", "Paramount+", "Apple TV+"];

function makeMovies(): VaultTitle[] {
  const out: VaultTitle[] = [];
  const seen = new Set<string>();

  for (const theme of THEMES) {
    for (let i = 0; i < 34; i++) {
      const r = rng(`movie-${theme.id}-${i}`);
      const shape = Math.floor(r() * 3);
      const name =
        shape === 0
          ? `${pick(MOVIE_PREFIX, r)} ${pick(MOVIE_PLACE, r)}`
          : shape === 1
            ? `${pick(MOVIE_PREFIX, r)} ${pick(MOVIE_NOUN, r)}`
            : `${pick(MOVIE_PLACE, r)}: ${pick(MOVIE_NOUN, r)}`;
      const sequel = i > 20 && r() > 0.55 ? ` ${["II", "III", "Reborn", "Revisited"][i % 4]}` : "";
      const title = `${name}${sequel}`;
      const id = slug(`${title}-${theme.id}-${i}`);
      if (seen.has(id)) continue;
      seen.add(id);

      const year = between(1958, 2025, r);
      const isAnimated = theme.artKey === "cartoon" && r() > 0.55;
      const genrePool = isAnimated
        ? ["Animation", "Family", "Fantasy"]
        : theme.h[1] > 90
          ? ["Horror", "Mystery", "Fantasy", "Thriller"]
          : ["Drama", "Romance", "Comedy", "Family", "Fantasy"];

      out.push({
        id,
        kind: r() > 0.86 ? "special" : "movie",
        title,
        year,
        runtime: `${between(1, 2, r)}h ${between(2, 58, r)}m`,
        genres: pickN(genrePool, 2, r),
        description: `${pick(theme.plots, r)} Set across one ${theme.label.toLowerCase()} season in ${pick(MOVIE_PLACE, r)}.`,
        cast: pickN(ACTORS, 3, r),
        director: pick(DIRECTORS, r),
        halloweenScore: between(theme.h[0], theme.h[1], r),
        fallScore: between(theme.f[0], theme.f[1], r),
        streaming: pickN(STREAMERS, between(1, 3, r), r),
        watchUrl: `https://dulo.gd/watch/${id}`,
        art: art[theme.artKey],
        categories: [...new Set([...theme.categories, ...(isAnimated ? ["Animated Specials"] : [])])],
        decade: decadeOf(year),
        keywords: theme.keywords,
        userTags: theme.userTags,
        franchise: sequel ? name : undefined,
        themeId: theme.id,
      });
    }
  }
  return out;
}

function makeSpecials(): VaultTitle[] {
  const out: VaultTitle[] = [];
  const EVENTS = [
    { label: "Halloween Spooktacular", theme: "costume-party" },
    { label: "Great Pumpkin Night", theme: "pumpkin-patch" },
    { label: "Harvest Moon Concert", theme: "harvest-festival" },
    { label: "Monster Mash Special", theme: "monster" },
    { label: "Ghost Tour Live", theme: "ghost-story" },
    { label: "Witching Hour Special", theme: "witch" },
    { label: "Corn Maze Challenge", theme: "corn-maze" },
    { label: "Trick-or-Treat Countdown", theme: "trick-or-treat" },
    { label: "Autumn Table Special", theme: "thanksgiving" },
    { label: "Campfire Stories Live", theme: "campfire" },
  ];
  const themeById = new Map(THEMES.map((t) => [t.id, t]));

  for (const ev of EVENTS) {
    for (let year = 1998; year <= 2025; year++) {
      const r = rng(`${ev.label}-${year}`);
      const theme = themeById.get(ev.theme)!;
      const id = slug(`${ev.label}-${year}`);
      out.push({
        id,
        kind: "special",
        title: `${ev.label} ${year}`,
        year,
        runtime: `${between(40, 95, r)}m`,
        genres: pickN(["Special", "Family", "Music", "Comedy", "Documentary"], 2, r),
        description: `${pick(theme.plots, r)} The ${year} edition of the annual ${ev.label.toLowerCase()}, broadcast in the last week of October.`,
        cast: pickN(ACTORS, 2, r),
        halloweenScore: between(theme.h[0], theme.h[1], r),
        fallScore: between(theme.f[0], theme.f[1], r),
        streaming: pickN(STREAMERS, 2, r),
        watchUrl: `https://dulo.gd/watch/${id}`,
        art: art[theme.artKey],
        categories: [...new Set([...theme.categories, "Seasonal Events", "Holiday Specials"])],
        decade: decadeOf(year),
        keywords: [...theme.keywords, "special", "annual", "event", "broadcast"],
        userTags: [...theme.userTags, "Seasonal Special", "Holiday Special"],
        franchise: ev.label,
        themeId: theme.id,
      });
    }
  }
  return out;
}

/** The full generated catalog — deterministic, identical on server and client. */
export const generatedCatalog: VaultTitle[] = [
  ...makeEpisodes(),
  ...makeMovies(),
  ...makeSpecials(),
];

/** Franchise / similar-title relationships, derived once. */
export function relatedIds(all: VaultTitle[], t: VaultTitle, limit = 8) {
  const sameFranchise = t.franchise
    ? all.filter((o) => o.id !== t.id && o.franchise === t.franchise)
    : [];
  const sameTheme = all.filter(
    (o) => o.id !== t.id && o.themeId && o.themeId === t.themeId && !sameFranchise.includes(o),
  );
  return [...sameFranchise, ...sameTheme].slice(0, limit).map((o) => o.id);
}
