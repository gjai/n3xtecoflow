import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { comparisons, getComparison } from "@/data/articles";

export function generateStaticParams() {
  return comparisons.flatMap((c) =>
    ["fr", "en"].map((locale) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getComparison(slug);
  if (!item) return {};
  const copy = locale === "en" ? item.en : item.fr;
  return { title: copy.title, description: copy.subtitle };
}

export default async function ComparisonArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = getComparison(slug);
  if (!item) notFound();
  const copy = locale === "en" ? item.en : item.fr;
  const isEn = locale === "en";

  return (
    <article>
      <header className="hero-grid border-b border-[var(--line)] pt-24">
        <div className="mx-auto max-w-3xl px-5 py-14 md:px-8">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)]">{copy.subtitle}</p>
        </div>
      </header>
      <ArticleBody
        sections={copy.sections}
        amazonQuery="EcoFlow"
        amazonLabel={isEn ? "Compare on Amazon" : "Comparer sur Amazon"}
        amazonBadge={isEn ? "Amazon affiliate link" : "Lien affilié Amazon"}
      />
    </article>
  );
}
