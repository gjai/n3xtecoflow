export type SiteId = "ecoflow" | "tumbler";

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

export type SiteIcons = {
  /** Browser tab favicon (SVG preferred) */
  favicon: string;
  /** Apple touch / PWA home screen */
  apple?: string;
  /** Optional 32×32 PNG/SVG */
  icon32?: string;
  /** Optional 192×192 for Android / PWA */
  icon192?: string;
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
  /** Header / footer wordmark (SVG or PNG) */
  logo: string;
  /** Compact mark only (favicon-like), optional */
  logoMark?: string;
  icons: SiteIcons;
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
  /** All hostnames that resolve to this site/theme (apex + www, sister domains) */
  hosts: string[];
  brand: SiteBrand;
  theme: SiteTheme;
  heroImage: string;
  /** Categories to highlight first on home */
  featuredCategoryIds: string[];
  /**
   * Sister / network sites in the footer.
   * - Internal theme: set `siteId` (resolved to primaryHost)
   * - External site (hosted elsewhere): set absolute `href`
   */
  network: {
    siteId?: SiteId;
    href?: string;
    labelFr: string;
    labelEn: string;
  }[];
  monetization?: SiteMonetization;
  /** Legal publisher stays shared unless overridden later */
  focusFr: string;
  focusEn: string;
};
