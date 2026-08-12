# EcoFlow Stream

Site éditorial indépendant (guides EcoFlow / PowerStream), monétisé via Amazon Associates + Google AdSense.

## Domaines

- https://ecoflow-stream.com (**canonique SEO**)
- https://powerstream.fr (même thème / contenu ; canonical → ecoflow-stream.com)
- `www.*` redirige vers l’apex (308)

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- i18n FR (défaut) / EN via `next-intl`
- Docker standalone pour Coolify

## Variables d'environnement

Voir `.env.example` (extrait) :

- `NEXT_PUBLIC_SITE_URL=https://ecoflow-stream.com`
- `AMAZON_ASSOCIATE_TAG`
- `NEWS_CRON_SECRET` (+ workflows GitHub)
- `GEMINI_API_KEY` / `OPENAI_*` (rewrite actu)
- `AMAZON_CREATORS_*` (prix live — dès éligibilité Associates)
- `NEXT_PUBLIC_ADSENSE_CLIENT` + `NEXT_PUBLIC_ADSENSE_SLOTS=1` + slot IDs

## Déploiement Coolify

1. DNS A `@` et `www` → `51.254.142.58`
2. App Coolify : Dockerfile, port `3000`
3. **Volume persistant** monté sur `/app/data` (news, images, analytics, prix)
4. FQDN : `ecoflow-stream.com,www.ecoflow-stream.com,powerstream.fr,www.powerstream.fr`
5. Let's Encrypt
6. Healthcheck : `GET /api/health`

## Crons (GitHub Actions)

- `news-ingest.yml` → `POST /api/news/ingest`
- `amazon-prices.yml` → `POST /api/amazon/prices/refresh`
- `daily-stats.yml` → `POST /api/stats/daily`
