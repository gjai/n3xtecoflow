import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { EuroMillionsDraw } from "./types.ts";
import {
  euroMillionsAdjacentDraws,
  euroMillionsComboText,
  euroMillionsDrawPageDescription,
  euroMillionsDrawPageTitle,
} from "./draw-seo.ts";

function draw(
  date: string,
  numbers: number[],
  stars: number[],
): EuroMillionsDraw {
  return {
    date,
    numbers,
    stars,
    source: "fdj",
    fetchedAt: "",
  };
}

describe("euroMillionsComboText", () => {
  it("sépare boules et étoiles", () => {
    assert.equal(euroMillionsComboText([7, 12, 19, 33, 44], [3, 8]), "7 12 19 33 44 ★ 3 8");
  });
});

describe("euroMillionsDrawPageTitle", () => {
  it("met la combinaison dans le title FR publié", () => {
    const title = euroMillionsDrawPageTitle(
      "fr",
      "mardi 25 août 2026",
      draw("2026-08-25", [1, 2, 3, 4, 5], [6, 7]),
    );
    assert.match(title, /mardi 25 août 2026/);
    assert.match(title, /1 2 3 4 5 ★ 6 7/);
  });

  it("reste daté sans combo si le tirage n’est pas publié", () => {
    const title = euroMillionsDrawPageTitle("fr", "mardi 8 septembre 2026", {
      date: "2026-09-08",
      numbers: [],
      stars: [],
      source: "fdj",
      fetchedAt: "",
    });
    assert.match(title, /21h/);
    assert.doesNotMatch(title, /★/);
  });
});

describe("euroMillionsDrawPageDescription", () => {
  it("cite boules, étoiles et My Million", () => {
    const d = draw("2026-08-25", [10, 20, 30, 40, 45], [1, 12]);
    d.myMillionCode = "AB1234567";
    const desc = euroMillionsDrawPageDescription("fr", "mardi 25 août 2026", d);
    assert.match(desc, /10, 20, 30, 40, 45/);
    assert.match(desc, /1, 12/);
    assert.match(desc, /AB1234567/);
  });
});

describe("euroMillionsAdjacentDraws", () => {
  it("pointe vers le plus récent et le plus ancien voisin", () => {
    const a = draw("2026-08-25", [1, 2, 3, 4, 5], [1, 2]);
    const b = draw("2026-08-28", [6, 7, 8, 9, 10], [3, 4]);
    const c = draw("2026-09-01", [11, 12, 13, 14, 15], [5, 6]);
    const { newer, older } = euroMillionsAdjacentDraws([a, c, b], "2026-08-28");
    assert.equal(newer?.date, "2026-09-01");
    assert.equal(older?.date, "2026-08-25");
  });
});
