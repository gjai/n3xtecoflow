import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { notFound } from "next/navigation";
import { AffiliateOfferButton } from "@/components/AffiliateOfferButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Illiko — Jeux instantanés FDJ",
    description:
      "Découvrez les jeux à gratter Illiko de la FDJ : Astro, Cash, Millionnaire, Mega Mots Croisés et bien plus. Tentez votre chance en ligne.",
    alternates: await siteLocaleAlternates(locale, "/jeux/illiko"),
  };
}

export default async function IllikoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const affiliateUrl =
    process.env.FDJ_AFFILIATE_URL_ILLIKO?.trim() ||
    "https://www.fdj.fr/jeux-instantanes";

  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-14 md:px-8 md:pt-20">
      <Link
        href="/jeux"
        className="text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        ← Tous les jeux
      </Link>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        Illiko — Jeux instantanés
      </h1>
      <p className="mt-4 text-[var(--fg)]">
        Les jeux Illiko de la FDJ sont des jeux à gratter disponibles en ligne
        et en point de vente. Astro, Cash, Millionnaire, Mega Mots Croisés,
        Banco… des dizaines de jeux vous attendent avec des gains instantanés
        pouvant atteindre plusieurs millions d&apos;euros.
      </p>
      <p className="mt-3 text-[var(--fg)]">
        Grattez en ligne depuis votre ordinateur ou votre smartphone et
        découvrez immédiatement si vous avez gagné.
      </p>
      <div className="mt-8">
        <AffiliateOfferButton
          href={affiliateUrl}
          tracked
          label="Jouer sur Illiko →"
          className="min-h-12"
        />
      </div>
      <KwankoBanner
        desktop={KWANKO_SLOTS.illiko?.desktop || KWANKO_SLOTS.bienvenue.desktop}
        mobile={KWANKO_SLOTS.illiko?.mobile || KWANKO_SLOTS.bienvenue.mobile}
        className="mt-8"
      />
      <p className="mt-8 text-xs text-[var(--muted)]">
        Site indépendant · 18+ · Les jeux de grattage comportent des risques :
        endettement, isolement, dépendance. Appelez le 09 74 75 13 13 (appel
        non surtaxé).
      </p>
    </main>
  );
}
