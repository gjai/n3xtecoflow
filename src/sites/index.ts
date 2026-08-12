import { ecoflowSite } from "./ecoflow";
import { tumblerSite } from "./tumbler";
import type { SiteConfig, SiteId } from "./types";

/**
 * Thèmes actifs :
 * - ecoflow → ecoflow-stream.com + powerstream.fr
 * - tumbler → mon-tumbler.fr (La gourde isotherme)
 *
 * Nouveau DOMAINE même thème → hosts[] du site.
 * Nouveau THÈME → fichier + SiteId + registry + brands/ + Coolify FQDN.
 */

export const sites: SiteConfig[] = [ecoflowSite, tumblerSite];

export const sitesById: Record<SiteId, SiteConfig> = {
  ecoflow: ecoflowSite,
  tumbler: tumblerSite,
};

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

/** Sister / external network links for the footer (skips current siteId). */
export function getNetworkLinks(site: SiteConfig) {
  return site.network
    .map((n) => {
      if (n.href) {
        const href = n.href.replace(/\/$/, "");
        return {
          key: href,
          labelFr: n.labelFr,
          labelEn: n.labelEn,
          href,
          name: n.labelFr,
          external: true,
        };
      }
      if (!n.siteId || n.siteId === site.id) return null;
      const target = sitesById[n.siteId];
      if (!target) return null;
      return {
        key: n.siteId,
        labelFr: n.labelFr,
        labelEn: n.labelEn,
        href: `https://${target.primaryHost}/fr`,
        name: target.brand.name,
        external: false,
      };
    })
    .filter(Boolean) as {
    key: string;
    labelFr: string;
    labelEn: string;
    href: string;
    name: string;
    external: boolean;
  }[];
}
