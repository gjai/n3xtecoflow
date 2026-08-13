import type { CSSProperties, ReactNode } from "react";
import {
  GAME_IDENTITY,
  gameMarkSrc,
} from "@/lib/fdj-games/identity";
import type { LotteryGameId } from "@/lib/fdj-games/nav";

export function GameMark({
  gameId,
  size = 24,
  className = "",
}: {
  gameId: LotteryGameId;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={gameMarkSrc(gameId)}
      alt=""
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
    />
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
