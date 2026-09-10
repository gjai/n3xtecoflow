import { promises as fs } from "fs";
import path from "path";
import { formatEuro, usdToEur } from "@/lib/money";

/**
 * Compteur local des appels IA (Gemini / OpenAI-compat).
 * Estimation à partir de usage.prompt_tokens / images — pas la facture Google.
 */

export type AiJob =
  | "news-rewrite"
  | "news-translate"
  | "news-image"
  | "news-short-script"
  | "news-short-image"
  | "guides-rewrite"
  | "guides-image"
  | "editorial-rewrite";

export type AiKind = "text" | "image";

export type AiDayBucket = {
  calls: number;
  textCalls: number;
  imageCalls: number;
  promptTokens: number;
  completionTokens: number;
  images: number;
  usd: number;
  byJob: Partial<Record<AiJob, { calls: number; usd: number; images: number }>>;
};

export type AiUsageStore = {
  updatedAt: string;
  days: Record<string, AiDayBucket>;
};

export type AiUsageInput = {
  kind: AiKind;
  job: AiJob;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  images?: number;
  dayKey?: string;
};

const EMPTY_BUCKET: AiDayBucket = {
  calls: 0,
  textCalls: 0,
  imageCalls: 0,
  promptTokens: 0,
  completionTokens: 0,
  images: 0,
  usd: 0,
  byJob: {},
};

const KEEP_DAYS = 90;

type ModelRates = {
  inUsdPerM: number;
  outUsdPerM: number;
  imageUsd?: number;
};

/** Tarifs Google / OpenAI publics (USD / million tokens), ~sept. 2026. */
const MODEL_RATES: Record<string, ModelRates> = {
  "gemini-2.5-flash-lite": { inUsdPerM: 0.1, outUsdPerM: 0.4 },
  "gemini-2.0-flash-lite": { inUsdPerM: 0.075, outUsdPerM: 0.3 },
  "gemini-2.5-flash": { inUsdPerM: 0.3, outUsdPerM: 2.5 },
  "gemini-2.5-flash-image": {
    inUsdPerM: 0.3,
    outUsdPerM: 30,
    imageUsd: 0.039,
  },
  "gemini-3.1-flash-lite-image": {
    inUsdPerM: 0.25,
    outUsdPerM: 30,
    imageUsd: 0.0336,
  },
  "gemini-3.1-flash-image": {
    inUsdPerM: 2.0,
    outUsdPerM: 60,
    imageUsd: 0.067,
  },
  "gpt-4o-mini": { inUsdPerM: 0.15, outUsdPerM: 0.6 },
};

function envNumber(name: string): number | undefined {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw >= 0 ? raw : undefined;
}

export function ratesForModel(model: string): ModelRates {
  const key = (model || "").toLowerCase();
  const exact = MODEL_RATES[key];
  if (exact) return applyEnvOverrides(exact);

  if (key.includes("flash-lite-image")) {
    return applyEnvOverrides(MODEL_RATES["gemini-3.1-flash-lite-image"]);
  }
  if (key.includes("3.1-flash-image")) {
    return applyEnvOverrides(MODEL_RATES["gemini-3.1-flash-image"]);
  }
  if (key.includes("flash-image") || (key.includes("image") && key.includes("gemini"))) {
    return applyEnvOverrides(MODEL_RATES["gemini-2.5-flash-image"]);
  }
  if (key.includes("flash-lite") || key.endsWith("-lite")) {
    return applyEnvOverrides(MODEL_RATES["gemini-2.5-flash-lite"]);
  }
  if (key.includes("gpt-4o-mini")) {
    return applyEnvOverrides(MODEL_RATES["gpt-4o-mini"]);
  }
  if (key.includes("gemini-2.5-flash")) {
    return applyEnvOverrides(MODEL_RATES["gemini-2.5-flash"]);
  }
  return applyEnvOverrides(MODEL_RATES["gemini-2.5-flash-lite"]);
}

function applyEnvOverrides(rates: ModelRates): ModelRates {
  return {
    inUsdPerM: envNumber("AI_PRICE_IN_USD_PER_M") ?? rates.inUsdPerM,
    outUsdPerM: envNumber("AI_PRICE_OUT_USD_PER_M") ?? rates.outUsdPerM,
    imageUsd: envNumber("AI_PRICE_IMAGE_USD") ?? rates.imageUsd,
  };
}

