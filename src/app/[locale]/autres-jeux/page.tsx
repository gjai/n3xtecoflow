import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/components/JsonLd";
import { siteLocaleAlternates } from "@/lib/seo";
import {
  EXTERNAL_GAMES_NAV,
  OTHER_GAMES_HUB_HREF,
  externalGameLabel,
} from "@/lib/fdj-games/nav";
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
    title: t("otherHubTitle"),
    description: t("otherHubMeta"),
    alternates: await siteLocaleAlternates(locale, OTHER_GAMES_HUB_HREF),
  };
}

export default async function AutresJeuxHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("games");
  const siteUrl = `https://${site.primaryHost}`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.brand.name, url: `${siteUrl}/${locale}` },
          {
            name: t("otherHubTitle"),
            url: `${siteUrl}/${locale}${OTHER_GAMES_HUB_HREF}`,
          },
        ])}
      />
      <JsonLd
        data={itemListJsonLd({
          name: t("otherHubTitle"),
          description: t("otherHubMeta"),
          url: `${siteUrl}/${locale}${OTHER_GAMES_HUB_HREF}`,
          items: EXTERNAL_GAMES_NAV.map((game) => ({
            name: externalGameLabel(game, locale),
            url: `${siteUrl}/${locale}${game.href}`,
          })),
        })}
      />
      <main className="pb-16">
        <div className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-20">
          <Link
            href="/"
            className="text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            ← {t("backHome")}
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            {t("otherHubEyebrow")}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
            {t("otherHubTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            {t("otherHubLead")}
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {EXTERNAL_GAMES_NAV.map((game) => (
              <li key={game.id}>
                <Link
                  href={game.href}
                  className="flex h-full flex-col border border-[var(--line)] bg-[var(--surface)] px-5 py-6 hover:border-[var(--accent)]"
                >
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
                    {externalGameLabel(game, locale)}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                    {t(`otherCard.${game.id}`)}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-[var(--accent)]">
                    {t("otherSeeCta")} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl text-xs text-[var(--muted)]">
            {t("disclaimer")}
          </p>
        </div>
        <KwankoBanner
          desktop={KWANKO_SLOTS.bienvenue.desktop}
          mobile={KWANKO_SLOTS.bienvenue.mobile}
          className="mt-8"
        />
      </main>
    </>
  );
}
