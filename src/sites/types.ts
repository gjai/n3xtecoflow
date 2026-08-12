export type SiteId = "ecoflow" | "tumbler" | "massage-gun";

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

/**
 * Profil éditorial data-driven — remplace les `if (siteId === …)` dans
 * copy / news / guides / images. Un nouveau thème = remplir ce bloc.
 */
export type SiteEditorialProfile = {
  /** Recherche Amazon de secours (CTA sans ASIN) */
  amazonQuery: string;
  /** Chips « on parle de » (about / meta) */
  knowsAbout: string[];
  /**
   * Guide long unique (layout flat) — redirect `/guides` → ce slug.
   * Absent sur les thèmes multi-guides (ecoflow).
   */
  mainGuideSlug?: string;
  /** User-Agent fetch RSS */
  feedUserAgent: string;
  /** Crédit image packshot catalogue */
  packshotCredit: string;
  /** Crédit cover générée IA */
  coverCreditAi: string;
  /** Tip d’achat injecté dans les actus template (FR/EN) */
  buyingTipFr: string;
  buyingTipEn: string;
  /** Libellé sujet pour excerpts fallback */
  topicLabelFr: string;
  topicLabelEn: string;
  /** Périmètre guides AI */
  guideScope: string;
  /** Hints stub / checklist guides */
  productHintFr: string;
  productHintEn: string;
  checklistFr: string;
  checklistEn: string;
  /** Périmètre rewrite actus AI (une ligne) */
  newsPerimeter: string;
  /** Ce que les titres doivent mentionner */
  newsTitleMustMention: string;
  /** Critères d’achat à développer dans l’article */
  newsBuyingCriteria: string;
  /** Tags JSON exemples pour le prompt */
  newsDefaultTags: string[];
  /** Extra règles prompt (optionnel, une ligne chacune) */
  newsExtraRules?: string[];
  /** Couverture IA actus / guides */
  coverSubject: string;
  coverContextDefault: string;
  coverStyle: string;
  coverShowOnly: string;
  /**
   * Après match marque RSS : accepter sans produit EcoFlow-like.
   * true pour thèmes flat Amazon.
   */
  rssLenientAfterBrand: boolean;
  /** IA avant packshot pour couvertures actus uniques */
  preferAiNewsCovers: boolean;
  /** Packshot faible autorisé en dernier recours (catalogue riche type EcoFlow) */
  allowWeakPackshotDefault: boolean;
  /**
   * Source regex pertinence RSS / on-topic (flags `i` appliqués à l’usage).
   * String sérialisable (SiteConfig passe au client via SiteProvider).
   */
  topicBrandPattern: string;
  /**
   * Produits spécifiques requis si `rssLenientAfterBrand` est false
   * (ex. DELTA / RIVER pour EcoFlow).
   */
  topicProductPattern?: string;
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
  /** Categories to highlight first on home (layout catégories) */
  featuredCategoryIds: string[];
  /**
   * Layout catalogue / home :
   * - `categories` = grilles par gamme (EcoFlow)
   * - `flat` = liste produits + sélection home (tumbler + futurs thèmes hors énergie)
   * Défaut : categories si id=ecoflow, sinon flat.
   */
  catalogLayout?: "flat" | "categories";
  /**
   * Slugs mis en avant sur la home (layout flat). Ordre conservé.
   * Si omis : premiers produits du catalogue (max 6).
   */
  featuredProductSlugs?: string[];
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
  /** Profil éditorial (prompts, CTA Amazon, guide unique, covers) */
  editorial: SiteEditorialProfile;
  /** Legal publisher stays shared unless overridden later */
  focusFr: string;
  focusEn: string;
};
