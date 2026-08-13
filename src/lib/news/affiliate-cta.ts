import {
  affiliateOffer,
  resolveAffiliateOffers,
  type AffiliateOffer,
} from "@/lib/affiliates";
import type { NewsArticle } from "@/lib/news/types";
import type { SiteConfig } from "@/sites/types";

const OFFER_ORDER = ["stake", "cryptocom", "nordvpn"] as const;

function newsHaystack(article: NewsArticle): string {
  return [
    article.fr?.title,
    article.en?.title,
    article.fr?.excerpt,
    article.en?.excerpt,
    ...(article.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function scoreOffer(hay: string, id: string): number {
  switch (id) {
    case "stake":
      return (
        (/\bstake\b/.test(hay) ? 6 : 0) +
        (/casino|gambling|slots?|bonus|wager|mise/.test(hay) ? 3 : 0)
      );
    case "cryptocom":
      return (
        (/crypto\.com|cryptocom/.test(hay) ? 6 : 0) +
        (/wallet|on-?ramp|exchange|usdt|\bbtc\b|acheter\s*crypto|crypto\s*app/.test(
          hay,
        )
          ? 3
          : 0)
      );
    case "nordvpn":
      return (
        (/nordvpn|nord\s*vpn/.test(hay) ? 6 : 0) +
        (/\bvpn\b|kill-?switch|connexion\s*(s[eé]curis[eé]e|priv[eé]e)/.test(
          hay,
        )
          ? 3
          : 0)
      );
    default:
      return 0;
  }
}

/**
 * Pick affiliate CTAs for a news piece (Stake / Crypto.com / NordVPN).
 * Primary = best topic match, default Stake.
 */
export function affiliateCtaForNews(
  article: NewsArticle,
  site: SiteConfig,
): {
  primary: AffiliateOffer | undefined;
  offers: AffiliateOffer[];
  matchedId: string;
} {
  const offers = resolveAffiliateOffers(site).filter((o) =>
    (OFFER_ORDER as readonly string[]).includes(o.id),
  );
  const ordered = OFFER_ORDER.map((id) => affiliateOffer(site, id)).filter(
    Boolean,
  ) as AffiliateOffer[];
  const list = ordered.length ? ordered : offers;
  const hay = newsHaystack(article);

  let matchedId = "stake";
  let best = -1;
  for (const id of OFFER_ORDER) {
    const s = scoreOffer(hay, id);
    if (s > best) {
      best = s;
      matchedId = id;
    }
  }
  if (best <= 0) matchedId = "stake";

  const primary =
    list.find((o) => o.id === matchedId) || list[0] || undefined;

  return {
    primary,
    offers: list,
    matchedId: primary?.id || matchedId,
  };
}
