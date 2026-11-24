# Studio OS release plan — target 26 November 2026

Owner directive on 24 November: “you have 2days to complete this project and send to production. Do everything, and update antigravity task files.” This is a release target, not evidence that an unfinished system is production-ready.

## Locked requirements

- Private studio for the developer and a few staff. No registration page or public signup endpoint.
- Developer/owner has full operational access; staff/viewers default-deny. User block, suspend and enable revoke sessions and are audited. Developer self-lockout prevented.
- Better Auth, TOTP enrollment verification, recovery codes, recent authentication for sensitive changes, persisted rate limits. Email verification is distinct from 2FA.
- Layers: interface → shared Zod contracts → Fastify API → authentication/authorization → DAL → domain/Prisma → PostgreSQL. Validate inputs and safe outputs; never expose credential models. Roles come from the database, not request bodies.
- shadcn Base UI, sidebar-03, semantic light/dark/system tokens, Lucide React icons. Shared buttons, header/title/card, search/filter, numbered pagination, skeletons, toasts, action dropdowns, empty/error states. Minimal primary-screen copy; progressive disclosure.
- Next.js/TypeScript, inferred types, Prisma 7.10.1 stable (Prisma 8 release candidate not selected), PostgreSQL, Fastify, Redis/BullMQ, R2, existing Cloudflare and Hostinger VPS, GitHub Actions, pnpm. Do not substitute a different stack.
- Antigravity generates daily drafts and images with lower-cost models for routine work; human reviews, approves, publishes or schedules. Budget limits and quality escalation; no guarantee of unattended Antigravity execution until supported runner verified.
- Pinterest primary marketing. Four approved Pins per day; website SSR landing pages plus RSS feed. RSS publication is not exact Pinterest posting time (Pinterest says up to 24h ingestion). Private R2 drafts separate from public approved images. Public marketing routes must remain crawlable while admin is private.
- Professional analytics: revenue vs profit vs subscription MRR, conversions, Pinterest outbound clicks, attribution/source freshness, production cost, token usage, operational latency/errors. Unknown data stays unknown. No fabricated charts or tracking pixels without privacy/consent work.
- Owner-only package/framework/plugin security-advisory view; dependency update/audit CI. Health: app liveness/readiness, database, queue, storage, VPS/Docker, data freshness. Never display green for an unobserved service.
- Daily full consistent database backups; monthly encrypted infrastructure/config/volume bundle; private Cloudflare R2 offsite and owner-side copy; age private key stays off VPS. RPO ~24h; RTO measured by restore drill. R2 assets need independent copies; DB dumps do not include media.

## Sequence and acceptance evidence

1. Auth/DAL/database + common interface: typed build, negative auth/role/CSRF/scope tests, TOTP challenge and recovery tests, session revocation, real PostgreSQL restricted-role tests, mobile/keyboard UI QA.
2. Product pipeline: durable revisions, evidence, content-bound approvals, audit events and idempotent worker dispatch; bounded retries/budgets; artifact ingestion validates manifest/file signatures/checksums.
3. Storage/marketing: scoped R2 clients, draft/approved promotion, daily draft queue, four daily approved feed slots, SSR product pages, per-board RSS, duplicate prevention, tests proving unapproved/future items stay private.
4. Operations: measured analytics only, protected health/security view, encrypted backup integration and scratch restore verification; alerts for stale/missing jobs.
5. Production: supported pinned container images, non-root services, no public DB/Redis ports, Cloudflare Tunnel ingress using canonical shared standards, protected deployment pipeline, migration gate, smoke tests, rollback and actual backup restore. Reuse existing backup service instead of installing a competing scheduler.

## Current evidence and blockers

Local migrations applied to isolated test and development PostgreSQL. Restricted auth/app roles exist. Developer account provisioned locally; credentials ignored and mode 600. Local PostgreSQL is loopback-only with trust authentication for development; NEVER copy this setup into production.
21 tests passed with real PostgreSQL on 24 November, covering domain logic, auth/TOTP challenge/recovery, DAL isolation and account status/maintenance. Typecheck passed. Browser verified sample search, page numbers and dark theme. Full updated production build and CI are pending.
Initial GitHub foundation CI succeeded. Auth/DAL/UI changes are not yet pushed. Live infrastructure, R2 credentials, production hostname, release runtime, backup jobs and marketing runner remain unconfigured/unverified. Request production domain and VPS identifier only; use existing secure credentials or owner-managed env, never chat secrets.

## Deployment architecture decision

The earlier proposal mentioned Caddy. The owner's canonical INFRA_VPS_TUNNEL_DEPLOY.md takes precedence: Cloudflare Tunnel ingress, no additional reverse proxy, app-owned security headers. Record any actual deviation before deployment. Follow existing host-wide backup discovery and isolate backup credentials from asset credentials.
