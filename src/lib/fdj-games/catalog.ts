import type { FdjCompanionGameId, FdjResultKind } from "./types";

export type FdjGameCatalogEntry = {
  id: FdjCompanionGameId;
  /** Paramètre `game_name` API FDJ */
  apiName: string;
  /** Slug URL `/jeux/[slug]` */
  slug: string;
  labelFr: string;
  labelEn: string;
  /** Page résultats officielle FDJ */
  fdjUrl: string;
  /** Types de résultats à ignorer (raffles trop verbeux, etc.) */
  skipTypes?: string[];
};

export const FDJ_COMPANION_GAMES: FdjGameCatalogEntry[] = [
  {
    id: "eurodreams",
    apiName: "eurodreams",
    slug: "eurodreams",
    labelFr: "EuroDreams",
    labelEn: "EuroDreams",
    fdjUrl: "https://www.fdj.fr/jeux-de-tirage/eurodreams/resultats",
  },
  {
    id: "loto",
    apiName: "loto",
    slug: "loto",
    labelFr: "Loto",
    labelEn: "Loto",
    fdjUrl: "https://www.fdj.fr/jeux-de-tirage/loto/resultats",
    skipTypes: ["raffle"],
  },
  {
    id: "crescendo",
    apiName: "crescendo",
    slug: "crescendo",
    labelFr: "Crescendo",
    labelEn: "Crescendo",
    fdjUrl: "https://www.fdj.fr/jeux-de-tirage/crescendo/resultats",
  },
  {
    id: "keno",
    apiName: "keno2025",
    slug: "keno",
    labelFr: "Keno",
    labelEn: "Keno",
    fdjUrl: "https://www.fdj.fr/jeux-de-tirage/keno/resultats",
  },
];

export function getCompanionGame(
  idOrSlug: string,
): FdjGameCatalogEntry | undefined {
  return FDJ_COMPANION_GAMES.find(
    (g) => g.id === idOrSlug || g.slug === idOrSlug,
  );
}

export function mapResultMeta(typeRaw: string): {
  kind: FdjResultKind;
  labelKey: string;
} {
  const type = typeRaw.toLowerCase().trim();
  if (type.includes("etoile") || type.includes("dream")) {
    return { kind: "bonus", labelKey: type.includes("dream") ? "dream" : "stars" };
  }
  if (type.includes("chance")) return { kind: "bonus", labelKey: "chance" };
  if (type.includes("lettre")) return { kind: "letter", labelKey: "letter" };
  if (type.includes("multiplicateur")) {
    return { kind: "bonus", labelKey: "multiplier" };
  }
  if (type.includes("joker") || type.includes("mymillion")) {
    return { kind: "code", labelKey: "joker" };
  }
  if (type.includes("2eme") || type.includes("deuxième") || type.includes("2ème")) {
    return { kind: "numbers", labelKey: "secondDraw" };
  }
  if (type.includes("principaux") || type.includes("numero")) {
    return { kind: "numbers", labelKey: "main" };
  }
  return { kind: "other", labelKey: "other" };
}
