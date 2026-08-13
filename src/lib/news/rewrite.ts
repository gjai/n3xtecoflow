import { buildNewsRewritePrompt, getEditorial } from "@/sites/editorial";
import type { SiteId } from "@/sites/types";
import { pricesToEuroText } from "@/lib/money";
import type { NewsArticle, NewsLocaleCopy } from "./types";
import type { RssItem } from "./rss";
import { isOnTopicArticle, isRelevantItem } from "./rss";
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
  siteId: SiteId,
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

  const ed = getEditorial(siteId);
  const tipFr = ed.buyingTipFr;
  const tipEn = ed.buyingTipEn;
  const excerptFallbackFr = `Couverture ${item.sourceName} du ${when} sur ${ed.topicLabelFr}.`;
  const excerptFallbackEn = `${item.sourceName} coverage on ${when} about ${ed.topicLabelEn}.`;

  if (locale === "fr") {
    const body = [
      `Selon ${item.sourceName} (${when}), l’actualité porte sur : ${title}.`,
      ...chunks.slice(0, 5),
      tipFr,
      `Article rédigé à partir de la source citée — vérifiez le texte d’origine pour les détails primaires.`,
    ].filter(Boolean);
    return {
      title,
      excerpt: chunks[0]?.slice(0, 220) || excerptFallbackFr,
      body,
    };
  }

  const body = [
    `According to ${item.sourceName} (${when}), the story focuses on: ${title}.`,
    ...chunks.slice(0, 5),
    tipEn,
    `Written from the cited source — check the original for primary details.`,
  ].filter(Boolean);
  return {
    title,
    excerpt: chunks[0]?.slice(0, 220) || excerptFallbackEn,
    body,
  };
}

type AiPayload = {
  fr: NewsLocaleCopy;
  en: NewsLocaleCopy;
  tags?: string[];
  skip?: boolean;
};

function aiPromptForSite(
  siteId: SiteId,
  item: RssItem,
  source: SourcePage | null,
  sourceText: string,
) {
  return buildNewsRewritePrompt({
    siteId,
    sourceName: item.sourceName,
    publishedAt: item.publishedAt,
    rssTitle: item.title,
    publisherTitle: source?.title || "",
    publisherUrl: source?.finalUrl || item.link,
    sourceText,
  });
}

