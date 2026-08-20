import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { rankFromMatches } from "../euromillions/prize.ts";
import {
  attachEuropeWinners,
  fillEmptyJackpotTier,
  parseEuropeanWinnerCounts,
  parseRegularPrizeTiers,
  parseWinsetTiers,
  type FdjShareSet,
} from "./shares.ts";

/** 13 rangs Regular FDJ, montants en centimes (scale 2), plus un raffle à ignorer. */
const SHARES: FdjShareSet[] = [
  {
    winset_name: "Regular",
    prize_levels: [
      {
        division_name: "5+2",
        winning_boards: [{ currency: "EUR", amount: 17_000_000_00, scale: 2, count: 1 }],
      },
      {
        division_name: "5+1",
        winning_boards: [{ currency: "EUR", amount: 312_456_78, scale: 2, count: 4 }],
      },
      {
        division_name: "5",
        winning_boards: [{ currency: "EUR", amount: 28_000_00, scale: 2, count: 12 }],
      },
      {
        division_name: "4+2",
        winning_boards: [{ currency: "EUR", amount: 1_234_56, scale: 2, count: 40 }],
      },
      {
        division_name: "4+1",
        winning_boards: [{ currency: "EUR", amount: 156_78, scale: 2, count: 800 }],
      },
      {
        division_name: "3+2",
        winning_boards: [{ currency: "EUR", amount: 98_76, scale: 2, count: 1_800 }],
      },
      {
        division_name: "4",
        winning_boards: [{ currency: "EUR", amount: 54_32, scale: 2, count: 3_000 }],
      },
      {
        division_name: "2+2",
        winning_boards: [{ currency: "EUR", amount: 21_50, scale: 2, count: 20_000 }],
      },
      {
        division_name: "3+1",
        winning_boards: [{ currency: "EUR", amount: 14_20, scale: 2, count: 40_000 }],
      },
      {
        division_name: "3",
        winning_boards: [{ currency: "EUR", amount: 11_80, scale: 2, count: 90_000 }],
      },
      {
        division_name: "1+2",
        winning_boards: [{ currency: "EUR", amount: 9_40, scale: 2, count: 110_000 }],
      },
      {
        division_name: "2+1",
        winning_boards: [{ currency: "EUR", amount: 7_10, scale: 2, count: 500_000 }],
      },
      {
        division_name: "2",
        winning_boards: [{ currency: "EUR", amount: 4_20, scale: 2, count: 4_000_000 }],
      },
      {
        division_name: "My Million raffle",
        winning_boards: [{ currency: "EUR", amount: 1_000_000_00, scale: 2, count: 1 }],
      },
    ],
  },
  {
    winset_name: "Etoile +",
    prize_levels: [
      {
        division_name: "E+ 5+1",
        winning_boards: [{ currency: "EUR", amount: 5_000_00, scale: 2, count: 2 }],
      },
    ],
  },
];

const REGULAR_RANKS = [
  "5+2",
  "5+1",
  "5",
  "4+2",
  "4+1",
  "3+2",
  "4",
  "2+2",
  "3+1",
  "3",
  "1+2",
  "2+1",
  "2",
];

describe("barèmes FDJ", () => {
  it("parse Regular : 13 rangs, raffle sauté, montants en euros", () => {
    const tiers = parseRegularPrizeTiers(SHARES);
    assert.equal(tiers.length, 13);
    assert.deepEqual(
      tiers.map((t) => t.rank),
      REGULAR_RANKS,
    );
    assert.equal(tiers[0].amountEur, 17_000_000);
    assert.equal(tiers[0].winners, 1);
    assert.equal(tiers[1].amountEur, 312_456.78);
    assert.equal(tiers[12].amountEur, 4.2);
    assert.ok(!tiers.some((t) => /raffle/i.test(t.rank)));
  });

  it("ne mélange pas Regular et Étoile+", () => {
    const etoile = parseWinsetTiers(SHARES, "etoile");
    assert.equal(etoile.length, 1);
    assert.equal(etoile[0].rank, "E+ 5+1");
    assert.equal(etoile[0].amountEur, 5_000);
  });

  it("aligne les 13 rangs du simulateur sur les division_name FDJ", () => {
    const matchPairs: Array<[number, number]> = [
      [5, 2],
      [5, 1],
      [5, 0],
      [4, 2],
      [4, 1],
      [3, 2],
      [4, 0],
      [2, 2],
      [3, 1],
      [3, 0],
      [1, 2],
      [2, 1],
      [2, 0],
    ];
    assert.deepEqual(
      matchPairs.map(([balls, stars]) => rankFromMatches(balls, stars)),
      REGULAR_RANKS,
    );
  });

  it("colle le jackpot si le rang 1 est à 0 €", () => {
    const emptyTop = parseRegularPrizeTiers([
      {
        winset_name: "Regular",
        prize_levels: [
          {
            division_name: "5+2",
            winning_boards: [{ currency: "EUR", amount: 0, scale: 2, count: 0 }],
          },
          {
            division_name: "5+1",
            winning_boards: [{ currency: "EUR", amount: 100_00, scale: 2, count: 3 }],
          },
        ],
      },
    ]);
    const filled = fillEmptyJackpotTier(emptyTop, 250_000_000, null);
    assert.equal(filled?.[0].amountEur, 250_000_000);
    assert.equal(filled?.[1].amountEur, 100);
  });

  it("colle les gagnants Europe (european_shares) sur les rangs Regular", () => {
    const tiers = attachEuropeWinners(
      parseRegularPrizeTiers(SHARES),
      parseEuropeanWinnerCounts([
        {
          winset_name: "Regular",
          prize_levels: [
            { division_name: "5+2", count: 0 },
            { division_name: "5+1", count: 2 },
          ],
        },
      ]),
    );
    assert.equal(tiers[0].winnersEurope, 0);
    assert.equal(tiers[1].winnersEurope, 2);
    assert.equal(tiers[0].winners, 1);
  });
});
