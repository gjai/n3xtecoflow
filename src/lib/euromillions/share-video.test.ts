import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SHARE_FEED, SHARE_STORY, euroMillionsShareCard } from "./share-card.ts";
import { ballStart, dropReveal, windowT } from "./share-motion.ts";
import { lotteryShareSvg } from "./share-render.ts";
import { lotteryShareMp4 } from "./share-video.ts";

const sample = euroMillionsShareCard({
  date: "2026-09-08",
  numbers: [3, 12, 19, 27, 46],
  stars: [4, 12],
  jackpotEur: null,
  source: "fdj",
  fetchedAt: "2026-09-08T19:49:25.219Z",
});

describe("lottery share anim", () => {
  it("au début les boules ne sont pas encore posées", () => {
    const svg = lotteryShareSvg(sample, SHARE_STORY, { t: 0 });
    assert.match(svg, /opacity="0\.000"/);
    assert.match(svg, /EUROMILLIONS/);
    assert.match(svg, /LES NUMÉROS/);
    assert.match(svg, /Tirage du/);
  });

  it("à la fin les numéros sont visibles", () => {
    const svg = lotteryShareSvg(sample, SHARE_FEED, { t: 1 });
    assert.match(svg, />3</);
    assert.match(svg, />46</);
    assert.match(svg, />4</);
    assert.match(svg, /<polygon /);
    assert.ok(dropReveal(1, ballStart(0, 5)).opacity > 0.99);
    assert.ok(Math.abs(windowT(0.5, 0.4, 0.2) - 0.5) < 1e-9);
  });

  it("affiche le numéro en gros au moment de la voix", () => {
    const svg = lotteryShareSvg(sample, SHARE_STORY, { t: ballStart(0, 5) + 0.02 });
    assert.match(svg, /data-callout="1"/);
    assert.match(svg, /font-size="200"/);
    assert.ok(!lotteryShareSvg(sample, SHARE_STORY, { t: 0 }).includes('data-callout="1"'));
  });

  it("affiche jackpot et My Million", () => {
    const rich = euroMillionsShareCard({
      date: "2026-09-08",
      numbers: [3, 12, 19, 27, 46],
      stars: [4, 12],
      jackpotEur: 111_000_000,
      myMillionCode: "AB 123 4567",
      source: "fdj",
      fetchedAt: "2026-09-08T19:49:25.219Z",
    });
    const svg = lotteryShareSvg(rich, SHARE_STORY, { t: 0.85 });
    assert.match(svg, /Jackpot 111 M€/);
    assert.match(svg, /My Million AB 123 4567/);
    const mid = lotteryShareSvg(rich, SHARE_STORY, { t: 0.58 });
    assert.match(mid, /LES ÉTOILES/);
    const loop = lotteryShareSvg(rich, SHARE_STORY, { t: 1 });
    assert.match(loop, /LES NUMÉROS/);
  });
});

describe("lotteryShareMp4", () => {
  it("encode un H.264 9:16 (peu de frames)", async () => {
    const buf = await lotteryShareMp4(sample, {
      size: { width: 540, height: 960 },
      frames: 8,
      fps: 8,
    });
    assert.ok(buf.length > 2000, `mp4 trop léger (${buf.length})`);
    assert.equal(buf.subarray(4, 8).toString("ascii"), "ftyp");
  });
});

describe("facebookReelMessage", () => {
  it("accroche jackpot en première ligne", async () => {
    const { facebookReelMessage } = await import("./facebook.ts");
    const text = facebookReelMessage({
      date: "2026-09-08",
      numbers: [3, 12, 19, 27, 46],
      stars: [4, 12],
      jackpotEur: 111_000_000,
      myMillionCode: "AB 123 4567",
      source: "fdj",
      fetchedAt: "2026-09-08T19:49:25.219Z",
    });
    const first = text.split("\n")[0];
    assert.match(first!, /Tirage du mardi 8 septembre 2026 — jackpot 111 M€/);
    assert.match(text, /3 · 12 · 19 · 27 · 46/);
    assert.ok(!text.startsWith("Résultats EuroMillions"));
  });
});

describe("lotteryShareWav", () => {
  it("écrit un WAV PCM 16-bit", async () => {
    const { lotteryShareWav } = await import("./share-audio.ts");
    const wav = lotteryShareWav(sample, 1);
    assert.equal(wav.subarray(0, 4).toString("ascii"), "RIFF");
    assert.equal(wav.subarray(8, 12).toString("ascii"), "WAVE");
    assert.ok(wav.length > 44 + 1000);
  });

  it("charge les clips voix du tirage", async () => {
    const { existsSync } = await import("node:fs");
    const { default: path } = await import("node:path");
    const dir = path.join(process.cwd(), "public", "share-voice");
    for (const n of [3, 12, 19, 27, 46, 4]) {
      assert.ok(existsSync(path.join(dir, `n${String(n).padStart(2, "0")}.wav`)));
    }
    assert.ok(existsSync(path.join(dir, "numeros.wav")));
    assert.ok(existsSync(path.join(dir, "etoiles.wav")));
  });
});
