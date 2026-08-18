import { pickLocalized } from "@/i18n/locales";
import { formatEuroMillionsLongDate } from "@/lib/euromillions/datetime";
import { formatDrawWhen } from "./display";
import type { FdjCompanionGameId, FdjGameDraw } from "./types";

function kenoSlotLabel(locale: string, slot: "midi" | "soir"): string {
  if (slot === "midi") {
    return pickLocalized(locale, {
      fr: "midi",
      en: "lunchtime",
      it: "mezzogiorno",
      es: "mediodía",
      pt: "meio-dia",
      de: "Mittag",
      nl: "middag",
    });
  }
  return pickLocalized(locale, {
    fr: "soir",
    en: "evening",
    it: "sera",
    es: "noche",
    pt: "noite",
    de: "Abend",
    nl: "avond",
  });
}

/** Date (et créneau Keno / heure Crescendo) pour title + H1. */
export function companionDrawDateLabel(
  locale: string,
  gameId: FdjCompanionGameId,
  draw: FdjGameDraw,
): string {
  const date = formatEuroMillionsLongDate(draw.date, locale);
  const when = formatDrawWhen(draw, locale);
  if (gameId === "keno" && when.kenoSlot) {
    return `${date} · ${kenoSlotLabel(locale, when.kenoSlot)}`;
  }
  if (gameId === "crescendo" && when.time) {
    return `${date} · ${when.time}`;
  }
  return date;
}

export function companionHubTitle(
  locale: string,
  gameLabel: string,
  dateLabel: string | null,
): string {
  if (!dateLabel) {
    return pickLocalized(locale, {
      fr: `Résultats ${gameLabel}`,
      en: `${gameLabel} results`,
      it: `Risultati ${gameLabel}`,
      es: `Resultados ${gameLabel}`,
      pt: `Resultados ${gameLabel}`,
      de: `${gameLabel}-Ergebnisse`,
      nl: `${gameLabel}-uitslagen`,
    });
  }
  return pickLocalized(locale, {
    fr: `Résultats ${gameLabel} du ${dateLabel}`,
    en: `${gameLabel} results for ${dateLabel}`,
    it: `Risultati ${gameLabel} del ${dateLabel}`,
    es: `Resultados ${gameLabel} del ${dateLabel}`,
    pt: `Resultados ${gameLabel} de ${dateLabel}`,
    de: `${gameLabel}-Ergebnisse vom ${dateLabel}`,
    nl: `${gameLabel}-uitslagen van ${dateLabel}`,
  });
}

export function companionHubDescription(
  locale: string,
  gameLabel: string,
  dateLabel: string | null,
): string {
  if (!dateLabel) {
    return pickLocalized(locale, {
      fr: `Derniers résultats ${gameLabel} — site indépendant, 18+.`,
      en: `Latest ${gameLabel} results — independent site, 18+.`,
      it: `Ultimi risultati ${gameLabel} — sito indipendente, 18+.`,
      es: `Últimos resultados ${gameLabel} — sitio independiente, 18+.`,
      pt: `Últimos resultados ${gameLabel} — site independente, 18+.`,
      de: `Aktuelle ${gameLabel}-Ergebnisse — unabhängig, 18+.`,
      nl: `Laatste ${gameLabel}-uitslagen — onafhankelijk, 18+.`,
    });
  }
  return pickLocalized(locale, {
    fr: `Résultats ${gameLabel} du ${dateLabel} — numéros et archives. Site indépendant, 18+.`,
    en: `${gameLabel} results for ${dateLabel} — numbers and archive. Independent site, 18+.`,
    it: `Risultati ${gameLabel} del ${dateLabel} — numeri e archivio. Sito indipendente, 18+.`,
    es: `Resultados ${gameLabel} del ${dateLabel} — números y archivo. Sitio independiente, 18+.`,
    pt: `Resultados ${gameLabel} de ${dateLabel} — números e arquivo. Site independente, 18+.`,
    de: `${gameLabel}-Ergebnisse vom ${dateLabel} — Zahlen und Archiv. Unabhängig, 18+.`,
    nl: `${gameLabel}-uitslagen van ${dateLabel} — getallen en archief. Onafhankelijk, 18+.`,
  });
}
