import { toParisIsoDate } from "./datetime";
import type { EuroMillionsDraw } from "./types";

function nums(values: Array<string | number>): number[] {
  return values
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

type PedroDraw = {
  date?: string;
  draw_id?: number | string;
  id?: number;
  numbers?: string[];
  stars?: string[];
  prize?: number | null;
  has_winner?: boolean | null;
};

/** Historical JSON API (community) — rate-limited. */
export async function fetchPedroMealhaDraws(
  year?: number,
): Promise<EuroMillionsDraw[]> {
  const y = year || new Date().getFullYear();
  const url = `https://euromillions.api.pedromealha.dev/draws?year=${y}`;
  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "EuroMillionsResultatsBot/1.0 (+https://euromillions-resultats.fr)",
      },
      signal: AbortSignal.timeout(25_000),
      next: { revalidate: 0 },
    });
    if (res.status === 429) {
      lastErr = new Error("pedromealha_429");
      await new Promise((r) => setTimeout(r, 12_000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) {
      throw new Error(`pedromealha_${res.status}`);
    }
    const data = (await res.json()) as PedroDraw[];
    if (!Array.isArray(data)) return [];
    const now = new Date().toISOString();
    return data
      .filter((d) => d.date && d.numbers?.length === 5 && d.stars?.length === 2)
      .map((d) => ({
        date: toParisIsoDate(d.date!),
        drawId: d.draw_id ?? d.id,
        numbers: nums(d.numbers || []),
        stars: nums(d.stars || []),
        jackpotEur:
          typeof d.prize === "number" && Number.isFinite(d.prize)
            ? Math.round(d.prize)
            : null,
        hasWinner: d.has_winner ?? null,
        source: "pedromealha" as const,
        sourceUrl: url,
        fetchedAt: now,
      }));
  }
  throw lastErr || new Error("pedromealha_failed");
}

export type UkLatestMeta = {
  draw: EuroMillionsDraw;
  nextDrawDate?: string | null;
};

const UK_MONTHS: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

function parseUkDrawDate(raw: string): string | null {
  const t = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10);
  const m = t.match(/^(\d{1,2})[- /]([A-Za-z]{3})[- /](\d{4})$/);
  if (!m) return null;
  const mo = UK_MONTHS[m[2]!.toLowerCase()];
  if (!mo) return null;
  return `${m[3]}-${mo}-${m[1]!.padStart(2, "0")}`;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]!;
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

function parseUkXml(xml: string, sourceUrl: string): UkLatestMeta | null {
  const dateRaw = xml.match(/<draw-date>([^<]+)<\/draw-date>/)?.[1];
  const drawNumber = xml.match(/<draw-number>([^<]+)<\/draw-number>/)?.[1];
  const balls = [...xml.matchAll(/<ball number="\d+">(\d+)<\/ball>/g)].map(
    (m) => Number(m[1]),
  );
  const stars = [
    ...xml.matchAll(/<bonus-ball[^>]*>(\d+)<\/bonus-ball>/g),
  ].map((m) => Number(m[1]));
  const nextDate = xml.match(/<next-draw-date>([^<]+)<\/next-draw-date>/)?.[1];
  const date = dateRaw ? parseUkDrawDate(dateRaw) : null;
  if (!date || balls.length < 5 || stars.length < 2) return null;
  return {
    draw: {
      date,
      drawId: drawNumber,
      numbers: nums(balls.slice(0, 5)),
      stars: nums(stars.slice(0, 2)),
      jackpotEur: null,
      hasWinner: null,
      source: "uk-lottery",
      sourceUrl,
      fetchedAt: new Date().toISOString(),
    },
    nextDrawDate: nextDate ? parseUkDrawDate(nextDate) : null,
  };
}

function parseUkCsv(text: string, sourceUrl: string): UkLatestMeta | null {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return null;
  const header = parseCsvLine(lines[0]!).map((h) => h.toLowerCase());
  const row = parseCsvLine(lines[1]!);
  const col = (pred: (h: string) => boolean): string | undefined => {
    const i = header.findIndex(pred);
    return i >= 0 ? row[i] : undefined;
  };
  const date = parseUkDrawDate(col((h) => h.includes("draw") && h.includes("date")) || "");
  const balls = [1, 2, 3, 4, 5]
    .map((n) => Number(col((h) => h === `ball ${n}` || h === `ball${n}`)))
    .filter((n) => Number.isFinite(n) && n > 0);
  const stars = [1, 2]
    .map((n) =>
      Number(
        col(
          (h) =>
            h === `lucky star ${n}` ||
            h === `luckystar ${n}` ||
            h === `star ${n}` ||
            h === `lucky star${n}`,
        ),
      ),
    )
    .filter((n) => Number.isFinite(n) && n > 0);
  const drawNumber = col((h) => h.includes("draw") && h.includes("number"));
  if (!date || balls.length < 5 || stars.length < 2) return null;
  return {
    draw: {
      date,
      drawId: drawNumber,
      numbers: nums(balls.slice(0, 5)),
      stars: nums(stars.slice(0, 2)),
      jackpotEur: null,
      hasWinner: null,
      source: "uk-lottery",
      sourceUrl,
      fetchedAt: new Date().toISOString(),
    },
  };
}

/** CSV officiel, parfois encore servi en XML. Jackpot UK = £, jamais stocké en €. */
export function parseUkLatestPayload(
  body: string,
  sourceUrl: string,
): UkLatestMeta | null {
  if (body.includes("<draw-results")) return parseUkXml(body, sourceUrl);
  return parseUkCsv(body, sourceUrl);
}

export async function fetchUkLatestDraw(): Promise<UkLatestMeta | null> {
  const url =
    "https://www.national-lottery.co.uk/results/euromillions/draw-history/csv";
  const res = await fetch(url, {
    headers: {
      Accept: "text/csv,application/xml,text/xml,*/*",
      "User-Agent":
        "Mozilla/5.0 (compatible; EuroMillionsResultatsBot/1.0; +https://euromillions-resultats.fr)",
    },
    signal: AbortSignal.timeout(20_000),
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`uk_lottery_${res.status}`);
  return parseUkLatestPayload(await res.text(), url);
}
