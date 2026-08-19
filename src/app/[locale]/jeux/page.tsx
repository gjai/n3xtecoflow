import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { FdjCompanionGamesBlock } from "@/components/FdjCompanionGamesBlock";
import { GameLabel } from "@/components/GameMark";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { LOTTERY_GAMES_NAV, lotteryGameLabel } from "@/lib/fdj-games/nav";
import { gameRailStyle } from "@/lib/fdj-games/identity";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/components/JsonLd";
import { siteLocaleAlternates } from "@/lib/seo";
import { readFdjGamesStore } from "@/lib/fdj-games/store";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";

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
  const siteUrl = `https://${site.primaryHost}`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.brand.name, url: `${siteUrl}/${locale}` },
          { name: t("hubTitle"), url: `${siteUrl}/${locale}/jeux` },
        ])}
      />
      <JsonLd
        data={itemListJsonLd({
          name: t("hubTitle"),
          description: t("hubMeta"),
          url: `${siteUrl}/${locale}/jeux`,
          items: LOTTERY_GAMES_NAV.map((game) => ({
            name: lotteryGameLabel(game, locale),
            url: `${siteUrl}/${locale}${game.href === "/" ? "" : game.href}`,
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
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
          {t("hubTitle")}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("hubLead")}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {LOTTERY_GAMES_NAV.map((game) => (
            <li
              key={game.id}
              className="border border-[var(--line)] bg-[var(--surface)] p-4"
              style={gameRailStyle(game.id)}
            >
              <Link
                href={game.href}
                className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)] hover:text-[var(--accent)]"
              >
                <GameLabel gameId={game.id} size={24}>
                  {lotteryGameLabel(game, locale)}
                </GameLabel>
              </Link>
              <div className="mt-3">
                <GameToolsNav gameId={game.id} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <KwankoBanner
        desktop={KWANKO_SLOTS.bienvenue.desktop}
        mobile={KWANKO_SLOTS.bienvenue.mobile}
        className="mt-8"
      />
      <FdjCompanionGamesBlock store={store} locale={locale} variant="hub" />
    </main>
    </>
  );
}
