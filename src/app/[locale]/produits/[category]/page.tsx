import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/CoverImage";
import { getCategoryImage } from "@/data/images";
import { getAmazonOffersMap } from "@/lib/amazon/price-store";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import { resolveProductCopy } from "@/lib/product-copy";
import {
  resolveDisplayPrice,
  resolveProductMedia,
} from "@/lib/product-presentation";
import { siteLocaleAlternates } from "@/lib/seo";
import {
  categories,
  categorySiteId,
  getCategory,
  getLocalizedCategory,
  getProductsByCategory,
} from "@/data/products";
import { getCurrentSite } from "@/sites/server";

export const revalidate = 600;

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
  return {
    title: copy.title,
    description: copy.intro,
    alternates: await siteLocaleAlternates(locale, `/produits/${category}`),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  const cat = getCategory(category);
  if (!cat || categorySiteId(cat) !== site.id) notFound();
  const copy = getLocalizedCategory(cat, locale);
  const items = getProductsByCategory(cat.id);
  const isEn = locale === "en";
  const image = getCategoryImage(cat.id);
  const [offers, ecoflowMap, editorialStore] = await Promise.all([
    getAmazonOffersMap(),
    getEcoflowEntriesMap(),
    import("@/lib/ecoflow/editorial-store").then((m) =>
      m.readEcoflowEditorialStore(),
    ),
  ]);

  const rows = items.map((product) => {
    const editorial = editorialStore.entries[product.slug];
    const p = resolveProductCopy(product, locale, editorial);
    const eco = ecoflowMap[product.slug];
    const media = resolveProductMedia(product, eco);
    const displayPrice = resolveDisplayPrice(offers[product.slug], eco);
    return { product, p, media, displayPrice };
  });

  return (
    <div className="pt-6">
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <p className="text-sm text-[var(--muted)]">
          <Link href="/produits" className="hover:text-[var(--heading)]">
            {isEn ? "Catalog" : "Catalogue"}
          </Link>
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-3xl text-[var(--muted)]">{copy.intro}</p>
          </div>
          <CoverImage
            image={image}
            locale={locale}
            className="aspect-[16/10] w-full border border-[var(--line)]"
            sizes="(max-width: 768px) 100vw, 40vw"
            showCredit
          />
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 md:px-8">
        {rows.map(({ product, p, media, displayPrice }) => (
            <Link
              key={product.slug}
              href={`/produits/${cat.slug}/${product.slug}`}
              className="grid gap-4 border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)] md:grid-cols-[140px_1fr_auto] md:items-center"
            >
              <CoverImage
                image={{
                  src: media.src,
                  altFr: media.altFr,
                  altEn: media.altEn,
                  credit: media.credit,
                  creditUrl: media.creditUrl,
                }}
                locale={locale}
                className="aspect-square w-full border border-[var(--line)] bg-[var(--surface)] md:aspect-[4/3]"
                packshot={media.source !== "category"}
                sizes="140px"
              />
              <div>
                <h2 className="text-lg font-semibold text-[var(--heading)]">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{p.tagline}</p>
                <p className="mt-2 text-sm text-[var(--fog)]">{p.summary}</p>
              </div>
              <div className="text-sm md:text-right">
                {displayPrice ? (
                  <>
                    <p className="font-semibold text-[var(--heading)]">
                      {displayPrice.display}
                    </p>
                    <p className="mt-1 text-[10px] text-[var(--muted)]">
                      {displayPrice.source === "amazon"
                        ? "Amazon.fr"
                        : isEn
                          ? "Catalog price"
                          : "Prix catalogue"}
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-medium text-[var(--accent)]">
                    {isEn ? "Price on Amazon →" : "Prix sur Amazon →"}
                  </p>
                )}
                <p className="mt-1 text-[var(--accent)]">
                  {product.capacityWh ? `${product.capacityWh} Wh` : ""}
                  {product.capacityWh && product.outputW ? " · " : ""}
                  {product.outputW ? `${product.outputW} W` : ""}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--heading)]">
                  {isEn ? "View sheet" : "Voir la fiche"}
                </p>
              </div>
            </Link>
        ))}
      </div>
    </div>
  );
}
