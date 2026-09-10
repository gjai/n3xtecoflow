import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  DROP_REVEAL_DUR,
  SHARE_NEWS_SECONDS,
  SHARE_VIDEO_SECONDS,
  TITLE_END,
  ballStart,
  starStart,
} from "./share-motion";
import type { ShareCardInput } from "./share-card";

const SAMPLE_RATE = 44100;
const VOICE_GAIN = 0.92;
const HIT_GAIN = 0.14;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function drawValues(card: ShareCardInput): { balls: number[]; stars: number[] } {
  const balls: number[] = [];
  const stars: number[] = [];
  for (const row of card.rows) {
    const nums: number[] = [];
    for (const v of row.values) {
      const n = typeof v === "number" ? v : Number.parseInt(String(v), 10);
      if (Number.isFinite(n)) nums.push(n);
    }
    if (row.outlined) stars.push(...nums);
    else balls.push(...nums);
  }
  return { balls, stars };
}

function mixTone(
  out: Float32Array,
  startSec: number,
  duration: number,
  sample: (localT: number) => number,
) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const n = Math.floor(duration * SAMPLE_RATE);
  for (let i = 0; i < n; i += 1) {
    const idx = start + i;
    if (idx < 0 || idx >= out.length) continue;
    out[idx] += sample(i / SAMPLE_RATE);
  }
}

function pluck(
  out: Float32Array,
  startSec: number,
  freq: number,
  duration: number,
  gain: number,
) {
  mixTone(out, startSec, duration, (lt) => {
    const attack = Math.min(1, lt / 0.007);
    const env = attack * Math.exp(-lt / Math.max(0.04, duration * 0.42));
    return (
      (Math.sin(2 * Math.PI * freq * lt) +
        0.22 * Math.sin(2 * Math.PI * freq * 2 * lt) +
        0.07 * Math.sin(2 * Math.PI * freq * 3 * lt)) *
      env *
      gain
    );
  });
}

/** Short rising fanfare — no pad, no loop. */
function mixJingle(out: Float32Array) {
  pluck(out, 0.05, 392.0, 0.16, 0.17);
  pluck(out, 0.16, 523.25, 0.16, 0.18);
  pluck(out, 0.27, 659.25, 0.16, 0.19);
  pluck(out, 0.38, 783.99, 0.28, 0.2);
  pluck(out, 0.38, 1046.5, 0.26, 0.07);
}

function mixClip(
  out: Float32Array,
  startSec: number,
  clip: Float32Array | null,
  gain: number,
) {
  if (!clip || clip.length === 0) return;
  const start = Math.floor(startSec * SAMPLE_RATE);
  for (let i = 0; i < clip.length; i += 1) {
    const idx = start + i;
    if (idx < 0 || idx >= out.length) continue;
    out[idx] += clip[i] * gain;
  }
}

function decodeWavPcm16(buf: Buffer): Float32Array | null {
  if (buf.length < 44 || buf.toString("ascii", 0, 4) !== "RIFF") return null;
  let offset = 12;
  let channels = 1;
  let rate = SAMPLE_RATE;
  let bits = 16;
  let data: Buffer | null = null;
  while (offset + 8 <= buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (id === "fmt " && size >= 16) {
      channels = buf.readUInt16LE(start + 2);
      rate = buf.readUInt32LE(start + 4);
      bits = buf.readUInt16LE(start + 14);
    } else if (id === "data") {
      data = buf.subarray(start, Math.min(buf.length, start + size));
      break;
    }
    offset = start + size + (size % 2);
  }
  if (!data || bits !== 16 || channels < 1) return null;
  const frames = Math.floor(data.length / 2 / channels);
  const mono = new Float32Array(frames);
  for (let i = 0; i < frames; i += 1) {
    let acc = 0;
    for (let c = 0; c < channels; c += 1) {
      acc += data.readInt16LE((i * channels + c) * 2) / 32768;
    }
    mono[i] = acc / channels;
  }
  if (rate === SAMPLE_RATE || frames < 2) return mono;
  const n = Math.max(1, Math.round((frames * SAMPLE_RATE) / rate));
  const resampled = new Float32Array(n);
  for (let i = 0; i < n; i += 1) {
    const src = (i * (frames - 1)) / Math.max(1, n - 1);
    const i0 = Math.floor(src);
    const i1 = Math.min(frames - 1, i0 + 1);
    const f = src - i0;
    resampled[i] = mono[i0] * (1 - f) + mono[i1] * f;
  }
  return resampled;
}

const voiceCache = new Map<string, Float32Array | null>();

function voiceDir(): string {
  const env = process.env.SHARE_VOICE_PATH?.trim();
  const candidates = [
    env,
    path.join(process.cwd(), "public", "share-voice"),
    "/app/public/share-voice",
  ];
  for (const dir of candidates) {
    if (dir && existsSync(dir)) return dir;
  }
  return candidates[1]!;
}

