"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AlertSubscribeForm } from "./AlertSubscribeForm";
import { PwaInstallButton } from "./PwaInstall";
import { useSite } from "./SiteProvider";

export function AlertsEngagement({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const t = useTranslations("alerts");
  const site = useSite();
  const webcal = `webcal://${site.primaryHost}/api/euromillions/calendar`;

  if (variant === "compact") {
    return (
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-3 md:px-8">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
              {t("icsTitle")}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t("icsLead")}</p>
            <a
              href={webcal}
              className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("icsWebcal")} →
            </a>
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
              {t("mailTitle")}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t("mailLead")}</p>
            <Link
              href="/alerte-email"
              className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("mailCta")} →
            </Link>
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
              {t("pwaTitle")}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t("pwaLead")}</p>
            <div className="mt-3">
              <PwaInstallButton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 space-y-6">
      <div className="border border-[var(--line)] bg-[var(--surface)] p-5 md:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
          {t("icsTitle")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("icsLead")}</p>
        <div className="mt-4">
          <a
            href={webcal}
            className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
          >
            {t("icsWebcal")}
          </a>
        </div>
      </div>
      <div className="border border-[var(--line)] bg-[var(--surface)] p-5 md:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
          {t("mailTitle")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("mailLead")}</p>
        <p className="mt-2 text-xs text-[var(--muted)]">{t("legalNote")}</p>
        <AlertSubscribeForm />
      </div>
      <div className="border border-[var(--line)] bg-[var(--surface)] p-5 md:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
          {t("pwaTitle")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("pwaLead")}</p>
        <div className="mt-4">
          <PwaInstallButton />
        </div>
      </div>
    </section>
  );
}
