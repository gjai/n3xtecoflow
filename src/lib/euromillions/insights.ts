import { formatEuroMillionsLongDate, isoWeekKeyFromParisDate } from "./datetime";
import { isEuroMillionsDrawPublished } from "./store";
import { euroMillionsNumberStats, type NumberStat } from "./stats";
import type { EuroMillionsDraw } from "./types";

const ABSENCE_MIN = 12;

export type BrokenAbsence = {
  n: number;
  delayBefore: number;
  kind: "number" | "star";
};

export type CiteSnapshot = {
  sampleSize: number;
  latestDate: string | null;
  hottest: NumberStat | null;
  coldest: NumberStat | null;
  hottestStar: NumberStat | null;
  coldestStar: NumberStat | null;
  latestJackpotEur: number | null;
  latestHasWinner: boolean | null;
  rolloverStreak: number;
  brokenAbsences: BrokenAbsence[];
};

export type DrawStoryKind = "absence" | "jackpot-won" | "rollover" | "composition";

export type EditorialStory = {
  kind: DrawStoryKind | "weekly";
  guid: string;
  date: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  bodyFr: string[];
  bodyEn: string[];
  tags: string[];
  sourcePath: string;
};

function publishedNewestFirst(draws: EuroMillionsDraw[]): EuroMillionsDraw[] {
  return draws
    .filter(isEuroMillionsDrawPublished)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatMillionsEur(amount: number, locale: "fr" | "en"): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    return locale === "fr" ? "montant non publié" : "unpublished amount";
  }
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    const rounded = Number.isInteger(m) ? String(m) : m.toFixed(1);
    const display = locale === "fr" ? rounded.replace(".", ",") : rounded;
    return locale === "fr"
      ? `${display} millions d’euros`
      : `€${display} million`;
  }
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function rolloverStreak(drawsNewestFirst: EuroMillionsDraw[]): number {
  let n = 0;
  for (const draw of drawsNewestFirst) {
    if (draw.hasWinner === false) n += 1;
    else break;
  }
  return n;
}

function statsExcludingLatest(drawsNewestFirst: EuroMillionsDraw[]) {
  return euroMillionsNumberStats(drawsNewestFirst.slice(1));
}

export function brokenAbsences(drawsNewestFirst: EuroMillionsDraw[]): BrokenAbsence[] {
  const latest = drawsNewestFirst[0];
  if (!latest) return [];
  const prior = statsExcludingLatest(drawsNewestFirst);
  const out: BrokenAbsence[] = [];
  for (const n of latest.numbers) {
    const stat = prior.numbers.find((s) => s.n === n);
    const delay = stat?.delay ?? 0;
    if (delay >= ABSENCE_MIN) {
      out.push({ n, delayBefore: delay, kind: "number" });
    }
  }
  for (const n of latest.stars) {
    const stat = prior.stars.find((s) => s.n === n);
    const delay = stat?.delay ?? 0;
    if (delay >= ABSENCE_MIN) {
      out.push({ n, delayBefore: delay, kind: "star" });
    }
  }
  out.sort((a, b) => b.delayBefore - a.delayBefore);
  return out;
}

export function buildCiteSnapshot(draws: EuroMillionsDraw[]): CiteSnapshot {
  const newest = publishedNewestFirst(draws);
  const latest = newest[0] || null;
  const { numbers, stars } = euroMillionsNumberStats(newest);
  const byCount = (a: NumberStat, b: NumberStat) => b.count - a.count;
  const byDelay = (a: NumberStat, b: NumberStat) => b.delay - a.delay;
  return {
    sampleSize: newest.length,
    latestDate: latest?.date || null,
    hottest: [...numbers].sort(byCount)[0] || null,
    coldest: [...numbers].sort(byDelay)[0] || null,
    hottestStar: [...stars].sort(byCount)[0] || null,
    coldestStar: [...stars].sort(byDelay)[0] || null,
    latestJackpotEur: latest?.jackpotEur ?? null,
    latestHasWinner: latest?.hasWinner ?? null,
    rolloverStreak: rolloverStreak(newest),
    brokenAbsences: brokenAbsences(newest),
  };
}

function joinNums(values: number[]): string {
  return values.join(" · ");
}

