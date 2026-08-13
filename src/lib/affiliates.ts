import { usesEnglishFallback } from "@/i18n/locales";
import type { SiteConfig } from "@/sites/types";

export type AffiliateOffer = {
  id: string;
  labelFr: string;
  labelEn: string;
  href: string;
};

/** Prefer messages `offers.<id>` when provided; else FR/EN config labels. */
export function localizedOfferLabel(
  offer: AffiliateOffer,
  locale: string,
  translated?: string | null,
): string {
  if (translated) return translated;
  return usesEnglishFallback(locale) ? offer.labelEn : offer.labelFr;
}

export function resolveAffiliateOffers(site: SiteConfig): AffiliateOffer[] {
  const raw = site.monetization?.offers || [];
  return raw.map((o) => {
    const fromEnv = o.envKey ? process.env[o.envKey]?.trim() : "";
    return {
      id: o.id,
      labelFr: o.labelFr,
      labelEn: o.labelEn,
      href: fromEnv || o.url,
    };
  });
}

export function affiliateOffer(
  site: SiteConfig,
  id: string,
): AffiliateOffer | undefined {
  return resolveAffiliateOffers(site).find((o) => o.id === id);
}
