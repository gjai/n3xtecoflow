FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL=https://ecoflow-stream.com
ARG NEXT_PUBLIC_ADSENSE_CLIENT=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_ADSENSE_CLIENT=$NEXT_PUBLIC_ADSENSE_CLIENT
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEWS_DATA_PATH=/app/data/news.json
ENV NEWS_MEDIA_PATH=/app/data/news-images

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs \
  && mkdir -p /app/data /app/data/news-images /app/data-seed \
  && chown -R nextjs:nodejs /app/data /app/data-seed \
  && apk add --no-cache su-exec

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/data ./data-seed
COPY --chmod=755 docker-entrypoint.sh /app/docker-entrypoint.sh

EXPOSE 3000
USER root
CMD ["/app/docker-entrypoint.sh"]
