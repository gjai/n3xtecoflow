import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { lotteryIndexNowUrls } from "./indexnow.ts";
import type { EuroMillionsStore } from "@/lib/euromillions/types";
import type { FdjGamesStore } from "@/lib/fdj-games/types";

describe("lotteryIndexNowUrls", () => {
  it("ne ping que le français", () => {
    const em = {
      updatedAt: "2026-09-08T20:00:00Z",
      draws: [
        {
          date: "2026-09-08",
          numbers: [13, 17, 33, 35, 39],
          stars: [7, 12],
          source: "fdj",
          fetchedAt: "2026-09-08T20:00:00Z",
        },
      ],
      nextDrawDate: "2026-09-11",
    } as EuroMillionsStore;
    const fdj = { games: {}, updatedAt: "2026-09-08T20:00:00Z" } as FdjGamesStore;
    const urls = lotteryIndexNowUrls(em, fdj);
    assert.equal(urls.some((u) => u.includes("/en/")), false);
    assert.equal(
      urls.includes("https://euromillions-resultats.fr/fr/tirages/2026-09-08"),
      true,
    );
  });
});
