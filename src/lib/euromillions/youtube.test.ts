import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  youtubeConfigured,
  youtubeShortDescription,
  youtubeShortTitle,
} from "./youtube.ts";

const draw = {
  date: "2026-09-08",
  numbers: [3, 12, 19, 27, 46],
  stars: [4, 12],
  jackpotEur: 111_000_000,
  myMillionCode: "AB 123 4567",
  source: "fdj" as const,
  fetchedAt: "2026-09-08T19:49:25.219Z",
};

describe("youtube Shorts meta", () => {
  it("titre ≤ 100 caractères avec #Shorts et le jackpot", () => {
    const title = youtubeShortTitle(draw);
    assert.ok(title.length <= 100);
    assert.match(title, /#Shorts/);
    assert.match(title, /111 M€/);
    assert.match(title, /mardi 8 septembre 2026/);
  });

  it("description 9:16 avec lien, #Shorts et My Million", () => {
    const text = youtubeShortDescription(draw);
    assert.match(text, /#Shorts/);
    assert.match(text, /3 · 12 · 19 · 27 · 46/);
    assert.match(text, /My Million : AB 123 4567/);
    assert.match(text, /euromillions-resultats\.fr\/fr\/tirages\/2026-09-08/);
    assert.match(text, /18\+/);
  });

  it("sans identifiants → non configuré", () => {
    const prev = process.env.YOUTUBE_REFRESH_TOKEN;
    delete process.env.YOUTUBE_REFRESH_TOKEN;
    try {
      assert.equal(youtubeConfigured(), false);
    } finally {
      if (prev !== undefined) process.env.YOUTUBE_REFRESH_TOKEN = prev;
    }
  });
});
