import { FDJ_COMPANION_GAMES, mapResultMeta, type FdjGameCatalogEntry } from "./catalog";
import type { FdjCompanionGameId, FdjGameDraw, FdjResultGroup } from "./types";

function toIsoDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

type FdjAmount = {
  value?: number;
  currency?: string;
  scale?: number;
  annuity_value?: number;
  annuity_period?: string;
  annuity_duration?: number;
};
type FdjResult = { type?: string; numbers?: string[] };
type FdjDraw = {
  id?: string;
  external_id?: string;
  planned_at?: string;
  results?: FdjResult[];
  estimated_jackpot?: FdjAmount[];
  guaranteed_amounts?: FdjAmount[];
};

function amountEur(list?: FdjAmount[]): number | null {
  const eur = (list || []).find((a) => a.currency === "EUR");
  if (!eur) return null;
  if (typeof eur.value === "number") {
    const scale = typeof eur.scale === "number" ? eur.scale : 0;
    return Math.round(eur.value / 10 ** scale);
  }
  if (typeof eur.annuity_value === "number") {
    const scale = typeof eur.scale === "number" ? eur.scale : 0;
    return Math.round(eur.annuity_value / 10 ** scale);
  }
  return null;
}

function annuityNote(list?: FdjAmount[]): string | null {
  const eur = (list || []).find(
    (a) => a.currency === "EUR" && typeof a.annuity_value === "number",
  );
  if (!eur || typeof eur.annuity_value !== "number") return null;
  const scale = typeof eur.scale === "number" ? eur.scale : 0;
  const monthly = Math.round(eur.annuity_value / 10 ** scale);
  const months = eur.annuity_duration || 360;
  const years = Math.round(months / 12);
  return `${monthly}|${years}`;
}

function parseGroup(
  result: FdjResult,
  skipTypes: string[] | undefined,
): FdjResultGroup | null {
  const type = String(result.type || "").trim();
  if (!type) return null;
  if ((skipTypes || []).some((s) => type.toLowerCase().includes(s))) {
    return null;
  }
  const meta = mapResultMeta(type);
  const raw = result.numbers || [];
  if (!raw.length) return null;

  if (meta.kind === "letter" || meta.kind === "code") {
    return {
      type,
      kind: meta.kind,
      labelKey: meta.labelKey,
      values: raw.map((v) => String(v).trim()).filter(Boolean),
    };
  }

  const nums = raw
    .map((v) => Number(String(v).replace(/\s+/g, "")))
    .filter((n) => Number.isFinite(n));
  if (!nums.length) {
    return {
      type,
      kind: "other",
      labelKey: meta.labelKey,
      values: raw.map(String),
    };
  }
  const sorted = [...nums].sort((a, b) => a - b);
  return {
    type,
    kind: meta.kind,
    labelKey: meta.labelKey,
    values: sorted,
  };
}

function parseDraw(
  game: FdjGameCatalogEntry,
  d: FdjDraw,
  fetchedAt: string,
): FdjGameDraw | null {
  if (!d.planned_at || !d.results?.length) return null;
  const groups = d.results
    .map((r) => parseGroup(r, game.skipTypes))
    .filter((g): g is FdjResultGroup => Boolean(g));
  if (!groups.length) return null;
  const jackpotEur =
    amountEur(d.estimated_jackpot) ?? amountEur(d.guaranteed_amounts);
  const note = annuityNote(d.guaranteed_amounts);
  return {
    gameId: game.id,
    date: toIsoDate(d.planned_at),
    plannedAt: d.planned_at,
    drawId: d.external_id || d.id,
    jackpotEur,
    jackpotNote: note,
    groups,
    source: "fdj",
    fetchedAt,
  };
}

export async function fetchFdjCompanionDraws(
  gameId: FdjCompanionGameId,
  size = 20,
  toPlannedAt = "now",
): Promise<FdjGameDraw[]> {
  const game = FDJ_COMPANION_GAMES.find((g) => g.id === gameId);
  if (!game) return [];
  const capped = Math.min(Math.max(size, 1), 20);
  const cursor = encodeURIComponent(toPlannedAt);
  const url =
    `https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/draws` +
    `?game_name=${encodeURIComponent(game.apiName)}` +
    `&include=results%2Cshares&to_planned_at=${cursor}` +
    `&sort=planned_at%3Adesc&size=${capped}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "EuroMillionsResultatsBot/1.0 (+https://euromillions-resultats.fr)",
    },
    signal: AbortSignal.timeout(25_000),
    next: { revalidate: 0 },
  });
  if (res.status === 204) return [];
  if (!res.ok) throw new Error(`fdj_${game.apiName}_${res.status}`);
  const data = (await res.json()) as FdjDraw[];
  if (!Array.isArray(data)) return [];
  const now = new Date().toISOString();
  const out: FdjGameDraw[] = [];
  for (const d of data) {
    const parsed = parseDraw(game, d, now);
    if (parsed) out.push(parsed);
  }
  return out;
}

/** Pages of 20 until `maxDraws` or the API stops. */
export async function fetchFdjCompanionHistory(
  gameId: FdjCompanionGameId,
  maxDraws = 120,
): Promise<FdjGameDraw[]> {
  const acc: FdjGameDraw[] = [];
  let cursor = "now";
  for (let page = 0; page < 8 && acc.length < maxDraws; page += 1) {
    const batch = await fetchFdjCompanionDraws(gameId, 20, cursor);
    if (!batch.length) break;
    acc.push(...batch);
    const oldest = batch[batch.length - 1];
    if (!oldest?.plannedAt || batch.length < 20) break;
    cursor = oldest.plannedAt;
    await new Promise((r) => setTimeout(r, 250));
  }
  return acc;
}
