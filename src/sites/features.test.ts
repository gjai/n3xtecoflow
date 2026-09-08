import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ecoflowSite } from "./ecoflow.ts";
import { euromillionsSite } from "./euromillions.ts";
import { massageGunSite } from "./massage-gun.ts";
import { tumblerSite } from "./tumbler.ts";
import { siteIndexedLocales, siteIndexesLocale } from "./features.ts";

describe("siteIndexesLocale", () => {
  it("noindex l’EN sur tumbler et pistolet", () => {
    assert.equal(siteIndexesLocale(tumblerSite, "fr"), true);
    assert.equal(siteIndexesLocale(tumblerSite, "en"), false);
    assert.equal(siteIndexesLocale(massageGunSite, "fr"), true);
    assert.equal(siteIndexesLocale(massageGunSite, "en"), false);
    assert.deepEqual(siteIndexedLocales(tumblerSite), ["fr"]);
  });

  it("garde FR+EN sur ecoflow et EuroMillions", () => {
    assert.equal(siteIndexesLocale(ecoflowSite, "en"), true);
    assert.equal(siteIndexesLocale(euromillionsSite, "en"), true);
    assert.equal(siteIndexesLocale(euromillionsSite, "it"), false);
  });
});
