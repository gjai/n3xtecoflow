import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { KWANKO_BANNERS, KWANKO_MAIL_BANNERS } from "./kwanko-slots.ts";
import { mailBannerHtml } from "./mail/em-layout.ts";

const MAFF = /trk\.php\?maff=(P[0-9A-F]+)/i;
const MCLIC = /trk\.php\?mclic=(P[0-9A-F]+)/i;

function trackingId(url: string, key: "maff" | "mclic"): string {
  const id = new URL(url).searchParams.get(key);
  assert.ok(id, `${key} manquant dans ${url}`);
  return id;
}

describe("mail banner img=clic", () => {
  it("chaque campagne : maff et mclic portent le même id (S→P)", () => {
    const names = Object.keys(KWANKO_MAIL_BANNERS);
    assert.ok(names.length >= 5);
    for (const name of names) {
      const b = KWANKO_MAIL_BANNERS[name]!;
      const imgId = trackingId(b.img, "maff");
      const clickId = trackingId(b.click, "mclic");
      assert.equal(imgId, clickId, `${name}: img ≠ clic`);
      assert.match(imgId, /^P[0-9A-F]+$/i);
    }
  });

  it("EuroMillions et EuroDreams ne partagent plus le JPEG croisé", () => {
    const em = KWANKO_MAIL_BANNERS.euromillions!;
    const ed = KWANKO_MAIL_BANNERS.eurodreams!;
    assert.notEqual(trackingId(em.img, "maff"), trackingId(ed.img, "maff"));
    assert.notEqual(em.click, ed.click);
    assert.equal(
      trackingId(em.img, "maff"),
      KWANKO_BANNERS.FilRouge_EUML_2025["640x340"].id.replace(/^S/, "P"),
    );
    assert.equal(
      trackingId(ed.img, "maff"),
      KWANKO_BANNERS.Fil_Rouge_EDMS["640x340"].id.replace(/^S/, "P"),
    );
  });

  it("le HTML enveloppe l’image dans le clic du même support", () => {
    const html = mailBannerHtml("euromillions");
    const imgId = html.match(MAFF)?.[1];
    const clickId = html.match(MCLIC)?.[1];
    assert.ok(imgId);
    assert.equal(imgId, clickId);
    assert.ok(
      html.includes(`href="https://action.metaffiliation.com/trk.php?mclic=${clickId}"`),
    );
    assert.ok(
      html.includes(`src="https://action.metaffiliation.com/trk.php?maff=${imgId}"`),
    );
  });
});
