import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSenseUnit } from "@/components/AdSenseUnit";
import { ArticleBody, type ArticleProductCard } from "@/components/ArticleBody";
import { ArticleCover } from "@/components/ArticleCover";
import {
  LEGACY_TUMBLER_GUIDE_SLUGS,
  TUMBLER_MAIN_GUIDE_SLUG,
} from "@/data/tumbler-guides";
import { getGuideCopy } from "@/data/articles";
import { products, getLocalizedProduct } from "@/data/products";
import { getEditorialImages } from "@/data/images";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import {
  resolveArticlePrimaryImage,
  resolveArticleProductImages,
} from "@/lib/article-images";
import { GUIDE_TOPICS } from "@/lib/guides/types";
import { resolveGuide } from "@/lib/guides/refresh";
import { resolveProductMedia } from "@/lib/product-presentation";
import { siteLocaleAlternates } from "@/lib/seo";
import { AffiliateLinkedText } from "@/components/AffiliateLinkedText";
import { CasinosCryptoGuideAffiliates } from "@/components/CasinosCryptoGuideAffiliates";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { APP_LOCALES } from "@/i18n/locales";
import { resolveAffiliateOffers } from "@/lib/affiliates";
import { siteAmazonFallbackQuery } from "@/sites/copy";
import { siteAllowsAmazon, siteIsEuroMillions, siteShowsProducts } from "@/sites/features";
import { getCurrentSite } from "@/sites/server";
import { EuroMillionsGuideFaq } from "@/components/EuroMillionsGuideFaq";
import { redirect } from "@/i18n/navigation";

export const revalidate = 600;

export function generateStaticParams() {
  const tumblerLegacy = LEGACY_TUMBLER_GUIDE_SLUGS.map((slug) => ({ slug }));
  const topics = GUIDE_TOPICS.map((g) => ({ slug: g.slug }));
  const slugs = [...new Set([...topics, ...tumblerLegacy].map((x) => x.slug))];
  return slugs.flatMap((slug) =>
    APP_LOCALES.map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const site = await getCurrentSite();
  if (
    site.id === "tumbler" &&
    (LEGACY_TUMBLER_GUIDE_SLUGS as readonly string[]).includes(slug)
  ) {
    return {
      alternates: await siteLocaleAlternates(
        locale,
        `/guides/${TUMBLER_MAIN_GUIDE_SLUG}`,
      ),
    };
  }
  const guide = await resolveGuide(slug, site.id);
  if (!guide) return {};
  const copy = getGuideCopy(guide, locale);
  const ecoflowMap =
    site.id === "ecoflow" ? await getEcoflowEntriesMap() : {};
  const og = guide.imageSrc
    ? { src: guide.imageSrc }
    : resolveArticlePrimaryImage(slug, "guide", ecoflowMap, site.id);
  return {
    title: copy.title,
    description: copy.subtitle,
    alternates: await siteLocaleAlternates(locale, `/guides/${slug}`),
    openGraph: { images: [{ url: og.src }] },
  };
}

function buildProductCards(
  sections: { productSlugs?: string[] }[],
  locale: string,
): Record<string, ArticleProductCard> {
  const slugs = new Set<string>();
  for (const s of sections) {
    for (const slug of s.productSlugs || []) slugs.add(slug);
  }
  const out: Record<string, ArticleProductCard> = {};
  for (const slug of slugs) {
    const product = products.find((p) => p.slug === slug);
    if (!product) continue;
    const media = resolveProductMedia(product, null);
    const copy = getLocalizedProduct(product, locale);
    out[slug] = {
      slug,
      name: product.name,
      href: `/produits/${product.category}/${product.slug}`,
      imageSrc: media.src,
      tagline: copy.tagline,
    };
  }
  return out;
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();

  if (
    site.id === "tumbler" &&
    (LEGACY_TUMBLER_GUIDE_SLUGS as readonly string[]).includes(slug)
  ) {
    redirect({ href: `/guides/${TUMBLER_MAIN_GUIDE_SLUG}`, locale });
  }

  const guide = await resolveGuide(slug, site.id);
  if (!guide) {
    const foreign = GUIDE_TOPICS.find((t) => t.slug === slug);
    if (foreign) {
      redirect({ href: "/guides", locale });
    }
    notFound();
  }
  const copy = getGuideCopy(guide, locale);
  const adsT = await getTranslations("home");
  const isEn = locale !== "fr";
  const ecoflowMap =
    site.id === "ecoflow" ? await getEcoflowEntriesMap() : {};
  const productImages =
    site.id === "ecoflow"
      ? resolveArticleProductImages(slug, ecoflowMap)
      : [];
  const coverImages = guide.imageSrc
    ? [
        {
          src: guide.imageSrc,
          altFr: copy.title,
          altEn: copy.title,
          credit: guide.imageCredit || site.brand.name,
          creditUrl: "#",
        },
      ]
    : productImages;
  const editorialImages = getEditorialImages(site.id);
  const productCards = buildProductCards(copy.sections, locale);
  const keywordOffers =
    site.id === "casinos-crypto" ? resolveAffiliateOffers(site) : undefined;

  return (
    <article>
      <header className="hero-grid border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
              {keywordOffers ? (
                <AffiliateLinkedText text={copy.title} offers={keywordOffers} />
              ) : (
                copy.title
              )}
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              {keywordOffers ? (
                <AffiliateLinkedText
                  text={copy.subtitle}
                  offers={keywordOffers}
                />
              ) : (
                copy.subtitle
              )}
            </p>
            {siteIsEuroMillions(site) ? (
              <div className="mt-6">
                <GameToolsNav gameId="euromillions" />
              </div>
            ) : null}
          </div>
          <ArticleCover
            images={coverImages}
            fallback={editorialImages.guides}
            locale={locale}
            className="aspect-[4/3] w-full border border-[var(--line)]"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
            packshot={!guide.imageSrc}
          />
        </div>
      </header>
      {!siteAllowsAmazon(site) ? (
        <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8">
          <CasinosCryptoGuideAffiliates
            site={site}
            slug={slug}
            locale={locale}
          />
        </div>
      ) : null}
      {siteIsEuroMillions(site) ? (
        <div className="mx-auto max-w-3xl px-5 pt-8 md:px-8">
          <AdSenseUnit label={adsT("adsLabel")} />
        </div>
      ) : null}
      <ArticleBody
        sections={copy.sections}
        amazonQuery={
          siteAllowsAmazon(site)
            ? siteAmazonFallbackQuery(site.id)
            : undefined
        }
        amazonLabel={
          siteAllowsAmazon(site)
            ? isEn
              ? "Browse on Amazon"
              : "Voir sur Amazon"
            : undefined
        }
        productCards={productCards}
        hideCatalogLink={!siteShowsProducts(site)}
        affiliateKeywordOffers={keywordOffers}
        footerActions={
          !siteAllowsAmazon(site) ? (
            <CasinosCryptoGuideAffiliates
              site={site}
              slug={slug}
              locale={locale}
            />
          ) : undefined
        }
      />
      {siteIsEuroMillions(site) ? (
        <EuroMillionsGuideFaq slug={slug} locale={locale} />
      ) : null}
    </article>
  );
}
