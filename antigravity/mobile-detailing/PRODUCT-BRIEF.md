# Product Brief — Mobile Detailing Planner

- **Status:** Unvalidated hypothesis — Product Preparation (NOT approved for commercial production)
- **Product slug:** `mobile-detailing-planner`
- **Date:** 2026-11-24
- **Owner:** Studio OS (commercial preparation by Antigravity)
- **Initial market hypothesis:** United States (`US`, English, USD, US Letter primary + A4 print support)
- **Test price hypothesis:** `$24.99` USD one-time digital download (**unvalidated**; not an established market-clearing price)
- **Evidence basis:** Historical screening notes in `docs/RECOVERED-CONTEXT.md` (unverified historical context) and project policy docs (`docs/MARKET.md`, `docs/BUSINESS.md`, `docs/ORCHESTRATION.md`). **Zero primary customer interviews, zero verified current sales figures, and zero fresh multi-platform evidence records exist yet.**

---

## 1. Target Buyer

- **Primary buyer (hypothesis):** Independent solo mobile car detailers and 1–2 person mobile detailing operators in the United States who travel to customers' homes or workplaces in a van, truck, or personal vehicle.
- **Buyer stage (hypothesis):** Early-stage or self-taught operators (0–3 years in operation) who already perform detailing jobs but still quote from memory, scribble inspection notes on paper or text messages, and lack a consistent way to check whether a package price covers their real labor, chemicals, fuel, and overhead.
- **Not targeting (explicit exclusions):**
  - Multi-bay fixed-location detailing shops with dedicated shop-management software or POS systems.
  - Enterprise fleet-washing contractors with custom SLA billing.
  - Hobbyist car owners detailing only their own vehicles.

---

## 2. Core Job To Be Done (JTBD) & Single Core Outcome

- **Job to be done (hypothesis):** *"When I am quoting and delivering a mobile detailing job, I want a simple, repeatable system to price the job accurately, present clear service tiers to the customer, and document vehicle condition before I touch the paint, so I know my real job margin and avoid scope disputes without paying for monthly software."*
- **Single core outcome:** Enable an independent mobile detailer to **quote a job from actual costs, present a clear service menu, and complete a documented pre-service vehicle inspection in one lightweight offline-ready toolkit** — without requiring subscriptions, logins, or complex setup.
- **No outcome guarantees:** This toolkit is an organizational and deterministic calculation aid. It does **not** guarantee higher revenue, profit increases, more bookings, or legal/insurance protection.

---

## 3. Proposed Customer Problems (Hypotheses vs. Verified Evidence)

Every need below is explicitly labeled. None are customer-validated yet; all require validation in `VALIDATION-QUESTIONS.md` and `EVIDENCE-REGISTER.md`.

| ID | Proposed Buyer Need / Problem | Evidence Status | Supporting Evidence Link | How the Toolkit Addresses It (Proposed) |
|---|---|---|---|---|
| N-01 | **Job costing uncertainty:** Operators price by copying nearby competitors or guessing flat rates, without accounting for actual labor hours, diluted chemicals/consumables, round-trip travel/fuel, and allocated fixed overhead (insurance, equipment depreciation, water/generator). | `hypothesis` (unvalidated) | None yet — tracked as `EV-GAP-01` in `EVIDENCE-REGISTER.md` | `job-costing-calculator.xlsx` with deterministic cost buildup and target-margin pricing. |
| N-02 | **Inconsistent service presentation:** Operators quote over text/DM with ad-hoc descriptions, leading to mismatched customer expectations about what is included vs. add-on (pet hair, heavy stain extraction, engine bay, oversized SUVs/trucks). | `hypothesis` (unvalidated) | None yet — tracked as `EV-GAP-02` in `EVIDENCE-REGISTER.md` | `service-menu.pdf` (editable/printable) with clear tiered packages, vehicle-size tiers, and explicit exclusions/add-ons. |
| N-03 | **Pre-existing damage & condition disputes:** Without a structured pre-service walkaround record signed/acknowledged by the customer, mobile detailers risk disputes over pre-existing scratches, rock chips, curb rash, interior stains, or personal items left in the vehicle. | `hypothesis` (unvalidated) | None yet — tracked as `EV-GAP-03` in `EVIDENCE-REGISTER.md` | `vehicle-inspection.pdf` printable/fillable walkaround form with exterior/interior condition map, pre-existing defect log, and customer acknowledgment block (non-legal operational record). |
| N-04 | **Operational setup friction:** Solo operators do not have time to learn multi-tab corporate spreadsheets or set up SaaS CRMs; they need a short, practical guide showing how the pricing sheet, menu, and inspection form fit together on a real job. | `hypothesis` (unvalidated) | None yet — tracked as `EV-GAP-04` in `EVIDENCE-REGISTER.md` | `quick-start-guide.pdf` (2–4 pages) with a concrete 15-minute setup sequence and job-day workflow. |

---

## 4. Proposed Product Scope & Non-Goals

