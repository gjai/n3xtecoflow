import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { FdjCompanionGamesBlock } from "@/components/FdjCompanionGamesBlock";
import { siteLocaleAlternates } from "@/lib/seo";
import { readFdjGamesStore } from "@/lib/fdj-games/store";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "games" });
  return {
    title: t("hubTitle"),
    description: t("hubMeta"),
    alternates: await siteLocaleAlternates(locale, "/jeux"),
  };
}

export default async function JeuxHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("games");
  const store = await readFdjGamesStore();

  return (
    <main className="pb-16">
      <div className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-20">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← {t("backHome")}
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
          {t("hubTitle")}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("hubLead")}</p>
        <p className="mt-4">
          <Link
            href="/tirages"
            className="text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            {t("emPrimaryCta")} →
          </Link>
        </p>
      </div>
      <FdjCompanionGamesBlock store={store} locale={locale} variant="hub" />
    </main>
  );
}
