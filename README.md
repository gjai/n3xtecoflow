# EcoFlow Stream

Site éditorial indépendant (guides EcoFlow / PowerStream), monétisé via Amazon Associates + Google AdSense.

## Domaines

- https://ecoflow-stream.com
- https://powerstream.fr

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- i18n FR (défaut) / EN via `next-intl`
- Docker standalone pour Coolify

## Variables d'environnement

Voir `.env.example` :

- `NEXT_PUBLIC_SITE_URL`
- `AMAZON_ASSOCIATE_TAG`
- `NEXT_PUBLIC_ADSENSE_CLIENT`

## Déploiement Coolify

1. DNS A `@` et `www` → `51.254.142.58` (déjà en place)
2. App Coolify : Dockerfile, port `3000`
3. FQDN : `ecoflow-stream.com,www.ecoflow-stream.com,powerstream.fr,www.powerstream.fr`
4. Activer Let's Encrypt
