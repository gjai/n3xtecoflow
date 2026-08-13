import type { FdjGameDraw } from "./types";
import { kenoSlotFromPlannedAt } from "./display";

function parisHhmm(plannedAt: string): string {
  const d = new Date(plannedAt);
  if (Number.isNaN(d.getTime())) return "0000";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const hour = parts.find((p) => p.type === "hour")?.value || "00";
  const minute = parts.find((p) => p.type === "minute")?.value || "00";
  return `${hour}${minute}`;
}

/** URL-safe key unique per companion draw. */
export function companionDrawKey(draw: FdjGameDraw): string {
  if (draw.gameId === "keno") {
    return `${draw.date}-${kenoSlotFromPlannedAt(draw.plannedAt)}`;
  }
  if (draw.gameId === "crescendo") {
    return `${draw.date}-${parisHhmm(draw.plannedAt)}`;
  }
  return draw.date;
}

export function findDrawByKey(
  draws: FdjGameDraw[],
  key: string,
): FdjGameDraw | undefined {
  return draws.find((d) => companionDrawKey(d) === key);
}
