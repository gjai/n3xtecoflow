import {
  EM_DRAW_HOUR,
  EM_DRAW_MINUTE,
  parisDateKey,
  parisHourMinute,
  parisLocalToUtc,
  parisWeekday,
} from "@/lib/euromillions/datetime";
import type { EuroMillionsStore } from "@/lib/euromillions/types";
import type { LotteryGameId } from "@/lib/fdj-games/nav";
import type { FdjCompanionGameId, FdjGameDraw, FdjGamesStore } from "@/lib/fdj-games/types";

export type NextDrawSlot = {
  at: string;
  pending: boolean;
  kenoSlot?: "midi" | "soir";
};

export type NextDrawSnapshot = Partial<Record<LotteryGameId, NextDrawSlot>>;

const WEEKDAYS: Record<FdjCompanionGameId, number[]> = {
  eurodreams: [1, 4],
  loto: [1, 3, 6],
  crescendo: [6],
  keno: [0, 1, 2, 3, 4, 5, 6],
};

const DEFAULT_HM: Record<FdjCompanionGameId, Array<{ hour: number; minute: number }>> = {
  eurodreams: [{ hour: 21, minute: 0 }],
  loto: [{ hour: 20, minute: 55 }],
  crescendo: [13, 14, 15, 16, 17, 18, 19].map((hour) => ({ hour, minute: 0 })),
  keno: [
    { hour: 13, minute: 0 },
    { hour: 20, minute: 35 },
  ],
};

function nextParisDate(iso: string): string {
  const noon = parisLocalToUtc(iso, 12, 0);
  return parisDateKey(new Date(noon.getTime() + 36 * 3600 * 1000));
}

function hmFromDraws(
  gameId: FdjCompanionGameId,
  draws: FdjGameDraw[],
): Array<{ hour: number; minute: number }> {
  const seen = new Map<string, { hour: number; minute: number }>();
  for (const d of draws) {
    const { hour, minute } = parisHourMinute(new Date(d.plannedAt));
    if (!Number.isFinite(hour)) continue;
    seen.set(`${hour}:${minute}`, { hour, minute });
  }
  if (seen.size === 0) return DEFAULT_HM[gameId];
  if (gameId === "keno" && seen.size === 1) {
    const only = [...seen.values()][0];
    if (only && only.hour >= 16) {
      return [{ hour: 13, minute: 0 }, only];
    }
  }
  return [...seen.values()].sort((a, b) => a.hour - b.hour || a.minute - b.minute);
}

function alreadyPublished(
  draws: FdjGameDraw[],
  date: string,
  hour: number,
): boolean {
  return draws.some((d) => {
    if (d.date !== date) return false;
    const hm = parisHourMinute(new Date(d.plannedAt));
    return Math.abs(hm.hour - hour) <= 1;
  });
}

function kenoSlotForHour(hour: number): "midi" | "soir" {
  return hour < 16 ? "midi" : "soir";
}

function nextCompanionSlot(
  gameId: FdjCompanionGameId,
  draws: FdjGameDraw[],
  now: Date,
): NextDrawSlot | null {
  const weekdays = WEEKDAYS[gameId];
  const slots = hmFromDraws(gameId, draws);
  let date = parisDateKey(now);
  for (let day = 0; day < 16; day += 1) {
    if (weekdays.includes(parisWeekday(date))) {
      for (const slot of slots) {
        const at = parisLocalToUtc(date, slot.hour, slot.minute);
        const published = alreadyPublished(draws, date, slot.hour);
        if (published) continue;
        const pending = at.getTime() <= now.getTime();
        return {
          at: at.toISOString(),
          pending,
          kenoSlot: gameId === "keno" ? kenoSlotForHour(slot.hour) : undefined,
        };
      }
    }
    date = nextParisDate(date);
  }
  return null;
}

function nextEuroMillions(
  store: EuroMillionsStore,
  now: Date,
): NextDrawSlot | null {
  const latest = store.latest?.date || store.draws[0]?.date || null;
  const hinted = store.nextDrawDate?.trim() || null;
  if (hinted) {
    const at = parisLocalToUtc(hinted, EM_DRAW_HOUR, EM_DRAW_MINUTE);
    const published = latest === hinted;
    if (!published) {
      return { at: at.toISOString(), pending: at.getTime() <= now.getTime() };
    }
  }
  let date = parisDateKey(now);
  for (let day = 0; day < 16; day += 1) {
    const wd = parisWeekday(date);
    if (wd === 2 || wd === 5) {
      const at = parisLocalToUtc(date, EM_DRAW_HOUR, EM_DRAW_MINUTE);
      if (latest === date) {
        date = nextParisDate(date);
        continue;
      }
      return { at: at.toISOString(), pending: at.getTime() <= now.getTime() };
    }
    date = nextParisDate(date);
  }
  return null;
}

export function buildNextDrawSnapshot(
  em: EuroMillionsStore,
  fdj: FdjGamesStore,
  now = new Date(),
): NextDrawSnapshot {
  const emSlot = nextEuroMillions(em, now);
  const out: NextDrawSnapshot = {
    euromillions: emSlot || undefined,
    "my-million": emSlot || undefined,
  };
  for (const id of ["loto", "eurodreams", "crescendo", "keno"] as const) {
    const slot = nextCompanionSlot(id, fdj.games[id]?.draws || [], now);
    if (slot) out[id] = slot;
  }
  return out;
}
