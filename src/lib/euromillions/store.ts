import { promises as fs } from "fs";
import path from "path";
import type { EuroMillionsDraw, EuroMillionsStore } from "./types";

const SEED: EuroMillionsStore = {
  updatedAt: new Date().toISOString(),
  latest: null,
  nextDrawDate: null,
  nextJackpotEur: null,
  draws: [],
};

function dataPath() {
  return (
    process.env.EUROMILLIONS_DATA_PATH?.trim() ||
    path.join(process.cwd(), "data", "euromillions.json")
  );
}

export async function readEuroMillionsStore(): Promise<EuroMillionsStore> {
  try {
    const raw = await fs.readFile(dataPath(), "utf8");
    const parsed = JSON.parse(raw) as EuroMillionsStore;
    if (!parsed?.draws || !Array.isArray(parsed.draws)) return { ...SEED };
    return parsed;
  } catch {
    return { ...SEED, draws: [] };
  }
}

export async function writeEuroMillionsStore(
  store: EuroMillionsStore,
): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(store, null, 2) + "\n", "utf8");
}

/** Fiche indexable « en attente » (pas encore de boules). */
export function isEuroMillionsDrawPublished(
  draw: EuroMillionsDraw | null | undefined,
): boolean {
  return Boolean(draw && draw.numbers.length === 5 && draw.stars.length === 2);
}

export function upcomingDrawPlaceholder(
  date: string,
  jackpotEur?: number | null,
): EuroMillionsDraw {
  return {
    date,
    numbers: [],
    stars: [],
    jackpotEur: jackpotEur ?? null,
    source: "manual",
    fetchedAt: new Date().toISOString(),
  };
}

export function getLatestDraw(
  store: EuroMillionsStore,
): EuroMillionsDraw | null {
  if (isEuroMillionsDrawPublished(store.latest)) return store.latest!;
  return store.draws.find(isEuroMillionsDrawPublished) || null;
}

export function getDrawByDate(
  store: EuroMillionsStore,
  date: string,
): EuroMillionsDraw | undefined {
  return store.draws.find((d) => d.date === date);
}

/** Fiche réelle, ou placeholder si c’est le prochain tirage connu. */
export function resolveDrawPage(
  store: EuroMillionsStore,
  date: string,
): EuroMillionsDraw | undefined {
  const found = getDrawByDate(store, date);
  if (found) return found;
  if (store.nextDrawDate === date) {
    return upcomingDrawPlaceholder(date, store.nextJackpotEur);
  }
  return undefined;
}

export function sortDrawsNewest(draws: EuroMillionsDraw[]): EuroMillionsDraw[] {
  return [...draws].sort((a, b) => b.date.localeCompare(a.date));
}