function loadClip(name: string): Float32Array | null {
  if (voiceCache.has(name)) return voiceCache.get(name) ?? null;
  const file = path.join(voiceDir(), name);
  if (!existsSync(file)) {
    voiceCache.set(name, null);
    return null;
  }
  try {
    const pcm = decodeWavPcm16(readFileSync(file));
    voiceCache.set(name, pcm);
    return pcm;
  } catch {
    voiceCache.set(name, null);
    return null;
  }
}

function numberClip(n: number): Float32Array | null {
  if (!Number.isFinite(n)) return null;
  const i = Math.round(n);
  if (i < 1 || i > 70) return null;
  return loadClip(`n${String(i).padStart(2, "0")}.wav`);
}

/**
 * Jingle + voix (clips préenregistrés) + ticks aux atterrissages.
 * Pas de bourdon de fond. Pas d’IA.
 */
export function lotteryShareWav(
  card: ShareCardInput,
  durationSec = SHARE_VIDEO_SECONDS,
): Buffer {
  const samples = Math.max(1, Math.ceil(durationSec * SAMPLE_RATE));
  const out = new Float32Array(samples);
  const { balls, stars } = drawValues(card);
  const ballCount = Math.max(1, balls.length);
  const announce = balls.length > 0 && balls.length <= 8 && stars.length <= 4;

  mixJingle(out);

  if (announce) {
    mixClip(out, TITLE_END * durationSec - 0.05, loadClip("numeros.wav"), VOICE_GAIN);
    for (let b = 0; b < balls.length; b += 1) {
      const at = ballStart(b, ballCount) * durationSec + 0.04;
      mixClip(out, at, numberClip(balls[b]!), VOICE_GAIN);
    }
    if (stars.length) {
      const firstStarVoice = starStart(0, ballCount) * durationSec + 0.04;
      mixClip(
        out,
        Math.max(0, firstStarVoice - 0.86),
        loadClip(card.bonusVoiceClip || "etoiles.wav"),
        VOICE_GAIN,
      );
      for (let s = 0; s < stars.length; s += 1) {
        const at = starStart(s, ballCount) * durationSec + 0.04;
        mixClip(out, at, numberClip(stars[s]!), VOICE_GAIN);
      }
    }
  }

  for (let b = 0; b < balls.length; b += 1) {
    const at = (ballStart(b, ballCount) + DROP_REVEAL_DUR) * durationSec;
    const freq = 196 + b * 14;
    mixTone(out, at, 0.16, (lt) => {
      const env = Math.exp(-lt / 0.05);
      const click = Math.sin(lt * 9200) * Math.exp(-lt / 0.009) * 0.12;
      return Math.sin(2 * Math.PI * freq * lt) * env * HIT_GAIN + click;
    });
  }

  for (let s = 0; s < stars.length; s += 1) {
    const at = (starStart(s, ballCount) + DROP_REVEAL_DUR) * durationSec;
    const f0 = 523.25 + s * 65;
    mixTone(out, at, 0.28, (lt) => {
      const e1 = Math.exp(-lt / 0.11);
      const e2 = Math.exp(-lt / 0.08);
      return (
        Math.sin(2 * Math.PI * f0 * lt) * e1 * 0.13 +
        Math.sin(2 * Math.PI * f0 * 1.5 * lt) * e2 * 0.07
      );
    });
  }

  const lastStarAt =
    stars.length > 0
      ? (starStart(stars.length - 1, ballCount) + DROP_REVEAL_DUR) * durationSec
      : (ballStart(Math.max(0, balls.length - 1), ballCount) + DROP_REVEAL_DUR) *
        durationSec;
  pluck(out, lastStarAt + 0.22, 523.25, 0.32, 0.12);
  pluck(out, lastStarAt + 0.22, 783.99, 0.34, 0.1);

  const fadeIn = Math.floor(0.04 * SAMPLE_RATE);
  const fadeOut = Math.floor(0.7 * SAMPLE_RATE);
  for (let i = 0; i < samples; i += 1) {
    let g = 1;
    if (i < fadeIn) g *= i / fadeIn;
    if (i > samples - fadeOut) g *= Math.max(0, (samples - i) / fadeOut);
    out[i] = Math.tanh(out[i] * 1.15) * g * 0.92;
  }

  return encodeWav(out, SAMPLE_RATE);
}

export type NewsShareMood = "ironie" | "tension" | "mystere" | "chaleur";

const NEWS_MOOD: Record<
  NewsShareMood,
  { bpm: number; chords: number[][]; melody: number[] }
