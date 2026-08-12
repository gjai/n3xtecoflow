"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const brand = useTranslations("home");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/produits", label: t("products") },
    { href: "/guides", label: t("guides") },
    { href: "/comparatifs", label: t("comparisons") },
    { href: "/powerstream", label: t("powerstream") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white md:text-xl"
          onClick={() => setOpen(false)}
        >
          {brand("brand")}
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-white/85 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          ))}
          <LanguageSwitcher label={t("language")} />
        </nav>
        <button
          type="button"
          className="inline-flex items-center justify-center border border-white/25 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-[var(--ink)]/95 px-5 py-4 backdrop-blur lg:hidden"
        >
          <div className="flex flex-col gap-3 text-sm text-white">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-1"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <LanguageSwitcher label={t("language")} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
