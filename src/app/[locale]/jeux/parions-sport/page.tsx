import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { notFound } from "next/navigation";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";
import { AffiliateOfferButton } from "@/components/AffiliateOfferButton";
import { OTHER_GAMES_HUB_HREF } from "@/lib/fdj-games/nav";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Parions Sport — Paris sportifs FDJ",
    description:
      "Pariez sur le football, le tennis, le rugby et des centaines de sports avec Parions Sport en Ligne (FDJ). Cotes et résultats en direct.",
    alternates: await siteLocaleAlternates(locale, "/jeux/parions-sport"),
  };
}

export default async function ParionsSportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();
  const t = await getTranslations("games");

  const affiliateUrl =
    process.env.PARIONS_SPORT_AFFILIATE_URL?.trim() ||
    "https://www.enligne.parionssport.fdj.fr";

  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-14 md:px-8 md:pt-20">
      <Link
        href={OTHER_GAMES_HUB_HREF}
        className="text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        ← {t("otherBack")}
      </Link>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        Parions Sport — Paris sportifs FDJ
      </h1>
      <p className="mt-4 text-[var(--fg)]">
        Parions Sport en Ligne est l&apos;offre de paris sportifs de la FDJ.
        Football, tennis, rugby, basketball, MMA… pariez sur des milliers
        d&apos;événements avec des cotes compétitives et des offres de
        bienvenue.
      </p>
      <p className="mt-3 text-[var(--fg)]">
        Suivez les matchs en direct, combinez vos paris et tentez de remporter
        des gains importants.
      </p>
      <div className="mt-8">
        <AffiliateOfferButton
          href={affiliateUrl}
          tracked
          label="Parier sur Parions Sport →"
          className="min-h-12"
        />
      </div>
      <KwankoBanner
        desktop={KWANKO_SLOTS.bienvenue.desktop}
        mobile={KWANKO_SLOTS.bienvenue.mobile}
        className="mt-8"
      />
      <p className="mt-8 text-xs text-[var(--muted)]">
        Site indépendant · 18+ · Les paris comportent des risques :
        endettement, isolement, dépendance. Appelez le 09 74 75 13 13 (appel
        non surtaxé).
      </p>
    </main>
  );
}
