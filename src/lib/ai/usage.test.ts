import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import {
  addToBucket,
  emptyAiDayBucket,
  estimateUsd,
  extractGeminiUsage,
  extractOpenAiUsage,
  formatAiUsageDigest,
  mergeBuckets,
  ratesForModel,
  recordAiUsage,
} from "./usage.ts";

describe("estimateUsd", () => {
  it("chiffre gemini-2.5-flash-lite à 0,10 / 0,40 $ par million de tokens", () => {
    assert.equal(
      estimateUsd({
        model: "gemini-2.5-flash-lite",
        promptTokens: 1_000_000,
        completionTokens: 1_000_000,
      }),
      0.5,
    );
    assert.equal(
      estimateUsd({
        model: "gemini-2.5-flash-lite",
        promptTokens: 10_000,
        completionTokens: 4_000,
      }),
      0.0026,
    );
  });

  it("facture une image Flash à 0,039 $ sans tokens de sortie", () => {
    assert.equal(
      estimateUsd({
        model: "gemini-2.5-flash-image",
        images: 1,
      }),
      0.039,
    );
  });

  it("préfère les tokens de sortie pour une image si usageMetadata est là", () => {
    assert.equal(
      estimateUsd({
        model: "gemini-2.5-flash-image",
        completionTokens: 1290,
        images: 1,
      }),
      0.0387,
    );
  });

  it("reconnaît un alias de modèle image", () => {
    assert.equal(ratesForModel("models/gemini-2.5-flash-image").imageUsd, 0.039);
  });
});

describe("extract usage", () => {
  it("lit usage OpenAI-compat", () => {
    assert.deepEqual(
      extractOpenAiUsage({
        usage: { prompt_tokens: 120, completion_tokens: 40 },
      }),
      { promptTokens: 120, completionTokens: 40 },
    );
  });

  it("lit usageMetadata Gemini native", () => {
    assert.deepEqual(
      extractGeminiUsage({
        usageMetadata: { promptTokenCount: 80, candidatesTokenCount: 1290 },
      }),
      { promptTokens: 80, completionTokens: 1290 },
    );
  });
});

describe("buckets", () => {
  it("agrège jour et mois", () => {
    const a = addToBucket(emptyAiDayBucket(), {
      kind: "text",
      job: "news-rewrite",
      model: "gemini-2.5-flash-lite",
      promptTokens: 10_000,
      completionTokens: 4_000,
    });
    const b = addToBucket(emptyAiDayBucket(), {
      kind: "image",
      job: "news-image",
      model: "gemini-2.5-flash-image",
      images: 1,
    });
    const month = mergeBuckets([a, b]);
    assert.equal(month.calls, 2);
    assert.equal(month.textCalls, 1);
    assert.equal(month.images, 1);
    assert.equal(month.usd, 0.0416);
  });

  it("formate un digest vide", () => {
    const lines = formatAiUsageDigest({
      dayKey: "2026-09-08",
      monthKey: "2026-09",
      day: emptyAiDayBucket(),
      month: emptyAiDayBucket(),
    });
    assert.match(lines[0], /Coûts IA/);
    assert.match(lines.join("\n"), /Aucun appel enregistré/);
  });
});

describe("recordAiUsage", () => {
  it("persiste un bucket jour", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "ai-usage-"));
    process.env.AI_USAGE_PATH = path.join(dir, "ai-usage.json");
    await recordAiUsage({
      kind: "text",
      job: "guides-rewrite",
      model: "gemini-2.5-flash-lite",
      promptTokens: 1000,
      completionTokens: 500,
      dayKey: "2026-09-08",
    });
    const raw = await readFile(process.env.AI_USAGE_PATH, "utf8");
    const store = JSON.parse(raw) as {
      days: Record<string, { calls: number; usd: number }>;
    };
    assert.equal(store.days["2026-09-08"].calls, 1);
    assert.ok(store.days["2026-09-08"].usd > 0);
  });
});
