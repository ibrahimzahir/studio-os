# Multi-stage Dockerfile for Studio OS (Next.js + Fastify + Prisma migrator)
# Node 24.22.0 slim; runs as non-root `node` user in runtime stages.

FROM node:24.22.0-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm db:generate
RUN pnpm build

# Stage 1: One-shot Prisma migrator (run before api/web rollout)
FROM deps AS migrator
COPY prisma ./prisma
COPY prisma7.config.ts ./prisma7.config.ts
USER node
CMD ["pnpm", "db:migrate"]

# Stage 2: Fastify API server (internal port 4000)
FROM base AS api
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/tsconfig.json ./tsconfig.json
COPY --from=build --chown=node:node /app/src ./src
USER node
EXPOSE 4000
CMD ["node", "--import", "tsx", "src/server/start.ts"]

# Stage 3: Next.js Web UI server (loopback port 3000 behind Cloudflare Tunnel)
FROM base AS web
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/next.config.ts ./next.config.ts
COPY --from=build --chown=node:node /app/proxy.ts ./proxy.ts
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/antigravity ./antigravity
USER node
EXPOSE 3000
CMD ["./node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
