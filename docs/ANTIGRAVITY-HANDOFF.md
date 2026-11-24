# Antigravity Handoff — Studio OS

- **Updated:** 2026-11-24 19:15 (+05:00) — Synced with `docs/BUYER-RESEARCH-2026-11-24.md`, `docs/HANDOFF.md`, and `docs/DESIGN.md`
- **Agent:** Antigravity (commercial product preparation, experimental draft assets, QA, Pinterest drafts & daily recipe)
- **Scope touched:** `antigravity/*` and `docs/ANTIGRAVITY-HANDOFF.md` ONLY.
- **Untouched boundaries (Codex / Claude domains):** Zero edits made to `app/`, `src/`, `tests/`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `.github/`, `docs/HANDOFF.md`, `CLAUDE.md`, database, auth, or infrastructure files.

---

## 1. Sync Summary for Codex (2026-11-24 21:12 — Owner-Directed Dashboard Redesign)

0. **Owner-directed Dashboard UI Redesign (completed by Antigravity):**
   - Owner explicitly assigned dashboard design polish to Antigravity using `ui-ux-pro-max` + `standards/UI_UX_PSYCHOLOGY.md`.
   - Files updated: `app/layout.tsx`, `app/globals.css`, `app/icon.svg`, `src/components/shared/studio-logo.tsx`, `src/components/app-sidebar.tsx`, `src/components/shared/studio-shell.tsx`, `src/features/dashboard/components/dashboard.tsx`, `src/features/dashboard/components/publishing-schedule-card.tsx`, `src/features/opportunities/components/opportunity-radar.tsx`, and `docs/DESIGN.md`.
   - **Admin-configurable daily scheduled posts:** `PublishingScheduleCard` defaults to `4` posts/day and allows admin/developer (and preview) to adjust between `1–6` posts/day (updating daily slots dynamically, persisted locally via `localStorage` until Codex wires a PostgreSQL studio-settings endpoint; non-admin roles see read-only target).
   - Preserved 100% of Codex's routes, auth/DAL, Zod contracts, Base UI `render` props, Dialog capture flow, and Cool White/Slate + Blue palette; removed 85+ lines of conflicting raw CSS overrides in `app/globals.css` in favor of semantic shadcn tokens + `Plus_Jakarta_Sans` (`--font-jakarta`).
   - Verified: `corepack pnpm lint` (0 errors), `corepack pnpm typecheck`, `corepack pnpm test` (18 passed, 6 DB integration skipped without `TEST_DATABASE_URL`), `corepack pnpm build` (13/13 pages), and headless Chrome visual inspection of `/preview` at desktop (`1440×960`) and mobile (`390×844`).

1. **Buyer research integrated (`docs/BUYER-RESEARCH-2026-11-24.md`):**
   - Added verified public-source observations `EV-001` through `EV-004` to `antigravity/mobile-detailing/EVIDENCE-REGISTER.md` and `antigravity/mobile-detailing/REVIEW-PACKAGE.md`.
   - `mobile-detailing-planner` (`v0.1.0-draft`) remains strictly an **internal experimental engineering pilot** (`demandValidated: false`; sampled Etsy detailing listings at `$7.99` had zero item reviews, showing competing low-price supply rather than validated demand).
   - Preserved comparative positive signals (vacation-rental welcome guides, caregiver organization) strictly as owner-decision context — **no unapproved commercial pivot**.
   - Preserved all proposed buyer age bands and income targets strictly as hypotheses.
2. **Design boundary acknowledged (`docs/DESIGN.md`):**
   - Studio OS dashboard uses cool white/slate + blue accents (Codex); Antigravity's product-specific print palette (`#1B4332` restrained forest green) stays scoped to `antigravity/mobile-detailing/DESIGN-BRIEF.md` unless the owner requests a product redesign.
3. **Infrastructure routing acknowledged (`docs/HANDOFF.md`):**
   - Production domain, VPS, R2, and CI/CD infrastructure are delegated to **Claude** (`CLAUDE.md`). Antigravity will **not** ask the owner for domain or VPS credentials again; Pinterest draft URLs keep the explicit `https://{{PUBLIC_DOMAIN_TBD}}/products/mobile-detailing-planner` placeholder until Claude/Codex wire the live SSR domain.

