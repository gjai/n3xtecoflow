import {
  EUROMILLIONS_CLAIM_GUIDE_SLUG,
  EUROMILLIONS_CRESCENDO_GUIDE_SLUG,
  EUROMILLIONS_EURODREAMS_GUIDE_SLUG,
  EUROMILLIONS_KENO_GUIDE_SLUG,
  EUROMILLIONS_LOTO_GUIDE_SLUG,
  EUROMILLIONS_MAIN_GUIDE_SLUG,
  EUROMILLIONS_MY_MILLION_GUIDE_SLUG,
  EUROMILLIONS_ODDS_GUIDE_SLUG,
  EUROMILLIONS_OTHER_GAMES_GUIDE_SLUG,
  EUROMILLIONS_READ_RESULTS_GUIDE_SLUG,
  EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG,
  EUROMILLIONS_SCHEDULE_GUIDE_SLUG,
  EUROMILLIONS_TIERS_GUIDE_SLUG,
  EUROMILLIONS_WELCOME_OFFER_GUIDE_SLUG,
} from "@/data/euromillions-guides";
import { GAME_IDENTITY } from "@/lib/fdj-games/identity";
import type { LotteryGameId } from "@/lib/fdj-games/nav";
import { GameMark } from "./GameMark";

type TopicId =
  | "results"
  | "schedule"
  | "claim"
  | "responsible"
  | "odds"
  | "tiers"
  | "other"
  | "welcome";

type GuideVisual =
  | { kind: "game"; gameId: LotteryGameId }
  | { kind: "topic"; topic: TopicId; accent: string; ink: string };

const EM = GAME_IDENTITY.euromillions;

const GUIDE_VISUAL: Record<string, GuideVisual> = {
  [EUROMILLIONS_MAIN_GUIDE_SLUG]: { kind: "game", gameId: "euromillions" },
  [EUROMILLIONS_LOTO_GUIDE_SLUG]: { kind: "game", gameId: "loto" },
  [EUROMILLIONS_EURODREAMS_GUIDE_SLUG]: { kind: "game", gameId: "eurodreams" },
  [EUROMILLIONS_KENO_GUIDE_SLUG]: { kind: "game", gameId: "keno" },
  [EUROMILLIONS_CRESCENDO_GUIDE_SLUG]: { kind: "game", gameId: "crescendo" },
  [EUROMILLIONS_MY_MILLION_GUIDE_SLUG]: { kind: "game", gameId: "my-million" },
  [EUROMILLIONS_READ_RESULTS_GUIDE_SLUG]: {
    kind: "topic",
    topic: "results",
    accent: EM.accent,
    ink: EM.accentInk,
  },
  [EUROMILLIONS_SCHEDULE_GUIDE_SLUG]: {
    kind: "topic",
    topic: "schedule",
    accent: "#3b82f6",
    ink: "#ffffff",
  },
  [EUROMILLIONS_CLAIM_GUIDE_SLUG]: {
    kind: "topic",
    topic: "claim",
    accent: EM.accent,
    ink: EM.accentInk,
  },
  [EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG]: {
    kind: "topic",
    topic: "responsible",
    accent: "#0f172a",
    ink: EM.accent,
  },
  [EUROMILLIONS_ODDS_GUIDE_SLUG]: {
    kind: "topic",
    topic: "odds",
    accent: "#7c3aed",
    ink: "#ffffff",
  },
  [EUROMILLIONS_TIERS_GUIDE_SLUG]: {
    kind: "topic",
    topic: "tiers",
    accent: EM.accent,
    ink: EM.accentInk,
  },
  [EUROMILLIONS_OTHER_GAMES_GUIDE_SLUG]: {
    kind: "topic",
    topic: "other",
    accent: "#64748b",
    ink: "#ffffff",
  },
  [EUROMILLIONS_WELCOME_OFFER_GUIDE_SLUG]: {
    kind: "topic",
    topic: "welcome",
    accent: GAME_IDENTITY["my-million"].accent,
    ink: GAME_IDENTITY["my-million"].accentInk,
  },
};

