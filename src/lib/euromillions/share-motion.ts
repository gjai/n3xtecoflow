/** Easing / timeline for lottery share videos (no AI). */

export function clamp01(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - (1 - x) ** 3;
}

export function easeOutBack(t: number): number {
  const x = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
}

/** 0→1 over [start, start+dur] on a 0..1 playhead. */
export function windowT(t: number, start: number, dur: number): number {
  return clamp01((t - start) / Math.max(dur, 0.001));
}

export type Reveal = {
  opacity: number;
  dy: number;
  scale: number;
  scaleX: number;
  scaleY: number;
  spin: number;
};

/** Playhead duration of a ball/star drop (keep in sync with audio hits). */
export const DROP_REVEAL_DUR = 0.05;

/** Title card (Instagram cover) before the first ball. */
export const TITLE_END = 0.11;

/** CTA + My Million hold (~3 s at 11 s, before the loop fade). */
export const CTA_START = 0.72;

/** Crossfade back to the title card so a loop does not flash. */
export const LOOP_FADE_START = 0.93;

export function dropReveal(t: number, start: number, dur = DROP_REVEAL_DUR): Reveal {
  const local = windowT(t, start, dur);
  if (local <= 0) {
    return { opacity: 0, dy: 260, scale: 0.35, scaleX: 0.35, scaleY: 0.35, spin: 18 };
  }
  const drop = easeOutBack(local);
  const squash = local > 0.72 ? Math.sin(((local - 0.72) / 0.28) * Math.PI) : 0;
  const base = lerp(0.35, 1, drop);
  return {
    opacity: local < 0.12 ? local / 0.12 : 1,
    dy: (1 - drop) * 260,
    scale: base,
    scaleX: base * (1 + squash * 0.16),
    scaleY: base * (1 - squash * 0.18),
    spin: (1 - drop) * 18,
  };
}

export function fadeSlide(
  t: number,
  start: number,
  dur: number,
  fromY: number,
): { opacity: number; dy: number } {
  const local = easeOutCubic(windowT(t, start, dur));
  return { opacity: local, dy: (1 - local) * fromY };
}

/**
 * Playhead 0..1 for an ~11 s reel.
 * Carte titre → boules → étoiles → bandeau CTA (hold) → fondu vers le titre.
 */
export function ballStart(index: number, count: number): number {
  const n = Math.max(1, count);
  return TITLE_END + 0.055 + index * Math.min(0.068, 0.36 / n);
}

export function starStart(starIndex: number, ballCount: number): number {
  return ballStart(ballCount, ballCount) + 0.09 + starIndex * 0.065;
}

/** Big on-screen digit while the voice says the number (~0,6 s). */
export function announceCallout(
  t: number,
  start: number,
): { opacity: number; scale: number } {
  const local = windowT(t, start, 0.055);
  if (local <= 0 || local >= 1) return { opacity: 0, scale: 0.82 };
  const fadeIn = Math.min(1, local / 0.14);
  const fadeOut = Math.min(1, (1 - local) / 0.22);
  return {
    opacity: fadeIn * fadeOut,
    scale: 0.82 + 0.18 * easeOutCubic(fadeIn),
  };
}

export const SHARE_VIDEO_FPS = 24;
export const SHARE_VIDEO_SECONDS = 11;
export const SHARE_VIDEO_FRAMES = Math.round(SHARE_VIDEO_FPS * SHARE_VIDEO_SECONDS);

/** Short histoire : 12 fps pour rester sous le timeout VPS. */
export const SHARE_NEWS_FPS = 12;
export const SHARE_NEWS_SECONDS = 55;
export const SHARE_NEWS_FRAMES = Math.round(SHARE_NEWS_FPS * SHARE_NEWS_SECONDS);

/** 0 pendant [start,end], avec fondu d’entrée/sortie (playhead 0..1). */
export function holdFade(
  t: number,
  start: number,
  end: number,
  fade = 0.03,
): number {
  if (end <= start) return 0;
  const fadeIn = windowT(t, start, fade);
  const fadeOut = 1 - windowT(t, Math.max(start + fade, end - fade), fade);
  return clamp01(Math.min(fadeIn, fadeOut));
}
