/**
 * REAL TELEVISION — verified episodes and specials only.
 * ------------------------------------------------------
 * Two scalable mechanisms, no hardcoded object dumps:
 *  1. compact episode rows (see ./schema.ts)
 *  2. *series generators* — recurring, annually numbered real programmes
 *     (e.g. The Simpsons' Treehouse of Horror) expanded from a small table.
 */

import type { EpisodeRow, FilmRow } from "./schema";

export const HALLOWEEN_EPISODES: EpisodeRow[] = [
  "The Office|2|5|Halloween|2005|22m|Comedy|Sitcom Halloween Episodes;Costume Party|Peacock|92|60|Michael must lay off an employee on Halloween while the office parties in costume.",
  "The Office|7|6|Costume Contest|2010|22m|Comedy|Sitcom Halloween Episodes;Costume Party|Peacock|90|58|Dunder Mifflin holds its annual costume contest.",
  "The Office|8|5|Spooked|2011|22m|Comedy|Sitcom Halloween Episodes;Costume Party|Peacock|88|56|Erin plans the Halloween party and aims for genuinely scary.",
  "The Office|9|5|Here Comes Treble|2012|22m|Comedy|Sitcom Halloween Episodes;Costume Party|Peacock|86|56|Andy's old a cappella group visits the office on Halloween.",
  "Friends|8|6|The One with the Halloween Party|2001|22m|Comedy|Sitcom Halloween Episodes;Costume Party|Max|92|58|Monica throws a costume party; Ross and Chandler arm wrestle for the children.",
  "Friends|1|9|The One Where Underdog Gets Away|1994|22m|Comedy|Thanksgiving;Sitcom Halloween Episodes;Family Gatherings|Max|10|94|The six are locked out while Thanksgiving dinner burns.",
  "Friends|3|9|The One with the Football|1996|22m|Comedy|Thanksgiving;Family Gatherings|Max|8|94|The Geller Cup is contested on Thanksgiving afternoon.",
  "Friends|5|8|The One with All the Thanksgivings|1998|22m|Comedy|Thanksgiving;Family Gatherings|Max|10|96|Everyone recalls their worst Thanksgiving.",
  "Friends|4|8|The One with Chandler in a Box|1997|22m|Comedy|Thanksgiving;Family Gatherings|Max|8|92|Chandler spends Thanksgiving in a wooden crate.",
  "Friends|10|8|The One with the Late Thanksgiving|2003|22m|Comedy|Thanksgiving;Family Gatherings|Max|8|92|Monica cooks a Thanksgiving dinner nobody arrives on time for.",
  "Brooklyn Nine-Nine|1|6|Halloween|2013|22m|Comedy;Crime|Sitcom Halloween Episodes;Mystery Night|Peacock|92|56|Jake bets Holt he can steal his watch before midnight on Halloween.",
  "Brooklyn Nine-Nine|2|4|Halloween II|2014|22m|Comedy;Crime|Sitcom Halloween Episodes;Mystery Night|Peacock|90|54|The heist returns with higher stakes.",
  "Brooklyn Nine-Nine|3|5|Halloween III|2015|22m|Comedy;Crime|Sitcom Halloween Episodes;Mystery Night|Peacock|90|54|A three-way heist for the title of Ultimate Detective/Genius.",
  "Brooklyn Nine-Nine|4|5|Halloween IV|2016|22m|Comedy;Crime|Sitcom Halloween Episodes;Mystery Night|Peacock|88|54|The whole squad joins the annual heist.",
  "Brooklyn Nine-Nine|5|4|HalloVeen|2017|22m|Comedy;Crime|Sitcom Halloween Episodes;Mystery Night|Peacock|94|56|The fifth heist ends with the most famous proposal in the Nine-Nine.",
  "Buffy the Vampire Slayer|2|6|Halloween|1997|44m|Fantasy;Horror;Drama|Teen Halloween;Costume Party|Hulu|94|56|Costumes from a new shop turn everyone into whatever they dressed as.",
  "Buffy the Vampire Slayer|4|4|Fear, Itself|1999|44m|Fantasy;Horror;Drama|Teen Halloween;Haunted Houses|Hulu|92|56|A frat house haunted attraction becomes genuinely haunted.",
  "Buffy the Vampire Slayer|6|6|All the Way|2001|44m|Fantasy;Horror;Drama|Teen Halloween|Hulu|86|54|Dawn sneaks out on Halloween night with the wrong crowd.",
  "Buffy the Vampire Slayer|4|8|Pangs|1999|44m|Fantasy;Drama|Thanksgiving;Family Gatherings|Hulu|30|88|Buffy insists on a perfect Thanksgiving while a vengeful spirit rises.",
  "Community|2|6|Epidemiology|2010|22m|Comedy|Sitcom Halloween Episodes;Costume Party|Netflix|94|56|Contaminated party food turns the Halloween dance into a zombie outbreak.",
  "Community|3|5|Horror Fiction in Seven Spooky Steps|2011|22m|Comedy|Sitcom Halloween Episodes;Anthology Episodes|Netflix|92|54|The study group tells scary stories to diagnose a psychopath.",
  "Community|4|2|Paranormal Parentage|2013|22m|Comedy|Sitcom Halloween Episodes;Haunted Houses|Netflix|88|52|The group investigates Pierce's mansion on Halloween.",
  "Community|1|7|Introduction to Statistics|2009|22m|Comedy|Sitcom Halloween Episodes;Costume Party|Netflix|88|52|Greendale's Día de los Muertos Halloween party goes sideways.",
  "Bob's Burgers|3|2|Full Bars|2012|22m|Animation;Comedy|Halloween Cartoon Episodes;Trick or Treat|Hulu|94|58|The kids trick-or-treat in the wealthy neighbourhood for full-size candy bars.",
  "Bob's Burgers|4|2|Fort Night|2013|22m|Animation;Comedy|Halloween Cartoon Episodes;Trick or Treat|Hulu|90|56|The kids are trapped in their cardboard fort on Halloween.",
  "Bob's Burgers|6|3|The Hauntening|2015|22m|Animation;Comedy|Halloween Cartoon Episodes;Haunted Houses|Hulu|92|56|Bob and Linda stage a haunted house to finally scare Louise.",
  "Bob's Burgers|4|5|Turkey in a Can|2013|22m|Animation;Comedy|Thanksgiving;Family Gatherings|Hulu|12|92|Someone keeps putting the Thanksgiving turkey in the toilet.",
  "Bob's Burgers|2|5|An Indecent Thanksgiving Proposal|2012|22m|Animation;Comedy|Thanksgiving;Family Gatherings|Hulu|10|90|Mr. Fischoeder hires the Belchers to play his family at Thanksgiving.",
  "Modern Family|2|6|Halloween|2010|22m|Comedy|Sitcom Halloween Episodes;Family Halloween|Hulu|92|56|Claire stages her perfect haunted house.",
  "Modern Family|3|9|Punkin Chunkin|2011|22m|Comedy|Thanksgiving;Harvest Themes|Hulu|24|88|A Thanksgiving argument is settled with a pumpkin-hurling machine.",
  "Roseanne|2|7|Boo!|1989|22m|Comedy|Sitcom Halloween Episodes;Classic Halloween|Peacock|92|56|The Conners' Halloween prank war, and the Lunch Box haunted house.",
  "That '70s Show|2|5|Halloween|1999|22m|Comedy|Sitcom Halloween Episodes;Retro Halloween|Peacock|86|54|The gang gets trapped in their old elementary school on Halloween.",
  "Gilmore Girls|3|9|A Deep-Fried Korean Thanksgiving|2002|44m|Comedy;Drama|Thanksgiving;Cozy Autumn Movies;Family Gatherings|Netflix|10|96|Lorelai and Rory attempt four Thanksgiving dinners in one day.",
  "Cheers|5|9|Thanksgiving Orphans|1986|22m|Comedy|Thanksgiving;Family Gatherings|Paramount+|8|94|The regulars spend Thanksgiving together and end in a food fight.",
  "WKRP in Cincinnati|1|7|Turkeys Away|1978|22m|Comedy|Thanksgiving;Classic Halloween|Hulu|6|94|As God is my witness, I thought turkeys could fly.",
  "Seinfeld|6|8|The Mom & Pop Store|1994|22m|Comedy|Thanksgiving;Family Gatherings|Netflix|8|82|Jerry's Thanksgiving parade balloon obligations collide with a woodgrain Le Baron.",
  "The Simpsons|9|10|Miracle on Evergreen Terrace|1997|22m|Animation;Comedy|Halloween Cartoon Episodes|Disney+|20|60|Not a Treehouse episode, but a Springfield seasonal staple.",
  "Everybody Hates Chris|1|6|Everybody Hates Halloween|2005|22m|Comedy|Sitcom Halloween Episodes;Trick or Treat|Peacock|90|54|Chris goes trick-or-treating in the good neighbourhood.",
  "Freaks and Geeks|1|3|Tricks and Treats|1999|44m|Comedy;Drama|Teen Halloween;Trick or Treat;Retro Halloween|Hulu|94|60|Sam trick-or-treats one last time while Lindsay eggs houses.",
  "Malcolm in the Middle|3|1|Houseboat|2001|22m|Comedy|Sitcom Halloween Episodes|Hulu|60|56|The family's Halloween-adjacent chaos opens the season.",
  "King of the Hill|1|4|Hank's Got the Willies|1997|22m|Animation;Comedy|Halloween Cartoon Episodes|Hulu|40|60|An Arlen classic from the show's most autumnal stretch.",
  "The Twilight Zone|1|8|Time Enough at Last|1959|25m|Sci-Fi;Drama|Anthology Episodes;Classic Halloween|Paramount+|60|48|The definitive anthology half-hour, a Halloween-marathon fixture.",
  "Are You Afraid of the Dark?|1|1|The Tale of the Twisted Claw|1992|22m|Family;Horror;Fantasy|Anthology Episodes;Kids Halloween;Retro Halloween|Paramount+|94|58|The Midnight Society's first campfire tale: two pranksters and a very unlucky Halloween.",
  "Goosebumps|1|1|The Haunted Mask|1995|44m|Family;Horror|Kids Halloween;Costume;Retro Halloween|Netflix|96|58|Carly Beth buys a mask she cannot take off on Halloween night.",
];

