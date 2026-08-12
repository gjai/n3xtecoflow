import { ecoflowSite } from "./ecoflow";
import type { SiteConfig, SiteId } from "./types";

export const sites: SiteConfig[] = [ecoflowSite];

export const sitesById: Record<SiteId, SiteConfig> = {
  ecoflow: ecoflowSite,
};

/**
 * Multi-host, one brand: ecoflow-stream.com + powerstream.fr → univers EcoFlow.
 * Add another brand later: new file in src/sites/, SiteId + registry, DNS + Coolify.
 */

export const DEFAULT_SITE_ID: SiteId = "ecoflow";
export const SITE_HEADER = "x-site-id";

export function normalizeHost(host: string | null | undefined): string {
  if (!host) return "";
  return host.split(":")[0].trim().toLowerCase();
}

export function resolveSiteIdFromHost(host: string | null | undefined): SiteId {
  const h = normalizeHost(host);
  if (!h) return DEFAULT_SITE_ID;
  for (const site of sites) {
    if (site.hosts.includes(h)) return site.id;
  }
  return DEFAULT_SITE_ID;
}

export function getSiteById(id: SiteId | string | null | undefined): SiteConfig {
  if (id && id in sitesById) return sitesById[id as SiteId];
  return ecoflowSite;
}

export function getSiteByHost(host: string | null | undefined): SiteConfig {
  return getSiteById(resolveSiteIdFromHost(host));
}

export function absoluteSiteUrl(site: SiteConfig, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `https://${site.primaryHost}${clean}`;
}

/** Sister sites for cross-linking (excludes current). Empty while single-brand. */
export function getNetworkLinks(site: SiteConfig) {
  return site.network
    .map((n) => {
      const target = sitesById[n.siteId];
      if (!target) return null;
      return {
        ...n,
        href: `https://${target.primaryHost}/fr`,
        name: target.brand.name,
      };
    })
    .filter(Boolean) as {
    siteId: SiteId;
    labelFr: string;
    labelEn: string;
    href: string;
    name: string;
  }[];
}
