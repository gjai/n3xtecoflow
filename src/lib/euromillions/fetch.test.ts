import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseUkLatestPayload } from "./fetch.ts";

describe("parseUkLatestPayload", () => {
  it("lit le CSV et ignore le jackpot £", () => {
    const csv = `DrawDate,Ball 1,Ball 2,Ball 3,Ball 4,Ball 5,Lucky Star 1,Lucky Star 2,Prize,DrawNumber
15-Aug-2026,7,12,19,32,44,3,8,"£14,000,000",1842
`;
    const parsed = parseUkLatestPayload(csv, "https://example.test/csv");
    assert.ok(parsed);
    assert.equal(parsed.draw.date, "2026-08-15");
    assert.deepEqual(parsed.draw.numbers, [7, 12, 19, 32, 44]);
    assert.deepEqual(parsed.draw.stars, [3, 8]);
    assert.equal(parsed.draw.jackpotEur, null);
    assert.equal(parsed.draw.source, "uk-lottery");
    assert.equal(parsed.draw.drawId, "1842");
  });

  it("lit le XML sans stocker le jackpot comme des euros", () => {
    const xml = `<?xml version="1.0"?><draw-results>
      <draw-date>2026-08-18</draw-date>
      <draw-number>99</draw-number>
      <ball number="1">1</ball><ball number="2">2</ball>
      <ball number="3">3</ball><ball number="4">4</ball>
      <ball number="5">5</ball>
      <bonus-ball>6</bonus-ball><bonus-ball>7</bonus-ball>
      <jackpot-amount>14000000</jackpot-amount>
      <next-draw-date>2026-08-21</next-draw-date>
      <next-estimated-jackpot>17000000</next-estimated-jackpot>
    </draw-results>`;
    const parsed = parseUkLatestPayload(xml, "https://example.test/xml");
    assert.ok(parsed);
    assert.equal(parsed.draw.date, "2026-08-18");
    assert.equal(parsed.draw.jackpotEur, null);
    assert.equal(parsed.nextDrawDate, "2026-08-21");
    assert.equal("nextJackpotEur" in parsed, false);
  });
});
