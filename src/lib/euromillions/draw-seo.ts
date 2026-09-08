import { pickLocalized } from "@/i18n/locales";
import { formatEuroMillionsLongDate } from "./datetime";
import { isEuroMillionsDrawPublished } from "./store";
import type { EuroMillionsDraw } from "./types";

/** Combinaison lisible : `7 12 19 33 44 ★ 3 8` */
export function euroMillionsComboText(
  numbers: number[] | undefined,
  stars: number[] | undefined,
): string {
  const n = (numbers || []).join(" ");
  const s = (stars || []).join(" ");
  if (!n) return "";
  return s ? `${n} ★ ${s}` : n;
}

function joinNums(values: number[]): string {
  return values.join(", ");
}

export function euroMillionsDrawPageTitle(
  locale: string,
  prettyDate: string,
  draw: EuroMillionsDraw | null | undefined,
): string {
  if (!isEuroMillionsDrawPublished(draw) || !draw) {
    return pickLocalized(locale, {
      fr: `Résultat EuroMillions du ${prettyDate} : tirage à 21h`,
      en: `EuroMillions result for ${prettyDate}: draw at 9pm`,
    });
  }
  const combo = euroMillionsComboText(draw.numbers, draw.stars);
  return pickLocalized(locale, {
    fr: `Résultat EuroMillions du ${prettyDate} : ${combo}`,
    en: `EuroMillions result for ${prettyDate}: ${combo}`,
  });
}

export function euroMillionsDrawPageDescription(
  locale: string,
  prettyDate: string,
  draw: EuroMillionsDraw | null | undefined,
): string {
  if (!isEuroMillionsDrawPublished(draw) || !draw) {
    return pickLocalized(locale, {
      fr: `Résultat EuroMillions du ${prettyDate} en attente. Numéros, My Million et tableau des gains dès 21h. Site indépendant, 18+.`,
      en: `EuroMillions result for ${prettyDate} pending. Numbers, My Million and prize table from 9pm. Independent site, 18+.`,
    });
  }
  const balls = joinNums(draw.numbers);
  const stars = joinNums(draw.stars);
  const mm = draw.myMillionCode
    ? pickLocalized(locale, {
        fr: `, My Million ${draw.myMillionCode}`,
        en: `, My Million ${draw.myMillionCode}`,
      })
    : "";
  return pickLocalized(locale, {
    fr: `Tirage EuroMillions du ${prettyDate} : boules ${balls}, étoiles ${stars}${mm}. Tableau des 13 rangs. Site indépendant, 18+.`,
    en: `EuroMillions draw on ${prettyDate}: numbers ${balls}, stars ${stars}${mm}. 13 prize tiers. Independent site, 18+.`,
  });
}

export function euroMillionsAdjacentDraws(
  draws: EuroMillionsDraw[],
  date: string,
): { newer: EuroMillionsDraw | null; older: EuroMillionsDraw | null } {
  const list = [...draws]
    .filter(isEuroMillionsDrawPublished)
    .sort((a, b) => b.date.localeCompare(a.date));
  const i = list.findIndex((d) => d.date === date);
  if (i < 0) return { newer: null, older: null };
  return {
    newer: list[i - 1] ?? null,
    older: list[i + 1] ?? null,
  };
}

export function euroMillionsAdjacentLabel(
  locale: string,
  draw: EuroMillionsDraw,
): string {
  const date = formatEuroMillionsLongDate(draw.date, locale);
  const combo = euroMillionsComboText(draw.numbers, draw.stars);
  return combo ? `${date} · ${combo}` : date;
}
