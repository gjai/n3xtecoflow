import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertsEngagement } from "@/components/AlertsEngagement";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "alerts" });
  return {
    title: t("pageTitle"),
    description: t("pageMeta"),
    alternates: await siteLocaleAlternates(locale, "/alerte-email"),
  };
}

export default async function AlerteEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status } = await searchParams;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();
  const t = await getTranslations("alerts");

  const banner =
    status === "confirmed"
      ? t("confirmOk")
      : status === "confirm_error"
        ? t("confirmBad")
        : status === "unsubscribed"
          ? t("unsubOk")
          : null;

  return (
    <main className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        {t("pageTitle")}
      </h1>
      <div className="mt-4">
        <GameToolsNav gameId="euromillions" />
      </div>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("pageLead")}</p>
      {banner ? (
        <p className="mt-6 border border-[var(--line)] bg-[var(--surface)] p-4 text-sm text-[var(--heading)]">
          {banner}
        </p>
      ) : null}
      <KwankoBanner
        desktop={KWANKO_SLOTS.bienvenue.desktop}
        mobile={KWANKO_SLOTS.bienvenue.mobile}
        className="mt-8"
      />
      <AlertsEngagement />
    </main>
  );
}
