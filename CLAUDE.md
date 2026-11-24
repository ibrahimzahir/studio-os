# Claude — infrastructure, CI/CD and production handoff

## Owner assignment

On 24 November 2026 the owner explicitly assigned production CI/CD, Hostinger VPS, Cloudflare/R2 integration, deployment and operational infrastructure to Claude: “give this part to claude,. it already has everything for CI CD and infra skills. update claude md file so it can pickup it”. Use your existing infrastructure context and secure access. Do not ask the owner to resend credentials, domain or VPS details already available to you. Never put secrets in chat, source or logs.

The release target is 26 November 2026, subject to verified readiness. Do not equate a deadline with passing release gates. Coordinate with Codex (application engineering) and Antigravity (commercial drafts/assets); preserve their uncommitted work. No destructive reset, clean, force-push or replacement scaffold.

## Read first

Project AGENTS.md, README.md, every docs/*.md file; prioritize docs/HANDOFF.md, docs/LAYERED-ARCHITECTURE.md, docs/STUDIO-OS-RELEASE-PLAN.md and docs/ANTIGRAVITY-RELEASE-SPRINT.md. Read parent ../AGENTS.md and ../standards/ENGINEERING_PLAYBOOK.md.

Apply your installed `vps-deploy-and-backups`, `nextjs-prisma-ci`, CI/CD and relevant Cloudflare skills. Canonical local references:
- ../standards/INFRA_VPS_TUNNEL_DEPLOY.md, including gotchas and go-live checklist.
- ../standards/BACKUP_RESTORE_STANDARD.md, including coverage, restore and silent-failure lessons.
- ../standards/UI_UX_PSYCHOLOGY.md for any operations interface changes.

## Actual application state

Path: /Users/ibrahimzahir/development/studio-os. Remote: https://github.com/ibrahimzahir/studio-os.git. Initial foundation commit da20f33 on main passed GitHub CI. Later auth/UI/CI work is currently local; inspect git status and current branch before starting. Do not assume it was already pushed.

Next.js 16.4.6 / React 19.3.1 App Router, TypeScript 6.0.3, pnpm 11.11.0, Node 24.22.0. Fastify 5.12.8 API on loopback 4000; Next same-origin /api rewrite currently targets that address. Better Auth 1.7.27 with Argon2id, disabled public signup, DB-backed sessions/rate limits, verified TOTP enrollment and recovery codes. Prisma 7.10.1 with @prisma/adapter-pg and PostgreSQL. Do not upgrade to Prisma 8 RC: it is prerelease and Better Auth's adapter does not support its client API.

Interface: official shadcn Base UI/sidebar-03, lucide-react, shared controls, light/dark/system themes. Owner selected cool white/slate with blue accents. Primary screens must be concise, use clear actions and progressive disclosure.

App routes: /sign-in (invite-only), /studio (active account + 2FA), /settings/security, /preview (sample hypotheses only), /maintenance. Developer controls for user block/suspend/enable and maintenance are server-enforced, audited and revoke sessions; staff cannot administer. Current permission/scope checks and safe DTO projections are in src/server/auth and src/server/dal. Speculative production-package functions are not network approval endpoints.

## Verification already observed locally

- Full pnpm check passed: lint, strict typecheck, 15 unit tests (6 DB integration cases explicitly skipped without TEST_DATABASE_URL), production Next.js build.
- Separate isolated PostgreSQL run passed all 21 tests, including real auth/TOTP/recovery, origin/anonymous denial, safe DAL output, studio scoping, status/maintenance and restricted database roles.
- Production dependency audit clear after overriding transitive Effect to patched 3.22.1. Preserve override until upstream is safe. ESLint 10.15.0 and TypeScript 6 align because typescript-eslint rejected TS7.
- Browser checked sample search, page 2, dark theme; responsive/accessibility QA remains incomplete.
- Local sign-in/API/preview HTTP verification is recorded in HANDOFF.md; recheck rather than assuming processes survive handoff.

## Security and runtime constraints

Separate production DATABASE_URL (studio_app), AUTH_DATABASE_URL (studio_auth) and migration-owner credentials. Migrations create NOLOGIN, NOSUPERUSER, NOBYPASSRLS roles; provision LOGIN/passwords securely per environment. The app role cannot read credential/TOTP tables or private User columns. DAL does row scoping; database RLS is not implemented and must not be claimed.

Production BETTER_AUTH_URL must be the exact HTTPS origin, no trailing slash/path; secret >=32 chars, securely generated. No bypass flags or public registration. Configure owner account securely through a reviewed production bootstrap/recovery procedure; NEVER deploy the local temporary password or development data.

.local/postgres on port 55440 and /tmp/studio-os-security-pg on 55439 are local-only trust-auth clusters. .env and .local/DEVELOPER-ACCESS.txt are ignored, permission-restricted development files; do not copy them to production or expose their values. No production credentials have been provisioned by Codex.

Nonce CSP lives in proxy.ts and src/server/security/headers.ts; nonce also passed to next-themes. Security headers belong to the app. Validate deployed hydration, sign-in, TOTP and cookies, not only header presence. Origin checking is in Fastify; ensure proxy forwarding, trusted IP selection, request sizes and rate limiting remain correct behind the real ingress. Do not trust arbitrary X-Forwarded-For.

## Execute infrastructure work in order

1. Inspect existing VPS, DNS, Cloudflare, R2, runners and backup service using your available secure access. Inventory read-only before changes. Reuse existing accounts. Preserve unrelated projects and mail records.
2. Produce/update docs/CLAUDE-INFRA-HANDOFF.md with actual host/domain/deployment architecture and status, without secrets. Follow canonical Cloudflare Tunnel ingress (no inbound web ports, no extra Caddy proxy); earlier proposal's Caddy entry is superseded unless actual host constraints justify a documented exception.
3. Build reviewable Docker/Compose configuration for Next + Fastify + database and later queue services. Current /api rewrite and API loopback binding need explicit container design: co-locate or configure internal service address; do not silently route to localhost in another container. Use supported pinned images/digests, non-root runtime, restricted networks, no public DB/Redis ports, limits/log rotation and real readiness checks. Keep a separate migrator stage with Prisma CLI/tsx; standalone Next alone does not run the API.
4. Complete CI: inspect prepared .github/workflows/ci.yml (PostgreSQL, migrations, restricted roles, lint/typecheck/tests/build/audit). Run actual GitHub checks. Daily dependency audit workflow, Dependabot and secret-scanning configuration are prepared. Add required branch protection/checks and protected staging/production promotion. Use existing self-hosted runner pattern on a firewalled box; do not open SSH to the internet for GitHub-hosted runners. Never run untrusted fork PR code on the VPS runner.
5. Configure scoped R2 assets credentials separately from backup credentials. Draft artifacts and review images private; only human-approved public marketing images get public URLs. Do not expose customer downloads or backup buckets. Supply server-side configuration to Codex without revealing key values. Antigravity outputs versioned manifests/files for later ingestion; no supported unattended runner is verified yet.
6. Integrate Studio OS into existing host-wide daily full pg_dump backups and monthly encrypted infrastructure/.env/volume bundles. Private R2 offsite + owner-side copy; age private key off VPS. Include media separately from DB. Reuse canonical retention and isolated backup account where available. Do not invent R2 Object Lock/versioning support: verify actual capabilities and document alternatives.
7. Restore a real encrypted backup into scratch infrastructure, verify counts/application query and record measured RTO/RPO. Confirm actual backup coverage, artifact checksums, retention and stale/missing-job alerts. A successful upload is not a passed restore drill.
8. Add measured readiness/monitoring: app, DB, queue, R2, disk/memory/container restart/error/latency and backup freshness. Keep privileged details owner-only and public liveness minimal. No green statuses without measurements. Add package/framework/plugin advisories and approved update handling.
9. Deploy staging; exercise production-like role isolation, sign-in/TOTP, staff suspension/maintenance, hydration, headers and rollback. Production promotion requires actual app feature readiness and human product release approval where applicable; do not advertise planned automation as working. Record remaining blockers and all checks in docs/CLAUDE-INFRA-HANDOFF.md, then merge a concise entry into HANDOFF.md.

## Application dependencies still unfinished

Codex still owns durable product revisions/evidence/approvals, worker dispatch/budgets/idempotency, authenticated artifact ingestion, R2 promotion, daily generation integration, approved RSS schedule/SSR landing pages and verified analytics. Do not mark these complete because infrastructure is deployed. Coordinate via files rather than editing the same application modules concurrently.

Pinterest is the primary marketing channel. Target is four approved items daily, not four new products daily. Official RSS ingestion can take up to 24h, so exact Pinterest posting times need supported API/scheduler integration. Drafts do not enter public RSS. Antigravity's daily draft runbook and four-pin assets are requested in its release-sprint file. No Pinterest account changes or publishing unreviewed material.

## Completion report

Report actual URLs, deployed commit/image, migration/rollback results, security evidence, backup artifact/restore evidence, monitoring coverage, remaining blockers and next owner actions. Never include credentials. Update this file if runtime architecture materially changes so the next agent can continue.

## Existing-domain deployment option
Owner already has ibrahimzahir.com and asked to use a subdomain without buying another domain. Proposed app hostname: studio.ibrahimzahir.com. Configure only after checking existing DNS/routes and your deployment context; preserve the apex website/mail. No DNS change has been made by Codex. BETTER_AUTH_URL and trusted origins must match the final HTTPS origin. A subdomain needs no new registration; hosting/storage usage remains separately billable.
