import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArticleCover } from "@/components/ArticleCover";
import { editorialImages } from "@/data/images";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import { resolveArticleProductImages } from "@/lib/article-images";
import { resolveAllGuides } from "@/lib/guides/refresh";
import { localeAlternates } from "@/lib/seo";

export const revalidate = 600;

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
        ? "EcoFlow buying guides: stations, solar, home backup, camping, STREAM."
        : "Guides d'achat EcoFlow : stations, solaire, backup maison, camping, STREAM.",
    alternates: localeAlternates(locale, "/guides"),
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
  const ecoflowMap = await getEcoflowEntriesMap();
  const allGuides = await resolveAllGuides();

  return (
    <div className="pt-6">
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
          {isEn ? "Buying guides" : "Guides d'achat"}
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          {isEn
            ? "Practical methods to size Wh/W and pick the right EcoFlow setup — regularly enriched."
            : "Méthodes concrètes pour dimensionner Wh/W et choisir le bon setup EcoFlow — enrichis régulièrement."}
        </p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-2 md:px-8">
        {allGuides.map((guide) => {
          const copy = isEn ? guide.en : guide.fr;
          const productImages = resolveArticleProductImages(
            guide.slug,
            ecoflowMap,
          );
          const coverImages = guide.imageSrc
            ? [
                {
                  src: guide.imageSrc,
                  altFr: copy.title,
                  altEn: copy.title,
                  credit: guide.imageCredit || "EcoFlow Stream",
                  creditUrl: "#",
                },
              ]
            : productImages;
          return (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
            >
              <ArticleCover
                images={coverImages}
                fallback={editorialImages.guides}
                locale={locale}
                className="aspect-[16/9] w-full"
                sizes="(max-width: 768px) 100vw, 50vw"
                packshot={!guide.imageSrc}
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
      </div>
    </div>
  );
}
