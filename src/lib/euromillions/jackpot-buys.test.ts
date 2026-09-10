import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { newsStoryBeats } from "./share-render.ts";
import {
  composeJackpotBuysScript,
  generateJackpotBuyPhotos,
  JACKPOT_BUYS_KICKER,
  jackpotSpokenFr,
  parseJackpotBuysAiJson,
  pickNextJackpot,
} from "./jackpot-buys.ts";

describe("pickNextJackpot", () => {
  it("prend l’EuroMillions s’il est plus gros que le Loto", () => {
    const pick = pickNextJackpot({
      em: { date: "2026-09-11", jackpotEur: 111_000_000 },
      loto: { date: "2026-09-12", jackpotEur: 6_000_000 },
    });
    assert.equal(pick?.game, "euromillions");
    assert.equal(pick?.jackpotEur, 111_000_000);
  });

  it("prend le Loto si l’EuroMillions n’a pas de jackpot", () => {
    const pick = pickNextJackpot({
      em: { date: "2026-09-11", jackpotEur: null },
      loto: { date: "2026-09-12", jackpotEur: 6_000_000 },
    });
    assert.equal(pick?.game, "loto");
  });

  it("garde l’EuroMillions à montant égal", () => {
    const pick = pickNextJackpot({
      em: { date: "2026-09-11", jackpotEur: 5_000_000 },
      loto: { date: "2026-09-12", jackpotEur: 5_000_000 },
    });
    assert.equal(pick?.game, "euromillions");
  });
});

describe("jackpotSpokenFr", () => {
  it("dit 111 millions", () => {
    assert.equal(jackpotSpokenFr(111_000_000), "111 millions");
  });
});

describe("parseJackpotBuysAiJson", () => {
  const target = {
    game: "euromillions" as const,
    jackpotEur: 111_000_000,
    drawDate: "2026-09-11",
    label: "EuroMillions",
  };

  it("accepte 3 achats dont la somme tient dans le jackpot", () => {
    const ok = parseJackpotBuysAiJson(
      JSON.stringify({
        title: "3 folies avec 111 millions à l’EuroMillions",
        accroche: "Vendredi, 111 millions. Trois achats, et il resterait de la monnaie.",
        items: [
          {
            name: "île",
            priceEur: 30_000_000,
            line: "Une île privée à 30 millions, plage comprise.",
            imagePrompt: "private island aerial 9:16",
          },
          {
            name: "yacht",
            priceEur: 40_000_000,
            line: "Un yacht de 70 mètres à 40 millions.",
            imagePrompt: "luxury yacht sunset 9:16",
          },
          {
            name: "club",
            priceEur: 25_000_000,
            line: "Un club de Ligue 2 racheté 25 millions cash.",
            imagePrompt: "floodlit stadium 9:16",
          },
        ],
        chute: "Il resterait encore de quoi s’ennuyer. Vous commencez par quoi ?",
      }),
      target,
    );
    assert.ok(ok);
    assert.equal(ok?.visuels?.length, 3);
    assert.match(ok?.body || "", /île privée/);
    const beats = newsStoryBeats(ok?.body);
    assert.match(beats[0], /île privée/);
    assert.match(beats[1], /yacht/);
    assert.match(beats[2], /club/);
  });

  it("refuse si la somme dépasse le jackpot", () => {
    const bad = parseJackpotBuysAiJson(
      JSON.stringify({
        title: "3 folies avec 111 millions à l’EuroMillions",
        accroche: "Vendredi, 111 millions. Trois achats hors sol.",
        items: [
          { name: "a", priceEur: 80_000_000, line: "Un truc à 80 millions d’euros cash." },
          { name: "b", priceEur: 80_000_000, line: "Un autre truc à 80 millions d’euros." },
          { name: "c", priceEur: 80_000_000, line: "Encore 80 millions d’euros par-dessus." },
        ],
        chute: "Trop cher. Vous tenterez quand même ?",
      }),
      target,
    );
    assert.equal(bad, null);
  });
});

describe("composeJackpotBuysScript", () => {
  it("skipAi renvoie le fallback", async () => {
    const script = await composeJackpotBuysScript({
      skipAi: true,
      target: {
        game: "euromillions",
        jackpotEur: 111_000_000,
        drawDate: "2026-09-11",
        label: "EuroMillions",
      },
    });
    assert.equal(script.source, "fallback");
    assert.match(script.title, /111 millions/);
    assert.equal(JACKPOT_BUYS_KICKER, "TICKET GAGNANT");
    const prev = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    try {
      const photos = await generateJackpotBuyPhotos(script);
      assert.ok(photos.length >= 1);
    } finally {
      if (prev !== undefined) process.env.GEMINI_API_KEY = prev;
    }
  });
});
