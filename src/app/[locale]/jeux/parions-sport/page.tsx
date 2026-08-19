import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { notFound } from "next/navigation";

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

  const affiliateUrl =
    process.env.PARIONS_SPORT_AFFILIATE_URL?.trim() ||
    "https://www.enligne.parionssport.fdj.fr";

  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-14 md:px-8 md:pt-20">
      <Link
        href="/jeux"
        className="text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        ← Tous les jeux
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
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--accent-ink)]"
        >
          Parier sur Parions Sport →
        </a>
      </div>
      <p className="mt-8 text-xs text-[var(--muted)]">
        Site indépendant · 18+ · Les paris comportent des risques :
        endettement, isolement, dépendance. Appelez le 09 74 75 13 13 (appel
        non surtaxé).
      </p>
    </main>
  );
}
