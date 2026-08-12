import type { LocaleCopy, Product } from "@/data/products";
import { ECOFLOW_HANDLES } from "./handles";
import {
  readEcoflowEditorialStore,
  writeEcoflowEditorialStore,
} from "./editorial-store";
import type { EcoflowEditorialEntry } from "./editorial-types";
import { fetchShopifyProduct, stripHtml } from "./shopify";

type AiPayload = {
  fr: LocaleCopy;
  en: LocaleCopy;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isValidCopy(c: LocaleCopy | undefined): c is LocaleCopy {
  return Boolean(
    c?.tagline &&
      c?.summary &&
      c?.bestFor &&
      Array.isArray(c.pros) &&
      c.pros.length >= 2 &&
      Array.isArray(c.cons) &&
      c.cons.length >= 1 &&
      Array.isArray(c.body) &&
      c.body.length >= 2,
  );
}

async function rewriteEditorialWithAi(
  product: Product,
  sourceTitle: string,
  sourceText: string,
): Promise<{ copy: AiPayload; model: string } | null> {
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

  const prompt = `Tu rédiges des fiches produit pour EcoFlow Stream (site éditorial indépendant FR/EN, affiliation Amazon).

Mission: fiche ORIGINAL bilingue à partir de la fiche officielle EcoFlow (pas de copier-coller).

Règles:
- Ne pas inventer de specs/chiffres absents de la source ou du catalogue fourni
- Ton clair, concret, non marketing mensonger
- Pros/cons honnêtes (limites réelles)
- body = 3 à 5 paragraphes utiles (usage, public, points de vigilance)
- JSON strict uniquement, sans markdown

Produit catalogue:
slug=${product.slug}
name=${product.name}
category=${product.category}
capacityWh=${product.capacityWh ?? ""}
outputW=${product.outputW ?? ""}
specs=${JSON.stringify(product.specs)}

Source EcoFlow:
title=${sourceTitle}
text=<<
${sourceText.slice(0, 6000)}
>>

Format:
{"fr":{"tagline":"...","summary":"...","bestFor":"...","pros":["..."],"cons":["..."],"body":["..."]},"en":{"tagline":"...","summary":"...","bestFor":"...","pros":["..."],"cons":["..."],"body":["..."]}}`;

  const payload: Record<string, unknown> = {
    model,
    temperature: 0.4,
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content:
          "You write bilingual product editorial sheets as strict JSON only. No markdown fences.",
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
    console.error("editorial_ai_failed", res.status, await res.text());
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
    if (!isValidCopy(parsed.fr) || !isValidCopy(parsed.en)) return null;
    return { copy: parsed, model };
  } catch {
    return null;
  }
}

/** Fallback non-IA : reformulation légère à partir de la source. */
function templateFromSource(
  product: Product,
  sourceTitle: string,
  sourceText: string,
): AiPayload {
  const snippet = sourceText.slice(0, 420) || product.fr.summary;
  return {
    fr: {
      tagline: product.fr.tagline,
      summary: snippet.slice(0, 220),
      bestFor: product.fr.bestFor,
      pros: product.fr.pros,
      cons: product.fr.cons,
      body: [
        `${sourceTitle} — synthèse éditoriale automatique pour EcoFlow Stream.`,
        snippet,
        "Vérifiez toujours capacité (Wh), puissance (W) et le prix du jour avant d’acheter.",
      ],
    },
    en: {
      tagline: product.en.tagline,
      summary: (sourceText.slice(0, 220) || product.en.summary).slice(0, 220),
      bestFor: product.en.bestFor,
      pros: product.en.pros,
      cons: product.en.cons,
      body: [
        `${sourceTitle} — automated editorial summary for EcoFlow Stream.`,
        sourceText.slice(0, 420) || product.en.summary,
        "Always confirm capacity (Wh), output (W), and live pricing before buying.",
      ],
    },
  };
}

export type RefreshEditorialResult = {
  ok: boolean;
  refreshed: number;
  failed: number;
  skipped: number;
  total: number;
  usedAi: boolean;
  errors: string[];
};

export async function refreshEcoflowEditorial(options?: {
  limit?: number;
  /** Force rewrite even if entry exists */
  force?: boolean;
}): Promise<RefreshEditorialResult> {
  const { products } = await import("@/data/products");
  const store = await readEcoflowEditorialStore();
  const mapped = products.filter((p) => ECOFLOW_HANDLES[p.slug]);
  const list = mapped.slice(0, options?.limit ?? mapped.length);
  const errors: string[] = [];
  let refreshed = 0;
  let failed = 0;
  let skipped = 0;
  let usedAi = false;
  const entries = { ...store.entries };
  const now = new Date().toISOString();

  for (const product of list) {
    if (!options?.force && entries[product.slug] && !entries[product.slug].error) {
      skipped += 1;
      continue;
    }

    const handle = ECOFLOW_HANDLES[product.slug];
    try {
      const shop = await fetchShopifyProduct(handle);
      const sourceTitle = shop?.title || product.name;
      const sourceText = stripHtml(shop?.body_html) || product.fr.summary;
      const ai = await rewriteEditorialWithAi(product, sourceTitle, sourceText);
      const copy = ai?.copy || templateFromSource(product, sourceTitle, sourceText);
      if (ai) usedAi = true;

      const entry: EcoflowEditorialEntry = {
        slug: product.slug,
        fr: copy.fr,
        en: copy.en,
        sourceHandle: handle,
        updatedAt: now,
        model: ai?.model || "template",
      };
      entries[product.slug] = entry;
      refreshed += 1;
    } catch (err) {
      failed += 1;
      const msg = err instanceof Error ? err.message : "unknown";
      errors.push(`${product.slug}: ${msg}`);
    }
    await sleep(aiThrottleMs());
  }

  await writeEcoflowEditorialStore({ updatedAt: now, entries });

  return {
    ok: failed === 0,
    refreshed,
    failed,
    skipped,
    total: list.length,
    usedAi,
    errors,
  };
}

function aiThrottleMs() {
  return Number(process.env.ECOFLOW_EDITORIAL_DELAY_MS || 400);
}
