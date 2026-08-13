"use client";

import Image from "next/image";
import { useSite } from "./SiteProvider";

type SiteLogoProps = {
  /** Header (hero fg) vs footer (heading) */
  variant?: "header" | "footer";
  className?: string;
};

export function SiteLogo({ variant = "header", className = "" }: SiteLogoProps) {
  const site = useSite();
  const mark = site.brand.logoMark || site.brand.icons.favicon;
  const textClass = "text-[var(--heading)]";

  return (
    <span
      className={`inline-flex items-center gap-2.5 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight md:text-xl ${textClass} ${className}`}
    >
      <Image
        src={mark}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
        unoptimized
        priority={false}
      />
      <span>{site.brand.name}</span>
    </span>
  );
}