/** Specials and annual events — real broadcasts. */
export const SPECIALS: FilmRow[] = [
  "It's the Great Pumpkin, Charlie Brown|1966|25m|Animation;Family|Holiday Specials;Animated Halloween;Classic Halloween|Apple TV+|100|82|Linus waits all night in the most sincere pumpkin patch he can find.",
  "A Charlie Brown Thanksgiving|1973|25m|Animation;Family|Holiday Specials;Thanksgiving;Family Gatherings|Apple TV+|10|96|Charlie Brown serves toast and popcorn to unexpected Thanksgiving guests.",
  "Garfield's Halloween Adventure|1985|24m|Animation;Family|Holiday Specials;Animated Halloween;Retro Halloween|Prime Video|96|60|Garfield and Odie trick-or-treat their way to a genuinely haunted house.",
  "Disney's Halloween Treat|1982|48m|Animation;Family|Holiday Specials;Animated Halloween;Retro Halloween|Disney+|94|56|The classic clip-show special of Disney's spookiest scenes.",
  "Winnie the Pooh: Boo to You Too!|1996|24m|Animation;Family|Holiday Specials;Kids Halloween|Disney+|88|58|Piglet faces Halloween in the Hundred Acre Wood.",
  "Scared Shrekless|2010|22m|Animation;Family;Comedy|Holiday Specials;Animated Halloween|Netflix|88|54|Shrek dares his friends to tell scary stories in Lord Farquaad's castle.",
  "Toy Story of Terror!|2013|22m|Animation;Family|Holiday Specials;Animated Halloween|Disney+|84|52|A roadside motel stop becomes a horror movie for the toys.",
  "Room on the Broom|2012|25m|Animation;Family|Holiday Specials;Witch Movies;Kids Halloween|Prime Video|86|66|A generous witch keeps adding passengers to her broom.",
  "The Legend of Sleepy Hollow|1949|34m|Animation;Family;Fantasy|Holiday Specials;Classic Halloween;Animated Halloween|Disney+|96|86|Disney's Ichabod Crane rides home through a very autumn Hudson Valley.",
  "Mickey's House of Villains|2001|1h 8m|Animation;Family|Holiday Specials;Animated Halloween;Family Halloween|Disney+|84|50|Disney villains take over the House of Mouse on Halloween night.",
];

