import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AdSenseUnit } from "@/components/AdSenseUnit";
import { AmazonButton } from "@/components/AmazonButton";
import { CoverImage } from "@/components/CoverImage";
import { SmartCover } from "@/components/SmartCover";
import { HeroSlider, type HeroSlide } from "@/components/HeroSlider";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/components/JsonLd";
import { AMAZON_QUERIES, buildAmazonSearchUrl } from "@/lib/amazon";
import {
  categoryImages,
  editorialImages,
  heroImage,
} from "@/data/images";
import {
  getCategoriesForSite,
  getLocalizedCategory,
  getLocalizedProduct,
  getProductsForSite,
  type CategoryId,
} from "@/data/products";
import { getNewsArticles, readNewsStore } from "@/lib/news/store";
import { getEcoflowEntriesMap, getEcoflowEntry } from "@/lib/ecoflow/catalog-store";
import { getEcoflowEditorial } from "@/lib/ecoflow/editorial-store";
import { resolveArticlePrimaryImage } from "@/lib/article-images";
import {
  comparisonHubCategories,
  hubTitle,
} from "@/lib/comparisons/hub";
import { resolveAllGuides } from "@/lib/guides/refresh";
import { resolveProductCopy } from "@/lib/product-copy";
import { resolveProductMedia } from "@/lib/product-presentation";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
/** Fresh news without blocking CDN cache on every request. */
export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getCurrentSite();
  const isEn = locale === "en";
  return {
    title: { absolute: site.brand.name },
    description: isEn ? site.brand.taglineEn : site.brand.taglineFr,
    alternates: await siteLocaleAlternates(locale, ""),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const newsT = await getTranslations("news");
  const a = await getTranslations("amazon");
  const site = await getCurrentSite();
  const isEn = locale === "en";
  const siteUrl = `https://${site.primaryHost}`;
  const brandName = site.brand.name;

  if (site.id === "tumbler") {
    const cats = getCategoriesForSite("tumbler");
    const list = getProductsForSite("tumbler");
    return (
      <>
        <JsonLd data={organizationJsonLd(siteUrl)} />
        <JsonLd data={websiteJsonLd(siteUrl)} />
        <section className="hero-grid border-b border-[var(--line)]">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--solar)]">
              {brandName}
            </p>
            <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)] md:text-6xl">
              {isEn ? site.brand.headlineEn : site.brand.headlineFr}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">
              {isEn ? site.brand.subheadEn : site.brand.subheadFr}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/produits"
                className="bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)]"
              >
                {isEn ? "Browse catalog" : "Voir le catalogue"}
              </Link>
              <AmazonButton
                href={buildAmazonSearchUrl("gourde isotherme")}
                label={a("cta")}
              />
            </div>
            <div className="mt-8">
              <AffiliateDisclosure compact />
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)] md:text-3xl">
            {isEn ? "Categories" : "Catégories"}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {cats.map((cat) => {
              const copy = getLocalizedCategory(cat, locale);
              return (
                <Link
                  key={cat.id}
                  href={`/produits/${cat.slug}`}
                  className="overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
                >
                  <CoverImage
                    image={categoryImages[cat.id]}
                    locale={locale}
                    className="aspect-[16/9] w-full"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[var(--heading)]">
                      {copy.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{copy.intro}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="border-y border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)] md:text-3xl">
              {isEn ? "Top Amazon picks" : "Sélection best-sellers Amazon"}
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              {isEn
                ? "Editorial shortlist of bestsellers — prefer listings Ships and sold by Amazon."
                : "Sélection éditoriale des best-sellers — préférez Expédié et vendu par Amazon."}
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {list.map((p) => {
                const copy = getLocalizedProduct(p, locale);
                return (
                  <Link
                    key={p.slug}
                    href={`/produits/${p.category}/${p.slug}`}
                    className="border border-[var(--line)] bg-[var(--bg)] p-5 transition hover:border-[var(--accent)]"
                  >
                    <h3 className="font-semibold text-[var(--heading)]">{p.name}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{copy.tagline}</p>
                    <p className="mt-3 text-xs text-[var(--accent)]">
                      {isEn ? "View sheet →" : "Voir la fiche →"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </>
    );
  }

  const newsArticles = getNewsArticles(await readNewsStore());
  const latestNews = newsArticles.slice(0, 3);
  const latestNewsItem = newsArticles[0];
  const allGuides = await resolveAllGuides();
  const latestGuide = allGuides.at(-1)!;
  const comparisonHubs = comparisonHubCategories();
  const latestComparisonHub = comparisonHubs[0]!;
  const siteProducts = getProductsForSite("ecoflow");
  const featuredProducts = siteProducts.filter((p) =>
    site.featuredCategoryIds.includes(p.category),
  );
  const latestProduct =
    featuredProducts.at(-1) ?? siteProducts.at(-1)!;
  const siteCats = getCategoriesForSite("ecoflow");
  const featured = site.featuredCategoryIds
    .map((id) => siteCats.find((c) => c.id === (id as CategoryId)))
    .filter(Boolean) as typeof siteCats;
  const orderedCategories = [
    ...featured,
    ...siteCats.filter((c) => !site.featuredCategoryIds.includes(c.id)),
  ];

  const productImage = resolveProductMedia(
    latestProduct,
    await getEcoflowEntry(latestProduct.slug),
  ).src;
  const productCopy = resolveProductCopy(
    latestProduct,
    locale,
    await getEcoflowEditorial(latestProduct.slug),
  );
  const newsCopy = latestNewsItem
    ? isEn
      ? latestNewsItem.en
      : latestNewsItem.fr
    : null;
  const guideCopy = isEn ? latestGuide.en : latestGuide.fr;
  const comparisonTitle = hubTitle(latestComparisonHub.id, locale);
  const comparisonIntro = getLocalizedCategory(
    latestComparisonHub,
    locale,
  ).intro;

  const ecoflowMap = await getEcoflowEntriesMap();
  const guideCover = latestGuide.imageSrc
    ? {
        src: latestGuide.imageSrc,
        altFr: guideCopy.title,
        altEn: guideCopy.title,
      }
    : resolveArticlePrimaryImage(latestGuide.slug, "guide", ecoflowMap);
  const comparisonCover = resolveArticlePrimaryImage(
    latestComparisonHub.slug,
    "comparison",
    ecoflowMap,
  );

  const heroSlides: HeroSlide[] = [
    {
      id: latestNewsItem ? `news-${latestNewsItem.slug}` : "news-fallback",
      kind: t("slideNews"),
      title: newsCopy?.title || t("slideNewsFallback"),
      excerpt:
        newsCopy?.excerpt ||
        t("slideNewsExcerpt"),
      href: latestNewsItem
        ? `/actualites/${latestNewsItem.slug}`
        : "/actualites",
      cta: t("slideNewsCta"),
      imageSrc:
        latestNewsItem?.imageSrc ||
        editorialImages.news.src ||
        site.heroImage ||
        heroImage.src,
      imageAlt: isEn
        ? editorialImages.news.altEn
        : editorialImages.news.altFr,
    },
    {
      id: `guide-${latestGuide.slug}`,
      kind: t("slideGuide"),
      title: guideCopy.title,
      excerpt: guideCopy.subtitle,
      href: `/guides/${latestGuide.slug}`,
      cta: t("slideGuideCta"),
      imageSrc: guideCover.src,
      imageAlt: isEn ? guideCover.altEn : guideCover.altFr,
    },
    {
      id: `comparison-${latestComparisonHub.slug}`,
      kind: t("slideComparison"),
      title: comparisonTitle,
      excerpt: comparisonIntro,
      href: `/comparatifs/${latestComparisonHub.slug}`,
      cta: t("slideComparisonCta"),
      imageSrc: comparisonCover.src,
      imageAlt: isEn ? comparisonCover.altEn : comparisonCover.altFr,
    },
    {
      id: `product-${latestProduct.slug}`,
      kind: t("slideProduct"),
      title: latestProduct.name,
      excerpt: productCopy.summary,
      href: `/produits/${latestProduct.category}/${latestProduct.slug}`,
      cta: t("slideProductCta"),
      imageSrc: productImage,
      imageAlt: latestProduct.name,
    },
  ];

  return (
    <>
      <JsonLd data={organizationJsonLd(siteUrl)} />
      <JsonLd data={websiteJsonLd(siteUrl)} />

      <HeroSlider brandName={brandName} slides={heroSlides} />

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <AdSenseUnit
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME}
          label={t("adsLabel")}
        />
      </div>

      {latestNews.length > 0 ? (
        <section className="border-y border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                  {newsT("eyebrow")}
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)] md:text-3xl">
                  {newsT("title")}
                </h2>
              </div>
              <Link
                href="/actualites"
                className="text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                {newsT("back")} →
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {latestNews.map((article) => {
                const copy = isEn ? article.en : article.fr;
                return (
                  <Link
                    key={article.slug}
                    href={`/actualites/${article.slug}`}
                    className="overflow-hidden border border-[var(--line)] bg-[var(--bg)] transition hover:border-[var(--accent)]"
                  >
                    <SmartCover
                      src={article.imageSrc}
                      fallback={editorialImages.news}
                      locale={locale}
                      credit={article.imageCredit}
                      className="aspect-[16/9] w-full"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="p-4">
                      <p className="text-xs text-[var(--muted)]">
                        {article.sourceName}
                      </p>
                      <h3 className="mt-2 font-semibold text-[var(--heading)]">
                        {copy.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">
                        {copy.excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 pb-14 md:px-8 md:pb-20">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)] md:text-3xl">
          {isEn ? "Shop by category" : "Parcourir par catégorie"}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderedCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produits/${cat.slug}`}
              className="group overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
            >
              <CoverImage
                image={categoryImages[cat.id]}
                locale={locale}
                className="aspect-[16/9] w-full"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="p-5">
                <div className="mb-4 h-1 w-10 bg-[var(--accent)] transition group-hover:w-16" />
                <h3 className="text-lg font-semibold text-[var(--heading)]">
                  {isEn ? cat.en.title : cat.fr.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {isEn ? cat.en.intro : cat.fr.intro}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-[var(--muted)]">
          {siteProducts.length} {isEn ? "product sheets" : "fiches produits"} ·{" "}
          {allGuides.length} {isEn ? "guides" : "guides"} ·{" "}
          {comparisonHubs.length}{" "}
          <Link
            href="/comparatifs"
            className="text-[var(--accent)] hover:underline"
          >
            {isEn ? "comparisons" : "comparatifs"}
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)] md:text-3xl">
          {t("featuresTitle")}
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("editorialLead")}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { title: t("feature1Title"), text: t("feature1Text") },
            { title: t("feature2Title"), text: t("feature2Text") },
            { title: t("feature3Title"), text: t("feature3Text") },
          ].map((f) => (
            <div
              key={f.title}
              className="border border-[var(--line)] bg-[var(--surface)] p-5"
            >
              <h3 className="font-semibold text-[var(--heading)]">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {f.text}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">
          {t("aboutTeaser")}{" "}
          <Link
            href="/a-propos"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {t("aboutLink")}
          </Link>
          .
        </p>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)] md:text-3xl">
            {t("howTitle")}
          </h2>
          <div className="mt-6 space-y-4 text-[var(--fog)] leading-relaxed md:columns-2 md:gap-10">
            <p>{t("howBody1")}</p>
            <p>{t("howBody2")}</p>
            <p>{t("howBody3")}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[1.2fr_0.8fr] md:items-end md:px-8 md:py-18">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--solar)]">
              {t("spotlightTitle")}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
              {t("spotlightName")}
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              {t("spotlightText")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/produits/stream"
                className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {t("spotlightCta")}
              </Link>
              <AmazonButton
                href={buildAmazonSearchUrl(AMAZON_QUERIES.stream)}
                label={a("cta")}
              />
            </div>
          </div>
          <AffiliateDisclosure />
        </div>
      </section>
    </>
  );
}
