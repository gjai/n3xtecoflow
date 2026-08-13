import { fetchPedroMealhaDraws, fetchUkLatestDraw } from "./fetch";
import {
  readEuroMillionsStore,
  sortDrawsNewest,
  writeEuroMillionsStore,
} from "./store";
import type { EuroMillionsDraw, EuroMillionsStore } from "./types";

export type EuroMillionsRefreshResult = {
  ok: true;
  draws: number;
  latest: string | null;
  sources: string[];
  yearsFetched: number[];
};

function mergeDraws(
  existing: EuroMillionsDraw[],
  incoming: EuroMillionsDraw[],
): EuroMillionsDraw[] {
  const byDate = new Map<string, EuroMillionsDraw>();
  for (const d of existing) byDate.set(d.date, d);
  for (const d of incoming) {
    const prev = byDate.get(d.date);
    if (!prev) {
      byDate.set(d.date, d);
      continue;
    }
    // Prefer richer jackpot / UK latest overlay
    byDate.set(d.date, {
      ...prev,
      ...d,
      numbers: d.numbers.length === 5 ? d.numbers : prev.numbers,
      stars: d.stars.length === 2 ? d.stars : prev.stars,
      jackpotEur: d.jackpotEur ?? prev.jackpotEur,
      hasWinner: d.hasWinner ?? prev.hasWinner,
      drawId: d.drawId ?? prev.drawId,
    });
  }
  return sortDrawsNewest([...byDate.values()]);
}

export async function refreshEuroMillionsData(options?: {
  years?: number[];
}): Promise<EuroMillionsRefreshResult> {
  const store = await readEuroMillionsStore();
  const yearNow = new Date().getFullYear();
  const years = options?.years?.length
    ? options.years
    : [yearNow, yearNow - 1, yearNow - 2];

  const sources: string[] = [];
  let incoming: EuroMillionsDraw[] = [];
  const yearsFetched: number[] = [];

  for (const year of years) {
    try {
      const batch = await fetchPedroMealhaDraws(year);
      incoming = incoming.concat(batch);
      yearsFetched.push(year);
      sources.push(`pedromealha:${year}`);
      // Soft throttle for rate limits
      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      console.error("euromillions_pedro_year_fail", year, err);
    }
  }

  let nextDrawDate = store.nextDrawDate ?? null;
  let nextJackpotEur = store.nextJackpotEur ?? null;
  try {
    const uk = await fetchUkLatestDraw();
    if (uk?.draw) {
      incoming.push(uk.draw);
      sources.push("uk-lottery:latest");
      nextDrawDate = uk.nextDrawDate ?? nextDrawDate;
      nextJackpotEur = uk.nextJackpotEur ?? nextJackpotEur;
    }
  } catch (err) {
    console.error("euromillions_uk_fail", err);
  }

  const draws = mergeDraws(store.draws, incoming);
  const latest = draws[0] || null;
  const next: EuroMillionsStore = {
    updatedAt: new Date().toISOString(),
    latest,
    nextDrawDate,
    nextJackpotEur,
    draws,
  };
  await writeEuroMillionsStore(next);

  return {
    ok: true,
    draws: draws.length,
    latest: latest?.date || null,
    sources,
    yearsFetched,
  };
}
