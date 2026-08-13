import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EuroMillionsOffersBlock } from "@/components/EuroMillionsOffersBlock";
import type { EuroMillionsDraw, EuroMillionsStore } from "@/lib/euromillions/types";
import { getLatestDraw } from "@/lib/euromillions/store";
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
}: {
  draw: EuroMillionsDraw;
  ballsLabel: string;
  starsLabel: string;
}) {
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-ink)]"
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--surface)] text-sm font-semibold text-[var(--heading)]"
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
}: {
  site: SiteConfig;
  locale: string;
  store: EuroMillionsStore;
}) {
  const t = await getTranslations({ locale, namespace: "home" });
  const latest = getLatestDraw(store);
  const jackpot = latest ? formatMoney(latest.jackpotEur, locale) : null;
  const nextJackpot = formatMoney(store.nextJackpotEur, locale);
  const brand = site.brand.name;
  const recentWinners = (store.myMillionWinners || []).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(160deg, var(--hero-from), var(--hero-mid) 45%, var(--hero-to))",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-end md:px-8 md:py-24">
          <div>
            <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--heading)] md:text-6xl">
              {brand}
            </p>
            <h1 className="mt-5 max-w-xl text-xl text-[var(--fog)] md:text-2xl">
              {t("headline")}
            </h1>
            <p className="mt-4 max-w-lg text-[var(--muted)]">{t("subhead")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#dernier-tirage"
                className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
              >
                {t("ctaPrimary")}
              </a>
              <Link
                href="/tirages"
                className="inline-flex min-h-11 items-center border border-[var(--line)] px-5 text-sm font-semibold text-[var(--heading)]"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
          <div className="border border-[var(--line)] bg-[var(--surface)]/80 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              {t("nextDrawLabel")}
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
              {store.nextDrawDate
                ? formatDate(store.nextDrawDate, locale)
                : "—"}
            </p>
            {nextJackpot ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                {t("nextJackpotLabel")} · {nextJackpot}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section
        id="dernier-tirage"
        className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              {t("latestTitle")}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)]">
              {latest ? formatDate(latest.date, locale) : t("empty")}
            </h2>
          </div>
          {jackpot ? (
            <p className="text-sm text-[var(--muted)]">
              {t("jackpotLabel")} ·{" "}
              <span className="font-semibold text-[var(--heading)]">
                {jackpot}
              </span>
            </p>
          ) : null}
        </div>

        {latest ? (
          <div className="mt-8 border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
            <DrawBalls
              draw={latest}
              ballsLabel={t("ballsLabel")}
              starsLabel={t("starsLabel")}
            />
            {latest.myMillionCode ? (
              <div className="mt-6 border-t border-[var(--line)] pt-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {t("myMillionLabel")}
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-wide text-[var(--heading)]">
                  {latest.myMillionCode}
                </p>
                {latest.myMillionLocation ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {t("myMillionLocation")} · {latest.myMillionLocation}
                  </p>
                ) : null}
                <p className="mt-3">
                  <Link
                    href="/my-million"
                    className="text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    {t("myMillionCta")} →
                  </Link>
                </p>
              </div>
            ) : null}
            <p className="mt-6">
              <Link
                href={`/tirages/${latest.date}`}
                className="text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                {t("archiveCta")} →
              </Link>
            </p>
          </div>
        ) : (
          <p className="mt-6 text-[var(--muted)]">{t("empty")}</p>
        )}
      </section>

      {recentWinners.length > 0 ? (
        <section className="border-y border-[var(--line)] bg-[var(--bg)]">
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
              href="/tirages"
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
