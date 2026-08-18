import { ImageResponse } from "next/og";
import { GAME_IDENTITY } from "@/lib/fdj-games/identity";
import type { FdjGameDraw } from "@/lib/fdj-games/types";
import { formatEuroMillionsLongDate } from "./datetime";
import type { EuroMillionsDraw } from "./types";

export const SHARE_FEED = { width: 1200, height: 630 } as const;
export const SHARE_STORY = { width: 1080, height: 1920 } as const;

export type ShareCardInput = {
  kicker: string;
  dateLabel: string;
  accent: string;
  accentInk: string;
  rows: { values: Array<number | string>; outlined?: boolean }[];
};

function Ball({
  n,
  accent,
  accentInk,
  outlined,
  size,
}: {
  n: number | string;
  accent: string;
  accentInk: string;
  outlined?: boolean;
  size: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: size,
        height: size,
        marginRight: Math.round(size * 0.14),
        marginBottom: Math.round(size * 0.12),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Math.round(size / 2),
        background: outlined ? "#0b1220" : accent,
        border: `4px solid ${accent}`,
        color: outlined ? accent : accentInk,
        fontSize: Math.round(size * 0.38),
        fontWeight: 700,
      }}
    >
      {String(n)}
    </div>
  );
}

export function lotteryShareImageResponse(
  card: ShareCardInput,
  size: { width: number; height: number },
) {
  const story = size.height > size.width;
  const ball = story ? 128 : 88;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#0b1220",
          padding: story ? "96px 72px 72px" : "52px 64px 40px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            color: card.accent,
            fontSize: story ? 28 : 20,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          {card.kicker}
        </div>
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: story ? 52 : 42,
            fontWeight: 700,
            marginTop: story ? 20 : 12,
          }}
        >
          {card.dateLabel}
        </div>
        {card.rows.map((row, i) => (
          <div
            key={`r-${i}`}
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: i === 0 ? (story ? 64 : 40) : 18,
            }}
          >
            {row.values.map((n, j) => (
              <Ball
                key={`${i}-${j}`}
                n={n}
                accent={card.accent}
                accentInk={card.accentInk}
                outlined={row.outlined}
                size={ball}
              />
            ))}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            color: "#8494ad",
            fontSize: story ? 24 : 20,
          }}
        >
          euromillions-resultats.fr · 18+ · jeu responsable
        </div>
      </div>
    ),
    { width: size.width, height: size.height },
  );
}

export function euroMillionsShareCard(draw: EuroMillionsDraw): ShareCardInput {
  const id = GAME_IDENTITY.euromillions;
  return {
    kicker: "EuroMillions Résultats",
    dateLabel: formatEuroMillionsLongDate(draw.date, "fr"),
    accent: id.accent,
    accentInk: id.accentInk,
    rows: [
      { values: draw.numbers },
      { values: draw.stars, outlined: true },
    ],
  };
}

export function companionShareCard(draw: FdjGameDraw): ShareCardInput {
  const id = GAME_IDENTITY[draw.gameId];
  const title =
    draw.gameId === "loto"
      ? "Loto"
      : draw.gameId === "eurodreams"
        ? "EuroDreams"
        : draw.gameId;
  const numbers = draw.groups.find((g) => g.kind === "numbers");
  const bonus = draw.groups.find((g) => g.kind === "bonus");
  const rows: ShareCardInput["rows"] = [];
  if (numbers?.values.length) rows.push({ values: numbers.values });
  if (bonus?.values.length) rows.push({ values: bonus.values, outlined: true });
  return {
    kicker: `${title} · Résultats`,
    dateLabel: formatEuroMillionsLongDate(draw.date, "fr"),
    accent: id.accent,
    accentInk: id.accentInk,
    rows,
  };
}

export function euroMillionsShareImageResponse(draw: EuroMillionsDraw) {
  return lotteryShareImageResponse(euroMillionsShareCard(draw), SHARE_FEED);
}
