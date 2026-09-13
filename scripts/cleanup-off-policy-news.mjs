#!/usr/bin/env node
/**
 * Migration de démarrage idempotente : retire des articles publiés par erreur
 * avant que le filtre éditorial (src/lib/news/rss.ts, isForeignNonJackpotWin)
 * n'existe. Liste figée, revue en code review — pas de jugement dynamique.
 * Sans effet si /app/data/news.json n'existe pas encore ou si les slugs sont
 * déjà absents (sûr à ré-exécuter à chaque démarrage de conteneur).
 *
 * Ajouté 2026-09-13 : gains secondaires (hors jackpot) à l'étranger,
 * hors périmètre éditorial du site (demande utilisateur).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const PATH = process.env.NEWS_DATA_PATH || "/app/data/news.json";

const REMOVE_SLUGS = [
  "2026-09-12-euromillions-un-gain-de-plus-de-265-000-remporte-a-la-pineda-tarragone-35179f",
  "2026-09-11-euromillions-un-gagnant-a-leganes-remporte-1-million-d-euros-grace-au-co-85493b",
  "2026-09-05-euromillions-un-gain-d-un-million-d-euros-pour-el-millon-en-andalousie-b72986",
  "2026-09-04-euromillions-un-gain-de-695-000-remporte-a-calatayud-espagne-186771",
];

if (!existsSync(PATH)) {
  console.log("cleanup-off-policy-news: pas de news.json, rien a faire");
  process.exit(0);
}

const store = JSON.parse(readFileSync(PATH, "utf8"));
const before = store.articles.length;
store.articles = store.articles.filter((a) => !REMOVE_SLUGS.includes(a.slug));
const removed = before - store.articles.length;

if (removed > 0) {
  writeFileSync(PATH, JSON.stringify(store, null, 2));
  console.log(`cleanup-off-policy-news: ${removed} article(s) retire(s)`);
} else {
  console.log("cleanup-off-policy-news: rien a retirer (deja fait ou absent)");
}
