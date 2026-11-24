# Layered architecture and interface standard

## Top-down source structure

```text
app/                         Next.js routes, layouts, loading/error boundaries
src/
  features/                  Product-facing feature components
    auth/components/         Sign-in and verified TOTP enrollment
    dashboard/components/    Compact workspace overview
    opportunities/components/
  components/
    ui/                      Official shadcn Base UI source components
    shared/                  Headers, search, numbered pagination, theme and shell
  contracts/                 Shared Zod schemas; TypeScript types inferred with z.infer
  server/
    api/                     Fastify transport, errors, CSRF/origin enforcement
    auth/                    Better Auth sessions and default-deny permissions
    dal/                     Scoped queries, validated writes, safe output projections
    database/                Separate Prisma clients for app/auth database roles
    security/                CSP and response security policy
  domain/                    Deterministic evidence scoring and workflow rules
  generated/prisma/          Generated client, ignored by Git
prisma/                      PostgreSQL schema and reviewed migrations
scripts/                     Local dev/provisioning commands
antigravity/                 Product generation workspace; no application code
```

Routes compose features and shared UI. Browser code imports contracts and shared UI, never server/database modules. The Fastify API resolves sessions from Better Auth, reloads the user's current status/role, checks 2FA/maintenance and delegates to the DAL. The DAL repeats permission checks, validates inputs, scopes queries by the authenticated studio, uses explicit Prisma select projections and validates response DTOs. Domain rules never authenticate users by accepting a caller-supplied role. Existing speculative production contracts are not exposed as approval endpoints.

## Two-way data protection

Inbound: the same Zod contract gives frontend feedback and authoritative server validation. Strict write schemas reject role, studioId and other mass-assignment fields. Backend chooses studioId from the authenticated principal. PostgreSQL constraints protect category/status/title invariants.

Outbound: explicit Prisma selects omit private fields; response schemas reject unexpected shape. Application DB role cannot read Account, TwoFactor or credential fields; authentication role cannot query business tables. Auth and app URLs must use different restricted roles in production. Migration/provisioning credentials never run in the application process.

Studio isolation currently lives in the DAL; database row-level policies are not implemented. Database least privilege is tested, but is not claimed to provide tenant row isolation. This is an owner-operated studio with staff, not a public multi-tenant service.

## Authentication and permissions

- Public signup disabled both in Better Auth and at the Fastify route.
- Passwords use Argon2id. DB-backed sessions, no cookie cache, durable rate limits.
- TOTP activation requires a valid code; recovery codes are single-use. Business API and private pages require enrollment. An email verification flag is not proof of MFA.
- Developer has operational administration; staff may read/write opportunities; viewers read only. Unknown role/status defaults to denied.
- Block/suspend/enable revoke the target's existing sessions and append an audit event transactionally. Developer self-disable is refused.
- Maintenance denies non-developers on server pages and business requests; developer retains recovery access.
- Sensitive administrative actions require enabled 2FA and a session created within 10 minutes. No trust-device option is offered by the UI.
- Remaining pre-release hardening: dedicated step-up proof bound to sensitive actions, login/audit coverage, secure production bootstrap/recovery and deployed rate-limit/CSRF verification.

## Interface

Use the installed shadcn Base UI primitives, sidebar-03 structure and lucide-react icons. Reusable PageHeader, SearchBar, NumberedPagination, StudioShell and ThemeToggle compose these primitives. Light/dark/system preference persists through next-themes. Use shared semantic tokens, visible focus, descriptive icon labels and reduced-motion support.

Primary screens show concise actions and statuses; details disclose research/operational explanations. No fake revenue, availability or green health indicators. Paginated results have clickable page numbers; empty results provide a reset. Skeletons indicate actual loading; toasts acknowledge actions and failures; action dropdowns group secondary commands. Do not install the entire component catalog without a current use.
