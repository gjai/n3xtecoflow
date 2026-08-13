import { intlLocale } from "@/i18n/locales";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { AdSenseUnit } from "@/components/AdSenseUnit";
import { FdjGameBalls } from "@/components/FdjGameBalls";
import { GameMark } from "@/components/GameMark";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { JsonLd, breadcrumbJsonLd, lotteryDrawJsonLd } from "@/components/JsonLd";
import { getCompanionGame } from "@/lib/fdj-games/catalog";
import { companionDrawKey } from "@/lib/fdj-games/keys";
import { formatDrawWhen } from "@/lib/fdj-games/display";
import {
  getDrawByKey,
  getGameDraws,
  readFdjGamesStore,
} from "@/lib/fdj-games/store";
import { companionBrief } from "@/lib/lottery/brief";
import { COMPANION_GRID } from "@/lib/lottery/rules";
import { FdjCompanionSimulator } from "@/components/FdjCompanionSimulator";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { gameScopeStyle } from "@/lib/fdj-games/identity";

export const revalidate = 600;

export async function generateStaticParams() {
  return [];
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
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; game: string; draw: string }>;
}): Promise<Metadata> {
  const { locale, game: slug, draw: key } = await params;
  const entry = getCompanionGame(slug);
  if (!entry) return {};
  const t = await getTranslations({ locale, namespace: "draws" });
  const label = locale === "en" ? entry.labelEn : entry.labelFr;
  const pretty = formatDate(key.slice(0, 10), locale);
  return {
    title: t("companionOf", { game: label, date: pretty }),
    description: t("companionMeta", { game: label, date: pretty }),
    alternates: await siteLocaleAlternates(
      locale,
      `/jeux/${entry.slug}/${key}`,
    ),
  };
}

export default async function CompanionDrawPage({
  params,
}: {
  params: Promise<{ locale: string; game: string; draw: string }>;
}) {
  const { locale, game: slug, draw: key } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();
  const entry = getCompanionGame(slug);
  if (!entry) notFound();

  const store = await readFdjGamesStore();
  const draw = getDrawByKey(store, entry.id, key);
  if (!draw) notFound();

  const t = await getTranslations("draws");
  const gamesT = await getTranslations("games");
  const homeT = await getTranslations("home");
  const label = locale === "en" ? entry.labelEn : entry.labelFr;
  const pretty = formatDate(draw.date, locale);
  const when = formatDrawWhen(draw, locale);
  const heading =
    when.kenoSlot === "midi"
      ? `${pretty} · ${gamesT("kenoMidi")}`
      : when.kenoSlot === "soir"
        ? `${pretty} · ${gamesT("kenoSoir")}`
        : when.time
          ? `${pretty} · ${when.time}`
          : pretty;
  const jackpot = formatMoney(draw.jackpotEur, locale);
  const brief = companionBrief(draw, locale, heading, label, jackpot);
  const title = t("companionOf", { game: label, date: heading });
  const siteUrl = `https://${site.primaryHost}`;
  const spec = COMPANION_GRID[entry.id];
  const allDraws = getGameDraws(store, entry.id);
  const groupLabels: Record<string, string> = {
    main: gamesT("group.main"),
    stars: gamesT("group.stars"),
    dream: gamesT("group.dream"),
    chance: gamesT("group.chance"),
    letter: gamesT("group.letter"),
    multiplier: gamesT("group.multiplier"),
    joker: gamesT("group.joker"),
    secondDraw: gamesT("group.secondDraw"),
    other: gamesT("group.other"),
  };

  return (
    <>
      <JsonLd
        data={lotteryDrawJsonLd({
          siteUrl,
          locale,
          date: draw.date,
          title,
          description: brief.lead,
          numbers: draw.groups[0]?.values.map((v) => Number(v)).filter(Number.isFinite) || [],
          stars: [],
          jackpotEur: draw.jackpotEur,
          publisherName: site.brand.name,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.brand.name, url: `${siteUrl}/${locale}` },
          {
            name: label,
            url: `${siteUrl}/${locale}/jeux/${entry.slug}`,
          },
          {
            name: title,
            url: `${siteUrl}/${locale}/jeux/${entry.slug}/${companionDrawKey(draw)}`,
          },
        ])}
      />
      <main
        className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20"
        style={gameScopeStyle(entry.id)}
      >
        <Link
          href={`/jeux/${entry.slug}`}
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← {gamesT("backHub")}
        </Link>
        <div className="mt-4">
          <GameToolsNav gameId={entry.id} />
        </div>
        <h1 className="mt-6 flex items-center gap-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
          <GameMark gameId={entry.id} size={36} />
          {title}
        </h1>
        <p className="mt-4 text-[var(--muted)]">{brief.lead}</p>
        {brief.paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="mt-3 text-[var(--muted)]">
            {p}
          </p>
        ))}

        <div className="mt-8 border border-[var(--line)] bg-[var(--surface)] p-6">
          <FdjGameBalls draw={draw} labels={groupLabels} />
        </div>

        <div className="mt-8">
          <AdSenseUnit label={homeT("adsLabel")} />
        </div>

        <section id="simulateur" className="mt-12 scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
            {gamesT("simTitle", { game: label })}
          </h2>
          <div className="mt-6">
            <FdjCompanionSimulator
              draws={allDraws}
              spec={spec}
              gameSlug={entry.slug}
              initialKey={companionDrawKey(draw)}
            />
          </div>
        </section>
      </main>
    </>
  );
}