const FALLBACK: GuideVisual = {
  kind: "game",
  gameId: "euromillions",
};

export function guideVisual(slug: string): GuideVisual {
  return GUIDE_VISUAL[slug] ?? FALLBACK;
}

export function guideAccent(slug: string): string {
  const visual = guideVisual(slug);
  return visual.kind === "game"
    ? GAME_IDENTITY[visual.gameId].accent
    : visual.accent;
}

function TopicGlyph({ topic, ink }: { topic: TopicId; ink: string }) {
  switch (topic) {
    case "results":
      return (
        <>
          <rect x="8" y="8" width="16" height="16" rx="2" fill="none" stroke={ink} strokeWidth="1.8" />
          <path d="M11 13h10M11 16.5h10M11 20h6" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
        </>
      );
    case "schedule":
      return (
        <>
          <circle cx="16" cy="16.5" r="7.5" fill="none" stroke={ink} strokeWidth="1.8" />
          <path d="M16 12.5v4.2l3 1.8" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 8.2h8" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    case "claim":
      return (
        <>
          <path
            d="M10 13h12a1.6 1.6 0 0 1 1.6 1.6v8.2A1.6 1.6 0 0 1 22 24.4H10a1.6 1.6 0 0 1-1.6-1.6v-8.2A1.6 1.6 0 0 1 10 13z"
            fill="none"
            stroke={ink}
            strokeWidth="1.7"
          />
          <path d="M12.2 13v-1.4a3.8 3.8 0 0 1 7.6 0V13" fill="none" stroke={ink} strokeWidth="1.7" />
          <circle cx="16" cy="18.6" r="1.5" fill={ink} />
        </>
      );
    case "responsible":
      return (
        <text
          x="16"
          y="21"
          textAnchor="middle"
          fill={ink}
          fontSize="11"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          18+
        </text>
      );
    case "odds":
      return (
        <>
          <circle cx="12" cy="12" r="2" fill={ink} />
          <circle cx="20" cy="20" r="2" fill={ink} />
          <path d="M11 21L21 11" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    case "tiers":
      return (
        <>
          <rect x="7.5" y="17" width="5.2" height="7" rx="1" fill={ink} />
          <rect x="13.4" y="11" width="5.2" height="13" rx="1" fill={ink} />
          <rect x="19.3" y="14.5" width="5.2" height="9.5" rx="1" fill={ink} />
        </>
      );
    case "other":
      return (
        <>
          <circle cx="12" cy="12" r="2.2" fill={ink} />
          <circle cx="20" cy="12" r="2.2" fill={ink} />
          <circle cx="12" cy="20" r="2.2" fill={ink} />
          <circle cx="20" cy="20" r="2.2" fill={ink} />
        </>
      );
    case "welcome":
      return (
        <>
          <rect x="8" y="13.5" width="16" height="10.5" rx="1.6" fill="none" stroke={ink} strokeWidth="1.7" />
          <path d="M8 18h16M16 13.5v10.5" stroke={ink} strokeWidth="1.7" />
          <path
            d="M16 13.5c-2.4-3.2-5.8-1.2-4.4 1.2M16 13.5c2.4-3.2 5.8-1.2 4.4 1.2"
            fill="none"
            stroke={ink}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      );
  }
}

/** Pictos guides EM — jeux = GameMark, sujets = glyphes dédiés. */
export function GuideMark({
  slug,
  size = 24,
  className = "",
}: {
  slug: string;
  size?: number;
  className?: string;
}) {
  const visual = guideVisual(slug);
  if (visual.kind === "game") {
    return <GameMark gameId={visual.gameId} size={size} className={className} />;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
    >
      <rect width="32" height="32" rx="7" fill={visual.accent} />
      <TopicGlyph topic={visual.topic} ink={visual.ink} />
    </svg>
  );
}
