import { ImageResponse } from "next/og";
import { GAME_IDENTITY } from "@/lib/fdj-games/identity";
import type { FdjGameDraw } from "@/lib/fdj-games/types";
import { formatEuroMillionsLongDate } from "./datetime";
import type { EuroMillionsDraw } from "./types";

export const SHARE_FEED = { width: 1200, height: 630 } as const;
/** Fil Instagram : portrait 4:5 (le 1200×630 Facebook est trop large). */
export const SHARE_IG_FEED = { width: 1080, height: 1350 } as const;
export const SHARE_STORY = { width: 1080, height: 1920 } as const;

type ShareLayout = "feed" | "ig" | "story";

function shareLayout(size: { width: number; height: number }): ShareLayout {
  if (size.height >= 1800) return "story";
  if (size.height > size.width) return "ig";
  return "feed";
}

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
  const layout = shareLayout(size);
  const portrait = layout !== "feed";
  const ball = layout === "story" ? 128 : layout === "ig" ? 112 : 88;
  const pad =
    layout === "story"
      ? "140px 72px 220px"
      : layout === "ig"
        ? "72px 64px 64px"
        : "52px 64px 40px";
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#0b1220",
          padding: pad,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            color: card.accent,
            fontSize: portrait ? 26 : 20,
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
            fontSize: layout === "story" ? 52 : layout === "ig" ? 44 : 42,
            fontWeight: 700,
            marginTop: portrait ? 18 : 12,
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
              marginTop: i === 0 ? (portrait ? 56 : 40) : 18,
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
        {portrait ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: card.accent,
                color: card.accentInk,
                borderRadius: 28,
                padding: layout === "story" ? "28px 36px" : "24px 32px",
              }}
            >
              <div style={{ display: "flex", fontSize: 24, fontWeight: 600 }}>
                Vérifier vos gains sur
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: layout === "story" ? 32 : 28,
                  fontWeight: 700,
                  marginTop: 8,
                }}
              >
                euromillions-resultats.fr
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: layout === "story" ? 28 : 20,
                color: "#8494ad",
                fontSize: 20,
              }}
            >
              18+ · jeu responsable · site indépendant
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              color: "#8494ad",
              fontSize: 20,
            }}
          >
            Vérifier vos gains sur euromillions-resultats.fr · 18+
          </div>
        )}
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

function clip(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export function newsShareImageResponse(
  title: string,
  excerpt: string,
  size: { width: number; height: number },
  coverUrl?: string,
) {
  const layout = shareLayout(size);
  const portrait = layout !== "feed";
  const accent = GAME_IDENTITY.euromillions.accent;
  const pad =
    layout === "story"
      ? "140px 72px 220px"
      : layout === "ig"
        ? "72px 64px 64px"
        : "52px 64px 40px";
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#0b1220",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}
        {coverUrl ? (
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to bottom, rgba(11,18,32,0.35) 0%, rgba(11,18,32,0.92) 60%, rgba(11,18,32,0.98) 100%)",
            }}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: pad,
            position: "relative",
            justifyContent: coverUrl ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              color: accent,
              fontSize: portrait ? 26 : 20,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            Actualité
          </div>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: layout === "story" ? 48 : layout === "ig" ? 40 : 38,
              fontWeight: 700,
              marginTop: portrait ? 24 : 16,
              lineHeight: 1.2,
            }}
          >
            {clip(title, portrait ? 140 : 110)}
          </div>
          <div
            style={{
              display: "flex",
              color: "#b8c4d8",
              fontSize: portrait ? 26 : 22,
              marginTop: portrait ? 28 : 20,
              lineHeight: 1.4,
            }}
          >
            {clip(excerpt, portrait ? 220 : 160)}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: coverUrl ? 24 : "auto",
              color: "#8494ad",
              fontSize: portrait ? 22 : 20,
            }}
          >
            euromillions-resultats.fr · 18+ · jeu responsable
          </div>
        </div>
      </div>
    ),
    { width: size.width, height: size.height },
  );
}
