import { intlLocale, pickLocalized } from "@/i18n/locales";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";
import { DrawPrizeTable } from "@/components/DrawPrizeTable";
import { RecentEuroMillionsDraws } from "@/components/RecentEuroMillionsDraws";
import {
  JsonLd,
  breadcrumbJsonLd,
  lotteryDrawJsonLd,
} from "@/components/JsonLd";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { DrawBalls } from "@/components/EuroMillionsHome";
import { GameMark } from "@/components/GameMark";
import { euroMillionsBrief } from "@/lib/lottery/brief";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { GAME_IDENTITY } from "@/lib/fdj-games/identity";
import {
  euroMillionsAdjacentDraws,
  euroMillionsAdjacentLabel,
  euroMillionsComboText,
  euroMillionsDrawPageDescription,
  euroMillionsDrawPageTitle,
} from "@/lib/euromillions/draw-seo";
import {
  isEuroMillionsDrawPublished,
  readEuroMillionsStore,
  resolveDrawPage,
} from "@/lib/euromillions/store";
import { formatEuroMillionsLongDate } from "@/lib/euromillions/datetime";
import { sequentialDrawId } from "@/lib/euromillions/draw-id";

export const revalidate = 600;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; date: string }>;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const pretty = formatDate(date, locale);
  const store = await readEuroMillionsStore();
  const draw = resolveDrawPage(store, date);
  const published = isEuroMillionsDrawPublished(draw);
  const title = euroMillionsDrawPageTitle(locale, pretty, draw);
  const description = euroMillionsDrawPageDescription(locale, pretty, draw);
  return {
    title,
    description,
    alternates: await siteLocaleAlternates(locale, `/tirages/${date}`),
    robots: {
      index: locale === "fr",
      follow: true,
    },
    ...(published
      ? {
          openGraph: {
            title,
            description,
            images: [
              {
                url: `https://euromillions-resultats.fr/api/euromillions/share-image?date=${date}`,
                width: 1200,
                height: 630,
              },
            ],
          },
        }
      : {}),
  };
}

function formatDate(iso: string, locale: string) {
  return formatEuroMillionsLongDate(iso, locale);
}

function formatMoney(amount: number | null | undefined, locale: string) {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: amount < 10 ? 2 : 0,
  }).format(amount);
}

