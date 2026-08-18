import { intlLocale } from "@/i18n/locales";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { AdSenseUnit } from "@/components/AdSenseUnit";
import { EuroMillionsOffersBlock } from "@/components/EuroMillionsOffersBlock";
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
  getDrawByDate,
  readEuroMillionsStore,
} from "@/lib/euromillions/store";

export const revalidate = 600;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; date: string }>;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const t = await getTranslations({ locale, namespace: "draws" });
  const pretty = formatDate(date, locale);
  return {
    title: t("drawOf", { date: pretty }),
    description: t("drawMeta", { date: pretty }),
    alternates: await siteLocaleAlternates(locale, `/tirages/${date}`),
    robots:
      locale === "fr" || locale === "en"
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
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
  const draw = getDrawByDate(store, date);
  if (!draw?.numbers?.length || !draw.stars?.length) notFound();

  const jackpot = formatMoney(draw.jackpotEur, locale);
  const prettyDate = formatDate(draw.date, locale);
  const title = t("drawOf", { date: prettyDate });
  const description = t("drawMeta", { date: prettyDate });
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
          {t("drawOf", { date: prettyDate })}
        </h1>
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

        <div className="mt-8">
          <AdSenseUnit label={homeT("adsLabel")} />
        </div>

        {draw.prizeTiers && draw.prizeTiers.length > 0 ? (
          <div className="mt-8">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
              {t("prizesTitle")}
            </h2>
            <div className="mt-4 overflow-x-auto border border-[var(--line)]">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead className="bg-[var(--surface)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                  <tr>
                    <th className="px-3 py-2 font-medium">{t("prizeRank")}</th>
                    <th className="px-3 py-2 font-medium">{t("prizeAmount")}</th>
                    <th className="px-3 py-2 font-medium">{t("prizeWinners")}</th>
                  </tr>
                </thead>
                <tbody>
                  {draw.prizeTiers.map((tier, i) => (
                    <tr
                      key={`${tier.rank}-${i}`}
                      className="border-t border-[var(--line)]"
                    >
                      <td className="px-3 py-2 font-semibold text-[var(--heading)]">
                        {tier.rank}
                      </td>
                      <td className="px-3 py-2 text-[var(--heading)]">
                        {formatMoney(tier.amountEur, locale) || "—"}
                      </td>
                      <td className="px-3 py-2 text-[var(--muted)]">
                        {tier.winners}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {draw.prizeTiersEtoilePlus &&
            draw.prizeTiersEtoilePlus.length > 0 ? (
              <>
                <h2 className="mt-10 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
                  {t("prizesEtoilePlus")}
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {t("prizesEtoilePlusHelp")}
                </p>
                <div className="mt-4 overflow-x-auto border border-[var(--line)]">
                  <table className="w-full min-w-[320px] text-left text-sm">
                    <thead className="bg-[var(--surface)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                      <tr>
                        <th className="px-3 py-2 font-medium">
                          {t("prizeRank")}
                        </th>
                        <th className="px-3 py-2 font-medium">
                          {t("prizeAmount")}
                        </th>
                        <th className="px-3 py-2 font-medium">
                          {t("prizeWinners")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {draw.prizeTiersEtoilePlus.map((tier, i) => (
                        <tr
                          key={`eplus-${tier.rank}-${i}`}
                          className="border-t border-[var(--line)]"
                        >
                          <td className="px-3 py-2 font-semibold text-[var(--heading)]">
                            {tier.rank}
                          </td>
                          <td className="px-3 py-2 text-[var(--heading)]">
                            {formatMoney(tier.amountEur, locale) || "—"}
                          </td>
                          <td className="px-3 py-2 text-[var(--muted)]">
                            {tier.winners}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
            <p className="mt-4">
              <Link
                href={`/tirages?date=${draw.date}#simulateur`}
                className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
              >
                {t("simulatorCta")}
              </Link>
            </p>
          </div>
        ) : (
          <p className="mt-6">
            <Link
              href={`/tirages?date=${draw.date}#simulateur`}
              className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
            >
              {t("simulatorCta")}
            </Link>
          </p>
        )}

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
      <EuroMillionsOffersBlock site={site} locale={locale} variant="compact" />
    </>
  );
}
