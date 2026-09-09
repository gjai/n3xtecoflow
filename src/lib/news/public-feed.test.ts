import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { publicFeedPath, requestOrigin, sitePublicFeedPath } from "./public-feed.ts";
import { ecoflowSite } from "@/sites/ecoflow.ts";
import { euromillionsSite } from "@/sites/euromillions.ts";

describe("publicFeedPath", () => {
  it("ne crée qu’un flux FR et un flux EN", () => {
    assert.equal(publicFeedPath("fr"), "/feed.xml");
    assert.equal(publicFeedPath("en"), "/en/feed.xml");
    assert.equal(publicFeedPath("it"), "/en/feed.xml");
    assert.equal(publicFeedPath("de"), "/en/feed.xml");
  });

  it("EuroMillions n’expose que /feed.xml", () => {
    assert.equal(sitePublicFeedPath(euromillionsSite, "fr"), "/feed.xml");
    assert.equal(sitePublicFeedPath(euromillionsSite, "en"), "/feed.xml");
    assert.equal(sitePublicFeedPath(ecoflowSite, "en"), "/en/feed.xml");
  });
});

describe("requestOrigin", () => {
  it("préfère X-Forwarded-Host à 0.0.0.0", () => {
    const req = new Request("https://0.0.0.0:3000/fr/feed.xml", {
      headers: {
        host: "0.0.0.0:3000",
        "x-forwarded-host": "euromillions-resultats.fr",
        "x-forwarded-proto": "https",
      },
    });
    assert.equal(requestOrigin(req), "https://euromillions-resultats.fr");
  });
});
