import { Link } from "@/i18n/navigation";
import { AffiliateLinkedText } from "@/components/AffiliateLinkedText";
import { AffiliateOfferButton } from "@/components/AffiliateOfferButton";
import { HeroSlider, type HeroSlide } from "@/components/HeroSlider";
import { SmartCover } from "@/components/SmartCover";
import {
  resolveAffiliateOffers,
  type AffiliateOffer,
} from "@/lib/affiliates";
import {
  CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG,
  CASINOS_CRYPTO_STAKE_GUIDE_SLUG,
  CASINOS_CRYPTO_VPN_GUIDE_SLUG,
  casinosCryptoGuideCovers,
} from "@/data/casinos-crypto-guides";
import { getEditorialImages } from "@/data/images";
import { usesEnglishFallback } from "@/i18n/locales";
import type { NewsArticle } from "@/lib/news/types";
import type { SiteConfig } from "@/sites/types";

function buildCasinoHeroSlides(
  locale: string,
  site: SiteConfig,
  latestNews: NewsArticle[],
): HeroSlide[] {
  const isEn = usesEnglishFallback(locale);
  const editorial = getEditorialImages(site.id);
  const stakeCover = casinosCryptoGuideCovers[CASINOS_CRYPTO_STAKE_GUIDE_SLUG];
  const cryptoCover =
    casinosCryptoGuideCovers[CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG];
  const vpnCover = casinosCryptoGuideCovers[CASINOS_CRYPTO_VPN_GUIDE_SLUG];
  const latest = latestNews[0];
  const newsCopy = latest ? (isEn ? latest.en : latest.fr) : null;

  return [
    {
      id: latest ? `news-${latest.slug}` : "news-fallback",
      kind: isEn ? "News" : "Actu",
      title:
        newsCopy?.title ||
        (isEn
          ? "Online crypto casino & Stake news"
          : "Actus casino en ligne & Stake"),
      excerpt:
        newsCopy?.excerpt ||
        (isEn
          ? "Editorial briefs on Stake, crypto deposits and VPN access."
          : "Synthèses sur Stake, dépôt crypto et accès VPN."),
      href: latest ? `/actualites/${latest.slug}` : "/actualites",
      cta: isEn ? "Read the article" : "Lire l’article",
      imageSrc: latest?.imageSrc || editorial.news.src || site.heroImage,
      imageAlt: isEn ? editorial.news.altEn : editorial.news.altFr,
    },
    {
      id: "stake-guide",
      kind: "Stake",
      title: isEn
        ? "Stake online crypto casino: full guide"
        : "Stake casino en ligne crypto : guide complet",
      excerpt: isEn
        ? "How to access Stake, deposit crypto, KYC and play responsibly — 18+."
        : "Comment accéder à Stake, déposer en crypto, KYC et jouer responsable — 18+.",
      href: `/guides/${CASINOS_CRYPTO_STAKE_GUIDE_SLUG}`,
      cta: isEn ? "Read the Stake guide" : "Lire le guide Stake",
      imageSrc: stakeCover.src,
      imageAlt: isEn ? "Stake guide cover" : "Couverture guide Stake",
    },
    {
      id: "vpn-guide",
      kind: "VPN",
      title: isEn
        ? "VPN for Stake / online crypto casino"
        : "VPN pour Stake / casino crypto",
      excerpt: isEn
        ? "Steadier access and connection before you play — kill-switch setup."
        : "Accéder et jouer plus sereinement — setup kill-switch.",
      href: `/guides/${CASINOS_CRYPTO_VPN_GUIDE_SLUG}`,
      cta: isEn ? "Read the VPN guide" : "Lire le guide VPN",
      imageSrc: vpnCover.src,
      imageAlt: isEn ? "VPN guide cover" : "Couverture guide VPN",
    },
    {
      id: "wallet-guide",
      kind: isEn ? "Guide" : "Guide",
      title: isEn
        ? "Buy crypto for Stake with Crypto.com"
        : "Acheter de la crypto pour Stake (Crypto.com)",
      excerpt: isEn
        ? "Wallet and deposit path before an online casino session."
        : "Wallet et dépôt avant une session casino en ligne.",
      href: `/guides/${CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG}`,
      cta: isEn ? "Read the wallet guide" : "Lire le guide wallet",
      imageSrc: cryptoCover.src,
      imageAlt: isEn ? "Crypto.com guide cover" : "Couverture guide Crypto.com",
    },
  ];
}

