import type { GuideArticle } from "./articles";
import { euromillionsGuideLocales } from "./euromillions-guide-locales";
import {
  EUROMILLIONS_CRESCENDO_GUIDE_SLUG,
  EUROMILLIONS_EURODREAMS_GUIDE_SLUG,
  EUROMILLIONS_KENO_GUIDE_SLUG,
  EUROMILLIONS_LOTO_GUIDE_SLUG,
  EUROMILLIONS_READ_RESULTS_GUIDE_SLUG,
  EUROMILLIONS_SCHEDULE_GUIDE_SLUG,
  euromillionsCompanionGuidesRaw,
} from "./euromillions-companion-guides";
import { euromillionsCompanionGuideLocales } from "./euromillions-companion-guide-locales";

export {
  EUROMILLIONS_CRESCENDO_GUIDE_SLUG,
  EUROMILLIONS_EURODREAMS_GUIDE_SLUG,
  EUROMILLIONS_KENO_GUIDE_SLUG,
  EUROMILLIONS_LOTO_GUIDE_SLUG,
  EUROMILLIONS_READ_RESULTS_GUIDE_SLUG,
  EUROMILLIONS_SCHEDULE_GUIDE_SLUG,
};

export const EUROMILLIONS_MAIN_GUIDE_SLUG = "comprendre-euromillions";
export const EUROMILLIONS_ODDS_GUIDE_SLUG = "probabilites-euromillions";
export const EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG = "jeu-responsable-euromillions";
export const EUROMILLIONS_MY_MILLION_GUIDE_SLUG = "comprendre-my-million";
export const EUROMILLIONS_TIERS_GUIDE_SLUG = "rangs-gains-euromillions";
export const EUROMILLIONS_OTHER_GAMES_GUIDE_SLUG = "euromillions-et-autres-tirages";

const CREDIT = "EuroMillions Résultats (IA)";

function cover(slug: string) {
  return {
    src: `/images/euromillions/guides/${slug}.jpg`,
    credit: CREDIT,
    creditUrl: "https://euromillions-resultats.fr",
  };
}

export const euromillionsGuideCovers: Record<
  string,
  { src: string; credit: string; creditUrl: string }
> = {
  [EUROMILLIONS_MAIN_GUIDE_SLUG]: cover(EUROMILLIONS_MAIN_GUIDE_SLUG),
  [EUROMILLIONS_ODDS_GUIDE_SLUG]: cover(EUROMILLIONS_ODDS_GUIDE_SLUG),
  [EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG]: cover(EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG),
  [EUROMILLIONS_MY_MILLION_GUIDE_SLUG]: cover(EUROMILLIONS_MY_MILLION_GUIDE_SLUG),
  [EUROMILLIONS_TIERS_GUIDE_SLUG]: cover(EUROMILLIONS_TIERS_GUIDE_SLUG),
  [EUROMILLIONS_OTHER_GAMES_GUIDE_SLUG]: cover(EUROMILLIONS_OTHER_GAMES_GUIDE_SLUG),
  [EUROMILLIONS_LOTO_GUIDE_SLUG]: cover(EUROMILLIONS_LOTO_GUIDE_SLUG),
  [EUROMILLIONS_EURODREAMS_GUIDE_SLUG]: cover(EUROMILLIONS_EURODREAMS_GUIDE_SLUG),
  [EUROMILLIONS_KENO_GUIDE_SLUG]: cover(EUROMILLIONS_KENO_GUIDE_SLUG),
  [EUROMILLIONS_CRESCENDO_GUIDE_SLUG]: cover(EUROMILLIONS_CRESCENDO_GUIDE_SLUG),
  [EUROMILLIONS_READ_RESULTS_GUIDE_SLUG]: cover(EUROMILLIONS_READ_RESULTS_GUIDE_SLUG),
  [EUROMILLIONS_SCHEDULE_GUIDE_SLUG]: cover(EUROMILLIONS_SCHEDULE_GUIDE_SLUG),
};

