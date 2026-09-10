import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isEuroMillionsLiveWindow,
  isNewsShortSlot,
  parisHourKey,
  isoWeekKeyFromParisDate,
  parisIsoWeekKey,
  sitemapLastModifiedForDrawDate,
  toParisIsoDate,
} from "./datetime.ts";

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

describe("parisIsoWeekKey", () => {
  it("classe le jeudi 10 septembre 2026 en 2026-W37", () => {
    assert.equal(isoWeekKeyFromParisDate("2026-09-10"), "2026-W37");
    assert.equal(isoWeekKeyFromParisDate("2026-09-07"), "2026-W37");
    assert.equal(isoWeekKeyFromParisDate("2026-09-13"), "2026-W37");
  });

  it("bascule le lundi suivant", () => {
    assert.equal(isoWeekKeyFromParisDate("2026-09-14"), "2026-W38");
  });

  it("utilise le jour civil Paris, pas UTC", () => {
    assert.equal(
      parisIsoWeekKey(new Date("2026-09-13T22:30:00Z")),
      "2026-W38",
    );
  });
});

describe("isNewsShortSlot", () => {
  it("ouvre chaque heure Paris, minutes 00–19", () => {
    assert.equal(
      isNewsShortSlot(new Date("2026-09-13T10:00:00+02:00")),
      true,
    );
    assert.equal(
      isNewsShortSlot(new Date("2026-09-13T10:19:00+02:00")),
      true,
    );
    assert.equal(
      isNewsShortSlot(new Date("2026-09-13T10:20:00+02:00")),
      false,
    );
    assert.equal(
      isNewsShortSlot(new Date("2026-09-13T11:00:00+02:00")),
      true,
    );
    assert.equal(
      isNewsShortSlot(new Date("2026-09-13T03:05:00+02:00")),
      true,
    );
    assert.equal(
      isNewsShortSlot(new Date("2026-09-13T09:59:00+02:00")),
      false,
    );
    assert.equal(
      parisHourKey(new Date("2026-09-13T11:07:00+02:00")),
      "2026-09-13T11",
    );
  });
});

describe("isEuroMillionsLiveWindow", () => {
  it("ouvre mar/ven à 21h15, pas un mercredi ni trop tôt", () => {
    assert.equal(
      isEuroMillionsLiveWindow(new Date("2026-09-01T21:15:00+02:00")),
      true,
    );
    assert.equal(
      isEuroMillionsLiveWindow(new Date("2026-09-04T22:10:00+02:00")),
      true,
    );
    assert.equal(
      isEuroMillionsLiveWindow(new Date("2026-09-01T20:50:00+02:00")),
      false,
    );
    assert.equal(
      isEuroMillionsLiveWindow(new Date("2026-09-02T21:15:00+02:00")),
      false,
    );
  });
});
