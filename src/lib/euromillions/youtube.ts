import { formatEuroMillionsLongDate } from "./datetime";
import { formatShareJackpot } from "./share-card";
import type { EuroMillionsDraw } from "./types";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const UPLOAD_URL =
  "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";

function env(name: string): string {
  return process.env[name]?.trim() || "";
}

export function youtubeConfigured(): boolean {
  return Boolean(
    env("YOUTUBE_CLIENT_ID") &&
      env("YOUTUBE_CLIENT_SECRET") &&
      env("YOUTUBE_REFRESH_TOKEN"),
  );
}

function privacyStatus(): "public" | "unlisted" | "private" {
  const raw = env("YOUTUBE_PRIVACY").toLowerCase();
  if (raw === "unlisted" || raw === "private") return raw;
  return "public";
}

export function youtubeShortTitle(draw: EuroMillionsDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const hook =
    typeof draw.jackpotEur === "number" && draw.jackpotEur > 0
      ? formatShareJackpot(draw.jackpotEur).replace(/^Jackpot /, "")
      : "les numéros";
  const full = `EuroMillions ${date} — ${hook} #Shorts`;
  if (full.length <= 100) return full;
  const compact = `EuroMillions ${draw.date} — ${hook} #Shorts`;
  return compact.length <= 100 ? compact : compact.slice(0, 100);
}

export function youtubeShortDescription(draw: EuroMillionsDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const lines = [
    `Tirage du ${date}`,
    "",
    `${draw.numbers.join(" · ")}  ·  étoiles ${draw.stars.join(" · ")}`,
  ];
  if (draw.myMillionCode) lines.push(`My Million : ${draw.myMillionCode}`);
  if (typeof draw.jackpotEur === "number" && draw.jackpotEur > 0) {
    lines.push(formatShareJackpot(draw.jackpotEur));
  }
  lines.push(
    "",
    `https://euromillions-resultats.fr/fr/tirages/${draw.date}`,
    "18+ · jeu responsable · site indépendant. Nous ne vendons pas de tickets.",
    "",
    "#Shorts #EuroMillions #Tirage #FDJ #MyMillion",
  );
  return lines.join("\n").slice(0, 5000);
}

async function youtubeAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env("YOUTUBE_CLIENT_ID"),
      client_secret: env("YOUTUBE_CLIENT_SECRET"),
      refresh_token: env("YOUTUBE_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
  });
  const json = (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!json.access_token) {
    throw new Error(
      (json.error_description || json.error || "youtube_token_fail").slice(
        0,
        220,
      ),
    );
  }
  return json.access_token;
}

function apiError(json: unknown, fallback: string): string {
  const err = (json as { error?: { message?: string } } | null)?.error;
  return (err?.message || fallback).slice(0, 220);
}

export async function postYoutubeShort(args: {
  bytes: Buffer;
  title: string;
  description: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!youtubeConfigured()) return { ok: false, error: "youtube_unconfigured" };
  try {
    const token = await youtubeAccessToken();
    const init = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": String(args.bytes.length),
      },
      body: JSON.stringify({
        snippet: {
          title: args.title.slice(0, 100),
          description: args.description.slice(0, 5000),
          tags: ["EuroMillions", "FDJ", "tirage", "résultats", "Shorts"],
          categoryId: "22",
          defaultLanguage: "fr",
          defaultAudioLanguage: "fr",
        },
        status: {
          privacyStatus: privacyStatus(),
          selfDeclaredMadeForKids: false,
          embeddable: true,
        },
      }),
    });
    const location = init.headers.get("location");
    if (!location || !init.ok) {
      const json = await init.json().catch(() => null);
      return { ok: false, error: apiError(json, `youtube_init_${init.status}`) };
    }
    const put = await fetch(location, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "video/mp4",
        "Content-Length": String(args.bytes.length),
      },
      body: new Uint8Array(args.bytes),
    });
    const json = (await put.json()) as { id?: string; error?: { message?: string } };
    if (!put.ok || !json.id) {
      return { ok: false, error: apiError(json, `youtube_upload_${put.status}`) };
    }
    return { ok: true, id: json.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "youtube_upload_fail";
    return { ok: false, error: msg.slice(0, 220) };
  }
}
