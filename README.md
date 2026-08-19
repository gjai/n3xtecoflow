# n3xtecoflow — multi-thème éditorial

App Next.js multi-domaine : thèmes EcoFlow + La gourde isotherme (et futurs thèmes).

## Domaines / thèmes

| Hosts | Thème | Canonical |
|-------|--------|-----------|
| `ecoflow-stream.com`, `www.*`, `powerstream.fr`, `www.*` | **ecoflow** | `ecoflow-stream.com` |
| `mon-tumbler.fr`, `www.*` | **tumbler** | `mon-tumbler.fr` |
| `massage-gun.fr`, `www.*` | **massage-gun** | `massage-gun.fr` |
| `casinos-crypto.fr`, `www.*` | **casinos-crypto** | `casinos-crypto.fr` |
| `euromillions-resultats.fr`, `www.*` | **euromillions** | `euromillions-resultats.fr` |

- `www.*` → apex (308)
- Canonical / hreflang / `robots.txt` / **sitemap** suivent le **Host** (un thème = ses URLs seulement)

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- i18n FR (défaut) / EN via `next-intl`
- Docker standalone pour Coolify

## Variables d'environnement

Voir `.env.example` (extrait) :

- `NEXT_PUBLIC_SITE_URL=https://ecoflow-stream.com` (fallback ecoflow uniquement — le Host prime)
- `AMAZON_ASSOCIATE_TAG`
- `NEWS_CRON_SECRET` (+ workflows GitHub)
- `GEMINI_API_KEY` / `OPENAI_*` (rewrite actu)
- `AMAZON_CREATORS_*` (prix live — dès éligibilité Associates)
- `NEXT_PUBLIC_ADSENSE_CLIENT` (snippet revue). **`NEXT_PUBLIC_ADSENSE_SLOTS=1` seulement après approbation AdSense**, avec les IDs d’unités
- `FDJ_AFFILIATE_URL` (+ `_LOTO`, `_EURODREAMS`, `_CRESCENDO`, `_KENO`) — liens Kwanko par jeu ; tant que vide, le CTA pointe vers fdj.fr

## Déploiement Coolify

1. DNS A `@` et `www` → VPS pour **chaque** domaine
2. App Coolify : Dockerfile, port `3000`
3. **Volume persistant** monté sur `/app/data` (news, images, prix, euromillions, fdj-games)
3b. **Umami** (service Coolify one-click) + env build `NEXT_PUBLIC_UMAMI_SCRIPT_URL` / `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
4. FQDN (même app) :
   `ecoflow-stream.com,www.ecoflow-stream.com,powerstream.fr,www.powerstream.fr,mon-tumbler.fr,www.mon-tumbler.fr,massage-gun.fr,www.massage-gun.fr,casinos-crypto.fr,www.casinos-crypto.fr,euromillions-resultats.fr,www.euromillions-resultats.fr`
5. Let's Encrypt
6. Healthcheck : `GET /api/health`

Nouveau thème : checklist `src/sites/_template-new-theme.ts` + `.cursor/rules/domaines-declaration.mdc`.

## Crons (GitHub Actions)

- `news-ingest.yml` → toutes les 4 h, `POST /api/news/ingest?siteId=…` en séquence (ecoflow, tumbler, massage-gun, casinos-crypto : `limit=2` ; euromillions : `limit=4`)
- `euromillions-refresh.yml` → live FDJ toutes les 10 min aux heures de tirage (`?mode=fast`) + refresh complet après tirages / daily, `POST /api/euromillions/refresh`
- `amazon-prices.yml` → `POST /api/amazon/prices/refresh`
