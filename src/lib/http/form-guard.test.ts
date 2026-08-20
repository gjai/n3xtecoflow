import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  contactOriginOk,
  isSpammyContact,
  issueContactGuard,
  verifyContactGuard,
} from "./form-guard.ts";

describe("contact guard", () => {
  it("accepte un jeton assez vieux, refuse trop tôt ou altéré", () => {
    const now = 1_700_000_000_000;
    const token = issueContactGuard(now);
    assert.equal(verifyContactGuard(token, now + 500), false);
    assert.equal(verifyContactGuard(token, now + 3_000), true);
    assert.equal(verifyContactGuard(token, now + 5 * 3600_000), false);
    assert.equal(verifyContactGuard(`${token}x`, now + 3_000), false);
    assert.equal(verifyContactGuard("", now + 3_000), false);
  });

  it("exige Origin = Host", () => {
    const ok = new Request("https://euromillions-resultats.fr/api/contact", {
      headers: {
        host: "euromillions-resultats.fr",
        origin: "https://euromillions-resultats.fr",
      },
    });
    const bad = new Request("https://euromillions-resultats.fr/api/contact", {
      headers: {
        host: "euromillions-resultats.fr",
        origin: "https://spam.example",
      },
    });
    const missing = new Request("https://euromillions-resultats.fr/api/contact", {
      headers: { host: "euromillions-resultats.fr" },
    });
    assert.equal(contactOriginOk(ok), true);
    assert.equal(contactOriginOk(bad), false);
    assert.equal(contactOriginOk(missing), false);
  });

  it("filtre le SEO / trop de liens, pas un message normal", () => {
    assert.equal(
      isSpammyContact({
        name: "Marie",
        email: "marie@example.fr",
        message: "Bonjour, une question sur le dernier tirage.",
      }),
      false,
    );
    assert.equal(
      isSpammyContact({
        name: "SEO",
        email: "bot@x.com",
        message:
          "Buy backlink package https://a.com https://b.com https://c.com https://d.com",
      }),
      true,
    );
  });
});
