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

describe("youtube Loto Shorts meta", () => {
  it("titre Loto avec jackpot et #Shorts", async () => {
    const { youtubeLotoShortTitle, youtubeLotoShortDescription } = await import(
      "./youtube.ts"
    );
    const loto = {
      gameId: "loto" as const,
      date: "2026-09-10",
      plannedAt: "2026-09-10T18:55:00.000Z",
      jackpotEur: 2_000_000,
      groups: [
        {
          type: "numeros principaux",
          kind: "numbers" as const,
          labelKey: "main",
          values: [4, 5, 18, 22, 35],
        },
        {
          type: "numero chance",
          kind: "bonus" as const,
          labelKey: "chance",
          values: [2],
        },
      ],
      source: "fdj" as const,
      fetchedAt: "2026-09-10T19:00:00.000Z",
    };
    const title = youtubeLotoShortTitle(loto);
    assert.ok(title.length <= 100);
    assert.match(title, /Loto/);
    assert.match(title, /#Shorts/);
    assert.match(title, /2 M€/);
    const text = youtubeLotoShortDescription(loto);
    assert.match(text, /chance 2/);
    assert.match(text, /\/fr\/jeux\/loto\/2026-09-10/);
    assert.ok(!text.includes("EuroMillions"));
  });
});

describe("youtube EuroDreams Shorts meta", () => {
  it("titre EuroDreams avec jackpot et #Shorts", async () => {
    const { youtubeEuroDreamsShortTitle, youtubeEuroDreamsShortDescription } =
      await import("./youtube.ts");
    const draw = {
      gameId: "eurodreams" as const,
      date: "2026-09-07",
      plannedAt: "2026-09-07T21:00:00.000+02:00",
      jackpotEur: 20_000,
      groups: [
        {
          type: "numeros principaux",
          kind: "numbers" as const,
          labelKey: "main",
          values: [7, 9, 10, 26, 33, 40],
        },
        {
          type: "numero dream",
          kind: "bonus" as const,
          labelKey: "dream",
          values: [1],
        },
      ],
      source: "fdj" as const,
      fetchedAt: "2026-09-07T21:10:00.000Z",
    };
    const title = youtubeEuroDreamsShortTitle(draw);
    assert.ok(title.length <= 100);
    assert.match(title, /EuroDreams/);
    assert.match(title, /#Shorts/);
    const text = youtubeEuroDreamsShortDescription(draw);
    assert.match(text, /rêve 1/);
    assert.match(text, /\/fr\/jeux\/eurodreams\/2026-09-07/);
    assert.ok(!text.includes("EuroMillions"));
  });
});

describe("youtube playlists", () => {
  it("EuroMillions + My Million si le code est publié", async () => {
    const {
      youtubePlaylistsForEuroMillions,
      youtubePlaylistsForCompanion,
      YOUTUBE_PLAYLIST_TITLES,
    } = await import("./youtube.ts");
    assert.deepEqual(
      youtubePlaylistsForEuroMillions(draw),
      ["euromillions", "mymillion"],
    );
    assert.deepEqual(
      youtubePlaylistsForEuroMillions({ ...draw, myMillionCode: null }),
      ["euromillions"],
    );
    assert.deepEqual(youtubePlaylistsForCompanion("loto"), ["loto"]);
    assert.deepEqual(youtubePlaylistsForCompanion("eurodreams"), ["eurodreams"]);
    assert.equal(YOUTUBE_PLAYLIST_TITLES.mymillion, "My Million");
  });
});
