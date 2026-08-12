import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AmazonButton } from "@/components/AmazonButton";
import { HeroVisual } from "@/components/HeroVisual";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/components/JsonLd";
import { AMAZON_QUERIES, buildAmazonSearchUrl } from "@/lib/amazon";
import { categories, products } from "@/data/products";
import { comparisons, guides } from "@/data/articles";
import { getNewsArticles, readNewsStore } from "@/lib/news/store";

export const dynamic = "force-dynamic";

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
  const isEn = locale === "en";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ecoflow-stream.com";
  const latestNews = getNewsArticles(await readNewsStore()).slice(0, 3);

  return (
    <>
      <JsonLd data={organizationJsonLd(siteUrl)} />
      <JsonLd data={websiteJsonLd(siteUrl)} />

      <section className="hero-grid relative min-h-[100svh] overflow-hidden">
        <HeroVisual />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-24">
          <p className="reveal font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.28em] text-[var(--accent)]">
            {t("brand")}
          </p>
          <h1 className="reveal-delay mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--hero-fg)] sm:text-5xl md:text-6xl lg:text-7xl">
            {t("headline")}
          </h1>
          <p className="reveal-delay-2 mt-6 max-w-xl text-base text-[var(--hero-muted)] md:text-lg">
            {t("subhead")}
          </p>
          <div className="reveal-delay-2 mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/produits"
              className="bg-[var(--accent)] px-5 py-3 text-sm font-semibold tracking-wide text-[var(--accent-ink)] transition hover:brightness-110"
            >
              {isEn ? "Browse catalog" : "Voir le catalogue"}
            </Link>
            <Link
              href="/guides/choisir-station"
              className="border border-[var(--hero-border)] px-5 py-3 text-sm font-semibold tracking-wide text-[var(--hero-fg)] transition hover:border-[var(--accent)]"
            >
              {t("ctaPrimary")}
            </Link>
          </div>
          <div className="reveal-delay-2 mt-8 max-w-xl">
            <AffiliateDisclosure compact />
          </div>
        </div>
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
                    className="border border-[var(--line)] bg-[var(--bg)] p-4 transition hover:border-[var(--accent)]"
                  >
                    <p className="text-xs text-[var(--muted)]">
                      {article.sourceName}
                    </p>
                    <h3 className="mt-2 font-semibold text-[var(--heading)]">
                      {copy.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">
                      {copy.excerpt}
                    </p>
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
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produits/${cat.slug}`}
              className="group border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
            >
              <div className="mb-4 h-1 w-10 bg-[var(--accent)] transition group-hover:w-16" />
              <h3 className="text-lg font-semibold text-[var(--heading)]">
                {isEn ? cat.en.title : cat.fr.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {isEn ? cat.en.intro : cat.fr.intro}
              </p>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-[var(--muted)]">
          {products.length} {isEn ? "product sheets" : "fiches produits"} ·{" "}
          {guides.length} {isEn ? "guides" : "guides"} ·{" "}
          {comparisons.length}{" "}
          <Link
            href="/comparatifs"
            className="text-[var(--accent)] hover:underline"
          >
            {isEn ? "comparisons" : "comparatifs"}
          </Link>
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
                badge={a("badge")}
              />
            </div>
          </div>
          <AffiliateDisclosure />
        </div>
      </section>
    </>
  );
}
