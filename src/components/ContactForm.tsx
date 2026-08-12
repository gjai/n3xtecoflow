"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          message: String(data.get("message") || ""),
          website: String(data.get("website") || ""),
        }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-[var(--muted)]">
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={120}
          className="w-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--fg)] outline-none focus:border-[var(--accent)]"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-[var(--muted)]">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={160}
          className="w-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--fg)] outline-none focus:border-[var(--accent)]"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm text-[var(--muted)]"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={4000}
          className="w-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--fg)] outline-none focus:border-[var(--accent)]"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)] transition hover:brightness-110 disabled:opacity-60"
      >
        {status === "loading" ? t("sending") : t("submit")}
      </button>
      {status === "ok" ? (
        <p className="text-sm text-[var(--accent)]">{t("success")}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-300">{t("error")}</p>
      ) : null}
    </form>
  );
}
