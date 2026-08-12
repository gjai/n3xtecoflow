import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/CoverImage";
import { editorialImages } from "@/data/images";
import { getNewsArticles, readNewsStore } from "@/lib/news/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function NewsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const store = await readNewsStore();
  const articles = getNewsArticles(store);
  const isEn = locale === "en";

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 md:px-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)] md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">{t("subtitle")}</p>
        <p className="mt-3 text-sm text-[var(--muted)]">{t("disclaimer")}</p>
      </header>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {articles.length === 0 ? (
          <p className="text-[var(--muted)]">{t("empty")}</p>
        ) : (
          articles.map((article) => {
            const copy = isEn ? article.en : article.fr;
            const date = new Date(article.publishedAt).toLocaleDateString(
              isEn ? "en-US" : "fr-FR",
              { year: "numeric", month: "short", day: "numeric" },
            );
            return (
              <Link
                key={article.slug}
                href={`/actualites/${article.slug}`}
                className="overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
              >
                <CoverImage
                  image={editorialImages.news}
                  locale={locale}
                  className="aspect-[16/9] w-full"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    <time dateTime={article.publishedAt}>{date}</time>
                    <span>·</span>
                    <span>{article.sourceName}</span>
                    {article.rewrittenBy === "ai" ? (
                      <span className="text-[var(--accent)]">{t("aiBadge")}</span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-[var(--heading)]">
                    {copy.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {copy.excerpt}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-[var(--accent)]">
                    {t("read")}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
