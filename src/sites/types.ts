export type SiteId = "ecoflow" | "powerstream";

export type SiteTheme = {
  /** Accent / CTA (dark surfaces) */
  accent: string;
  accentInk: string;
  /** Optional accents for light surfaces */
  accentLight?: string;
  accentInkLight?: string;
  solar: string;
  /** Dark mode surfaces */
  dark: {
    bg: string;
    ink: string;
    surface: string;
    fg: string;
    fog: string;
    heading: string;
    muted: string;
    line: string;
    glow: string;
    heroFrom: string;
    heroMid: string;
    heroTo: string;
  };
  /** Light mode surfaces */
  light: {
    bg: string;
    ink: string;
    surface: string;
    fg: string;
    fog: string;
    heading: string;
    muted: string;
    line: string;
    glow: string;
    heroFrom: string;
    heroMid: string;
    heroTo: string;
  };
};

export type SiteBrand = {
  name: string;
  taglineFr: string;
  taglineEn: string;
  headlineFr: string;
  headlineEn: string;
  subheadFr: string;
  subheadEn: string;
  footerBlurbFr: string;
  footerBlurbEn: string;
};

export type SiteMonetization = {
  /** Override Amazon tag; falls back to AMAZON_ASSOCIATE_TAG */
  amazonTag?: string;
  /** Override AdSense client; falls back to NEXT_PUBLIC_ADSENSE_CLIENT */
  adsenseClient?: string;
};

export type SiteConfig = {
  id: SiteId;
  /** Primary canonical host (no protocol) */
  primaryHost: string;
  /** All hostnames that resolve to this site */
  hosts: string[];
  brand: SiteBrand;
  theme: SiteTheme;
  heroImage: string;
  /** Categories to highlight first on home */
  featuredCategoryIds: string[];
  /** Sister sites in the network (cross-links) */
  network: { siteId: SiteId; labelFr: string; labelEn: string }[];
  monetization?: SiteMonetization;
  /** Legal publisher stays shared unless overridden later */
  focusFr: string;
  focusEn: string;
};
