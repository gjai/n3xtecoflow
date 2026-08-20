import { createHmac, timingSafeEqual } from "crypto";

const MIN_MS = 2_000;
const MAX_MS = 4 * 3600_000;

function guardSecret(): string {
  return (
    process.env.FORM_GUARD_SECRET?.trim() ||
    process.env.NEWS_CRON_SECRET?.trim() ||
    "n3xtecoflow-contact-guard"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", guardSecret()).update(payload).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  try {
    const left = Buffer.from(a, "hex");
    const right = Buffer.from(b, "hex");
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

/** Jeton émis par la page contact, vérifié à l’envoi. */
export function issueContactGuard(now = Date.now()): string {
  const ts = String(now);
  return `${ts}.${sign(`contact:${ts}`)}`;
}

export function verifyContactGuard(
  token: string | undefined,
  now = Date.now(),
): boolean {
  const raw = (token || "").trim();
  const dot = raw.indexOf(".");
  if (dot < 1) return false;
  const ts = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  if (!/^\d{10,16}$/.test(ts) || !/^[a-f0-9]{64}$/.test(mac)) return false;
  if (!safeEqualHex(mac, sign(`contact:${ts}`))) return false;
  const issued = Number(ts);
  const age = now - issued;
  return age >= MIN_MS && age <= MAX_MS;
}

/** Origin du fetch = hôte de la requête (bloque les POST hors site). */
export function contactOriginOk(request: Request): boolean {
  const host = request.headers.get("host")?.trim();
  if (!host) return false;
  const origin = request.headers.get("origin")?.trim();
  if (!origin) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const SPAM_RE =
  /viagra|cialis|levitra|backlink\s*package|cheap\s*seo|guest\s*post\s*price|crypto\s*invest|guaranteed\s*roi|onlyfans|telegram\s*@|whatsapp\s*\+/i;

export function isSpammyContact(args: {
  name: string;
  email: string;
  message: string;
}): boolean {
  const message = args.message;
  const urls = message.match(/https?:\/\/[^\s]+/gi) || [];
  if (urls.length >= 4) return true;
  if (urls.length >= 2 && message.length < 80) return true;
  const emailsInBody = message.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g) || [];
  if (emailsInBody.length > 3) return true;
  const blob = `${args.name}\n${args.email}\n${message}`;
  if (SPAM_RE.test(blob) && urls.length >= 1) return true;
  return false;
}
