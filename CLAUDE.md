@AGENTS.md

# n3xtecoflow — notes de contexte (Claude)

Site multi-thème Next.js (ecoflow-stream.com, mon-tumbler.fr, massage-gun.fr, **euromillions-resultats.fr**). Déployé sur le VPS via Coolify, app UUID `5vfqqtuutewouqw8psiknl8q`.

## Pipeline Reels/Shorts EuroMillions (le cœur du projet analysé le 2026-09-13)

Deux pipelines distincts dans `src/lib/euromillions/` :

1. **Reels "résultat de tirage" (actif, evergreen, celui qui marche)**
   - Déclenché par `euromillions-refresh.yml` (poll live FDJ) → `notifyFacebookOnPublish()` dans `facebook.ts` (2150+ lignes)
   - Génère image (`share-card.ts`) + vidéo 9:16 (`share-video.ts` via ffmpeg, `-crf 20 -preset veryfast` — réglages fixes, pas de dégradation liée aux ressources)
   - Cross-post : Facebook (fil+story+reel), Instagram (via compte Pro lié), YouTube Shorts. **TikTok configuré dans le code mais AUCUNE variable `TIKTOK_*` définie en prod — rien ne part vers TikTok actuellement.**
   - Couvre EuroMillions + jeux compagnons (Loto, EuroDreams, Keno, Crescendo)

2. **Reels "Histoire IA" (`news-short-script.ts`) — sous-performant, techniquement encore actif malgré l'intention d'arrêt**
   - Cron `news-short.yml` désactivé (`workflow_dispatch` seul), commentaire dans le fichier : "HISTOIRE arrêté — ne plus poster"
   - Mais `NEWS_SHORT_ENABLED=1` en prod, et des vidéos "Histoire" continuent de sortir (vu dans le flux RSS YouTube du 10-11/09) — mécanisme de déclenchement encore actif à identifier si besoin
   - **Data réelle (flux RSS YouTube, chaîne @euromillionsresultats, 2026-09-13)** : les Shorts résultats font 359-868 vues, les Shorts "Histoire" font 2-51 vues. Format nettement sous-performant — ne pas investir dessus sans données contraires.

## TikTok — configuré mais échoue systématiquement (investigué 2026-09-15)

Les clés (`TIKTOK_CLIENT_KEY/SECRET`, `TIKTOK_REFRESH_TOKEN`) sont présentes en prod, `TIKTOK_PRIVACY=SELF_ONLY` correctement réglé (mode sûr avant audit). Pourtant chaque post échoue avec l'erreur TikTok *"Please review our integration guidelines"* (visible via `docker logs` du conteneur ecoflow, grep `tiktok_post_fail`). `lastPostedTiktok` reste `null` pour tous les jeux dans `em-facebook.json`.

**Diagnostic** : ce n'est pas un bug côté code (clés OK, logique `pickTiktokPrivacy` correcte, `TIKTOK_PRIVACY` bien réglé). C'est très probablement une restriction **TikTok Developer Portal** : app encore en mode sandbox/non auditée, et le compte TikTok connecté n'est pas dans la liste des comptes de test autorisés pour cette app — restriction côté TikTok, pas corrigeable dans ce repo.

**À vérifier sur developers.tiktok.com (accès humain requis, pas accessible depuis Claude Code)** :
1. Le compte TikTok utilisé est-il dans la liste des comptes de test de l'app ?
2. Statut d'audit de l'app (en review / refusé / jamais soumis) ?

Ne pas re-déboguer le code TikTok sans avoir d'abord vérifié ces deux points côté TikTok.

**Contournement prod (2026-09-18)** : `TIKTOK_ENABLED=0` coupe `tiktokConfigured()` — plus d'appels API / spam logs tant que le portail n'est pas OK.

## État réel de la chaîne YouTube (@euromillionsresultats)

- Channel ID `UCGwhv-PTDTlpisv2UwXgg9A`, **active depuis le 10/09/2026 seulement**, 4 abonnés, ~2200 vues au 13/09/2026 — chaîne toute jeune.
- Le trafic vient très probablement de la recherche ("résultat loto ce soir") — les titres factuels ("Loto samedi 12 septembre 2026 — 6 M€") matchent bien cette intention, à garder tels quels.
- Bandeau CTA "Abonne-toi" existe dans le rendu vidéo (`share-render.ts`) mais semble conditionné à un flag `live` — à vérifier qu'il s'affiche bien sur tous les formats qui performent.

## Prod / Coolify

- VPS : `ubuntu@51.254.142.58`, root sudo dispo. Coolify API token stocké dans `~/.config/coolify/token` sur cette machine.
- Container : `5vfqqtuutewouqw8psiknl8q-112604301246`
- Charge VPS au 13/09/2026 : load average ~1.34/6 cœurs (Haswell virtualisé) — **pas de contention**, donc pas de raison "ressources" de déplacer le rendu vidéo ailleurs.
