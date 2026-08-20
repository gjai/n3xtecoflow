import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

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
    robots: { index: false, follow: true },
    alternates: await siteLocaleAlternates(locale, "/tirages"),
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
  permanentRedirect(`/${locale}/tirages#generateur`);
}