export function estimateUsd(input: {
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  images?: number;
}): number {
  const prompt = Math.max(0, input.promptTokens || 0);
  const completion = Math.max(0, input.completionTokens || 0);
  const images = Math.max(0, input.images || 0);
  const rates = ratesForModel(input.model);
  const inUsd = (prompt / 1_000_000) * rates.inUsdPerM;

  let usd = inUsd;
  if (images > 0) {
    if (completion > 0) {
      usd += (completion / 1_000_000) * rates.outUsdPerM;
    } else {
      usd += images * (rates.imageUsd ?? 0.039);
    }
  } else {
    usd += (completion / 1_000_000) * rates.outUsdPerM;
  }
  return Math.round(usd * 1_000_000) / 1_000_000;
}

export function parisUsageDayKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function dataPath() {
  return (
    process.env.AI_USAGE_PATH?.trim() ||
    path.join(process.cwd(), "data", "ai-usage.json")
  );
}

function emptyStore(): AiUsageStore {
  return { updatedAt: new Date(0).toISOString(), days: {} };
}

export async function readAiUsage(): Promise<AiUsageStore> {
  try {
    const raw = await fs.readFile(/*turbopackIgnore: true*/ dataPath(), "utf8");
    const parsed = JSON.parse(raw) as AiUsageStore;
    if (!parsed?.days || typeof parsed.days !== "object") return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

async function writeAiUsage(store: AiUsageStore) {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(
    /*turbopackIgnore: true*/ file,
    JSON.stringify(store, null, 2) + "\n",
    "utf8",
  );
}

let writeChain: Promise<void> = Promise.resolve();

function withStoreLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function pruneDays(days: Record<string, AiDayBucket>) {
  const keys = Object.keys(days).sort();
  if (keys.length <= KEEP_DAYS) return;
  for (const key of keys.slice(0, keys.length - KEEP_DAYS)) {
    delete days[key];
  }
}

export function emptyAiDayBucket(): AiDayBucket {
  return {
    ...EMPTY_BUCKET,
    byJob: {},
  };
}

export function addToBucket(bucket: AiDayBucket, input: AiUsageInput): AiDayBucket {
  const prompt = Math.max(0, input.promptTokens || 0);
  const completion = Math.max(0, input.completionTokens || 0);
  const images = Math.max(0, input.images || 0);
  const usd = estimateUsd({
    model: input.model,
    promptTokens: prompt,
    completionTokens: completion,
    images,
  });
  const job = bucket.byJob[input.job] || { calls: 0, usd: 0, images: 0 };
  return {
    calls: bucket.calls + 1,
    textCalls: bucket.textCalls + (input.kind === "text" ? 1 : 0),
    imageCalls: bucket.imageCalls + (input.kind === "image" ? 1 : 0),
    promptTokens: bucket.promptTokens + prompt,
    completionTokens: bucket.completionTokens + completion,
    images: bucket.images + images,
    usd: Math.round((bucket.usd + usd) * 1_000_000) / 1_000_000,
    byJob: {
      ...bucket.byJob,
      [input.job]: {
        calls: job.calls + 1,
        usd: Math.round((job.usd + usd) * 1_000_000) / 1_000_000,
        images: job.images + images,
      },
    },
  };
}

export async function recordGeminiImageUsage(args: {
  job: Extract<AiJob, "news-image" | "guides-image" | "news-short-image">;
  model: string;
  json: unknown;
  images?: number;
}): Promise<void> {
  const usage = extractGeminiUsage(args.json);
  await recordAiUsage({
    kind: "image",
    job: args.job,
    model: args.model,
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    images: args.images ?? 1,
  });
}

export async function recordAiUsage(input: AiUsageInput): Promise<void> {
  await withStoreLock(async () => {
    const store = await readAiUsage();
    const dayKey = input.dayKey || parisUsageDayKey();
    store.days[dayKey] = addToBucket(
      store.days[dayKey] || emptyAiDayBucket(),
      input,
    );
    pruneDays(store.days);
    store.updatedAt = new Date().toISOString();
    await writeAiUsage(store);
  });
}

export function extractOpenAiUsage(json: unknown): {
  promptTokens: number;
  completionTokens: number;
} {
  const usage = (json as { usage?: Record<string, unknown> } | null)?.usage;
  const prompt =
    num(usage?.prompt_tokens) ||
    num(usage?.promptTokenCount) ||
    num(usage?.input_tokens);
  const completion =
    num(usage?.completion_tokens) ||
    num(usage?.candidatesTokenCount) ||
    num(usage?.output_tokens);
  return { promptTokens: prompt, completionTokens: completion };
}

export function extractGeminiUsage(json: unknown): {
  promptTokens: number;
  completionTokens: number;
} {
  const meta = (json as { usageMetadata?: Record<string, unknown> } | null)
    ?.usageMetadata;
  return {
    promptTokens: num(meta?.promptTokenCount),
    completionTokens: num(meta?.candidatesTokenCount),
  };
}

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function mergeBuckets(buckets: AiDayBucket[]): AiDayBucket {
  return buckets.reduce(
    (acc, b) => {
      const next: AiDayBucket = {
        calls: acc.calls + b.calls,
        textCalls: acc.textCalls + b.textCalls,
        imageCalls: acc.imageCalls + b.imageCalls,
        promptTokens: acc.promptTokens + b.promptTokens,
        completionTokens: acc.completionTokens + b.completionTokens,
        images: acc.images + b.images,
        usd: Math.round((acc.usd + b.usd) * 1_000_000) / 1_000_000,
        byJob: { ...acc.byJob },
      };
      for (const [job, row] of Object.entries(b.byJob) as [
        AiJob,
        { calls: number; usd: number; images: number },
      ][]) {
        const prev = next.byJob[job] || { calls: 0, usd: 0, images: 0 };
        next.byJob[job] = {
          calls: prev.calls + row.calls,
          usd: Math.round((prev.usd + row.usd) * 1_000_000) / 1_000_000,
          images: prev.images + row.images,
        };
      }
      return next;
    },
    emptyAiDayBucket(),
  );
}

export async function summarizeAiUsage(dayKey: string): Promise<{
  dayKey: string;
  monthKey: string;
  day: AiDayBucket;
  month: AiDayBucket;
}> {
  const store = await readAiUsage();
  const monthKey = dayKey.slice(0, 7);
  const monthBuckets = Object.entries(store.days)
    .filter(([key]) => key.startsWith(`${monthKey}-`) || key === monthKey)
    .filter(([key]) => key <= dayKey)
    .map(([, bucket]) => bucket);
  return {
    dayKey,
    monthKey,
    day: store.days[dayKey] || emptyAiDayBucket(),
    month: mergeBuckets(monthBuckets),
  };
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })
    .format(amount)
    .replace(/[\u00a0\u202f]/g, " ");
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} M`;
  if (n >= 1_000) return `${Math.round(n / 100) / 10} k`;
  return String(n);
}

function moneyLine(usd: number): string {
  return `${formatUsd(usd)} (~${formatEuro(usdToEur(usd))})`;
}

const JOB_LABELS: Record<AiJob, string> = {
  "news-rewrite": "actus rewrite",
  "news-translate": "actus FR",
  "news-image": "images actus",
  "news-short-script": "scénario Short",
  "news-short-image": "images Short",
  "guides-rewrite": "guides",
  "guides-image": "images guides",
  "editorial-rewrite": "fiches EcoFlow",
};

export function formatAiUsageDigest(summary: {
  dayKey: string;
  monthKey: string;
  day: AiDayBucket;
  month: AiDayBucket;
}): string[] {
  const lines = [
    `=== Coûts IA (estim. tarifs Google) ===`,
    `Hier (${summary.dayKey}) : ${moneyLine(summary.day.usd)} · ${summary.day.textCalls} appels texte · ${summary.day.images} image(s) · ${formatTokens(summary.day.promptTokens)} tok in / ${formatTokens(summary.day.completionTokens)} tok out`,
    `Mois ${summary.monthKey} (jusqu’à hier) : ${moneyLine(summary.month.usd)} · ${summary.month.calls} appels`,
  ];

  const jobs = Object.entries(summary.day.byJob) as [
    AiJob,
    { calls: number; usd: number; images: number },
  ][];
  if (jobs.length) {
    lines.push(
      `Répartition hier : ${jobs
        .sort((a, b) => b[1].usd - a[1].usd)
        .map(
          ([job, row]) =>
            `${JOB_LABELS[job] || job} ${formatUsd(row.usd)} (${row.calls})`,
        )
        .join(" · ")}`,
    );
  }
  if (summary.day.calls === 0 && summary.month.calls === 0) {
    lines.push(
      `Aucun appel enregistré — le compteur démarre au déploiement de ce suivi.`,
    );
  }
  lines.push(
    `Note : estimation locale (tokens + images), la facture Google AI Studio peut différer.`,
  );
  return lines;
}
