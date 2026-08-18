"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function AlertSubscribeForm() {
  const t = useTranslations("alerts");
  const locale = useLocale();
  const [status, setStatus] = useState<
    "idle" | "loading" | "ok" | "already" | "error" | "unconfigured"
  >("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      if (!res.ok) throw new Error(json.error || "fail");
      setStatus(json.already ? "already" : "ok");
      form.reset();
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
      {status === "error" ? (
        <p className="text-sm text-red-400">{t("error")}</p>
      ) : null}
      {status === "unconfigured" ? (
        <p className="text-sm text-[var(--muted)]">{t("unconfigured")}</p>
      ) : null}
    </form>
  );
}
