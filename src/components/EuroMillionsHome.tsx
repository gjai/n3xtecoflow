import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SmartCover } from "@/components/SmartCover";
import { EuroMillionsOffersBlock } from "@/components/EuroMillionsOffersBlock";
import { FdjCompanionGamesBlock } from "@/components/FdjCompanionGamesBlock";
import { NextJackpotBanner } from "@/components/NextJackpotBanner";
import { getEditorialImages } from "@/data/images";
import { usesEnglishFallback } from "@/i18n/locales";
import type { EuroMillionsDraw, EuroMillionsStore } from "@/lib/euromillions/types";
import { euroMillionsResultPending } from "@/lib/euromillions/datetime";
import { getLatestDraw } from "@/lib/euromillions/store";
import type { FdjGamesStore } from "@/lib/fdj-games/types";
import type { NewsArticle } from "@/lib/news/types";
import type { SiteConfig } from "@/sites/types";

function formatMoney(amount: number | null | undefined, locale: string) {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function DrawBalls({
  draw,
  ballsLabel,
  starsLabel,
  large = false,
}: {
  draw: EuroMillionsDraw;
  ballsLabel: string;
  starsLabel: string;
  large?: boolean;
}) {
  const size = large
    ? "h-12 w-12 text-base md:h-14 md:w-14 md:text-lg"
    : "h-11 w-11 text-sm";
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {ballsLabel}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {draw.numbers.map((n) => (
            <span
              key={`n-${n}`}
              className={`inline-flex items-center justify-center rounded-full bg-[var(--accent)] font-semibold text-[var(--accent-ink)] ${size}`}
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
        <div className="mt-2 flex flex-wrap gap-2">
          {draw.stars.map((n) => (
            <span
              key={`s-${n}`}
              className={`inline-flex items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--surface)] font-semibold text-[var(--heading)] ${size}`}
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
  const newsT = await getTranslations({ locale, namespace: "news" });
  const latest = getLatestDraw(store);
  const jackpot = latest ? formatMoney(latest.jackpotEur, locale) : null;
  const nextJackpot = formatMoney(store.nextJackpotEur, locale);
  const pending = euroMillionsResultPending({
    latestDate: latest?.date,
    nextDrawDate: store.nextDrawDate,
  });
  const brand = site.brand.name;
  const recentWinners = (store.myMillionWinners || []).slice(0, 4);
  const editorial = getEditorialImages(site.id);
  const isEn = usesEnglishFallback(locale);

  return (
    <>
      <NextJackpotBanner
        nextDrawDate={store.nextDrawDate || null}
        nextJackpot={nextJackpot}
        pending={pending}
        locale={locale}
      />
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(160deg, var(--hero-from), var(--hero-mid) 45%, var(--hero-to))",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1fr_1.05fr] md:items-center md:px-8 md:py-20">
          <div>
            <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--heading)] md:text-6xl">
              {brand}
            </p>
            <h1 className="mt-5 max-w-xl text-xl text-[var(--fog)] md:text-2xl">
              {t("headline")}
            </h1>
            <p className="mt-4 max-w-lg text-[var(--muted)]">{t("subhead")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/simulateur"
                className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
              >
                {t("simulatorCta")}
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
            className="border border-[var(--line)] bg-[var(--surface)]/90 p-6 backdrop-blur md:p-8"
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
                />
                {latest.myMillionCode ? (
                  <div className="mt-6 border-t border-[var(--line)] pt-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      {t("myMillionLabel")}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-wide text-[var(--heading)]">
                      {latest.myMillionCode}
                    </p>
                    {latest.myMillionLocation ? (
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {t("myMillionLocation")} · {latest.myMillionLocation}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href={`/simulateur?date=${latest.date}`}
                    className="inline-flex min-h-10 items-center bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-ink)]"
                  >
                    {t("simulatorCta")}
                  </Link>
                  <Link
                    href={`/tirages/${latest.date}`}
                    className="text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    {t("archiveCta")} →
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

      <section className="border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 md:px-8">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
              {t("simulatorTeaserTitle")}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {t("simulatorTeaserText")}
            </p>
          </div>
          <Link
            href="/simulateur"
            className="inline-flex min-h-11 items-center border border-[var(--accent)] px-5 text-sm font-semibold text-[var(--heading)]"
          >
            {t("simulatorCta")} →
          </Link>
        </div>
      </section>

      <FdjCompanionGamesBlock store={fdjGames} locale={locale} variant="home" />

      {latestNews.length > 0 ? (
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
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {latestNews.slice(0, 3).map((article) => {
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
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
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

      <EuroMillionsOffersBlock site={site} locale={locale} variant="home" />

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
              href="/simulateur"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("simulatorCta")} →
            </Link>
            <Link
              href="/tirages"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("archiveCta")} →
            </Link>
            <Link
              href="/stats"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("statsCta")} →
            </Link>
          </div>
          <p className="mt-8 max-w-2xl text-xs text-[var(--muted)]">
            {t("disclaimer")}
          </p>
        </div>
      </section>
    </>
  );
}
