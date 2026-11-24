# Quality Assurance Checklist — Mobile Detailing Planner

- **Status:** Preparation specification — **0 checks executed against commercial assets yet** (asset generation is blocked until explicit Owner Production Approval).
- **Product slug:** `mobile-detailing-planner`
- **Date:** 2026-11-24
- **Execution rule:** In Step 7 (post-approval), every applicable item below must be executed with real tools and logged with exact commands, outputs, and preview image paths in `QA-REPORT.md`. **Never mark a check passed if the required tool is missing or unrun.**

---

## 1. Local QA Tooling Readiness (Actual Environment Check — 2026-11-24)

Ran `command -v libreoffice soffice pdftoppm gs python3 node pnpm` in this environment on 2026-11-24:

| Capability Required | Tool(s) Checked | Actual Status (2026-11-24) | Impact on Step 7 QA |
|---|---|---|---|
| Headless `.xlsx` formula recalculation & PDF export | `libreoffice` / `soffice` | **MISSING** on default PATH | **Blocker for Step 7 spreadsheet recalculation.** Must install LibreOffice (or verify an alternative real spreadsheet engine) before marking spreadsheet QA passed. |
| Page-by-page PDF rasterization for visual inspection | `pdftoppm` (Poppler) | **MISSING** on default PATH | **Blocker for Step 7 automated PDF page rendering.** Must install Poppler (`pdftoppm`) or verified PDF renderer before marking visual PDF QA passed. |
| Grayscale print simulation / PDF inspection | `gs` (Ghostscript) | **MISSING** on default PATH | Needed for grayscale print verification (or via Poppler + Python Pillow grayscale conversion). |
| Deterministic fixture verification & checksum generation (`SHA-256`) | `python3` (`/usr/bin/python3`) | **AVAILABLE** | Available for cross-checking formula fixtures, validating filenames/sizes/SHA-256 checksums, and inspecting `.xlsx` XML for macros/links. |
| Node / pnpm (Studio OS platform checks — Codex domain) | `node`, `pnpm` | Not on default non-interactive PATH (installed under `~/.nvm/versions/node/v24.22.0/bin` per `AGENTS.md`) | Not modified by Antigravity. |

> **Important:** Per `docs/ANTIGRAVITY-EXECUTION-FLOW.md`, unavailable tools are explicitly recorded as blockers for Step 7, never waived or reported as passed.

---

## 2. PDF Visual, Print & Accessibility Checks (All 3 PDFs × Both Print Sizes)

Applies to `service-menu-{us-letter,a4}.pdf`, `vehicle-inspection-{us-letter,a4}.pdf`, and `quick-start-guide-{us-letter,a4}.pdf`:

| Check ID | Criterion | Verification Method (Step 7) | Tool Required | Status |
|---|---|---|---|---|
| `QA-PDF-01` | **Page-by-page visual render** | Rasterize every page of every US Letter and A4 PDF at `>= 150 DPI` (300 DPI for inspection diagram) and visually inspect every PNG. | `pdftoppm` (MISSING) | `not_run` |
| `QA-PDF-02` | **No clipping or overflow** | Inspect rendered pages for truncated text, overlapping labels, clipped table borders, or orphaned headings. | Visual inspection of rendered PNGs | `not_run` |
| `QA-PDF-03` | **Exact page geometry & print margins** | Verify MediaBox matches US Letter (`612 × 792 pt`) or A4 (`595.28 × 841.89 pt`); verify all content sits inside `>= 0.5 in` (`36 pt`) margins and `vehicle-inspection.pdf` top margin is `>= 0.75 in` (`54 pt`) for clipboard clearance. | PDF metadata check (`python3` / `pdfinfo`) + visual overlay | `not_run` |
| `QA-PDF-04` | **Single-page constraint (`vehicle-inspection.pdf`)** | Verify both US Letter and A4 inspection PDFs are strictly `1 page`. | PDF page-count check | `not_run` |
| `QA-PDF-05` | **Fillable AcroForm usability** | Test typing realistic values (e.g., `$1,250.00`, 30-char business name, multi-line notes) into every fillable field; verify readable font size (`>= 9 pt`), no overlap, and blank/`$___` honest defaults. | PDF viewer / programmatic AcroForm test | `not_run` |
| `QA-PDF-06` | **Typography & WCAG AA contrast** | Verify embedded open-license fonts, tabular numerals in tables, body text `>= 9.5 pt` (disclaimers `>= 8 pt`), and contrast `>= 4.5:1` for body text. | Token audit + rendered PNG inspection | `not_run` |
| `QA-PDF-07` | **Grayscale print legibility** | Convert rendered PNGs to 8-bit grayscale and inspect; confirm input fields, table headers, checkboxes, and exterior vehicle diagram remain crisp without relying on color alone. | `gs` or Python image grayscale conversion | `not_run` |
| `QA-PDF-08` | **Consistent units & math parity** | Verify `USD`, `hours`, `miles`, and `%` match across all PDFs and `job-costing-calculator.xlsx`; verify `quick-start-guide.pdf` worked example matches `TC-01` (`$100 @ 40% margin -> $166.67 price, $66.67 profit`). | Text extraction & manual diff against `FORMULA-TEST-CASES.md` | `not_run` |

