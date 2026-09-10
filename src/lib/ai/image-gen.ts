import { recordGeminiImageUsage, type AiJob } from "./usage";

/** Default: Nano Banana 2 Lite (~0,0336 $/1K) — override via NEWS_IMAGE_MODEL. */
export const DEFAULT_NEWS_IMAGE_MODEL = "gemini-3.1-flash-lite-image";
export const FALLBACK_NEWS_IMAGE_MODEL = "gemini-2.5-flash-image";

export function resolveNewsImageModel(): string {
  return process.env.NEWS_IMAGE_MODEL?.trim() || DEFAULT_NEWS_IMAGE_MODEL;
}

export type GeminiImageAspect = "16:9" | "9:16";

export function geminiImageGenerationConfig(
  model: string,
  aspectRatio: GeminiImageAspect = "16:9",
): {
  responseModalities: ["IMAGE"];
  imageConfig: { aspectRatio: GeminiImageAspect; imageSize?: "1K" };
} {
  const imageConfig: { aspectRatio: GeminiImageAspect; imageSize?: "1K" } = {
    aspectRatio,
  };
  // 2.5 Flash Image is billed as a single ~1K size and may reject imageSize.
  if (/gemini-3/i.test(model)) {
    imageConfig.imageSize = "1K";
  }
  return {
    responseModalities: ["IMAGE"],
    imageConfig,
  };
}

function readPngSize(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 24 || buf[0] !== 0x89 || buf[1] !== 0x50) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

type ImageAttempt =
  | { kind: "image"; buf: Buffer; mime: string; model: string }
  | { kind: "fail"; retryable: boolean };

async function requestGeminiImage(args: {
  apiKey: string;
  model: string;
  prompt: string;
  job: Extract<AiJob, "news-image" | "guides-image" | "news-short-image">;
  aspectRatio?: GeminiImageAspect;
}): Promise<ImageAttempt> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${args.model}:generateContent?key=${encodeURIComponent(args.apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: args.prompt }] }],
        generationConfig: geminiImageGenerationConfig(
          args.model,
          args.aspectRatio || "16:9",
        ),
      }),
      signal: AbortSignal.timeout(90_000),
    },
  );
  if (res.status === 404 || res.status === 400) {
    console.error("gemini_image_failed", args.model, res.status, await res.text());
    return { kind: "fail", retryable: true };
  }
  if (!res.ok) {
    console.error("gemini_image_failed", args.model, res.status, await res.text());
    return { kind: "fail", retryable: false };
  }
  const json = (await res.json()) as {
    candidates?: {
      content?: {
        parts?: {
          inlineData?: { mimeType?: string; data?: string };
          inline_data?: { mime_type?: string; data?: string };
        }[];
      };
    }[];
  };
  const parts = json.candidates?.[0]?.content?.parts || [];
  let billed = false;
  for (const part of parts) {
    const data = part.inlineData?.data || part.inline_data?.data;
    const mime =
      part.inlineData?.mimeType ||
      part.inline_data?.mime_type ||
      "image/png";
    if (!data) continue;
    if (!billed) {
      billed = true;
      await recordGeminiImageUsage({
        job: args.job,
        model: args.model,
        json,
      });
    }
    const buf = Buffer.from(data, "base64");
    if (buf.length < 4_000) continue;
    const size = readPngSize(buf);
    if (size && (size.width < 512 || size.height < 512)) continue;
    return { kind: "image", buf, mime, model: args.model };
  }
  // 200 with bytes already billed → never fire a second paid model.
  return { kind: "fail", retryable: !billed };
}

/**
 * One image, one bill. Falls back to 2.5 Flash Image only if Lite is missing
 * or rejects the request before returning bytes.
 */
export async function generateGeminiImage(args: {
  prompt: string;
  job: Extract<AiJob, "news-image" | "guides-image" | "news-short-image">;
  aspectRatio?: GeminiImageAspect;
}): Promise<{ buf: Buffer; mime: string; model: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const primary = resolveNewsImageModel();
  const models = [primary];
  if (primary !== FALLBACK_NEWS_IMAGE_MODEL) {
    models.push(FALLBACK_NEWS_IMAGE_MODEL);
  }

  try {
    for (const model of models) {
      const result = await requestGeminiImage({
        apiKey,
        model,
        prompt: args.prompt,
        job: args.job,
        aspectRatio: args.aspectRatio,
      });
      if (result.kind === "image") {
        return { buf: result.buf, mime: result.mime, model: result.model };
      }
      if (!result.retryable) return null;
    }
    return null;
  } catch (err) {
    console.error("gemini_image_error", err);
    return null;
  }
}
