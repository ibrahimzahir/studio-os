# Antigravity execution flow

24 November update: completed preparation should now continue with [ANTIGRAVITY-RELEASE-SPRINT.md](ANTIGRAVITY-RELEASE-SPRINT.md). It authorizes internal experimental assets and marketing drafts while preserving evidence and public-release gates. Do not repeat completed steps 1–5.

Updated: 2026-11-24. Project: `/Users/ibrahimzahir/development/studio-os`.

## Start command

> Read this file and the project instructions. Execute steps 1–5 in order without asking me to prompt each step. Validate each output, update your progress ledger, and continue automatically to the next unblocked step. Stop only at the production approval gate, a genuine blocking dependency, or a decision that changes the agreed scope. Report one consolidated review package. After explicit production approval, resume at step 6 and continue through step 9. Never publish without separate release authorization.

This file supersedes the task ordering in ANTIGRAVITY-PROMPT.md; that file's context, security and ownership rules remain applicable. It authorizes preparation now, not production or release approval.

## Context and responsibilities

Studio OS discovers and evaluates opportunities, orchestrates production, checks artifacts and measures results. Antigravity creates commercial content, PDFs, spreadsheets and product assets. Codex owns engineering, research adapters, opportunity scoring, trends/virality, automation, dashboard, integration and CI/CD. Claude can take over using shared documentation.

The project was reconstructed from the earlier conversation. The original ZIP, original HTML prototype and psychology-cheat-sheet.pdf have not been recovered. Do not claim to have inspected them. The shared psychology standard is available at `../standards/UI_UX_PSYCHOLOGY.md`.

The current app uses Next.js/TypeScript. Zod evidence scoring, internal production contracts, pipeline transitions and 12 domain tests exist. Fastify, Better Auth, Prisma/Postgres, Redis/BullMQ, R2 integration, live research and automated Antigravity execution are not implemented. A Markdown instruction is agent-guided execution, not an installed background automation service.

Preserve the agreed stack: Next.js, TypeScript, shadcn/ui, Framer Motion, Fastify, Zod, PostgreSQL/Prisma, Better Auth, Redis/BullMQ, Cloudflare R2, existing Cloudflare/Hostinger VPS accounts, Docker Compose/Caddy, pnpm, Vitest/Playwright and GitHub Actions. No Supabase. Repository: https://github.com/ibrahimzahir/studio-os.git.

