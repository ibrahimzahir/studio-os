# Design & UX Psychology Brief — Mobile Detailing Planner

- **Status:** Preparation specification — governs Step 6 asset creation after owner production approval
- **Product slug:** `mobile-detailing-planner`
- **Date:** 2026-11-24
- **Standards applied:** `/Users/ibrahimzahir/development/standards/UI_UX_PSYCHOLOGY.md`, `docs/DESIGN.md`, `docs/ANTIGRAVITY-PROMPT.md`, `docs/ANTIGRAVITY-EXECUTION-FLOW.md`

---

## 1. Visual Identity & Aesthetic Direction

- **Tone:** Restrained, practical, workshop-ready editorial utility. Looks like a high-trust independent trade document — never like a flashy automotive flyer, neon car-wash coupon, or generic "AI binder."
- **Visual restraint:** Generous whitespace, crisp 1 pt / 0.5 pt structural rules, minimal decorative clutter, zero stock-photo backgrounds that waste buyer printer ink.

---

## 2. Reusable Design Token System

### Color Tokens (Color + Grayscale-Safe Pairings)

| Token | Hex | Grayscale Luminance Role | Usage | Contrast vs. `#FFFFFF` |
|---|---|---|---|---|
| `--color-brand-primary` | `#1B4332` (Deep Forest Green) | Dark charcoal (~20% L) | Primary headings, table header fills (with white text), primary section rules | `11.6:1` (AAA) |
| `--color-brand-accent` | `#2D6A4F` (Muted Forest) | Medium-dark gray (~36% L) | Secondary labels, callout borders, badge borders | `6.2:1` (AA+) |
| `--color-surface-page` | `#FFFFFF` | White | Printable page background (zero ink waste) | — |
| `--color-surface-subtle` | `#F4F7F5` (Soft Sage Tint) | Very light tint (~96% L) | Alternating table rows, summary callout fill, editable input cell tint in Excel | — |
| `--color-surface-input` | `#EAF2EE` (Light Mint-Sage) | Light gray tint (~93% L) | Editable user input cells in `job-costing-calculator.xlsx` (paired with thin solid border so grayscale still distinguishes inputs from formulas) | — |
| `--color-text-primary` | `#161B18` (Near-Black) | Near-black | Body copy, table values, inspection checklist items | `17.5:1` (AAA) |
| `--color-text-muted` | `#4A5550` (Slate-Green Gray) | Mid-dark gray | Units, helper hints, footers, disclaimers | `7.6:1` (AAA) |
| `--color-border-default` | `#C7D1CC` | Light-mid gray | Table gridlines, fillable field outlines, handwriting lines | — |
| `--color-status-error` | `#9B1C1C` (Deep Crimson) | Dark gray + `ERR:` text prefix | Validation errors in calculator (never color-only; always paired with explicit `ERR:` text prefix) | `7.9:1` (AAA) |

> **Grayscale print rule:** Every distinction conveyed by color (editable input vs. locked formula, error vs. OK, section hierarchy) **must also** be conveyed by border style, typography weight, or explicit text prefix (`[INPUT]`, `ERR:`, bold headers) so black-and-white laser/inkjet printouts remain 100% functional.

### Typography Tokens (Open-License / Embedded-Safe Editorial Pairing)
- **Headings (Editorial Serif):** `Source Serif 4` or `Merriweather` (SIL Open Font License — verify exact license before embedding in Step 6).
- **Body, Tables & Form Labels (Clean Sans):** `Inter` or `IBM Plex Sans` (SIL OFL) with **tabular numerals** (`font-variant-numeric: tabular-nums`) enabled for all currency, hour, mile, and percentage columns so decimal points align vertically.
- **Type Scale (Print PDFs):**
  - Document Title: `20 pt` Bold (`24 pt` leading)
  - Section Heading (H2): `12 pt` SemiBold, uppercase or small-caps tracking `+0.04em`, forest-green rule beneath
  - Body / Checklist Item: `9.5–10 pt` Regular (`14 pt` leading)
  - Helper / Unit / Footer / Disclaimer: `8–8.5 pt` Regular (never below `8 pt` in print)
  - Spreadsheet cells: `10–11 pt` sans-serif (`Calibri` / `Arial` / `Liberation Sans` fallback safe across Excel, LibreOffice, and Google Sheets).

### Layout & Print Geometry Tokens
- **US Letter:** `8.5 × 11 in` (`215.9 × 279.4 mm`), safe margins `>= 0.55 in` (`14 mm`) on all four sides.
- **A4:** `210 × 297 mm`, safe margins `>= 14 mm` on all four sides.
- **Clipboard Ergonomics (`vehicle-inspection.pdf`):**
  - Top margin `>= 0.75 in` (`19 mm`) to clear standard clipboard metal clips without covering the business header.
  - Checkboxes `>= 4.2 mm × 4.2 mm` (`12 pt`) with `1 pt` dark borders.
  - Handwriting lines `>= 7.5 mm` (`21 pt`) vertical spacing for standing/outdoor pen use.

