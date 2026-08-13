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
body{margin:0;min-height:100%;background:var(--bg);color:var(--fg);font-family:system-ui,sans-serif}
a{color:inherit;text-decoration:none}
.em-header-row{display:flex;align-items:center;justify-content:space-between;gap:1rem}
.em-desktop-nav{display:none}
@media(min-width:1024px){
  .em-desktop-nav{display:flex;align-items:center;flex-wrap:wrap;gap:.65rem}
  .em-menu-btn{display:none!important}
}
.lottery-balls{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem}
.lottery-balls--compact{gap:.35rem;margin-top:.4rem}
.lottery-ball{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:2.75rem;height:2.75rem;border-radius:9999px;font-weight:600;font-size:.875rem;line-height:1}
.lottery-ball--lg{width:3.5rem;height:3.5rem;font-size:1.125rem}
.lottery-ball--sm{width:2.15rem;height:2.15rem;font-size:.75rem}
.lottery-ball--main{background:var(--accent);color:var(--accent-ink)}
.lottery-ball--bonus{border:1px solid var(--accent);background:var(--surface);color:var(--heading)}
.lottery-ball--letter{border:2px solid var(--accent);background:var(--surface);color:var(--heading)}
.lottery-code{display:inline-flex;align-items:center;min-height:2.25rem;padding:0 .75rem;font-family:ui-monospace,monospace;font-size:.875rem;font-weight:600;letter-spacing:.04em;border:1px solid var(--line);background:var(--surface);color:var(--heading)}
`.trim();
}
