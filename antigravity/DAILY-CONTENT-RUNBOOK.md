# Daily Content Production Runbook — Studio OS × Antigravity

- **Status:** Operational draft recipe (v1.0.0-draft) — **NOT an active unattended background service**
- **Updated:** 2026-11-24
- **Companion template:** `antigravity/draft-manifest.template.json`
- **Owner / Engineering boundary:** Codex owns the queue (BullMQ/Redis), budget enforcement, authenticated artifact ingestion, R2 private/public promotion, and runner integration. Antigravity owns commercial content drafting, asset generation, mechanical QA, and marketing draft preparation.

> **Hard stop rule:** Missing verified runner, missing budget cap, or missing owner-approved niche/job input means **blocked draft generation** — never permission to invent niches, fabricate market evidence, spend unapproved money, or publish automatically.

---

## 1. Pre-Flight Gate (All 4 Required Before Any Daily Run)

| Gate | Required Input | If Missing / Invalid |
|---|---|---|
| 1. Approved Job Input | Signed/persisted Studio OS job record (`jobId`, `productSlug`, `revision`, `approvedBriefRef`, `evidenceStatus`) | Stop immediately; set run state to `blocked_missing_approved_input`. Never invent a niche or fake a `jobId`. |
| 2. Active Budget Cap | Explicit per-run & daily USD/token budget cap (`maxRunCostUsd`, `maxDailyCostUsd`, `maxRetries`) supplied by Studio OS | Stop immediately; set run state to `blocked_missing_budget`. |
| 3. Configured Model Roster | List of currently available, authorized models from the server-only AI gateway (no hardcoded "cheapest" model) | Stop immediately; set run state to `blocked_missing_model_config`. |
| 4. Verified Runner & Storage Target | Verified Antigravity execution runner (or explicit human-triggered session) + private R2 draft prefix (`drafts/<slug>/<revision>/`) | Run only in explicit human-triggered local draft mode; never claim unattended automation is live. |

---

## 2. Model-Tier Routing Policy (Cost-Aware, Honest Measurement)

Select **only** from currently configured, available models at runtime. Never hardcode a vendor's "cheapest" model name, and **never claim 90% cost savings** without measured token/dollar telemetry across comparable runs.

| Task Tier | Work Type | Routing Rule | Escalation Trigger |
|---|---|---|---|
| **Tier 1 — Routine / Low-Cost** | Metadata drafting, keyword board tagging, alt-text generation, caption/title variants, structured JSON formatting, checklist linting | Route to the configured **lower-cost fast model** first. | Escalate to Tier 2 if schema validation fails twice, text exceeds length limits (`title > 100`, `description > 500`), or copy violates honesty/ethics rules. |
| **Tier 2 — Standard Reasoning** | Product briefs, structured educational guide copy, formula specification, HTML/SVG layout generation, QA defect diagnosis | Route to the configured **standard balanced model**. | Escalate to Tier 3 if formula/layout defects persist after 2 revision attempts or complex domain tradeoffs arise. |
| **Tier 3 — Complex / Quality Escalation** | Persistent QA failures (attempt 3), complex multi-page layout conflicts, cross-document consistency audits | Route to the configured **high-capability reasoning model**. | After **3 failed attempts** on the same defect, halt retries, record `status: "failed"`, preserve logs/artifacts, and request human intervention once. |

---

## 3. Mandatory 4-Phase Quality Workflow (Analyse → Plan → Review → Generate)

> **Owner quality rule (2026-11-24):** Never jump straight into generating PDFs. Every product must pass **Analyse → Plan → Review** before asset generation begins.

1. **Phase 1 — Analyse (Evidence & Competitor Gaps):** Run permitted public research and mine real buyer/competitor review complaints (preserving exact URLs, retrieval dates, and honest limitations; zero fabricated volumes or scores).
2. **Phase 2 — Plan (Brief, Spec & Design System):** Produce a concise product brief, deliverable spec (fields, units, US Letter + A4 print geometry, deterministic formulas if applicable), and UX psychology plan (2–4 principles per surface, grayscale-safe, secular calendar only).
3. **Phase 3 — Owner Plan Review Gate:** Present the compact analysis + plan for owner review and scope sign-off **before** generating commercial PDFs. Initialize `manifest.json` from `antigravity/draft-manifest.template.json` with `status: "draft"` and `automaticPublishing: false`.
4. **Phase 4 — Generate & Independent QA:**
   - Produce approved deliverables (`.xlsx`, US Letter + A4 `.pdf`) and 4 unique `1000×1500` PNG/JPG Pinterest draft images under `output/<revision>/` (and private R2 draft prefix when connected). Never write to public buckets directly.
   - Recalculate `.xlsx` with a real spreadsheet engine (LibreOffice/Excel) and assert all formula fixtures pass.
   - Render every PDF page (`pdftoppm`) and visually inspect color + grayscale for page counts, margins, legibility, and zero clipping.
   - Scan `.xlsx` and `.pdf` for macros, external links, embedded JS, and safe ASCII filenames; compute byte sizes and `SHA-256` checksums.
   - Verify all 4 Pinterest images are unique, `1000×1500`, `<= 500 KB`, accurate to the real product, and free of dark patterns/religious-holiday themes.
   - **Unavailable tool rule:** Never mark an unrun check passed; record `unavailable_missing_tool` and block release promotion.
5. **Human Release & Scheduling Gate (Mandatory):** Owner inspects rendered previews, `QA-REPORT.md`, and cost summary, then chooses **Approve**, **Request Revision**, or **Reject**. Only explicitly approved assets promote from private R2 drafts to public R2 and enter the RSS schedule.
6. **Retry, Failure & Audit Handling:**
   - Retry transient generation/QA defects up to `maxRetries` (default `3`) within the run's `maxRunCostUsd` cap.
   - If budget is exhausted or retries reach `maxRetries`, transition to `failed` with structured `errorState` (`code`, `message`, `attemptCount`, `lastFailedStep`) — never silently ship partial drafts.
   - Log every state transition, actor, and content hash in Studio OS's audit trail.

---

## 4. Telemetry & Honest Automation Metrics

Record per run in `manifest.json` (leave as `null` / `"not_measured"` if not actually captured):
- `agentActiveMinutes`, `ownerActiveMinutes`, `elapsedWallMinutes`
- `inputTokens`, `outputTokens`, `measuredCostUsd` (by model tier)
- `retryCount`, `qaDefectCount`, `humanInterventionCount`
- Never equate elapsed wall-clock time with owner time saved, and never report percentage savings without a documented manual baseline.