Read parent `../AGENTS.md`, `../standards/ENGINEERING_PLAYBOOK.md`, `../standards/UI_UX_PSYCHOLOGY.md`, project AGENTS.md, README.md, CLAUDE.md and docs/*.md first. Treat recovered conversation claims as historical context, not current verified evidence.

## Operating rules

- Work in `antigravity/mobile-detailing/`; maintain `docs/ANTIGRAVITY-HANDOFF.md`. Do not edit app/, src/, tests/, manifests, lockfiles, infrastructure or workflows while Codex develops them.
- Reuse existing outputs. Never overwrite another agent's changes without reading them. Do not commit or push unrelated files.
- Continue through authorized steps autonomously. Make reversible editorial decisions yourself and record assumptions; do not interrupt for routine wording, layout or file naming.
- Preserve exact evidence URLs, retrieval dates, supporting passages and limitations. No invented interviews, keyword volume, sales, revenue, trends, reviews or approvals.
- Codex owns broad niche discovery. Public research needed for product preparation may proceed only through permitted access. Record missing research as a dependency; never substitute an AI guess for evidence.
- Do not message customers or third parties, spend money, use paid services, deploy, change live infrastructure, publish or handle secrets without explicit authorization.
- No religious-holiday marketing; ask before Islamic-themed content.
- An unavailable tool is a blocker for that check, not proof it passed. Continue independent preparation and list the precise missing capability.

## Progress and resumption

Before starting, create `antigravity/mobile-detailing/PROGRESS.md` with:

| Step | Status | Outputs | Checks actually run | Blocker / next action |
|---|---|---|---|---|
| 1 | pending | | | |
| 2 | pending | | | |
| 3 | pending | | | |
| 4 | pending | | | |
| 5 | pending | | | |
| Production gate | awaiting owner decision | | | |
| 6–9 | not authorized | | | |
| Release gate | not authorized | | | |

Use pending, in_progress, complete, blocked or awaiting_approval. Update after each step. Mark complete only when its listed checks pass. Record start/end time, agent-active minutes and actual owner minutes separately. On resumption, inspect existing work and continue the first incomplete authorized step; do not regenerate everything.

## Today's five tasks — execute consecutively

### Step 1 — Define the product and buyer

Input: recovered Mobile Detailing Planner hypothesis. Target: independent mobile detailers; US market hypothesis; $24.99 test price, unvalidated.

Write `PRODUCT-BRIEF.md`: buyer, concrete job to be done, proposed customer problems, intended outcome, scope/non-goals, usage scenario, assumptions and outstanding evidence. Focus on job costing, service menus, vehicle inspection and a quick-start guide. Do not add CRM/SaaS features or promise profit increases.

Done when each proposed need is labeled hypothesis or supported by a linked evidence record; the buyer and single core outcome are clear. Continue to step 2.

### Step 2 — Prepare validation and evidence requirements

Write `VALIDATION-QUESTIONS.md` and `EVIDENCE-REGISTER.md`.

Cover interviews, current alternatives, workflow pain, labor/materials/travel/overhead, willingness to pay, competitor shortcomings and acquisition channels. Evidence register fields: ID, claim, source URL, source/platform, observation date, retrieval date, supporting passage, direct observation versus inference, confidence, limitations and verification status. Leave missing observations explicitly missing.

Map evidence needs to the agreed six scoring inputs: search growth 25%, marketplace demand 20%, social velocity 20%, purchase intent 15%, cross-platform momentum 10%, competitive opportunity 10%. Do not invent normalized values or award a score manually. Current engine policy requires fresh observations for every metric, two declared platforms, confidence >=0.7 and score >=80; source adapters and confidence calibration remain engineering work.

Done when the validation plan is executable and unsupported claims cannot be confused with findings. Interviews are a later owner-authorized activity, not a prerequisite to finishing these documents. Continue to step 3.

### Step 3 — Specify deliverables and deterministic mathematics

Write `DELIVERABLE-SPEC.md` and `FORMULA-TEST-CASES.md`.

Proposed outputs: `job-costing-calculator.xlsx`, `service-menu.pdf`, `vehicle-inspection.pdf`, `quick-start-guide.pdf`. Specify editable fields, units, input/output boundaries, print formats, intended workflow and acceptance criteria. List exact A4/US Letter filenames in the eventual manifest if both variants are produced.

Define labor cost = hours × hourly cost; total cost = entered labor + materials + travel + allocated overhead; target selling price = total cost / (1 - target margin); profit = selling price - total cost; actual margin = profit / selling price when selling price > 0. Distinguish margin from markup. State all omissions and rounding policy. Reject negative/nonfinite inputs and target margins outside 0%–<100%. Define zero-price behavior without division errors. No tax advice or assumed local tax rates.

Include at least: $100 cost at 40% target margin = $166.666… unrounded price; rounding to $166.67 produces $66.67 profit. Test zero cost, zero selling price, fractional quantities, large valid values, invalid negatives and 100% margin. Explain how displayed versus calculated values are rounded.

Done when every field/formula has units and independently calculated expected cases. Continue to step 4.

### Step 4 — Define design, psychology and quality checks

Write `DESIGN-BRIEF.md` and `QA-CHECKLIST.md`.

Use restrained forest green, legible editorial typography, a reusable token system, accessible contrast, grayscale printing and A4/US Letter layouts. For each surface name its desired user behavior and choose 2–4 relevant psychology principles. Suggested applications: recognition over recall for field labels, proximity for related costs, progressive disclosure for optional inputs, feedforward for the effect of changing margin, feedback for invalid entries. Never use fabricated proof, hidden costs or fake urgency.

QA must cover rendered page-by-page inspection, clipping, print margins, readable fields, consistent units, independent spreadsheet recalculation, all formula fixtures, safe filenames, no macros/external workbook links, original/licensed assets and source attribution. State which checks require installed rendering/recalculation tools; do not mark future checks passed.

Done when each acceptance criterion has a concrete verification method. Continue to step 5.

### Step 5 — Assemble one owner-review package

Write `REVIEW-PACKAGE.md`, update PROGRESS.md and `docs/ANTIGRAVITY-HANDOFF.md`.

Include links to all outputs; scope and test price; source-backed findings versus assumptions; missing evidence; risks; recommended next action; intended production tools; estimated production time/cost labeled as estimates; and exact proposed deliverables. Summarize decisions required in one place. Record actual checks and unresolved dependencies. Do not classify the opportunity as validated or trending without evidence.

Done when another agent can continue without conversation history. Preparation is now complete. Stop at the following gate and request one consolidated production decision, not approval for each routine file.

## Production approval gate

Owner review is required because existing project instructions require approval before commercial production. This is not satisfied by a high opportunity score, elapsed time or an agent writing “approved”. Record the owner's explicit decision, date, approved scope/revision and budget in REVIEW-PACKAGE.md with its conversation reference. Do not fabricate a signed approval or imply the prototype enforces a durable production approval.

If evidence is insufficient, recommend further research or rejection. The owner may explicitly authorize an experimental prototype; label it experimental and do not misreport it as validated production. If the owner narrows scope, update specs before continuing.

## After production approval — remaining flow

### Step 6 — Generate the approved product assets

Create only the approved deliverables under `output/<revision>/`. Use the approved specs, design tokens and deterministic formulas. Prefer installed generation tooling; do not modify project dependencies or install executable tooling without following the shared engineering rules. Keep a reproducible product-local generation source when practical. No unsupported claims or copied competitor content.

Done when every approved deliverable exists and can be opened. Continue to step 7.

### Step 7 — Verify and revise automatically

Recalculate workbooks with an available spreadsheet engine; compare all formula fixtures against expected values. Writing formulas alone is not recalculation. Render PDFs and inspect every page in both print sizes. Check file safety, links, spelling, assumptions, licenses and accessibility. Record commands/tools, results and preview paths in `QA-REPORT.md`.

Correct defects and rerun affected checks. After three attempts at the same unresolved defect, document the failure and continue independent checks, then request help once. Never silently waive a failed or unavailable check. Continue to step 8 only when required QA passes; otherwise return a blocked package.

### Step 8 — Prepare integration and release-review package

Write `manifest.json` with schemaVersion, product slug, revision, actual filenames, media types, byte sizes, SHA-256 checksums and QA report path. Keep automaticPublishing=false and status=awaiting_release_review. Add jobId only if Studio OS supplied a real one; never invent a completed platform job. List unresolved checks explicitly.

Write `RELEASE-REVIEW.md` containing previews, file inventory, actual QA results, remaining limitations and proposed price. Codex will implement authenticated artifact ingestion and content-bound durable approvals; do not claim local JSON is already ingested by the app. Continue to step 9.

### Step 9 — Prepare launch drafts and hand off

Create `launch-drafts/` with factual listing copy, a product-use walkthrough, FAQ, image/pin concepts and customer-support notes. Base claims on the actual delivered product. No publishing, customer messaging, paid advertising or account changes. Update the progress ledger and ANTIGRAVITY-HANDOFF.md with completed files, checks and the next required owner decision.

Done when launch drafts and the release package are reviewable. Stop for separate release authorization. Actual publishing and distribution integrations are later work requiring verified platform eligibility and explicit authorization.

## Automation target and honest measurement

The earlier 75–90% estimate describes potential automation of repetitive work after a stable workflow exists. It is not a guarantee, a measured current capability or a promise of 90% business success. Do not make the owner manually relay each step: execute the authorized sequence, self-check, persist progress and provide a consolidated review at meaningful gates.

Agent-guided automation now: preparation documents, structured briefs, formula fixtures, design guidance, quality checklists and progress/handoff records. After approval and tool availability: asset generation, mechanical checks, revisions and launch drafts.

Still manual/owner-led: product choice, evidence interpretation where uncertain, customer access/interviews, commercial approval, budget decisions, payout/legal matters and final release. Do not automate away these decisions to inflate a percentage.

Engineering still needed for unattended execution: permitted research adapters, persisted revisions, Better Auth/scoped DAL, durable approvals, queues/idempotency/retries/budgets, authenticated artifact ingestion, validated Antigravity runner integration, QA tooling and deployment/monitoring. Codex owns this backlog.

Measure for each comparable product: owner active minutes, agent active minutes, elapsed waiting time, intervention count, failed/retried steps and QA defects. If a documented manual baseline exists, owner-time reduction = (baseline owner minutes - actual owner minutes) / baseline owner minutes × 100. Report the baseline and comparable scope; report “not measured” without one. Never equate unattended elapsed time with time saved. Improve the repeated bottlenecks before expanding to more niches.
