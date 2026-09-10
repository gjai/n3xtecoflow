import { completeChat } from "@/lib/ai/chat";
import { generateGeminiImage } from "@/lib/ai/image-gen";
import { getGameLatest, readFdjGamesStore } from "@/lib/fdj-games/store";
import { buildNextDrawSnapshot } from "@/lib/lottery/next-draw";
import { generateNewsShortPhotos, type NewsShortScript, type NewsShortVisuel } from "./news-short-script";
import { parisDateKey } from "./datetime";
import { readEuroMillionsStore } from "./store";

export type JackpotGame = "euromillions" | "loto";

export type JackpotTarget = {
  game: JackpotGame;
  jackpotEur: number;
  drawDate: string;
  label: string;
};

export type JackpotBuyItem = {
  name: string;
  priceEur: number;
  line: string;
  imagePrompt: string;
};

export const JACKPOT_BUYS_KICKER = "TICKET GAGNANT";
export const JACKPOT_BUYS_CTA = "pour le prochain jackpot";

function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(8, max - 1)).trimEnd()}…`;
}

export function jackpotSpokenFr(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const rounded = m >= 20 ? Math.round(m) : Math.round(m * 10) / 10;
    const s = Number.isInteger(rounded)
      ? String(rounded)
      : String(rounded).replace(".", ",");
    return `${s} millions`;
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace(/[\u00a0\u202f]/g, " ");
}

/** Le prochain jackpot à mettre en avant : le plus gros, EuroMillions en cas d’égalité. */
export function pickNextJackpot(args: {
  em?: { date?: string | null; jackpotEur?: number | null };
  loto?: { date?: string | null; jackpotEur?: number | null };
}): JackpotTarget | null {
  const em =
    typeof args.em?.jackpotEur === "number" && args.em.jackpotEur >= 1_000_000
      ? {
          game: "euromillions" as const,
          jackpotEur: args.em.jackpotEur,
          drawDate: args.em.date || "",
          label: "EuroMillions",
        }
      : null;
  const loto =
    typeof args.loto?.jackpotEur === "number" && args.loto.jackpotEur >= 1_000_000
      ? {
          game: "loto" as const,
          jackpotEur: args.loto.jackpotEur,
          drawDate: args.loto.date || "",
          label: "Loto",
        }
      : null;
  if (em && loto) return em.jackpotEur >= loto.jackpotEur ? em : loto;
  return em || loto;
}

const SYSTEM = JSON.stringify(
  {
    system_role:
      "Tu imagines 3 achats ABSURDES mais payables avec UN jackpot de loterie. Ton, rock, second degré. Prix en euros, ordre de grandeur réel.",
    constraints: {
      count: "Exactement 3 objets. Chacun coûte moins que le jackpot. La somme des 3 ≤ jackpot.",
      crazy:
        "Fou mais visuel : île, yacht, château, club de foot, avion, hôtel particulier, fusée touristique, zoo privé… Pas de drogue, pas d’armes, pas de politique. Images : marque et texte interdits, visages OK.",
      temps:
        "Hypothèse : SI on gagnait le PROCHAIN jackpot. Jamais le passé (« vous avez gagné », « l’EuroMillions vous a offert »). Jamais je/j’achète.",
      texte:
        "title ≤ 68 car. Accroche : 2 phrases (jeu + montant + date, SANS citer les 3 objets). Chaque objet : 1 phrase en on/vous qui NOMME l’objet et le prix. Chute : 1 phrase + une question. Pas de CTA abonnement.",
      images:
        "imagePrompt EN, 9:16 photoreal cinematic, people allowed, no text no logo no letters no brand names in the image.",
    },
    output_format:
      '{"title":"...","accroche":"...","items":[{"name":"...","priceEur":0,"line":"...","imagePrompt":"..."}],"chute":"..."}',
  },
  null,
  2,
);

export const JACKPOT_BUYS_SYSTEM_PROMPT = SYSTEM;

export function jackpotBuysUserPrompt(
  target: JackpotTarget,
  avoidFacts: string[] = [],
): string {
  return JSON.stringify(
    {
      jeu: target.label,
      date_tirage: target.drawDate,
      jackpot_eur: target.jackpotEur,
      jackpot_dit: jackpotSpokenFr(target.jackpotEur),
      eviter: avoidFacts.slice(-8),
      consigne: `3 achats fous payables avec ${jackpotSpokenFr(target.jackpotEur)} au ${target.label}. Varie les univers. Prix crédibles. Ne répète pas les objets déjà listés dans eviter.`,
    },
    null,
    2,
  );
}

export async function resolveNextJackpotTarget(): Promise<JackpotTarget | null> {
  const em = await readEuroMillionsStore();
  const fdj = await readFdjGamesStore();
  const next = buildNextDrawSnapshot(em, fdj);
  const loto = getGameLatest(fdj, "loto");
  const lotoDate = next.loto?.at
    ? parisDateKey(new Date(next.loto.at))
    : loto?.date || null;
  return pickNextJackpot({
    em: { date: em.nextDrawDate, jackpotEur: em.nextJackpotEur ?? null },
    loto: { date: lotoDate, jackpotEur: loto?.jackpotEur ?? null },
  });
}

export async function generateJackpotBuyPhotos(
  script: NewsShortScript,
): Promise<Buffer[]> {
  const visuels = (script.visuels || []).slice(0, 3);
  const bufs: Buffer[] = [];
  for (const v of visuels) {
    const scene = String(v.imagePrompt || v.plan || "luxury prize cinematic still").trim();
    const img = await generateGeminiImage({
      job: "news-short-image",
      aspectRatio: "9:16",
      prompt: `Vertical 9:16 photoreal cinematic still, no text, no letters, no logo, no watermark. Subject: ${scene}.`,
    });
    if (img?.buf) bufs.push(img.buf);
  }
  if (bufs.length >= 3) return bufs.slice(0, 3);
  const stock = await generateNewsShortPhotos(script);
  for (const extra of stock) {
    if (bufs.length >= 3) break;
    bufs.push(extra);
  }
  return bufs.slice(0, 3);
}

function jackpotBuysBody(items: JackpotBuyItem[], chute: string): string {
  const strip = (s: string) => s.replace(/[.!?…]+$/g, "").trim();
  const end = strip(chute).replace(/[.!?]+\s+/g, " — ");
  return [
    `${strip(items[0]!.line)}.`,
    `${strip(items[1]!.line)}.`,
    `${strip(items[2]!.line)} — ${end}.`,
  ].join(" ");
}

function asPrice(value: unknown, max: number): number {
  const n = typeof value === "number" ? value : Number(String(value || "").replace(/\s/g, ""));
  if (!Number.isFinite(n) || n < 50_000) return 0;
  return Math.min(max, Math.round(n));
}

export function parseJackpotBuysAiJson(
  raw: string,
  target: JackpotTarget,
): NewsShortScript | null {
  let parsed: {
    title?: string;
    accroche?: string;
    items?: unknown;
    chute?: string;
  };
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    parsed = JSON.parse(start >= 0 ? raw.slice(start, end + 1) : raw);
  } catch {
    return null;
  }
  const title = clip(String(parsed.title || ""), 88);
  const excerpt = clip(String(parsed.accroche || ""), 420);
  const rawItems = Array.isArray(parsed.items) ? parsed.items : [];
  const items: JackpotBuyItem[] = [];
  for (const row of rawItems) {
    const r = row as Record<string, unknown>;
    const name = clip(String(r.name || r.nom || ""), 48);
    const line = clip(String(r.line || r.phrase || ""), 220);
    const imagePrompt = clip(String(r.imagePrompt || r.plan || ""), 280);
    const priceEur = asPrice(r.priceEur ?? r.prix, target.jackpotEur);
    if (name.length < 3 || line.length < 18 || priceEur <= 0) continue;
    items.push({
      name,
      priceEur,
      line,
      imagePrompt:
        imagePrompt.length > 12
          ? imagePrompt
          : `Vertical 9:16 photoreal cinematic still of ${name}, no text, no logo`,
    });
    if (items.length === 3) break;
  }
  const chute = clip(String(parsed.chute || ""), 280);
  if (title.length < 12 || excerpt.length < 18 || items.length !== 3 || chute.length < 12) {
    return null;
  }
  const sum = items.reduce((a, it) => a + it.priceEur, 0);
  if (sum > target.jackpotEur * 1.05) return null;
  const body = jackpotBuysBody(items, chute);
  const visuels: NewsShortVisuel[] = items.map((it, i) => ({
    at: i === 0 ? "accroche" : i === 1 ? "corps" : "chute",
    plan: it.name,
    fond: i === 0 ? "gold" : i === 1 ? "navy" : "warm",
    imagePrompt: it.imagePrompt,
  }));
  const spoken = jackpotSpokenFr(target.jackpotEur);
  return {
    title,
    excerpt,
    body,
    game: target.game,
    fact: `${target.label} ${spoken} : ${items.map((it) => it.name).join(" / ")}`,
    permalink: "https://euromillions-resultats.fr/fr",
    imageSrc: null,
    source: "ai",
    voix: false,
    music: "ironie",
    sfx: ["whoosh", "sting"],
    visuels,
  };
}

function fallbackJackpotBuys(target: JackpotTarget): NewsShortScript {
  const spoken = jackpotSpokenFr(target.jackpotEur);
  const budget = target.jackpotEur * 0.9;
  const weights = [38, 45, 22];
  const wsum = weights.reduce((a, b) => a + b, 0);
  const prices = weights.map((w) => Math.max(80_000, Math.round((w / wsum) * budget)));
  const items: JackpotBuyItem[] = [
    {
      name: "une île privée",
      priceEur: prices[0]!,
      line: `D’abord une île privée, ${jackpotSpokenFr(prices[0]!)} : plage, piste, et zéro voisin.`,
      imagePrompt:
        "Vertical 9:16 photoreal cinematic still of a tiny tropical private island with a villa and white beach, no text no logo",
    },
    {
      name: "un yacht de 70 mètres",
      priceEur: prices[1]!,
      line: `Ensuite un yacht de 70 mètres, environ ${jackpotSpokenFr(prices[1]!)}, hélipad compris.`,
      imagePrompt:
        "Vertical 9:16 photoreal cinematic still of a huge luxury yacht at sunset, helipad, no text no logo",
    },
    {
      name: "un club de Ligue 2",
      priceEur: prices[2]!,
      line: `Et un club de Ligue 2 racheté cash, autour de ${jackpotSpokenFr(prices[2]!)}.`,
      imagePrompt:
        "Vertical 9:16 photoreal cinematic still of an empty floodlit football stadium at night, no text no logo no letters",
    },
  ];
  const visuels: NewsShortVisuel[] = items.map((it, i) => ({
    at: i === 0 ? "accroche" : i === 1 ? "corps" : "chute",
    plan: it.name,
    fond: i === 0 ? "gold" : i === 1 ? "navy" : "warm",
    imagePrompt: it.imagePrompt,
  }));
  return {
    title: `3 achats fous avec ${spoken} au ${target.label}`,
    excerpt: `Prochain ${target.label} : ${spoken} d’euros. Voici trois folies que ça paie encore.`,
    body: jackpotBuysBody(
      items,
      "Il resterait même de la monnaie. Vous commencerez par quoi ?",
    ),
    game: target.game,
    fact: `${target.label} ${spoken} : île / yacht / club`,
    permalink: "https://euromillions-resultats.fr/fr",
    imageSrc: null,
    source: "fallback",
    voix: false,
    music: "ironie",
    sfx: ["whoosh", "sting"],
    visuels,
  };
}

export async function composeJackpotBuysScript(options: {
  target: JackpotTarget;
  skipAi?: boolean;
  avoidFacts?: string[];
}): Promise<NewsShortScript> {
  if (!options.skipAi) {
    const result = await completeChat({
      job: "news-short-script",
      siteId: "euromillions",
      logTag: "ai_jackpot_buys_failed",
      temperature: 0.85,
      maxTokens: 1600,
      timeoutMs: 45_000,
      system: SYSTEM,
      user: jackpotBuysUserPrompt(options.target, options.avoidFacts || []),
    });
    if (result?.content) {
      const parsed = parseJackpotBuysAiJson(result.content, options.target);
      if (parsed) return parsed;
    }
  }
  return fallbackJackpotBuys(options.target);
}
