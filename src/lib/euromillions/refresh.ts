import { refreshFdjCompanionGames } from "@/lib/fdj-games/refresh";
import { readFdjGamesStore } from "@/lib/fdj-games/store";
import { fetchFdjEuroMillionsArchiveDraws } from "./fdj-archives";
import {
  fetchFdjEuroMillionsDraws,
  fetchFdjMyMillionWinnerLocations,
  fetchFdjNextEuroMillions,
} from "./fdj";
import { mergeDraws } from "./merge-draws";
import { fetchPedroMealhaDraws, fetchUkLatestDraw } from "./fetch";
import { recordFirstPublish } from "./timing";
import { lotteryIndexNowUrls } from "@/lib/seo/indexnow";
import { notifySearchEngines } from "@/lib/seo/notify";
import { revalidateLotteryPages } from "./live";
import {
  readEuroMillionsStore,
  upcomingDrawPlaceholder,
  writeEuroMillionsStore,
  isEuroMillionsDrawPublished,
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
  facebook?: {
    posted: number;
    stories: number;
    instagramPosted?: number;
    instagramStories?: number;
    instagramUsername?: string | null;
    skipped: Record<string, string>;
  };
};

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

function assembleStore(
  store: EuroMillionsStore,
  incoming: EuroMillionsDraw[],
  nextDrawDate: string | null,
  nextJackpotEur: number | null,
  winners: MyMillionWinner[],
): EuroMillionsStore {
  let draws = mergeDraws(store.draws, incoming);
  draws = attachWinnerLocations(draws, winners);
  if (nextDrawDate && !draws.some((d) => d.date === nextDrawDate)) {
    draws = mergeDraws(draws, [
      upcomingDrawPlaceholder(nextDrawDate, nextJackpotEur),
    ]);
  }
  const latest = draws.find(isEuroMillionsDrawPublished) || null;
  return {
    updatedAt: new Date().toISOString(),
    latest,
    nextDrawDate,
    nextJackpotEur,
    draws,
    myMillionWinners: winners,
  };
}

async function notifyDrawPublish(
  latest: EuroMillionsDraw | null,
): Promise<EuroMillionsRefreshResult["facebook"]> {
  try {
    const { notifyAlertsOnPublish } = await import("./alerts");
    await notifyAlertsOnPublish(latest);
  } catch (err) {
    console.error("alerts_notify_fail", err);
  }
  try {
    const { notifyFacebookOnPublish } = await import("./facebook");
    return await notifyFacebookOnPublish(latest);
  } catch (err) {
    console.error("facebook_notify_fail", err);
  }
}

async function persistEuroMillions(
  next: EuroMillionsStore,
  fdj: Awaited<ReturnType<typeof readFdjGamesStore>>,
  beforeFp: string,
  prev: EuroMillionsStore,
): Promise<{ fingerprint: string; changed: boolean }> {
  await writeEuroMillionsStore(next);
  await recordFirstPublish(prev, next);
  revalidateLotteryPages();
  const fingerprint = lotteryFingerprint(next, fdj);
  const changed = fingerprint !== beforeFp;
  if (changed) {
    await notifySearchEngines(
      lotteryIndexNowUrls(next, fdj),
      "euromillions-resultats.fr",
    );
    const { inspectEuroMillionsPublish } = await import("@/lib/seo/gsc-api");
    await inspectEuroMillionsPublish({
      latest: next.latest?.date,
      nextDrawDate: next.nextDrawDate,
    });
  }
  return { fingerprint, changed };
}

const EM_ARCHIVE_START = 2004;

function yearBackfillTarget(y: number, yearNow: number): number {
  if (y === yearNow) return 8;
  // Weekly draws until May 2011, then Tue+Fri (~104/year).
  if (y <= 2004) return 40;
  if (y <= 2010) return 48;
  if (y === 2011) return 80;
  return 90;
}

