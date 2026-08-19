import { intlLocale } from "@/i18n/locales";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { FdjGameBalls } from "@/components/FdjGameBalls";
import { GameMark } from "@/components/GameMark";
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
import { FdjCompanionSimulator } from "@/components/FdjCompanionSimulator";
import { FlashGridGenerator } from "@/components/FlashGridGenerator";
import {
  fdjAffiliateRel,
  fdjAffiliateTracked,
  fdjAffiliateUrl,
} from "@/lib/fdj-affiliate";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";
import { NextDrawMenuMeta } from "@/components/NextDrawMenuMeta";
import { companionDrawKey } from "@/lib/fdj-games/keys";
import { gameScopeStyle } from "@/lib/fdj-games/identity";
import { COMPANION_GRID, groupNumbers } from "@/lib/lottery/rules";
import { numberPoolStats } from "@/lib/euromillions/stats";
import { ArchivePagination } from "@/components/ArchivePagination";
import { DrawArchiveRow } from "@/components/DrawArchiveRow";
import { archivePageHref, ARCHIVE_PAGE_SIZE, paginate, parsePageParam } from "@/lib/pagination";
import {
  companionDrawDateLabel,
  companionHubDescription,
  companionHubTitle,
} from "@/lib/fdj-games/hub-seo";
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
  const label = locale === "en" ? entry.labelEn : entry.labelFr;
  const store = await readFdjGamesStore();
  const latest = getGameLatest(store, entry.id);
  const dateLabel = latest
    ? companionDrawDateLabel(locale, entry.id, latest)
    : null;
  return {
    title: companionHubTitle(locale, label, dateLabel),
    description: companionHubDescription(locale, label, dateLabel),
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
  searchParams,
}: {
  params: Promise<{ locale: string; game: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale, game: slug } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const entry = getCompanionGame(slug);
  if (!entry) notFound();
  const gameId = entry.id;

  const t = await getTranslations("games");
  const pageT = await getTranslations("pagination");
  const drawsT = await getTranslations("draws");
  const store = await readFdjGamesStore();
  const latest = getGameLatest(store, gameId);
  const allDraws = getGameDraws(store, gameId);
  const requestedPage = parsePageParam(pageParam);
  const listed = paginate(
    allDraws,
    requestedPage,
    ARCHIVE_PAGE_SIZE,
  );
  if (pageParam && requestedPage > listed.totalPages) notFound();
  const draws = listed.items;
  const spec = COMPANION_GRID[gameId];
  const mainStats = numberPoolStats(
    allDraws.map((d) => groupNumbers(d, "main")),
    spec.mainMax,
  )
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const guideSlug =
    gameId === "loto"
      ? "comprendre-loto"
      : gameId === "eurodreams"
        ? "comprendre-eurodreams"
        : gameId === "keno"
          ? "comprendre-keno"
          : "comprendre-crescendo";
  const label = locale === "en" ? entry.labelEn : entry.labelFr;
  const fdjPlayUrl = fdjAffiliateUrl(gameId, entry.fdjUrl);
  const fdjTracked = fdjAffiliateTracked(gameId);
  const pending = companionResultPending(gameId, latest);
  const hubTitle = companionHubTitle(
    locale,
    label,
    latest ? companionDrawDateLabel(locale, gameId, latest) : null,
  );

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
    <main
      className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20"
      style={gameScopeStyle(gameId)}
    >
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
      <h1 className="mt-6 flex items-center gap-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        <GameMark gameId={gameId} size={40} />
        {hubTitle}
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
        <div className="mt-3 text-[var(--heading)]">
          <NextDrawMenuMeta gameId={gameId} variant="block" />
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">
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
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("archiveTitle")}
        </h2>
        {listed.total > 0 ? (
          <>
          <ul className="mt-4 divide-y divide-[var(--line)] border border-[var(--line)]">
            {draws.map((d) => (
              <DrawArchiveRow
                key={`${d.date}-${d.plannedAt}-${d.drawId}`}
                href={`/jeux/${entry.slug}/${companionDrawKey(d)}`}
                title={headingFor(d)}
                balls={
                  <FdjGameBalls
                    draw={d}
                    labels={groupLabels}
                    compact
                  />
                }
                actionHref={`/jeux/${entry.slug}/${companionDrawKey(d)}#simulateur`}
                actionLabel={drawsT("checkCta")}
              />
            ))}
          </ul>
          <ArchivePagination
            page={listed.page}
            totalPages={listed.totalPages}
            hrefForPage={(p) => archivePageHref(`/jeux/${entry.slug}`, p)}
            prevLabel={pageT("prev")}
            nextLabel={pageT("next")}
            pageOf={pageT("pageOf", {
              page: listed.page,
              total: listed.totalPages,
            })}
            range={pageT("range", {
              from: listed.from,
              to: listed.to,
              total: listed.total,
            })}
          />
          </>
        ) : (
          <p className="mt-4 text-[var(--muted)]">{t("emptyGame")}</p>
        )}
      </section>

      <section id="simulateur" className="mt-16 max-w-3xl scroll-mt-28">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("simTitle", { game: label })}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("simLead")}</p>
        <div className="mt-6">
          <FdjCompanionSimulator
            draws={getGameDraws(store, gameId)}
            spec={spec}
            gameSlug={entry.slug}
            initialKey={latest ? companionDrawKey(latest) : null}
          />
        </div>
      </section>

      <section id="generateur" className="mt-16 max-w-3xl scroll-mt-28">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("genTitle", { game: label })}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("genLead")}</p>
        <div className="mt-6">
          <FlashGridGenerator spec={spec} help={t("genLead")} />
        </div>
      </section>

      <section id="stats" className="mt-16 scroll-mt-28">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("statsTitle", { game: label })}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("statsLead")}</p>
        <ul className="mt-4 space-y-2">
          {mainStats.map((s) => (
            <li
              key={s.n}
              className="flex justify-between border-b border-[var(--line)] py-2 text-sm"
            >
              <span className="font-semibold text-[var(--heading)]">{s.n}</span>
              <span className="text-[var(--muted)]">
                {t("statsCount", { count: s.count })} · {t("statsDelay", { delay: s.delay })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link
          href={`/guides/${guideSlug}`}
          className="font-semibold text-[var(--accent)] hover:underline"
        >
          {t("gameGuideCta")} →
        </Link>
        <a
          href={fdjPlayUrl}
          target="_blank"
          rel={fdjAffiliateRel(fdjTracked)}
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
      <KwankoBanner
        desktop={(KWANKO_SLOTS[gameId] || KWANKO_SLOTS.bienvenue).desktop}
        mobile={(KWANKO_SLOTS[gameId] || KWANKO_SLOTS.bienvenue).mobile}
        className="mt-8"
      />
    </main>
  );
}
