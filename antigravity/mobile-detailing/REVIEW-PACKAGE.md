# Consolidated Owner Review Package — Mobile Detailing Planner

- **Product slug:** `mobile-detailing-planner`
- **Stage:** Product Preparation Complete (Steps 1–5) — **Stopped at Production Approval Gate**
- **Date:** 2026-11-24
- **Opportunity classification:** **UNVALIDATED HYPOTHESIS** (NOT validated, NOT trending, NOT approved for commercial production)
- **Test price hypothesis:** `$24.99` USD one-time digital download (**unvalidated**)
- **Initial market hypothesis:** United States (`US`, English, USD; US Letter primary + A4 variant proposed)

---

## 1. Preparation Document Links

All preparation documents live under `antigravity/mobile-detailing/` plus the shared Antigravity handoff:

1. [PROGRESS.md](PROGRESS.md) — Resumable step ledger, actual checks, and time tracking
2. [PRODUCT-BRIEF.md](PRODUCT-BRIEF.md) — Target buyer, core JTBD/outcome, hypothesis-labeled needs, scope, non-goals, and assumptions
3. [VALIDATION-QUESTIONS.md](VALIDATION-QUESTIONS.md) — Owner-authorized buyer interview guide (20 questions), anti-bias guardrails, and desk-research checklist
4. [EVIDENCE-REGISTER.md](EVIDENCE-REGISTER.md) — 11-field evidence register mapped to Studio OS's 6 scoring weights (`0/6` populated with verified current evidence)
5. [DELIVERABLE-SPEC.md](DELIVERABLE-SPEC.md) — Detailed specs, editable fields, units, print sizes, exact manifest filenames, and acceptance criteria
6. [FORMULA-TEST-CASES.md](FORMULA-TEST-CASES.md) — Deterministic job-costing math, margin vs. markup, rounding policy, boundary rules, and 11 fixtures
7. [DESIGN-BRIEF.md](DESIGN-BRIEF.md) — Restrained forest-green design tokens, grayscale print rules, and 2–4 UX psychology principles per surface
8. [QA-CHECKLIST.md](QA-CHECKLIST.md) — Visual, print, formula-recalculation, security, and licensing QA plan + actual local tool audit
9. [docs/ANTIGRAVITY-HANDOFF.md](../../docs/ANTIGRAVITY-HANDOFF.md) — Cross-agent handoff, dependencies on Codex/owner, and mergeable snippet for `docs/HANDOFF.md`

---

## 2. Exact Proposed Deliverables (Pending Scope Decision)

| Deliverable | Planned Filename(s) under `output/<revision>/` | Format | Notes |
|---|---|---|---|
| Job Costing Calculator | `job-costing-calculator.xlsx` | `.xlsx` (zero macros, zero external links) | 3 sheets: `01_Job_Calculator`, `02_Materials_Overhead`, `03_Package_Matrix` |
| Service Menu | `service-menu-us-letter.pdf`, `service-menu-a4.pdf` | Fillable + printable PDF | 3–4 tiers, blank/`$___` honest price defaults |
| Vehicle Inspection Form | `vehicle-inspection-us-letter.pdf`, `vehicle-inspection-a4.pdf` | Fillable + printable 1-page PDF | Original vector 5-view car outline, clipboard-sized fields, non-legal disclaimer |
| Quick-Start Guide | `quick-start-guide-us-letter.pdf`, `quick-start-guide-a4.pdf` | Printable 2–4 page PDF | 15-min setup, `$100 @ 40%` margin vs. markup example, print & scope disclaimers |

---

## 3. Source-Backed Findings vs. Assumptions & Missing Evidence

### Source-Backed Findings (Updated 2026-11-24 via `docs/BUYER-RESEARCH-2026-11-24.md`)
- **Mobile detailing demand is NOT validated in the public-source sample (`EV-003`):** Two retrieved Etsy detailing listings (including a `$7.99` mobile auto detailing forms workflow) had **zero item reviews** on the retrieved pages. This proves competing low-price supply (`$7.99`), not strong demand, and underscores pricing risk at `$24.99`.
- **Broad US & AI context (`EV-001`, `EV-002`):** Etsy's 2025 10-K reports 74% US GMS (supports US as an initial geographic test market, not PDF-specific demand). US Chamber 2026 reports 66% SMB AI use — confirming generic AI PDFs have weak differentiation; value must come from tested deterministic formulas, crisp design, and ready-to-use structure.
- **Comparative signals (`EV-004`, informational only):** In the same sample, vacation-rental welcome guides (`216` item reviews) and caregiver binders (`109` item reviews) showed stronger item-level purchase signals. **No commercial priority pivot is taken without explicit owner direction.**
- **Historical screening (`EV-HIST-01`):** Earlier `$10–$26` range and `8.9/10` score in `docs/RECOVERED-CONTEXT.md` remain `historical_unverified` and **cannot** qualify production. Proposed buyer ages and earnings targets remain unvalidated hypotheses.

### Key Unvalidated Assumptions
- Solo US mobile detailers will pay `$24.99` one-time for an offline `.xlsx` + `.pdf` toolkit (`A-01`).
- Buyers want Excel/Sheets + fillable PDFs rather than Canva-only templates or a mobile app (`A-02`, `A-03`).
- Four focused files deliver sufficient perceived value at `$24.99` without bloating into a 40-page binder (`A-03`).
- Lawful storefront and USD payout eligibility from the Maldives can be established prior to launch (`A-05`).

### Missing Evidence (Required for Standard Studio OS Qualification)
- **0 / 6** Studio OS scoring metrics have fresh (`<= 30 days`) verified observations (`search growth 25%`, `marketplace demand 20%`, `social velocity 20%`, `purchase intent 15%`, `cross-platform momentum 10%`, `competitive opportunity 10%`).
- **0 / 2** declared platforms verified (Codex evidence adapters not yet implemented).
- **0** buyer interviews conducted (requires explicit owner authorization before outreach).

