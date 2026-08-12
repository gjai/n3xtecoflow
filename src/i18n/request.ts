import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
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

async function loadSiteOverlay(siteId: string, locale: string) {
  if (siteId === "tumbler") {
    return (
      locale === "en"
        ? await import("../../messages/sites/tumbler/en.json")
        : await import("../../messages/sites/tumbler/fr.json")
    ).default as Messages;
  }
  return {};
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

  const base = (await import(`../../messages/${locale}.json`)).default as Messages;
  const overlay = await loadSiteOverlay(site.id, locale);

  return {
    locale,
    messages: mergeMessages(base, overlay),
  };
});
