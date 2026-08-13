"use client";

import { intlLocale } from "@/i18n/locales";
import { useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  codesMatch,
  parseMyMillionCodes,
} from "@/lib/euromillions/mymillion";

type CodedDraw = {
  date: string;
  code: string;
  location?: string | null;
};

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function MyMillionChecker({
  draws,
  locale,
}: {
  draws: CodedDraw[];
  locale: string;
}) {
  const t = useTranslations("myMillion");
  const dates = useMemo(() => draws.map((d) => d.date), [draws]);
  const [date, setDate] = useState(dates[0] || "");
  const [blob, setBlob] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const draw = draws.find((d) => d.date === date);
  const parsed = useMemo(() => parseMyMillionCodes(blob), [blob]);

  const hits = submitted
    ? parsed.filter((c) => codesMatch(draw?.code, c))
    : [];

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (draws.length === 0) return null;

  return (
    <div className="border border-[var(--line)] bg-[var(--surface)] p-5 md:p-7">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
        {t("checkerEyebrow")}
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
        {t("checkerTitle")}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{t("checkerHelp")}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block max-w-md">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {t("checkerDate")}
          </span>
          <select
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSubmitted(false);
            }}
            className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-[var(--heading)] outline-none focus:border-[var(--accent)]"
          >
            {draws.map((d) => (
              <option key={d.date} value={d.date}>
                {formatDate(d.date, locale)}
                {d.code ? ` · ${d.code}` : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {t("checkerCodes")}
          </span>
          <textarea
            value={blob}
            onChange={(e) => {
              setBlob(e.target.value);
              setSubmitted(false);
            }}
            rows={5}
            placeholder={t("checkerPlaceholder")}
            className="mt-2 w-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 font-mono text-sm text-[var(--heading)] outline-none focus:border-[var(--accent)]"
          />
        </label>
        <button
          type="submit"
          disabled={!draw || parsed.length === 0}
          className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)] disabled:opacity-40"
        >
          {t("checkerSubmit")}
        </button>
      </form>

      {submitted ? (
        <div className="mt-6 text-sm">
          {hits.length > 0 ? (
            <p className="font-semibold text-[var(--heading)]">
              {t("checkerHit", { count: hits.length })}
            </p>
          ) : (
            <p className="text-[var(--heading)]">{t("checkerMiss")}</p>
          )}
          <p className="mt-2 text-[var(--muted)]">
            {t("checkerWinning")} ·{" "}
            <span className="font-mono font-semibold text-[var(--heading)]">
              {draw?.code}
            </span>
            {draw?.location ? ` · ${draw.location}` : ""}
          </p>
          {draw ? (
            <p className="mt-3">
              <Link
                href={`/tirages/${draw.date}`}
                className="font-semibold text-[var(--accent)] hover:underline"
              >
                {t("checkerSeeDraw")} →
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