function composition(draw: EuroMillionsDraw) {
  const even = draw.numbers.filter((n) => n % 2 === 0).length;
  const odd = draw.numbers.length - even;
  const sum = draw.numbers.reduce((acc, n) => acc + n, 0);
  const low = draw.numbers.filter((n) => n <= 25).length;
  return { even, odd, sum, low, high: draw.numbers.length - low };
}

const DISCLAIMER_FR =
  "Ces chiffres décrivent l’historique local de ce site. Un écart long ne rend pas un numéro plus probable au prochain tirage : chaque boule reste équiprobable. 18+ · jeu responsable.";
const DISCLAIMER_EN =
  "These figures describe this site’s local archive. A long gap does not make a number more likely next draw: every ball stays equally likely. 18+ · play responsibly.";

export function buildDrawStory(draws: EuroMillionsDraw[]): EditorialStory | null {
  const newest = publishedNewestFirst(draws);
  const latest = newest[0];
  if (!latest) return null;
  const date = latest.date;
  const dateFr = formatEuroMillionsLongDate(date, "fr");
  const dateEn = formatEuroMillionsLongDate(date, "en");
  const balls = joinNums(latest.numbers);
  const stars = joinNums(latest.stars);
  const jackpot =
    typeof latest.jackpotEur === "number" && latest.jackpotEur > 0
      ? latest.jackpotEur
      : null;
  const absences = brokenAbsences(newest);
  const headlineAbsence = absences[0];
  const comp = composition(latest);
  const drawPath = `/tirages/${date}`;
  const statsPath = "/stats";
  const numbersLineFr = `Boules ${balls}, étoiles ${stars}${latest.myMillionCode ? `, My Million ${latest.myMillionCode}` : ""}.`;
  const numbersLineEn = `Numbers ${balls}, stars ${stars}${latest.myMillionCode ? `, My Million ${latest.myMillionCode}` : ""}.`;

  if (headlineAbsence) {
    const labelFr = headlineAbsence.kind === "star" ? "étoile" : "boule";
    const labelEn = headlineAbsence.kind === "star" ? "star" : "number";
    const n = headlineAbsence.n;
    const delay = headlineAbsence.delayBefore;
    return {
      kind: "absence",
      guid: `original:em:draw:${date}:absence`,
      date,
      titleFr: `EuroMillions : la ${labelFr} ${n} sort après ${delay} tirages d’absence`,
      titleEn: `EuroMillions: ${labelEn} ${n} returns after ${delay} draws away`,
      excerptFr: `Tirage du ${dateFr} : la ${labelFr} ${n} n’était pas sortie depuis ${delay} tirages sur notre archive. ${numbersLineFr}`,
      excerptEn: `Draw of ${dateEn}: ${labelEn} ${n} had been missing for ${delay} draws in our archive. ${numbersLineEn}`,
      bodyFr: [
        `Sur le tirage EuroMillions du ${dateFr}, la ${labelFr} ${n} met fin à une absence de ${delay} tirages dans notre historique local.`,
        numbersLineFr,
        absences.length > 1
          ? `Autres retours notables : ${absences
              .slice(1, 4)
              .map((a) =>
                a.kind === "star"
                  ? `étoile ${a.n} (${a.delayBefore} tirages)`
                  : `boule ${a.n} (${a.delayBefore} tirages)`,
              )
              .join(" ; ")}.`
          : `C’est le retour le plus long de ce tirage, parmi les cinq boules et deux étoiles.`,
        jackpot
          ? `Jackpot annoncé : ${formatMillionsEur(jackpot, "fr")}${latest.hasWinner === true ? ", remporté." : latest.hasWinner === false ? ", reporté." : "."}`
          : "",
        `Les tableaux complets (fréquences, écarts, forme 10/30) sont sur la page stats, mise à jour à chaque tirage.`,
        DISCLAIMER_FR,
      ].filter(Boolean),
      bodyEn: [
        `On the EuroMillions draw of ${dateEn}, ${labelEn} ${n} ended a ${delay}-draw gap in our local history.`,
        numbersLineEn,
        absences.length > 1
          ? `Other notable returns: ${absences
              .slice(1, 4)
              .map((a) =>
                a.kind === "star"
                  ? `star ${a.n} (${a.delayBefore} draws)`
                  : `number ${a.n} (${a.delayBefore} draws)`,
              )
              .join("; ")}.`
          : `That is the longest return among this draw’s five numbers and two stars.`,
        jackpot
          ? `Announced jackpot: ${formatMillionsEur(jackpot, "en")}${latest.hasWinner === true ? " — won." : latest.hasWinner === false ? " — rolled over." : "."}`
          : "",
        `Full tables (frequencies, gaps, form 10/30) live on the stats page, updated after every draw.`,
        DISCLAIMER_EN,
      ].filter(Boolean),
      tags: ["euromillions", "stats", "absence", labelFr],
      sourcePath: statsPath,
    };
  }

  if (latest.hasWinner === true && jackpot) {
    return {
      kind: "jackpot-won",
      guid: `original:em:draw:${date}:jackpot`,
      date,
      titleFr: `EuroMillions : jackpot remporté, ${formatMillionsEur(jackpot, "fr")}`,
      titleEn: `EuroMillions: jackpot won, ${formatMillionsEur(jackpot, "en")}`,
      excerptFr: `Le jackpot EuroMillions du ${dateFr} a été remporté (${formatMillionsEur(jackpot, "fr")}). ${numbersLineFr}`,
      excerptEn: `The EuroMillions jackpot of ${dateEn} was won (${formatMillionsEur(jackpot, "en")}). ${numbersLineEn}`,
      bodyFr: [
        `Le jackpot du tirage du ${dateFr} a été gagné, pour ${formatMillionsEur(jackpot, "fr")}. La cagnotte suivante repartira du plancher officiel.`,
        numbersLineFr,
        `Nous n’avons pas d’information sur le ou les gagnants au-delà des partages publiés : pas de roman, pas de localisation inventée.`,
        `Fréquences et écarts de ce soir sont dans les stats, comparables à tout l’historique local.`,
        DISCLAIMER_FR,
      ],
      bodyEn: [
        `The jackpot on ${dateEn} was won, worth ${formatMillionsEur(jackpot, "en")}. The next pool resets to the official floor.`,
        numbersLineEn,
        `We have no winner identity beyond published prize shares — no invented location or backstory.`,
        `Tonight’s frequencies and gaps are on the stats page, against the full local archive.`,
        DISCLAIMER_EN,
      ],
      tags: ["euromillions", "jackpot"],
      sourcePath: drawPath,
    };
  }

  const streak = rolloverStreak(newest);
  if (latest.hasWinner === false && jackpot && streak >= 1) {
    return {
      kind: "rollover",
      guid: `original:em:draw:${date}:rollover`,
      date,
      titleFr:
        streak > 1
          ? `EuroMillions : jackpot reporté pour la ${streak}e fois (${formatMillionsEur(jackpot, "fr")})`
          : `EuroMillions : jackpot reporté, ${formatMillionsEur(jackpot, "fr")}`,
      titleEn:
        streak > 1
          ? `EuroMillions: jackpot rolls over for the ${streak}th time (${formatMillionsEur(jackpot, "en")})`
          : `EuroMillions: jackpot rolled over, ${formatMillionsEur(jackpot, "en")}`,
      excerptFr: `Personne n’a fait 5+2 le ${dateFr}. Cagnotte ${formatMillionsEur(jackpot, "fr")}, série de ${streak} report${streak > 1 ? "s" : ""}.`,
      excerptEn: `No 5+2 winner on ${dateEn}. Pool ${formatMillionsEur(jackpot, "en")}, ${streak} consecutive rollover${streak > 1 ? "s" : ""}.`,
      bodyFr: [
        `Le tirage du ${dateFr} ne désigne pas de rang 5+2. Le jackpot (${formatMillionsEur(jackpot, "fr")}) est reporté — ${streak} tirage${streak > 1 ? "s" : ""} d’affilée sans gagnant du gros lot, dans notre archive.`,
        numbersLineFr,
        `Le montant du prochain tirage sera confirmé à la publication officielle. Les rangs inférieurs restent sur la fiche du tirage.`,
        DISCLAIMER_FR,
      ],
      bodyEn: [
        `The ${dateEn} draw has no 5+2 winner. The jackpot (${formatMillionsEur(jackpot, "en")}) rolls over — ${streak} consecutive draw${streak > 1 ? "s" : ""} without a top prize in our archive.`,
        numbersLineEn,
        `The next advertised jackpot is confirmed when official figures land. Lower tiers stay on the draw sheet.`,
        DISCLAIMER_EN,
      ],
      tags: ["euromillions", "jackpot", "report"],
      sourcePath: drawPath,
    };
  }

  return {
    kind: "composition",
    guid: `original:em:draw:${date}:compo`,
    date,
    titleFr: `EuroMillions du ${dateFr} : ${comp.odd} impaires, somme ${comp.sum}`,
    titleEn: `EuroMillions ${dateEn}: ${comp.odd} odd balls, sum ${comp.sum}`,
    excerptFr: `${numbersLineFr} ${comp.odd} impaire(s), ${comp.even} paire(s), ${comp.low} boule(s) ≤ 25.`,
    excerptEn: `${numbersLineEn} ${comp.odd} odd, ${comp.even} even, ${comp.low} ball(s) ≤ 25.`,
    bodyFr: [
      `Lecture du tirage du ${dateFr}, hors pronostic : ${comp.odd} boule${comp.odd > 1 ? "s" : ""} impaire${comp.odd > 1 ? "s" : ""} et ${comp.even} paire${comp.even > 1 ? "s" : ""}, somme ${comp.sum}. ${comp.low} boule${comp.low > 1 ? "s" : ""} dans le 1–25, ${comp.high} dans le 26–50.`,
      numbersLineFr,
      `Ce découpage (paires, sommes, haut/bas) est un descriptif. Il ne change pas les 139 838 160 combinaisons possibles.`,
      `Les fréquences observées sur tout l’historique sont sur la page stats.`,
      DISCLAIMER_FR,
    ],
    bodyEn: [
      `Reading of the ${dateEn} draw, not a forecast: ${comp.odd} odd and ${comp.even} even balls, sum ${comp.sum}. ${comp.low} ball(s) in 1–25, ${comp.high} in 26–50.`,
      numbersLineEn,
      `Even/odd and high/low splits are descriptive. They do not change the 139,838,160 possible lines.`,
      `Observed frequencies across the archive are on the stats page.`,
      DISCLAIMER_EN,
    ],
    tags: ["euromillions", "stats", "composition"],
    sourcePath: drawPath,
  };
}

