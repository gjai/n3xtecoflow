/**
 * Lecture GSC (compte de service). N’imprime jamais le JSON ni le token.
 * Usage : node --experimental-strip-types --import ./scripts/node-test-register.mjs scripts/gsc-check.mjs
 */
import {
  inspectGscUrl,
  isNewsLanding,
  isResultsHeadTerm,
  listGscSites,
  pickGscProperty,
  queryGscSearchAnalytics,
} from "../src/lib/seo/gsc-api.ts";

const origin = "https://euromillions-resultats.fr";

try {
  const sites = await listGscSites();
  console.log("propriétés GSC :", sites.length ? sites.join(" | ") : "(aucune)");
  const siteUrl = pickGscProperty(sites);
  console.log("propriété utilisée :", siteUrl);

  const { rows } = await queryGscSearchAnalytics({
    siteUrl,
    queryContains: "euromillions",
    rowLimit: 250,
  });
  const head = rows.filter((r) => isResultsHeadTerm(r.query));
  console.log("lignes euromillions (90 j) :", rows.length);
  console.log("dont « résultat(s) euromillions » :", head.length);
  const shown = (head.length ? head : rows.slice(0, 15)).slice(0, 20);
  for (const row of shown) {
    const flag = isNewsLanding(row.page) ? "ACTU" : "ok";
    console.log(
      `${flag}\t${row.impressions} imp\tpos ${row.position.toFixed(1)}\t${row.query}\t→ ${row.page}`,
    );
  }

  const inspect = [
    `${origin}/fr`,
    `${origin}/fr/tirages`,
  ];
  for (const url of inspect) {
    const r = await inspectGscUrl(url, siteUrl);
    if (r.rawError) {
      console.log("inspect", url, r.rawError);
      continue;
    }
    console.log(
      "inspect",
      url,
      r.coverageState || r.verdict || "?",
      r.indexingState || "",
      r.lastCrawlTime || "pas de crawl",
    );
  }
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(msg);
  if (/gsc_sites 403|gsc_no_property|aucun/.test(msg)) {
    console.error(
      "Invite gsc-reader@euromillions-gsc.iam.gserviceaccount.com comme Propriétaire dans GSC → Utilisateurs et autorisations.",
    );
  }
  process.exit(1);
}
