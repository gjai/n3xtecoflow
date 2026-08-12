import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { ComparisonPicker } from "@/components/ComparisonPicker";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleCover } from "@/components/ArticleCover";
import { comparisons, getComparison } from "@/data/articles";
import { getEditorialImages } from "@/data/images";
import {
  getCategory,
  getLocalizedCategory,
} from "@/data/products";
import { getAmazonOffersMap } from "@/lib/amazon/price-store";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import {
  resolveArticlePrimaryImage,
  resolveArticleProductImages,
} from "@/lib/article-images";
import {
  comparisonHubBelongsToSite,
  comparisonHubCategories,
  hubTitle,
  LEGACY_COMPARISON_REDIRECTS,
  productsForHub,
  toCompareProductView,
} from "@/lib/comparisons/hub";
import { resolveDisplayPrice, resolveProductMedia } from "@/lib/product-presentation";
import { localeAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";

export function generateStaticParams() {
  const hubs = comparisonHubCategories().map((c) => c.slug);
  const legacy = comparisons.map((c) => c.slug);
  const slugs = [...new Set([...hubs, ...legacy])];
  return slugs.flatMap((slug) =>
    ["fr", "en"].map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const cat = getCategory(slug);
  if (cat) {
    const title = hubTitle(cat.id, locale);
    const copy = getLocalizedCategory(cat, locale);
    return {
      title,
      description: copy.intro,
      alternates: localeAlternates(locale, `/comparatifs/${slug}`),
    };
  }
  const item = getComparison(slug);
  if (!item) return {};
  const copy = locale === "en" ? item.en : item.fr;
  const ecoflowMap = await getEcoflowEntriesMap();
  const og = resolveArticlePrimaryImage(slug, "comparison", ecoflowMap, "ecoflow");
  return {
    title: copy.title,
    description: copy.subtitle,
    alternates: localeAlternates(locale, `/comparatifs/${slug}`),
    openGraph: { images: [{ url: og.src }] },
  };
}

export default async function ComparisonSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { locale, slug } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const site = await getCurrentSite();

  // Legacy article slug → redirect to category hub with pair (ecoflow only)
  const legacy = LEGACY_COMPARISON_REDIRECTS[slug];
  if (legacy && !getCategory(slug)) {
    if (site.id !== "ecoflow") notFound();
    redirect({
      href: `/comparatifs/${legacy.category}?a=${legacy.left}&b=${legacy.right}`,
      locale,
    });
  }

  const cat = getCategory(slug);
  if (cat) {
    if (!comparisonHubBelongsToSite(cat.id, site.id)) notFound();
    const list = productsForHub(cat.id);
    if (list.length < 2) notFound();
    const ecoflowMap = await getEcoflowEntriesMap();
    const amazonMap = await getAmazonOffersMap();
    const options = list.map((p) => ({ slug: p.slug, name: p.name }));
    const productMap: Record<string, ReturnType<typeof toCompareProductView>> =
      {};
    for (const p of list) {
      const eco = ecoflowMap[p.slug];
      const amazon = amazonMap[p.slug];
      const display = resolveDisplayPrice(amazon, eco);
      // Build view with resolved price
      const view = toCompareProductView(p, locale, eco);
      if (display?.display) {
        view.priceDisplay = display.display;
        view.priceSource = display.source;
      }
      // Prefer media from ecoflow
      view.imageSrc = resolveProductMedia(p, eco).src;
      productMap[p.slug] = view;
    }

    const defaultLeft = list[0].slug;
    const defaultRight = list[1]?.slug || list[0].slug;
    const left =
      sp.a && productMap[sp.a] ? sp.a : defaultLeft;
    let right =
      sp.b && productMap[sp.b] && sp.b !== left ? sp.b : defaultRight;
    if (right === left) {
      right = list.find((p) => p.slug !== left)?.slug || defaultRight;
    }

    const copy = getLocalizedCategory(cat, locale);

    return (
      <div className="pt-6">
        <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <p className="text-sm text-[var(--muted)]">
            <Link href="/comparatifs" className="hover:text-[var(--heading)]">
              {isEn ? "Comparisons" : "Comparatifs"}
            </Link>
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
            {hubTitle(cat.id, locale)}
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">{copy.intro}</p>
        </header>
        <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <ComparisonPicker
            locale={locale}
            options={options}
            initialLeft={left}
            initialRight={right}
            products={productMap}
          />
        </div>
      </div>
    );
  }

  // Fallback: old static comparison articles (ecoflow only)
  if (site.id !== "ecoflow") notFound();
  const item = getComparison(slug);
  if (!item) notFound();
  const articleCopy = locale === "en" ? item.en : item.fr;
  const ecoflowMap = await getEcoflowEntriesMap();
  const images = resolveArticleProductImages(slug, ecoflowMap);
  const editorialImages = getEditorialImages("ecoflow");

  return (
    <article>
      <header className="hero-grid border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
              {articleCopy.title}
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              {articleCopy.subtitle}
            </p>
          </div>
          <ArticleCover
            images={images}
            fallback={editorialImages.comparatifs}
            locale={locale}
            className="aspect-[4/3] w-full border border-[var(--line)]"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
        </div>
      </header>
      <ArticleBody
        sections={articleCopy.sections}
        amazonQuery="EcoFlow"
        amazonLabel={isEn ? "Compare on Amazon" : "Comparer sur Amazon"}
      />
    </article>
  );
}
