import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isEuroMillionsResultClone } from "./rss.ts";

describe("isEuroMillionsResultClone", () => {
  it("bloque une actu « résultats » même sans date", () => {
    assert.equal(
      isEuroMillionsResultClone("Résultats EuroMillions : les numéros du tirage"),
      true,
    );
  });

  it("bloque marque puis résultats", () => {
    assert.equal(
      isEuroMillionsResultClone("EuroMillions : les résultats du vendredi soir"),
      true,
    );
  });

  it("bloque un titre anglais results + EuroMillions", () => {
    assert.equal(
      isEuroMillionsResultClone("EuroMillions results: winning numbers"),
      true,
    );
  });

  it("laisse passer un jackpot sans mot « résultats »", () => {
    assert.equal(
      isEuroMillionsResultClone("EuroMillions : le jackpot franchit 230 millions"),
      false,
    );
  });

  it("laisse passer une offre FDJ", () => {
    assert.equal(
      isEuroMillionsResultClone(
        "Offre de bienvenue FDJ : vérifier les conditions avant de jouer à EuroMillions",
      ),
      false,
    );
  });
});
