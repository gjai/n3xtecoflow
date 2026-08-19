import { intlLocale } from "@/i18n/locales";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FDJ_COMPANION_GAMES } from "@/lib/fdj-games/catalog";
import {
  companionHomeSlots,
  companionResultPending,
  formatDrawWhen,
} from "@/lib/fdj-games/display";
import { getGameDraws, getGameLatest } from "@/lib/fdj-games/store";
import type { FdjGamesStore } from "@/lib/fdj-games/types";
import { FdjGameBalls } from "@/components/FdjGameBalls";
import { GameMark } from "@/components/GameMark";
import { gameRailStyle } from "@/lib/fdj-games/identity";

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
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

function parseAnnuity(
  note: string | null | undefined,
): { monthly: number; years: number } | null {
  if (!note) return null;
  const [monthlyRaw, yearsRaw] = note.split("|");
  const monthly = Number(monthlyRaw);
  const years = Number(yearsRaw);
  if (!Number.isFinite(monthly) || !Number.isFinite(years)) return null;
  return { monthly, years };
}

export async function FdjCompanionGamesBlock({
  store,
  locale,
  variant = "home",
}: {
  store: FdjGamesStore;
  locale: string;
  variant?: "home" | "hub";
}) {
  const t = await getTranslations({ locale, namespace: "games" });
  const isEn = locale === "en";

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
    <section
      id="autres-jeux"
      className={
        variant === "home"
          ? "border-b border-[var(--line)]"
          : "mx-auto max-w-6xl px-5 py-4 md:px-8"
      }
    >
      <div
        className={
          variant === "home"
            ? "mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16"
            : ""
        }
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)] md:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
              {t("subtitle")}
            </p>
          </div>
          {variant === "home" ? (
            <Link
              href="/jeux"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("allCta")} →
            </Link>
          ) : null}
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {FDJ_COMPANION_GAMES.map((game) => {
            const latest = getGameLatest(store, game.id);
            const allDraws = getGameDraws(store, game.id);
            const slots = companionHomeSlots(game.id, allDraws);
            const label = isEn ? game.labelEn : game.labelFr;
            const jackpot = latest
              ? formatMoney(latest.jackpotEur, locale)
              : null;
            const annuity = latest
              ? parseAnnuity(latest.jackpotNote)
              : null;
            const annuityText =
              annuity && formatMoney(annuity.monthly, locale)
                ? t("annuityNote", {
                    amount: formatMoney(annuity.monthly, locale)!,
                    years: annuity.years,
                  })
                : null;
            const when = latest ? formatDrawWhen(latest, locale) : null;
            const pending = companionResultPending(game.id, latest);
            const slotLabel =
              when?.kenoSlot === "midi"
                ? t("kenoMidi")
                : when?.kenoSlot === "soir"
                  ? t("kenoSoir")
                  : null;
            const showBalls =
              slots.find((s) => s.draw)?.draw || latest || null;
            return (
              <li
                key={game.id}
                className="min-w-0 border border-[var(--line)] bg-[var(--surface)] p-5"
                style={gameRailStyle(game.id)}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
                      <GameMark gameId={game.id} size={28} />
                      {label}
                    </h3>
                    {latest ? (
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {formatDate(latest.date, locale)}
                        {slotLabel ? ` · ${slotLabel}` : ""}
                        {when?.time && game.id === "crescendo"
                          ? ` · ${when.time}`
                          : ""}
                        {annuityText
                          ? ` · ${annuityText}`
                          : jackpot
                            ? ` · ${jackpot}`
                            : ""}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {t("emptyGame")}
                      </p>
                    )}
                    {pending ? (
                      <p className="mt-1 text-xs text-[var(--accent)]">
                        {t("pending")}
                      </p>
                    ) : null}
                    {game.id === "crescendo" || game.id === "keno" ? (
                      <ul className="mt-2 flex flex-wrap gap-1.5 text-xs text-[var(--muted)]">
                        {slots.map((s) => {
                          const name =
                            s.kenoSlot === "midi"
                              ? t("kenoMidi")
                              : s.kenoSlot === "soir"
                                ? t("kenoSoir")
                                : s.hour != null
                                  ? t("crescendoHour", { hour: s.hour })
                                  : "";
                          return (
                            <li
                              key={s.id}
                              className={`border px-2 py-0.5 ${
                                s.draw
                                  ? "border-[var(--line)] text-[var(--heading)]"
                                  : "border-[var(--accent)] text-[var(--accent)]"
                              }`}
                            >
                              {name}
                              {s.draw ? "" : ` · ${t("pendingShort")}`}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                  <Link
                    href={`/jeux/${game.slug}`}
                    className="text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    {t("seeGame")} →
                  </Link>
                </div>
                {showBalls ? (
                  <div className="mt-4 min-w-0">
                    <FdjGameBalls
                      draw={showBalls}
                      labels={groupLabels}
                      card
                    />
                  </div>
                ) : pending ? (
                  <p className="mt-4 text-sm text-[var(--accent)]">
                    {t("pending")}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-xs text-[var(--muted)]">{t("disclaimer")}</p>
      </div>
    </section>
  );
}
