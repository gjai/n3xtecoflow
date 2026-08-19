"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ALERT_GAME_IDS,
  alertGameLabel,
  defaultAlertGames,
  type AlertGameId,
} from "@/lib/euromillions/alert-games";

export function AlertSubscribeForm() {
  const t = useTranslations("alerts");
  const locale = useLocale();
  const [games, setGames] = useState<AlertGameId[]>(defaultAlertGames);
  const [status, setStatus] = useState<
    "idle" | "loading" | "ok" | "already" | "error" | "unconfigured" | "games"
  >("idle");

  function toggleGame(id: AlertGameId) {
    setGames((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
    if (status === "games") setStatus("idle");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!games.length) {
      setStatus("games");
      return;
    }
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/euromillions/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") || ""),
          locale,
          age: data.get("age") === "on",
          website: String(data.get("website") || ""),
          games,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        already?: boolean;
        error?: string;
      };
      if (res.status === 503 || json.error === "mail_unconfigured") {
        setStatus("unconfigured");
        return;
      }
      if (json.error === "games") {
        setStatus("games");
        return;
      }
      if (!res.ok) throw new Error(json.error || "fail");
      setStatus(json.already ? "already" : "ok");
      form.reset();
      setGames(defaultAlertGames());
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div>
        <label htmlFor="alert-email" className="mb-2 block text-sm text-[var(--muted)]">
          {t("emailLabel")}
        </label>
        <input
          id="alert-email"
          name="email"
          type="email"
          required
          maxLength={160}
          autoComplete="email"
          className="w-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-[var(--heading)] outline-none focus:border-[var(--accent)]"
        />
      </div>
      <fieldset>
        <legend className="text-sm text-[var(--muted)]">{t("gamesLabel")}</legend>
        <p className="mt-1 text-xs text-[var(--muted)]">{t("gamesHint")}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {ALERT_GAME_IDS.map((id) => {
            const checked = games.includes(id);
            return (
              <label
                key={id}
                className="flex items-center gap-2 border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--heading)]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleGame(id)}
                />
                <span>{alertGameLabel(id, locale)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <label className="flex items-start gap-2 text-sm text-[var(--muted)]">
        <input
          type="checkbox"
          name="age"
          required
          className="mt-1"
        />
        <span>{t("ageLabel")}</span>
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)] disabled:opacity-60"
      >
        {status === "loading" ? t("sending") : t("submit")}
      </button>
      {status === "ok" ? (
        <p className="text-sm text-[var(--accent)]">{t("success")}</p>
      ) : null}
      {status === "already" ? (
        <p className="text-sm text-[var(--accent)]">{t("already")}</p>
      ) : null}
      {status === "games" ? (
        <p className="text-sm text-red-400">{t("gamesNeedOne")}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-400">{t("error")}</p>
      ) : null}
      {status === "unconfigured" ? (
        <p className="text-sm text-[var(--muted)]">{t("unconfigured")}</p>
      ) : null}
    </form>
  );
}
