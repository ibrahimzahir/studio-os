# QA Report — Mobile Detailing Planner (`v0.1.0-draft`)

- **Date:** 2026-11-24
- **Revision:** `v0.1.0-draft` (internal experimental draft — NOT demand-validated, NOT approved for public release)
- **Manifest:** `antigravity/mobile-detailing/output/v0.1.0-draft/manifest.json`
- **Overall QA Verdict:** **PARTIAL PASS — BLOCKED ON HEADLESS SPREADSHEET RECALCULATION & INTERACTIVE ACROFORM DECISION** (Zero failed security/visual checks; unavailable tools explicitly reported, never waived.)

---

## 1. Full-Path Tool Discovery & Execution Log

| Tool / Capability | Full Path Checked | Status | Used For |
|---|---|---|---|
| Python 3 + `openpyxl`, `pypdf`, `PIL`, `pandas` | `/opt/homebrew/bin/python3` | **FOUND** | `.xlsx` generation, security/XML scanning, `pypdf` inspection, Pillow grayscale & 4 Pinterest PNGs, SHA-256 checksums |
| Google Chrome (headless) | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` | **FOUND** | Reproducible HTML+SVG → PDF rendering for US Letter & A4 |
| Poppler `pdftoppm` & `pdfinfo` | `/opt/homebrew/bin/pdftoppm`, `/opt/homebrew/bin/pdfinfo` | **FOUND** | Page count, MediaBox verification, and 150–200 DPI PNG rendering of every PDF page |
| LibreOffice (`soffice`) | `/Applications/LibreOffice.app/Contents/MacOS/soffice`, `/opt/homebrew/bin/soffice` | **MISSING** | **Blocker:** required for automated headless `.xlsx` formula recalculation & XLSX-to-PDF print export |
| Microsoft Excel (Desktop GUI) | `/Applications/Microsoft Excel.app/Contents/MacOS/Microsoft Excel` | **FOUND (GUI only)** | Present as interactive desktop app; not invoked headlessly to avoid unattended GUI popups |
| Ghostscript (`gs`) | `/opt/homebrew/bin/gs`, `/usr/local/bin/gs` | **MISSING** | Grayscale verification performed via `pdftoppm` + Pillow `ImageOps.grayscale` instead |
| `reportlab` / `weasyprint` | `/opt/homebrew/bin/python3` (`reportlab` missing; `weasyprint` missing native libs) | **MISSING** | Chrome HTML-to-PDF used instead (crisp printable PDFs, 0 interactive AcroForm fields — recorded below) |

---

## 2. Check Results (Passed / Fixed / Unavailable)

### A. PDF Geometry, Visual Inspection & Grayscale Safety — **PASSED (with AcroForm note)**
Commands executed:
- `/opt/homebrew/bin/python3 antigravity/mobile-detailing/output/v0.1.0-draft/src/build_pdfs.py`
- `/opt/homebrew/bin/python3 antigravity/mobile-detailing/output/v0.1.0-draft/src/build_qa_and_pins.py`

| File | Pages | MediaBox (`pdfinfo`) | Embedded JS / Launch | Render DPI | Visual Inspection Result |
|---|---|---|---|---|---|
| `service-menu-us-letter.pdf` | 2 | `612 x 792 pts (letter)` | `false` | 150 | **PASS** — clean 3-tier + Tier 4 + add-ons layout, blank honest price slots, zero clipping |
| `service-menu-a4.pdf` | 2 | `594.96 x 841.92 pts (A4)` | `false` | 150 | **PASS** — exact A4 geometry, zero overflow |
| `vehicle-inspection-us-letter.pdf` | 1 | `612 x 792 pts (letter)` | `false` | 200 | **PASS** — strictly 1 page, 0.78 in clipboard top margin, crisp original 5-view vector car diagram, legible in grayscale (`previews/vehicle-inspection-us-letter-1-grayscale.png`) |
| `vehicle-inspection-a4.pdf` | 1 | `594.96 x 841.92 pts (A4)` | `false` | 200 | **PASS** — strictly 1 page, exact A4 geometry |
| `quick-start-guide-us-letter.pdf` | 3 | `612 x 792 pts (letter)` | `false` | 150 | **PASS** — 3-step setup, exact `$100 @ 40% margin = $166.67` vs. `$140.00` markup table matching `TC-01`, print/scope disclaimers |
| `quick-start-guide-a4.pdf` | 3 | `594.96 x 841.92 pts (A4)` | `false` | 150 | **PASS** — exact A4 geometry |

- **Known Draft Limitation (`QA-PDF-05` — Interactive AcroForm Fields):** Chrome `--print-to-pdf` produces static printable PDFs (`acroform_field_count: 0`). They print and annotate cleanly in Preview/Adobe/iPad Markup, but if interactive typed AcroForm widgets are required for commercial v1, either install `reportlab` in an isolated Python venv or use a PDF AcroForm post-processor before commercial release.

### B. Spreadsheet Security & Formula Fixtures — **PARTIAL (Security PASS; Real Engine Recalculation UNAVAILABLE)**
- **Security & Structure Scan (`inspect_xlsx_safety`):** **PASSED**
  - Sheets: `01_Job_Calculator`, `02_Materials_Overhead`, `03_Package_Matrix`
  - Formula cells present: `57`
  - VBA macros (`vbaProject.bin` / ActiveX): `false`
  - External workbook links (`xl/externalLinks/`): `false`
  - `WEBSERVICE(` formulas: `false`
- **Deterministic Math Fixture Verification (Python `Decimal`):** **PASSED** (`ALL_10_NUMERIC_FIXTURES_VERIFIED_OK` against `TC-01`–`TC-10`; `TC-11` non-numeric/zero-jobs guard encoded in Excel `ISNUMBER`/`<=0` formulas).
- **Real Spreadsheet-Engine Recalculation (`QA-XLS-01`, `QA-XLS-02`, `QA-XLS-04`):** **UNAVAILABLE (`unavailable_missing_tool`)**
  - Headless LibreOffice (`soffice`) is **not installed** on this host. Writing Excel formulas via `openpyxl` is **not** engine recalculation.
  - **Required before commercial release:** Install LibreOffice (`soffice --headless --convert-to xlsx/pdf`) OR have the owner open `job-costing-calculator.xlsx` in installed Microsoft Excel, run all 11 fixtures (`TC-01`–`TC-11`), and confirm zero `#DIV/0!`/`#VALUE!`/`#NAME?` errors.

### C. Pinterest Draft Batch (4 Unique 1000×1500 PNGs) — **PASSED (after 1 visual QA revision)**
- **Visual QA defects caught & fixed on iteration 1:**
  1. `pin-03-vehicle-inspection-form.png`: Green badge pill width (`520px`) clipped `"READY"` on the right edge → widened pill to `595px` and regenerated.
  2. `pin-02-service-menu-template.png` & Pin 2/3/4 metadata: Updated `"FILLABLE PDF"` to `"PRINTABLE PDF"` so pin imagery and copy stay 100% honest to the actual generated draft PDFs.
- **Verified metrics after fix:**
  - All 4 pins are unique `1000 × 1500` PNGs, all well under the 500 KB target (`228 KB`, `236 KB`, `234 KB`, `283 KB`).
  - All titles `<= 100` chars; all descriptions `<= 500` chars; zero fake URLs (uses `https://{{PUBLIC_DOMAIN_TBD}}/products/mobile-detailing-planner`); zero fake reviews/scarcity/profit guarantees/religious-holiday content.

---

## 3. Preview Paths

- PDF Previews: `antigravity/mobile-detailing/output/v0.1.0-draft/previews/` (12 color page PNGs + 6 grayscale page-1 PNGs)
- Pinterest Drafts: `antigravity/mobile-detailing/output/v0.1.0-draft/pinterest/` (`pin-01` through `pin-04`)
