import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { redirect } from "@/i18n/navigation";
import { ArticleCover } from "@/components/ArticleCover";
import { getEditorialImages } from "@/data/images";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import { resolveArticleProductImages } from "@/lib/article-images";
import { getGuideCopy } from "@/data/articles";
import { CASINOS_CRYPTO_GUIDE_SLUG_ORDER } from "@/data/casinos-crypto-guides";
import { resolveAllGuides } from "@/lib/guides/refresh";
import { pickLocalized, usesEnglishFallback } from "@/i18n/locales";
import { siteLocaleAlternates } from "@/lib/seo";
import { siteMainGuideSlug } from "@/sites/copy";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { KwankoBanner } from "@/components/KwankoBanner";
import { GuideMark } from "@/components/GuideMark";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";

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
  const em = site.id === "euromillions";
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
      : em
        ? pickLocalized(locale, {
            fr: "Guides EuroMillions : rangs, probabilités, My Million",
            en: "EuroMillions guides: tiers, odds, My Million",
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
      : em
        ? pickLocalized(locale, {
            fr: `Guides ${brand} : lire un résultat, rangs de gains, probabilités, My Million et jeu responsable — 18+.`,
            en: `${brand} guides: reading a result, prize tiers, odds, My Million and responsible play — 18+.`,
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
  const casino = site.id === "casinos-crypto";
  const em = site.id === "euromillions";
  const allGuidesRaw = await resolveAllGuides(site.id);
  const allGuides = casino
    ? [...allGuidesRaw].sort((a, b) => {
        const order = CASINOS_CRYPTO_GUIDE_SLUG_ORDER as readonly string[];
        const ia = order.indexOf(a.slug);
        const ib = order.indexOf(b.slug);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      })
    : allGuidesRaw;
  const editorialImages = getEditorialImages(site.id);

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
            : em
              ? pickLocalized(locale, {
                  fr: "Guides EuroMillions",
                  en: "EuroMillions guides",
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
                fr: `Stake, dépôt crypto, USDT, KYC, bonus, jeu responsable — 18+.`,
                en: `Stake, crypto deposits, USDT, KYC, bonuses, responsible play — 18+.`,
                it: `Stake, deposito crypto, USDT, KYC, bonus, gioco responsabile — 18+.`,
                es: `Stake, depósito crypto, USDT, KYC, bonus, juego responsable — 18+.`,
                pt: `Stake, depósito crypto, USDT, KYC, bónus, jogo responsável — 18+.`,
                de: `Stake, Krypto-Einzahlung, USDT, KYC, Boni, verantwortungsvolles Spiel — 18+.`,
              })
            : em
              ? pickLocalized(locale, {
                  fr: "Rangs de gains, probabilités, My Million et jeu responsable — sans promesse de méthode. 18+.",
                  en: "Prize tiers, odds, My Million and responsible play — with no promised system. 18+.",
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
        {siteIsEuroMillions(site) ? (
          <div className="mt-6">
            <GameToolsNav gameId="euromillions" />
          </div>
        ) : null}
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
                  <h2 className="flex items-start gap-2.5 text-xl font-semibold text-[var(--heading)]">
                    {em ? <GuideMark slug={guide.slug} size={28} /> : null}
                    {copy.title}
                  </h2>
                  <p className="mt-3 text-sm text-[var(--muted)]">{copy.subtitle}</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
      <KwankoBanner
        desktop={KWANKO_SLOTS.bienvenue.desktop}
        mobile={KWANKO_SLOTS.bienvenue.mobile}
        className="mt-8"
      />
    </div>
  );
}
