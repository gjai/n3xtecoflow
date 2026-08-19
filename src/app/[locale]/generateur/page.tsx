import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlashGridGenerator } from "@/components/FlashGridGenerator";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { Link } from "@/i18n/navigation";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "generator" });
  return {
    title: t("pageTitle"),
    description: t("pageMeta"),
    alternates: await siteLocaleAlternates(locale, "/generateur"),
  };
}

export default async function GenerateurPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("generator");

  return (
    <main className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
        {t("eyebrow")}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        {t("pageTitle")}
      </h1>
      <div className="mt-4">
        <GameToolsNav gameId="euromillions" />
      </div>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("pageLead")}</p>
      <div className="mt-10">
        <FlashGridGenerator />
      </div>
      <p className="mt-8">
        <Link
          href="/tirages#simulateur"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          {t("simulatorCta")} →
        </Link>
      </p>
      <KwankoBanner
        desktop={KWANKO_SLOTS.euromillions.desktop}
        mobile={KWANKO_SLOTS.euromillions.mobile}
        className="mt-8"
      />
    </main>
  );
}
