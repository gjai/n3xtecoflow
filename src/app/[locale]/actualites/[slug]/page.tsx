import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { articleJsonLd, JsonLd } from "@/components/JsonLd";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AmazonButton } from "@/components/AmazonButton";
import { SmartCover } from "@/components/SmartCover";
import { getEditorialImages } from "@/data/images";
import { amazonCtaForNews } from "@/lib/news/amazon-cta";
import { getNewsBySlug, readNewsStore } from "@/lib/news/store";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const site = await getCurrentSite();
  const store = await readNewsStore();
  const article = getNewsBySlug(slug, store, site.id);
  if (!article) return {};
  const copy = locale === "en" ? article.en : article.fr;
  return {
    title: copy.title,
    description: copy.excerpt,
    alternates: await siteLocaleAlternates(locale, `/actualites/${slug}`),
    openGraph: article.imageSrc
      ? { images: [{ url: article.imageSrc }] }
      : undefined,
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const a = await getTranslations("amazon");
  const site = await getCurrentSite();
  const store = await readNewsStore();
  const article = getNewsBySlug(slug, store, site.id);
  if (!article) notFound();

  const isEn = locale === "en";
  const copy = isEn ? article.en : article.fr;
  const siteUrl = `https://${site.primaryHost}`;
  const editorialImages = getEditorialImages(site.id);
  const date = new Date(article.publishedAt).toLocaleDateString(
    isEn ? "en-US" : "fr-FR",
    { year: "numeric", month: "long", day: "numeric" },
  );
  const cta = amazonCtaForNews(article);
  const buyLabel = isEn ? "Buy on Amazon.fr" : "Acheter sur Amazon.fr";
  const mid = Math.max(2, Math.floor(copy.body.length / 2));

  function AmazonCtaBlock() {
    return (
      <div className="space-y-3 border border-[var(--accent)] bg-[var(--surface)] p-5">
        <p className="text-sm font-medium text-[var(--heading)]">
          {isEn
            ? cta.product
              ? `See ${cta.product.name} on Amazon`
              : site.id === "tumbler"
                ? "See picks on Amazon"
                : "See EcoFlow on Amazon"
            : cta.product
              ? `Voir ${cta.product.name} sur Amazon`
              : site.id === "tumbler"
                ? "Voir la sélection sur Amazon"
                : "Voir EcoFlow sur Amazon"}
        </p>
        <AmazonButton
          href={cta.href}
          label={buyLabel}
          size="lg"
          priceFallback={
            isEn
              ? "See current price on Amazon.fr →"
              : "Voir le prix actuel sur Amazon.fr →"
          }
        />
        <AffiliateDisclosure compact />
      </div>
    );
  }

  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          title: copy.title,
          description: copy.excerpt,
          url: `${siteUrl}/${locale}/actualites/${article.slug}`,
          locale,
          datePublished: article.publishedAt,
          image: article.imageSrc,
          publisherName: site.brand.name,
        })}
      />
      <header className="hero-grid border-b border-[var(--line)]">
        <div className="mx-auto max-w-3xl px-5 py-14 md:px-8">
          <Link
            href="/actualites"
            className="text-sm text-[var(--muted)] hover:text-[var(--heading)]"
          >
            ← {t("back")}
          </Link>
          <SmartCover
            src={article.imageSrc}
            fallback={editorialImages.news}
            locale={locale}
            credit={article.imageCredit}
            className="mt-6 aspect-[16/9] w-full border border-[var(--line)]"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)] md:text-5xl">
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
          <div className="mt-6">
            <AmazonCtaBlock />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-5 px-5 py-12 text-[var(--fog)] leading-relaxed md:px-8">
        {copy.body.slice(0, mid).map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
        <AmazonCtaBlock />
        {copy.body.slice(mid).map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
        <p className="border-t border-[var(--line)] pt-6">
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
          {" · "}
          <span className="text-xs text-[var(--muted)]">{a("disclosureShort")}</span>
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--line)] bg-[var(--bg)]/95 p-3 backdrop-blur md:hidden">
        <a
          href={cta.href}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="flex min-h-12 items-center justify-center bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-ink)]"
        >
          {buyLabel}
        </a>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </article>
  );
}
