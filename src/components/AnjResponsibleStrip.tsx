"use client";

import { useTranslations } from "next-intl";

/** Bandeau jeu responsable style ANJ — HTML natif, sans asset Kwanko. */
export function AnjResponsibleStrip({ className = "" }: { className?: string }) {
  const t = useTranslations("responsible");
  const helpUrl = t("helpUrl");
  const phone = t("helpPhone");
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <aside
      className={`border border-black bg-[#ffd600] px-4 py-3 text-black ${className}`}
      aria-label={t("title")}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] md:text-xs">
        {t("anjMinor")}
      </p>
      <p className="mt-1.5 text-[11px] leading-snug md:text-xs md:leading-relaxed">
        {t("anjWarning")}{" "}
        <a
          href={helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
        >
          {t("helpLink")}
        </a>{" "}
        (
        <a href={phoneHref} className="font-semibold underline underline-offset-2">
          {phone}
        </a>
        {" · "}
        {t("anjCallFree")})
      </p>
    </aside>
  );
}
