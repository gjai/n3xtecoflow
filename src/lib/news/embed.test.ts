import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildEmbedPayload, embedSnippet } from "./embed.ts";
import type { EuroMillionsDraw } from "@/lib/euromillions/types.ts";

describe("embed widget", () => {
  it("injecte un lien d’attribution vers le site", () => {
    const draw: EuroMillionsDraw = {
      date: "2026-09-11",
      numbers: [1, 7, 15, 39, 50],
      stars: [1, 11],
      myMillionCode: "SS 396 2341",
      source: "manual",
      fetchedAt: "2026-09-11T20:00:00.000Z",
    };
    const payload = buildEmbedPayload([draw]);
    assert.match(payload.html, /euromillions-resultats\.fr/);
    assert.match(payload.html, /\/fr\/tirages\/2026-09-11/);
    assert.match(payload.html, /1<\/span>/);
    assert.match(embedSnippet(), /embed\.js/);
    assert.match(payload.snippet, /data-host/);
  });
});
