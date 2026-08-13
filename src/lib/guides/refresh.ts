import type { ArticleSection } from "@/data/articles";
import { guides as staticGuides } from "@/data/articles";
import { casinosCryptoGuideCovers } from "@/data/casinos-crypto-guides";
import { euromillionsGuideCovers } from "@/data/euromillions-guides";
import { tumblerGuideCovers } from "@/data/tumbler-guides";
import { getEditorial, siteUsesStaticBuyingGuide } from "@/sites/editorial";
import { getSiteById } from "@/sites/index";
import type { SiteId } from "@/sites/types";
import { generateGuideCoverAi } from "./images";
import { readGuidesStore, writeGuidesStore } from "./store";
import {
  GUIDE_TOPICS,
  guideSiteId,
  guidesForSite,
  type GuideEntry,
  type GuideLocaleCopy,
  type GuideTopic,
} from "./types";


function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isValidCopy(c: GuideLocaleCopy | undefined): c is GuideLocaleCopy {
  return Boolean(
    c?.title &&
      c?.subtitle &&
      Array.isArray(c.sections) &&
      c.sections.length >= 5 &&
      c.sections.every(
        (s) =>
          s.heading &&
          Array.isArray(s.paragraphs) &&
          s.paragraphs.length >= 1,
      ),
  );
}

async function rewriteGuideWithAi(topic: GuideTopic): Promise<{
  fr: GuideLocaleCopy;
  en: GuideLocaleCopy;
  model: string;
} | null> {
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

  const existing = staticGuides.find((g) => g.slug === topic.slug);

  const site = guideSiteId(topic);
  const brand = getSiteById(site).brand.name;
  const scope = getEditorial(site).guideScope;

  const prompt = `Tu rédiges un GUIDE D'ACHAT long et utile pour ${brand} (site éditorial indépendant FR/EN, affiliation Amazon).

Périmètre STRICT: ${scope}

Sujet FR: ${topic.topicFr}
Angle FR: ${topic.angleFr}
Sujet EN: ${topic.topicEn}
Angle EN: ${topic.angleEn}
Slug: ${topic.slug}

${existing ? `Base existante FR (à enrichir, ne pas copier coller):\n${JSON.stringify(existing.fr).slice(0, 2500)}\n` : ""}

Règles:
- Contenu ORIGINAL, concret, honnête (limites + erreurs fréquentes)
- Ne pas inventer de prix chiffrés Amazon
- Prix UNIQUEMENT en euros (€) si un montant est cité — jamais de dollars ($ / USD)
- Chaque langue: title, subtitle, sections = 7 à 10 sections
- Chaque section: heading + 2 à 4 paragraphs utiles (+ bullets optionnels)
- Couvrir: contexte, méthode, cas d'usage, critères, pièges, checklist, conclusion actionable
- JSON strict uniquement

Format:
{"fr":{"title":"...","subtitle":"...","sections":[{"heading":"...","paragraphs":["..."],"bullets":["..."]}]},"en":{"title":"...","subtitle":"...","sections":[{"heading":"...","paragraphs":["..."],"bullets":["..."]}]}}`;

  const payload: Record<string, unknown> = {
    model,
    temperature: 0.45,
    max_tokens: 8192,
    messages: [
      {
        role: "system",
        content: `You write long bilingual ${brand} buying guides as strict JSON only. No markdown fences.`,
      },
      { role: "user", content: prompt },
    ],
  };
  if (!usingGemini) payload.response_format = { type: "json_object" };

  const res = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error("guide_ai_failed", res.status, await res.text());
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
    const parsed = JSON.parse(content) as {
      fr: GuideLocaleCopy;
      en: GuideLocaleCopy;
    };
    if (!isValidCopy(parsed.fr) || !isValidCopy(parsed.en)) return null;
    return { fr: parsed.fr, en: parsed.en, model };
  } catch {
    return null;
  }
}

function expandStatic(
  sections: ArticleSection[],
  siteId?: SiteId,
): ArticleSection[] {
  if (sections.length >= 5) return sections;
  const ed = siteId ? getEditorial(siteId) : getEditorial("ecoflow");
  return [
    ...sections,
    {
      heading: "Checklist avant achat",
      paragraphs: [
        ed.checklistFr,
        "Vérifiez le prix du jour sur Amazon avant de commander.",
      ],
    },
  ];
}

