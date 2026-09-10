import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  pickTiktokPrivacy,
  tiktokCaption,
  tiktokConfigured,
} from "./tiktok.ts";

describe("tiktok caption + privacy", () => {
  it("tronque à 2200 caractères UTF-16", () => {
    const long = "a".repeat(2300);
    const out = tiktokCaption(long);
    assert.equal(out.length, 2199);
  });

  it("garde une légende courte avec hashtag", () => {
    const text = tiktokCaption("Loto — jackpot 2 M€\n\n#Loto");
    assert.match(text, /#Loto/);
  });

  it("honore SELF_ONLY si l’option n’est pas dans la liste demandée", () => {
    assert.equal(
      pickTiktokPrivacy(["SELF_ONLY"], "PUBLIC_TO_EVERYONE"),
      "SELF_ONLY",
    );
    assert.equal(
      pickTiktokPrivacy(
        ["PUBLIC_TO_EVERYONE", "SELF_ONLY"],
        "PUBLIC_TO_EVERYONE",
      ),
      "PUBLIC_TO_EVERYONE",
    );
  });

  it("sans identifiants → non configuré", () => {
    const prev = process.env.TIKTOK_REFRESH_TOKEN;
    delete process.env.TIKTOK_REFRESH_TOKEN;
    try {
      assert.equal(tiktokConfigured(), false);
    } finally {
      if (prev !== undefined) process.env.TIKTOK_REFRESH_TOKEN = prev;
    }
  });
});
