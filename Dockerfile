# Image de base
FROM node:22-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_DISABLE_ESLINT=true

# Installe les dépendances
FROM base AS deps

RUN apk add --no-cache libc6-compat \
    build-base \
    python3 \
 && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN npm ci --legacy-peer-deps

# Build l'app
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

# L'image de prod finale
FROM base AS prod

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

# L'image de dev finale
FROM base AS dev

WORKDIR /app

ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN apk add --no-cache bash git

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

COPY . .

USER root

EXPOSE 3000

CMD ["npm", "run", "dev"]