import { inflateRawSync } from "node:zlib";
import type { EuroMillionsDraw } from "./types";

const FDJ_UA =
  "EuroMillionsResultatsBot/1.0 (+https://euromillions-resultats.fr)";
const HISTORIQUE_URL =
  "https://www.fdj.fr/jeux-de-tirage/euromillions-my-million/historique";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function foldHeader(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function decodeText(data: Buffer): string {
  if (data.length >= 3 && data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf) {
    return data.subarray(3).toString("utf8");
  }
  const utf8 = data.toString("utf8");
  if (!utf8.includes("\uFFFD")) return utf8;
  return data.toString("latin1");
}

function findEocd(buf: Buffer): number {
  const min = Math.max(0, buf.length - 65557);
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) return i;
  }
  throw new Error("zip_eocd");
}

/** Extraire les CSV d’un ZIP FDJ (deflate, data descriptor). */
export function unzipCsvTexts(buf: Buffer): { name: string; text: string }[] {
  const eocd = findEocd(buf);
  const entries = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out: { name: string; text: string }[] = [];
  for (let i = 0; i < entries; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("zip_central");
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const name = buf.subarray(p + 46, p + 46 + nameLen).toString("utf8");
    p += 46 + nameLen + extraLen + commentLen;
    if (!name.toLowerCase().endsWith(".csv")) continue;
    if (buf.readUInt32LE(localOff) !== 0x04034b50) throw new Error("zip_local");
    const localNameLen = buf.readUInt16LE(localOff + 26);
    const localExtra = buf.readUInt16LE(localOff + 28);
    const dataStart = localOff + 30 + localNameLen + localExtra;
    const compressed = buf.subarray(dataStart, dataStart + compSize);
    const data =
      method === 0
        ? compressed
        : method === 8
          ? inflateRawSync(compressed)
          : null;
    if (!data) continue;
    out.push({ name, text: decodeText(Buffer.from(data)) });
  }
  return out;
}

function parseFrDate(raw: string): string | null {
  const m = String(raw || "")
    .trim()
    .match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return null;
  const dd = m[1].padStart(2, "0");
  const mm = m[2].padStart(2, "0");
  let year = m[3];
  if (year.length === 2) year = String(2000 + Number(year));
  if (year.length !== 4) return null;
  return `${year}-${mm}-${dd}`;
}

function normalizeDisplayCode(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().toUpperCase();
}

function col(row: string[], headers: string[], ...aliases: string[]): string {
  for (const a of aliases) {
    const i = headers.indexOf(a);
    if (i >= 0 && row[i]) return row[i].trim();
  }
  return "";
}

export function parseFdjArchiveCsv(
  text: string,
  sourceUrl: string,
  fetchedAt: string,
): EuroMillionsDraw[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(";").map(foldHeader);
  const dateIdx = headers.findIndex((h) => h === "date_de_tirage");
  const mmIdx = headers.findIndex(
    (h) => h === "numero_my_million" || h.includes("my_million"),
  );
  if (dateIdx < 0 || mmIdx < 0) return [];

  const out: EuroMillionsDraw[] = [];
  const seen = new Set<string>();
  for (const line of lines.slice(1)) {
    const row = line.split(";");
    const codeRaw = (row[mmIdx] || "").trim();
    if (!codeRaw) continue;
    const date = parseFrDate(row[dateIdx] || "");
    if (!date || seen.has(date)) continue;
    const numbers = [1, 2, 3, 4, 5]
      .map((n) => Number(col(row, headers, `boule_${n}`)))
      .filter((n) => Number.isFinite(n) && n > 0)
      .sort((a, b) => a - b);
    const stars = [1, 2]
      .map((n) => Number(col(row, headers, `etoile_${n}`)))
      .filter((n) => Number.isFinite(n) && n > 0)
      .sort((a, b) => a - b);
    if (numbers.length !== 5 || stars.length !== 2) continue;
    seen.add(date);
    const euroWinners = Number(
      col(
        row,
        headers,
        "nombre_de_gagnant_au_rang1_euro_millions_en_europe",
      ).replace(",", "."),
    );
    out.push({
      date,
      drawId: col(row, headers, "annee_numero_de_tirage") || undefined,
      numbers,
      stars,
      jackpotEur: null,
      hasWinner: Number.isFinite(euroWinners) ? euroWinners > 0 : null,
      myMillionCode: normalizeDisplayCode(codeRaw),
      source: "fdj",
      sourceUrl,
      fetchedAt,
    });
  }
  return out;
}

export async function discoverFdjArchiveUrls(): Promise<string[]> {
  const res = await fetch(HISTORIQUE_URL, {
    headers: {
      Accept: "text/html",
      "User-Agent": FDJ_UA,
    },
    signal: AbortSignal.timeout(25_000),
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`fdj_historique_${res.status}`);
  const html = await res.text();
  const urls = new Set<string>();
  const re =
    /href="(https:\/\/www\.sto\.api\.fdj\.fr\/anonymous\/service-draw-info\/v3\/documentations\/[^"]+)"/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) urls.add(m[1]);
  return [...urls];
}

/**
 * Archives ZIP officielles FDJ (codes My Million depuis 2014).
 * L’API live ne conserve qu’~18 tirages.
 */
export async function fetchFdjEuroMillionsArchiveDraws(): Promise<
  EuroMillionsDraw[]
> {
  const urls = await discoverFdjArchiveUrls();
  if (!urls.length) return [];
  const fetchedAt = new Date().toISOString();
  const byDate = new Map<string, EuroMillionsDraw>();
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/zip,*/*", "User-Agent": FDJ_UA },
        signal: AbortSignal.timeout(30_000),
        next: { revalidate: 0 },
      });
      if (!res.ok) throw new Error(`fdj_archive_${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      for (const csv of unzipCsvTexts(buf)) {
        for (const d of parseFdjArchiveCsv(csv.text, url, fetchedAt)) {
          const prev = byDate.get(d.date);
          if (!prev || (d.myMillionCode && !prev.myMillionCode)) {
            byDate.set(d.date, d);
          }
        }
      }
    } catch (err) {
      console.error("euromillions_fdj_archive_fail", url, err);
    }
    await sleep(400);
  }
  return [...byDate.values()];
}