function fromTopic(topic: GuideTopic): GuideEntry {
  const site = guideSiteId(topic);
  const ed = getEditorial(site);
  const productHintFr = ed.productHintFr;
  const productHintEn = ed.productHintEn;
  const checklistFr = ed.checklistFr;
  const checklistEn = ed.checklistEn;

  return {
    slug: topic.slug,
    siteId: site,
    fr: {
      title: topic.topicFr,
      subtitle: topic.angleFr,
      sections: [
        {
          heading: "Guide en cours d’enrichissement",
          paragraphs: [
            `Ce guide couvre : ${topic.angleFr}.`,
            "Le contenu détaillé est généré et mis à jour automatiquement — revenez bientôt pour la version complète.",
          ],
        },
        {
          heading: "En attendant",
          paragraphs: [productHintFr],
        },
        {
          heading: "Checklist rapide",
          paragraphs: [checklistFr],
        },
        {
          heading: "Affiliation",
          paragraphs: [
            "Les liens Amazon de ce site sont affiliés : un achat via ces liens peut nous soutenir sans surcoût.",
          ],
        },
        {
          heading: "Suite",
          paragraphs: [
            "Consultez aussi les autres guides d’achat et les comparatifs par gamme.",
          ],
        },
      ],
    },
    en: {
      title: topic.topicEn,
      subtitle: topic.angleEn,
      sections: [
        {
          heading: "Guide being enriched",
          paragraphs: [
            `This guide covers: ${topic.angleEn}.`,
            "Detailed content is generated and updated automatically — check back soon for the full version.",
          ],
        },
        {
          heading: "Meanwhile",
          paragraphs: [productHintEn],
        },
        {
          heading: "Quick checklist",
          paragraphs: [checklistEn],
        },
        {
          heading: "Affiliation",
          paragraphs: [
            "Amazon links on this site are affiliate links and may support us at no extra cost to you.",
          ],
        },
        {
          heading: "Next steps",
          paragraphs: [
            "Also explore the other buying guides and category comparison hubs.",
          ],
        },
      ],
    },
    model: "stub",
    updatedAt: new Date().toISOString(),
  };
}

function fromStatic(slug: string): GuideEntry | null {
  const topic = GUIDE_TOPICS.find((t) => t.slug === slug);
  const g = staticGuides.find((x) => x.slug === slug);
  if (!g) {
    return topic ? fromTopic(topic) : null;
  }
  const cover =
    tumblerGuideCovers[slug] ||
    casinosCryptoGuideCovers[slug] ||
    euromillionsGuideCovers[slug];
  const site = guideSiteId(topic);
  const loc = (copy: typeof g.fr) => ({
    title: copy.title,
    subtitle: copy.subtitle,
    sections: expandStatic(copy.sections, site),
  });
  return {
    slug,
    siteId: site,
    fr: loc(g.fr),
    en: loc(g.en),
    ...(g.it ? { it: loc(g.it) } : {}),
    ...(g.es ? { es: loc(g.es) } : {}),
    ...(g.pt ? { pt: loc(g.pt) } : {}),
    ...(g.de ? { de: loc(g.de) } : {}),
    ...(g.nl ? { nl: loc(g.nl) } : {}),
    model: "static",
    updatedAt: new Date().toISOString(),
    ...(cover
      ? { imageSrc: cover.src, imageCredit: cover.credit }
      : {}),
  };
}


export type RefreshGuidesResult = {
  ok: boolean;
  refreshed: number;
  images: number;
  failed: number;
  skipped: number;
  total: number;
  usedAi: boolean;
  errors: string[];
};

