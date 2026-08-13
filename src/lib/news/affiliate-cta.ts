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

function isGeneralCrypto(hay: string): boolean {
  return /cryptocurrenc|cryptomonnaie|\bbitcoin\b|\bethereum\b|\bbtc\b|\beth\b|\busdt\b|\bstablecoin\b|\bcrypto\b/.test(
    hay,
  );
}

function scoreOffer(hay: string, id: string): number {
  switch (id) {
    case "stake":
      return (
        (/\bstake(\.com)?\b/.test(hay) ? 6 : 0) +
        (/casino|gambling|slots?|bonus|wager|mise/.test(hay) ? 3 : 0)
      );
    case "cryptocom":
      return (
        (/crypto\.com|cryptocom/.test(hay) ? 8 : 0) +
        (/wallet|on-?ramp|exchange|usdt|\bbtc\b|\beth\b|acheter\s*crypto|crypto\s*app|bitcoin|ethereum|cryptocurrenc|cryptomonnaie|stablecoin/.test(
          hay,
        )
          ? 5
          : 0) +
        // Actus crypto « générales » → pousser Crypto.com même sans marque explicite
        (isGeneralCrypto(hay) &&
        !/\bstake(\.com)?\b/.test(hay) &&
        !/nordvpn|nord\s*vpn/.test(hay)
          ? 4
          : 0)
      );
    case "nordvpn":
      return (
        (/nordvpn|nord\s*vpn/.test(hay) ? 6 : 0) +
        (/\bvpn\b|kill-?switch|connexion\s*(s[eé]curis[eé]e|priv[eé]e)|privacy/.test(
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
 * Primary = best topic match.
 * Crypto générales → Crypto.com ; casino/Stake → Stake ; VPN → NordVPN.
 * Always returns all three offers when configured (Crypto.com always present).
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

  let matchedId: (typeof OFFER_ORDER)[number] = "stake";
  let best = -1;
  for (const id of OFFER_ORDER) {
    const s = scoreOffer(hay, id);
    if (s > best) {
      best = s;
      matchedId = id;
    }
  }
  if (best <= 0) {
    matchedId = isGeneralCrypto(hay) ? "cryptocom" : "stake";
  }

  // Garantir Crypto.com dans la liste affichée (actus crypto / wallet).
  const cryptocom = affiliateOffer(site, "cryptocom");
  const withCrypto =
    cryptocom && !list.some((o) => o.id === "cryptocom")
      ? [...list, cryptocom]
      : list;

  // Sur actu crypto générale : Crypto.com en tête de liste visuelle.
  const offersOut =
    matchedId === "cryptocom" && cryptocom
      ? [
          cryptocom,
          ...withCrypto.filter((o) => o.id !== "cryptocom"),
        ]
      : withCrypto;

  const primary =
    offersOut.find((o) => o.id === matchedId) ||
    cryptocom ||
    offersOut[0] ||
    undefined;

  return {
    primary,
    offers: offersOut,
    matchedId: primary?.id || matchedId,
  };
}