async function rewriteWithAi(
  item: RssItem,
  source: SourcePage | null,
  siteId: SiteId,
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
  const prompt = aiPromptForSite(siteId, item, source, sourceText);

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
    if (parsed?.skip) return { skip: true } as AiPayload;
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

function guessTags(
  item: RssItem,
  source: SourcePage | null,
  siteId: SiteId,
): string[] {
  const hay =
    `${item.title} ${item.description} ${source?.title || ""} ${source?.text || ""}`.toLowerCase();
  const tags = new Set<string>();
  if (siteId === "tumbler") {
    if (/gourde|bottle/.test(hay)) tags.add("gourde");
    if (/tumbler|mug/.test(hay)) tags.add("tumbler");
    if (/stanley/.test(hay)) tags.add("stanley");
    if (/hydro\s*flask|hydroflask/.test(hay)) tags.add("hydroflask");
    if (/qwetch/.test(hay)) tags.add("qwetch");
    if (/owala/.test(hay)) tags.add("owala");
    if (/thermos/.test(hay)) tags.add("thermos");
    if (/promo|prix|deal|amazon/.test(hay)) tags.add("promo");
    if (tags.size === 0) tags.add("gourde");
    return [...tags];
  }
  if (siteId === "casinos-crypto") {
    if (/\bstake(\.com)?\b/.test(hay)) tags.add("stake");
    if (/crypto\.com|cryptocom/.test(hay)) tags.add("cryptocom");
    if (/nordvpn|nord\s*vpn/.test(hay)) tags.add("nordvpn");
    if (/vpn/.test(hay)) tags.add("vpn");
    if (/casino|gambling|jeu\s*d.?argent/.test(hay)) tags.add("casino-crypto");
    if (
      /wallet|usdt|bitcoin|btc|ethereum|eth\b|cryptocurrenc|cryptomonnaie|stablecoin/.test(
        hay,
      )
    ) {
      tags.add("crypto");
    }
    if (tags.size === 0) tags.add("crypto");
    return [...tags];
  }
  if (siteId === "massage-gun") {
    if (/theragun|therabody/.test(hay)) tags.add("theragun");
    if (/hypervolt|hyperice/.test(hay)) tags.add("hyperice");
    if (/renpho/.test(hay)) tags.add("renpho");
    if (/toloco/.test(hay)) tags.add("toloco");
    if (/bob\s*(and|&)\s*brad/.test(hay)) tags.add("bob-brad");
    if (/opove/.test(hay)) tags.add("opove");
    if (/jolt/.test(hay)) tags.add("jolt");
    if (/brelley/.test(hay)) tags.add("brelley");
    if (/aerlang/.test(hay)) tags.add("aerlang");
    if (/shiatsu|cervical|neck\s*massager|coussin/.test(hay)) tags.add("masseur");
    if (/promo|prix|deal|amazon/.test(hay)) tags.add("promo");
    if (tags.size === 0) tags.add("massage-gun");
    return [...tags];
  }
  if (/ecoflow/.test(hay)) tags.add("ecoflow");
  if (/delta/.test(hay)) tags.add("delta");
  if (/river/.test(hay)) tags.add("river");
  if (/stream/.test(hay)) tags.add("stream");
  if (/powerstream/.test(hay)) tags.add("powerstream");
  if (/ocean/.test(hay)) tags.add("ocean");
  if (/solaire|solar|panneau/.test(hay)) tags.add("solaire");
  if (/promo|prix|brade|deal|amazon/.test(hay)) tags.add("promo");
  if (!tags.has("ecoflow") && !tags.has("powerstream")) tags.add("ecoflow");
  return [...tags];
}

function normalizeCopy(copy: NewsLocaleCopy): NewsLocaleCopy {
  return {
    title: pricesToEuroText(copy.title).slice(0, 180),
    excerpt: pricesToEuroText(copy.excerpt || "").slice(0, 320),
    body: copy.body
      .map((p) => pricesToEuroText(p.trim()))
      .filter(Boolean)
      .map((p) => p.slice(0, 2200))
      .slice(0, 12),
  };
}

export async function buildArticleFromRss(
  item: RssItem,
  options?: { keepSlug?: string; siteId?: SiteId },
): Promise<NewsArticle | null> {
  const siteId = options?.siteId || "ecoflow";
  if (!isRelevantItem(item, siteId)) return null;

  const source = await fetchSourcePage(item.link, {
    title: item.title,
    sourceHomepage: item.sourceHomepage,
  });
  const ai = await rewriteWithAi(item, source, siteId);
  // Soft skip: keep an on-topic template article instead of dropping the item
  // (massage-gun / tumbler feeds are thin — hard skip starved the news pages).
  const aiSkipped = Boolean(ai?.skip);
  if (aiSkipped && !isRelevantItem(item, siteId)) return null;

  const rewrittenBy = !aiSkipped && ai && ai.fr && ai.en ? "ai" : "template";
  const fr = normalizeCopy(
    !aiSkipped && ai?.fr ? ai.fr : templateCopy("fr", item, source, siteId),
  );
  const en = normalizeCopy(
    !aiSkipped && ai?.en ? ai.en : templateCopy("en", item, source, siteId),
  );

  if (
    !isOnTopicArticle(
      {
        titleFr: fr.title,
        titleEn: en.title,
        excerptFr: fr.excerpt,
        excerptEn: en.excerpt,
        sourceTitle: item.title,
      },
      siteId,
    )
  ) {
    return null;
  }

  const tags = ai?.tags?.length ? ai.tags : guessTags(item, source, siteId);
  const slug =
    options?.keepSlug ||
    makeSlug(fr.title || item.title, item.publishedAt, item.guid);

  const publisherUrl =
    source?.finalUrl && isPublisherOk(source.finalUrl)
      ? source.finalUrl
      : item.link;

  const cover = await resolveNewsCover({
    sourceUrl: publisherUrl,
    sourceName: source?.sourceHint || item.sourceName,
    slug,
    title: fr.title || item.title,
    excerpt: fr.excerpt,
    tags,
    ogImageHint: source?.ogImage,
    siteId,
  });

  return {
    slug,
    siteId,
    sourceUrl: publisherUrl,
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

function isPublisherOk(url: string) {
  try {
    const u = new URL(url);
    if (/googleusercontent|gstatic/i.test(u.hostname)) return false;
    if (/\.(jpe?g|png|webp|gif)(\?|$)/i.test(u.pathname)) return false;
    return true;
  } catch {
    return false;
  }
}

/** Rebuild an existing article from its source URL (full text + image). */
export async function refreshArticle(
  article: NewsArticle,
  feedItem?: RssItem | null,
): Promise<NewsArticle> {
  const item: RssItem = {
    title: feedItem?.title || article.fr.title || article.en.title,
    link: feedItem?.link || article.sourceUrl,
    guid: article.sourceGuid,
    publishedAt: article.publishedAt,
    sourceName: feedItem?.sourceName || article.sourceName,
    sourceHomepage: feedItem?.sourceHomepage,
    description:
      feedItem?.description ||
      article.fr.excerpt ||
      article.en.excerpt ||
      "",
  };
  const next = await buildArticleFromRss(item, {
    keepSlug: article.slug,
    siteId: article.siteId || "ecoflow",
  });
  if (!next) return article;
  return {
    ...next,
    siteId: article.siteId || next.siteId || "ecoflow",
    sourceGuid: article.sourceGuid,
    publishedAt: article.publishedAt,
    ingestedAt: article.ingestedAt,
  };
}
