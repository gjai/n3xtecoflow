import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { articleJsonLd, JsonLd } from "@/components/JsonLd";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AffiliateLinkedText } from "@/components/AffiliateLinkedText";
import { AffiliateOfferButton } from "@/components/AffiliateOfferButton";
import { AmazonButton } from "@/components/AmazonButton";
import { SmartCover } from "@/components/SmartCover";
import { getEditorialImages } from "@/data/images";
import { resolveAffiliateOffers } from "@/lib/affiliates";
import { affiliateCtaForNews } from "@/lib/news/affiliate-cta";
import { amazonCtaForNews } from "@/lib/news/amazon-cta";
import { getNewsBySlug, readNewsStore } from "@/lib/news/store";
import {
  DATE_LOCALE,
  toAppLocale,
  usesEnglishFallback,
} from "@/i18n/locales";
import { siteLocaleAlternates } from "@/lib/seo";
import { siteAllowsAmazon, siteShowsProducts } from "@/sites/features";
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
  const copy = usesEnglishFallback(locale) ? article.en : article.fr;
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
  const tOffers = await getTranslations("offers");
  const site = await getCurrentSite();
  const store = await readNewsStore();
  const article = getNewsBySlug(slug, store, site.id);
  if (!article) {
    permanentRedirect(`/${locale}/actualites`);
  }

  const isEn = usesEnglishFallback(locale);
  const copy = isEn ? article.en : article.fr;
  const siteUrl = `https://${site.primaryHost}`;
  const editorialImages = getEditorialImages(site.id);
  const published = new Date(article.publishedAt);
  const date = published.toLocaleDateString(
    DATE_LOCALE[toAppLocale(locale)],
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Europe/Paris",
    },
  );
  const time = published.toLocaleTimeString(
    DATE_LOCALE[toAppLocale(locale)],
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Paris",
    },
  );
  const useAmazon = siteAllowsAmazon(site);
  const amazonCta = useAmazon ? amazonCtaForNews(article) : null;
  const affiCta = !useAmazon ? affiliateCtaForNews(article, site) : null;
  const offerLabel = (offer: { id: string; labelFr: string; labelEn: string }) =>
    tOffers.has(offer.id)
      ? tOffers(offer.id)
      : isEn
        ? offer.labelEn
        : offer.labelFr;
  const stickyHref = useAmazon
    ? amazonCta!.href
    : affiCta?.primary?.href || affiCta?.offers[0]?.href || "";
  const stickyLabel = useAmazon
    ? isEn
      ? "Buy on Amazon.fr"
      : "Acheter sur Amazon.fr"
    : affiCta?.primary
      ? offerLabel(affiCta.primary)
      : t.has("openOffer")
        ? t("openOffer")
        : isEn
          ? "Open offer"
          : "Voir l’offre";
  const mid = Math.max(2, Math.floor(copy.body.length / 2));
  const keywordOffers =
    site.id === "casinos-crypto" ? resolveAffiliateOffers(site) : undefined;
  const linkify = (text: string) =>
    keywordOffers ? (
      <AffiliateLinkedText text={text} offers={keywordOffers} />
    ) : (
      text
    );

  function AmazonCtaBlock() {
    if (!amazonCta) return null;
    return (
      <div className="space-y-3 border border-[var(--accent)] bg-[var(--surface)] p-5">
        <p className="text-sm font-medium text-[var(--heading)]">
          {isEn
            ? amazonCta.product
              ? `See ${amazonCta.product.name} on Amazon`
              : `See picks on Amazon`
            : amazonCta.product
              ? `Voir ${amazonCta.product.name} sur Amazon`
              : `Voir la sélection sur Amazon`}
        </p>
        <AmazonButton
          href={amazonCta.href}
          label={stickyLabel}
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

  function AffiliateCtaBlock() {
    if (!affiCta?.offers.length) return null;
    return (
      <div className="space-y-3 border border-[var(--accent)] bg-[var(--surface)] p-5">
        <p className="text-sm font-medium text-[var(--heading)]">
          {t.has("affiliateContinue")
            ? t("affiliateContinue")
            : isEn
              ? "Continue with our affiliate partners"
              : "Continuer via nos partenaires affiliés"}
        </p>
        <div className="flex flex-wrap gap-3">
          {affiCta.offers.map((offer) => (
            <AffiliateOfferButton
              key={offer.id}
              href={offer.href}
              label={offerLabel(offer)}
              variant={offer.id === affiCta.matchedId ? "primary" : "secondary"}
            />
          ))}
        </div>
        <p className="text-xs text-[var(--muted)]">
          {t.has("affiliateNote")
            ? t("affiliateNote")
            : isEn
              ? "Affiliate links · 18+ · Play responsibly"
              : "Liens d’affiliation · 18+ · Jouez responsable"}
        </p>
        <AffiliateDisclosure compact />
      </div>
    );
  }

  const CtaBlock = useAmazon ? AmazonCtaBlock : AffiliateCtaBlock;

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
            {linkify(copy.title)}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            {linkify(copy.excerpt)}
          </p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            <time dateTime={article.publishedAt}>
              {date} · {time}
            </time>
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
            <CtaBlock />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-5 px-5 py-12 text-[var(--fog)] leading-relaxed md:px-8">
        {copy.body.slice(0, mid).map((p) => (
          <p key={p.slice(0, 48)}>{linkify(p)}</p>
        ))}
        <CtaBlock />
        {copy.body.slice(mid).map((p) => (
          <p key={p.slice(0, 48)}>{linkify(p)}</p>
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
          {siteShowsProducts(site) ? (
            <Link
              href="/produits"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              {t("catalogCta")}
            </Link>
          ) : (
            <Link
              href="/guides"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              {t("catalogCta")}
            </Link>
          )}
          {" · "}
          <span className="text-xs text-[var(--muted)]">
            {a("disclosureShort")}
          </span>
        </p>
      </div>

      {stickyHref ? (
        <>
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--line)] bg-[var(--bg)]/95 p-3 backdrop-blur md:hidden">
            <a
              href={stickyHref}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="flex min-h-12 items-center justify-center bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-ink)]"
            >
              {stickyLabel}
            </a>
          </div>
          <div className="h-16 md:hidden" aria-hidden />
        </>
      ) : null}
    </article>
  );
}
