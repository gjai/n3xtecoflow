import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/CoverImage";
import { categoryImages } from "@/data/images";
import {
  categories,
  getLocalizedCategory,
  getProductsByCategory,
} from "@/data/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "EcoFlow product catalog" : "Catalogue produits EcoFlow",
    description:
      locale === "en"
        ? "RIVER, DELTA, DELTA Pro, PowerStream, solar panels and accessories."
        : "RIVER, DELTA, DELTA Pro, PowerStream, panneaux solaires et accessoires.",
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

  return (
    <div className="pt-24">
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
          {isEn ? "EcoFlow catalog by category" : "Catalogue EcoFlow par catégorie"}
        </h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">
          {isEn
            ? "Technical specs, use cases and buying notes for EcoFlow stations, PowerStream, solar and accessories."
            : "Fiches techniques, usages et conseils d’achat pour stations EcoFlow, PowerStream, solaire et accessoires."}
        </p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-2 md:px-8 lg:grid-cols-3">
        {categories.map((cat) => {
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
