import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { tiragesDateQueryPath } from "./tirages-query.ts";

describe("tiragesDateQueryPath", () => {
  it("envoie ?date=ISO vers la fiche datée", () => {
    assert.equal(
      tiragesDateQueryPath("/fr/tirages", "2026-08-25"),
      "/fr/tirages/2026-08-25",
    );
    assert.equal(
      tiragesDateQueryPath("/en/tirages/", "2026-08-21"),
      "/en/tirages/2026-08-21",
    );
  });

  it("ne touche pas au hub sans ?date ni aux fiches déjà datées", () => {
    assert.equal(tiragesDateQueryPath("/fr/tirages", null), null);
    assert.equal(tiragesDateQueryPath("/fr/tirages", ""), null);
    assert.equal(
      tiragesDateQueryPath("/fr/tirages/2026-08-25", "2026-08-21"),
      null,
    );
  });

  it("strip une date invalide vers le hub propre", () => {
    assert.equal(tiragesDateQueryPath("/fr/tirages", "nope"), "/fr/tirages");
    assert.equal(tiragesDateQueryPath("/en/tirages", "2026-8-25"), "/en/tirages");
  });
});
