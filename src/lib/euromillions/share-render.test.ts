import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SHARE_FEED, euroMillionsShareCard } from "./share-card.ts";
import { lotteryShareSvg, rasterShare, wrapLines } from "./share-render.ts";

describe("lotteryShareSvg", () => {
  it("inclut kicker, date et boules", () => {
    const svg = lotteryShareSvg(
      euroMillionsShareCard({
        date: "2026-09-04",
        numbers: [11, 12, 19, 27, 46],
        stars: [4, 12],
        jackpotEur: null,
        source: "fdj",
        fetchedAt: "2026-09-04T19:49:25.219Z",
      }),
      SHARE_FEED,
    );
    assert.match(svg, /EUROMILLIONS/);
    assert.match(svg, />11</);
    assert.match(svg, />46</);
    assert.match(svg, />4</);
    assert.match(svg, /<polygon /);
    assert.match(svg, /font-family="Inter"/);
  });

  it("met le jackpot en M€", async () => {
    const { formatShareJackpot } = await import("./share-card.ts");
    assert.equal(formatShareJackpot(111_000_000), "Jackpot 111 M€");
    assert.equal(formatShareJackpot(14_500_000), "Jackpot 14,5 M€");
  });

  it("rasterise un PNG via resvg (texte réel, pas des tofu)", async () => {
    const svg = lotteryShareSvg(
      {
        kicker: "Test",
        dateLabel: "4 septembre 2026",
        accent: "#f5c542",
        accentInk: "#0b1220",
        rows: [{ values: [1, 2, 3] }],
      },
      { width: 400, height: 200 },
    );
    const png = await rasterShare(svg, "png");
    assert.equal(png[0], 0x89);
    assert.equal(png[1], 0x50);
    assert.ok(png.length > 4000, `png trop léger (${png.length}) — police manquante ?`);
  });
});

describe("wrapLines", () => {
  it("casse un titre long sans déborder", () => {
    const lines = wrapLines(
      "EuroMillions : le jackpot grimpe après un tirage sans grand gagnant",
      28,
      4,
    );
    assert.ok(lines.length >= 2);
    assert.ok(lines.every((l) => l.length <= 28));
  });
});
