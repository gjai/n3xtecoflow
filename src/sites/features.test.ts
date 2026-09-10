import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ecoflowSite } from "./ecoflow.ts";
import { euromillionsSite } from "./euromillions.ts";
import { massageGunSite } from "./massage-gun.ts";
import { tumblerSite } from "./tumbler.ts";
import {
  siteAllowsAi,
  siteIndexedLocales,
  siteIndexesLocale,
  siteLocales,
} from "./features.ts";

describe("siteIndexesLocale", () => {
  it("noindex l’EN sur tumbler et pistolet", () => {
    assert.equal(siteIndexesLocale(tumblerSite, "fr"), true);
    assert.equal(siteIndexesLocale(tumblerSite, "en"), false);
    assert.equal(siteIndexesLocale(massageGunSite, "fr"), true);
    assert.equal(siteIndexesLocale(massageGunSite, "en"), false);
    assert.deepEqual(siteIndexedLocales(tumblerSite), ["fr"]);
  });

  it("garde FR+EN sur ecoflow, FR only sur EuroMillions", () => {
    assert.equal(siteIndexesLocale(ecoflowSite, "en"), true);
    assert.equal(siteIndexesLocale(euromillionsSite, "fr"), true);
    assert.equal(siteIndexesLocale(euromillionsSite, "en"), false);
    assert.equal(siteIndexesLocale(euromillionsSite, "it"), false);
    assert.deepEqual(siteIndexedLocales(euromillionsSite), ["fr"]);
    assert.deepEqual(siteLocales(euromillionsSite), ["fr"]);
  });
});

describe("siteAllowsAi", () => {
  it("n’autorise l’IA que sur EuroMillions", () => {
    assert.equal(siteAllowsAi("euromillions"), true);
    assert.equal(siteAllowsAi("ecoflow"), false);
    assert.equal(siteAllowsAi("tumbler"), false);
    assert.equal(siteAllowsAi("massage-gun"), false);
  });
});
