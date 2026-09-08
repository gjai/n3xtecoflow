import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SHARE_FEED, euroMillionsShareCard } from "./share-card.ts";
import { lotteryShareSvg, rasterShare } from "./share-render.ts";

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
  });

  it("rasterise un PNG via sharp", async () => {
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
    assert.ok(png.length > 200);
  });
});