export function buildWeeklyStory(draws: EuroMillionsDraw[]): EditorialStory | null {
  const newest = publishedNewestFirst(draws);
  if (newest.length < 10) return null;
  const latest = newest[0];
  const week = isoWeekKeyFromParisDate(latest.date);
  const { numbers, stars } = euroMillionsNumberStats(newest);
  const cold = [...numbers].sort((a, b) => b.delay - a.delay).slice(0, 10);
  const hot = [...numbers].sort((a, b) => b.count - a.count).slice(0, 5);
  const coldStars = [...stars].sort((a, b) => b.delay - a.delay).slice(0, 3);
  const listFr = cold.map((s) => `${s.n} (écart ${s.delay})`).join(", ");
  const listEn = cold.map((s) => `${s.n} (gap ${s.delay})`).join(", ");
  return {
    kind: "weekly",
    guid: `original:em:weekly:${week}`,
    date: latest.date,
    titleFr: `EuroMillions : les 10 boules les plus absentes (semaine ${week.slice(6)})`,
    titleEn: `EuroMillions: the 10 longest-absent numbers (week ${week.slice(6)})`,
    excerptFr: `Sur ${newest.length} tirages en archive : ${cold
      .slice(0, 3)
      .map((s) => `${s.n} (écart ${s.delay})`)
      .join(", ")}. Pas un pronostic.`,
    excerptEn: `Across ${newest.length} archived draws: ${cold
      .slice(0, 3)
      .map((s) => `${s.n} (gap ${s.delay})`)
      .join(", ")}. Not a forecast.`,
    bodyFr: [
      `Point stats de la semaine ${week}, calculé sur ${newest.length} tirages de notre archive — pas une revue de presse, pas un copier-coller FDJ.`,
      `Boules les plus en retard : ${listFr}.`,
      `Boules les plus sorties sur tout l’historique : ${hot.map((s) => `${s.n} (${s.count} fois)`).join(", ")}.`,
      `Étoiles les plus en retard : ${coldStars.map((s) => `${s.n} (écart ${s.delay})`).join(", ")}.`,
      `Un écart élevé décrit le passé. Il n’augmente pas la chance au prochain tirage.`,
      DISCLAIMER_FR,
    ],
    bodyEn: [
      `Weekly stats for ${week}, from ${newest.length} draws in our archive — not a press roundup, not a FDJ copy.`,
      `Longest-absent numbers: ${listEn}.`,
      `Most drawn across the whole history: ${hot.map((s) => `${s.n} (${s.count} times)`).join(", ")}.`,
      `Longest-absent stars: ${coldStars.map((s) => `${s.n} (gap ${s.delay})`).join(", ")}.`,
      `A long gap describes the past. It does not raise the next-draw chance.`,
      DISCLAIMER_EN,
    ],
    tags: ["euromillions", "stats", "hebdo"],
    sourcePath: "/stats",
  };
}

