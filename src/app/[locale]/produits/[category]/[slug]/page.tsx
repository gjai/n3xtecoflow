import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { AmazonButton } from "@/components/AmazonButton";
import { buildAmazonSearchUrl } from "@/lib/amazon";
import {
  getCategory,
  getLocalizedCategory,
  getLocalizedProduct,
  getProduct,
  products,
} from "@/data/products";

export function generateStaticParams() {
  return products.flatMap((product) => {
    const cat = getCategory(
      product.category === "delta-pro" ? "delta-pro" : product.category,
    );
    // map category id to slug
    const categorySlug =
      product.category === "delta-pro"
        ? "delta-pro"
        : product.category;
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
  return {
    title: `${product.name} — ${copy.tagline}`,
    description: copy.summary,
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

  return (
    <article className="pt-24">
      <header className="hero-grid border-b border-[var(--line)]">
        <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-16">
          <p className="text-sm text-[var(--muted)]">
            <Link href="/produits" className="hover:text-white">
              {isEn ? "Catalog" : "Catalogue"}
            </Link>
            {" / "}
            <Link href={`/produits/${cat.slug}`} className="hover:text-white">
              {catCopy.title}
            </Link>
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-[var(--accent)]">{copy.tagline}</p>
          <p className="mt-4 text-[var(--muted)]">{copy.summary}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-8">
        <div className="space-y-8 text-[var(--fog)]">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-white">
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
            href={buildAmazonSearchUrl(product.amazonQuery)}
            label={isEn ? "See on Amazon" : "Voir sur Amazon"}
            badge={isEn ? "Amazon affiliate link" : "Lien affilié Amazon"}
          />
        </div>

        <aside className="h-fit border border-[var(--line)] bg-[var(--surface)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-white">
            {isEn ? "Technical specs" : "Caractéristiques techniques"}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-2"
              >
                <dt className="text-[var(--muted)]">{spec.label}</dt>
                <dd className="text-right text-white">{spec.value}</dd>
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
