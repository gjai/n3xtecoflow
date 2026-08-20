import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { companionDivisionName } from "./companion-prize.ts";
import { COMPANION_GRID, countMatches } from "./rules.ts";

describe("Keno 16/70", () => {
  it("grille 2025 : 16 tirés parmi 70, pick 4–10 (défaut 7)", () => {
    const keno = COMPANION_GRID.keno;
    assert.equal(keno.mainCount, 16);
    assert.equal(keno.mainMax, 70);
    assert.equal(keno.pickMin, 4);
    assert.equal(keno.pickMax, 10);
    assert.equal(keno.pickDefault, 7);
  });

  it("rang FDJ = hits/pickCount", () => {
    assert.equal(companionDivisionName("keno", 7, false, false, 7), "7/7");
    assert.equal(companionDivisionName("keno", 10, false, false, 10), "10/10");
    assert.equal(companionDivisionName("keno", 0, false, false, 4), "0/4");
    assert.equal(companionDivisionName("keno", 5, false, false, 8), "5/8");
  });

  it("une grille de 16 uniques dans 1–70 se compare sans collision", () => {
    const drawn = [1, 4, 9, 16, 20, 27, 33, 40, 45, 51, 58, 62, 66, 68, 69, 70];
    assert.equal(drawn.length, COMPANION_GRID.keno.mainCount);
    assert.equal(new Set(drawn).size, 16);
    assert.ok(drawn.every((n) => n >= 1 && n <= COMPANION_GRID.keno.mainMax));
    const pick = [1, 16, 33, 51, 62, 69, 70];
    assert.equal(pick.length, COMPANION_GRID.keno.pickDefault);
    assert.equal(countMatches(pick, drawn), 7);
  });
});
