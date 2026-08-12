import type { NewsArticle, NewsLocaleCopy } from "./types";
import type { RssItem } from "./rss";
import { makeSlug } from "./store";
import { resolveNewsCover } from "./images";

function cleanTitle(title: string) {
  return title.replace(/\s+-\s+[^-]+$/, "").trim();
}

function templateCopy(
  locale: "fr" | "en",
  item: RssItem,
): NewsLocaleCopy {
  const title = cleanTitle(item.title);
  const when = new Date(item.publishedAt).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  if (locale === "fr") {
    return {
      title,
      excerpt: `Revue de presse (${item.sourceName}, ${when}) : points clés pour les lecteurs EcoFlow Stream.`,
      body: [
        `Une information relayée par ${item.sourceName} le ${when} attire l’attention sur l’écosystème EcoFlow.`,
        item.description
          ? `Contexte signalé par la source : ${item.description.slice(0, 280)}${item.description.length > 280 ? "…" : ""}`
          : `Le titre mis en avant concerne : « ${title} ».`,
        `Notre lecture éditoriale : vérifiez toujours les specs (Wh, W, compatibilité STREAM / stations) et le prix du jour avant d’acheter. Les promos et stocks bougent vite.`,
        `Cet article est une synthèse indépendante, pas une reprise intégrale. Pour le détail d’origine, consultez la source citée.`,
      ],
    };
  }

  return {
    title,
    excerpt: `Press roundup (${item.sourceName}, ${when}): key points for EcoFlow Stream readers.`,
    body: [
      `Coverage from ${item.sourceName} on ${when} highlights a development around the EcoFlow ecosystem.`,
      item.description
        ? `Source context: ${item.description.slice(0, 280)}${item.description.length > 280 ? "…" : ""}`
        : `Headline focus: “${title}”.`,
      `Editorial takeaway: always double-check specs (Wh, W, STREAM / station compatibility) and live pricing before buying. Promos and stock move quickly.`,
      `This is an independent summary, not a full republication. Read the original source for primary details.`,
    ],
  };
}

type AiPayload = {
  fr: NewsLocaleCopy;
  en: NewsLocaleCopy;
  tags?: string[];
};

async function rewriteWithAi(item: RssItem): Promise<AiPayload | null> {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    process.env.AI_API_KEY?.trim();
  if (!apiKey) return null;

  const usingGemini = Boolean(process.env.GEMINI_API_KEY?.trim()) ||
    (process.env.OPENAI_BASE_URL || "").includes("generativelanguage.googleapis.com");

  const base =
    process.env.OPENAI_BASE_URL?.trim() ||
    (usingGemini
      ? "https://generativelanguage.googleapis.com/v1beta/openai/"
      : "https://api.openai.com/v1");
  const model =
    process.env.OPENAI_MODEL?.trim() ||
    (usingGemini ? "gemini-2.5-flash-lite" : "gpt-4o-mini");

  const prompt = `Tu es rédacteur pour EcoFlow Stream, site éditorial indépendant FR/EN.
À partir d'un titre/description d'actualité réelle, écris une SYNTHÈSE ORIGINALE (pas de copier-coller).
Règles:
- 3 à 5 courts paragraphes par langue
- citer la source sans inventer de faits
- ajouter un angle utile (Wh, usage, STREAM/DELTA/PowerStream si pertinent)
- pas de langage marketing mensonger
- JSON strict uniquement

Entrée:
source=${item.sourceName}
date=${item.publishedAt}
title=${item.title}
description=${item.description}
url=${item.link}

Format JSON:
{"fr":{"title":"...","excerpt":"...","body":["..."]},"en":{"title":"...","excerpt":"...","body":["..."]},"tags":["ecoflow","delta"]}`;

  const payload: Record<string, unknown> = {
    model,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content:
          "You write original bilingual editorial news summaries as strict JSON only. No markdown fences.",
      },
      { role: "user", content: prompt },
    ],
  };
  // Gemini OpenAI-compat may ignore response_format; keep for OpenAI
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
  content = content.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const parsed = JSON.parse(content) as AiPayload;
    if (
      !parsed?.fr?.title ||
      !parsed?.en?.title ||
      !Array.isArray(parsed.fr.body) ||
      !Array.isArray(parsed.en.body)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function guessTags(item: RssItem): string[] {
  const hay = `${item.title} ${item.description}`.toLowerCase();
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

export async function buildArticleFromRss(
  item: RssItem,
): Promise<NewsArticle> {
  const ai = await rewriteWithAi(item);
  const rewrittenBy = ai ? "ai" : "template";
  const fr = ai?.fr || templateCopy("fr", item);
  const en = ai?.en || templateCopy("en", item);
  const tags = ai?.tags?.length ? ai.tags : guessTags(item);
  const slug = makeSlug(fr.title || item.title, item.publishedAt, item.guid);
  const cover = await resolveNewsCover({
    sourceUrl: item.link,
    sourceName: item.sourceName,
    slug,
  });

  return {
    slug,
    sourceUrl: item.link,
    sourceName: item.sourceName,
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
    fr: {
      title: fr.title.slice(0, 160),
      excerpt: (fr.excerpt || "").slice(0, 280),
      body: fr.body.map((p) => p.slice(0, 1200)).slice(0, 8),
    },
    en: {
      title: en.title.slice(0, 160),
      excerpt: (en.excerpt || "").slice(0, 280),
      body: en.body.map((p) => p.slice(0, 1200)).slice(0, 8),
    },
  };
}