---

## 3. Spreadsheet Recalculation & Formula Integrity (`job-costing-calculator.xlsx`)

| Check ID | Criterion | Verification Method (Step 7) | Tool Required | Status |
|---|---|---|---|---|
| `QA-XLS-01` | **Real engine recalculation** | Open `.xlsx` in LibreOffice Calc (headless) and force full formula recalculation; **writing formula strings with a library is NOT recalculation.** | `libreoffice` / `soffice` (MISSING) | `not_run` |
| `QA-XLS-02` | **All 11 formula fixtures pass** | Inject inputs for `TC-01` through `TC-11` from `FORMULA-TEST-CASES.md`, recalculate via spreadsheet engine, and assert exact match on `C`, `P_raw`, `P_quote`, `Profit`, `m_actual`, `u_actual`, and `Status`. | `libreoffice` + `python3` assertion script | `not_run` |
| `QA-XLS-03` | **Zero unhandled spreadsheet errors** | Confirm zero `#DIV/0!`, `#VALUE!`, `#NAME?`, `#REF!`, `#N/A`, or `#NUM!` errors across all sheets under normal and boundary cases (zero cost, zero price, negative input, `100%` margin). | Recalculated workbook XML scan (`python3`) | `not_run` |
| `QA-XLS-04` | **Print layout & grayscale readability** | Export `01_Job_Calculator` to PDF via LibreOffice and visually inspect that it fits cleanly on 1 landscape page with clear visual separation between editable input cells and formula cells in grayscale. | `libreoffice` + `pdftoppm` (MISSING) | `not_run` |

---

## 4. Security, File Safety & Licensing Checks

| Check ID | Criterion | Verification Method (Step 7) | Tool Required | Status |
|---|---|---|---|---|
| `QA-SEC-01` | **No macros or executable content** | Inspect `.xlsx` ZIP archive to confirm `.xlsx` extension (never `.xlsm`), zero `vbaProject.bin`, zero ActiveX controls, and zero embedded scripts in PDFs (`/JavaScript`, `/JS`, `/Launch`, `/OpenAction` actions). | `python3` ZIP/PDF structure scanner | `not_run` |
| `QA-SEC-02` | **No external workbook links or network calls** | Inspect `.xlsx` XML (`xl/externalLinks/`, formulas) to confirm zero external workbook references, zero `WEBSERVICE`, and zero unexpected outbound URLs. | `python3` XML scanner | `not_run` |
| `QA-SEC-03` | **Safe filenames & manifest integrity** | Verify all output filenames are lowercase ASCII kebab-case with no path traversal, spaces, or special characters; compute exact byte sizes and `SHA-256` checksums for `manifest.json`. | `python3` (`hashlib.sha256`) | `not_run` |
| `QA-LIC-01` | **Original / licensed assets & attribution** | Verify all fonts (e.g., SIL OFL), vector vehicle diagram (original SVG created for this product), and copy are 100% original or properly licensed for commercial digital-product distribution; record licenses in `QA-REPORT.md`. Zero copied competitor text or graphics. | License audit log | `not_run` |
| `QA-ETH-01` | **Compliance & ethics audit** | Confirm zero profit/income guarantees, zero fabricated proof/reviews/urgency, zero tax/legal advice claims, and zero religious-holiday content. | Full copy review | `not_run` |

---

## 5. Final Human Gates (Non-Automatable)

| Gate | Requirement | Status |
|---|---|---|
| **Production Approval Gate** (before Step 6) | Explicit owner decision approving scope, revision, and budget (or explicitly authorizing a labeled experimental prototype). | `awaiting_approval` |
| **Release Approval Gate** (after Step 9) | Separate explicit owner decision after reviewing `QA-REPORT.md`, rendered previews, `manifest.json`, `RELEASE-REVIEW.md`, and `launch-drafts/`. `automaticPublishing` remains `false`. | `not_authorized` |