function yearsNeedingBackfill(
  draws: EuroMillionsDraw[],
  yearNow: number,
): number[] {
  const counts = new Map<number, number>();
  for (const d of draws) {
    const y = Number(String(d.date).slice(0, 4));
    if (!Number.isFinite(y)) continue;
    counts.set(y, (counts.get(y) || 0) + 1);
  }
  const missing: number[] = [];
  // Newest first: 2025 SEO before 2004. Cron takes 4 years / run.
  for (let y = yearNow; y >= EM_ARCHIVE_START; y -= 1) {
    const n = counts.get(y) || 0;
    if (n < yearBackfillTarget(y, yearNow)) missing.push(y);
  }
  return missing;
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
      : yearsNeedingBackfill(store.draws, yearNow).slice(0, 4);

  const sources: string[] = [];
  let incoming: EuroMillionsDraw[] = [];
  const yearsFetched: number[] = [];
  const beforeFdj = await readFdjGamesStore();
  const beforeFp = lotteryFingerprint(store, beforeFdj);

  // EuroMillions d’abord : écrire + revalider avant Keno/Loto (même lock live).
  try {
    const fdj = await fetchFdjEuroMillionsDraws(fast ? 8 : 20, fast ? 1 : 8);
    incoming = incoming.concat(fdj);
    sources.push(`fdj:${fdj.length}`);
  } catch (err) {
    console.error("euromillions_fdj_fail", err);
  }

  let nextDrawDate = store.nextDrawDate ?? null;
  let nextJackpotEur = store.nextJackpotEur ?? null;
  try {
    const fdjNext = await fetchFdjNextEuroMillions();
    if (fdjNext) {
      nextDrawDate = fdjNext.date;
      if (fdjNext.jackpotEur != null) nextJackpotEur = fdjNext.jackpotEur;
      sources.push(
        `fdj-next:${fdjNext.date}:${fdjNext.jackpotEur ?? "na"}`,
      );
    }
  } catch (err) {
    console.error("euromillions_fdj_next_fail", err);
  }

  let winners = store.myMillionWinners || [];
  let next = assembleStore(store, incoming, nextDrawDate, nextJackpotEur, winners);
  let { fingerprint, changed } = await persistEuroMillions(
    next,
    beforeFdj,
    beforeFp,
    store,
  );
  let facebook = await notifyDrawPublish(next.latest ?? null);

  let companionGames: Record<string, number> | undefined;
  try {
    const companions = await refreshFdjCompanionGames(
      fast ? { parallel: true, size: 8 } : { size: 80 },
    );
    companionGames = companions.games;
    sources.push(...companions.sources.map((s) => `companion:${s}`));
    try {
      const { notifyCompanionAlertsOnPublish } = await import("./alerts");
      await notifyCompanionAlertsOnPublish();
    } catch (err) {
      console.error("companion_alerts_fail", err);
    }
  } catch (err) {
    console.error("euromillions_companions_fail", err);
  }

  if (!fast) {
    try {
      const archives = await fetchFdjEuroMillionsArchiveDraws();
      incoming = incoming.concat(archives);
      sources.push(`fdj-archive:${archives.length}`);
    } catch (err) {
      console.error("euromillions_fdj_archive_fail", err);
    }

    for (const year of years) {
      try {
        const batch = await fetchPedroMealhaDraws(year);
        incoming = incoming.concat(batch);
        yearsFetched.push(year);
        sources.push(`pedromealha:${year}`);
        await new Promise((r) => setTimeout(r, 6000));
      } catch (err) {
        console.error("euromillions_pedro_year_fail", year, err);
        await new Promise((r) => setTimeout(r, 8000));
      }
    }

    try {
      const uk = await fetchUkLatestDraw();
      if (uk?.draw) {
        incoming.push(uk.draw);
        sources.push("uk-lottery:latest");
        nextDrawDate = nextDrawDate ?? uk.nextDrawDate ?? null;
      }
    } catch (err) {
      console.error("euromillions_uk_fail", err);
    }

    try {
      winners = await fetchFdjMyMillionWinnerLocations();
      sources.push(`fdj-mag-winners:${winners.length}`);
    } catch (err) {
      console.error("euromillions_fdj_mag_fail", err);
    }

    next = assembleStore(store, incoming, nextDrawDate, nextJackpotEur, winners);
    const afterExtra = await persistEuroMillions(
      next,
      await readFdjGamesStore(),
      beforeFp,
      store,
    );
    fingerprint = afterExtra.fingerprint;
    changed = afterExtra.changed;
    facebook = (await notifyDrawPublish(next.latest ?? null)) ?? facebook;
  } else {
    const afterFdj = await readFdjGamesStore();
    fingerprint = lotteryFingerprint(next, afterFdj);
    changed = fingerprint !== beforeFp;
    if (changed) {
      await notifySearchEngines(
        lotteryIndexNowUrls(next, afterFdj),
        "euromillions-resultats.fr",
      );
    }
  }

  return {
    ok: true,
    draws: next.draws.length,
    latest: next.latest?.date || null,
    sources,
    yearsFetched,
    myMillionWinners: winners.length,
    companionGames,
    mode: fast ? "fast" : "full",
    changed,
    fingerprint,
    facebook,
  };
}
