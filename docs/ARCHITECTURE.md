# Architecture
Agreed modular monolith with independent background workers. Next.js + TypeScript + shadcn/ui + Framer Motion dashboard; Fastify API; Better Auth; Zod boundary validation; Prisma with self-hosted PostgreSQL; Redis/BullMQ; Anthropic/OpenAI through a server-only AI gateway; Cloudflare R2; Hostinger VPS; Docker Compose; Cloudflare and Caddy ingress; pnpm; Vitest/Playwright.
Use existing Cloudflare, R2, Hostinger and GitHub accounts. Repository: https://github.com/ibrahimzahir/studio-os.git. Do not request or commit secrets.
Next.js, Fastify, Prisma/PostgreSQL migrations, Better Auth with TOTP, separate app/auth database clients, server authorization and scoped DAL are implemented locally. Queue, R2, durable content approvals and live research remain unconnected. See LAYERED-ARCHITECTURE.md for the actual top-down structure.
Postgres will own opportunities, evidence, immutable revisions, approval records, workflow runs/steps, artifacts, quality reports and audit logs. Workers use durable idempotency keys, bounded retries, budgets and an outbox/transaction boundary.

Hosting decision: follow the owner’s canonical INFRA_VPS_TUNNEL_DEPLOY.md: Cloudflare Tunnel with app-set headers, no extra Caddy proxy unless a documented existing-host constraint requires one. The earlier proposal’s Caddy entry is superseded for this deployment.
