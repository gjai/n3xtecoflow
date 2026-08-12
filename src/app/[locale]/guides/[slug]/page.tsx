import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleCover } from "@/components/ArticleCover";
import { getGuide, guides } from "@/data/articles";
import { editorialImages } from "@/data/images";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import {
  resolveArticlePrimaryImage,
  resolveArticleProductImages,
} from "@/lib/article-images";
import { localeAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return guides.flatMap((g) =>
    ["fr", "en"].map((locale) => ({ locale, slug: g.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const copy = locale === "en" ? guide.en : guide.fr;
  const ecoflowMap = await getEcoflowEntriesMap();
  const og = resolveArticlePrimaryImage(slug, "guide", ecoflowMap);
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
  const guide = getGuide(slug);
  if (!guide) notFound();
  const copy = locale === "en" ? guide.en : guide.fr;
  const isEn = locale === "en";
  const ecoflowMap = await getEcoflowEntriesMap();
  const images = resolveArticleProductImages(slug, ecoflowMap);

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
            images={images}
            fallback={editorialImages.guides}
            locale={locale}
            className="aspect-[4/3] w-full border border-[var(--line)]"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
        </div>
      </header>
      <ArticleBody
        sections={copy.sections}
        amazonQuery="EcoFlow station électrique"
        amazonLabel={isEn ? "Browse on Amazon" : "Voir sur Amazon"}
      />
    </article>
  );
}
