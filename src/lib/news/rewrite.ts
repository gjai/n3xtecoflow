import type { NewsArticle, NewsLocaleCopy } from "./types";
import type { RssItem } from "./rss";
import { makeSlug } from "./store";
import { resolveNewsCover } from "./images";
import { fetchSourcePage, type SourcePage } from "./source";

function cleanTitle(title: string) {
  return title.replace(/\s+-\s+[^-]+$/, "").trim();
}

function templateCopy(
  locale: "fr" | "en",
  item: RssItem,
  source: SourcePage | null,
): NewsLocaleCopy {
  const title = cleanTitle(source?.title || item.title);
  const when = new Date(item.publishedAt).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
  const raw = (source?.text || item.description || "").trim();
  const chunks = raw
    .split(/\n{2,}|(?<=\.)\s+(?=[A-ZÀ-Ü])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40)
    .slice(0, 8);

  if (locale === "fr") {
    const body = [
      `Selon ${item.sourceName} (${when}), l’actualité porte sur : ${title}.`,
      ...chunks.slice(0, 5),
      `Pour les lecteurs EcoFlow Stream : croisez toujours capacité (Wh), puissance (W), compatibilité STREAM / stations et le prix du jour avant d’acheter.`,
      `Article rédigé à partir de la source citée — vérifiez le texte d’origine pour les détails primaires.`,
    ].filter(Boolean);
    return {
      title,
      excerpt:
        chunks[0]?.slice(0, 220) ||
        `Couverture ${item.sourceName} du ${when} sur l’écosystème EcoFlow.`,
      body,
    };
  }

  const body = [
    `According to ${item.sourceName} (${when}), the story focuses on: ${title}.`,
    ...chunks.slice(0, 5),
    `For EcoFlow Stream readers: always cross-check capacity (Wh), output (W), STREAM / station compatibility, and live pricing before buying.`,
    `Written from the cited source — check the original for primary details.`,
  ].filter(Boolean);
  return {
    title,
    excerpt:
      chunks[0]?.slice(0, 220) ||
      `${item.sourceName} coverage on ${when} about the EcoFlow ecosystem.`,
    body,
  };
}

type AiPayload = {
  fr: NewsLocaleCopy;
  en: NewsLocaleCopy;
  tags?: string[];
};

