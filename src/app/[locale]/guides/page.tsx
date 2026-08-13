import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { redirect } from "@/i18n/navigation";
import { ArticleCover } from "@/components/ArticleCover";
import { getEditorialImages } from "@/data/images";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import { resolveArticleProductImages } from "@/lib/article-images";
import { getGuideCopy } from "@/data/articles";
import { resolveAllGuides } from "@/lib/guides/refresh";
import { pickLocalized, usesEnglishFallback } from "@/i18n/locales";
import { siteLocaleAlternates } from "@/lib/seo";
import { siteMainGuideSlug } from "@/sites/copy";
import { getCurrentSite } from "@/sites/server";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getCurrentSite();
  const brand = site.brand.name;
  const casino = site.id === "casinos-crypto";
  return {
    title: casino
      ? pickLocalized(locale, {
          fr: "Guides casino crypto & Stake",
          en: "Crypto casino & Stake guides",
          it: "Guide casino crypto e Stake",
          es: "Guías casino crypto y Stake",
          pt: "Guias casino crypto e Stake",
          de: "Krypto-Casino- & Stake-Guides",
        })
      : pickLocalized(locale, {
          fr: "Guides d'achat",
          en: "Buying guides",
          it: "Guide all'acquisto",
          es: "Guías de compra",
          pt: "Guias de compra",
          de: "Kaufguides",
        }),
    description: casino
      ? pickLocalized(locale, {
          fr: `Guides ${brand} : Stake casino en ligne, Crypto.com, VPN — 18+, jeu responsable.`,
          en: `${brand} guides: Stake online casino, Crypto.com, VPN — 18+, play responsibly.`,
          it: `Guide ${brand}: casino Stake, Crypto.com, VPN — 18+, gioco responsabile.`,
          es: `Guías ${brand}: casino Stake, Crypto.com, VPN — 18+, juego responsable.`,
          pt: `Guias ${brand}: casino Stake, Crypto.com, VPN — 18+, jogo responsável.`,
          de: `${brand}-Guides: Stake Online-Casino, Crypto.com, VPN — 18+, verantwortungsvoll spielen.`,
        })
      : pickLocalized(locale, {
          fr: `Guides d'achat ${brand} : critères, comparatifs et checklists concrètes.`,
          en: `Buying guides for ${brand}: criteria, comparisons and practical checklists.`,
          it: `Guide ${brand}: criteri, confronti e checklist pratiche.`,
          es: `Guías ${brand}: criterios, comparativas y checklists prácticas.`,
          pt: `Guias ${brand}: critérios, comparativos e checklists práticas.`,
          de: `Guides für ${brand}: Kriterien, Vergleiche und praktische Checklisten.`,
        }),
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
  const isEn = usesEnglishFallback(locale);

  // Thèmes flat : un seul guide → page guide directement
  const mainGuide = siteMainGuideSlug(site.id);
  if (mainGuide) {
    redirect({ href: `/guides/${mainGuide}`, locale });
  }

  const ecoflowMap = await getEcoflowEntriesMap();
  const allGuides = await resolveAllGuides(site.id);
  const editorialImages = getEditorialImages(site.id);
  const casino = site.id === "casinos-crypto";

  return (
    <div className="pt-6">
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
          {casino
            ? pickLocalized(locale, {
                fr: "Guides casino crypto & Stake",
                en: "Crypto casino & Stake guides",
                it: "Guide casino crypto e Stake",
                es: "Guías casino crypto y Stake",
                pt: "Guias casino crypto e Stake",
                de: "Krypto-Casino- & Stake-Guides",
              })
            : pickLocalized(locale, {
                fr: "Guides d'achat",
                en: "Buying guides",
                it: "Guide all'acquisto",
                es: "Guías de compra",
                pt: "Guias de compra",
                de: "Kaufguides",
              })}
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          {casino
            ? pickLocalized(locale, {
                fr: `Stake, Crypto.com et VPN : parcours clair avant de jouer — 18+, jeu responsable.`,
                en: `Stake, Crypto.com and VPN: a clear path before you play — 18+, play responsibly.`,
                it: `Stake, Crypto.com e VPN: percorso chiaro prima di giocare — 18+, gioco responsabile.`,
                es: `Stake, Crypto.com y VPN: recorrido claro antes de jugar — 18+, juego responsable.`,
                pt: `Stake, Crypto.com e VPN: percurso claro antes de jogar — 18+, jogo responsável.`,
                de: `Stake, Crypto.com und VPN: klarer Weg vor dem Spielen — 18+, verantwortungsvoll spielen.`,
              })
            : pickLocalized(locale, {
                fr: `Méthodes concrètes pour choisir sans se tromper sur ${site.brand.name} — enrichis régulièrement.`,
                en: `Practical methods to choose with confidence on ${site.brand.name} — regularly enriched.`,
                it: `Metodi concreti per scegliere con sicurezza su ${site.brand.name} — aggiornati regolarmente.`,
                es: `Métodos concretos para elegir con confianza en ${site.brand.name} — enriquecidos con regularidad.`,
                pt: `Métodos concretos para escolher com confiança em ${site.brand.name} — enriquecidos regularmente.`,
                de: `Praktische Methoden für sichere Entscheidungen auf ${site.brand.name} — regelmäßig erweitert.`,
              })}
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
            const copy = getGuideCopy(guide, locale);
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
                  packshot={
                    Boolean(guide.imageSrc) === false && coverImages.length > 0
                  }
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
