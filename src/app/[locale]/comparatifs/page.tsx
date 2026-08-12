import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/CoverImage";
import { getCategoryImage } from "@/data/images";
import {
  comparisonHubCategories,
  hubTitle,
} from "@/lib/comparisons/hub";
import { getLocalizedCategory } from "@/data/products";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getCurrentSite();
  const isEn = locale === "en";
  return {
    title: isEn ? "Comparisons" : "Comparatifs",
    description: isEn
      ? `Compare ${site.brand.name} products by category: pick any X vs Y and compare specs.`
      : `Comparez les produits ${site.brand.name} par catégorie : choisissez X vs Y et comparez les specs.`,
    alternates: await siteLocaleAlternates(locale, "/comparatifs"),
  };
}

export default async function ComparisonsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  const isEn = locale === "en";
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