export default async function TirageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; date: string }>;
}) {
  const { locale, date } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("draws");
  const homeT = await getTranslations("home");
  const store = await readEuroMillionsStore();
  const draw = resolveDrawPage(store, date);
  if (!draw) notFound();
  const published = isEuroMillionsDrawPublished(draw);

  const jackpot = formatMoney(draw.jackpotEur, locale);
  const prettyDate = formatDate(draw.date, locale);
  const drawNo = sequentialDrawId(draw.drawId);
  const combo = published
    ? euroMillionsComboText(draw.numbers, draw.stars)
    : "";
  const { newer, older } = euroMillionsAdjacentDraws(store.draws, draw.date);
  const hasEuropeWinners = Boolean(
    draw.prizeTiers?.some((tier) => tier.winnersEurope != null),
  );
  const title = euroMillionsDrawPageTitle(locale, prettyDate, draw);
  const description = euroMillionsDrawPageDescription(locale, prettyDate, draw);
  const siteUrl = `https://${site.primaryHost}`;

  return (
    <>
      <JsonLd
        data={lotteryDrawJsonLd({
          siteUrl,
          locale,
          date: draw.date,
          title,
          description,
          numbers: draw.numbers,
          stars: draw.stars,
          jackpotEur: draw.jackpotEur,
          myMillionCode: draw.myMillionCode,
          publisherName: site.brand.name,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.brand.name, url: `${siteUrl}/${locale}` },
          { name: t("title"), url: `${siteUrl}/${locale}/tirages` },
          { name: title, url: `${siteUrl}/${locale}/tirages/${draw.date}` },
        ])}
      />
      <main className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <Link
          href="/tirages"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← {t("back")}
        </Link>
        <GameToolsNav gameId="euromillions" />
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
          <span className="block">
            {published
              ? t("drawOf", { date: prettyDate })
              : t("pendingTitle", { date: prettyDate })}
          </span>
          {combo ? (
            <span className="mt-3 block font-mono text-2xl font-semibold tabular-nums tracking-wide md:text-3xl">
              {combo}
            </span>
          ) : null}
        </h1>
        {drawNo ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t("drawNumber", { id: String(drawNo) })}
          </p>
        ) : null}
        {published ? (
          <>
            {(() => {
              const brief = euroMillionsBrief(draw, locale, prettyDate, jackpot);
              return (
                <>
                  <p className="mt-4 text-[var(--muted)]">{brief.lead}</p>
                  {brief.paragraphs.map((p) => (
                    <p key={p.slice(0, 28)} className="mt-3 text-[var(--muted)]">
                      {p}
                    </p>
                  ))}
                </>
              );
            })()}
            {jackpot ? (
              <p className="mt-3 text-[var(--muted)]">
                {t("jackpot")} · {jackpot}
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-4 text-[var(--muted)]">{t("pendingLead")}</p>
        )}

        {published ? (
        <div className="mt-8 border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
          <DrawBalls
            draw={draw}
            ballsLabel={homeT("ballsLabel")}
            starsLabel={homeT("starsLabel")}
          />
          {draw.myMillionCode ? (
            <div className="mt-6 border-t border-[var(--line)] pt-6">
              <p
                className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]"
                style={{ color: GAME_IDENTITY["my-million"].accent }}
              >
                <GameMark gameId="my-million" size={16} />
                {t("myMillion")}
              </p>
              <p
                className="mt-2 font-mono text-xl tracking-wide"
                style={{ color: GAME_IDENTITY["my-million"].accent }}
              >
                {draw.myMillionCode}
              </p>
              {draw.myMillionLocation ? (
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {t("myMillionLocation")} · {draw.myMillionLocation}
                </p>
              ) : null}
              <p className="mt-3">
                <Link
                  href="/my-million"
                  className="text-sm font-semibold text-[var(--accent)] hover:underline"
                >
                  {t("myMillionArchive")} →
                </Link>
              </p>
            </div>
          ) : null}
        </div>
        ) : (
          <div className="mt-8 border border-[var(--line)] bg-[var(--surface)] p-6 text-[var(--muted)]">
            {t("pendingLead")}
          </div>
        )}


        {draw.prizeTiers && draw.prizeTiers.length > 0 ? (
          <div>
            <DrawPrizeTable
              tiers={draw.prizeTiers}
              extraTiers={draw.prizeTiersEtoilePlus}
              locale={locale}
              title={t("prizesTitle")}
              extraTitle={t("prizesEtoilePlus")}
              extraHelp={t("prizesEtoilePlusHelp")}
              rankLabel={t("prizeRank")}
              amountLabel={t("prizeAmount")}
              winnersLabel={
                hasEuropeWinners ? t("winnersFr") : t("prizeWinners")
              }
              winnersEuropeLabel={
                hasEuropeWinners ? t("winnersEu") : undefined
              }
            />
            <p className="mt-4">
              <Link
                href="/tirages#simulateur"
                className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
              >
                {t("simulatorCta")}
              </Link>
            </p>
          </div>
        ) : (
          <p className="mt-6">
            <Link
              href="/tirages#simulateur"
              className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
            >
              {t("simulatorCta")}
            </Link>
          </p>
        )}

        <RecentEuroMillionsDraws
          draws={store.draws.filter((item) => item.date !== draw.date)}
          locale={locale}
          title={t("lastFiveTitle")}
        />
        {newer || older ? (
          <nav
            className="mt-8 flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:justify-between"
            aria-label={pickLocalized(locale, {
              fr: "Tirages voisins",
              en: "Adjacent draws",
            })}
          >
            {older ? (
              <Link
                href={`/tirages/${older.date}`}
                className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
              >
                <span className="block text-xs uppercase tracking-[0.14em]">
                  {pickLocalized(locale, {
                    fr: "Tirage précédent",
                    en: "Previous draw",
                  })}
                </span>
                <span className="mt-1 block font-semibold text-[var(--heading)]">
                  {euroMillionsAdjacentLabel(locale, older)}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link
                href={`/tirages/${newer.date}`}
                className="text-sm text-[var(--muted)] hover:text-[var(--accent)] sm:text-right"
              >
                <span className="block text-xs uppercase tracking-[0.14em]">
                  {pickLocalized(locale, {
                    fr: "Tirage suivant",
                    en: "Next draw",
                  })}
                </span>
                <span className="mt-1 block font-semibold text-[var(--heading)]">
                  {euroMillionsAdjacentLabel(locale, newer)}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}

        <p className="mt-6 text-xs text-[var(--muted)]">
          {t("source")} · {draw.source}
          {store.updatedAt
            ? ` · ${t("updated")} ${new Date(store.updatedAt).toLocaleString(intlLocale(locale))}`
            : ""}
        </p>
        <p className="mt-4">
          <Link
            href="/guides/toucher-un-gain-euromillions"
            className="text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            {t("claimCta")} →
          </Link>
        </p>
      </main>
      <KwankoBanner
        desktop={KWANKO_SLOTS.bienvenue.desktop}
        mobile={KWANKO_SLOTS.bienvenue.mobile}
      />
    </>
  );
}