const euromillionsCoreGuidesRaw: GuideArticle[] = [
  {
    slug: EUROMILLIONS_MAIN_GUIDE_SLUG,
    fr: {
      title: "Comprendre l’EuroMillions",
      subtitle:
        "Boules, étoiles, jackpot, My Million et lecture d’un résultat — sans promesse de méthode.",
      sections: [
        {
          heading: "Ce qu’est (et n’est pas) l’EuroMillions",
          paragraphs: [
            "L’EuroMillions est un jeu de tirage européen : une grille combine 5 numéros parmi 50 et 2 étoiles parmi 12. Un tirage public désigne ensuite une combinaison gagnante. Les rangs de gains dépendent du nombre de boules et d’étoiles trouvées.",
            "Ce site est éditorial et indépendant. Nous publions les résultats, les archives et des explications. Nous ne vendons pas de tickets, ne sommes pas la FDJ, et aucun texte ici n’est un conseil pour « battre » le hasard.",
          ],
        },
        {
          heading: "Comment se déroule un tirage",
          paragraphs: [
            "En pratique, le tirage a généralement lieu le mardi et le vendredi, vers 21h (heure de Paris). Les horaires exacts relèvent des opérateurs ; nous les indiquons à titre indicatif.",
            "Une fois le tirage effectué, les sources publiques (dont l’API de résultats FDJ) publient les 5 boules, les 2 étoiles, souvent le jackpot annoncé, et en France le code My Million. EuroMillions Résultats interroge ces sources puis affiche la fiche.",
          ],
        },
        {
          heading: "Lire une fiche résultat",
          paragraphs: [
            "Chaque fiche de tirage montre la date, les 5 boules (ordre croissant), les 2 étoiles, et quand la source le fournit : jackpot, code My Million, parfois le nombre de gagnants par rang.",
            "Les archives permettent de retrouver une date. Le simulateur compare une grille à un tirage déjà publié — il ne « prédit » rien. Les stats de fréquences décrivent seulement le passé.",
          ],
        },
        {
          heading: "Jackpot et reports",
          paragraphs: [
            "S’il n’y a pas de gagnant au rang 1 (5 boules + 2 étoiles), le jackpot est en général reporté au tirage suivant, dans les limites du règlement du jeu. Un montant annoncé n’est pas un gain garanti pour vous : c’est la cagnotte du rang 1 à ce tirage.",
            "Les montants peuvent être partagés s’il y a plusieurs gagnants de même rang. Les barèmes des rangs inférieurs varient selon les mises et le nombre de gagnants.",
          ],
        },
        {
          heading: "Indépendance et jeu responsable",
          paragraphs: [
            "Pour jouer, passez uniquement par un opérateur légal dans votre pays (en France : un réseau agréé, par exemple FDJ). Réservé aux majeurs (18+). Budget loisir, jamais un « système ».",
            "18+ · Jeu responsable · Risque de perte d’argent. Aide : Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    en: {
      title: "Understanding EuroMillions",
      subtitle:
        "Numbers, stars, jackpot, My Million and how to read a result — with no promised system.",
      sections: [
        {
          heading: "What EuroMillions is (and is not)",
          paragraphs: [
            "EuroMillions is a European lottery: a grid combines 5 numbers from 50 and 2 stars from 12. A public draw then selects a winning combination. Prize tiers depend on how many numbers and stars you match.",
            "This site is independent and editorial. We publish results, archives and explanations. We do not sell tickets, we are not FDJ, and nothing here is advice on “beating” chance.",
          ],
        },
        {
          heading: "How a draw works",
          paragraphs: [
            "Draws usually take place on Tuesdays and Fridays, around 9pm (Paris time). Exact times are set by operators; we show them as a guide only.",
            "After the draw, public sources (including the FDJ results API) publish the 5 numbers, 2 stars, often the announced jackpot, and in France the My Million code. EuroMillions Results polls those sources, then displays the draw page.",
          ],
        },
        {
          heading: "Reading a result page",
          paragraphs: [
            "Each draw page shows the date, 5 numbers (ascending), 2 stars, and when the source provides them: jackpot, My Million code, sometimes winners per tier.",
            "Archives let you look up a date. The simulator compares a grid to a published draw — it does not predict anything. Frequency stats only describe the past.",
          ],
        },
        {
          heading: "Jackpot and rollovers",
          paragraphs: [
            "If there is no rank-1 winner (5 numbers + 2 stars), the jackpot is usually rolled over to the next draw, within the game rules. An announced amount is not a guaranteed win for you: it is the rank-1 pool for that draw.",
            "Amounts can be shared if several players hit the same tier. Lower-tier prizes vary with stakes and the number of winners.",
          ],
        },
        {
          heading: "Independence and responsible play",
          paragraphs: [
            "To play, use only a licensed operator in your country (in France: an authorised network such as FDJ). Adults only (18+). Leisure budget, never a “system”.",
            "18+ · Play responsibly · Risk of losing money. France help: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_ODDS_GUIDE_SLUG,
    fr: {
      title: "Probabilités EuroMillions",
      subtitle:
        "Ordres de grandeur utiles — et pourquoi aucune « méthode » ne bat le hasard.",
      sections: [
        {
          heading: "Le jackpot est extrêmement rare",
          paragraphs: [
            "Il y a C(50,5) × C(12,2) = 139 838 160 grilles possibles. Gagner le rang 1 (5 boules + 2 étoiles) est donc de l’ordre d’une chance sur 140 millions, pour une grille simple.",
            "Les rangs inférieurs sont plus fréquents, avec des gains plus modestes. Une grille « bien choisie » n’a pas plus de chances qu’une grille tirée au hasard : chaque combinaison équiprobable reste équiprobable.",
          ],
        },
        {
          heading: "Mythes : numéros chauds, dates de naissance, systèmes",
          paragraphs: [
            "Les dates de naissance (1–31) concentrent les mises sur un sous-ensemble. Cela ne change pas la probabilité de gagner ; en cas de gain partagé, cela peut seulement augmenter le nombre de co-gagnants.",
            "Les « numéros chauds » ou « en retard » décrivent le passé. Un tirage n’a pas de mémoire. Un écart long n’augmente pas la chance qu’un numéro sorte au tirage suivant.",
            "Les mises multiples (plus de boules, plus d’étoiles) augmentent le nombre de combinaisons couvertes, donc le coût, pas le rapport chance/mise d’une combinaison donnée.",
          ],
        },
        {
          heading: "À quoi servent les stats de ce site",
          paragraphs: [
            "Les tableaux de fréquences et d’écarts visualisent l’historique local. Ils aident à lire la distribution observée, pas à anticiper le prochain résultat.",
            "Le simulateur vérifie une grille déjà jouée (ou fictive) contre des tirages publiés. Ce n’est pas un outil de pronostic.",
          ],
        },
        {
          heading: "Conséquence pratique",
          paragraphs: [
            "Si vous jouez, traitez-le comme un loisir budgeté — jamais comme un investissement ni un revenu. 18+ · risque de perte.",
          ],
        },
      ],
    },
    en: {
      title: "EuroMillions odds",
      subtitle:
        "Useful orders of magnitude — and why no “system” beats chance.",
      sections: [
        {
          heading: "The jackpot is extremely rare",
          paragraphs: [
            "There are C(50,5) × C(12,2) = 139,838,160 possible grids. Winning rank 1 (5 numbers + 2 stars) is therefore about one chance in 140 million, for a single grid.",
            "Lower tiers are more common, with smaller prizes. A “carefully chosen” grid is no more likely than a random one: every equally likely combination stays equally likely.",
          ],
        },
        {
          heading: "Myths: hot numbers, birthdays, systems",
          paragraphs: [
            "Birthdays (1–31) concentrate stakes on a subset. That does not change the odds of winning; if the prize is shared, it can only increase the number of co-winners.",
            "“Hot” or “overdue” numbers describe the past. A draw has no memory. A long gap does not raise the chance a number appears next time.",
            "Multiple bets (more numbers, more stars) cover more combinations, so they cost more — they do not improve the odds-per-combination of a given line.",
          ],
        },
        {
          heading: "What this site’s stats are for",
          paragraphs: [
            "Frequency and delay tables visualise the local history. They help read the observed distribution, not predict the next result.",
            "The simulator checks a played (or made-up) grid against published draws. It is not a forecasting tool.",
          ],
        },
        {
          heading: "Practical takeaway",
          paragraphs: [
            "If you play, treat it as budgeted leisure — never as an investment or income. 18+ · risk of loss.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG,
    fr: {
      title: "Jeu responsable & EuroMillions",
      subtitle: "Budget loisir, 18+, signaux d’alerte et ressources d’aide en France.",
      sections: [
        {
          heading: "Règles simples",
          paragraphs: [
            "Réservé aux majeurs (18+). Fixez un budget loisir à l’avance, payé avec de l’argent que vous pouvez perdre, et ne le dépassez pas.",
            "Ne poursuivez jamais vos pertes. Un report de jackpot n’est pas un « moment pour se rattraper ». Les jeux de tirage comportent un risque de perte d’argent.",
          ],
        },
        {
          heading: "Signaux d’alerte",
          paragraphs: [
            "Emprunter pour jouer, cacher ses mises, jouer pour rembourser des pertes, ou ressentir de l’angoisse autour du tirage : ce ne sont plus des signes d’un loisir.",
            "Les stats, simulateurs et générateurs de ce site sont des outils de lecture. Ils ne justifient pas d’augmenter la mise.",
          ],
        },
        {
          heading: "Aide en France",
          paragraphs: [
            "Joueurs Info Service — 09 74 75 13 13 (appel non surtaxé) — https://www.joueurs-info-service.fr",
            "Si le jeu n’est plus un plaisir, arrêtez et demandez de l’aide. Vous pouvez aussi vous interdire sur les canaux de jeu en ligne agréés.",
          ],
        },
      ],
    },
    en: {
      title: "Responsible play & EuroMillions",
      subtitle: "Leisure budget, 18+, warning signs and support resources in France.",
      sections: [
        {
          heading: "Simple rules",
          paragraphs: [
            "Adults only (18+). Set a leisure budget in advance, with money you can afford to lose, and do not exceed it.",
            "Never chase losses. A jackpot rollover is not a “moment to catch up”. Lottery games involve a risk of losing money.",
          ],
        },
        {
          heading: "Warning signs",
          paragraphs: [
            "Borrowing to play, hiding stakes, playing to recoup losses, or feeling anxiety around the draw: those are no longer signs of leisure.",
            "Stats, simulators and generators on this site are reading tools. They do not justify raising the stake.",
          ],
        },
        {
          heading: "Help in France",
          paragraphs: [
            "Joueurs Info Service — 09 74 75 13 13 — https://www.joueurs-info-service.fr",
            "If gambling stops being fun, stop and seek help. You can also self-exclude from licensed online channels.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_MY_MILLION_GUIDE_SLUG,
    fr: {
      title: "My Million : lire le code, sans le confondre avec le jackpot",
      subtitle:
        "Code unique par grille française, archives, localisation des gagnants — et ce que ce site affiche.",
      sections: [
        {
          heading: "Ce qu’est My Million",
          paragraphs: [
            "My Million est un jeu associé aux grilles EuroMillions jouées en France (réseau FDJ). Chaque grille reçoit un code alphanumérique. Un code est tiré ; s’il correspond au vôtre, le gain My Million est distinct du jackpot EuroMillions.",
            "Gagner My Million ne dépend pas des 5 boules et 2 étoiles. Inversement, un jackpot EuroMillions ne « contient » pas My Million : ce sont deux mécanismes.",
          ],
        },
        {
          heading: "Comment vérifier un code",
          paragraphs: [
            "Sur ce site, la page My Million liste les codes publiés avec la date du tirage. Un champ permet de comparer votre code aux archives locales.",
            "La localisation d’un gagnant (département, « Internet », etc.) vient d’annonces publiques (souvent le magasin FDJ). Elle peut arriver après le code, ou rester absente.",
          ],
        },
        {
          heading: "Limites utiles",
          paragraphs: [
            "Nous ne délivrons pas de code, ne validons pas un ticket officiel, et ne contactons pas les gagnants. Seul l’opérateur (FDJ) fait foi pour un paiement.",
            "18+ · Jeu responsable. My Million reste un jeu de hasard : un code « qui revient souvent » dans les archives n’a pas plus de chances au prochain tirage.",
          ],
        },
      ],
    },
    en: {
      title: "My Million: reading the code, without mixing it up with the jackpot",
      subtitle:
        "Unique code per French grid, archives, winner locations — and what this site shows.",
      sections: [
        {
          heading: "What My Million is",
          paragraphs: [
            "My Million is a game attached to EuroMillions grids played in France (FDJ network). Each grid gets an alphanumeric code. One code is drawn; if it matches yours, the My Million prize is separate from the EuroMillions jackpot.",
            "Winning My Million does not depend on the 5 numbers and 2 stars. Conversely, a EuroMillions jackpot does not “include” My Million: they are two mechanisms.",
          ],
        },
        {
          heading: "How to check a code",
          paragraphs: [
            "On this site, the My Million page lists published codes with the draw date. A field lets you compare your code with the local archive.",
            "A winner’s location (département, “Internet”, etc.) comes from public announcements (often FDJ magazine). It may arrive after the code, or stay missing.",
          ],
        },
        {
          heading: "Useful limits",
          paragraphs: [
            "We do not issue codes, validate an official ticket, or contact winners. Only the operator (FDJ) is authoritative for a payout.",
            "18+ · Play responsibly. My Million is still a game of chance: a code that “appears often” in the archive is no more likely next draw.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_TIERS_GUIDE_SLUG,
    fr: {
      title: "Les 13 rangs de gains EuroMillions",
      subtitle:
        "De 5 boules + 2 étoiles jusqu’à 2 boules : comment lire le barème, sans viser un « rang facile ».",
      sections: [
        {
          heading: "Le principe",
          paragraphs: [
            "Un rang correspond à un couple (nombre de boules justes, nombre d’étoiles justes). Le rang 1 est 5+2. Les rangs inférieurs paient moins, et sont plus fréquents.",
            "Les montants par rang ne sont pas fixes comme une grille de loto « à lots garantis » : ils dépendent des mises de la cagnotte et du nombre de gagnants. La fiche d’un tirage, quand la source le fournit, liste les gains constatés.",
          ],
        },
        {
          heading: "Les 13 rangs, du plus rare au plus fréquent",
          paragraphs: [
            "Rang 1 : 5 boules + 2 étoiles (jackpot). Rang 2 : 5+1. Rang 3 : 5+0. Rang 4 : 4+2. Rang 5 : 4+1. Rang 6 : 3+2. Rang 7 : 4+0.",
            "Rang 8 : 2+2. Rang 9 : 3+1. Rang 10 : 3+0. Rang 11 : 1+2. Rang 12 : 2+1. Rang 13 : 2+0 (souvent le rang le plus fréquent, avec un gain modeste).",
          ],
          bullets: [
            "5+2 — jackpot, ~1 chance sur 140 millions",
            "2+0 — rang le plus courant parmi les 13, gain faible",
            "Une étoile seule, ou une seule boule, ne paie pas",
          ],
        },
        {
          heading: "Utiliser le simulateur",
          paragraphs: [
            "Le simulateur de ce site compare votre grille à un tirage publié et indique le rang éventuel. Cela sert à vérifier un ticket ou à comprendre le barème — pas à choisir « le rang le plus rentable ».",
            "18+ · aucun rang n’est un investissement.",
          ],
        },
      ],
    },
    en: {
      title: "The 13 EuroMillions prize tiers",
      subtitle:
        "From 5 numbers + 2 stars down to 2 numbers: how to read the table, without chasing an “easy tier”.",
      sections: [
        {
          heading: "The idea",
          paragraphs: [
            "A tier is a pair (correct numbers, correct stars). Rank 1 is 5+2. Lower tiers pay less and occur more often.",
            "Amounts per tier are not fixed like a “guaranteed prize” lottery: they depend on the prize pool and the number of winners. A draw page, when the source provides it, lists the observed prizes.",
          ],
        },
        {
          heading: "The 13 tiers, rarest to most common",
          paragraphs: [
            "Rank 1: 5 numbers + 2 stars (jackpot). Rank 2: 5+1. Rank 3: 5+0. Rank 4: 4+2. Rank 5: 4+1. Rank 6: 3+2. Rank 7: 4+0.",
            "Rank 8: 2+2. Rank 9: 3+1. Rank 10: 3+0. Rank 11: 1+2. Rank 12: 2+1. Rank 13: 2+0 (often the most frequent tier, with a modest prize).",
          ],
          bullets: [
            "5+2 — jackpot, about 1 in 140 million",
            "2+0 — most common of the 13, small prize",
            "A single star, or a single number, does not pay",
          ],
        },
        {
          heading: "Using the simulator",
          paragraphs: [
            "This site’s simulator compares your grid to a published draw and shows the tier if any. That is for checking a ticket or understanding the table — not for picking “the most profitable tier”.",
            "18+ · no tier is an investment.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_OTHER_GAMES_GUIDE_SLUG,
    fr: {
      title: "EuroMillions, Loto, EuroDreams, Crescendo, Keno : les différences",
      subtitle:
        "Même famille de tirages FDJ, règles distinctes — ce que ce site affiche pour chacun.",
      sections: [
        {
          heading: "Pourquoi les regrouper ici",
          paragraphs: [
            "EuroMillions reste le sujet principal du site. Loto, EuroDreams, Crescendo et Keno sont des tirages FDJ dont les résultats publics sont utiles le soir d’un tirage, sans en faire des « méthodes croisées ».",
            "Chaque jeu a sa propre grille, ses propres horaires et ses propres rangs. Une statistique EuroMillions ne dit rien sur le Loto.",
          ],
        },
        {
          heading: "Repères (indicatifs)",
          paragraphs: [
            "EuroMillions : 5/50 + 2 étoiles/12, mardi et vendredi. My Million est un code français associé.",
            "Loto : 5 numéros + numéro Chance, plusieurs soirs par semaine. EuroDreams : tirage européen avec un numéro « Dreams » et une rente possible. Keno : nombreux numéros, tirages midi et soir. Crescendo : plusieurs tirages le samedi.",
          ],
          bullets: [
            "Les horaires exacts relèvent de la FDJ",
            "Les archives compagnons sont plus courtes que l’historique EuroMillions",
            "Chaque jeu a son simulateur et ses stats sur sa page /jeux/…",
          ],
        },
        {
          heading: "Ce que nous ne faisons pas",
          paragraphs: [
            "Pas de « combiné magique » entre jeux, pas de vente de tickets, pas de promesse de gain. Pour jouer : opérateur légal, 18+, budget loisir.",
          ],
        },
      ],
    },
    en: {
      title: "EuroMillions, Loto, EuroDreams, Crescendo, Keno: the differences",
      subtitle:
        "Same FDJ draw family, different rules — what this site shows for each.",
      sections: [
        {
          heading: "Why they sit here",
          paragraphs: [
            "EuroMillions remains the site’s main topic. Loto, EuroDreams, Crescendo and Keno are FDJ draws whose public results are useful on draw night, without turning them into “cross-game systems”.",
            "Each game has its own grid, schedule and prize tiers. A EuroMillions statistic says nothing about Loto.",
          ],
        },
        {
          heading: "Rough landmarks",
          paragraphs: [
            "EuroMillions: 5/50 + 2 stars/12, Tuesday and Friday. My Million is an associated French code.",
            "Loto: 5 numbers + Chance number, several evenings a week. EuroDreams: European draw with a “Dreams” number and a possible annuity. Keno: many numbers, lunchtime and evening draws. Crescendo: several Saturday draws.",
          ],
          bullets: [
            "Exact times are set by FDJ",
            "Companion archives are shorter than the EuroMillions history",
            "Each game has its own simulator and stats on its /jeux/… page",
          ],
        },
        {
          heading: "What we do not do",
          paragraphs: [
            "No “magic combo” across games, no ticket sales, no promise of winnings. To play: licensed operator, 18+, leisure budget.",
          ],
        },
      ],
    },
  },
];

export const euromillionsGuidesRaw: GuideArticle[] = [
  ...euromillionsCoreGuidesRaw,
  ...euromillionsCompanionGuidesRaw,
];

export const euromillionsGuides: GuideArticle[] =
  euromillionsGuidesRaw.map((guide) => {
    const extra =
      euromillionsGuideLocales[guide.slug] ||
      euromillionsCompanionGuideLocales[guide.slug];
    const cover = euromillionsGuideCovers[guide.slug];
    return {
      ...(extra ? { ...guide, ...extra } : guide),
      ...(cover
        ? { imageSrc: cover.src, imageCredit: cover.credit }
        : {}),
    };
  });