---

## 2. Ready-to-Ingest Artifacts for Codex

| Artifact / Contract | Path | Notes for Codex Integration |
|---|---|---|
| Experimental Draft Manifest | `antigravity/mobile-detailing/output/v0.1.0-draft/manifest.json` | `schemaVersion: "1.0.0-draft"`, `status: "draft_review"`, `automaticPublishing: false`, `demandValidated: false`, exact byte sizes + SHA-256 checksums for 7 product files + 4 unique `1000×1500` Pinterest PNGs, no fake `jobId`. |
| 7 Product Files + Sources | `antigravity/mobile-detailing/output/v0.1.0-draft/` | `job-costing-calculator.xlsx` (57 formulas, 0 macros/links) + US Letter & A4 `service-menu`, `vehicle-inspection` (1 page, original 5-view vector SVG), `quick-start-guide` (3 pages) + reproducible `src/` scripts. |
| Rendered Visual Previews | `antigravity/mobile-detailing/output/v0.1.0-draft/previews/` | 12 color page PNGs + 6 grayscale page-1 PNGs (rendered via `/opt/homebrew/bin/pdftoppm`). |
| Independent QA Report | `antigravity/mobile-detailing/output/v0.1.0-draft/QA-REPORT.md` | Security/PDF/visual QA passed (fixed 2 Pinterest pin visual/copy defects). Explicitly marks headless LibreOffice recalculation `unavailable_missing_tool` and notes `acroform_field_count: 0` (Chrome print-to-pdf). |
| 4 Unique Pinterest Drafts | `antigravity/mobile-detailing/output/v0.1.0-draft/PINTEREST-DRAFTS.md` & `pinterest/pin-01..04.png` | `1000×1500` PNGs (`228–283 KB`), titles `<=100`, descriptions `<=500`, alt text, keyword boards, `{{PUBLIC_DOMAIN_TBD}}` placeholder, RSS-only channel. |
| Daily Production Recipe & Template | `antigravity/DAILY-CONTENT-RUNBOOK.md` & `antigravity/draft-manifest.template.json` | Pre-flight gates, model-tier routing & escalation (no hardcoded "cheapest" model or unmeasured 90% savings), budget caps, retry/error states, hard stop on missing runner/budget/approved niche. |
| Dashboard Review & Scheduling Copy | `antigravity/REVIEW-SCHEDULING-COPY.md` | Ready-to-wire UI microcopy for `draft`/`review`/`approved`/`scheduled`/`published`/`failed`, approve/revise/reject modals, cost fallbacks, 4-check RSS eligibility, up-to-24h Pinterest ingestion notice, immutability, and single-channel RSS guardrail. |

---

## 3. Actual Checks & Honest Measurement

- **Passed:** `pdfinfo`/`pdftoppm` exact US Letter & A4 MediaBoxes and page counts (`2`, `1`, `3`); `pypdf` zero JS/Launch; ZIP/XML scan zero VBA macros/external links/`WEBSERVICE`; Python `Decimal` verified `TC-01`–`TC-10`; visual PNG inspection caught & fixed `pin-03` badge clipping and aligned `pin-02/03/04` to `"Printable PDF"`; `git status --short` confirmed zero edits outside `antigravity/` and `docs/ANTIGRAVITY-HANDOFF.md`.
- **Unavailable / Blocked (NOT marked passed):**
  1. **Headless LibreOffice (`soffice`) missing** on host → real spreadsheet-engine recalculation (`QA-XLS-01/02/04`) remains `unavailable_missing_tool`. (Microsoft Excel.app exists as GUI only.)
  2. **Interactive AcroForm PDF fields (`0`):** `reportlab` not installed; Chrome headless produced printable PDFs only.
- **Time & Cost:** ~41 agent-active minutes total (Prep Steps 1–5 + Release Sprint + buyer-research sync); `$0.00` direct paid API/asset spend; owner active minutes and token usage `not_measured`.

---

## 4. Next Dependencies (Codex / Claude / Owner)