export async function refreshGuides(options?: {
  limit?: number;
  force?: boolean;
  imagesOnly?: boolean;
  /** Defaults to ecoflow (cron / existing AI prompts). */
  siteId?: SiteId;
}): Promise<RefreshGuidesResult> {
  const store = await readGuidesStore();
  const siteId = options?.siteId ?? "ecoflow";
  const list = guidesForSite(GUIDE_TOPICS, siteId).slice(
    0,
    options?.limit ?? GUIDE_TOPICS.length,
  );
  const errors: string[] = [];
  let refreshed = 0;
  let images = 0;
  let failed = 0;
  let skipped = 0;
  let usedAi = false;
  const entries = { ...store.entries };
  const now = new Date().toISOString();

  for (const topic of list) {
    const existing = entries[topic.slug];
    if (
      !options?.force &&
      !options?.imagesOnly &&
      existing &&
      (existing.fr.sections?.length || 0) >= 6
    ) {
      skipped += 1;
      continue;
    }

    try {
      let entry = existing;
      if (!options?.imagesOnly) {
        const ai = await rewriteGuideWithAi(topic);
        if (ai) {
          usedAi = true;
          entry = {
            slug: topic.slug,
            siteId: guideSiteId(topic),
            fr: ai.fr,
            en: ai.en,
            model: ai.model,
            updatedAt: now,
            imageSrc: existing?.imageSrc,
            imageCredit: existing?.imageCredit,
          };
        } else {
          entry = existing || fromStatic(topic.slug) || undefined;
          if (!entry) {
            failed += 1;
            errors.push(`${topic.slug}: no_ai_no_static`);
            continue;
          }
          entry = { ...entry, updatedAt: now };
        }
      }

      if (!entry) {
        failed += 1;
        continue;
      }

      if (!entry.imageSrc || options?.force || options?.imagesOnly) {
        const cover = await generateGuideCoverAi({
          slug: topic.slug,
          title: entry.fr.title,
          subtitle: entry.fr.subtitle,
          siteId: guideSiteId(topic),
        });
        if (cover) {
          entry.imageSrc = cover.imageSrc;
          entry.imageCredit = cover.imageCredit;
          images += 1;
        }
      }

      entries[topic.slug] = entry;
      refreshed += 1;
    } catch (err) {
      failed += 1;
      errors.push(
        `${topic.slug}: ${err instanceof Error ? err.message : "unknown"}`,
      );
    }
    await sleep(Number(process.env.GUIDES_AI_DELAY_MS || 500));
  }

  await writeGuidesStore({ updatedAt: now, entries });
  return {
    ok: failed === 0,
    refreshed,
    images,
    failed,
    skipped,
    total: list.length,
    usedAi,
    errors,
  };
}

/** Resolve guide for pages: AI store first (if rich), then static seed. */
export async function resolveGuide(
  slug: string,
  siteId?: SiteId,
): Promise<GuideEntry | null> {
  const topic = GUIDE_TOPICS.find((t) => t.slug === slug);
  if (siteId && topic && guideSiteId(topic) !== siteId) return null;
  const staticEntry = fromStatic(slug);

  // Thèmes flat : guide éditorial unique avec productSlugs — toujours le seed static
  if (siteId && siteUsesStaticBuyingGuide(siteId) && staticEntry) {
    return { ...staticEntry, siteId };
  }


  const stored = (await readGuidesStore()).entries[slug];
  const storedRich =
    stored &&
    stored.model !== "stub" &&
    (stored.fr?.sections?.length || 0) >= 6;
  const entry = storedRich ? stored : staticEntry || stored || null;
  if (!entry) return null;
  const owner = topic ? guideSiteId(topic) : guideSiteId(entry);
  if (siteId && owner !== siteId) return null;
  // Keep static cover when store entry has no image
  if (!entry.imageSrc && staticEntry?.imageSrc) {
    return {
      ...entry,
      siteId: owner,
      imageSrc: staticEntry.imageSrc,
      imageCredit: staticEntry.imageCredit,
    };
  }
  return { ...entry, siteId: owner };
}

export async function resolveAllGuides(siteId?: SiteId): Promise<GuideEntry[]> {
  const store = await readGuidesStore();
  const topics = siteId ? guidesForSite(GUIDE_TOPICS, siteId) : GUIDE_TOPICS;
  const bySlug = new Map<string, GuideEntry>();
  for (const topic of topics) {
    if (siteId && siteUsesStaticBuyingGuide(siteId)) {
      const staticEntry = fromStatic(topic.slug);
      if (staticEntry) {
        bySlug.set(topic.slug, { ...staticEntry, siteId });
      }
      continue;
    }
    const stored = store.entries[topic.slug];
    const staticEntry = fromStatic(topic.slug)!;
    const storedRich =
      stored &&
      stored.model !== "stub" &&
      (stored.fr?.sections?.length || 0) >= 6;
    const entry = storedRich ? stored : staticEntry;
    bySlug.set(topic.slug, {
      ...entry,
      siteId: guideSiteId(topic),
      imageSrc: entry.imageSrc || staticEntry.imageSrc,
      imageCredit: entry.imageCredit || staticEntry.imageCredit,
    });
  }
  // EcoFlow only: keep orphan AI store entries not in GUIDE_TOPICS
  if (!siteId || siteId === "ecoflow") {
    for (const [slug, e] of Object.entries(store.entries)) {
      if (bySlug.has(slug)) continue;
      if (siteId && guideSiteId(e) !== siteId) continue;
      bySlug.set(slug, e);
    }
  }
  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}
