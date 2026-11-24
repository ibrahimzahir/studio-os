Tier: T1 — private, invite-only digital product studio; pre-production.

# Studio OS

Next.js/TypeScript dashboard and Fastify API for evidence-driven product operations. Codex owns engineering; Antigravity creates product drafts/assets for human review.

## Local development

Use Node 24.22.0 and pnpm 11.11.0. Install with `pnpm install --frozen-lockfile`, then `pnpm db:generate`. Set ignored `.env` values using `.env.example`. Run migrations only against the intended database with migration-owner credentials; runtime uses separate restricted app/auth roles. Run `pnpm dev` for Next.js on http://127.0.0.1:3000 and Fastify on loopback port 4000.

Routes: `/sign-in` (no public registration), `/studio` (private, 2FA required), `/settings/security` (authenticator enrollment), `/preview` (explicitly fictional product hypotheses). Developer-only account and maintenance controls are in the private workspace. Staff access is default-deny by permission.

The local development database was provisioned under `.local/postgres` on port 55440. Restart it if needed with `pg_ctl -D .local/postgres -l .local/postgres.log -o '-h 127.0.0.1 -p 55440 -k /tmp' start`. This isolated loopback cluster uses development-only trust auth; do not deploy its configuration. Local credentials and database files are ignored by Git. `scripts/provision-local.ts` refuses production and existing accounts; it is not a production bootstrap procedure.

## Verification

`pnpm check` runs lint, strict typechecking, unit tests and production build. PostgreSQL security integration tests require `TEST_DATABASE_URL` pointing to an isolated `*_test` database plus restricted `DATABASE_URL`, `AUTH_DATABASE_URL` and test auth settings; see CI. Without that URL, six integration cases explicitly skip. Never point tests at production.

## Architecture and continuation

Start with AGENTS.md, docs/HANDOFF.md, docs/LAYERED-ARCHITECTURE.md and docs/STUDIO-OS-RELEASE-PLAN.md. Shared Zod contracts infer TypeScript types; Prisma 7/PostgreSQL, Better Auth/TOTP, scoped DAL and Fastify protect data in both directions. UI uses official shadcn Base UI, sidebar-03, lucide-react, reusable components and semantic light/dark/system themes.

Antigravity: execute docs/ANTIGRAVITY-RELEASE-SPRINT.md next; do not repeat completed preparation. Daily generation, R2 promotion, durable pipeline, Pinterest RSS scheduling, operational analytics and live deployment remain under development. Existing Cloudflare, R2, Hostinger VPS and GitHub accounts will be reused.

Reconstructed from “AI PDF Strategy Review” on 24 November 2026. Original ZIP/prototype and psychology-cheat-sheet.pdf were unavailable; recovered claims are historical context, not current verified research. The shared UX psychology standard governs the interface.
