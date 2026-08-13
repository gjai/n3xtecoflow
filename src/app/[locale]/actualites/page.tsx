import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Pagination } from "@/components/Pagination";
import { SmartCover } from "@/components/SmartCover";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { getEditorialImages } from "@/data/images";
import { getNewsArticles, readNewsStore } from "@/lib/news/store";
import { paginate, parsePageParam } from "@/lib/pagination";
import {
  DATE_LOCALE,
  toAppLocale,
  usesEnglishFallback,
} from "@/i18n/locales";
import { siteLocaleAlternates } from "@/lib/seo";
import { siteIsEuroMillions, siteShowsNews } from "@/sites/features";
import { getCurrentSite } from "@/sites/server";
import { redirect } from "@/i18n/navigation";

export const revalidate = 600;

const PAGE_SIZE = 12;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { page: pageRaw } = await searchParams;
  const t = await getTranslations({ locale, namespace: "news" });
  const page = parsePageParam(pageRaw);
  return {
    title: page > 1 ? `${t("title")} · ${page}` : t("title"),
    description: t("subtitle"),
    robots: page > 1 ? { index: false, follow: true } : undefined,
    alternates: await siteLocaleAlternates(locale, "/actualites"),
  };
}

export default async function NewsIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteShowsNews(site)) {
    redirect({ href: "/guides", locale });
  }
  const { page: pageRaw } = await searchParams;
  const t = await getTranslations("news");
  const store = await readNewsStore();
  const all = getNewsArticles(store, site.id);
  const editorialImages = getEditorialImages(site.id);
  const { items, page, totalPages, total } = paginate(
    all,
    parsePageParam(pageRaw),
    PAGE_SIZE,
  );
  const isEn = usesEnglishFallback(locale);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)] md:text-5xl">
          {t("title")}
        </h1>
        {siteIsEuroMillions(site) ? (
          <div className="mt-4">
            <GameToolsNav gameId="euromillions" />
          </div>
        ) : null}
        {total > 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            {t("count", { count: total })}
          </p>
        ) : null}
      </header>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {items.length === 0 ? (
          <p className="text-[var(--muted)]">{t("empty")}</p>
        ) : (
          items.map((article) => {
            const copy = isEn ? article.en : article.fr;
            const date = new Date(article.publishedAt).toLocaleDateString(
              DATE_LOCALE[toAppLocale(locale)],
              { year: "numeric", month: "short", day: "numeric" },
            );
            return (
              <Link
                key={article.slug}
                href={`/actualites/${article.slug}`}
                className="overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
              >
                <SmartCover
                  src={article.imageSrc}
                  fallback={editorialImages.news}
                  locale={locale}
                  credit={article.imageCredit}
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

      <Pagination
        pathname="/actualites"
        page={page}
        totalPages={totalPages}
        prevLabel={t("prev")}
        nextLabel={t("next")}
        pageLabel={t("pageOf")}
      />
    </div>
  );
}
