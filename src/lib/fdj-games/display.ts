import type { FdjCompanionGameId, FdjGameDraw } from "./types";
import {
  formatParisTime,
  parisDateKey,
  parisHourMinute,
  parisWeekday,
} from "@/lib/euromillions/datetime";

export type KenoSlot = "midi" | "soir";

export function kenoSlotFromPlannedAt(plannedAt: string): KenoSlot {
  const d = new Date(plannedAt);
  if (Number.isNaN(d.getTime())) return "soir";
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(d),
  );
  return hour < 16 ? "midi" : "soir";
}

export function formatDrawWhen(
  draw: FdjGameDraw,
  locale: string,
): { time: string | null; kenoSlot: KenoSlot | null } {
  if (draw.gameId === "keno") {
    return { time: formatParisTime(draw.plannedAt, locale), kenoSlot: kenoSlotFromPlannedAt(draw.plannedAt) };
  }
  if (draw.gameId === "crescendo") {
    return { time: formatParisTime(draw.plannedAt, locale), kenoSlot: null };
  }
  return { time: null, kenoSlot: null };
}

const DRAW_WEEKDAYS: Record<FdjCompanionGameId, number[]> = {
  eurodreams: [1, 4],
  loto: [1, 3, 6],
  crescendo: [6],
  keno: [0, 1, 2, 3, 4, 5, 6],
};

export function companionResultPending(
  gameId: FdjCompanionGameId,
  latest: FdjGameDraw | null,
  now = new Date(),
): boolean {
  const today = parisDateKey(now);
  const wd = parisWeekday(today);
  if (!DRAW_WEEKDAYS[gameId].includes(wd)) return false;
  if (latest?.date === today) {
    if (gameId === "keno") {
      const { hour } = parisHourMinute(now);
      const slot = kenoSlotFromPlannedAt(latest.plannedAt);
      if (hour >= 20 && slot === "midi") return true;
    }
    if (gameId === "crescendo") {
      const { hour } = parisHourMinute(now);
      const lastHour = Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Paris",
          hour: "2-digit",
          hourCycle: "h23",
        }).format(new Date(latest.plannedAt)),
      );
      if (hour >= 13 && hour <= 20 && lastHour < Math.min(hour, 19) && lastHour < 19) {
        return true;
      }
    }
    return false;
  }
  const { hour } = parisHourMinute(now);
  if (gameId === "keno") return hour >= 13;
  if (gameId === "crescendo") return hour >= 13;
  return hour >= 20;
}
