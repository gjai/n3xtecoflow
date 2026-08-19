import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sitemapLastModifiedForDrawDate, toParisIsoDate } from "./datetime.ts";

describe("toParisIsoDate", () => {
  it("garde un YYYY-MM-DD tel quel", () => {
    assert.equal(toParisIsoDate("2026-08-19"), "2026-08-19");
  });

  it("ne bascule pas J−1 pour un planned_at 00:15 Paris", () => {
    assert.equal(toParisIsoDate("2026-08-20T00:15:00+02:00"), "2026-08-20");
  });

  it("reste le jour du tirage à 21h Paris", () => {
    assert.equal(toParisIsoDate("2026-08-19T21:00:00+02:00"), "2026-08-19");
  });
});

describe("sitemapLastModifiedForDrawDate", () => {
  it("met lastmod = maintenant pour le soir / à venir", () => {
    const now = new Date("2026-08-21T21:12:00+02:00");
    const last = sitemapLastModifiedForDrawDate("2026-08-21", "2026-08-21", now);
    assert.equal(last.getTime(), now.getTime());
  });

  it("garde midi UTC pour une archive", () => {
    const last = sitemapLastModifiedForDrawDate(
      "2026-08-18",
      "2026-08-21",
      new Date("2026-08-21T21:12:00+02:00"),
    );
    assert.equal(last.toISOString(), "2026-08-18T12:00:00.000Z");
  });
});
