"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useState } from "react";
import { Link } from "@/i18n/navigation";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

export type HeroSlide = {
  id: string;
  kind: string;
  title: string;
  excerpt: string;
  href: string;
  cta: string;
  imageSrc: string;
  imageAlt: string;
};

const INTERVAL_MS = 6500;

export function HeroSlider({
  brandName,
  slides,
}: {
  brandName: string;
  slides: HeroSlide[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const active = slides[index] ?? slides[0];

  const goNext = useEffectEvent(() => {
    setIndex((i) => (i + 1) % count);
  });

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = window.setInterval(() => goNext(), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count, paused]);

  if (!active) return null;

  return (
    <section
      className="hero-grid relative min-h-[68svh] overflow-hidden md:min-h-[62svh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={brandName}
    >
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            {slide.imageSrc.startsWith("/api/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.imageSrc}
                alt={slide.imageAlt}
                className={`absolute inset-0 h-full w-full object-cover opacity-50 dark:opacity-40 ${
                  i === index ? "hero-kenburns" : ""
                }`}
              />
            ) : (
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover opacity-50 dark:opacity-40 ${
                  i === index ? "hero-kenburns" : ""
                }`}
              />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--hero-from)] via-[color-mix(in_srgb,var(--hero-from)_78%,transparent)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--hero-from)]/80 via-transparent to-[var(--hero-from)]/30" />
      </div>

      <div className="relative mx-auto flex min-h-[68svh] max-w-6xl flex-col justify-end px-5 pb-10 pt-24 md:min-h-[62svh] md:justify-center md:px-8 md:pb-14">
        <p className="reveal font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.28em] text-[var(--accent)]">
          {brandName}
        </p>

        <div key={active.id} className="hero-slide-copy mt-3 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--hero-muted)]">
            {active.kind}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.05] tracking-tight text-[var(--hero-fg)] sm:text-4xl md:text-5xl lg:text-6xl">
            {active.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-[var(--hero-muted)] md:text-base">
            {active.excerpt}
          </p>
          <div className="mt-7 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href={active.href}
              className="bg-[var(--accent)] px-5 py-3 text-sm font-semibold tracking-wide text-[var(--accent-ink)] transition hover:brightness-110"
            >
              {active.cta}
            </Link>
          </div>
        </div>

        <div className="reveal-delay-2 mt-5 max-w-xl">
          <AffiliateDisclosure compact />
        </div>

        {count > 1 ? (
          <div className="mt-6 flex items-center gap-3">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`${slide.kind}: ${slide.title}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-1.5 transition-all duration-300 ${
                  i === index
                    ? "w-10 bg-[var(--accent)]"
                    : "w-4 bg-[var(--hero-border)] hover:bg-[var(--hero-muted)]"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