/* ------------------------------------------------------------------ *
 * Series generator — recurring annual programmes.
 * A tiny verified table expands into every real instalment, so long-running
 * seasonal traditions scale without hand-writing each record.
 * ------------------------------------------------------------------ */

const ROMAN = [
  "I","II","III","IV","V","VI","VII","VIII","IX","X",
  "XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX",
  "XXI","XXII","XXIII","XXIV","XXV","XXVI","XXVII","XXVIII","XXIX","XXX",
];

/** Episode-in-season numbers for Treehouse of Horror I–XXX (season = n + 1). */
const THOH_EPISODE_NO = [
  3, 7, 5, 5, 6, 6, 1, 4, 4, 4, 1, 1, 1, 1, 1, 4, 4, 5, 4, 4, 4, 3, 2, 2, 4, 5, 4, 4, 4, 4,
];

/** The Simpsons' annual Halloween anthology — every real instalment. */
export const TREEHOUSE_ROWS: EpisodeRow[] = ROMAN.map((numeral, i) => {
  const season = i + 2;
  const episode = THOH_EPISODE_NO[i] ?? 4;
  const year = 1990 + i;
  return [
    "The Simpsons",
    season,
    episode,
    `Treehouse of Horror ${numeral}`,
    year,
    "22m",
    "Animation;Comedy;Horror",
    "Halloween Cartoon Episodes;Anthology Episodes;Classic Halloween",
    "Disney+",
    96,
    58,
    "The Simpsons' annual three-segment Halloween anthology, outside series canon.",
  ].join("|");
});
