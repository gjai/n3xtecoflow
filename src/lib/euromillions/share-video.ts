import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";
import { SHARE_STORY, type ShareCardInput } from "./share-card";
import { lotteryShareWav, newsShareWav, type NewsShareMood } from "./share-audio";
import type { NewsShortFond, NewsShortVisuel } from "./news-short-script";
import {
  SHARE_NEWS_FPS,
  SHARE_VIDEO_FPS,
  SHARE_VIDEO_FRAMES,
  clamp01,
} from "./share-motion";
import {
  lotteryShareSvg,
  newsShareSvg,
  newsShareTimeline,
  rasterShare,
} from "./share-render";

function resolveFfmpeg(): string {
  if (typeof ffmpegStatic === "string" && ffmpegStatic) return ffmpegStatic;
  return "ffmpeg";
}

function runFfmpeg(bin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (chunk) => {
      err += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error((err.slice(-800) || `ffmpeg_${code}`).trim()));
    });
  });
}

export type ShareVideoOptions = {
  size?: { width: number; height: number };
  frames?: number;
  fps?: number;
};

/**
 * Reel 9:16 : frames SVG animées (Resvg) + H.264. Pas d’IA.
 */
export async function lotteryShareMp4(
  card: ShareCardInput,
  options?: ShareVideoOptions,
): Promise<Buffer> {
  const size = options?.size || SHARE_STORY;
  const frames = options?.frames ?? SHARE_VIDEO_FRAMES;
  const fps = options?.fps ?? SHARE_VIDEO_FPS;
  const dir = await mkdtemp(path.join(tmpdir(), "em-reel-"));
  try {
    for (let i = 0; i < frames; i += 1) {
      const t = frames <= 1 ? 1 : i / (frames - 1);
      const svg = lotteryShareSvg(card, size, { t });
      const png = await rasterShare(svg, "png");
      await writeFile(path.join(dir, `frame_${String(i).padStart(3, "0")}.png`), png);
    }
    const duration = frames / fps;
    const wav = lotteryShareWav(card, duration);
    await writeFile(path.join(dir, "bed.wav"), wav);
    const out = path.join(dir, "reel.mp4");
    const bin = resolveFfmpeg();
    await runFfmpeg(bin, [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      path.join(dir, "frame_%03d.png"),
      "-i",
      path.join(dir, "bed.wav"),
      "-r",
      String(fps),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-profile:v",
      "high",
      "-level",
      "4.0",
      "-crf",
      "20",
      "-preset",
      "veryfast",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-shortest",
      "-movflags",
      "+faststart",
      out,
    ]);
    return await readFile(out);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const NEWS_BG_PACK = [
  "images/euromillions/guides/comprendre-euromillions.jpg",
  "images/euromillions/guides/euromillions-et-autres-tirages.jpg",
  "images/euromillions/guides/lire-resultats-tirages.jpg",
];

type NewsPhoto = { buf: Buffer; width: number; height: number };

function newsMediaDir(): string {
  return (
    process.env.NEWS_MEDIA_PATH?.trim() ||
    path.join(process.cwd(), "data", "news-images")
  );
}

function resolveNewsImageFile(src: string): string | null {
  const trimmed = src.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/api/media/news/")) {
    const file = path.join(newsMediaDir(), path.basename(trimmed));
    return existsSync(file) ? file : null;
  }
  if (trimmed.startsWith("/images/") || trimmed.startsWith("/brands/")) {
    const file = path.join(process.cwd(), "public", trimmed.replace(/^\//, ""));
    return existsSync(file) ? file : null;
  }
  return null;
}

export function newsBackgroundFiles(
  imageSrc?: string | null,
  visuelSeed?: string | null,
): string[] {
  const files: string[] = [];
  const seen = new Set<string>();
  const add = (file: string | null) => {
    if (!file || seen.has(file)) return;
    seen.add(file);
    files.push(file);
  };
  add(imageSrc ? resolveNewsImageFile(imageSrc) : null);
  const pack = NEWS_BG_PACK.slice();
  if (visuelSeed) {
    let h = 0;
    for (const ch of visuelSeed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    for (let i = pack.length - 1; i > 0; i -= 1) {
      h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
      const j = h % (i + 1);
      const tmp = pack[i]!;
      pack[i] = pack[j]!;
      pack[j] = tmp;
    }
  }
  for (const rel of pack) {
    add(path.join(process.cwd(), "public", rel));
  }
  return files.filter((file) => existsSync(file));
}

async function loadNewsPhotos(
  imageSrc?: string | null,
  visuelSeed?: string | null,
  photoBufs?: Buffer[],
): Promise<NewsPhoto[]> {
  const sharp = (await import("sharp")).default;
  const photos: NewsPhoto[] = [];
  if (photoBufs) {
    for (const buf of photoBufs) {
      try {
        const meta = await sharp(buf).metadata();
        if (!meta.width || !meta.height) continue;
        photos.push({ buf, width: meta.width, height: meta.height });
      } catch {
        // skip
      }
    }
    return photos;
  }
  for (const file of newsBackgroundFiles(imageSrc, visuelSeed)) {
    try {
      const buf = await readFile(file);
      const meta = await sharp(buf).metadata();
      if (!meta.width || !meta.height) continue;
      photos.push({ buf, width: meta.width, height: meta.height });
    } catch {
      // skip unreadable covers
    }
  }
  return photos;
}

function kenBurnsCrop(
  photo: NewsPhoto,
  size: { width: number; height: number },
  localT: number,
  panDir: number,
): { left: number; top: number; width: number; height: number } {
  const scale = 1.1 + 0.16 * clamp01(localT);
  const targetAspect = size.width / size.height;
  let cropW: number;
  let cropH: number;
  if (photo.width / photo.height > targetAspect) {
    cropH = photo.height / scale;
    cropW = cropH * targetAspect;
  } else {
    cropW = photo.width / scale;
    cropH = cropW / targetAspect;
  }
  cropW = Math.min(photo.width, Math.max(8, cropW));
  cropH = Math.min(photo.height, Math.max(8, cropH));
  const maxX = Math.max(0, photo.width - cropW);
  const maxY = Math.max(0, photo.height - cropH);
  const panX = panDir >= 0 ? clamp01(0.18 + 0.64 * localT) : clamp01(0.82 - 0.64 * localT);
  const panY = 0.42 + 0.16 * localT;
  return {
    left: Math.round(maxX * panX),
    top: Math.round(maxY * panY),
    width: Math.max(1, Math.round(cropW)),
    height: Math.max(1, Math.round(cropH)),
  };
}

async function kenBurnsFrame(
  photo: NewsPhoto,
  size: { width: number; height: number },
  localT: number,
  panDir: number,
): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  const crop = kenBurnsCrop(photo, size, localT, panDir);
  if (crop.left + crop.width > photo.width) {
    crop.width = photo.width - crop.left;
  }
  if (crop.top + crop.height > photo.height) {
    crop.height = photo.height - crop.top;
  }
  return sharp(photo.buf)
    .extract(crop)
    .resize(size.width, size.height, { fit: "fill" })
    .jpeg({ quality: 88 })
    .toBuffer();
}

function slideMix(
  t: number,
  count: number,
  cuts?: number[],
): { i0: number; i1: number; mix: number; local: number } {
  if (count <= 1) return { i0: 0, i1: 0, mix: 0, local: t };
  const bounds =
    cuts && cuts.length === count - 1
      ? [0, ...cuts.map((c) => clamp01(c)), 1]
      : Array.from({ length: count + 1 }, (_, i) => i / count);
  const x = clamp01(t);
  let i0 = 0;
  for (let i = 0; i < count - 1; i += 1) {
    if (x >= bounds[i + 1]!) i0 = i + 1;
  }
  const i1 = Math.min(count - 1, i0 + 1);
  const start = bounds[i0]!;
  const end = bounds[i0 + 1]!;
  const span = Math.max(0.001, end - start);
  const local = clamp01((x - start) / span);
  const mix = i1 === i0 ? 0 : clamp01((local - 0.88) / 0.12);
  return { i0, i1, mix, local };
}

async function newsBackgroundFrame(
  photos: NewsPhoto[],
  size: { width: number; height: number },
  t: number,
  cuts?: number[],
): Promise<Buffer | null> {
  if (!photos.length) return null;
  const sharp = (await import("sharp")).default;
  const { i0, i1, mix, local } = slideMix(t, photos.length, cuts);
  const a = await kenBurnsFrame(photos[i0]!, size, local, i0 % 2 === 0 ? 1 : -1);
  if (mix <= 0.02 || i0 === i1) return a;
  const b = await kenBurnsFrame(photos[i1]!, size, 0, i1 % 2 === 0 ? 1 : -1);
  const faded = await sharp(b)
    .ensureAlpha()
    .composite([
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"><rect width="100%" height="100%" fill="white" fill-opacity="${mix.toFixed(3)}"/></svg>`,
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
  return sharp(a)
    .composite([{ input: faded, blend: "over" }])
    .jpeg({ quality: 88 })
    .toBuffer();
}

export type NewsShareVideoOptions = ShareVideoOptions & {
  body?: string;
  imageSrc?: string | null;
  mood?: NewsShareMood;
  sfx?: string[];
  fond?: NewsShortFond;
  visuelSeed?: string | null;
  visuels?: NewsShortVisuel[];
  photoBufs?: Buffer[];
};

function fondAtTime(
  t: number,
  fond?: NewsShortFond,
  visuels?: NewsShortVisuel[],
  hookEnd = 0.32,
  storyEnd = 0.88,
): NewsShortFond {
  const at = t < hookEnd ? "accroche" : t < storyEnd ? "corps" : "chute";
  return visuels?.find((v) => v.at === at)?.fond || fond || "navy";
}

/**
 * Short actu 9:16 : photos Ken Burns + texte + fond musical original.
 */
export async function newsShareMp4(
  title: string,
  excerpt: string,
  options?: NewsShareVideoOptions,
): Promise<Buffer> {
  const size = options?.size || SHARE_STORY;
  const fps = options?.fps ?? SHARE_NEWS_FPS;
  const tl = newsShareTimeline(excerpt, options?.body);
  const frames = options?.frames ?? Math.max(8, Math.round(fps * tl.seconds));
  const photos = await loadNewsPhotos(
    options?.imageSrc,
    options?.visuelSeed,
    options?.photoBufs,
  );
  const overlay = photos.length > 0;
  const dir = await mkdtemp(path.join(tmpdir(), "em-news-reel-"));
  try {
    const sharp = overlay ? (await import("sharp")).default : null;
    const photoCuts = [tl.hookEnd, tl.storyEnd];
    for (let i = 0; i < frames; i += 1) {
      const t = frames <= 1 ? 1 : i / (frames - 1);
      const svg = newsShareSvg(title, excerpt, size, {
        t,
        overlay,
        body: options?.body,
        mood: options?.mood,
        fond: fondAtTime(
          t,
          options?.fond,
          options?.visuels,
          tl.hookEnd,
          tl.storyEnd,
        ),
      });
      const textPng = await rasterShare(svg, "png");
      let png = textPng;
      if (overlay && sharp) {
        const bg = await newsBackgroundFrame(photos, size, t, photoCuts);
        if (bg) {
          png = await sharp(bg)
            .composite([{ input: textPng, blend: "over" }])
            .png()
            .toBuffer();
        }
      }
      await writeFile(
        path.join(dir, `frame_${String(i).padStart(4, "0")}.png`),
        png,
      );
    }
    const duration = frames / fps || tl.seconds;
    const wav = newsShareWav(duration, options?.mood || "ironie", options?.sfx || []);
    await writeFile(path.join(dir, "bed.wav"), wav);
    const out = path.join(dir, "reel.mp4");
    const bin = resolveFfmpeg();
    await runFfmpeg(bin, [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      path.join(dir, "frame_%04d.png"),
      "-i",
      path.join(dir, "bed.wav"),
      "-r",
      String(fps),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-profile:v",
      "high",
      "-level",
      "4.0",
      "-crf",
      "20",
      "-preset",
      "veryfast",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-shortest",
      "-movflags",
      "+faststart",
      out,
    ]);
    return await readFile(out);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