---

## 3. UX Psychology Application (2–4 Principles Per Surface)

Per `/Users/ibrahimzahir/development/standards/UI_UX_PSYCHOLOGY.md`: name the surface, state the single desired behavior, and apply **2–4 targeted principles** — prioritizing friction reduction first.

### Surface 1: `job-costing-calculator.xlsx`
- **Desired user behavior:** Accurately enter real job costs and choose a sustainable target margin without confusing margin and markup or accidentally overwriting formulas.
- **Selected principles (4):**
  1. **Recognition over Recall:** Every input label includes its exact unit (`Labor Hours (hrs)`, `Hourly Rate (USD/hr)`, `Target Margin (%)`) and a brief plain-language hint so users never guess whether to enter `40` or `0.40` or miles vs. minutes.
  2. **Law of Proximity:** Cost inputs are visually grouped into four adjacent buckets (Labor, Materials, Travel, Overhead) directly feeding the Total Cost and Target Price summary block.
  3. **Progressive Disclosure:** `01_Job_Calculator` lets a detailer get a complete quote in 7 inputs; optional chemical-bottle dilution math and monthly overhead breakdown live on `02_Materials_Overhead` so new users are not overwhelmed on first open.
  4. **Feedforward & Feedback Loop:** Changing `Target Margin (%)` immediately previews both the rounded quoted price and the implied markup side-by-side (feedforward); entering a negative number or `>= 100%` margin immediately displays an explicit `ERR:` banner (feedback loop).

### Surface 2: `service-menu.pdf`
- **Desired user behavior:** Present clear, easy-to-compare detailing tiers to a prospect so the customer picks a package with accurate expectations of what is included vs. extra.
- **Selected principles (3):**
  1. **Hick's Law:** Restrict core packages to **3–4 distinct tiers** (instead of 10 overlapping rows) so prospects decide quickly without decision fatigue.
  2. **Visual Hierarchy & Chunking:** Clear tier headers, concise 5–7 bullet inclusions chunked by Exterior/Interior, and a separate Add-Ons & Exclusions block below.
  3. **Honest Defaults (Default Bias guardrail):** Editable price slots default to blank / `$___` rather than invented "suggested" prices, preventing buyers from accidentally sending unverified pricing to real customers.

### Surface 3: `vehicle-inspection.pdf`
- **Desired user behavior:** Complete a fast, thorough 3-minute pre-service walkaround on a driveway clipboard and obtain customer acknowledgment of pre-existing conditions.
- **Selected principles (3):**
  1. **Mental Model:** Form layout follows the physical walkaround order a detailer actually walks (Vehicle Info → Exterior 5-View Diagram → Interior Zones → Personal Items → Notes & Sign-Off).
  2. **Recognition over Recall:** Short defect legend (`S` Scratch, `D` Dent, `C` Chip, `R` Rust, `CR` Curb Rash, `G` Glass, `M` Missing Trim) sits directly beside the exterior diagram so the operator marks codes at a glance.
  3. **Fitts's Law:** Oversized checkboxes (`>= 4.2 mm`) and wide handwriting lines (`>= 7.5 mm`) make marking accurate while standing outdoors with a clipboard.

### Surface 4: `quick-start-guide.pdf`
- **Desired user behavior:** Complete initial setup in under 15 minutes and adopt the 3-tool job workflow without getting stuck on spreadsheet math.
- **Selected principles (3):**
  1. **Spark Effect:** Opens with a concrete, low-friction 3-step 15-minute setup checklist on Page 1.
  2. **Progressive Disclosure:** Essentials and workflow order first; the worked `$100 @ 40% margin` vs. markup walkthrough on Page 2; print settings and troubleshooting last.
  3. **Feedforward:** Explicitly states upfront what the toolkit does (deterministic job costing, menu presentation, operational walkaround notes) and does not do (no tax rates, no legal contracts, no income guarantees).

---

## 4. Ethics & Cultural Guardrails (Non-Negotiable)

- **Zero dark patterns:** No fake urgency ("limited-time price"), no fabricated testimonials/reviews, no artificial scarcity, no hidden costs, no confirmshaming, and no profit or income guarantees ("make $10k/month!").
- **Cultural policy:** No religious-holiday products, themes, or seasonal gimmicks (Christmas, Easter, Halloween, Valentine's, etc.). Ask the owner explicitly before introducing any Islamic-themed content.
- **Behavior verification plan:** After production approval and before commercial launch, verify real comprehension and usability (e.g., whether a detailer understands margin vs. markup on first read and can fill out the inspection sheet in grayscale print) rather than relying on assumptions.
