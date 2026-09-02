import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "simulator" });
  return {
    title: t("title"),
    description: t("meta"),
    alternates: await siteLocaleAlternates(locale, "/tirages"),
  };
}

export default async function SimulateurPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { locale } = await params;
  const { date } = await searchParams;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
    permanentRedirect(`/${locale}/tirages/${date.trim()}`);
  }
  permanentRedirect(`/${locale}/tirages#simulateur`);
}
