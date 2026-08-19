export const ALERT_GAME_IDS = [
  "euromillions",
  "loto",
  "eurodreams",
  "keno",
  "crescendo",
] as const;

export type AlertGameId = (typeof ALERT_GAME_IDS)[number];

const LABELS: Record<AlertGameId, { fr: string; en: string }> = {
  euromillions: { fr: "EuroMillions", en: "EuroMillions" },
  loto: { fr: "Loto", en: "Loto" },
  eurodreams: { fr: "EuroDreams", en: "EuroDreams" },
  keno: { fr: "Keno", en: "Keno" },
  crescendo: { fr: "Crescendo", en: "Crescendo" },
};

export function isAlertGameId(value: string): value is AlertGameId {
  return (ALERT_GAME_IDS as readonly string[]).includes(value);
}

export function parseAlertGames(raw: unknown): AlertGameId[] {
  const list = Array.isArray(raw) ? raw : [];
  const out: AlertGameId[] = [];
  for (const item of list) {
    const id = String(item || "").trim();
    if (isAlertGameId(id) && !out.includes(id)) out.push(id);
  }
  return out;
}

export function defaultAlertGames(): AlertGameId[] {
  return ["euromillions"];
}

export function subscriberGames(games: AlertGameId[] | undefined): AlertGameId[] {
  return games?.length ? games : defaultAlertGames();
}

export function gamesEqual(a: AlertGameId[], b: AlertGameId[]): boolean {
  return [...a].sort().join("|") === [...b].sort().join("|");
}

export function alertGameLabel(id: AlertGameId, locale: string): string {
  const row = LABELS[id];
  return locale === "en" ? row.en : row.fr;
}

export function companionAlertSlug(id: Exclude<AlertGameId, "euromillions">): string {
  return id;
}
