import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleCover } from "@/components/ArticleCover";
import { editorialImages } from "@/data/images";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import {
  resolveArticlePrimaryImage,
  resolveArticleProductImages,
} from "@/lib/article-images";
import { GUIDE_TOPICS } from "@/lib/guides/types";
import { resolveGuide } from "@/lib/guides/refresh";
import { localeAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";

export const revalidate = 600;

export function generateStaticParams() {
  return GUIDE_TOPICS.flatMap((g) =>
    ["fr", "en"].map((locale) => ({ locale, slug: g.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const site = await getCurrentSite();
  const guide = await resolveGuide(slug, site.id);
  if (!guide) return {};
  const copy = locale === "en" ? guide.en : guide.fr;
  const ecoflowMap =
    site.id === "ecoflow" ? await getEcoflowEntriesMap() : {};
  const og = guide.imageSrc
    ? { src: guide.imageSrc }
    : resolveArticlePrimaryImage(slug, "guide", ecoflowMap);
  return {
    title: copy.title,
    description: copy.subtitle,
    alternates: localeAlternates(locale, `/guides/${slug}`),
    openGraph: { images: [{ url: og.src }] },
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
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
        amazonQuery={
          site.id === "tumbler" ? "gourde isotherme" : "EcoFlow station électrique"
        }
        amazonLabel={isEn ? "Browse on Amazon" : "Voir sur Amazon"}
      />
    </article>
  );
}
