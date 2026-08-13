import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
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

const LOCK_STALE_MS = 90_000;
const MIN_FETCH_GAP_MS = 15_000;

function dataDir() {
  const em =
    process.env.EUROMILLIONS_DATA_PATH?.trim() ||
    path.join(process.cwd(), "data", "euromillions.json");
  return path.dirname(em);
}

function lockPath() {
  return path.join(dataDir(), "euromillions-refresh.lock");
}

function throttlePath() {
  return path.join(dataDir(), "euromillions-live-throttle.json");
}

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
    const balls = d.groups
      .map((gr) => gr.values.join(","))
      .join("|");
    return `${g.id}:${d.plannedAt}:${balls}`;
  });
  return `${emPart}#${games.join(";")}`;
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

export function revalidateLotteryPages() {
  const paths = [
    "/[locale]",
    "/[locale]/tirages",
    "/[locale]/tirages/[date]",
    "/[locale]/my-million",
    "/[locale]/prochain-tirage",
    "/[locale]/jeux",
    "/[locale]/jeux/[game]",
    "/[locale]/stats",
    "/[locale]/simulateur",
  ] as const;
  for (const p of paths) {
    revalidatePath(p, "page");
  }
}

export async function withLotteryRefreshLock<T>(
  fn: () => Promise<T>,
  options?: { ignoreThrottle?: boolean },
): Promise<{ ok: true; value: T } | { ok: false; reason: "locked" | "throttled" }> {
  const dir = dataDir();
  await fs.mkdir(dir, { recursive: true });

  if (!options?.ignoreThrottle) {
    try {
      const raw = await fs.readFile(throttlePath(), "utf8");
      const parsed = JSON.parse(raw) as { at?: number };
      const at = typeof parsed.at === "number" ? parsed.at : 0;
      if (at && Date.now() - at < MIN_FETCH_GAP_MS) {
        return { ok: false, reason: "throttled" };
      }
    } catch {
      /* first run */
    }
  }

  const file = lockPath();
  try {
    await fs.writeFile(
      file,
      JSON.stringify({ at: Date.now(), pid: process.pid }) + "\n",
      { flag: "wx" },
    );
  } catch {
    try {
      const stat = await fs.stat(file);
      if (Date.now() - stat.mtimeMs < LOCK_STALE_MS) {
        return { ok: false, reason: "locked" };
      }
      await fs.unlink(file);
      await fs.writeFile(
        file,
        JSON.stringify({ at: Date.now(), pid: process.pid }) + "\n",
        { flag: "wx" },
      );
    } catch {
      return { ok: false, reason: "locked" };
    }
  }

  try {
    const value = await fn();
    await fs.writeFile(
      throttlePath(),
      JSON.stringify({ at: Date.now() }) + "\n",
      "utf8",
    );
    return { ok: true, value };
  } finally {
    try {
      await fs.unlink(file);
    } catch {
      /* ignore */
    }
  }
}
