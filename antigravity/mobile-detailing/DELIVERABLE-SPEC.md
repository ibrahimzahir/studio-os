# Deliverable Specification — Mobile Detailing Planner

- **Status:** Preparation draft — **Final scope requires owner review at the Production Approval Gate.**
- **Product slug:** `mobile-detailing-planner`
- **Target revision (when approved):** `v1.0.0-draft` (written to `antigravity/mobile-detailing/output/<revision>/` only after explicit owner production approval)
- **Date:** 2026-11-24

---

## 1. Deliverable Inventory & Planned Manifest Filenames

If the owner approves both US Letter (`8.5 × 11 in`) and A4 (`210 × 297 mm`) print variants, the eventual `manifest.json` will list these exact ASCII kebab-case filenames:

| Logical Deliverable | Planned Manifest Filename(s) | Format / MIME Type | Print Size | Purpose |
|---|---|---|---|---|
| Job Costing Calculator | `job-costing-calculator.xlsx` | Office Open XML Workbook (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`) | Print-configured for US Letter landscape (scales cleanly to A4) | Deterministic per-job cost buildup, target-margin pricing, actual profit/margin check, and 3-tier package summary. |
| Service Menu | `service-menu-us-letter.pdf`<br>`service-menu-a4.pdf` | Fillable + Printable PDF (`application/pdf`) | US Letter (`8.5 × 11 in`) & A4 (`210 × 297 mm`) | Customer-facing tiered detailing menu with vehicle-size pricing slots, included tasks, add-ons, and explicit exclusions. |
| Vehicle Inspection Form | `vehicle-inspection-us-letter.pdf`<br>`vehicle-inspection-a4.pdf` | Fillable + Printable PDF (`application/pdf`) | US Letter (`8.5 × 11 in`) & A4 (`210 × 297 mm`) | Pre-service on-site walkaround condition checklist (exterior/interior zones, pre-existing defect log, customer acknowledgment). |
| Quick-Start Guide | `quick-start-guide-us-letter.pdf`<br>`quick-start-guide-a4.pdf` | Static Printable PDF (`application/pdf`) | US Letter (`8.5 × 11 in`) & A4 (`210 × 297 mm`) | Concise 2–4 page setup and job-day workflow guide connecting calculator, menu, and inspection form. |

> **Scope option for owner decision:** If the owner prefers a US-only v1 release, A4 variants can be deferred to v1.1 before Step 6 begins.

---

## 2. Deliverable 1 — `job-costing-calculator.xlsx`

### Purpose
Give an independent mobile detailer a transparent, deterministic way to calculate true per-job costs, compute target selling prices for a chosen profit margin, compare actual quotes against cost, and check margins across up to 4 service packages.

### Workbook Structure (3 Focused Sheets)
1. **`01_Job_Calculator`** (Primary single-job calculator — fits on 1 printed landscape page)
   - **Section A — Job Inputs (Editable, clearly styled input cells):**
     - Job / Package Label (`text`, optional)
     - Labor Hours (`hours`, decimal `>= 0`, e.g., `2.5`)
     - Hourly Labor Rate (`USD/hour`, decimal `>= 0`, e.g., `35.00`)
     - Materials & Chemicals Cost (`USD`, decimal `>= 0` — direct entry or linked sum from `02_Materials_Overhead`)
     - Round-Trip Travel Distance (`miles`, decimal `>= 0`, e.g., `18.0`)
     - Travel Cost Rate (`USD/mile`, decimal `>= 0`, e.g., `0.67` — user-entered, never hard-coded as official IRS guidance)
     - Allocated Fixed Overhead per Job (`USD`, decimal `>= 0` — direct entry or linked from `02_Materials_Overhead`)
     - Target Profit Margin (`%`, decimal `0.00 <= m < 1.00`, i.e., `0%` to `<100%`, e.g., `40.0%`)
     - Actual / Quoted Selling Price (`USD`, decimal `>= 0`, optional override to compare an existing price against cost)
   - **Section B — Deterministic Outputs (Locked/Formula cells, read-only styling):**
     - Labor Cost (`USD`) = `Labor Hours × Hourly Labor Rate`
     - Travel Cost (`USD`) = `Round-Trip Distance × Travel Cost Rate`
     - Total Job Cost (`USD`) = `Labor Cost + Materials Cost + Travel Cost + Allocated Overhead`
     - Target Selling Price — Unrounded (`USD`, shown for auditability or used internally) & **Recommended Quoted Price — Rounded** (`USD`, rounded to `$0.01`)
     - Projected Profit at Target Price (`USD`)
     - Implied Markup at Target Price (`%`) — explicitly juxtaposed with Target Margin (`%`) to prevent margin/markup confusion
     - Actual Profit at Quoted Price (`USD`)
     - Actual Margin at Quoted Price (`%`) — returns `"N/A (Zero Revenue)"` when Quoted Price = `$0.00`
     - Validation Status Banner (`"OK"` or explicit error message if any input violates bounds)
2. **`02_Materials_Overhead`** (Optional progressive-disclosure helper sheet)
   - **Chemical / Consumable Line-Item Estimator:** Item Name, Bottle/Pack Cost (`USD`), Uses per Bottle (`count > 0`), Cost per Job (`USD` = `Pack Cost / Uses`), summed to a Total Materials per Job cell.
   - **Monthly Overhead Allocator:** Editable monthly fixed costs (Insurance, Vehicle/Van Payment, Equipment Depreciation, Water/Generator Fuel, Software/Phone, Marketing — all `USD/month >= 0`), Expected Billable Jobs per Month (`integer > 0`), Computed Overhead per Job (`USD/job` = `Total Monthly Overhead / Expected Monthly Jobs`).
3. **`03_Package_Matrix`** (4-tier menu builder)
   - Allows entering inputs for up to 4 service packages (e.g., Maintenance Wash, Interior Deep Clean, Exterior Polish & Protect, Full Detail) across 3 vehicle sizes (Sedan/Coupe, Crossover/Small SUV, Large SUV/Truck) using the exact same deterministic formulas, outputting ready-to-copy prices for `service-menu.pdf`.

### Boundaries, Omissions & Technical Constraints
- **Currency & Units:** USD (`$`), hours (`hrs`), miles (`mi`), percentages (`%`). Every input/output cell displays its explicit unit in the label and number format.
- **Explicit Omissions:** Excludes sales tax, income tax, self-employment tax, payment-processing fees (unless user adds them as a line item), and customer tips. Clearly noted in a footer disclaimer ("Not tax or accounting advice").
- **Zero macros / external links:** Saved strictly as `.xlsx` (never `.xlsm`), zero VBA, zero Power Query, zero external workbook references, zero `WEBSERVICE`/`HYPERLINK` network calls.
- **Cross-engine compatibility:** Uses only standard Excel functions (`SUM`, `IF`, `AND`, `OR`, `ISNUMBER`, `ROUND`, `ABS`) compatible with Microsoft Excel, LibreOffice Calc, and Google Sheets.

### Testable Acceptance Criteria (`DEL-01`)
- `AC-01.1`: Workbook opens cleanly in LibreOffice Calc and Excel without repair prompts or external-link warnings.
- `AC-01.2`: All 11 fixtures in `FORMULA-TEST-CASES.md` pass after independent engine recalculation (exact match to expected values and error strings).
- `AC-01.3`: Zero `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#REF!` errors on zero-cost, zero-price, negative-input, or `100%`-margin boundary cases.
- `AC-01.4`: Formula cells are visually distinct from editable input cells (works in both color and grayscale print) and protected against accidental overwrite (without a secret password blocking legitimate user customization).

---

## 3. Deliverable 2 — `service-menu.pdf`

### Purpose
Provide a clean, client-ready service menu that an independent mobile detailer can customize with their own business name, contact info, and calculator-derived prices, then send digitally or hand out on-site.

### Structure & Editable Fields (1–2 Pages)
- **Header (Fillable):** Business Name, Phone / SMS, Email / Website, Service Area.
- **Core Service Tiers (3–4 Tiers, Fillable Price Slots):**
  - Tier 1: Exterior / Maintenance Wash (editable price slots for Sedan, Mid-Size SUV, Large SUV/Truck)
  - Tier 2: Interior Deep Clean (editable price slots by vehicle size)
  - Tier 3: Full Interior + Exterior Detail (editable price slots by vehicle size)
  - Optional Tier 4: Paint Enhancement / Protection (editable price slots by vehicle size)
  - Each tier lists concise, bulleted included tasks (5–7 bullets max per tier).
- **Add-On Services (Fillable Prices):** Pet hair removal, heavy stain/odor extraction, engine bay clean, headlight restoration, clay bar / iron decontamination, extra-dirty condition surcharge.
- **Service Expectations & Exclusions Block:** Clear plain-language notes on water/power access requirements (if applicable), appointment duration estimates (`[Enter Est. Hours]`), and explicit note that heavy soil/pet hair/biohazard conditions are quoted after on-site inspection.
- **Honest Defaults:** All price fields default to blank or clearly bracketed placeholders (`$___`), never fake "typical" prices that a buyer might accidentally send to a customer.

### Testable Acceptance Criteria (`DEL-02`)
- `AC-02.1`: Both US Letter (`8.5 × 11 in`) and A4 (`210 × 297 mm`) variants render with zero clipped text, zero overflowing fields, and `>= 0.5 in` (`12.7 mm`) print margins.
- `AC-02.2`: All AcroForm text fields are editable in standard PDF viewers (Preview, Adobe Acrobat Reader, Chrome/Edge PDF viewer) with legible font sizing (`>= 9 pt`) and no text clipping on realistic inputs (e.g., `$1,250.00`, 30-character business names).
- `AC-02.3`: Printed in grayscale, tier hierarchy, borders, and price slots remain clearly legible (`>= 4.5:1` body text contrast).

---

## 4. Deliverable 3 — `vehicle-inspection.pdf`

### Purpose
Provide an on-site, clipboard-friendly pre-service vehicle walkaround checklist to document vehicle condition, pre-existing defects, agreed service scope, and customer acknowledgment before detailing begins.

### Structure & Editable / Writable Fields (1 Page Front, Optional Page 2 Notes/Sign-Off or Single-Page Compact Form — Target: **1 Page** for fast clipboard use)
- **Header (Fillable & Writable):** Business Name, Date, Job #, Customer Name, Phone, Vehicle Year / Make / Model / Color, License Plate / Last 6 of VIN (optional), Odometer (optional).
- **Exterior Condition Map (Original Vector Diagram):** Clean high-contrast line-art diagram showing Top, Left, Right, Front, and Rear views of a generic passenger vehicle — designed specifically for pen/pencil marking on grayscale printouts.
- **Defect Legend (Recognition over Recall):** `S` Scratch · `D` Dent · `C` Paint Chip · `R` Rust · `CR` Curb Rash · `G` Glass Crack · `M` Missing Trim.
- **Interior Condition Checklist:** Checkboxes (`Good` / `Pre-Existing Issue` / `N/A`) for Seats/Upholstery, Carpets/Mats, Headliner, Dashboard/Console, Door Panels, Trunk/Cargo, Odor/Smoke/Pet Hair, Warning Lights on Dash.
- **Personal Items & Access Check:** Customer removed valuables (`Yes / No`), child seats present (`Yes / No`), water/power access confirmed (`Yes / Self-Contained`).
- **Agreed Scope & Notes:** Selected package, approved add-ons, quoted price (`$___`), and 3–4 generous lined rows (`>= 7 mm` line height) for pre-existing defect notes.
- **Customer Pre-Service Acknowledgment:** Plain-language operational acknowledgment that pre-existing conditions noted above were reviewed together before service, with Customer Signature/Initials, Detailer Initials, and Date/Time lines.
- **Required Non-Legal Disclaimer:** Small footer stating: *"Operational inspection record only — not legal advice or a jurisdiction-specific liability waiver."*

### Testable Acceptance Criteria (`DEL-03`)
- `AC-03.1`: Fits cleanly on **1 single page** in both US Letter and A4 variants so detailers can print single-sided clipboard sheets cheaply.
- `AC-03.2`: Exterior diagram is 100% original vector art (no third-party watermarked/copyrighted silhouettes), sharp at 300 DPI, and crisp in pure black-and-white/grayscale print.
- `AC-03.3`: Checkboxes (`>= 4 mm × 4 mm`) and handwriting lines (`>= 7 mm` spacing) are physically usable on a clipboard outdoors.
- `AC-03.4`: Fillable PDF fields work cleanly for tablet/iPad users without overlapping static labels.

---

## 5. Deliverable 4 — `quick-start-guide.pdf`

### Purpose
Orient a solo mobile detailer in under 15 minutes so they know how to configure their real numbers in the calculator, transfer prices to the service menu, and use the inspection sheet on-site.

### Structure (Target: 2–4 Pages)
- **Page 1 — What's Included & 15-Minute Setup Sequence:** File list, tool compatibility (Excel / LibreOffice / Google Sheets / PDF viewers), and 3 numbered steps (1. Enter baseline costs → 2. Set menu prices → 3. Print inspection sheets).
- **Page 2 — Margin vs. Markup (Worked Example):** Clear side-by-side explanation using the canonical `$100.00` cost at `40%` target margin (`$166.67` price, `$66.67` profit) vs. `40%` markup (`$140.00` price, `28.6%` margin), showing why confusing the two underprices jobs.
- **Page 3 — Job-Day Mobile Workflow & Print Tips:** Pre-job walkaround checklist habits, grayscale printing settings (`Actual Size` / `100%` for US Letter vs. A4), and post-job margin check routine.
- **Page 4 (Optional / Combined with Page 3) — Scope Limitations & Troubleshooting:** Explicit statement of what the kit does NOT cover (no tax rates, no legal contracts, no guaranteed income), plus common spreadsheet tips (e.g., how to enter percentages, why `"N/A"` appears on zero revenue).

### Testable Acceptance Criteria (`DEL-04`)
- `AC-04.1`: Worked math example matches `FORMULA-TEST-CASES.md` (`TC-01`) to the exact cent.
- `AC-04.2`: Contains zero profit/income promises, zero fabricated testimonials, and clear non-tax / non-legal disclaimers.
- `AC-04.3`: Renders cleanly in both US Letter and A4 with zero clipped text, widow/orphan heading breaks, or contrast failures.
