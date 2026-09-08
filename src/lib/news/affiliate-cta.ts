import {
  resolveAffiliateOffers,
  type AffiliateOffer,
} from "@/lib/affiliates";
import type { NewsArticle } from "@/lib/news/types";
import type { SiteConfig } from "@/sites/types";

/**
 * Pick affiliate CTAs for a news piece from the theme’s configured offers.
 */
export function affiliateCtaForNews(
  _article: NewsArticle,
  site: SiteConfig,
): {
  primary: AffiliateOffer | undefined;
  offers: AffiliateOffer[];
  matchedId: string;
} {
  const offers = resolveAffiliateOffers(site);
  const primary = offers[0];
  return {
    primary,
    offers,
    matchedId: primary?.id || "",
  };
}