export function CasinosCryptoHome({
  site,
  locale,
  stake,
  nordvpn,
  cryptocom,
  latestNews = [],
}: {
  site: SiteConfig;
  locale: string;
  stake?: AffiliateOffer;
  nordvpn?: AffiliateOffer;
  cryptocom?: AffiliateOffer;
  latestNews?: NewsArticle[];
}) {
  const isEn = usesEnglishFallback(locale);
  const brand = site.brand.name;
  const editorial = getEditorialImages(site.id);
  const stakeCover = casinosCryptoGuideCovers[CASINOS_CRYPTO_STAKE_GUIDE_SLUG];
  const cryptoCover =
    casinosCryptoGuideCovers[CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG];
  const vpnCover = casinosCryptoGuideCovers[CASINOS_CRYPTO_VPN_GUIDE_SLUG];
  const heroSlides = buildCasinoHeroSlides(locale, site, latestNews);
  const keywordOffers = resolveAffiliateOffers(site);
  const L = ({ text }: { text: string }) => (
    <AffiliateLinkedText text={text} offers={keywordOffers} />
  );

  return (
    <>
      <HeroSlider
        brandName={brand}
        slides={heroSlides}
        compact
        affiliateKeywordOffers={keywordOffers}
        footerNote={
          isEn
            ? "18+ · Play responsibly · Affiliate links"
            : "18+ · Jouez responsable · Liens d’affiliation"
        }
      />

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-2">
          <SmartCover
            src={stakeCover.src}
            fallback={editorial.guides}
            locale={locale}
            credit={stakeCover.credit}
            className="aspect-[4/3] w-full md:aspect-auto md:min-h-[420px]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="flex flex-col justify-center px-5 py-14 md:px-10 md:py-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
              <L
                text={
                  isEn
                    ? "Stake online crypto casino"
                    : "Stake : casino en ligne crypto"
                }
              />
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              <L
                text={
                  isEn
                    ? "How to start on Stake, prepare access and deposit crypto — if you stay within a fixed leisure budget (18+)."
                    : "Comment démarrer sur Stake, préparer l’accès et un dépôt crypto — à condition de rester dans un budget loisir (18+)."
                }
              />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_STAKE_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {isEn ? "Stake guide" : "Guide Stake"}
              </Link>
              {stake ? (
                <AffiliateOfferButton
                  href={stake.href}
                  label={isEn ? stake.labelEn : stake.labelFr}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-5 py-14 md:order-1 md:px-10 md:py-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
              <L text={isEn ? "Crypto.com wallet" : "Wallet Crypto.com"} />
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              <L
                text={
                  isEn
                    ? "Buy and hold crypto before a Stake deposit. A practical on-ramp — separate from gambling risk."
                    : "Achetez et stockez la crypto avant un dépôt Stake. On-ramp pratique — distinct du risque de jeu."
                }
              />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {isEn ? "Crypto.com guide" : "Guide Crypto.com"}
              </Link>
              {cryptocom ? (
                <AffiliateOfferButton
                  href={cryptocom.href}
                  label={isEn ? cryptocom.labelEn : cryptocom.labelFr}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>
          <SmartCover
            src={cryptoCover.src}
            fallback={editorial.camping}
            locale={locale}
            credit={cryptoCover.credit}
            className="order-1 aspect-[4/3] w-full md:order-2 md:aspect-auto md:min-h-[420px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-2">
          <SmartCover
            src={vpnCover.src}
            fallback={editorial.backup}
            locale={locale}
            credit={vpnCover.credit}
            className="aspect-[4/3] w-full md:aspect-auto md:min-h-[420px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="flex flex-col justify-center px-5 py-14 md:px-10 md:py-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
              <L text={isEn ? "VPN companion" : "VPN compagnon"} />
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              <L
                text={
                  isEn
                    ? "A stable, private connection before you play — kill-switch, stable server, full session."
                    : "Connexion stable et privée avant de jouer — kill-switch, serveur stable, session complète."
                }
              />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_VPN_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {isEn ? "VPN guide" : "Guide VPN"}
              </Link>
              {nordvpn ? (
                <AffiliateOfferButton
                  href={nordvpn.href}
                  label={isEn ? nordvpn.labelEn : nordvpn.labelFr}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
            {isEn ? "How to start" : "Comment démarrer"}
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-2">
            {(isEn
              ? [
                  "Set a leisure budget you can lose",
                  "Create an account + enable 2FA",
                  "Buy crypto via Crypto.com (small test amount)",
                  "Deposit on Stake, then test a withdrawal early",
                ]
              : [
                  "Fixez un budget loisir que vous pouvez perdre",
                  "Créez un compte + activez la 2FA",
                  "Achetez la crypto via Crypto.com (petit montant test)",
                  "Déposez sur Stake, puis testez un retrait tôt",
                ]
            ).map((step, i) => (
              <li
                key={step}
                className="flex gap-4 border-t border-[var(--line)] pt-4"
              >
                <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[var(--heading)]">
                  <L text={step} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {latestNews.length ? (
        <section className="border-b border-[var(--line)]">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
                {isEn ? "Latest news" : "Dernières actus"}
              </h2>
              <Link
                href="/actualites"
                className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {isEn ? "All news →" : "Toutes les actus →"}
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {latestNews.slice(0, 3).map((article) => {
                const copy = isEn ? article.en : article.fr;
                return (
                  <li key={article.slug}>
                    <Link
                      href={`/actualites/${article.slug}`}
                      className="group block overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
                    >
                      <SmartCover
                        src={article.imageSrc}
                        fallback={editorial.news}
                        locale={locale}
                        credit={article.imageCredit}
                        className="aspect-[16/9] w-full"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="p-4">
                        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)] group-hover:text-[var(--accent)]">
                          {copy.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                          {copy.excerpt}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

    </>
  );
}