export function buildPressPitch(draws: EuroMillionsDraw[]): { fr: string; en: string } {
  const newest = publishedNewestFirst(draws);
  const latest = newest[0];
  const snap = buildCiteSnapshot(draws);
  if (!latest) {
    return {
      fr: "Pas encore de tirage publié dans l’archive locale.",
      en: "No published draw in the local archive yet.",
    };
  }
  const dateFr = formatEuroMillionsLongDate(latest.date, "fr");
  const abs = snap.brokenAbsences[0];
  const jackpot =
    snap.latestJackpotEur != null
      ? formatMillionsEur(snap.latestJackpotEur, "fr")
      : null;
  const lines = [
    `ANALYSE — EuroMillions du ${dateFr}`,
    `Boules ${latest.numbers.join(" · ")} · étoiles ${latest.stars.join(" · ")}`,
    jackpot
      ? `Jackpot ${jackpot}${snap.latestHasWinner === true ? " (remporté)" : snap.latestHasWinner === false ? " (reporté)" : ""}`
      : null,
    abs
      ? `${abs.kind === "star" ? "Étoile" : "Boule"} ${abs.n} : retour après ${abs.delayBefore} tirages d’absence (archive locale, ${snap.sampleSize} tirages).`
      : snap.coldest
        ? `Boule la plus en retard à cette heure : ${snap.coldest.n} (écart ${snap.coldest.delay}).`
        : null,
    `Tableaux et CSV : https://euromillions-resultats.fr/fr/stats`,
    `Fiche du tirage : https://euromillions-resultats.fr/fr/tirages/${latest.date}`,
    `Citation libre avec lien vers la source. Site indépendant, 18+, jeu responsable — pas un opérateur FDJ.`,
  ].filter(Boolean);
  const linesEn = [
    `ANALYSIS — EuroMillions ${formatEuroMillionsLongDate(latest.date, "en")}`,
    `Numbers ${latest.numbers.join(" · ")} · stars ${latest.stars.join(" · ")}`,
    jackpot
      ? `Jackpot ${formatMillionsEur(snap.latestJackpotEur || 0, "en")}${snap.latestHasWinner === true ? " (won)" : snap.latestHasWinner === false ? " (rolled over)" : ""}`
      : null,
    abs
      ? `${abs.kind === "star" ? "Star" : "Number"} ${abs.n} returned after ${abs.delayBefore} draws away (local archive, ${snap.sampleSize} draws).`
      : snap.coldest
        ? `Longest-absent number right now: ${snap.coldest.n} (gap ${snap.coldest.delay}).`
        : null,
    `Tables and CSV: https://euromillions-resultats.fr/fr/stats`,
    `Draw sheet: https://euromillions-resultats.fr/fr/tirages/${latest.date}`,
    `Free to quote with a link. Independent site, 18+, play responsibly — not an FDJ operator.`,
  ].filter(Boolean);
  return { fr: lines.join("\n"), en: linesEn.join("\n") };
}
