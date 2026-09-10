import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { buildGuideCoverPrompt, getEditorial } from "@/sites/editorial";
import type { SiteId } from "@/sites/types";
import { generateGeminiImage } from "@/lib/ai/image-gen";
import { siteAllowsAi } from "@/sites/features";

function mediaDir() {
  return (
    process.env.GUIDES_MEDIA_PATH?.trim() ||
    path.join(process.cwd(), "data", "guide-images")
  );
}

export async function generateGuideCoverAi(args: {
  slug: string;
  title: string;
  subtitle?: string;
  siteId?: SiteId;
}): Promise<{ imageSrc: string; imageCredit: string } | null> {
  const siteId = args.siteId || "ecoflow";
  if (!siteAllowsAi(siteId)) return null;

  const generated = await generateGeminiImage({
    job: "guides-image",
    prompt: buildGuideCoverPrompt(siteId, args.title, args.subtitle),
  });
  if (!generated) return null;

  const dir = mediaDir();
  await fs.mkdir(dir, { recursive: true });
  const ext =
    generated.mime.includes("jpeg") || generated.mime.includes("jpg")
      ? "jpg"
      : "png";
  const hash = createHash("sha1")
    .update(`${args.slug}:${generated.buf.length}`)
    .digest("hex")
    .slice(0, 8);
  const filename = `${args.slug.slice(0, 40)}-${hash}.${ext}`;
  await fs.writeFile(path.join(dir, filename), generated.buf);
  return {
    imageSrc: `/api/media/guides/${filename}`,
    imageCredit: getEditorial(siteId).coverCreditAi,
  };
}

export function guideImageAbsolutePath(filename: string) {
  return path.join(mediaDir(), path.basename(filename));
}
