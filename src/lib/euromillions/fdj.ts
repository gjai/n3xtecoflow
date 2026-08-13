import type { EuroMillionsDraw, MyMillionWinner } from "./types";

function toIsoDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function nums(values: Array<string | number>): number[] {
  return values
    .map((v) => Number(String(v).replace(/\s+/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);
}

function normalizeMyMillionCode(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().toUpperCase();
}

type FdjAmount = { value?: number; currency?: string; scale?: number };
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
  if (!eur || typeof eur.value !== "number") return null;
  const scale = typeof eur.scale === "number" ? eur.scale : 0;
  return Math.round(eur.value / 10 ** scale);
}

/** FDJ anonymous API — boules + code My Million (FR). */
export async function fetchFdjEuroMillionsDraws(
  size = 20,
): Promise<EuroMillionsDraw[]> {
  const capped = Math.min(Math.max(size, 1), 20);
  const url =
    `https://www.sto.api.fdj.fr/anonymous/service-draw-info/v3/draws` +
    `?game_name=euromillions&include=results%2Cshares&to_planned_at=now` +
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
  if (!res.ok) throw new Error(`fdj_draws_${res.status}`);
  const data = (await res.json()) as FdjDraw[];
  if (!Array.isArray(data)) return [];
  const now = new Date().toISOString();
  const out: EuroMillionsDraw[] = [];
  for (const d of data) {
    if (!d.planned_at || !d.results?.length) continue;
    const main = d.results.find((r) => r.type === "numeros principaux");
    const stars = d.results.find((r) => r.type === "etoile");
    const mm = d.results.find((r) => r.type === "mymillion");
    const numbers = nums(main?.numbers || []);
    const starNums = nums(stars?.numbers || []);
    if (numbers.length !== 5 || starNums.length !== 2) continue;
    const codeRaw = mm?.numbers?.[0];
    out.push({
      date: toIsoDate(d.planned_at),
      drawId: d.external_id || d.id,
      numbers,
      stars: starNums,
      jackpotEur:
        amountEur(d.estimated_jackpot) ?? amountEur(d.guaranteed_amounts),
      hasWinner: null,
      myMillionCode: codeRaw ? normalizeMyMillionCode(codeRaw) : null,
      source: "fdj",
      sourceUrl: url,
      fetchedAt: now,
    });
  }
  return out;
}

/**
 * Localisations gagnants My Million (annonces Mag FDJ).
 * Pas le code — titres type « Calvados : une gagnante… ».
 */
export async function fetchFdjMyMillionWinnerLocations(): Promise<
  MyMillionWinner[]
> {
  const url =
    "https://www.fdj.fr/jeux-de-tirage/euromillions-my-million/resultats";
  const res = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent":
        "Mozilla/5.0 (compatible; EuroMillionsResultatsBot/1.0; +https://euromillions-resultats.fr)",
    },
    signal: AbortSignal.timeout(25_000),
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`fdj_mag_${res.status}`);
  const html = await res.text();
  const byKey = new Map<string, MyMillionWinner>();

  // Carousel cards: href + nearby heading
  const cardRe =
    /href="(\/mag\/gagnants\/[^"]*my-million[^"]*)"[\s\S]{0,1200}?text-heading-md">([^<]+)</gi;
  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html))) {
    const path = m[1];
    const title = m[2].replace(/&#x27;/g, "'").replace(/&amp;/g, "&").trim();
    if (!/my\s*million/i.test(title)) continue;
    if (/rang\s*2|remporte\s+\d[\d\s]*\s*m/i.test(title) && !/1\s*m/i.test(title)) {
      // keep 1M My Million; skip other jackpot stories if any slip in
    }
    const location = extractLocationFromTitle(title);
    const date = dateFromWinnerSlug(path);
    byKey.set(path, {
      title,
      location,
      date,
      sourceUrl: `https://www.fdj.fr${path}`,
      fetchedAt: new Date().toISOString(),
    });
  }

  // Fallback: headings alone + previous href within window
  if (byKey.size === 0) {
    const titles = [
      ...html.matchAll(/text-heading-md">([^<]*My Million[^<]*)</gi),
    ];
    for (const tm of titles) {
      const title = tm[1].replace(/&#x27;/g, "'").trim();
      const before = html.slice(Math.max(0, tm.index! - 800), tm.index!);
      const hm = before.match(/href="(\/mag\/gagnants\/[^"]+)"[^>]*>[^<]*$/);
      const path =
        hm?.[1] ||
        before.match(/href="(\/mag\/gagnants\/[^"]*my-million[^"]*)"/i)?.[1];
      if (!path) continue;
      byKey.set(path, {
        title,
        location: extractLocationFromTitle(title),
        date: dateFromWinnerSlug(path),
        sourceUrl: `https://www.fdj.fr${path}`,
        fetchedAt: new Date().toISOString(),
      });
    }
  }

  return [...byKey.values()].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );
}

function extractLocationFromTitle(title: string): string | null {
  if (/internet/i.test(title)) return "Internet (FDJ.fr)";

  const prefix = title.match(
    /^([A-ZÀ-Ÿ][\wÀ-ÿ'’-]+(?:[\s-][A-ZÀ-Ÿ][\wÀ-ÿ'’-]+)*)\s*:/,
  );
  if (
    prefix?.[1] &&
    !/^(Nouveau|Une?|Un|Code|Félicitations|EuroMillions|My)/i.test(prefix[1])
  ) {
    return prefix[1].trim();
  }

  const m = title.match(
    /\b(?:dans le|dans la|en|à|au)\b\s+([A-ZÀ-Ÿ][\wÀ-ÿ'’]*(?:-[\wÀ-ÿ'’]+)*)/,
  );
  if (m?.[1]) {
    const loc = m[1].trim();
    if (!/^(My|Million|EuroMillions|FDJ|un|une|le|la)/i.test(loc)) {
      return loc;
    }
  }
  return null;
}

/** Slugs like …-calvados-130126 or …-030426 */
function dateFromWinnerSlug(path: string): string | null {
  const m = path.match(/(\d{6})(?:-|$)/);
  if (!m) return null;
  const raw = m[1];
  const dd = Number(raw.slice(0, 2));
  const mm = Number(raw.slice(2, 4));
  const yy = Number(raw.slice(4, 6));
  if (dd < 1 || dd > 31 || mm < 1 || mm > 12) return null;
  const year = 2000 + yy;
  return `${year}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}
