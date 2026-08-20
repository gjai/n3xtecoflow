import { timingSafeEqual } from "crypto";

function bearerToken(request: Request): string {
  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) return "";
  return header.slice(7).trim();
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** Cron/jobs : `Authorization: Bearer …` uniquement. Pas de `?secret=`. */
export function cronAuthorized(
  request: Request,
  secret = process.env.NEWS_CRON_SECRET,
): boolean {
  const expected = secret?.trim() || "";
  const got = bearerToken(request);
  if (!expected || !got) return false;
  return safeEqual(got, expected);
}
