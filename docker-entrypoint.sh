#!/bin/sh
set -eu
mkdir -p /app/data/news-images
if [ ! -f /app/data/news.json ] && [ -d /app/data-seed ]; then
  cp -a /app/data-seed/. /app/data/
fi
exec node server.js
