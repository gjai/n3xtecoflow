"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { SiteLogo } from "./SiteLogo";

export function SiteHeader() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "/produits", label: t("products") },
    { href: "/powerstream", label: t("powerstream") },
    { href: "/guides", label: t("guides") },
    { href: "/comparatifs", label: t("comparisons") },
    { href: "/actualites", label: t("news") },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-30 transition-colors ${
        scrolled || open
          ? "border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" onClick={() => setOpen(false)} aria-label={t("home")}>
          <SiteLogo variant="header" />
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[var(--muted)] lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-[var(--heading)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--line)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--heading)] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t("closeMenu") : t("openMenu")}
        </button>
      </div>
      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-[var(--line)] bg-[var(--surface)] px-5 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-1 text-sm text-[var(--fg)]">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="min-h-11 py-3"
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
