# Architecture
Agreed modular monolith with independent background workers. Next.js + TypeScript + shadcn/ui + Framer Motion dashboard; Fastify API; Better Auth; Zod boundary validation; Prisma with self-hosted PostgreSQL; Redis/BullMQ; Anthropic/OpenAI through a server-only AI gateway; Cloudflare R2; Hostinger VPS; Docker Compose; Cloudflare and Caddy ingress; pnpm; Vitest/Playwright.
Use existing Cloudflare, R2, Hostinger and GitHub accounts. Repository: https://github.com/ibrahimzahir/studio-os.git. Do not request or commit secrets.
Only Next.js and the shared domain modules exist so far. Queue, database, auth, R2 and API are planned, not connected. Add those as verified increments.
Postgres will own opportunities, evidence, immutable revisions, approval records, workflow runs/steps, artifacts, quality reports and audit logs. Workers use durable idempotency keys, bounded retries, budgets and an outbox/transaction boundary.
