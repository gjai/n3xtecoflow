import { getTranslations } from "next-intl/server";
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
  CASINOS_CRYPTO_CRYPTO_GUIDE_SLUG,
  CASINOS_CRYPTO_STAKE_GUIDE_SLUG,
  CASINOS_CRYPTO_VPN_GUIDE_SLUG,
  casinosCryptoGuideCovers,
} from "@/data/casinos-crypto-guides";
import { CASINOS_CRYPTO_CLUSTER_SLUGS } from "@/data/casinos-crypto-guides-cluster";
import { getGuideCopy } from "@/data/articles";
import { resolveAllGuides } from "@/lib/guides/refresh";
import { getEditorialImages } from "@/data/images";
import { usesEnglishFallback } from "@/i18n/locales";
import type { NewsArticle } from "@/lib/news/types";
import type { SiteConfig } from "@/sites/types";

function buildCasinoHeroSlides(
  t: Awaited<ReturnType<typeof getTranslations>>,
  locale: string,
  site: SiteConfig,
  latestNews: NewsArticle[],
): HeroSlide[] {
  const editorial = getEditorialImages(site.id);
  const stakeCover = casinosCryptoGuideCovers[CASINOS_CRYPTO_STAKE_GUIDE_SLUG];
  const cryptoGeneralCover =
    casinosCryptoGuideCovers[CASINOS_CRYPTO_CRYPTO_GUIDE_SLUG];
  const cryptoCover =
    casinosCryptoGuideCovers[CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG];
  const vpnCover = casinosCryptoGuideCovers[CASINOS_CRYPTO_VPN_GUIDE_SLUG];
  const latest = latestNews[0];
  const newsCopy = latest
    ? usesEnglishFallback(locale)
      ? latest.en
      : latest.fr
    : null;

  return [
    {
      id: latest ? `news-${latest.slug}` : "news-fallback",
      kind: t("heroNewsKind"),
      title: newsCopy?.title || t("heroNewsTitle"),
      excerpt: newsCopy?.excerpt || t("heroNewsExcerpt"),
      href: latest ? `/actualites/${latest.slug}` : "/actualites",
      cta: t("heroNewsCta"),
      imageSrc: latest?.imageSrc || editorial.news.src || site.heroImage,
      imageAlt: usesEnglishFallback(locale)
        ? editorial.news.altEn
        : editorial.news.altFr,
    },
    {
      id: "stake-guide",
      kind: "Stake",
      title: t("heroStakeTitle"),
      excerpt: t("heroStakeExcerpt"),
      href: `/guides/${CASINOS_CRYPTO_STAKE_GUIDE_SLUG}`,
      cta: t("heroStakeCta"),
      imageSrc: stakeCover.src,
      imageAlt: t("heroStakeAlt"),
    },
    {
      id: "crypto-guide",
      kind: "Crypto",
      title: t("heroCryptoTitle"),
      excerpt: t("heroCryptoExcerpt"),
      href: `/guides/${CASINOS_CRYPTO_CRYPTO_GUIDE_SLUG}`,
      cta: t("heroCryptoCta"),
      imageSrc: cryptoGeneralCover.src,
      imageAlt: t("heroCryptoAlt"),
    },
    {
      id: "vpn-guide",
      kind: "VPN",
      title: t("heroVpnTitle"),
      excerpt: t("heroVpnExcerpt"),
      href: `/guides/${CASINOS_CRYPTO_VPN_GUIDE_SLUG}`,
      cta: t("heroVpnCta"),
      imageSrc: vpnCover.src,
      imageAlt: t("heroVpnAlt"),
    },
    {
      id: "wallet-guide",
      kind: "Wallet",
      title: t("heroWalletTitle"),
      excerpt: t("heroWalletExcerpt"),
      href: `/guides/${CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG}`,
      cta: t("heroWalletCta"),
      imageSrc: cryptoCover.src,
      imageAlt: t("heroWalletAlt"),
    },
  ];
}

