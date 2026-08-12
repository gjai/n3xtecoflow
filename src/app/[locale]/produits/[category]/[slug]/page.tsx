import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AmazonButton } from "@/components/AmazonButton";
import { CoverImage } from "@/components/CoverImage";
import { JsonLd, productJsonLd } from "@/components/JsonLd";
import { getCategoryImage } from "@/data/images";
import { amazonHrefForProduct } from "@/lib/amazon";
import { getAmazonOffer } from "@/lib/amazon/price-store";
import { localeAlternates, localizeSpecs } from "@/lib/seo";
import {
  getCategory,
  getLocalizedCategory,
  getLocalizedProduct,
  getProduct,
  getProductsByCategory,
  products,
} from "@/data/products";

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
  const copy = getLocalizedProduct(product, locale);
  const image = getCategoryImage(product.category);
  return {
    title: `${product.name} — ${copy.tagline}`,
    description: copy.summary,
    alternates: localeAlternates(locale, `/produits/${category}/${slug}`),
    openGraph: {
      title: product.name,
      description: copy.summary,
      type: "website",
      images: [{ url: image.src }],
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

  const copy = getLocalizedProduct(product, locale);
  const catCopy = getLocalizedCategory(cat, locale);
  const isEn = locale === "en";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ecoflow-stream.com";
  const productUrl = `${siteUrl}/${locale}/produits/${cat.slug}/${product.slug}`;
  const image = getCategoryImage(product.category);
  const offer = await getAmazonOffer(product.slug);
  const amazonHref =
    offer?.detailUrl || amazonHrefForProduct(product);
  const priceHint = offer?.price.display
    ? isEn
      ? `Amazon.fr price · updated ${new Date(offer.updatedAt).toLocaleString("en-GB")}`
      : `Prix Amazon.fr · maj. ${new Date(offer.updatedAt).toLocaleString("fr-FR")}`
    : undefined;
  const specs = localizeSpecs(product.specs, locale);
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

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
          priceAmount: offer?.price.amount,
          priceCurrency: offer?.price.currency,
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
            <div className="mt-6">
              <AffiliateDisclosure compact />
            </div>
          </div>
          <CoverImage
            image={
              product.imageSrc
                ? {
                    src: product.imageSrc,
                    altFr: product.name,
                    altEn: product.name,
                    credit: "Produit",
                    creditUrl: amazonHref,
                  }
                : image
            }
            locale={locale}
            className="aspect-[4/3] w-full border border-[var(--line)]"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
            showCredit={!product.imageSrc}
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
          <AmazonButton
            href={amazonHref}
            label={isEn ? "See on Amazon" : "Voir sur Amazon"}
            badge={isEn ? "Amazon affiliate link" : "Lien affilié Amazon"}
            priceDisplay={offer?.price.display}
            priceHint={priceHint}
            availability={offer?.availability}
          />
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

        <aside className="h-fit border border-[var(--line)] bg-[var(--surface)] p-5">
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
                <dd className="text-[var(--heading)] sm:text-right">{spec.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-[var(--muted)]">
            {isEn
              ? "Indicative specs — always confirm on the official/regional sheet before purchase."
              : "Specs indicatives — vérifiez la fiche officielle/régionale avant achat."}
          </p>
        </aside>
      </div>
    </article>
  );
}