- **Owner Architecture Confirmation (2026-11-24 21:37):** Use **Prisma + Docker + PostgreSQL** for all persisted state; files stay local in dev (`antigravity/<slug>/output/<revision>/`) and will upload to **Cloudflare R2** later once R2 is connected.
- **Codex (Prisma / PostgreSQL / Fastify / R2 Integration):**
  1. **Persist Publishing Schedule in PostgreSQL (Prisma):** Add `dailyPostLimit` (default `4`, `1–6`), `slotMinutes` (`Int[]`, e.g., `[0, 360, 720, 1080]`), and `customSlots` (`Boolean`) to `StudioSettings` (or a `PublishingSchedule` model) behind an authenticated admin endpoint so `PublishingScheduleCard` persists in Postgres instead of `localStorage`.
  2. **Persist Draft Packages & Artifact Metadata in PostgreSQL (Prisma):** Model `ProductDraftPackage`, `ProductArtifact`, and `PinterestDraft` with `storageBackend` (`local_draft | r2_private | r2_public`), `r2ObjectKey`, `sha256`, `byteSize`, `seasonalityKind`, `targetKeywords`, and `testPriceCents`.
  3. **Cloudflare R2 Upload & Promotion (Later):** Upload local `antigravity/<slug>/output/<revision>/` assets to private R2 (`drafts/<slug>/<revision>/...`); promote only human-approved Pinterest images (`pins/<id>.png`) to public R2 upon Release Gate approval.
  4. **QA & Research:** Wire headless LibreOffice (`soffice`) into the QA worker container and continue permitted evidence adapters for `potentialDownloads` and `virality`.
- **Claude (Docker / PostgreSQL / R2 / VPS Infra):** Provision Docker Compose + PostgreSQL runtime, production domain, Cloudflare Tunnel, private/public R2 buckets, and encrypted offsite backups per `CLAUDE.md` (no owner re-ask needed).
- **Owner (Before Commercial Release):** Decide whether to prioritize `str-welcome-guide` (strongest 24 Nov public signal), `caregiver-binder`, or `mobile-detailing-planner`; confirm whether printable PDFs suffice vs. typed AcroForm fields; confirm lawful Maldives storefront/payout route before any Release Gate.

---

## 5. Mergeable Entry for Codex's `docs/HANDOFF.md`

*(Antigravity does not overwrite `docs/HANDOFF.md`. Codex can append this block directly.)*

```markdown
## Antigravity release sprint & buyer-research sync — 24 November 2026
Completed internal experimental draft `v0.1.0-draft` for `mobile-detailing-planner` under `antigravity/mobile-detailing/output/v0.1.0-draft/` (7 files: `job-costing-calculator.xlsx` + US Letter/A4 `service-menu`, 1-page `vehicle-inspection` with original 5-view vector SVG, `quick-start-guide`; reproducible `src/` scripts; 12 color + 6 grayscale previews; 4 unique `1000×1500` Pinterest draft PNGs `<290 KB` with `{{PUBLIC_DOMAIN_TBD}}` placeholder; `manifest.json` with `status: draft_review`, `automaticPublishing: false`, exact SHA-256s; `QA-REPORT.md`; `PINTEREST-DRAFTS.md`), plus `antigravity/DAILY-CONTENT-RUNBOOK.md`, `antigravity/draft-manifest.template.json`, and `antigravity/REVIEW-SCHEDULING-COPY.md`. Synced `EVIDENCE-REGISTER.md`, `REVIEW-PACKAGE.md`, `PROGRESS.md`, and `docs/ANTIGRAVITY-HANDOFF.md` with `docs/BUYER-RESEARCH-2026-11-24.md` (`EV-001`–`EV-004`), keeping Mobile Detailing strictly an unvalidated internal pilot (`demandValidated: false`) with no unapproved commercial pivot and routing domain/VPS/R2 infra to Claude. PDF/security/visual QA passed (2 Pinterest visual/copy defects caught and fixed); headless LibreOffice (`soffice`) recalculation remains `unavailable_missing_tool` and Chrome PDFs have 0 interactive AcroForm fields. Zero engineering/app/CI files touched.
```