export async function CasinosCryptoHome({
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
  const t = await getTranslations({ locale, namespace: "home" });
  const brand = site.brand.name;
  const editorial = getEditorialImages(site.id);
  const stakeCover = casinosCryptoGuideCovers[CASINOS_CRYPTO_STAKE_GUIDE_SLUG];
  const cryptoGeneralCover =
    casinosCryptoGuideCovers[CASINOS_CRYPTO_CRYPTO_GUIDE_SLUG];
  const cryptoCover =
    casinosCryptoGuideCovers[CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG];
  const vpnCover = casinosCryptoGuideCovers[CASINOS_CRYPTO_VPN_GUIDE_SLUG];
  const heroSlides = buildCasinoHeroSlides(t, locale, site, latestNews);
  const keywordOffers = resolveAffiliateOffers(site);
  const L = ({ text }: { text: string }) => (
    <AffiliateLinkedText text={text} offers={keywordOffers} />
  );
  const tOffers = await getTranslations("offers");
  const offerLabel = (offer: AffiliateOffer) =>
    tOffers.has(offer.id)
      ? tOffers(offer.id)
      : usesEnglishFallback(locale)
        ? offer.labelEn
        : offer.labelFr;

  const bySlug = new Map(
    (await resolveAllGuides(site.id)).map((guide) => [guide.slug, guide]),
  );
  const clusterGuides = CASINOS_CRYPTO_CLUSTER_SLUGS.flatMap((slug) => {
    const guide = bySlug.get(slug);
    return guide ? [guide] : [];
  });

  const howSteps = [
    t("howStart1"),
    t("howStart2"),
    t("howStart3"),
    t("howStart4"),
  ];

  return (
    <>
      <HeroSlider
        brandName={brand}
        slides={heroSlides}
        compact
        affiliateKeywordOffers={keywordOffers}
        footerNote={t("heroFooterNote")}
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
              <L text={t("sectionStakeTitle")} />
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              <L text={t("sectionStakeBody")} />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_STAKE_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {t("sectionStakeCta")}
              </Link>
              {stake ? (
                <AffiliateOfferButton
                  href={stake.href}
                  label={offerLabel(stake)}
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
              <L text={t("sectionCryptoTitle")} />
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              <L text={t("sectionCryptoBody")} />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_CRYPTO_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {t("sectionCryptoCta")}
              </Link>
              {cryptocom ? (
                <AffiliateOfferButton
                  href={cryptocom.href}
                  label={offerLabel(cryptocom)}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>
          <SmartCover
            src={cryptoGeneralCover.src}
            fallback={editorial.camping}
            locale={locale}
            credit={cryptoGeneralCover.credit}
            className="order-1 aspect-[4/3] w-full md:order-2 md:aspect-auto md:min-h-[420px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-2">
          <SmartCover
            src={cryptoCover.src}
            fallback={editorial.camping}
            locale={locale}
            credit={cryptoCover.credit}
            className="aspect-[4/3] w-full md:aspect-auto md:min-h-[420px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="flex flex-col justify-center px-5 py-14 md:px-10 md:py-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
              <L text={t("sectionWalletTitle")} />
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              <L text={t("sectionWalletBody")} />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {t("sectionWalletCta")}
              </Link>
              {cryptocom ? (
                <AffiliateOfferButton
                  href={cryptocom.href}
                  label={offerLabel(cryptocom)}
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
              <L text={t("sectionVpnTitle")} />
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              <L text={t("sectionVpnBody")} />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_VPN_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {t("sectionVpnCta")}
              </Link>
              {nordvpn ? (
                <AffiliateOfferButton
                  href={nordvpn.href}
                  label={offerLabel(nordvpn)}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>
          <SmartCover
            src={vpnCover.src}
            fallback={editorial.backup}
            locale={locale}
            credit={vpnCover.credit}
            className="order-1 aspect-[4/3] w-full md:order-2 md:aspect-auto md:min-h-[420px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
            {t("howStartTitle")}
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-2">
            {howSteps.map((step, i) => (
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

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
            {t("faqTitle")}
          </h2>
          <dl className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { q: t("faqLegalQ"), a: t("faqLegalA") },
              { q: t("faqVpnQ"), a: t("faqVpnA") },
              { q: t("faqDepositQ"), a: t("faqDepositA") },
              { q: t("faqSiteQ"), a: t("faqSiteA") },
            ].map((item) => (
              <div key={item.q} className="border-t border-[var(--line)] pt-4">
                <dt className="font-semibold text-[var(--heading)]">{item.q}</dt>
                <dd className="mt-2 text-sm text-[var(--muted)]">
                  <L text={item.a} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {clusterGuides.length ? (
        <section className="border-b border-[var(--line)]">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
                  {t("moreGuidesTitle")}
                </h2>
                <p className="mt-3 max-w-2xl text-[var(--muted)]">
                  {t("moreGuidesBody")}
                </p>
              </div>
              <Link
                href="/guides"
                className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {t("moreGuidesCta")}
              </Link>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clusterGuides.map((guide) => {
                const copy = getGuideCopy(guide, locale);
                return (
                  <li key={guide.slug}>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="block h-full border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)]"
                    >
                      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
                        {copy.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                        {copy.subtitle}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {latestNews.length ? (
        <section className="border-b border-[var(--line)]">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
                {t("latestNewsTitle")}
              </h2>
              <Link
                href="/actualites"
                className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {t("allNewsCta")}
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {latestNews.slice(0, 3).map((article) => {
                const copy = usesEnglishFallback(locale)
                  ? article.en
                  : article.fr;
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
