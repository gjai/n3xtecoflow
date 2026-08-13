#!/bin/sh
set -eu
mkdir -p /app/data/news-images
if [ -d /app/data ]; then
  chown -R nextjs:nodejs /app/data 2>/dev/null || true
fi
if [ ! -f /app/data/news.json ] && [ -d /app/data-seed ]; then
  cp -a /app/data-seed/. /app/data/
  chown -R nextjs:nodejs /app/data 2>/dev/null || true
fi
# Volume already has news.json from older deploys — still seed missing stores.
if [ -d /app/data-seed ]; then
  for f in fdj-games.json euromillions.json; do
    if [ ! -f "/app/data/$f" ] && [ -f "/app/data-seed/$f" ]; then
      cp "/app/data-seed/$f" "/app/data/$f"
    fi
  done
  chown -R nextjs:nodejs /app/data 2>/dev/null || true
fi
exec su-exec nextjs node server.js
