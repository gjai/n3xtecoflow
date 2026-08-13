import type { CSSProperties, ReactNode } from "react";
import { GAME_IDENTITY } from "@/lib/fdj-games/identity";
import type { LotteryGameId } from "@/lib/fdj-games/nav";

function Glyph({ gameId, ink }: { gameId: LotteryGameId; ink: string }) {
  switch (gameId) {
    case "euromillions":
      return (
        <>
          <circle
            cx="16"
            cy="16"
            r="8"
            fill="none"
            stroke={ink}
            strokeWidth="2"
          />
          <path
            d="M16 11.2l1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4L16 11.2z"
            fill={ink}
          />
        </>
      );
    case "my-million":
      return (
        <>
          <rect x="7" y="9" width="18" height="14" rx="2.5" fill={ink} />
          <path
            d="M7 16h18"
            stroke={GAME_IDENTITY["my-million"].accent}
            strokeWidth="1.4"
            strokeDasharray="1.8 1.6"
          />
          <rect x="19" y="9" width="6" height="14" rx="1.5" fill="#0f766e" />
        </>
      );
    case "loto":
      return (
        <>
          <circle cx="11" cy="13" r="2.4" fill={ink} />
          <circle cx="16" cy="11.5" r="2.4" fill={ink} />
          <circle cx="21" cy="13" r="2.4" fill={ink} />
          <circle cx="13" cy="18.5" r="2.4" fill={ink} />
          <circle cx="19" cy="18.5" r="2.4" fill={ink} />
          <circle
            cx="24.2"
            cy="22.2"
            r="3.2"
            fill="none"
            stroke={ink}
            strokeWidth="1.6"
          />
        </>
      );
    case "eurodreams":
      return (
        <>
          <path
            d="M18.2 8.8a8 8 0 1 0 5 13.4 8.6 8.6 0 0 1-5-13.4z"
            fill={ink}
          />
          <path
            d="M22.2 8.4l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2.7-1.5z"
            fill={ink}
          />
        </>
      );
    case "crescendo":
      return (
        <>
          <rect x="7" y="19" width="3.4" height="6" rx="1" fill={ink} />
          <rect x="12.2" y="15.5" width="3.4" height="9.5" rx="1" fill={ink} />
          <rect x="17.4" y="12" width="3.4" height="13" rx="1" fill={ink} />
          <rect x="22.6" y="8" width="3.4" height="17" rx="1" fill={ink} />
        </>
      );
    case "keno":
      return (
        <>
          {[11, 16, 21].flatMap((x) =>
            [11, 16, 21].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" fill={ink} />
            )),
          )}
        </>
      );
  }
}

/** Pictos inline — pas d’<img>, donc pas de preload React 19 avant le CSS. */
export function GameMark({
  gameId,
  size = 24,
  className = "",
}: {
  gameId: LotteryGameId;
  size?: number;
  className?: string;
}) {
  const { accent, accentInk } = GAME_IDENTITY[gameId];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
    >
      <rect width="32" height="32" rx="7" fill={accent} />
      <Glyph gameId={gameId} ink={accentInk} />
    </svg>
  );
}

export function GameLabel({
  gameId,
  children,
  size = 18,
  className = "",
}: {
  gameId: LotteryGameId;
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <GameMark gameId={gameId} size={size} />
      <span>{children}</span>
    </span>
  );
}

export function gameUnderline(gameId: LotteryGameId): CSSProperties {
  return {
    boxShadow: `inset 0 -2px 0 ${GAME_IDENTITY[gameId].accent}`,
  };
}
