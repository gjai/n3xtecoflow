import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AdSenseUnit } from "@/components/AdSenseUnit";
import { AlertsEngagement } from "@/components/AlertsEngagement";
import { AnjResponsibleStrip } from "@/components/AnjResponsibleStrip";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";
import { DrawPrizeTable } from "@/components/DrawPrizeTable";
import { SmartCover } from "@/components/SmartCover";
import { FdjCompanionGamesBlock } from "@/components/FdjCompanionGamesBlock";
import { GameMark } from "@/components/GameMark";
import { NextJackpotBanner } from "@/components/NextJackpotBanner";
import {
  EUROMILLIONS_CRESCENDO_GUIDE_SLUG,
  EUROMILLIONS_EURODREAMS_GUIDE_SLUG,
  EUROMILLIONS_KENO_GUIDE_SLUG,
  EUROMILLIONS_LOTO_GUIDE_SLUG,
  EUROMILLIONS_MAIN_GUIDE_SLUG,
  EUROMILLIONS_MY_MILLION_GUIDE_SLUG,
  EUROMILLIONS_READ_RESULTS_GUIDE_SLUG,
  EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG,
  EUROMILLIONS_SCHEDULE_GUIDE_SLUG,
  EUROMILLIONS_CLAIM_GUIDE_SLUG,
} from "@/data/euromillions-guides";
import { ResultsLivePoller } from "@/components/ResultsLivePoller";
import { getEditorialImages } from "@/data/images";
import { intlLocale, usesEnglishFallback } from "@/i18n/locales";
import type { EuroMillionsDraw, EuroMillionsStore } from "@/lib/euromillions/types";
import {
  formatEuroMillionsLongDate,
  euroMillionsResultPending,
} from "@/lib/euromillions/datetime";
import {
  lotteryFingerprint,
  anyLotteryResultPending,
} from "@/lib/euromillions/fingerprint";
import { getLatestDraw, isEuroMillionsDrawPublished } from "@/lib/euromillions/store";
import type { LotteryGameId } from "@/lib/fdj-games/nav";
import type { FdjGamesStore } from "@/lib/fdj-games/types";
import { GAME_IDENTITY } from "@/lib/fdj-games/identity";
import type { NewsArticle } from "@/lib/news/types";
import { isBlockedLotteryNewsSource, isEuroMillionsResultClone } from "@/lib/news/rss";
import type { SiteConfig } from "@/sites/types";

function formatMoney(amount: number | null | undefined, locale: string) {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string, locale: string) {
  return formatEuroMillionsLongDate(iso, locale);
}

const GUIDE_GAME: Partial<Record<string, LotteryGameId>> = {
  [EUROMILLIONS_MAIN_GUIDE_SLUG]: "euromillions",
  [EUROMILLIONS_LOTO_GUIDE_SLUG]: "loto",
  [EUROMILLIONS_EURODREAMS_GUIDE_SLUG]: "eurodreams",
  [EUROMILLIONS_KENO_GUIDE_SLUG]: "keno",
  [EUROMILLIONS_CRESCENDO_GUIDE_SLUG]: "crescendo",
  [EUROMILLIONS_MY_MILLION_GUIDE_SLUG]: "my-million",
};

