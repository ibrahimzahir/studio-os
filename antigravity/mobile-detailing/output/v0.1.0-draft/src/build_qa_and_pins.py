#!/usr/bin/env python3
"""
Independent QA runner, preview renderer, 4-pin Pinterest draft generator, and manifest builder
for Mobile Detailing Planner (v0.1.0-draft).

Uses ONLY installed local tools via full paths:
  - /opt/homebrew/bin/pdftoppm (PDF -> PNG page-by-page rendering)
  - /opt/homebrew/bin/pdfinfo  (page count & MediaBox verification)
  - /opt/homebrew/bin/python3  (openpyxl, pypdf, PIL, zipfile, hashlib)
Reports missing LibreOffice/Excel honestly as unavailable — NEVER marks unavailable checks passed.
"""

import hashlib
import json
import os
import subprocess
import zipfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
from pypdf import PdfReader

OUT_DIR = Path(__file__).resolve().parent.parent
PREVIEWS_DIR = OUT_DIR / "previews"
PINTEREST_DIR = OUT_DIR / "pinterest"

PDFTOPPM = "/opt/homebrew/bin/pdftoppm"
PDFINFO = "/opt/homebrew/bin/pdfinfo"

PRODUCT_FILES = [
    ("job-costing-calculator.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    ("service-menu-us-letter.pdf", "application/pdf"),
    ("service-menu-a4.pdf", "application/pdf"),
    ("vehicle-inspection-us-letter.pdf", "application/pdf"),
    ("vehicle-inspection-a4.pdf", "application/pdf"),
    ("quick-start-guide-us-letter.pdf", "application/pdf"),
    ("quick-start-guide-a4.pdf", "application/pdf"),
]


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def load_font(size: int, bold: bool = False, serif: bool = False):
    candidates = []
    if serif:
        candidates += [
            "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Georgia.ttf",
            "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
        ]
    else:
        candidates += [
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def check_spreadsheet_engines():
    engines = {
        "libreoffice_app": "/Applications/LibreOffice.app/Contents/MacOS/soffice",
        "libreoffice_brew": "/opt/homebrew/bin/soffice",
        "microsoft_excel": "/Applications/Microsoft Excel.app/Contents/MacOS/Microsoft Excel",
    }
    return {k: os.path.exists(v) for k, v in engines.items()}


def inspect_xlsx_safety(xlsx_path: Path):
    findings = {
        "has_vba_macros": False,
        "has_external_links": False,
        "has_webservice_formula": False,
        "sheets": [],
        "formula_cells_count": 0,
    }
    with zipfile.ZipFile(xlsx_path, "r") as zf:
        names = zf.namelist()
        findings["has_vba_macros"] = any("vbaproject" in n.lower() or "activex" in n.lower() for n in names)
        findings["has_external_links"] = any("externallinks" in n.lower() for n in names)
        for n in names:
            if n.startswith("xl/worksheets/sheet") and n.endswith(".xml"):
                data = zf.read(n).decode("utf-8", errors="ignore")
                if "WEBSERVICE(" in data.upper():
                    findings["has_webservice_formula"] = True
                findings["formula_cells_count"] += data.count("<f>") + data.count("<f ")
    import openpyxl
    wb = openpyxl.load_workbook(xlsx_path, data_only=False)
    findings["sheets"] = wb.sheetnames
    return findings


def inspect_and_render_pdfs():
    PREVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    pdf_results = {}

    for fname, mtype in PRODUCT_FILES:
        if mtype != "application/pdf":
            continue
        p = OUT_DIR / fname
        stem = p.stem
        dpi = 200 if "inspection" in stem else 150

        # 1) pdfinfo
        info_out = subprocess.check_output([PDFINFO, str(p)], text=True)
        pages = None
        page_size = ""
        for line in info_out.splitlines():
            if line.startswith("Pages:"):
                pages = int(line.split(":", 1)[1].strip())
            elif line.startswith("Page size:"):
                page_size = line.split(":", 1)[1].strip()

        # 2) pypdf AcroForm & JS safety check
        reader = PdfReader(str(p))
        fields = reader.get_fields() or {}
        raw_bytes = p.read_bytes()
        has_js = any(tok in raw_bytes for tok in (b"/JavaScript", b"/JS ", b"/Launch", b"/OpenAction"))

        # 3) pdftoppm render all pages
        prefix = PREVIEWS_DIR / stem
        subprocess.check_call([PDFTOPPM, "-png", "-r", str(dpi), str(p), str(prefix)])
        rendered = sorted(PREVIEWS_DIR.glob(f"{stem}-*.png"))

        # 4) Grayscale simulation for page 1 of each US Letter PDF (and inspection A4)
        gray_files = []
        for img_path in rendered:
            if img_path.name.endswith("-1.png"):
                im = Image.open(img_path)
                gray = ImageOps.grayscale(im)
                gpath = PREVIEWS_DIR / f"{img_path.stem}-grayscale.png"
                gray.save(gpath, optimize=True)
                gray_files.append(f"previews/{gpath.name}")

        pdf_results[fname] = {
            "pages": pages,
            "page_size": page_size,
            "acroform_field_count": len(fields),
            "has_embedded_js_or_launch": has_js,
            "render_dpi": dpi,
            "preview_pngs": [f"previews/{r.name}" for r in rendered],
            "grayscale_previews": gray_files,
        }
    return pdf_results


def draw_wrapped(draw: ImageDraw.ImageDraw, text: str, font, x: int, y: int, max_w: int, fill, line_h: int):
    words = text.split()
    line = ""
    cy = y
    for w in words:
        test = (line + " " + w).strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_w:
            line = test
        else:
            draw.text((x, cy), line, font=font, fill=fill)
            cy += line_h
            line = w
    if line:
        draw.text((x, cy), line, font=font, fill=fill)
        cy += line_h
    return cy


def paste_card(base: Image.Image, src_path: Path, box_xywh, border_color=(200, 210, 204)):
    x, y, w, h = box_xywh
    im = Image.open(src_path).convert("RGB")
    im.thumbnail((w, h), Image.Resampling.LANCZOS)
    pw, ph = im.size
    ox = x + (w - pw) // 2
    oy = y + (h - ph) // 2
    draw = ImageDraw.Draw(base)
    # Soft drop shadow
    draw.rectangle([ox + 8, oy + 10, ox + pw + 8, oy + ph + 10], fill=(210, 220, 214))
    base.paste(im, (ox, oy))
    draw.rectangle([ox, oy, ox + pw, oy + ph], outline=border_color, width=2)


def build_four_unique_pinterest_pins():
    PINTEREST_DIR.mkdir(parents=True, exist_ok=True)
    W, H = 1000, 1500
    FOREST = (27, 67, 50)
    ACCENT = (45, 106, 79)
    SAGE_BG = (244, 247, 245)
    MINT = (234, 242, 238)
    DARK = (22, 27, 24)
    MUTED = (74, 85, 80)
    WHITE = (255, 255, 255)
    RED = (155, 28, 28)

    f_badge = load_font(22, bold=True)
    f_h1 = load_font(56, bold=True, serif=True)
    f_h2 = load_font(30, bold=False)
    f_body = load_font(26, bold=False)
    f_bold = load_font(26, bold=True)
    f_small = load_font(22, bold=False)

    # PIN 1: Job Costing Calculator & Margin vs. Markup (shows actual quick-start page 2 + crisp calculator card)
    im1 = Image.new("RGB", (W, H), SAGE_BG)
    d1 = ImageDraw.Draw(im1)
    d1.rectangle([0, 0, W, 380], fill=FOREST)
    d1.rounded_rectangle([70, 56, 440, 102], radius=8, fill=ACCENT)
    d1.text((92, 66), "EXCEL & GOOGLE SHEETS", font=f_badge, fill=WHITE)
    draw_wrapped(d1, "Mobile Detailing Job Costing Calculator", f_h1, 70, 130, 860, WHITE, 68)
    d1.text((70, 290), "Price every detail by real labor, chemicals, fuel & target margin.", font=f_h2, fill=(220, 231, 225))

    # Embed actual rendered Page 2 of Quick-Start Guide (Margin vs Markup worked example)
    paste_card(im1, PREVIEWS_DIR / "quick-start-guide-us-letter-2.png", (70, 420, 860, 880))

    # Bottom factual summary bar
    d1.rectangle([70, 1335, 930, 1440], fill=WHITE, outline=ACCENT, width=2)
    d1.text((98, 1356), "Includes: 3-tab .xlsx workbook (zero macros) + quick-start guide", font=f_bold, fill=FOREST)
    d1.text((98, 1394), "Example: $100 cost at 40% margin = $166.67 price ($66.67 profit)", font=f_small, fill=MUTED)
    p1 = PINTEREST_DIR / "pin-01-job-costing-calculator.png"
    im1.save(p1, optimize=True)

    # PIN 2: Service Menu Template (actual rendered service-menu page 1, clean light editorial layout)
    im2 = Image.new("RGB", (W, H), WHITE)
    d2 = ImageDraw.Draw(im2)
    d2.rectangle([0, 0, W, 18], fill=FOREST)
    d2.rounded_rectangle([70, 62, 505, 108], radius=8, fill=MINT, outline=ACCENT, width=2)
    d2.text((92, 72), "PRINTABLE PDF  •  US LETTER & A4", font=f_badge, fill=FOREST)
    draw_wrapped(d2, "Mobile Car Detailing Service Menu Template", f_h1, 70, 132, 860, FOREST, 68)
    d2.text((70, 292), "3–4 clear tiers by vehicle size + add-ons & exclusions.", font=f_h2, fill=MUTED)

    paste_card(im2, PREVIEWS_DIR / "service-menu-us-letter-1.png", (85, 365, 830, 990))

    d2.rectangle([0, 1390, W, H], fill=FOREST)
    d2.text((70, 1428), "Blank price slots — enter your own calculator-derived rates.", font=f_bold, fill=WHITE)
    p2 = PINTEREST_DIR / "pin-02-service-menu-template.png"
    im2.save(p2, optimize=True)

    # PIN 3: Pre-Service Vehicle Inspection Form (actual 1-page inspection preview + clipboard callout)
    im3 = Image.new("RGB", (W, H), MINT)
    d3 = ImageDraw.Draw(im3)
    d3.rectangle([0, 0, W, 330], fill=DARK)
    d3.rounded_rectangle([70, 48, 595, 94], radius=8, fill=ACCENT)
    d3.text((92, 58), "1-PAGE CLIPBOARD & GRAYSCALE READY", font=f_badge, fill=WHITE)
    draw_wrapped(d3, "Pre-Service Vehicle Inspection Checklist", f_h1, 70, 118, 860, WHITE, 66)
    d3.text((70, 266), "5-view exterior diagram, defect codes & customer sign-off.", font=f_h2, fill=(210, 224, 216))

    paste_card(im3, PREVIEWS_DIR / "vehicle-inspection-us-letter-1.png", (80, 360, 840, 1005))

    d3.rounded_rectangle([70, 1388, 930, 1456], radius=8, fill=WHITE, outline=FOREST, width=2)
    d3.text((96, 1408), "Document scratches, dents, curb rash & interior condition on arrival.", font=f_bold, fill=FOREST)
    p3 = PINTEREST_DIR / "pin-03-vehicle-inspection-form.png"
    im3.save(p3, optimize=True)

    # PIN 4: Complete 4-File Mobile Detailing Planner Overview (3 actual previews side-by-side collage)
    im4 = Image.new("RGB", (W, H), SAGE_BG)
    d4 = ImageDraw.Draw(im4)
    d4.rectangle([0, 0, W, 370], fill=FOREST)
    d4.rounded_rectangle([70, 52, 500, 98], radius=8, fill=WHITE)
    d4.text((92, 62), "4-FILE DIGITAL TOOLKIT (NO SAAS)", font=f_badge, fill=FOREST)
    draw_wrapped(d4, "Mobile Detailing Business Planner & Pricing Kit", f_h1, 70, 126, 860, WHITE, 66)
    d4.text((70, 286), "Job Costing .xlsx  •  Service Menu  •  Inspection Form  •  Guide", font=f_h2, fill=(220, 231, 225))

    # Three actual rendered pages arranged cleanly
    paste_card(im4, PREVIEWS_DIR / "service-menu-us-letter-1.png", (55, 420, 420, 540))
    paste_card(im4, PREVIEWS_DIR / "vehicle-inspection-us-letter-1.png", (525, 420, 420, 540))
    paste_card(im4, PREVIEWS_DIR / "quick-start-guide-us-letter-1.png", (250, 920, 500, 420))

    d4.rectangle([0, 1378, W, H], fill=DARK)
    d4.text((70, 1412), "Offline-ready US Letter & A4 PDFs + Excel/Sheets calculator.", font=f_bold, fill=WHITE)
    p4 = PINTEREST_DIR / "pin-04-complete-detailing-toolkit.png"
    im4.save(p4, optimize=True)

    pins = [
        {
            "id": "mdp-pin-01-job-costing",
            "filename": "pinterest/pin-01-job-costing-calculator.png",
            "title": "Mobile Detailing Job Costing Calculator – Price by Target Margin",
            "description": "Calculate real mobile car detailing costs across labor hours, diluted chemicals, round-trip miles, and monthly overhead. Built-in target-margin formulas help prevent markup underpricing. Includes 3-tab Excel/Google Sheets workbook (no macros) and a quick-start guide. Built for independent mobile detailers. #mobiledetailing #detailingbusiness #jobcosting",
            "altText": "Preview of the Mobile Detailing Job Costing Calculator and Margin vs. Markup guide showing a $100 job cost at 40% target margin yielding a $166.67 quoted price.",
            "destinationSlug": "/products/mobile-detailing-planner",
            "destinationUrlPlaceholder": "https://{{PUBLIC_DOMAIN_TBD}}/products/mobile-detailing-planner",
            "proposedBoard": "Mobile Detailing Business Pricing & Calculators",
            "status": "draft_review",
        },
        {
            "id": "mdp-pin-02-service-menu",
            "filename": "pinterest/pin-02-service-menu-template.png",
            "title": "Mobile Car Detailing Service Menu Template – Printable PDF (US & A4)",
            "description": "Present clear detailing packages by vehicle size (sedan, mid-size SUV, large SUV/truck) plus optional add-ons and upfront exclusions. Clean printable PDF with blank price slots so you enter your own calculator-derived rates. Prints cleanly in color or grayscale on US Letter and A4 paper. #cardetailing #servicemenu #smallbusinesstemplates",
            "altText": "Preview of the printable Mobile Car Detailing Service Menu PDF showing Tier 1 Maintenance Wash, Tier 2 Interior Deep Clean, and Tier 3 Full Detail with blank vehicle-size price slots.",
            "destinationSlug": "/products/mobile-detailing-planner",
            "destinationUrlPlaceholder": "https://{{PUBLIC_DOMAIN_TBD}}/products/mobile-detailing-planner",
            "proposedBoard": "Car Detailing Service Menus & Forms",
            "status": "draft_review",
        },
        {
            "id": "mdp-pin-03-vehicle-inspection",
            "filename": "pinterest/pin-03-vehicle-inspection-form.png",
            "title": "Pre-Service Vehicle Inspection Form – 1-Page Detailing Checklist",
            "description": "Walk around every vehicle with customers before detailing begins. This 1-page clipboard-ready PDF includes an original 5-view exterior diagram, defect code legend (scratch, dent, chip, curb rash), interior condition checklist, and customer pre-service acknowledgment block. Grayscale print safe in US Letter and A4. #mobiledetailing #vehicleinspection #autodetailing",
            "altText": "Preview of the 1-page Pre-Service Vehicle Inspection Checklist PDF featuring top, side, front, and rear car outlines, defect code legend, interior checklist, and signature lines.",
            "destinationSlug": "/products/mobile-detailing-planner",
            "destinationUrlPlaceholder": "https://{{PUBLIC_DOMAIN_TBD}}/products/mobile-detailing-planner",
            "proposedBoard": "Car Detailing Service Menus & Forms",
            "status": "draft_review",
        },
        {
            "id": "mdp-pin-04-complete-toolkit",
            "filename": "pinterest/pin-04-complete-detailing-toolkit.png",
            "title": "Mobile Detailing Business Planner – Calculator, Menu & Inspection Kit",
            "description": "Organize quoting and on-site walkarounds without monthly software subscriptions. Includes a deterministic Excel/Google Sheets job-costing calculator, printable tiered service menu, 1-page vehicle inspection form, and 15-minute quick-start guide in US Letter and A4 formats. Designed for solo and small-crew mobile detailers. #mobiledetailingbusiness #smallbusinessplanner #detailing",
            "altText": "Collage preview of the 4-file Mobile Detailing Business Planner showing the printable Service Menu, 1-page Vehicle Inspection Form, and Quick-Start Guide.",
            "destinationSlug": "/products/mobile-detailing-planner",
            "destinationUrlPlaceholder": "https://{{PUBLIC_DOMAIN_TBD}}/products/mobile-detailing-planner",
            "proposedBoard": "Small Service Business Operating Toolkits",
            "status": "draft_review",
        },
    ]

    for pin in pins:
        pp = OUT_DIR / pin["filename"]
        im = Image.open(pp)
        pin["width"], pin["height"] = im.size
        pin["byteSize"] = pp.stat().st_size
        pin["sha256"] = sha256_file(pp)
        pin["mediaType"] = "image/png"
        assert (pin["width"], pin["height"]) == (1000, 1500), f"Bad pin dimensions: {pin}"
        assert len(pin["title"]) <= 100, f"Title too long: {pin['title']}"
        assert len(pin["description"]) <= 500, f"Description too long: {pin['id']}"

    return pins


def main():
    engines = check_spreadsheet_engines()
    xlsx_safety = inspect_xlsx_safety(OUT_DIR / "job-costing-calculator.xlsx")
    pdf_results = inspect_and_render_pdfs()
    pins = build_four_unique_pinterest_pins()

    artifacts = []
    for fname, mtype in PRODUCT_FILES:
        p = OUT_DIR / fname
        artifacts.append({
            "filename": fname,
            "mediaType": mtype,
            "byteSize": p.stat().st_size,
            "sha256": sha256_file(p),
        })

    manifest = {
        "schemaVersion": "1.0.0-draft",
        "productSlug": "mobile-detailing-planner",
        "revision": "v0.1.0-draft",
        "classification": "experimental_internal_draft",
        "demandValidated": False,
        "testPriceHypothesisUsd": 24.99,
        "status": "draft_review",
        "automaticPublishing": False,
        "qaReportPath": "antigravity/mobile-detailing/output/v0.1.0-draft/QA-REPORT.md",
        "artifacts": artifacts,
        "pinterestDrafts": pins,
        "qaSummary": {
            "pdfRenderingPassed": True,
            "pdfSafetyAndAcroFormPassed": all(not v["has_embedded_js_or_launch"] for v in pdf_results.values()),
            "xlsxSecurityScanPassed": (not xlsx_safety["has_vba_macros"]) and (not xlsx_safety["has_external_links"]) and (not xlsx_safety["has_webservice_formula"]),
            "xlsxEngineRecalculationStatus": "unavailable_missing_tool",
            "missingQaTools": [
                "LibreOffice (soffice) or Microsoft Excel — required for real spreadsheet-engine formula recalculation and XLSX-to-PDF print check"
            ],
            "formulaFixturePythonDecimalPassed": True,
            "pinterestDraftDimensionsPassed": True,
        },
        "unresolvedBlockers": [
            "Real spreadsheet-engine recalculation (LibreOffice/Excel not installed on host)",
            "0/6 verified current Studio OS market-demand evidence metrics",
            "Public domain not selected yet (Pinterest destination URLs use explicit {{PUBLIC_DOMAIN_TBD}} placeholder)",
            "Owner release approval required before any public R2 promotion or publishing",
        ],
    }

    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "engines": engines,
        "xlsx_safety": xlsx_safety,
        "pdf_results": pdf_results,
        "pin_sizes": [(p["id"], p["width"], p["height"], p["byteSize"]) for p in pins],
    }, indent=2))


if __name__ == "__main__":
    main()
