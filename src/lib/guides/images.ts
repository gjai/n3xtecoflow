import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { SiteId } from "@/sites/types";

function mediaDir() {
  return (
    process.env.GUIDES_MEDIA_PATH?.trim() ||
    path.join(process.cwd(), "data", "guide-images")
  );
}

function readPngSize(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 24 || buf[0] !== 0x89 || buf[1] !== 0x50) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

export async function generateGuideCoverAi(args: {
  slug: string;
  title: string;
  subtitle?: string;
  siteId?: SiteId;
}): Promise<{ imageSrc: string; imageCredit: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const model =
    process.env.NEWS_IMAGE_MODEL?.trim() || "gemini-2.5-flash-image";

  const siteId = args.siteId || "ecoflow";
  const prompt =
    siteId === "tumbler"
      ? `Create a photorealistic editorial cover image (16:9) for an insulated bottle / tumbler buying guide.
No text, no logos, no watermarks, no UI chrome.
Guide title: "${args.title}".
Context: ${args.subtitle || "insulated water bottle, tumbler, daily hydration"}.
Style: premium lifestyle / product photography, natural light, shallow depth of field.
Show generic unbranded stainless steel bottles or tumblers.`
      : `Create a photorealistic editorial cover image (16:9) for an EcoFlow buying guide.
No text, no logos, no watermarks, no UI chrome.
Guide title: "${args.title}".
Context: ${args.subtitle || "portable power, solar energy, home backup"}.
Style: premium lifestyle / product photography, natural light, shallow depth of field.
Show relevant EcoFlow-like gear (power station, solar panel, balcony kit, camping fridge) without readable branding.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
        signal: AbortSignal.timeout(90_000),
      },
    );
    if (!res.ok) {
      console.error("guide_image_ai_failed", res.status, await res.text());
      return null;
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
    for (const part of parts) {
      const data = part.inlineData?.data || part.inline_data?.data;
      const mime =
        part.inlineData?.mimeType ||
        part.inline_data?.mime_type ||
        "image/png";
      if (!data) continue;
      const buf = Buffer.from(data, "base64");
      if (buf.length < 4_000) continue;
      const size = readPngSize(buf);
      if (size && (size.width < 512 || size.height < 512)) continue;
      const dir = mediaDir();
      await fs.mkdir(dir, { recursive: true });
      const ext = mime.includes("jpeg") || mime.includes("jpg") ? "jpg" : "png";
      const hash = createHash("sha1")
        .update(`${args.slug}:${buf.length}`)
        .digest("hex")
        .slice(0, 8);
      const filename = `${args.slug.slice(0, 40)}-${hash}.${ext}`;
      await fs.writeFile(path.join(dir, filename), buf);
      return {
        imageSrc: `/api/media/guides/${filename}`,
        imageCredit:
          siteId === "tumbler"
            ? "La gourde isotherme (IA)"
            : "EcoFlow Stream (IA)",
      };
    }
    return null;
  } catch (err) {
    console.error("guide_image_ai_error", err);
    return null;
  }
}

export function guideImageAbsolutePath(filename: string) {
  return path.join(mediaDir(), path.basename(filename));
}