export function DrawBalls({
  draw,
  ballsLabel,
  starsLabel,
  large = false,
  animate = false,
  compact = false,
}: {
  draw: EuroMillionsDraw;
  ballsLabel: string;
  starsLabel: string;
  large?: boolean;
  animate?: boolean;
  compact?: boolean;
}) {
  const size = large ? "lottery-ball--lg" : compact ? "lottery-ball--sm" : "";
  const ballClass = animate ? "draw-ball-in" : "";
  const balls = (
    <div
      className={
        compact ? "lottery-balls lottery-balls--compact" : "lottery-balls"
      }
    >
      {draw.numbers.map((n, i) => (
        <span
          key={`n-${n}`}
          className={`lottery-ball lottery-ball--main ${size} ${ballClass}`}
          style={
            animate
              ? { ["--ball-delay" as string]: `${420 + i * 75}ms` }
              : undefined
          }
        >
          {n}
        </span>
      ))}
      {draw.stars.map((n, i) => (
        <span
          key={`s-${n}`}
          className={`lottery-ball lottery-ball--bonus ${size} ${ballClass}`}
          style={
            animate
              ? {
                  ["--ball-delay" as string]: `${420 + (draw.numbers.length + i) * 75}ms`,
                }
              : undefined
          }
        >
          {n}
        </span>
      ))}
    </div>
  );
  if (compact) return balls;
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {ballsLabel}
        </p>
        <div className="lottery-balls">
          {draw.numbers.map((n, i) => (
            <span
              key={`n-${n}`}
              className={`lottery-ball lottery-ball--main ${size} ${ballClass}`}
              style={
                animate
                  ? { ["--ball-delay" as string]: `${420 + i * 75}ms` }
                  : undefined
              }
            >
              {n}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {starsLabel}
        </p>
        <div className="lottery-balls">
          {draw.stars.map((n, i) => (
            <span
              key={`s-${n}`}
              className={`lottery-ball lottery-ball--bonus ${size} ${ballClass}`}
              style={
                animate
                  ? {
                      ["--ball-delay" as string]: `${420 + (draw.numbers.length + i) * 75}ms`,
                    }
                  : undefined
              }
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function EuroMillionsHome({
  site,
  locale,
  store,
  fdjGames,
  latestNews = [],
}: {
  site: SiteConfig;
  locale: string;
  store: EuroMillionsStore;
  fdjGames: FdjGamesStore;
  latestNews?: NewsArticle[];
}) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tDraws = await getTranslations({ locale, namespace: "draws" });
  const newsT = await getTranslations({ locale, namespace: "news" });
  const latest = getLatestDraw(store);
  const published = isEuroMillionsDrawPublished(latest);
  const jackpot = latest ? formatMoney(latest.jackpotEur, locale) : null;
  const nextJackpot = formatMoney(store.nextJackpotEur, locale);
  const pending = euroMillionsResultPending({
    latestDate: latest?.date,
    nextDrawDate: store.nextDrawDate,
  });
  const livePending = anyLotteryResultPending(store, fdjGames);
  const brand = site.brand.name;
  const recentWinners = (store.myMillionWinners || []).slice(0, 4);
  const editorial = getEditorialImages(site.id);
  const isEn = usesEnglishFallback(locale);
  const news = latestNews.filter(
    (a) =>
      !isBlockedLotteryNewsSource({
        sourceName: a.sourceName,
        sourceUrl: a.sourceUrl,
        title: `${a.fr?.title || ""} ${a.en?.title || ""}`,
      }) &&
      !isEuroMillionsResultClone(
        `${a.fr?.title || ""} ${a.en?.title || ""} ${a.sourceName || ""}`,
      ),
  );

  return (
    <>
      <ResultsLivePoller
        enabled={livePending}
        fingerprint={lotteryFingerprint(store, fdjGames)}
      />
      <NextJackpotBanner
        nextDrawDate={store.nextDrawDate || null}
        nextJackpot={nextJackpot}
        pending={pending}
        locale={locale}
      />
      <section className="hero-grid relative overflow-hidden border-b border-[var(--line)]">
        <div className="hero-orbs hidden md:block" aria-hidden>
          <span className="hero-orb hero-orb-1" />
          <span className="hero-orb hero-orb-2" />
          <span className="hero-orb hero-orb-3" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1fr_1.05fr] md:items-center md:px-8 md:py-20">
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              {brand}
            </p>
            <h1 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--heading)] md:text-5xl">
              {published && latest
                ? t("headlineWithDate", {
                    date: formatDate(latest.date, locale),
                  })
                : t("headline")}
            </h1>
            {published && latest ? (
              <p className="mt-4 max-w-xl text-lg text-[var(--heading)]">
                {t("numbersCrawl", {
                  balls: latest.numbers.join(", "),
                  stars: latest.stars.join(", "),
                })}
              </p>
            ) : null}
            <p className="mt-4 max-w-lg text-[var(--muted)]">{t("subhead")}</p>
            <div className="reveal-delay mt-8 flex flex-wrap gap-3">
              <Link
                href="/tirages#simulateur"
                className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
              >
                {t("simulatorCta")}
              </Link>
              <Link
                href="/generateur"
                className="inline-flex min-h-11 items-center border border-[var(--line)] px-5 text-sm font-semibold text-[var(--heading)]"
              >
                {t("generatorCta")}
              </Link>
              <Link
                href="/tirages"
                className="inline-flex min-h-11 items-center border border-[var(--line)] px-5 text-sm font-semibold text-[var(--heading)]"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>

          <div
            id="dernier-tirage"
            className="reveal-delay-2 border border-[var(--line)] bg-[var(--surface)]/90 p-6 backdrop-blur md:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                  {t("latestTitle")}
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)] md:text-3xl">
                  {latest ? formatDate(latest.date, locale) : t("empty")}
                </p>
              </div>
              {jackpot ? (
                <p className="text-right text-sm text-[var(--muted)]">
                  {t("jackpotLabel")}
                  <br />
                  <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
                    {jackpot}
                  </span>
                </p>
              ) : null}
            </div>

            {latest ? (
              <div className="mt-6">
                <DrawBalls
                  draw={latest}
                  ballsLabel={t("ballsLabel")}
                  starsLabel={t("starsLabel")}
                  large
                  animate
                />
                {latest.myMillionCode ? (
                  <div className="mt-6 border-t border-[var(--line)] pt-5">
                    <p
                      className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]"
                      style={{ color: GAME_IDENTITY["my-million"].accent }}
                    >
                      <GameMark gameId="my-million" size={16} />
                      {t("myMillionLabel")}
                    </p>
                    <p
                      className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-wide"
                      style={{ color: GAME_IDENTITY["my-million"].accent }}
                    >
                      {latest.myMillionCode}
                    </p>
                    {latest.myMillionLocation ? (
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {t("myMillionLocation")} · {latest.myMillionLocation}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <DrawPrizeTable
                  tiers={latest.prizeTiers}
                  extraTiers={latest.prizeTiersEtoilePlus}
                  locale={locale}
                  title={tDraws("prizesTitle")}
                  extraTitle={tDraws("prizesEtoilePlus")}
                  extraHelp={tDraws("prizesEtoilePlusHelp")}
                  rankLabel={tDraws("prizeRank")}
                  amountLabel={tDraws("prizeAmount")}
                  winnersLabel={tDraws("prizeWinners")}
                  heading="h2"
                />
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href={`/tirages?date=${latest.date}#simulateur`}
                    className="inline-flex min-h-10 items-center bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-ink)]"
                  >
                    {t("simulatorCta")}
                  </Link>
                  <Link
                    href={`/tirages/${latest.date}`}
                    className="text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    {t("resultOf", { date: formatDate(latest.date, locale) })} →
                  </Link>
                  <Link
                    href="/my-million"
                    className="text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    {t("myMillionCta")} →
                  </Link>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-[var(--muted)]">{t("empty")}</p>
            )}

            {pending && latest ? (
              <p className="mt-6 text-sm text-[var(--muted)]">
                {t("pendingLatest", {
                  date: formatDate(latest.date, locale),
                })}
              </p>
            ) : null}

            {(store.nextDrawDate || nextJackpot) && !pending ? (
              <div className="mt-6 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">
                <Link
                  href="/prochain-tirage"
                  className="font-semibold text-[var(--heading)] hover:underline"
                >
                  {t("nextDrawLabel")}
                </Link>
                {store.nextDrawDate
                  ? ` · ${formatDate(store.nextDrawDate, locale)}`
                  : null}
                {nextJackpot ? ` · ${nextJackpot}` : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <AdSenseUnit label={t("adsLabel")} />
        <KwankoBanner
          desktop={KWANKO_SLOTS.bienvenueLarge.desktop}
          mobile={KWANKO_SLOTS.bienvenueLarge.mobile}
        />
      </div>

      <section className="border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-2 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
                {t("simulatorTeaserTitle")}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {t("simulatorTeaserText")}
              </p>
            </div>
            <Link
              href="/tirages#simulateur"
              className="inline-flex min-h-11 items-center border border-[var(--accent)] px-5 text-sm font-semibold text-[var(--heading)]"
            >
              {t("simulatorCta")} →
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
                {t("generatorTeaserTitle")}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {t("generatorTeaserText")}
              </p>
            </div>
            <Link
              href="/generateur"
              className="inline-flex min-h-11 items-center border border-[var(--accent)] px-5 text-sm font-semibold text-[var(--heading)]"
            >
              {t("generatorCta")} →
            </Link>
          </div>
        </div>
      </section>

      <AlertsEngagement variant="compact" />

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
                {t("guidesTitle")}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
                {t("guidesLead")}
              </p>
            </div>
            <Link
              href="/guides"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("allGuidesCta")} →
            </Link>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                EUROMILLIONS_MAIN_GUIDE_SLUG,
                EUROMILLIONS_LOTO_GUIDE_SLUG,
                EUROMILLIONS_EURODREAMS_GUIDE_SLUG,
                EUROMILLIONS_KENO_GUIDE_SLUG,
                EUROMILLIONS_CRESCENDO_GUIDE_SLUG,
                EUROMILLIONS_READ_RESULTS_GUIDE_SLUG,
                EUROMILLIONS_SCHEDULE_GUIDE_SLUG,
                EUROMILLIONS_CLAIM_GUIDE_SLUG,
                EUROMILLIONS_MY_MILLION_GUIDE_SLUG,
                EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG,
              ] as const
            ).map((slug) => {
              const gameId = GUIDE_GAME[slug];
              return (
              <li key={slug}>
                <Link
                  href={`/guides/${slug}`}
                  className="flex items-center gap-2 border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--heading)] hover:border-[var(--accent)]"
                  style={
                    gameId
                      ? { borderLeftWidth: 3, borderLeftColor: GAME_IDENTITY[gameId].accent }
                      : undefined
                  }
                >
                  {gameId ? <GameMark gameId={gameId} size={20} /> : null}
                  {t(`guideCard.${slug}`)}
                </Link>
              </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8">
        <KwankoBanner
          desktop={KWANKO_SLOTS.valorisation.desktop}
          mobile={KWANKO_SLOTS.valorisation.mobile}
        />
      </div>

      <FdjCompanionGamesBlock store={fdjGames} locale={locale} variant="home" />

      {news.length > 0 ? (
        <section className="border-b border-[var(--line)]">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                  {newsT("eyebrow")}
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)] md:text-3xl">
                  {t("latestNewsTitle")}
                </h2>
              </div>
              <Link
                href="/actualites"
                className="text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                {t("allNewsCta")} →
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {news.slice(0, 6).map((article) => {
                const copy = isEn ? article.en : article.fr;
                return (
                  <li key={article.slug}>
                    <Link
                      href={`/actualites/${article.slug}`}
                      className="group block overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
                    >
                      <SmartCover
                        src={article.imageSrc}
                        fallback={editorial.news}
                        locale={locale}
                        credit={article.imageCredit}
                        className="aspect-[16/9] w-full"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="p-4">
                        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)] group-hover:text-[var(--accent)]">
                          {copy.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                          {copy.excerpt}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {recentWinners.length > 0 ? (
        <section className="border-b border-[var(--line)] bg-[var(--bg)]">
          <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
                  style={{ color: GAME_IDENTITY["my-million"].accent }}
                >
                  <GameMark gameId="my-million" size={16} />
                  My Million
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
                  {t("winnersTitle")}
                </h2>
              </div>
              <Link
                href="/my-million"
                className="text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                {t("myMillionCta")} →
              </Link>
            </div>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {recentWinners.map((w) => (
                <li
                  key={w.sourceUrl}
                  className="border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
                >
                  <p className="text-sm font-semibold text-[var(--heading)]">
                    {w.location || t("locationUnknown")}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{w.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8">
        <KwankoBanner
          desktop={KWANKO_SLOTS.euromillionsSquare.desktop}
          mobile={KWANKO_SLOTS.euromillionsSquare.mobile}
        />
      </div>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("featuresTitle")}
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              { title: t("feature1Title"), text: t("feature1Text") },
              { title: t("feature2Title"), text: t("feature2Text") },
              { title: t("feature3Title"), text: t("feature3Text") },
            ].map((f) => (
              <div key={f.title}>
                <h3 className="font-semibold text-[var(--heading)]">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/tirages#simulateur"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("simulatorCta")} →
            </Link>
            <Link
              href="/generateur"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("generatorCta")} →
            </Link>
            <Link
              href="/tirages"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("archiveCta")} →
            </Link>
            <Link
              href="/tirages#stats"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("statsCta")} →
            </Link>
          </div>
          <div className="mt-8 max-w-2xl space-y-4">
            <p className="text-xs text-[var(--muted)]">{t("disclaimer")}</p>
            <AnjResponsibleStrip />
          </div>
        </div>
      </section>
    </>
  );
}
