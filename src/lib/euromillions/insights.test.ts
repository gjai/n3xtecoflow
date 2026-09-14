import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { EuroMillionsDraw } from "./types.ts";
import {
  brokenAbsences,
  buildCiteSnapshot,
  buildDrawStory,
  buildPressPitch,
  buildWeeklyStory,
  formatMillionsEur,
  rolloverStreak,
} from "./insights.ts";

function draw(
  date: string,
  numbers: number[],
  stars: number[],
  extra: Partial<EuroMillionsDraw> = {},
): EuroMillionsDraw {
  return {
    date,
    numbers,
    stars,
    source: "manual",
    fetchedAt: `${date}T20:00:00.000Z`,
    ...extra,
  };
}

/** 20 tirages : le 22 absent partout sauf le plus récent. */
function archiveWithLate22(): EuroMillionsDraw[] {
  const out: EuroMillionsDraw[] = [
    draw("2026-09-11", [1, 7, 15, 22, 50], [1, 11], {
      jackpotEur: 111_000_000,
      hasWinner: true,
      myMillionCode: "SS 396 2341",
    }),
  ];
  for (let i = 1; i <= 20; i += 1) {
    const d = `2026-08-${String(32 - i).padStart(2, "0")}`;
    // dates fictives : on recule simplement via index dans stats, la date n’importe pas
    out.push(
      draw(`2026-08-${String(21 - i).padStart(2, "0")}`, [1, 3, 7, 15, 50], [1, 11], {
        jackpotEur: 17_000_000,
        hasWinner: false,
      }),
    );
  }
  return out;
}

describe("formatMillionsEur", () => {
  it("écrit 111 millions", () => {
    assert.equal(formatMillionsEur(111_000_000, "fr"), "111 millions d’euros");
  });
});

describe("brokenAbsences", () => {
  it("détecte le 22 après une longue absence", () => {
    const abs = brokenAbsences(archiveWithLate22());
    const hit = abs.find((a) => a.n === 22 && a.kind === "number");
    assert.ok(hit);
    assert.ok((hit?.delayBefore || 0) >= 12);
  });
});

describe("buildDrawStory", () => {
  it("priorise l’absence longue", () => {
    const story = buildDrawStory(archiveWithLate22());
    assert.equal(story?.kind, "absence");
    assert.match(story?.titleFr || "", /EuroMillions/);
    assert.match(story?.titleFr || "", /22/);
    assert.doesNotMatch(story?.titleFr || "", /r[ée]sultats/i);
    assert.equal(story?.guid, "original:em:draw:2026-09-11:absence");
  });

  it("raconte un jackpot remporté sans absence notable", () => {
    const draws = [
      draw("2026-09-11", [1, 2, 3, 4, 5], [1, 2], {
        jackpotEur: 98_000_000,
        hasWinner: true,
      }),
      draw("2026-09-08", [1, 2, 3, 4, 6], [1, 2], {
        jackpotEur: 89_000_000,
        hasWinner: false,
      }),
    ];
    const story = buildDrawStory(draws);
    assert.equal(story?.kind, "jackpot-won");
    assert.match(story?.titleFr || "", /jackpot remporté/i);
  });

  it("compte les reports", () => {
    const draws = [
      draw("2026-09-11", [1, 2, 3, 4, 5], [1, 2], {
        jackpotEur: 40_000_000,
        hasWinner: false,
      }),
      draw("2026-09-08", [6, 7, 8, 9, 10], [3, 4], {
        jackpotEur: 30_000_000,
        hasWinner: false,
      }),
      draw("2026-09-04", [11, 12, 13, 14, 15], [5, 6], {
        jackpotEur: 17_000_000,
        hasWinner: true,
      }),
    ];
    assert.equal(rolloverStreak(draws), 2);
    const story = buildDrawStory(draws);
    assert.equal(story?.kind, "rollover");
  });
});

describe("buildWeeklyStory", () => {
  it("attend au moins 10 tirages", () => {
    assert.equal(buildWeeklyStory([draw("2026-09-11", [1, 2, 3, 4, 5], [1, 2])]), null);
  });

  it("produit un guid de semaine stable", () => {
    const story = buildWeeklyStory(archiveWithLate22());
    assert.ok(story);
    assert.match(story?.guid || "", /^original:em:weekly:2026-W/);
    assert.match(story?.titleFr || "", /10 boules/);
  });
});

describe("buildCiteSnapshot / pitch", () => {
  it("expose un échantillon et un pitch citables", () => {
    const snap = buildCiteSnapshot(archiveWithLate22());
    assert.ok(snap.sampleSize >= 10);
    assert.equal(snap.latestDate, "2026-09-11");
    const pitch = buildPressPitch(archiveWithLate22());
    assert.match(pitch.fr, /ANALYSE/);
    assert.match(pitch.fr, /euromillions-resultats\.fr\/fr\/stats/);
  });
});
