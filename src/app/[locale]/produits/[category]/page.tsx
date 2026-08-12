import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  categories,
  getCategory,
  getLocalizedCategory,
  getLocalizedProduct,
  getProductsByCategory,
} from "@/data/products";

export function generateStaticParams() {
  return categories.flatMap((cat) =>
    ["fr", "en"].map((locale) => ({ locale, category: cat.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  const copy = getLocalizedCategory(cat, locale);
  return { title: copy.title, description: copy.intro };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const cat = getCategory(category);
  if (!cat) notFound();
  const copy = getLocalizedCategory(cat, locale);
  const items = getProductsByCategory(cat.id);
  const isEn = locale === "en";

  return (
    <div className="pt-24">
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <p className="text-sm text-[var(--muted)]">
          <Link href="/produits" className="hover:text-white">
            {isEn ? "Catalog" : "Catalogue"}
          </Link>
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">{copy.intro}</p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 md:px-8">
        {items.map((product) => {
          const p = getLocalizedProduct(product, locale);
          return (
            <Link
              key={product.slug}
              href={`/produits/${cat.slug}/${product.slug}`}
              className="grid gap-2 border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)] md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-white">{product.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{p.tagline}</p>
                <p className="mt-2 text-sm text-[var(--fog)]">{p.summary}</p>
              </div>
              <div className="text-sm text-[var(--accent)] md:text-right">
                {product.capacityWh ? `${product.capacityWh} Wh` : ""}
                {product.capacityWh && product.outputW ? " · " : ""}
                {product.outputW ? `${product.outputW} W` : ""}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
