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

describe("newsShareMp4", () => {
  it("encode un H.264 9:16 actu (peu de frames)", async () => {
    const { newsShareMp4, newsBackgroundFiles } = await import("./share-video.ts");
    assert.ok(newsBackgroundFiles().length >= 2);
    const buf = await newsShareMp4("Le jackpot grimpe", "Aucun rang 1.", {
      size: { width: 540, height: 960 },
      frames: 8,
      fps: 8,
      body: "Les rapports de gains sont publiés. Site indépendant, 18+.",
      mood: "tension",
      sfx: ["whoosh", "sting"],
      fond: "cold",
      visuelSeed: "ticket-slips",
      visuels: [
        { at: "accroche", plan: "ticket", fond: "cold" },
        { at: "corps", plan: "slips", fond: "warm" },
        { at: "chute", plan: "closeup", fond: "gold" },
      ],
    });
    assert.ok(buf.length > 8000, `mp4 trop léger (${buf.length})`);
    assert.equal(buf.subarray(4, 8).toString("ascii"), "ftyp");
  });
});

describe("pickWeeklyNewsArticle", () => {
  it("prend la plus récente de la semaine, ignore l'archive", async () => {
    const { pickWeeklyNewsArticle } = await import("./facebook.ts");
    const pick = pickWeeklyNewsArticle(
      [
        {
          slug: "archive",
          siteId: "euromillions",
          publishedAt: "2026-08-20T10:00:00.000Z",
          fr: { title: "Vieux", excerpt: "" },
        },
        {
          slug: "lundi",
          siteId: "euromillions",
          publishedAt: "2026-09-07T08:00:00.000Z",
          fr: { title: "Lundi", excerpt: "un" },
        },
        {
          slug: "jeudi",
          siteId: "euromillions",
          publishedAt: "2026-09-10T12:00:00.000Z",
          fr: { title: "Jeudi", excerpt: "deux" },
        },
        {
          slug: "autre-site",
          siteId: "ecoflow",
          publishedAt: "2026-09-10T18:00:00.000Z",
          fr: { title: "Batterie", excerpt: "" },
        },
      ],
      "2026-W37",
    );
    assert.equal(pick?.slug, "jeudi");
    assert.equal(pick?.title, "Jeudi");
    assert.equal(pickWeeklyNewsArticle([], "2026-W37"), null);
  });

  it("injecte les faits tirage et ignore le boilerplate", async () => {
    const { pickWeeklyNewsArticle } = await import("./facebook.ts");
    const pick = pickWeeklyNewsArticle(
      [
        {
          slug: "tirage",
          siteId: "euromillions",
          publishedAt: "2026-09-09T08:00:00.000Z",
          fr: {
            title: "Le jackpot grimpe",
            excerpt: "Revue de presse (FDJ, 9 septembre 2026).",
            body: [
              "Vérifiez votre grille avec le simulateur avant de jeter le reçu.",
              "Site indépendant : nous ne vendons pas de tickets. 18+ · jeu responsable.",
            ],
          },
        },
      ],
      "2026-W37",
      [
        "Tirage du mardi 8 septembre 2026 : 13, 17, 33, 35, 39 — étoiles 7 et 12.",
        "Jackpot de 98 M€ non remporté.",
        "Code My Million : DC 157 3553.",
      ],
    );
    assert.match(pick?.excerpt || "", /13, 17, 33/);
    assert.match(pick?.body || "", /98 M€/);
    assert.match(pick?.body || "", /DC 157 3553/);
    assert.ok(!/simulateur|18\+|tickets/.test(`${pick?.excerpt} ${pick?.body}`));
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

describe("companionReelMessage", () => {
  it("accroche Loto jackpot sans 2e tirage", async () => {
    const { companionReelMessage } = await import("./facebook.ts");
    const text = companionReelMessage({
      gameId: "loto",
      date: "2026-09-10",
      plannedAt: "2026-09-10T18:55:00.000Z",
      jackpotEur: 2_000_000,
      groups: [
        {
          type: "numeros principaux",
          kind: "numbers",
          labelKey: "main",
          values: [4, 5, 18, 22, 35],
        },
        {
          type: "numero chance",
          kind: "bonus",
          labelKey: "chance",
          values: [2],
        },
        {
          type: "2eme tirage",
          kind: "numbers",
          labelKey: "secondDraw",
          values: [1, 15, 16, 34, 45],
        },
      ],
      source: "fdj",
      fetchedAt: "2026-09-10T19:00:00.000Z",
    });
    const first = text.split("\n")[0];
    assert.match(first!, /Loto — tirage du jeudi 10 septembre 2026 — jackpot 2 M€/);
    assert.match(text, /4 · 5 · 18 · 22 · 35/);
    assert.match(text, /chance 2/);
    assert.ok(!text.includes("1 · 15 · 16"));
    assert.match(text, /#Loto/);
  });

  it("accroche EuroDreams avec le numéro rêve", async () => {
    const { companionReelMessage } = await import("./facebook.ts");
    const text = companionReelMessage({
      gameId: "eurodreams",
      date: "2026-09-07",
      plannedAt: "2026-09-07T21:00:00.000+02:00",
      jackpotEur: 20_000,
      groups: [
        {
          type: "numeros principaux",
          kind: "numbers",
          labelKey: "main",
          values: [7, 9, 10, 26, 33, 40],
        },
        {
          type: "numero dream",
          kind: "bonus",
          labelKey: "dream",
          values: [1],
        },
      ],
      source: "fdj",
      fetchedAt: "2026-09-07T21:10:00.000Z",
    });
    assert.match(text, /EuroDreams — tirage du lundi 7 septembre 2026/);
    assert.match(text, /7 · 9 · 10 · 26 · 33 · 40/);
    assert.match(text, /rêve 1/);
    assert.match(text, /#EuroDreams/);
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

  it("fond musical actu : WAV plus long qu’un jingle", async () => {
    const { newsShareWav } = await import("./share-audio.ts");
    const wav = newsShareWav(2);
    assert.equal(wav.subarray(0, 4).toString("ascii"), "RIFF");
    assert.ok(wav.length > 44 + 80000);
    const ironie = newsShareWav(2, "ironie", ["whoosh"]);
    const tension = newsShareWav(2, "tension", ["sting"]);
    const stats = newsShareWav(2, "stats", ["tick"]);
    const rock = newsShareWav(2, "rock", ["whoosh"]);
    assert.notEqual(ironie.compare(tension), 0);
    assert.notEqual(stats.compare(tension), 0);
    assert.notEqual(rock.compare(stats), 0);
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
    assert.ok(existsSync(path.join(dir, "chance.wav")));
    assert.ok(existsSync(path.join(dir, "reve.wav")));
  });
});
