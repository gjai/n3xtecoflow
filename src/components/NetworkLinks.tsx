"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSite } from "./SiteProvider";
import { getNetworkLinks } from "@/sites";

export function NetworkLinks() {
  const site = useSite();
  const locale = useLocale();
  const t = useTranslations("network");
  const links = getNetworkLinks(site);
  if (!links.length) return null;
  const isEn = locale === "en";

  return (
    <div className="border-t border-[var(--line)] px-5 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {t("title")}
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map((l) => (
            <li key={l.key}>
              <a
                href={l.href}
                className="text-[var(--accent)] underline-offset-2 hover:underline"
                rel={l.external ? "noopener noreferrer" : undefined}
                target={l.external ? "_blank" : undefined}
              >
                {isEn ? l.labelEn : l.labelFr}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-[var(--muted)]">{t("hint")}</p>
      </div>
    </div>
  );
}
