import { intlLocale } from "@/i18n/locales";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { FdjGameBalls } from "@/components/FdjGameBalls";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { ResultsLivePoller } from "@/components/ResultsLivePoller";
import { FDJ_COMPANION_GAMES, getCompanionGame } from "@/lib/fdj-games/catalog";
import {
  companionResultPending,
  companionScheduleSummary,
  formatDrawWhen,
} from "@/lib/fdj-games/display";
import {
  getGameDraws,
  getGameLatest,
  readFdjGamesStore,
} from "@/lib/fdj-games/store";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const revalidate = 600;

export function generateStaticParams() {
  return FDJ_COMPANION_GAMES.map((g) => ({ game: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; game: string }>;
}): Promise<Metadata> {
  const { locale, game: slug } = await params;
  const entry = getCompanionGame(slug);
  if (!entry) return {};
  const t = await getTranslations({ locale, namespace: "games" });
  const label = locale === "en" ? entry.labelEn : entry.labelFr;
  return {
    title: t("gameTitle", { game: label }),
    description: t("gameMeta", { game: label }),
    alternates: await siteLocaleAlternates(locale, `/jeux/${entry.slug}`),
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

function formatDateTime(isoDate: string, plannedAt: string, locale: string) {
  const d = new Date(plannedAt);
  if (Number.isNaN(d.getTime())) return formatDate(isoDate, locale);
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(d);
}

function formatMoney(amount: number | null | undefined, locale: string) {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function JeuxGamePage({
  params,
}: {
  params: Promise<{ locale: string; game: string }>;
}) {
  const { locale, game: slug } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const entry = getCompanionGame(slug);
  if (!entry) notFound();
  const gameId = entry.id;

  const t = await getTranslations("games");
  const store = await readFdjGamesStore();
  const latest = getGameLatest(store, gameId);
  const draws = getGameDraws(store, gameId).slice(0, 40);
  const label = locale === "en" ? entry.labelEn : entry.labelFr;
  const pending = companionResultPending(gameId, latest);

  function headingFor(d: NonNullable<typeof latest>) {
    const when = formatDrawWhen(d, locale);
    const slot =
      when.kenoSlot === "midi"
        ? t("kenoMidi")
        : when.kenoSlot === "soir"
          ? t("kenoSoir")
          : null;
    if (gameId === "keno" && slot) {
      return `${formatDate(d.date, locale)} · ${slot}`;
    }
    if (gameId === "crescendo") {
      return formatDateTime(d.date, d.plannedAt, locale);
    }
    return formatDate(d.date, locale);
  }

  const groupLabels: Record<string, string> = {
    main: t("group.main"),
    stars: t("group.stars"),
    dream: t("group.dream"),
    chance: t("group.chance"),
    letter: t("group.letter"),
    multiplier: t("group.multiplier"),
    joker: t("group.joker"),
    secondDraw: t("group.secondDraw"),
    other: t("group.other"),
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <ResultsLivePoller
        enabled={pending}
        fingerprint={latest?.plannedAt || "none"}
      />
      <Link
        href="/jeux"
        className="text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        ← {t("backHub")}
      </Link>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        {t("gameTitle", { game: label })}
      </h1>
      <div className="mt-4">
        <GameToolsNav gameId={gameId} />
      </div>
      <p className="mt-3 text-[var(--muted)]">
        {t("gameLead", { game: label })}
      </p>

      <section
        id="prochain"
        className="mt-8 scroll-mt-28 border border-[var(--line)] bg-[var(--surface)] p-5"
      >
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          {t("scheduleTitle")}
        </h2>
        <p className="mt-2 text-[var(--heading)]">
          {companionScheduleSummary(gameId, locale)}
        </p>
      </section>

      {latest ? (
        <div className="mt-8 border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            {t("latestLabel")}
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {headingFor(latest)}
          </p>
          {pending ? (
            <p className="mt-2 text-sm text-[var(--accent)]">{t("pending")}</p>
          ) : null}
          {latest.jackpotNote ? (
            <p className="mt-2 text-sm text-[var(--muted)]">
              {(() => {
                const [m, y] = latest.jackpotNote.split("|");
                const money = formatMoney(Number(m), locale);
                return money
                  ? t("annuityNote", { amount: money, years: Number(y) })
                  : null;
              })()}
            </p>
          ) : latest.jackpotEur != null ? (
            <p className="mt-2 text-sm text-[var(--muted)]">
              {t("jackpotLabel")} · {formatMoney(latest.jackpotEur, locale)}
            </p>
          ) : null}
          <div className="mt-6">
            <FdjGameBalls draw={latest} labels={groupLabels} />
          </div>
        </div>
      ) : (
        <p className="mt-8 text-[var(--muted)]">{t("emptyGame")}</p>
      )}

      <section id="archives" className="mt-12 scroll-mt-28">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
          {t("archiveTitle")}
        </h2>
        {draws.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {draws.map((d) => (
              <li
                key={`${d.date}-${d.plannedAt}-${d.drawId}`}
                className="border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
              >
                <p className="text-sm font-semibold text-[var(--heading)]">
                  {headingFor(d)}
                </p>
                <div className="mt-3">
                  <FdjGameBalls draw={d} labels={groupLabels} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[var(--muted)]">{t("emptyGame")}</p>
        )}
      </section>

      <section className="relative mt-10 scroll-mt-28 border border-[var(--line)] bg-[var(--surface)] p-5">
        <span id="simulateur" className="absolute -top-24" />
        <span id="stats" className="absolute -top-24" />
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
          {t("emToolsTitle")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("emToolsLead")}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link
            href="/simulateur"
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            {t("emSimulatorCta")} →
          </Link>
          <Link
            href="/stats"
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            {t("emStatsCta")} →
          </Link>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <a
          href={entry.fdjUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--accent)] hover:underline"
        >
          {t("officialCta")} →
        </a>
        <Link
          href="/tirages"
          className="font-semibold text-[var(--accent)] hover:underline"
        >
          {t("emPrimaryCta")} →
        </Link>
      </div>
      <p className="mt-6 text-xs text-[var(--muted)]">{t("disclaimer")}</p>
    </main>
  );
}
