import { GAME_IDENTITY } from "@/lib/fdj-games/identity";
import { formatDrawWhen } from "@/lib/fdj-games/display";
import type { FdjGameDraw } from "@/lib/fdj-games/types";
import { formatEuroMillionsLongDate } from "./datetime";
import type { EuroMillionsDraw } from "./types";

export const SHARE_FEED = { width: 1200, height: 630 } as const;
/** Fil Instagram : portrait 4:5 (le 1200×630 Facebook est trop large). */
export const SHARE_IG_FEED = { width: 1080, height: 1350 } as const;
export const SHARE_STORY = { width: 1080, height: 1920 } as const;

export type ShareLayout = "feed" | "ig" | "story";

export function shareLayout(size: { width: number; height: number }): ShareLayout {
  if (size.height >= 1800) return "story";
  if (size.height > size.width) return "ig";
  return "feed";
}

export type ShareCardInput = {
  kicker: string;
  dateLabel: string;
  accent: string;
  accentInk: string;
  rows: { values: Array<number | string>; outlined?: boolean }[];
  jackpotLabel?: string | null;
  myMillionLabel?: string | null;
  /** Libellé rangée bonus (défaut : LES ÉTOILES). */
  bonusLabel?: string | null;
  /** Forme des valeurs `outlined` (défaut : étoile EuroMillions). */
  bonusShape?: "star" | "ball";
  /** Clip voix du libellé bonus (`etoiles.wav` / `chance.wav`). */
  bonusVoiceClip?: string | null;
};

/** « Jackpot 111 M€ » — assez court pour une carte 9:16. */
export function formatShareJackpot(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const rounded = m >= 20 ? Math.round(m) : Math.round(m * 10) / 10;
    const s = Number.isInteger(rounded)
      ? String(rounded)
      : String(rounded).replace(".", ",");
    return `Jackpot ${s} M€`;
  }
  const euros = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace(/[\u00a0\u202f]/g, " ");
  return `Jackpot ${euros}`;
}

export function euroMillionsShareCard(draw: EuroMillionsDraw): ShareCardInput {
  const id = GAME_IDENTITY.euromillions;
  const jackpot =
    typeof draw.jackpotEur === "number" && draw.jackpotEur > 0
      ? formatShareJackpot(draw.jackpotEur)
      : null;
  const million = draw.myMillionCode?.trim()
    ? `My Million ${draw.myMillionCode.trim()}`
    : null;
  return {
    kicker: "EuroMillions Résultats",
    dateLabel: formatEuroMillionsLongDate(draw.date, "fr"),
    accent: id.accent,
    accentInk: id.accentInk,
    jackpotLabel: jackpot,
    myMillionLabel: million,
    rows: [
      { values: draw.numbers },
      { values: draw.stars, outlined: true },
    ],
  };
}

export function companionShareCard(draw: FdjGameDraw): ShareCardInput {
  const id = GAME_IDENTITY[draw.gameId];
  const title =
    draw.gameId === "loto"
      ? "Loto"
      : draw.gameId === "eurodreams"
        ? "EuroDreams"
        : draw.gameId === "keno"
          ? "Keno"
          : draw.gameId === "crescendo"
            ? "Crescendo"
            : draw.gameId;
  const when = formatDrawWhen(draw, "fr");
  let dateLabel = formatEuroMillionsLongDate(draw.date, "fr");
  if (when.kenoSlot === "midi") dateLabel += " · Midi";
  else if (when.kenoSlot === "soir") dateLabel += " · Soir";
  else if (when.time) dateLabel += ` · ${when.time}`;
  const numbers = draw.groups.filter((g) => g.kind === "numbers" && g.values.length);
  const bonus = draw.groups.find((g) => g.kind === "bonus" && g.values.length);
  const letter = draw.groups.find((g) => g.kind === "letter" && g.values.length);
  const rows: ShareCardInput["rows"] = [];
  const main = numbers.find((g) => g.labelKey !== "secondDraw") || numbers[0];
  if (main?.values.length) rows.push({ values: main.values });
  if (bonus?.values.length) {
    rows.push({
      values: bonus.values,
      outlined: true,
    });
  }
  if (letter?.values.length) rows.push({ values: letter.values, outlined: true });
  const jackpot =
    typeof draw.jackpotEur === "number" && draw.jackpotEur > 0
      ? formatShareJackpot(draw.jackpotEur)
      : null;
  const loto = draw.gameId === "loto";
  const dreams = draw.gameId === "eurodreams";
  return {
    kicker: `${title} · Résultats`,
    dateLabel,
    accent: id.accent,
    accentInk: id.accentInk,
    jackpotLabel: jackpot,
    rows,
    bonusLabel: loto ? "NUMÉRO CHANCE" : dreams ? "NUMÉRO RÊVE" : null,
    bonusShape: loto || dreams ? "ball" : "star",
    bonusVoiceClip: loto ? "chance.wav" : dreams ? "reve.wav" : null,
  };
}
