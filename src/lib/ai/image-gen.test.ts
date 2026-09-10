import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_NEWS_IMAGE_MODEL,
  FALLBACK_NEWS_IMAGE_MODEL,
  geminiImageGenerationConfig,
  resolveNewsImageModel,
} from "./image-gen.ts";

describe("geminiImageGenerationConfig", () => {
  it("demande une seule image 16:9, 1K sur Gemini 3", () => {
    assert.deepEqual(geminiImageGenerationConfig("gemini-3.1-flash-lite-image"), {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: "16:9", imageSize: "1K" },
    });
  });

  it("n’envoie pas imageSize sur 2.5 Flash Image", () => {
    assert.deepEqual(geminiImageGenerationConfig("gemini-2.5-flash-image"), {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: "16:9" },
    });
  });
});

describe("resolveNewsImageModel", () => {
  it("défaut Lite, pas Pro / 2K", () => {
    const prev = process.env.NEWS_IMAGE_MODEL;
    try {
      delete process.env.NEWS_IMAGE_MODEL;
      assert.equal(resolveNewsImageModel(), DEFAULT_NEWS_IMAGE_MODEL);
      assert.equal(DEFAULT_NEWS_IMAGE_MODEL, "gemini-3.1-flash-lite-image");
      assert.equal(FALLBACK_NEWS_IMAGE_MODEL, "gemini-2.5-flash-image");
    } finally {
      if (prev !== undefined) process.env.NEWS_IMAGE_MODEL = prev;
      else delete process.env.NEWS_IMAGE_MODEL;
    }
  });
});
