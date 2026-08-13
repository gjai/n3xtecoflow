import type { CSSProperties } from "react";
import type { LotteryGameId } from "./nav";

/**
 * Couleurs éditoriales par jeu — associations publiques (Loto rouge, Keno
 * vert, etc.), pas les logos officiels FDJ / EuroMillions.
 */
export type GameIdentity = {
  accent: string;
  accentInk: string;
  accentSoft: string;
};

export const GAME_IDENTITY: Record<LotteryGameId, GameIdentity> = {
  euromillions: {
    accent: "#f5c542",
    accentInk: "#0b1220",
    accentSoft: "rgba(245, 197, 66, 0.16)",
  },
  "my-million": {
    accent: "#2dd4bf",
    accentInk: "#042f2e",
    accentSoft: "rgba(45, 212, 191, 0.16)",
  },
  loto: {
    accent: "#e31c23",
    accentInk: "#ffffff",
    accentSoft: "rgba(227, 28, 35, 0.16)",
  },
  eurodreams: {
    accent: "#c45ba8",
    accentInk: "#ffffff",
    accentSoft: "rgba(196, 91, 168, 0.18)",
  },
  crescendo: {
    accent: "#f26b21",
    accentInk: "#1a0a00",
    accentSoft: "rgba(242, 107, 33, 0.16)",
  },
  keno: {
    accent: "#22a35a",
    accentInk: "#04140a",
    accentSoft: "rgba(34, 163, 90, 0.16)",
  },
};

/** Remappe --accent dans un sous-arbre (boules, simulateur, liens). */
export function gameScopeStyle(id: LotteryGameId): CSSProperties {
  const g = GAME_IDENTITY[id];
  return {
    ["--accent" as string]: g.accent,
    ["--accent-ink" as string]: g.accentInk,
    ["--game" as string]: g.accent,
    ["--game-ink" as string]: g.accentInk,
    ["--game-soft" as string]: g.accentSoft,
  };
}

export function gameRailStyle(id: LotteryGameId): CSSProperties {
  return {
    ...gameScopeStyle(id),
    borderLeftWidth: 4,
    borderLeftColor: GAME_IDENTITY[id].accent,
  };
}
