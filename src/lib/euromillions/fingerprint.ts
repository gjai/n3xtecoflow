import { FDJ_COMPANION_GAMES } from "@/lib/fdj-games/catalog";
import { companionResultPending } from "@/lib/fdj-games/display";
import {
  getGameLatest,
  readFdjGamesStore,
} from "@/lib/fdj-games/store";
import type { FdjGamesStore } from "@/lib/fdj-games/types";
import { euroMillionsResultPending } from "./datetime";
import { getLatestDraw, readEuroMillionsStore } from "./store";
import type { EuroMillionsStore } from "./types";

/** Pas de `next/cache` ici : importé par des pages ISR. */
export function lotteryFingerprint(
  em: EuroMillionsStore,
  fdj: FdjGamesStore,
): string {
  const latest = getLatestDraw(em);
  const emPart = latest
    ? [
        latest.date,
        latest.numbers.join("-"),
        latest.stars.join("-"),
        latest.myMillionCode || "",
      ].join(":")
    : "none";
  const games = FDJ_COMPANION_GAMES.map((g) => {
    const d = getGameLatest(fdj, g.id);
    if (!d) return `${g.id}:none`;
    const balls = d.groups.map((gr) => gr.values.join(",")).join("|");
    return `${g.id}:${d.plannedAt}:${balls}`;
  });
  return `${emPart}#n=${em.draws.length}#next=${em.nextDrawDate || ""}:${em.nextJackpotEur ?? ""}#${games.join(";")}`;
}

export function anyLotteryResultPending(
  em: EuroMillionsStore,
  fdj: FdjGamesStore,
  now = new Date(),
): boolean {
  if (
    euroMillionsResultPending({
      latestDate: getLatestDraw(em)?.date,
      nextDrawDate: em.nextDrawDate,
      now,
    })
  ) {
    return true;
  }
  return FDJ_COMPANION_GAMES.some((g) =>
    companionResultPending(g.id, getGameLatest(fdj, g.id), now),
  );
}

export async function readLotteryFingerprint(): Promise<{
  fingerprint: string;
  pending: boolean;
}> {
  const [em, fdj] = await Promise.all([
    readEuroMillionsStore(),
    readFdjGamesStore(),
  ]);
  return {
    fingerprint: lotteryFingerprint(em, fdj),
    pending: anyLotteryResultPending(em, fdj),
  };
}
