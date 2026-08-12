import type { CSSProperties } from "react";
import type { SiteConfig, SiteTheme } from "./types";

function modeVars(
  mode: SiteTheme["dark"] | SiteTheme["light"],
  accent: string,
  accentInk: string,
  solar: string,
) {
  return {
    "--bg": mode.bg,
    "--ink": mode.ink,
    "--surface": mode.surface,
    "--fg": mode.fg,
    "--fog": mode.fog,
    "--heading": mode.heading,
    "--muted": mode.muted,
    "--line": mode.line,
    "--accent": accent,
    "--accent-ink": accentInk,
    "--solar": solar,
    "--glow": mode.glow,
    "--hero-from": mode.heroFrom,
    "--hero-mid": mode.heroMid,
    "--hero-to": mode.heroTo,
    "--hero-fg": mode.heading,
    "--hero-muted":
      mode.heading === "#ffffff"
        ? "rgba(255, 255, 255, 0.8)"
        : "rgba(12, 24, 19, 0.72)",
    "--hero-border":
      mode.heading === "#ffffff"
        ? "rgba(255, 255, 255, 0.28)"
        : "rgba(12, 24, 19, 0.18)",
  } as Record<string, string>;
}

export function siteThemeStyle(site: SiteConfig): CSSProperties {
  const dark = modeVars(
    site.theme.dark,
    site.theme.accent,
    site.theme.accentInk,
    site.theme.solar,
  );
  return dark as CSSProperties;
}

export function siteThemeCss(site: SiteConfig): string {
  const dark = modeVars(
    site.theme.dark,
    site.theme.accent,
    site.theme.accentInk,
    site.theme.solar,
  );
  const light = modeVars(
    site.theme.light,
    site.theme.accentLight || site.theme.accent,
    site.theme.accentInkLight || site.theme.accentInk,
    site.theme.solar,
  );

  const toBlock = (vars: Record<string, string>) =>
    Object.entries(vars)
      .map(([k, v]) => `${k}:${v};`)
      .join("");

  return `
html[data-site="${site.id}"]{${toBlock(dark)}}
html[data-site="${site.id}"].light{${toBlock(light)}}
@media (prefers-color-scheme: light){
  html[data-site="${site.id}"]:not(.dark){${toBlock(light)}}
}
`.trim();
}