---

## 4. Risks & Unresolved Dependencies

1. **Zero demand validation risk:** Producing commercial assets before buyer interviews or fresh multi-platform evidence risks building a product with wrong pricing, wrong file formats (e.g., Canva vs. PDF/Excel), or weak demand.
2. **Missing local QA tools (actual check 2026-11-24):** `libreoffice`/`soffice`, `pdftoppm`, and `gs` are **not installed** on PATH. Step 7 requires real spreadsheet recalculation and page-by-page PDF rendering; those checks will block Step 8 until the tools are installed.
3. **Storefront & payout eligibility:** Merchant/payout eligibility from the Maldives (e.g., own storefront + BML USD gateway or verified merchant-of-record) is unconfirmed and blocks eventual commercial launch.
4. **Platform integration gap (Codex domain):** Studio OS currently has no authenticated API, database persistence, content-bound approval storage, or artifact ingestion endpoint; handoffs remain file-based.

---

## 5. Intended Production Tools & Estimated Effort / Cost (Estimates Only)

> **Disclaimer:** Time and cost figures below are **planning estimates**, not measured baselines or guarantees.

- **Intended generation tools (Step 6, post-approval):**
  - `.xlsx` generation: Python (`openpyxl`) using standard Excel functions only (no macros/external links).
  - PDF generation: Deterministic HTML/CSS-to-PDF or Python ReportLab/WeasyPrint + AcroForm field generation + original hand-crafted SVG for the 5-view vehicle diagram + SIL OFL fonts (`Source Serif 4` / `Inter`).
  - QA verification (Step 7): Headless LibreOffice Calc (to be installed) for real `.xlsx` recalculation + Poppler `pdftoppm` (to be installed) for 150–300 DPI page-by-page PNG inspection + Python `hashlib` / XML / PDF safety scanners.
- **Estimated production effort (Steps 6–9, once tools are installed):**
  - Agent active time: `~2–4 hours` (estimate) across generation, QA, revision cycles, manifest, and launch drafts.
  - Owner review time: `~30–60 minutes` (estimate) across Production Gate + Release Gate review.
- **Estimated direct monetary cost:** `$0` USD (estimate — uses local open-source generation/QA tools, SIL OFL fonts, and original vector art; no paid APIs, stock licenses, or ad spend).

---

## 6. Recommended Next Action

**Recommendation: HOLD commercial production approval until evidence is gathered (Option A), OR explicitly authorize a labeled Experimental Prototype (Option B).**

- **Option A — Validate first (Recommended for commercial rigor):**
  1. Authorize 5–10 buyer interviews using `VALIDATION-QUESTIONS.md` and/or wait for Codex's permitted research adapters to populate `EVIDENCE-REGISTER.md` across all 6 metrics and >=2 platforms.
  2. Re-evaluate price (`$24.99`) and format scope (`.xlsx` + `.pdf`, US Letter vs. A4) against real evidence before approving commercial production.
- **Option B — Authorize a labeled Experimental Prototype:**
  1. If the owner wants to exercise the end-to-end Antigravity asset-generation and QA pipeline now, explicitly approve Step 6–9 as an **`experimental_prototype`** (clearly labeled as unvalidated; never reported as market-validated production).
  2. Install `libreoffice` and `pdftoppm` before Step 7 so recalculation and visual PDF checks can actually run.
- **Option C — Reject or pivot niche:**
  - Defer Mobile Detailing Planner and direct preparation toward another hypothesis (e.g., residential cleaning, home bakery, or guesthouse operations).

---

## 7. Consolidated Decisions Required at Production Approval Gate

Please respond with one consolidated decision covering these 4 items (no separate per-file approvals needed):

1. **Gate decision:** `Hold for validation (Option A)` / `Authorize experimental prototype (Option B)` / `Approve commercial production (override)` / `Reject or pivot (Option C)`
2. **Print-size scope (if proceeding to Step 6):** `US Letter + A4` (recommended for international reuse) OR `US Letter only` (faster v1)
3. **Price & format check:** Keep `$24.99` test price hypothesis and `.xlsx` + fillable `.pdf` scope, or adjust?
4. **Local QA tool installation:** Authorize installing `libreoffice` and `poppler` (`pdftoppm`) when ready for Step 6–7?

---

## 8. Owner Production Approval Record (Do Not Pre-Fill Commercial Release)

| Field | Value |
|---|---|
| Internal Experimental Draft Sprint Directive | Authorized for **reversible internal drafts/prototypes only** via `docs/ANTIGRAVITY-RELEASE-SPRINT.md` (2026-11-24). **Does NOT validate demand, approve commercial production, or authorize public release.** |
| Experimental Draft Revision Built | `v0.1.0-draft` under `antigravity/mobile-detailing/output/v0.1.0-draft/` (7 product files, 12 color + 6 grayscale PDF previews, 4 unique `1000×1500` Pinterest draft PNGs, `manifest.json`, `QA-REPORT.md`, `PINTEREST-DRAFTS.md`) |
| Commercial Production / Public Release Decision | *Awaiting explicit owner decision* |
| Classification (`commercial_production` / `experimental_prototype` / `hold` / `rejected`) | `experimental_internal_draft` (current); commercial release *Pending* |
| Public Release Approval Date | *Pending* |
| Approved Public Domain & Storefront/Payout Path | *Pending* |
| Approved Budget | `$0.00` spent (local tools only); paid spend *Not Authorized* |
| Conversation / Authorization Reference | `docs/ANTIGRAVITY-RELEASE-SPRINT.md` (2026-11-24) for internal draft sprint; public release *Pending* |