### In Scope (Proposed — Pending Owner Production Approval)
1. **`job-costing-calculator.xlsx`** — Deterministic Excel workbook (compatible with Excel, LibreOffice Calc, and Google Sheets import) for per-job cost buildup (labor, materials/chemicals, travel, allocated overhead), target-margin pricing, actual margin/profit check, and package comparison.
2. **`service-menu.pdf`** — Clean, restrained service menu template (US Letter + A4 print variants) covering 3–4 logical service tiers, vehicle-size adjustments, and optional add-ons, with editable/blank fields for the detailer's own prices and business details.
3. **`vehicle-inspection.pdf`** — Printable (grayscale-safe) and fillable pre-service vehicle condition & walkaround checklist (US Letter + A4 print variants) with exterior/interior inspection zones, pre-existing damage notes, and customer sign-off lines.
4. **`quick-start-guide.pdf`** — Concise setup and daily-use guide explaining how to enter baseline costs, transfer calculated prices onto the service menu, and use the inspection form on-site.

### Explicit Non-Goals (Out of Scope)
- **No CRM, booking calendar, or SaaS features:** No online scheduling, automated SMS reminders, payment processing, or customer database software.
- **No accounting, payroll, or tax software:** No sales-tax calculation, quarterly tax estimates, or bookkeeping ledger; no tax advice or assumed local tax rates.
- **No legal contracts or liability waivers:** The inspection form is an operational condition-recording checklist, not legal counsel or an enforceable jurisdiction-specific waiver; buyers must consult a local attorney for legal terms.
- **No macros, VBA, external links, or live API calls** inside the spreadsheet.
- **No religious-holiday themes or seasonal gimmicks** (per studio policy).
- **No profit or income promises** anywhere in product copy or listing drafts.

---

## 5. Concrete Usage Scenario (Hypothesized Workflow)

1. **Initial setup (once, ~15–20 minutes):** The detailer reads `quick-start-guide.pdf`, opens `job-costing-calculator.xlsx`, enters their own hourly labor rate (or desired owner pay rate), typical chemical/consumable costs per job, per-mile travel rate, and monthly fixed overhead divided by expected monthly jobs.
2. **Menu pricing (once, updated quarterly):** Using the calculator's deterministic target-margin price outputs, the detailer sets their own prices for core packages (e.g., Maintenance Wash, Full Interior, Full Exterior + Interior) and fills them into `service-menu.pdf` to print or send as a PDF to prospects.
3. **Pre-job walkaround (every job, ~3–5 minutes on-site):** On arrival at the customer's driveway, the detailer walks around the vehicle with `vehicle-inspection.pdf` on a clipboard (printed in grayscale or color), marks pre-existing scratches/dents/stains, confirms the agreed package and add-ons, and gets the customer's initials before starting work.
4. **Post-job check (optional, ~2 minutes):** After an unusually dirty vehicle or long drive, the detailer logs actual hours and materials in the calculator to see actual profit and margin, adjusting future add-on pricing based on their own numbers.

---

## 6. Key Assumptions

| ID | Assumption | Risk if Wrong | How to Test |
|---|---|---|---|
| A-01 | Independent US mobile detailers will pay `$24.99` one-time for an offline PDF + Excel toolkit instead of using free templates or low-cost detailing apps. | Low conversion or price resistance below `$15`. | Buyer interviews + willingness-to-pay questions + competitor price audit (`VALIDATION-QUESTIONS.md`). |
| A-02 | Buyers have access to Excel, Google Sheets, or LibreOffice Calc and can print PDFs (often in black-and-white/grayscale on a home printer). | Workbook compatibility or unreadable printouts cause refunds. | Verify tool habits in interviews; enforce grayscale-safe design and LibreOffice/Excel compatibility in QA. |
| A-03 | Four focused deliverables (`calculator + menu + inspection + quick-start`) are sufficient value without bloating into a 40-page generic "business binder." | Buyers expect additional forms (e.g., invoice template, client intake) or view 4 files as too small for `$24.99`. | Test bundle expectations in buyer interviews and negative-review mining of competing toolkits. |
| A-04 | US Letter (`8.5 × 11 in`) is primary for US buyers, while A4 (`210 × 297 mm`) keeps the product reusable for UK/AU/international English-speaking buyers. | Extra QA effort for two paper sizes if international demand is negligible. | Owner confirms whether both US Letter and A4 variants stay in initial scope at Production Gate. |
| A-05 | Lawful storefront/payment eligibility from the Maldives (e.g., own storefront + BML USD gateway or verified merchant-of-record) can be resolved before launch. | Product can be prepared/built but cannot be legally sold or paid out. | Owner business/legal check (outside Antigravity scope; tracked in `REVIEW-PACKAGE.md`). |

---

## 7. Outstanding Evidence Required Before Production Approval

Per `docs/MARKET.md` and `docs/ANTIGRAVITY-EXECUTION-FLOW.md`, this brief does **not** qualify the Mobile Detailing Planner for commercial production. Before owner production approval (or an explicit experimental prototype authorization), Studio OS still needs:

1. **Fresh, verified market evidence** (within a 30-day freshness window) across all six Studio OS scoring metrics (search growth, marketplace demand, social velocity, purchase intent, cross-platform momentum, competitive opportunity) from at least two declared platforms.
2. **Primary buyer validation** (owner-authorized interviews or verified public community pain points with preserved URLs/dates) confirming that job costing, service menus, and pre-service inspections are top unmet needs.
3. **Competitor audit** of real mobile detailing templates/spreadsheets/checklists (exact URLs, retrieved dates, listed prices, observed gaps in negative reviews) rather than the unverified historical range (`$10–$26`) in `docs/RECOVERED-CONTEXT.md`.
4. **Explicit owner decision** at the Production Approval Gate confirming scope, price hypothesis, print variants, and budget (or authorizing a labeled experimental prototype).
