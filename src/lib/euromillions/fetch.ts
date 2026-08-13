import type { EuroMillionsDraw } from "./types";

function toIsoDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

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
        date: toIsoDate(d.date!),
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
  nextJackpotEur?: number | null;
};

/** UK National Lottery latest draw XML (rich jackpot + next draw). */
export async function fetchUkLatestDraw(): Promise<UkLatestMeta | null> {
  const url =
    "https://www.national-lottery.co.uk/results/euromillions/draw-history/csv";
  const res = await fetch(url, {
    headers: {
      Accept: "application/xml,text/xml,*/*",
      "User-Agent":
        "Mozilla/5.0 (compatible; EuroMillionsResultatsBot/1.0; +https://euromillions-resultats.fr)",
    },
    signal: AbortSignal.timeout(20_000),
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`uk_lottery_${res.status}`);
  const xml = await res.text();
  if (!xml.includes("<draw-results")) return null;

  const date = xml.match(/<draw-date>([^<]+)<\/draw-date>/)?.[1];
  const drawNumber = xml.match(/<draw-number>([^<]+)<\/draw-number>/)?.[1];
  const balls = [...xml.matchAll(/<ball number="\d+">(\d+)<\/ball>/g)].map(
    (m) => Number(m[1]),
  );
  const stars = [
    ...xml.matchAll(/<bonus-ball[^>]*>(\d+)<\/bonus-ball>/g),
  ].map((m) => Number(m[1]));
  const jackpotRaw = xml.match(/<jackpot-amount>([^<]+)<\/jackpot-amount>/)?.[1];
  const nextJpRaw = xml.match(
    /<next-estimated-jackpot>([^<]+)<\/next-estimated-jackpot>/,
  )?.[1];
  const nextDate = xml.match(/<next-draw-date>([^<]+)<\/next-draw-date>/)?.[1];

  if (!date || balls.length < 5 || stars.length < 2) return null;

  const parseMoney = (raw?: string | null) => {
    if (!raw) return null;
    const n = Number(String(raw).replace(/,/g, ""));
    return Number.isFinite(n) ? Math.round(n) : null;
  };

  const draw: EuroMillionsDraw = {
    date: toIsoDate(date),
    drawId: drawNumber,
    numbers: nums(balls.slice(0, 5)),
    stars: nums(stars.slice(0, 2)),
    jackpotEur: parseMoney(jackpotRaw),
    hasWinner: null,
    source: "uk-lottery",
    sourceUrl: url,
    fetchedAt: new Date().toISOString(),
  };

  return {
    draw,
    nextDrawDate: nextDate ? toIsoDate(nextDate) : null,
    nextJackpotEur: parseMoney(nextJpRaw),
  };
}
