"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useSite } from "./SiteProvider";

export function SiteHeader() {
  const t = useTranslations("nav");
  const site = useSite();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/produits", label: t("products") },
    { href: "/guides", label: t("guides") },
    { href: "/comparatifs", label: t("comparisons") },
    { href: "/actualites", label: t("news") },
  ] as const;

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--hero-fg)] md:text-xl"
          onClick={() => setOpen(false)}
        >
          {site.brand.name}
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[var(--hero-muted)] xl:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-[var(--hero-fg)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="inline-flex items-center justify-center border border-[var(--hero-border)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--hero-fg)] xl:hidden"
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
          className="border-t border-[var(--line)] bg-[var(--surface)]/95 px-5 py-4 backdrop-blur xl:hidden"
        >
          <div className="flex flex-col gap-3 text-sm text-[var(--fg)]">
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
          </div>
        </div>
      ) : null}
    </header>
  );
}
