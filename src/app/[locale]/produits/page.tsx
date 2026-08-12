import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/CoverImage";
import { categoryImages } from "@/data/images";
import { getAmazonOffersMap } from "@/lib/amazon/price-store";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import { resolveProductCopy } from "@/lib/product-copy";
import {
  resolveDisplayPrice,
  resolveProductMedia,
} from "@/lib/product-presentation";
import { siteLocaleAlternates } from "@/lib/seo";
import {
  getCategoriesForSite,
  getLocalizedCategory,
  getProductsByCategory,
  getProductsForSite,
} from "@/data/products";
import { getCurrentSite } from "@/sites/server";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getCurrentSite();
  const isEn = locale === "en";
  const isTumbler = site.id === "tumbler";
  return {
    title: isTumbler
      ? isEn
        ? "Insulated bottle catalog"
        : "Catalogue gourdes isothermes"
      : isEn
        ? "EcoFlow product catalog"
        : "Catalogue produits EcoFlow",
    description: isTumbler
      ? isEn
        ? "Top Amazon insulated bottles and tumblers — ships and sold by Amazon."
        : "Meilleures ventes Amazon de gourdes et tumblers isothermes — Expédié et vendu par Amazon."
      : isEn
        ? "RIVER, DELTA, DELTA Pro, PowerStream, solar panels and accessories."
        : "RIVER, DELTA, DELTA Pro, PowerStream, panneaux solaires et accessoires.",
    alternates: await siteLocaleAlternates(locale, "/produits"),
  };
}

export default async function ProductsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const site = await getCurrentSite();

  if (site.id === "tumbler") {
    const products = getProductsForSite("tumbler");
    const [offers, ecoflowMap, editorialStore] = await Promise.all([
      getAmazonOffersMap(),
      getEcoflowEntriesMap(),
      import("@/lib/ecoflow/editorial-store").then((m) =>
        m.readEcoflowEditorialStore(),
      ),
    ]);
    const rows = products.map((product) => {
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
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
            {isEn ? "Insulated bottles & tumblers" : "Gourdes & tumblers isothermes"}
          </h1>
          <p className="mt-4 max-w-3xl text-[var(--muted)]">
            {isEn
              ? "Buying notes and Amazon links for bestsellers — prefer listings Ships and sold by Amazon."
              : "Conseils d’achat et liens Amazon vers les best-sellers — préférez Expédié et vendu par Amazon."}
          </p>
        </header>
        <div className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 md:px-8">
          {rows.map(({ product, p, media, displayPrice }) => (
            <Link
              key={product.slug}
              href={`/produits/${product.category}/${product.slug}`}
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
                      Amazon.fr
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-medium text-[var(--accent)]">
                    {isEn ? "Price on Amazon →" : "Prix sur Amazon →"}
                  </p>
                )}
                <p className="mt-1 text-[var(--muted)]">
                  {product.specs?.[0]?.value || product.battery}
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

  const cats = getCategoriesForSite(site.id);

  return (
    <div className="pt-6">
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
          {isEn
            ? "EcoFlow catalog by category"
            : "Catalogue EcoFlow par catégorie"}
        </h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">
          {isEn
            ? "Technical specs, use cases and buying notes for EcoFlow stations, PowerStream, solar and accessories."
            : "Fiches techniques, usages et conseils d’achat pour stations EcoFlow, PowerStream, solaire et accessoires."}
        </p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-2 md:px-8 lg:grid-cols-3">
        {cats.map((cat) => {
          const copy = getLocalizedCategory(cat, locale);
          const count = getProductsByCategory(cat.id).length;
          return (
            <Link
              key={cat.id}
              href={`/produits/${cat.slug}`}
              className="overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
            >
              <CoverImage
                image={categoryImages[cat.id]}
                locale={locale}
                className="aspect-[16/10] w-full"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--heading)]">
                  {copy.title}
                </h2>
                <p className="mt-3 text-sm text-[var(--muted)]">{copy.intro}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                  {count} {isEn ? "products" : "produits"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
