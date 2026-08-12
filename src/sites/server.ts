import { headers } from "next/headers";
import { getSiteByHost, getSiteById, SITE_HEADER } from "./index";
import type { SiteConfig } from "./types";

/** Server-side: resolve active site from middleware header or Host. */
export async function getCurrentSite(): Promise<SiteConfig> {
  const h = await headers();
  const fromHeader = h.get(SITE_HEADER);
  if (fromHeader) return getSiteById(fromHeader);
  return getSiteByHost(h.get("host"));
}
