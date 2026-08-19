import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergeDraws } from "./merge-draws.ts";
import type { EuroMillionsDraw } from "./types.ts";

function draw(
  over: Partial<EuroMillionsDraw> & Pick<EuroMillionsDraw, "source">,
): EuroMillionsDraw {
  return {
    date: "2026-08-19",
    numbers: [1, 2, 3, 4, 5],
    stars: [1, 2],
    jackpotEur: 50_000_000,
    fetchedAt: "2026-08-19T21:10:00Z",
    ...over,
  };
}

describe("mergeDraws", () => {
  it("ne laisse pas Pedro écraser un tirage FDJ déjà publié", () => {
    const fdj = draw({
      source: "fdj",
      numbers: [7, 8, 9, 10, 11],
      stars: [3, 4],
      jackpotEur: 17_000_000,
      myMillionCode: "AB 123 4567",
    });
    const pedro = draw({
      source: "pedromealha",
      numbers: [1, 2, 3, 4, 5],
      stars: [1, 2],
      jackpotEur: 99,
    });
    const [out] = mergeDraws([fdj], [pedro]);
    assert.equal(out.source, "fdj");
    assert.deepEqual(out.numbers, [7, 8, 9, 10, 11]);
    assert.deepEqual(out.stars, [3, 4]);
    assert.equal(out.jackpotEur, 17_000_000);
    assert.equal(out.myMillionCode, "AB 123 4567");
  });

  it("ne copie pas le jackpot UK (£) sur un tirage existant", () => {
    const prev = draw({ source: "fdj", jackpotEur: 40_000_000 });
    const uk = draw({ source: "uk-lottery", jackpotEur: 14_000_000 });
    const [out] = mergeDraws([prev], [uk]);
    assert.equal(out.source, "fdj");
    assert.equal(out.jackpotEur, 40_000_000);
  });

  it("laisse FDJ mettre à jour les barèmes du même tirage", () => {
    const old = draw({
      source: "fdj",
      prizeTiers: [{ rank: "5+2", winners: 0, amountEur: 0 }],
    });
    const fresh = draw({
      source: "fdj",
      prizeTiers: [{ rank: "5+2", winners: 1, amountEur: 17_000_000 }],
    });
    const [out] = mergeDraws([old], [fresh]);
    assert.equal(out.prizeTiers?.[0].amountEur, 17_000_000);
    assert.equal(out.prizeTiers?.[0].winners, 1);
  });
});
