import { FDJ_COMPANION_GAMES } from "./catalog";

export type LotteryGameId =
  | "euromillions"
  | "my-million"
  | "eurodreams"
  | "loto"
  | "crescendo"
  | "keno";

export type GameToolId =
  | "archive"
  | "simulator"
  | "generator"
  | "nextDraw"
  | "stats"
  | "guides"
  | "news";

export type GameToolLink = {
  id: GameToolId;
  href: string;
};

export type LotteryGameNav = {
  id: LotteryGameId;
  href: string;
  labelFr: string;
  labelEn: string;
  tools: GameToolLink[];
};

const COMPANION_TOOLS = (slug: string): GameToolLink[] => [
  { id: "archive", href: `/jeux/${slug}#archives` },
  { id: "simulator", href: `/jeux/${slug}#simulateur` },
  { id: "generator", href: `/jeux/${slug}#generateur` },
  { id: "nextDraw", href: `/jeux/${slug}#prochain` },
  { id: "stats", href: `/jeux/${slug}#stats` },
  { id: "guides", href: `/guides/comprendre-${slug}` },
  { id: "news", href: `/actualites` },
];

export const LOTTERY_GAMES_NAV: LotteryGameNav[] = [
  {
    id: "euromillions",
    href: "/",
    labelFr: "EuroMillions",
    labelEn: "EuroMillions",
    tools: [
      { id: "archive", href: "/tirages#archives" },
      { id: "simulator", href: "/tirages#simulateur" },
      { id: "generator", href: "/tirages#generateur" },
      { id: "nextDraw", href: "/prochain-tirage" },
      { id: "stats", href: "/tirages#stats" },
      { id: "guides", href: "/guides" },
      { id: "news", href: "/actualites" },
    ],
  },
  {
    id: "my-million",
    href: "/my-million",
    labelFr: "My Million",
    labelEn: "My Million",
    tools: [
      { id: "archive", href: "/my-million#archives" },
      { id: "nextDraw", href: "/prochain-tirage" },
      { id: "guides", href: "/guides/comprendre-my-million" },
      { id: "news", href: "/actualites" },
    ],
  },
  ...["loto", "eurodreams", "crescendo", "keno"]
    .map((id) => FDJ_COMPANION_GAMES.find((g) => g.id === id))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => ({
      id: g.id as LotteryGameId,
      href: `/jeux/${g.slug}`,
      labelFr: g.labelFr,
      labelEn: g.labelEn,
      tools: COMPANION_TOOLS(g.slug),
    })),
];

export function lotteryGameLabel(
  game: LotteryGameNav,
  locale: string,
): string {
  return locale === "en" ? game.labelEn : game.labelFr;
}

export function getLotteryGame(id: LotteryGameId): LotteryGameNav | undefined {
  return LOTTERY_GAMES_NAV.find((g) => g.id === id);
}

/** Pathname without locale prefix (next-intl `usePathname`). */
export function lotteryGameFromPath(pathname: string): LotteryGameId | null {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p.startsWith("/my-million")) return "my-million";
  const companion = FDJ_COMPANION_GAMES.find(
    (g) => p === `/jeux/${g.slug}` || p.startsWith(`/jeux/${g.slug}/`),
  );
  if (companion) return companion.id as LotteryGameId;
  if (p === "/jeux") return null;
  if (
    p === "/" ||
    p.startsWith("/tirages") ||
    p.startsWith("/simulateur") ||
    p.startsWith("/prochain-tirage") ||
    p.startsWith("/stats") ||
    p.startsWith("/generateur") ||
    p.startsWith("/guides") ||
    p.startsWith("/actualites")
  ) {
    return "euromillions";
  }
  return null;
}

export const OTHER_GAMES_HUB_HREF = "/autres-jeux";

export type ExternalGameNav = {
  id: string;
  href: string;
  labelFr: string;
  labelEn: string;
  external: string;
};

export const EXTERNAL_GAMES_NAV: ExternalGameNav[] = [
  {
    id: "illiko",
    href: "/jeux/illiko",
    labelFr: "Illiko",
    labelEn: "Illiko",
    external: "https://www.fdj.fr/jeux-instantanes",
  },
  {
    id: "pmu",
    href: "/jeux/pmu",
    labelFr: "PMU",
    labelEn: "PMU",
    external: "https://www.pmu.fr",
  },
  {
    id: "parions-sport",
    href: "/jeux/parions-sport",
    labelFr: "Parions Sport",
    labelEn: "Parions Sport",
    external: "https://www.enligne.parionssport.fdj.fr",
  },
];

export function externalGameLabel(
  game: ExternalGameNav,
  locale: string,
): string {
  return locale === "en" ? game.labelEn : game.labelFr;
}

export function toolHrefIsActive(
  href: string,
  pathname: string,
  hash: string,
): boolean {
  const [path, anchor] = href.split("#");
  const current = pathname.replace(/\/+$/, "") || "/";
  const target = (path || "/").replace(/\/+$/, "") || "/";
  const pathMatch =
    target === "/"
      ? current === "/"
      : current === target || current.startsWith(`${target}/`);
  if (!pathMatch) return false;
  const h = (hash.startsWith("#") ? hash.slice(1) : hash) || "";
  if (!anchor) return !h;
  return h === anchor;
}
