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
/** Jour de semaine FR calculé en code — jamais laissé au LLM (source du bug
 * "vendredi 13 septembre" : le 13 était en fait un dimanche). */
function frWeekdayDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Paris",
  });
}

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
  const dateFr = frWeekdayDate(args.publishedAt);

  return `Tu es journaliste / rédacteur senior pour ${brand} (site éditorial indépendant, audience FR d’abord).

Mission: rédiger un VRAI ARTICLE complet (pas un résumé de 3 lignes), bilingue FR+EN, à partir de la source fournie.

PRIORITÉ FRANÇAIS (obligatoire):
- Le bloc "fr" est la version principale (défaut du site) — titre, excerpt et body 100 % en français correct
- Ne JAMAIS laisser un titre RSS anglais dans "fr.title" : traduire / reformuler en français naturel
- Si la source est en anglais, traduis les faits en français puis rédige "en" comme version secondaire
- "fr.title" ≠ "en.title" (pas de copie identique)

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
${
    site.monetization?.disableAmazon
      ? "- Prix crypto (BTC/ETH) : tu peux garder $ / USD si c’est le cours marché cité ; sinon euros (€). Pas de lien Amazon."
      : "- Prix UNIQUEMENT en euros (€) — jamais de dollars ($ / USD). Si la source cite un prix US, convertis approximativement en € ou oriente vers « prix du jour sur Amazon.fr »."
  }
- Citer clairement la source (${args.sourceName})
- Structure par langue: titre, excerpt, body = 7 à 10 paragraphes utiles
- Développer: contexte, faits, critères d’achat (${ed.newsBuyingCriteria}), limites, conclusion actionable — pas une fiche promo
- JSON strict uniquement, sans markdown
- DATE OBLIGATOIRE : "${dateFr}" est la date de PUBLICATION de cet article chez nous — ce n'est pas forcément la date de l'événement. Pour la date des faits (ex. un tirage précis), utilise UNIQUEMENT ce qui est explicitement écrit dans sourceText ci-dessous. Ne recalcule JAMAIS un jour de la semaine toi-même (ex. "vendredi 13 septembre" est une vraie erreur déjà publiée par erreur — le 13 était un dimanche) : recopie une date/jour uniquement si elle est écrite telle quelle dans la source, sinon reste vague ("récemment", "lors du dernier tirage").

Entrée:
sourceName=${args.sourceName}
date=${dateFr}
dateIso=${args.publishedAt}
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
