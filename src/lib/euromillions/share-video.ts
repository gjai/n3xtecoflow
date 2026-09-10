import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";
import { SHARE_STORY, type ShareCardInput } from "./share-card";
import { lotteryShareWav } from "./share-audio";
import {
  SHARE_VIDEO_FPS,
  SHARE_VIDEO_FRAMES,
} from "./share-motion";
import { lotteryShareSvg, rasterShare } from "./share-render";

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
