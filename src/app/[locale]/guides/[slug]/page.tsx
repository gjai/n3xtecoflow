import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody, type ArticleProductCard } from "@/components/ArticleBody";
import { ArticleCover } from "@/components/ArticleCover";
import {
  LEGACY_TUMBLER_GUIDE_SLUGS,
  TUMBLER_MAIN_GUIDE_SLUG,
} from "@/data/tumbler-guides";
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
import { siteAmazonFallbackQuery } from "@/sites/copy";
import { getCurrentSite } from "@/sites/server";
import { redirect } from "@/i18n/navigation";

export const revalidate = 600;

export function generateStaticParams() {
  const tumblerLegacy = LEGACY_TUMBLER_GUIDE_SLUGS.map((slug) => ({ slug }));
  const topics = GUIDE_TOPICS.map((g) => ({ slug: g.slug }));
  const slugs = [...new Set([...topics, ...tumblerLegacy].map((x) => x.slug))];
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
  const copy = locale === "en" ? guide.en : guide.fr;
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
  if (!guide) notFound();
  const copy = locale === "en" ? guide.en : guide.fr;
  const isEn = locale === "en";
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

  return (
    <article>
      <header className="hero-grid border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">{copy.subtitle}</p>
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
      <ArticleBody
        sections={copy.sections}
        amazonQuery={siteAmazonFallbackQuery(site.id)}
        amazonLabel={isEn ? "Browse on Amazon" : "Voir sur Amazon"}
        productCards={productCards}
      />
    </article>
  );
}
