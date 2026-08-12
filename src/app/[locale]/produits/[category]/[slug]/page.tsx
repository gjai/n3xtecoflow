import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AmazonButton } from "@/components/AmazonButton";
import { CoverImage } from "@/components/CoverImage";
import { JsonLd, productJsonLd } from "@/components/JsonLd";
import { amazonHrefForProduct } from "@/lib/amazon";
import { getAmazonOffer } from "@/lib/amazon/price-store";
import { getEcoflowEntry } from "@/lib/ecoflow/catalog-store";
import { getEcoflowEditorial } from "@/lib/ecoflow/editorial-store";
import { resolveProductCopy } from "@/lib/product-copy";
import {
  resolveDisplayPrice,
  resolveProductMedia,
} from "@/lib/product-presentation";
import { getRelatedEditorial } from "@/lib/product-related";
import { getNewsArticles, readNewsStore } from "@/lib/news/store";
import { localeAlternates, localizeSpecs } from "@/lib/seo";
import {
  getCategory,
  getLocalizedCategory,
  getProduct,
  getProductsByCategory,
  products,
} from "@/data/products";

export const revalidate = 600;

export function generateStaticParams() {
  return products.flatMap((product) => {
    const categorySlug = product.category;
    return ["fr", "en"].map((locale) => ({
      locale,
      category: categorySlug,
      slug: product.slug,
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const product = getProduct(category, slug);
  if (!product) return {};
  const editorial = await getEcoflowEditorial(product.slug);
  const copy = resolveProductCopy(product, locale, editorial);
  const ecoflow = await getEcoflowEntry(product.slug);
  const media = resolveProductMedia(product, ecoflow);
  return {
    title: `${product.name} — ${copy.tagline}`,
    description: copy.summary,
    alternates: localeAlternates(locale, `/produits/${category}/${slug}`),
    openGraph: {
      title: product.name,
      description: copy.summary,
      type: "website",
      images: [{ url: media.src }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);
  const product = getProduct(category, slug);
  const cat = getCategory(category);
  if (!product || !cat) notFound();

  const copy = resolveProductCopy(
    product,
    locale,
    await getEcoflowEditorial(product.slug),
  );
  const catCopy = getLocalizedCategory(cat, locale);
  const isEn = locale === "en";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ecoflow-stream.com";
  const productUrl = `${siteUrl}/${locale}/produits/${cat.slug}/${product.slug}`;
  const offer = await getAmazonOffer(product.slug);
  const ecoflow = await getEcoflowEntry(product.slug);
  const media = resolveProductMedia(product, ecoflow);
  const displayPrice = resolveDisplayPrice(offer, ecoflow);
  const amazonHref =
    offer?.detailUrl || amazonHrefForProduct(product);
  const specs = localizeSpecs(product.specs, locale);
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const newsStore = await readNewsStore();
  const editorial = getRelatedEditorial({
    product,
    locale,
    news: getNewsArticles(newsStore),
  });

  const buyLabel = isEn ? "Buy on Amazon.fr" : "Acheter sur Amazon.fr";
  const buyBadge = isEn ? "Amazon affiliate link" : "Lien affilié Amazon";
  const priceFallback = isEn
    ? "See current price on Amazon.fr →"
    : "Voir le prix actuel sur Amazon.fr →";

  function AmazonCta() {
    return (
      <AmazonButton
        href={amazonHref}
        label={buyLabel}
        badge={buyBadge}
        priceDisplay={displayPrice?.display}
        priceHint={
          displayPrice
            ? isEn
              ? displayPrice.hintEn
              : displayPrice.hintFr
            : undefined
        }
        availability={
          displayPrice?.source === "amazon" ? offer?.availability : undefined
        }
        priceFallback={displayPrice ? undefined : priceFallback}
        size="lg"
      />
    );
  }

  return (
    <article>
      <JsonLd
        data={productJsonLd({
          siteUrl,
          locale,
          name: product.name,
          description: copy.summary,
          category: catCopy.title,
          url: productUrl,
          capacityWh: product.capacityWh,
          outputW: product.outputW,
          priceAmount: displayPrice?.amount,
          priceCurrency: displayPrice?.currency,
          offerUrl: amazonHref,
        })}
      />
      <header className="hero-grid border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8 md:py-16">
          <div>
            <p className="text-sm text-[var(--muted)]">
              <Link href="/produits" className="hover:text-[var(--heading)]">
                {isEn ? "Catalog" : "Catalogue"}
              </Link>
              {" / "}
              <Link
                href={`/produits/${cat.slug}`}
                className="hover:text-[var(--heading)]"
              >
                {catCopy.title}
              </Link>
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-[var(--accent)]">{copy.tagline}</p>
            <p className="mt-4 text-[var(--muted)]">{copy.summary}</p>
            <div className="mt-6 max-w-md space-y-3">
              <AmazonCta />
              <AffiliateDisclosure compact />
            </div>
          </div>
          <CoverImage
            image={{
              src: media.src,
              altFr: media.altFr,
              altEn: media.altEn,
              credit: media.credit,
              creditUrl:
                media.creditUrl === "#" ? amazonHref : media.creditUrl,
            }}
            locale={locale}
            className="aspect-[4/3] w-full border border-[var(--line)] bg-[var(--surface)]"
            packshot={media.source !== "category"}
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
            showCredit
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-8">
        <div className="space-y-8 text-[var(--fog)]">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
              {isEn ? "Best for" : "Idéal pour"}
            </h2>
            <p className="mt-3">{copy.bestFor}</p>
          </section>
          {copy.body.map((p) => (
            <p key={p.slice(0, 40)} className="leading-relaxed">
              {p}
            </p>
          ))}
          <section className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm uppercase tracking-[0.16em] text-[var(--accent)]">
                {isEn ? "Pros" : "Points forts"}
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {copy.pros.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.16em] text-[var(--solar)]">
                {isEn ? "Limits" : "Limites"}
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {copy.cons.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </section>

          {(editorial.guides.length > 0 ||
            editorial.comparisons.length > 0 ||
            editorial.news.length > 0) && (
            <section className="space-y-8 border-t border-[var(--line)] pt-8">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
                {isEn ? "Related reading" : "À lire aussi"}
              </h2>
              {editorial.guides.length > 0 ? (
                <div>
                  <h3 className="text-sm uppercase tracking-[0.16em] text-[var(--muted)]">
                    {isEn ? "Guides" : "Guides"}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {editorial.guides.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-[var(--accent)] underline-offset-2 hover:underline"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {editorial.comparisons.length > 0 ? (
                <div>
                  <h3 className="text-sm uppercase tracking-[0.16em] text-[var(--muted)]">
                    {isEn ? "Comparisons" : "Comparatifs"}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {editorial.comparisons.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-[var(--accent)] underline-offset-2 hover:underline"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {editorial.news.length > 0 ? (
                <div>
                  <h3 className="text-sm uppercase tracking-[0.16em] text-[var(--muted)]">
                    {isEn ? "News" : "Actualités"}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {editorial.news.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-[var(--accent)] underline-offset-2 hover:underline"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          )}

          {related.length > 0 ? (
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
                {isEn ? "Related in this range" : "Dans la même gamme"}
              </h2>
              <ul className="mt-4 space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/produits/${item.category}/${item.slug}`}
                      className="text-[var(--accent)] underline-offset-2 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6 md:sticky md:top-24 md:self-start">
          <div className="border border-[var(--accent)] bg-[var(--surface)] p-5 shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_25%,transparent)]">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Amazon.fr
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
              {product.name}
            </p>
            <div className="mt-4">
              <AmazonCta />
            </div>
            <div className="mt-4">
              <AffiliateDisclosure compact />
            </div>
          </div>

          <div className="border border-[var(--line)] bg-[var(--surface)] p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--heading)]">
              {isEn ? "Technical specs" : "Caractéristiques techniques"}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-1 border-b border-[var(--line)] pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                >
                  <dt className="text-[var(--muted)]">{spec.label}</dt>
                  <dd className="text-[var(--heading)] sm:text-right">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-[var(--muted)]">
              {isEn
                ? "Indicative specs — always confirm on the official/regional sheet before purchase."
                : "Specs indicatives — vérifiez la fiche officielle/régionale avant achat."}
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--line)] bg-[var(--bg)]/95 p-3 backdrop-blur md:hidden">
        <a
          href={amazonHref}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="flex min-h-12 items-center justify-center bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-ink)]"
        >
          {displayPrice?.display
            ? `${buyLabel} · ${displayPrice.display}`
            : buyLabel}
        </a>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </article>
  );
}
