import { intlLocale } from "@/i18n/locales";
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

/** Sunday = 0. Used for “prochain tirage” copy on companion pages. */
export function companionScheduleSummary(
  gameId: FdjCompanionGameId,
  locale: string,
): string {
  if (gameId === "keno") {
    return locale === "en"
      ? "Every day — lunchtime and evening draws"
      : "Tous les jours — tirages midi et soir";
  }
  if (gameId === "crescendo") {
    return locale === "en"
      ? "Saturdays — several draws during the day"
      : "Samedi — plusieurs tirages dans la journée";
  }
  const names = DRAW_WEEKDAYS[gameId].map((day) => {
    const date = new Date(Date.UTC(2026, 0, 4 + day));
    return new Intl.DateTimeFormat(intlLocale(locale), {
      weekday: "long",
      timeZone: "UTC",
    }).format(date);
  });
  if (locale === "en") {
    return names
      .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
      .join(", ");
  }
  return names.join(", ");
}

export const CRESCENDO_HOURS = [13, 14, 15, 16, 17, 18, 19] as const;
export const KENO_MIDI_HOUR = 13;
export const KENO_SOIR_HOUR = 20;

export type CompanionHomeSlot = {
  id: string;
  /** i18n: games.kenoMidi / kenoSoir / crescendoHour / pending */
  kind: "draw" | "pending";
  hour: number | null;
  kenoSlot: KenoSlot | null;
  draw: FdjGameDraw | null;
};

function parisHourOf(plannedAt: string): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date(plannedAt)),
  );
}

function drawsOnDate(draws: FdjGameDraw[], date: string): FdjGameDraw[] {
  return draws.filter((d) => d.date === date);
}

export function companionFocusDate(
  gameId: FdjCompanionGameId,
  draws: FdjGameDraw[],
  now = new Date(),
): string {
  const today = parisDateKey(now);
  const wd = parisWeekday(today);
  if (DRAW_WEEKDAYS[gameId].includes(wd)) return today;
  return draws[0]?.date || today;
}

export function companionHomeSlots(
  gameId: FdjCompanionGameId,
  draws: FdjGameDraw[],
  now = new Date(),
): CompanionHomeSlot[] {
  const focus = companionFocusDate(gameId, draws, now);
  const today = parisDateKey(now);
  const onDay = drawsOnDate(draws, focus);

  if (gameId === "keno") {
    const midi = onDay.find((d) => kenoSlotFromPlannedAt(d.plannedAt) === "midi") || null;
    const soir = onDay.find((d) => kenoSlotFromPlannedAt(d.plannedAt) === "soir") || null;
    const kenoSlots: CompanionHomeSlot[] = [
      {
        id: `${focus}-midi`,
        kind: midi ? "draw" : "pending",
        hour: KENO_MIDI_HOUR,
        kenoSlot: "midi",
        draw: midi,
      },
      {
        id: `${focus}-soir`,
        kind: soir ? "draw" : "pending",
        hour: KENO_SOIR_HOUR,
        kenoSlot: "soir",
        draw: soir,
      },
    ];
    return kenoSlots.filter((s) => s.draw || focus === today);
  }

  if (gameId === "crescendo") {
    return CRESCENDO_HOURS.map((h) => {
      const draw =
        onDay.find((d) => parisHourOf(d.plannedAt) === h) || null;
      return {
        id: `${focus}-${h}`,
        kind: (draw ? "draw" : "pending") as "draw" | "pending",
        hour: h,
        kenoSlot: null,
        draw,
      };
    }).filter((s) => s.draw || focus === today);
  }

  const latestToday = onDay[0] || null;
  const due = focus === today && !latestToday;
  return [
    {
      id: `${focus}-main`,
      kind: latestToday ? "draw" : due ? "pending" : "draw",
      hour: null,
      kenoSlot: null,
      draw: latestToday || draws[0] || null,
    },
  ];
}

export function companionResultPending(
  gameId: FdjCompanionGameId,
  latest: FdjGameDraw | null,
  now = new Date(),
): boolean {
  const today = parisDateKey(now);
  const wd = parisWeekday(today);
  if (!DRAW_WEEKDAYS[gameId].includes(wd)) return false;
  const { hour } = parisHourMinute(now);

  if (gameId === "keno") {
    const slot = latest?.date === today
      ? kenoSlotFromPlannedAt(latest.plannedAt)
      : null;
    if (hour >= KENO_SOIR_HOUR) return slot !== "soir";
    if (hour >= KENO_MIDI_HOUR) return slot !== "midi" && slot !== "soir";
    return false;
  }

  if (gameId === "crescendo") {
    if (latest?.date !== today) return hour >= CRESCENDO_HOURS[0];
    const lastHour = parisHourOf(latest.plannedAt);
    return lastHour < CRESCENDO_HOURS[CRESCENDO_HOURS.length - 1] && hour > lastHour;
  }

  if (latest?.date === today) return false;
  return true;
}
