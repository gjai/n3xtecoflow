import { preferredDrawId } from "./draw-id";
import { sortDrawsNewest } from "./store";
import type { EuroMillionsDraw, EuroMillionsPrizeTier } from "./types";

function mergePrizeTiers(
  incoming?: EuroMillionsPrizeTier[],
  prev?: EuroMillionsPrizeTier[],
): EuroMillionsPrizeTier[] | undefined {
  if (incoming?.length) {
    if (
      incoming.some((t) => t.winnersEurope != null) ||
      !prev?.length
    ) {
      return incoming;
    }
    const byRank = new Map(prev.map((t) => [t.rank, t]));
    return incoming.map((t) => {
      const old = byRank.get(t.rank);
      return t.winnersEurope == null && old?.winnersEurope != null
        ? { ...t, winnersEurope: old.winnersEurope }
        : t;
    });
  }
  return prev;
}

function hasGrid(d: EuroMillionsDraw): boolean {
  return d.numbers.length === 5 && d.stars.length === 2;
}

function isFdjPublished(d: EuroMillionsDraw): boolean {
  return d.source === "fdj" && hasGrid(d);
}

/**
 * Fusion par date. Un tirage déjà FDJ (5+2) n’est pas écrasé par Pedro / UK.
 * Le jackpot UK (souvent des £) n’est jamais copié en euros.
 */
export function mergeDraws(
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
    if (isFdjPublished(prev) && d.source !== "fdj") {
      byDate.set(d.date, {
        ...prev,
        drawId: preferredDrawId(prev.drawId, d.drawId),
        myMillionCode: prev.myMillionCode ?? d.myMillionCode,
        myMillionLocation: prev.myMillionLocation ?? d.myMillionLocation,
        hasWinner: prev.hasWinner ?? d.hasWinner,
        prizeTiers: prev.prizeTiers?.length ? prev.prizeTiers : d.prizeTiers,
        prizeTiersEtoilePlus: prev.prizeTiersEtoilePlus?.length
          ? prev.prizeTiersEtoilePlus
          : d.prizeTiersEtoilePlus,
      });
      continue;
    }
    const jackpotEur =
      d.source === "uk-lottery"
        ? (prev.jackpotEur ?? null)
        : (d.jackpotEur ?? prev.jackpotEur);
    byDate.set(d.date, {
      ...prev,
      ...d,
      numbers: d.numbers.length === 5 ? d.numbers : prev.numbers,
      stars: d.stars.length === 2 ? d.stars : prev.stars,
      jackpotEur,
      hasWinner: d.hasWinner ?? prev.hasWinner,
      drawId: preferredDrawId(d.drawId, prev.drawId),
      myMillionCode: d.myMillionCode ?? prev.myMillionCode,
      myMillionLocation: d.myMillionLocation ?? prev.myMillionLocation,
      prizeTiers: mergePrizeTiers(d.prizeTiers, prev.prizeTiers),
      prizeTiersEtoilePlus: d.prizeTiersEtoilePlus?.length
        ? d.prizeTiersEtoilePlus
        : prev.prizeTiersEtoilePlus,
      source: isFdjPublished(prev) || d.source === "fdj"
        ? "fdj"
        : hasGrid(d)
          ? d.source
          : prev.source || d.source,
    });
  }
  return sortDrawsNewest([...byDate.values()]);
}