async function rewriteWithAi(
  item: RssItem,
  source: SourcePage | null,
): Promise<AiPayload | null> {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    process.env.AI_API_KEY?.trim();
  if (!apiKey) return null;

  const usingGemini =
    Boolean(process.env.GEMINI_API_KEY?.trim()) ||
    (process.env.OPENAI_BASE_URL || "").includes(
      "generativelanguage.googleapis.com",
    );

  const base =
    process.env.OPENAI_BASE_URL?.trim() ||
    (usingGemini
      ? "https://generativelanguage.googleapis.com/v1beta/openai/"
      : "https://api.openai.com/v1");
  const model =
    process.env.OPENAI_MODEL?.trim() ||
    (usingGemini ? "gemini-2.5-flash-lite" : "gpt-4o-mini");

  const sourceText = (source?.text || item.description || "").slice(0, 5500);

  const prompt = `Tu es journaliste / rédacteur senior pour EcoFlow Stream (site éditorial indépendant FR/EN).

Mission: rédiger un VRAI ARTICLE complet (pas un résumé de 3 lignes), bilingue, à partir de la source fournie.

Règles strictes:
- Contenu ORIGINAL (reformulation totale) — interdiction de copier-coller des phrases de la source
- Ne pas inventer de chiffres, promos, dates ou specs absents de la source
- Citer clairement la source (${item.sourceName})
- Structure par langue: titre accrocheur, excerpt (1-2 phrases), body = 7 à 10 paragraphes utiles
- Développer: contexte, faits, enjeux pour l’acheteur (Wh, W, usage camping/backup/solaire balcon, STREAM/DELTA/PowerStream si pertinent), limites / points de vigilance, conclusion actionable
- Ton clair, concret, non marketing mensonger
- JSON strict uniquement, sans markdown

Entrée:
sourceName=${item.sourceName}
date=${item.publishedAt}
rssTitle=${item.title}
publisherTitle=${source?.title || ""}
publisherUrl=${source?.finalUrl || item.link}
sourceText=<<
${sourceText}
>>

Format JSON:
{"fr":{"title":"...","excerpt":"...","body":["p1","p2","..."]},"en":{"title":"...","excerpt":"...","body":["p1","p2","..."]},"tags":["ecoflow","delta"]}`;

  const payload: Record<string, unknown> = {
    model,
    temperature: 0.45,
    max_tokens: 8192,
    messages: [
      {
        role: "system",
        content:
          "You write full original bilingual news articles as strict JSON only. No markdown fences. Substantial paragraphs, not short blurbs.",
      },
      { role: "user", content: prompt },
    ],
  };
  if (!usingGemini) {
    payload.response_format = { type: "json_object" };
  }

  const res = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("ai_rewrite_failed", res.status, await res.text());
    return null;
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  let content = json.choices?.[0]?.message?.content;
  if (!content) return null;
  content = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(content) as AiPayload;
    if (
      !parsed?.fr?.title ||
      !parsed?.en?.title ||
      !Array.isArray(parsed.fr.body) ||
      !Array.isArray(parsed.en.body) ||
      parsed.fr.body.length < 4 ||
      parsed.en.body.length < 4
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function guessTags(item: RssItem, source: SourcePage | null): string[] {
  const hay =
    `${item.title} ${item.description} ${source?.title || ""} ${source?.text || ""}`.toLowerCase();
  const tags = new Set<string>(["ecoflow"]);
  if (/delta/.test(hay)) tags.add("delta");
  if (/river/.test(hay)) tags.add("river");
  if (/stream/.test(hay)) tags.add("stream");
  if (/powerstream/.test(hay)) tags.add("powerstream");
  if (/ocean/.test(hay)) tags.add("ocean");
  if (/solaire|solar|panneau/.test(hay)) tags.add("solaire");
  if (/promo|prix|brade|deal|amazon/.test(hay)) tags.add("promo");
  return [...tags];
}

function normalizeCopy(copy: NewsLocaleCopy): NewsLocaleCopy {
  return {
    title: copy.title.slice(0, 180),
    excerpt: (copy.excerpt || "").slice(0, 320),
    body: copy.body
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => p.slice(0, 2200))
      .slice(0, 12),
  };
}

export async function buildArticleFromRss(
  item: RssItem,
  options?: { keepSlug?: string },
): Promise<NewsArticle> {
  const source = await fetchSourcePage(item.link);
  const ai = await rewriteWithAi(item, source);
  const rewrittenBy = ai ? "ai" : "template";
  const fr = normalizeCopy(ai?.fr || templateCopy("fr", item, source));
  const en = normalizeCopy(ai?.en || templateCopy("en", item, source));
  const tags = ai?.tags?.length ? ai.tags : guessTags(item, source);
  const slug =
    options?.keepSlug ||
    makeSlug(fr.title || item.title, item.publishedAt, item.guid);

  const cover = await resolveNewsCover({
    sourceUrl: source?.finalUrl || item.link,
    sourceName: source?.sourceHint || item.sourceName,
    slug,
    ogImageHint: source?.ogImage,
  });

  return {
    slug,
    sourceUrl: source?.finalUrl || item.link,
    sourceName: source?.sourceHint || item.sourceName,
    sourceGuid: item.guid,
    publishedAt: item.publishedAt,
    ingestedAt: new Date().toISOString(),
    rewrittenBy,
    tags,
    ...(cover
      ? {
          imageSrc: cover.imageSrc,
          imageCredit: cover.imageCredit,
          imageKind: cover.imageKind,
        }
      : {}),
    fr,
    en,
  };
}

/** Rebuild an existing article from its source URL (full text + image). */
export async function refreshArticle(
  article: NewsArticle,
): Promise<NewsArticle> {
  const item: RssItem = {
    title: article.fr.title || article.en.title,
    link: article.sourceUrl,
    guid: article.sourceGuid,
    publishedAt: article.publishedAt,
    sourceName: article.sourceName,
    description: article.fr.excerpt || article.en.excerpt || "",
  };
  const next = await buildArticleFromRss(item, { keepSlug: article.slug });
  return {
    ...next,
    sourceGuid: article.sourceGuid,
    publishedAt: article.publishedAt,
    ingestedAt: article.ingestedAt,
  };
}
