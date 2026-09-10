import { promises as fs } from "fs";
import path from "path";

const TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const CREATOR_URL =
  "https://open.tiktokapis.com/v2/post/publish/creator_info/query/";
const INIT_URL = "https://open.tiktokapis.com/v2/post/publish/video/init/";
const STATUS_URL = "https://open.tiktokapis.com/v2/post/publish/status/fetch/";

export type TiktokPrivacy =
  | "PUBLIC_TO_EVERYONE"
  | "MUTUAL_FOLLOW_FRIENDS"
  | "FOLLOWER_OF_CREATOR"
  | "SELF_ONLY";

function env(name: string): string {
  return process.env[name]?.trim() || "";
}

export function tiktokConfigured(): boolean {
  return Boolean(
    env("TIKTOK_CLIENT_KEY") &&
      env("TIKTOK_CLIENT_SECRET") &&
      env("TIKTOK_REFRESH_TOKEN"),
  );
}

/** Refresh token: fichier volume en priorité (TikTok peut le faire tourner). */
function tokenCachePath(): string {
  const explicit = env("TIKTOK_OAUTH_PATH");
  if (explicit) return explicit;
  const fb = env("EM_FACEBOOK_PATH");
  if (fb) return path.join(path.dirname(fb), "tiktok-oauth.json");
  return path.join(process.cwd(), "data", "tiktok-oauth.json");
}

async function readCachedRefresh(): Promise<string> {
  try {
    const raw = await fs.readFile(tokenCachePath(), "utf8");
    const parsed = JSON.parse(raw) as { refresh_token?: string };
    return parsed.refresh_token?.trim() || "";
  } catch {
    return "";
  }
}

async function writeCachedRefresh(refreshToken: string): Promise<void> {
  const file = tokenCachePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(
    file,
    `${JSON.stringify({ refresh_token: refreshToken }, null, 2)}\n`,
  );
}

function apiError(json: unknown, fallback: string): string {
  const err = json as {
    error?: { code?: string; message?: string } | string;
    error_description?: string;
  } | null;
  if (typeof err?.error === "string") {
    return (err.error_description || err.error || fallback).slice(0, 220);
  }
  const nested = err?.error;
  if (nested && typeof nested === "object") {
    const code = nested.code && nested.code !== "ok" ? nested.code : "";
    return (nested.message || code || fallback).slice(0, 220);
  }
  return fallback.slice(0, 220);
}

/** Légende TikTok : 2200 unités UTF-16. */
export function tiktokCaption(text: string): string {
  const t = text.replace(/\r\n/g, "\n").trim();
  if (t.length <= 2200) return t;
  return t.slice(0, 2199).trimEnd();
}

export function pickTiktokPrivacy(
  options: string[],
  wanted: string,
): TiktokPrivacy {
  if (options.includes(wanted)) return wanted as TiktokPrivacy;
  if (options.includes("SELF_ONLY")) return "SELF_ONLY";
  const first = options[0];
  if (
    first === "PUBLIC_TO_EVERYONE" ||
    first === "MUTUAL_FOLLOW_FRIENDS" ||
    first === "FOLLOWER_OF_CREATOR" ||
    first === "SELF_ONLY"
  ) {
    return first;
  }
  return "SELF_ONLY";
}

function wantedPrivacy(): string {
  const raw = env("TIKTOK_PRIVACY").toUpperCase();
  if (
    raw === "PUBLIC_TO_EVERYONE" ||
    raw === "MUTUAL_FOLLOW_FRIENDS" ||
    raw === "FOLLOWER_OF_CREATOR" ||
    raw === "SELF_ONLY"
  ) {
    return raw;
  }
  return "SELF_ONLY";
}

async function tiktokAccessToken(): Promise<string> {
  const refresh =
    (await readCachedRefresh()) || env("TIKTOK_REFRESH_TOKEN");
  if (!refresh) throw new Error("tiktok_refresh_missing");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({
      client_key: env("TIKTOK_CLIENT_KEY"),
      client_secret: env("TIKTOK_CLIENT_SECRET"),
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
  });
  const json = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!json.access_token) {
    throw new Error(apiError(json, "tiktok_token_fail"));
  }
  if (json.refresh_token && json.refresh_token !== refresh) {
    await writeCachedRefresh(json.refresh_token);
  }
  return json.access_token;
}

async function creatorPrivacyOptions(token: string): Promise<string[]> {
  const res = await fetch(CREATOR_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: "{}",
  });
  const json = (await res.json()) as {
    data?: { privacy_level_options?: string[] };
    error?: { code?: string; message?: string };
  };
  if (json.error?.code && json.error.code !== "ok") {
    throw new Error(apiError(json, "tiktok_creator_fail"));
  }
  return json.data?.privacy_level_options || [];
}

async function pollPublish(token: string, publishId: string): Promise<void> {
  for (let i = 0; i < 6; i += 1) {
    const res = await fetch(STATUS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ publish_id: publishId }),
    });
    const json = (await res.json()) as {
      data?: { status?: string };
      error?: { code?: string; message?: string };
    };
    const status = json.data?.status || "";
    if (status === "PUBLISH_COMPLETE" || status === "SEND_TO_USER_INBOX") {
      return;
    }
    if (status === "FAILED" || status === "PUBLISH_FAILED") {
      throw new Error(apiError(json, "tiktok_publish_failed"));
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
}

export async function postTiktokVideo(args: {
  bytes: Buffer;
  caption: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!tiktokConfigured()) return { ok: false, error: "tiktok_unconfigured" };
  if (!(await readCachedRefresh()) && !env("TIKTOK_REFRESH_TOKEN")) {
    return { ok: false, error: "tiktok_unconfigured" };
  }
  try {
    const token = await tiktokAccessToken();
    const options = await creatorPrivacyOptions(token);
    const privacy = pickTiktokPrivacy(options, wantedPrivacy());
    const size = args.bytes.length;
    const init = await fetch(INIT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        post_info: {
          title: tiktokCaption(args.caption),
          privacy_level: privacy,
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 400,
          brand_content_toggle: false,
          brand_organic_toggle: false,
          is_aigc: false,
        },
        source_info: {
          source: "FILE_UPLOAD",
          video_size: size,
          chunk_size: size,
          total_chunk_count: 1,
        },
      }),
    });
    const initJson = (await init.json()) as {
      data?: { publish_id?: string; upload_url?: string };
      error?: { code?: string; message?: string };
    };
    if (!init.ok || (initJson.error?.code && initJson.error.code !== "ok")) {
      return { ok: false, error: apiError(initJson, `tiktok_init_${init.status}`) };
    }
    const uploadUrl = initJson.data?.upload_url;
    const publishId = initJson.data?.publish_id;
    if (!uploadUrl || !publishId) {
      return { ok: false, error: "tiktok_init_missing_upload" };
    }
    const put = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(size),
        "Content-Range": `bytes 0-${size - 1}/${size}`,
      },
      body: new Uint8Array(args.bytes),
    });
    if (!put.ok) {
      return { ok: false, error: `tiktok_upload_${put.status}` };
    }
    try {
      await pollPublish(token, publishId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "tiktok_status_fail";
      console.error("tiktok_status_fail", msg.slice(0, 220));
    }
    return { ok: true, id: publishId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "tiktok_upload_fail";
    return { ok: false, error: msg.slice(0, 220) };
  }
}