> = {
  ironie: {
    bpm: 116,
    chords: [
      [130.81, 164.81, 196.0, 261.63],
      [110.0, 164.81, 220.0, 261.63],
      [174.61, 220.0, 261.63, 349.23],
      [196.0, 246.94, 293.66, 392.0],
    ],
    melody: [523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 392.0, 523.25],
  },
  tension: {
    bpm: 96,
    chords: [
      [146.83, 174.61, 220.0, 293.66],
      [116.54, 174.61, 233.08, 349.23],
      [174.61, 220.0, 261.63, 349.23],
      [130.81, 196.0, 261.63, 329.63],
    ],
    melody: [440.0, 392.0, 349.23, 392.0, 329.63, 293.66, 349.23, 440.0],
  },
  mystere: {
    bpm: 88,
    chords: [
      [110.0, 164.81, 220.0, 261.63],
      [174.61, 220.0, 261.63, 349.23],
      [130.81, 164.81, 196.0, 261.63],
      [164.81, 207.65, 329.63, 415.3],
    ],
    melody: [440.0, 523.25, 415.3, 349.23, 329.63, 440.0, 261.63, 415.3],
  },
  chaleur: {
    bpm: 108,
    chords: [
      [174.61, 220.0, 261.63, 349.23],
      [130.81, 164.81, 196.0, 261.63],
      [146.83, 174.61, 220.0, 293.66],
      [116.54, 174.61, 233.08, 349.23],
    ],
    melody: [349.23, 392.0, 440.0, 523.25, 440.0, 392.0, 349.23, 261.63],
  },
};

function mixWhoosh(out: Float32Array, startSec: number) {
  mixTone(out, startSec, 0.22, (lt) => {
    const env = Math.sin(Math.PI * Math.min(1, lt / 0.22));
    const f = 400 + lt * 2800;
    return Math.sin(2 * Math.PI * f * lt) * env * 0.07;
  });
}

function mixSting(out: Float32Array, startSec: number) {
  pluck(out, startSec, 783.99, 0.28, 0.16);
  pluck(out, startSec, 1174.66, 0.22, 0.08);
}

function mixTick(out: Float32Array, startSec: number) {
  mixTone(out, startSec, 0.04, (lt) => {
    const env = Math.exp(-lt / 0.008);
    return Math.sin(2 * Math.PI * 1800 * lt) * env * 0.06;
  });
}

/**
 * Fond original (pas de morceau tiers). Mood + SFX varient selon le scénario.
 */
export function newsShareWav(
  durationSec = SHARE_NEWS_SECONDS,
  mood: NewsShareMood = "ironie",
  sfx: string[] = [],
): Buffer {
  const samples = Math.max(1, Math.ceil(durationSec * SAMPLE_RATE));
  const out = new Float32Array(samples);
  const spec = NEWS_MOOD[mood] || NEWS_MOOD.ironie;
  const beat = 60 / spec.bpm;
  const chords = spec.chords;
  const melody = spec.melody;

  pluck(out, 0.02, melody[0]!, 0.18, 0.14);
  pluck(out, 0.12, melody[1] || melody[0]!, 0.2, 0.12);

  const chordDur = durationSec / chords.length;
  for (let c = 0; c < chords.length; c += 1) {
    const start = c * chordDur;
    const chord = chords[c]!;
    for (let b = 0; b * beat < chordDur - 0.02; b += 1) {
      const at = start + b * beat;
      if (b % 2 === 0) {
        for (const f of chord) {
          pluck(out, at, f, 0.22, f < 180 ? 0.09 : 0.045);
        }
      } else {
        pluck(out, at, chord[0]!, 0.16, 0.07);
      }
      mixTone(out, at, 0.04, (lt) => {
        const env = Math.exp(-lt / 0.007);
        return Math.sin(2 * Math.PI * 7200 * lt) * env * 0.024;
      });
      const note = melody[b % melody.length]!;
      mixTone(out, at + 0.02, 0.18, (lt) => {
        const env = Math.min(1, lt / 0.008) * Math.exp(-lt / 0.11);
        return (
          Math.sin(2 * Math.PI * note * lt) * env * 0.05 +
          Math.sin(2 * Math.PI * note * 2 * lt) * env * 0.01
        );
      });
    }
  }

  const tags = sfx.map((s) => s.toLowerCase());
  if (tags.includes("whoosh")) mixWhoosh(out, 0.08);
  if (tags.includes("tick")) {
    mixTick(out, durationSec * 0.32);
    mixTick(out, durationSec * 0.52);
  }
  if (tags.includes("sting")) mixSting(out, durationSec * 0.84);

  const fadeIn = Math.floor(0.04 * SAMPLE_RATE);
  const fadeOut = Math.floor(0.9 * SAMPLE_RATE);
  for (let i = 0; i < samples; i += 1) {
    let g = 1;
    if (i < fadeIn) g *= i / fadeIn;
    if (i > samples - fadeOut) g *= Math.max(0, (samples - i) / fadeOut);
    out[i] = Math.tanh(out[i] * 1.08) * g * 0.88;
  }
  return encodeWav(out, SAMPLE_RATE);
}

function encodeWav(samples: Float32Array, sampleRate: number): Buffer {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i += 1) {
    const s = clamp(samples[i], -1, 1);
    data.writeInt16LE(Math.round(s * 32767), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}
