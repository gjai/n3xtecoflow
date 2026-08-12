import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ComparisonPicker } from "@/components/ComparisonPicker";
import { CoverImage } from "@/components/CoverImage";
import { getCategoryImage } from "@/data/images";
import {
  comparisonHubCategories,
  hubTitle,
  productsForSiteCompare,
  toCompareProductView,
  usesFlatCatalog,
} from "@/lib/comparisons/hub";
import { getLocalizedCategory } from "@/data/products";
import { getAmazonOffersMap } from "@/lib/amazon/price-store";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import { resolveDisplayPrice, resolveProductMedia } from "@/lib/product-presentation";
import { siteLocaleAlternates } from "@/lib/seo";
import { siteShowsComparisons } from "@/sites/features";
import { getCurrentSite } from "@/sites/server";
import { redirect } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getCurrentSite();
  if (!siteShowsComparisons(site)) {
    return { alternates: await siteLocaleAlternates(locale, "/guides") };
  }
  const isEn = locale === "en";
  const flat = usesFlatCatalog(site);
  return {
    title: isEn ? "Comparisons" : "Comparatifs",
    description: flat
      ? isEn
        ? `Compare any two ${site.brand.name} products side by side — specs and indicative prices.`
        : `Comparez deux produits ${site.brand.name} côte à côte — specs et prix indicatifs.`
      : isEn
        ? `Compare ${site.brand.name} products by category: pick any X vs Y and compare specs.`
        : `Comparez les produits ${site.brand.name} par catégorie : choisissez X vs Y et comparez les specs.`,
    alternates: await siteLocaleAlternates(locale, "/comparatifs"),
  };
}

export default async function ComparisonsIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteShowsComparisons(site)) {
    redirect({ href: "/guides", locale });
  }
  const isEn = locale === "en";

  if (usesFlatCatalog(site)) {
    const list = productsForSiteCompare(site.id);
    if (list.length < 2) {
      return (
        <div className="pt-6">
          <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
              {isEn ? "Comparisons" : "Comparatifs"}
            </h1>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              {isEn
                ? "Comparison will appear once enough products are listed."
                : "Le comparateur apparaîtra dès que suffisamment de produits sont listés."}
            </p>
          </header>
        </div>
      );
    }

    const ecoflowMap = await getEcoflowEntriesMap();
    const amazonMap = await getAmazonOffersMap();
    const options = list.map((p) => ({ slug: p.slug, name: p.name }));
    const productMap: Record<string, ReturnType<typeof toCompareProductView>> =
      {};
    for (const p of list) {
      const eco = ecoflowMap[p.slug];
      const amazon = amazonMap[p.slug];
      const display = resolveDisplayPrice(amazon, eco, p);
      const view = toCompareProductView(p, locale, eco);
      if (display?.display) {
        view.priceDisplay = display.display;
        view.priceSource = display.source;
      }
      view.imageSrc = resolveProductMedia(p, eco).src;
      productMap[p.slug] = view;
    }

    const defaultLeft = list[0].slug;
    const defaultRight = list[1]?.slug || list[0].slug;
    const left = sp.a && productMap[sp.a] ? sp.a : defaultLeft;
    let right =
      sp.b && productMap[sp.b] && sp.b !== left ? sp.b : defaultRight;
    if (right === left) {
      right = list.find((p) => p.slug !== left)?.slug || defaultRight;
    }

    return (
      <div className="pt-6">
        <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
            {isEn ? "Compare products" : "Comparer les produits"}
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            {isEn
              ? "Pick any two products from the catalog and compare specs and indicative prices."
              : "Choisissez deux produits du catalogue et comparez specs et prix indicatifs."}
          </p>
        </header>
        <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <ComparisonPicker
            locale={locale}
            options={options}
            initialLeft={left}
            initialRight={right}
            products={productMap}
          />
        </div>
      </div>
    );
  }

  const hubs = comparisonHubCategories(site.id);

  return (
    <div className="pt-6">
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
          {isEn ? "Comparisons" : "Comparatifs"}
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          {isEn
            ? "One hub per range — pick any two products and compare live specs and indicative prices."
            : "Un hub par gamme — choisissez deux produits et comparez specs et prix indicatifs."}
        </p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-2 md:px-8">
        {hubs.length === 0 ? (
          <p className="text-[var(--muted)] md:col-span-2">
            {isEn
              ? "Comparison hubs will appear once enough products are listed."
              : "Les hubs comparatifs apparaîtront dès que suffisamment de produits sont listés."}
          </p>
        ) : (
          hubs.map((cat) => {
            const copy = getLocalizedCategory(cat, locale);
            return (
              <Link
                key={cat.id}
                href={`/comparatifs/${cat.slug}`}
                className="overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
              >
                <CoverImage
                  image={getCategoryImage(cat.id)}
                  locale={locale}
                  className="aspect-[16/9] w-full"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-[var(--heading)]">
                    {hubTitle(cat.id, locale)}
                  </h2>
                  <p className="mt-3 text-sm text-[var(--muted)]">{copy.intro}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                    {isEn ? "Compare X vs Y →" : "Comparer X vs Y →"}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
