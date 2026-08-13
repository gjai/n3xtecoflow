import { intlLocale } from "@/i18n/locales";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { NextJackpotBanner } from "@/components/NextJackpotBanner";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { GameLabel } from "@/components/GameMark";
import { NextDrawMenuMeta } from "@/components/NextDrawMenuMeta";
import { ResultsLivePoller } from "@/components/ResultsLivePoller";
import { LOTTERY_GAMES_NAV, lotteryGameLabel } from "@/lib/fdj-games/nav";
import { gameRailStyle } from "@/lib/fdj-games/identity";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import {
  getLatestDraw,
  readEuroMillionsStore,
} from "@/lib/euromillions/store";
import { euroMillionsResultPending } from "@/lib/euromillions/datetime";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nextDraw" });
  return {
    title: t("pageTitle"),
    description: t("pageMeta"),
    alternates: await siteLocaleAlternates(locale, "/prochain-tirage"),
  };
}

function formatMoney(amount: number | null | undefined, locale: string) {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ProchainTiragePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("nextDraw");
  const store = await readEuroMillionsStore();
  const latest = getLatestDraw(store);
  const pending = euroMillionsResultPending({
    latestDate: latest?.date,
    nextDrawDate: store.nextDrawDate,
  });
  const jackpot = formatMoney(store.nextJackpotEur, locale);

  return (
    <main>
      <ResultsLivePoller
        enabled={pending}
        fingerprint={latest?.date || "none"}
      />
      <NextJackpotBanner
        nextDrawDate={store.nextDrawDate || null}
        nextJackpot={jackpot}
        pending={pending}
        locale={locale}
        showPageLink={false}
      />
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
          {t("pageTitle")}
        </h1>
        <div className="mt-4">
          <GameToolsNav gameId="euromillions" />
        </div>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("pageLead")}</p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
          {t("cutoffOpen", { time: "20:15" })}
        </p>
        {pending ? (
          <p className="mt-6 border border-[var(--line)] bg-[var(--surface)] p-5 text-[var(--heading)]">
            {t("pendingHelp")}
          </p>
        ) : null}

        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
            {t("allTitle")}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{t("allLead")}</p>
          <ul className="mt-6 space-y-3">
            {LOTTERY_GAMES_NAV.map((game) => {
              const nextHref =
                game.tools.find((tool) => tool.id === "nextDraw")?.href ||
                game.href;
              return (
                <li
                  key={game.id}
                  className="border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
                  style={gameRailStyle(game.id)}
                >
                  <Link
                    href={nextHref}
                    className="font-semibold text-[var(--heading)] hover:text-[var(--accent)]"
                  >
                    <GameLabel gameId={game.id} size={20}>
                      {lotteryGameLabel(game, locale)}
                    </GameLabel>
                  </Link>
                  <NextDrawMenuMeta gameId={game.id} variant="block" />
                </li>
              );
            })}
          </ul>
        </section>
        <ul className="mt-8 space-y-3 text-sm">
          <li>
            <Link
              href="/tirages#simulateur"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              {t("checkCta")} →
            </Link>
          </li>
          {latest ? (
            <li>
              <Link
                href={`/tirages/${latest.date}`}
                className="font-semibold text-[var(--accent)] hover:underline"
              >
                {t("latestCta")} →
              </Link>
            </li>
          ) : null}
          <li>
            <a
              href="/api/euromillions/calendar"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              {t("calendarCta")} →
            </a>
          </li>
          <li>
            <Link
              href="/guides/toucher-un-gain-euromillions"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              {t("claimCta")} →
            </Link>
          </li>
          <li>
            <Link
              href="/tirages"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              {t("archiveCta")} →
            </Link>
          </li>
        </ul>
        <p className="mt-10 text-xs text-[var(--muted)]">{t("disclaimer")}</p>
      </div>
    </main>
  );
}
