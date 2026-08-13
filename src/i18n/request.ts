import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { headers } from "next/headers";
import { routing } from "./routing";
import { getSiteByHost, getSiteById, SITE_HEADER } from "@/sites";

type Messages = Record<string, unknown>;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Deep-merge overlay onto base (overlay wins on leaf values). */
export function mergeMessages(base: Messages, overlay: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (isObject(value) && isObject(out[key])) {
      out[key] = mergeMessages(out[key] as Messages, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Overlay générique : messages/sites/<siteId>/{locale}.json
 * (ecoflow = base seule ; tumbler + futurs thèmes = overlay).
 */
function readMessagesFile(...parts: string[]): Messages | null {
  const file = join(process.cwd(), ...parts);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as Messages;
  } catch {
    return null;
  }
}

async function loadBaseMessages(locale: string): Promise<Messages> {
  try {
    return (await import(`../../messages/${locale}.json`)).default as Messages;
  } catch {
    if (locale !== "en") {
      return (await import(`../../messages/en.json`)).default as Messages;
    }
    return (await import(`../../messages/fr.json`)).default as Messages;
  }
}

function loadSiteOverlay(siteId: string, locale: string): Messages {
  if (siteId === "ecoflow") return {};
  return (
    readMessagesFile("messages", "sites", siteId, `${locale}.json`) ||
    (locale !== "en"
      ? readMessagesFile("messages", "sites", siteId, "en.json") || {}
      : {}) ||
    {}
  );
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const h = await headers();
  const site = h.get(SITE_HEADER)
    ? getSiteById(h.get(SITE_HEADER))
    : getSiteByHost(h.get("host"));

  const base = await loadBaseMessages(locale);
  const overlay = loadSiteOverlay(site.id, locale);

  return {
    locale,
    messages: mergeMessages(base, overlay),
  };
});
