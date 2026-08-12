import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/CoverImage";
import { guides } from "@/data/articles";
import { editorialImages } from "@/data/images";

function guideImage(slug: string) {
  if (slug.includes("camping") || slug.includes("van")) {
    return editorialImages.camping;
  }
  if (slug.includes("backup") || slug.includes("maison")) {
    return editorialImages.backup;
  }
  return editorialImages.guides;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Buying guides" : "Guides d'achat",
    description:
      locale === "en"
        ? "EcoFlow buying guides: stations, solar, home backup, camping."
        : "Guides d'achat EcoFlow : stations, solaire, backup maison, camping.",
  };
}

export default async function GuidesIndexPage({
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
          {isEn ? "Buying guides" : "Guides d'achat"}
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          {isEn
            ? "Practical methods to size Wh/W and pick the right EcoFlow family."
            : "Méthodes concrètes pour dimensionner Wh/W et choisir la bonne famille EcoFlow."}
        </p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-2 md:px-8">
        {guides.map((guide) => {
          const copy = isEn ? guide.en : guide.fr;
          return (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
            >
              <CoverImage
                image={guideImage(guide.slug)}
                locale={locale}
                className="aspect-[16/9] w-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--heading)]">
                  {copy.title}
                </h2>
                <p className="mt-3 text-sm text-[var(--muted)]">{copy.subtitle}</p>
              </div>
            </Link>
          );
        })}
        <Link
          href="/produits"
          className="overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
        >
          <CoverImage
            image={editorialImages.comparatifs}
            locale={locale}
            className="aspect-[16/9] w-full"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[var(--heading)]">
              {isEn ? "Full product catalog" : "Catalogue produits complet"}
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {isEn
                ? "Specs and notes for RIVER, DELTA, Pro, PowerStream, solar."
                : "Fiches et specs RIVER, DELTA, Pro, PowerStream, solaire."}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
