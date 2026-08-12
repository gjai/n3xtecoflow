import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArticleCover } from "@/components/ArticleCover";
import { getEditorialImages } from "@/data/images";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import { resolveArticleProductImages } from "@/lib/article-images";
import { resolveAllGuides } from "@/lib/guides/refresh";
import { siteLocaleAlternates } from "@/lib/seo";
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
  const brand = site.brand.name;
  return {
    title: isEn ? "Buying guides" : "Guides d'achat",
    description: isEn
      ? `Buying guides for ${brand}: criteria, comparisons and practical checklists.`
      : `Guides d'achat ${brand} : critères, comparatifs et checklists concrètes.`,
    alternates: await siteLocaleAlternates(locale, "/guides"),
  };
}

export default async function GuidesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  const isEn = locale === "en";
  const ecoflowMap =
    site.id === "ecoflow" ? await getEcoflowEntriesMap() : {};
  const allGuides = await resolveAllGuides(site.id);
  const editorialImages = getEditorialImages(site.id);

  return (
    <div className="pt-6">
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
          {isEn ? "Buying guides" : "Guides d'achat"}
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          {isEn
            ? `Practical methods to choose with confidence on ${site.brand.name} — regularly enriched.`
            : `Méthodes concrètes pour choisir sans se tromper sur ${site.brand.name} — enrichis régulièrement.`}
        </p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-2 md:px-8">
        {allGuides.length === 0 ? (
          <p className="text-[var(--muted)] md:col-span-2">
            {isEn
              ? "Guides are being prepared for this site."
              : "Les guides de ce site sont en préparation."}
          </p>
        ) : (
          allGuides.map((guide) => {
            const copy = isEn ? guide.en : guide.fr;
            const productImages =
              site.id === "ecoflow"
                ? resolveArticleProductImages(guide.slug, ecoflowMap)
                : [];
            const coverImages = guide.imageSrc
              ? [
                  {
                    src: guide.imageSrc,
                    altFr: copy.title,
                    altEn: copy.title,
                    credit: guide.imageCredit || site.brand.name,
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
                  packshot={Boolean(guide.imageSrc) === false && coverImages.length > 0}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-[var(--heading)]">
                    {copy.title}
                  </h2>
                  <p className="mt-3 text-sm text-[var(--muted)]">{copy.subtitle}</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
