import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { notFound } from "next/navigation";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "PMU — Paris hippiques et sportifs",
    description:
      "Pariez sur les courses hippiques, le football, le tennis et bien plus avec PMU. Cotes, pronostics et résultats en direct.",
    alternates: await siteLocaleAlternates(locale, "/jeux/pmu"),
  };
}

export default async function PmuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const affiliateUrl =
    process.env.PMU_AFFILIATE_URL?.trim() || "https://www.pmu.fr";

  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-14 md:px-8 md:pt-20">
      <Link
        href="/jeux"
        className="text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        ← Tous les jeux
      </Link>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        PMU — Paris hippiques et sportifs
      </h1>
      <p className="mt-4 text-[var(--fg)]">
        Le PMU est le premier opérateur de paris hippiques en Europe. Pariez sur
        le Quinté+, le Tiercé, les courses en direct, mais aussi sur le
        football, le tennis, le basketball et des centaines d&apos;événements
        sportifs.
      </p>
      <p className="mt-3 text-[var(--fg)]">
        Consultez les cotes, les pronostics et suivez les résultats en temps
        réel depuis votre smartphone ou votre ordinateur.
      </p>
      <div className="mt-8">
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--accent-ink)]"
        >
          Parier sur PMU →
        </a>
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
