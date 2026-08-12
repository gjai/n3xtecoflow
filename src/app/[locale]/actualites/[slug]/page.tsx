import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { articleJsonLd, JsonLd } from "@/components/JsonLd";
import { getNewsBySlug, readNewsStore } from "@/lib/news/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const store = await readNewsStore();
  const article = getNewsBySlug(slug, store);
  if (!article) return {};
  const copy = locale === "en" ? article.en : article.fr;
  return { title: copy.title, description: copy.excerpt };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const store = await readNewsStore();
  const article = getNewsBySlug(slug, store);
  if (!article) notFound();

  const isEn = locale === "en";
  const copy = isEn ? article.en : article.fr;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ecoflow-stream.com";
  const date = new Date(article.publishedAt).toLocaleDateString(
    isEn ? "en-US" : "fr-FR",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          title: copy.title,
          description: copy.excerpt,
          url: `${siteUrl}/${locale}/actualites/${article.slug}`,
          locale,
        })}
      />
      <header className="hero-grid border-b border-[var(--line)] pt-24">
        <div className="mx-auto max-w-3xl px-5 py-14 md:px-8">
          <Link
            href="/actualites"
            className="text-sm text-[var(--muted)] hover:text-[var(--heading)]"
          >
            ← {t("back")}
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)] md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)]">{copy.excerpt}</p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            <time dateTime={article.publishedAt}>{date}</time>
            {" · "}
            {t("source")}{" "}
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {article.sourceName}
            </a>
            {article.rewrittenBy === "ai" ? ` · ${t("aiBadge")}` : null}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-5 px-5 py-12 text-[var(--fog)] leading-relaxed md:px-8">
        {copy.body.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
        <p className="border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)]">
          {t("disclaimer")}
        </p>
        <p>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {t("readSource")}
          </a>
        </p>
        <p>
          <Link
            href="/produits"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            {t("catalogCta")}
          </Link>
        </p>
      </div>
    </article>
  );
}
