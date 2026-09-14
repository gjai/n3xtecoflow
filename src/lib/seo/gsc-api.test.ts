import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatGscDigestLines,
  isNewsLanding,
  isResultsHeadTerm,
  type GscDigestSnapshot,
} from "./gsc-api.ts";

describe("isResultsHeadTerm", () => {
  it("reconnaît résultats euromillions avec ou sans accent", () => {
    assert.equal(isResultsHeadTerm("résultats euromillions"), true);
    assert.equal(isResultsHeadTerm("euromillions resultats"), true);
    assert.equal(isResultsHeadTerm("euromillions jackpot"), false);
  });
});

describe("isNewsLanding", () => {
  it("repère une URL d’actu", () => {
    assert.equal(
      isNewsLanding("https://euromillions-resultats.fr/fr/actualites/foo"),
      true,
    );
    assert.equal(
      isNewsLanding("https://euromillions-resultats.fr/fr/tirages"),
      false,
    );
  });
});

describe("formatGscDigestLines", () => {
  it("dit quand le compte de service manque", () => {
    const snap: GscDigestSnapshot = {
      enabled: false,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
      topQueries: [],
      headImpressions: 0,
      headClicks: 0,
      headPosition: 0,
      leftoverImpressions: 0,
      leftoverClicks: 0,
    };
    const lines = formatGscDigestLines(snap).join("\n");
    assert.match(lines, /Compte de service absent/);
  });

  it("résume clics, head term et locales orphelines", () => {
    const snap: GscDigestSnapshot = {
      enabled: true,
      siteUrl: "sc-domain:euromillions-resultats.fr",
      startDate: "2026-08-14",
      endDate: "2026-09-11",
      clicks: 4,
      impressions: 120,
      ctr: 0.033,
      position: 48.2,
      topQueries: [
        {
          query: "euromillions resultats",
          clicks: 1,
          impressions: 3,
          position: 8.3,
        },
      ],
      headImpressions: 8,
      headClicks: 0,
      headPosition: 65.5,
      leftoverImpressions: 6,
      leftoverClicks: 1,
    };
    const lines = formatGscDigestLines(snap).join("\n");
    assert.match(lines, /Clics 4 · impressions 120/);
    assert.match(lines, /résultat\(s\) euromillions/);
    assert.match(lines, /Anciennes URLs \/en \/es/);
    assert.match(lines, /euromillions resultats/);
  });
});
