import { getSiteById } from "./index";
import type { SiteEditorialProfile, SiteId } from "./types";

/** Profil éditorial du thème (jamais de fallback silencieux EcoFlow). */
export function getEditorial(siteId: SiteId): SiteEditorialProfile {
  return getSiteById(siteId).editorial;
}

/** Compile les patterns string du profil (sérialisables Client Components). */
export function topicBrandRegex(siteId: SiteId): RegExp {
  return new RegExp(getEditorial(siteId).topicBrandPattern, "i");
}

export function topicProductRegex(siteId: SiteId): RegExp | null {
  const src = getEditorial(siteId).topicProductPattern;
  return src ? new RegExp(src, "i") : null;
}

export function siteUsesStaticBuyingGuide(siteId: SiteId): boolean {
  const site = getSiteById(siteId);
  return Boolean(
    site.editorial.mainGuideSlug || site.catalogLayout === "flat",
  );
}

/** Prompt rewrite actus — construit depuis le profil (plus de if siteId). */
export function buildNewsRewritePrompt(args: {
  siteId: SiteId;
  sourceName: string;
  publishedAt: string;
  rssTitle: string;
  publisherTitle: string;
  publisherUrl: string;
  sourceText: string;
}): string {
  const site = getSiteById(args.siteId);
  const ed = site.editorial;
  const brand = site.brand.name;
  const tags = JSON.stringify(ed.newsDefaultTags);
  const extra = (ed.newsExtraRules || [])
    .map((r) => `- ${r}`)
    .join("\n");

  return `Tu es journaliste / rédacteur senior pour ${brand} (site éditorial indépendant FR/EN).

Mission: rédiger un VRAI ARTICLE complet (pas un résumé de 3 lignes), bilingue, à partir de la source fournie.

Périmètre STRICT:
- Sujet UNIQUEMENT ${ed.newsPerimeter}
- Si la source n'est PAS centrée sur ce sujet → réponds exactement {"skip":true}
- Interdiction d'inventer un angle hors périmètre si la source en parle à peine
- Les titres FR/EN doivent mentionner clairement ${ed.newsTitleMustMention}
- Si la source est une pure promo / deal / coupon / soldes sans angle éditorial utile → {"skip":true}
${extra ? `${extra}\n` : ""}
Règles rédaction:
- Contenu ORIGINAL (reformulation totale)
- Ne pas inventer de chiffres, promos, dates ou specs absents de la source
- Prix UNIQUEMENT en euros (€) — jamais de dollars ($ / USD).${
    site.monetization?.disableAmazon
      ? " Si un prix est cité, reste factuel sans lien marchand Amazon."
      : " Si la source cite un prix US, convertis approximativement en € ou oriente vers « prix du jour sur Amazon.fr »."
  }
- Citer clairement la source (${args.sourceName})
- Structure par langue: titre, excerpt, body = 7 à 10 paragraphes utiles
- Développer: contexte, faits, critères d’achat (${ed.newsBuyingCriteria}), limites, conclusion actionable — pas une fiche promo
- JSON strict uniquement, sans markdown

Entrée:
sourceName=${args.sourceName}
date=${args.publishedAt}
rssTitle=${args.rssTitle}
publisherTitle=${args.publisherTitle}
publisherUrl=${args.publisherUrl}
sourceText=<<
${args.sourceText}
>>

Format JSON:
{"fr":{"title":"...","excerpt":"...","body":["p1","p2","..."]},"en":{"title":"...","excerpt":"...","body":["p1","p2","..."]},"tags":${tags}}
ou {"skip":true}`;
}

export function buildNewsCoverPrompt(
  siteId: SiteId,
  title: string,
  excerpt?: string,
): string {
  const ed = getEditorial(siteId);
  return `Create a photorealistic editorial cover image (16:9) for ${ed.coverSubject}.
No text, no logos, no watermarks, no Google branding, no UI chrome.
Subject inspired by: "${title}".
STRICT: do not mix themes — never show products from another brand vertical.
Context: ${excerpt || ed.coverContextDefault}.
Style: ${ed.coverStyle}.
${ed.coverShowOnly}`;
}

export function buildGuideCoverPrompt(
  siteId: SiteId,
  title: string,
  subtitle?: string,
): string {
  const ed = getEditorial(siteId);
  return `Create a photorealistic editorial cover image (16:9) for a buying guide.
No text, no logos, no watermarks, no UI chrome.
Guide title: "${title}".
STRICT: do not mix themes — never show products from another brand vertical.
Context: ${subtitle || ed.coverContextDefault}.
Style: ${ed.coverStyle}.
${ed.coverShowOnly}`;
}
