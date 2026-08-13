import { refreshFdjCompanionGames } from "@/lib/fdj-games/refresh";
import { readFdjGamesStore } from "@/lib/fdj-games/store";
import {
  fetchFdjEuroMillionsDraws,
  fetchFdjMyMillionWinnerLocations,
} from "./fdj";
import { fetchPedroMealhaDraws, fetchUkLatestDraw } from "./fetch";
import { lotteryFingerprint } from "./fingerprint";
import { revalidateLotteryPages } from "./live";
import {
  readEuroMillionsStore,
  sortDrawsNewest,
  writeEuroMillionsStore,
} from "./store";
import type {
  EuroMillionsDraw,
  EuroMillionsStore,
  MyMillionWinner,
} from "./types";

export type EuroMillionsRefreshResult = {
  ok: true;
  draws: number;
  latest: string | null;
  sources: string[];
  yearsFetched: number[];
  myMillionWinners: number;
  companionGames?: Record<string, number>;
  mode: "full" | "fast";
  changed: boolean;
  fingerprint: string;
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
    byDate.set(d.date, {
      ...prev,
      ...d,
      numbers: d.numbers.length === 5 ? d.numbers : prev.numbers,
      stars: d.stars.length === 2 ? d.stars : prev.stars,
      jackpotEur: d.jackpotEur ?? prev.jackpotEur,
      hasWinner: d.hasWinner ?? prev.hasWinner,
      drawId: d.drawId ?? prev.drawId,
      myMillionCode: d.myMillionCode ?? prev.myMillionCode,
      myMillionLocation: d.myMillionLocation ?? prev.myMillionLocation,
      prizeTiers:
        d.prizeTiers?.length ? d.prizeTiers : prev.prizeTiers,
      // Prefer FDJ when it has My Million / FR jackpot
      source:
        d.source === "fdj" || prev.source === "fdj"
          ? "fdj"
          : d.source || prev.source,
    });
  }
  return sortDrawsNewest([...byDate.values()]);
}

function attachWinnerLocations(
  draws: EuroMillionsDraw[],
  winners: MyMillionWinner[],
): EuroMillionsDraw[] {
  const byDate = new Map<string, MyMillionWinner>();
  for (const w of winners) {
    if (w.date && !byDate.has(w.date)) byDate.set(w.date, w);
  }
  return draws.map((d) => {
    const w = byDate.get(d.date);
    if (!w?.location) return d;
    return { ...d, myMillionLocation: d.myMillionLocation || w.location };
  });
}

export async function refreshEuroMillionsData(options?: {
  years?: number[];
  mode?: "full" | "fast";
}): Promise<EuroMillionsRefreshResult> {
  const fast = options?.mode === "fast";
  const store = await readEuroMillionsStore();
  const yearNow = new Date().getFullYear();
  const years = fast
    ? []
    : options?.years?.length
      ? options.years
      : [yearNow, yearNow - 1, yearNow - 2];

  const sources: string[] = [];
  let incoming: EuroMillionsDraw[] = [];
  const yearsFetched: number[] = [];
  const beforeFdj = await readFdjGamesStore();
  const beforeFp = lotteryFingerprint(store, beforeFdj);

  // Companions first: Keno / Loto / EuroDreams must not wait on PedroMealha
  // archives (the 120s route budget often killed them before write).
  let companionGames: Record<string, number> | undefined;
  try {
    const companions = await refreshFdjCompanionGames(
      fast ? { parallel: true, size: 8 } : undefined,
    );
    companionGames = companions.games;
    sources.push(...companions.sources.map((s) => `companion:${s}`));
  } catch (err) {
    console.error("euromillions_companions_fail", err);
  }

  try {
    const fdj = await fetchFdjEuroMillionsDraws(fast ? 8 : 20);
    incoming = incoming.concat(fdj);
    sources.push(`fdj:${fdj.length}`);
  } catch (err) {
    console.error("euromillions_fdj_fail", err);
  }

  for (const year of years) {
    try {
      const batch = await fetchPedroMealhaDraws(year);
      incoming = incoming.concat(batch);
      yearsFetched.push(year);
      sources.push(`pedromealha:${year}`);
      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      console.error("euromillions_pedro_year_fail", year, err);
    }
  }

  let nextDrawDate = store.nextDrawDate ?? null;
  let nextJackpotEur = store.nextJackpotEur ?? null;
  if (!fast) {
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
  }

  let winners = store.myMillionWinners || [];
  if (!fast) {
    try {
      winners = await fetchFdjMyMillionWinnerLocations();
      sources.push(`fdj-mag-winners:${winners.length}`);
    } catch (err) {
      console.error("euromillions_fdj_mag_fail", err);
    }
  }

  let draws = mergeDraws(store.draws, incoming);
  draws = attachWinnerLocations(draws, winners);
  const latest = draws[0] || null;
  const next: EuroMillionsStore = {
    updatedAt: new Date().toISOString(),
    latest,
    nextDrawDate,
    nextJackpotEur,
    draws,
    myMillionWinners: winners,
  };
  await writeEuroMillionsStore(next);
  const afterFdj = await readFdjGamesStore();
  const fingerprint = lotteryFingerprint(next, afterFdj);
  const changed = fingerprint !== beforeFp;
  if (changed) revalidateLotteryPages();

  return {
    ok: true,
    draws: draws.length,
    latest: latest?.date || null,
    sources,
    yearsFetched,
    myMillionWinners: winners.length,
    companionGames,
    mode: fast ? "fast" : "full",
    changed,
    fingerprint,
  };
}
