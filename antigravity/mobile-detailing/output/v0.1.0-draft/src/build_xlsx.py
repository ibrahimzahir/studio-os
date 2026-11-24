#!/usr/bin/env python3
"""
Reproducible generator for Mobile Detailing Planner — job-costing-calculator.xlsx
Revision: v0.1.0-draft (internal experimental prototype — NOT validated commercial release)
Standards:
  - DESIGN-BRIEF.md: Forest green (#1B4332), muted forest (#2D6A4F), input tint (#EAF2EE),
    grayscale-safe borders, explicit units in every label.
  - FORMULA-TEST-CASES.md: Deterministic Excel formulas only (no macros, no external links),
    rejects negative/non-numeric inputs and margins outside [0%, 100%), zero-revenue safe.
"""

from pathlib import Path
import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Protection, Side
from openpyxl.utils import get_column_letter

OUT_DIR = Path(__file__).resolve().parent.parent
OUT_FILE = OUT_DIR / "job-costing-calculator.xlsx"

# Palette tokens (DESIGN-BRIEF.md)
FOREST_PRIMARY = "1B4332"
FOREST_ACCENT = "2D6A4F"
SURFACE_SUBTLE = "F4F7F5"
SURFACE_INPUT = "EAF2EE"
TEXT_PRIMARY = "161B18"
TEXT_MUTED = "4A5550"
BORDER_COLOR = "8A9A92"
BORDER_LIGHT = "C7D1CC"
WHITE = "FFFFFF"
ERROR_RED = "9B1C1C"

FONT_FAMILY = "Calibri"

thin_border_side = Side(style="thin", color=BORDER_LIGHT)
input_border_side = Side(style="medium", color=FOREST_ACCENT)
header_bottom_side = Side(style="medium", color=FOREST_PRIMARY)

BORDER_CELL = Border(
    left=thin_border_side, right=thin_border_side,
    top=thin_border_side, bottom=thin_border_side,
)
BORDER_INPUT = Border(
    left=input_border_side, right=input_border_side,
    top=input_border_side, bottom=input_border_side,
)
BORDER_TOTAL = Border(
    top=Side(style="thin", color=FOREST_PRIMARY),
    bottom=Side(style="double", color=FOREST_PRIMARY),
    left=thin_border_side, right=thin_border_side,
)

FILL_HEADER = PatternFill("solid", fgColor=FOREST_PRIMARY)
FILL_SECTION = PatternFill("solid", fgColor=FOREST_ACCENT)
FILL_SUBTLE = PatternFill("solid", fgColor=SURFACE_SUBTLE)
FILL_INPUT = PatternFill("solid", fgColor=SURFACE_INPUT)
FILL_WHITE = PatternFill("solid", fgColor=WHITE)

FONT_TITLE = Font(name=FONT_FAMILY, size=15, bold=True, color=WHITE)
FONT_SUBTITLE = Font(name=FONT_FAMILY, size=9, italic=True, color="DCE7E1")
FONT_SECTION = Font(name=FONT_FAMILY, size=10, bold=True, color=WHITE)
FONT_LABEL = Font(name=FONT_FAMILY, size=10, bold=False, color=TEXT_PRIMARY)
FONT_LABEL_BOLD = Font(name=FONT_FAMILY, size=10, bold=True, color=TEXT_PRIMARY)
FONT_INPUT = Font(name=FONT_FAMILY, size=10, bold=True, color=FOREST_PRIMARY)
FONT_OUTPUT = Font(name=FONT_FAMILY, size=10, bold=False, color=TEXT_PRIMARY)
FONT_OUTPUT_BOLD = Font(name=FONT_FAMILY, size=11, bold=True, color=FOREST_PRIMARY)
FONT_HINT = Font(name=FONT_FAMILY, size=9, italic=True, color=TEXT_MUTED)
FONT_DISCLAIMER = Font(name=FONT_FAMILY, size=8, italic=True, color=TEXT_MUTED)

FMT_USD = "$#,##0.00;-$#,##0.00;$0.00"
FMT_PCT = "0.0%"
FMT_PCT2 = "0.00%"
FMT_DEC = "0.00"
FMT_INT = "#,##0"


def style_banner(ws, max_col: int, title: str, subtitle: str):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=max_col)
    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=max_col)
    c1 = ws.cell(1, 1, title)
    c1.font = FONT_TITLE
    c1.fill = FILL_HEADER
    c1.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    c2 = ws.cell(2, 1, subtitle)
    c2.font = FONT_SUBTITLE
    c2.fill = FILL_HEADER
    c2.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    for col in range(1, max_col + 1):
        ws.cell(1, col).fill = FILL_HEADER
        ws.cell(2, col).fill = FILL_HEADER
    ws.row_dimensions[1].height = 28
    ws.row_dimensions[2].height = 18


def style_section(ws, row: int, start_col: int, end_col: int, text: str):
    ws.merge_cells(start_row=row, start_column=start_col, end_row=row, end_column=end_col)
    cell = ws.cell(row, start_col, text)
    cell.font = FONT_SECTION
    cell.fill = FILL_SECTION
    cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    for col in range(start_col, end_col + 1):
        ws.cell(row, col).fill = FILL_SECTION
    ws.row_dimensions[row].height = 21


def build_sheet_job_calculator(wb: openpyxl.Workbook):
    ws = wb.active
    ws.title = "01_Job_Calculator"
    ws.views.sheetView[0].showGridLines = True

    style_banner(
        ws, 6,
        "MOBILE DETAILING JOB COSTING CALCULATOR (v0.1.0-draft)",
        "Deterministic cost buildup & target-margin pricing. Shaded bordered cells [INPUT] are editable; white/gray cells are formulas.",
    )

    # Legend row
    ws.merge_cells("A3:F3")
    ws["A3"] = "Legend:  [INPUT] = Shaded bordered cell (editable)   |   All monetary units in USD ($)   |   Excludes sales/income tax (not tax advice)."
    ws["A3"].font = FONT_HINT
    ws["A3"].fill = FILL_SUBTLE
    ws["A3"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[3].height = 18

    # Section A: Inputs (Cols A-C) and Section B: Outputs (Cols D-F) side-by-side for 1-page landscape print
    style_section(ws, 5, 1, 3, "A. JOB INPUTS [EDITABLE]")
    style_section(ws, 5, 4, 6, "B. DETERMINISTIC COST & PRICING OUTPUTS [FORMULAS]")

    # Column headers row 6
    headers = [
        (1, "Input Field & Unit"), (2, "Value [INPUT]"), (3, "Guidance / Source"),
        (4, "Output Metric & Unit"), (5, "Calculated Result"), (6, "Formula Notes"),
    ]
    for col, text in headers:
        c = ws.cell(6, col, text)
        c.font = FONT_LABEL_BOLD
        c.fill = FILL_SUBTLE
        c.border = BORDER_CELL
        c.alignment = Alignment(horizontal="left" if col in (1, 3, 4, 6) else "right", vertical="center")
    ws.row_dimensions[6].height = 20

    # Canonical TC-01 example preloaded so user sees live deterministic math immediately ($100 @ 40% -> $166.67)
    inputs = [
        # row, label, value, num_fmt, hint
        (7,  "Job / Package Label", "Sample: Full Interior + Exterior (Sedan)", "@", "Optional label for this quote"),
        (8,  "Labor Hours (hrs)", 2.0, FMT_DEC, "Total billable + setup/teardown hours (>= 0)"),
        (9,  "Hourly Labor Rate (USD/hr)", 25.00, FMT_USD, "Your target wage or crew hourly rate (>= 0)"),
        (10, "Materials & Chemicals Cost (USD)", 20.00, FMT_USD, "Direct entry or link ='02_Materials_Overhead'!E14"),
        (11, "Round-Trip Travel Distance (miles)", 20.0, FMT_DEC, "Total miles to & from job site (>= 0)"),
        (12, "Travel Cost Rate (USD/mile)", 0.50, FMT_USD, "User-entered vehicle/fuel rate (not IRS advice)"),
        (13, "Allocated Fixed Overhead (USD/job)", 20.00, FMT_USD, "Direct entry or link ='02_Materials_Overhead'!C25"),
        (14, "Target Profit Margin (%)", 0.40, FMT_PCT, "Enter 0% to <100% (e.g., 40% = 0.40)"),
        (15, "Actual / Override Selling Price (USD)", "", FMT_USD, "Optional: leave blank to use Recommended Price"),
    ]

    for row, label, val, fmt, hint in inputs:
        ws.row_dimensions[row].height = 21
        c_lbl = ws.cell(row, 1, label)
        c_lbl.font = FONT_LABEL
        c_lbl.border = BORDER_CELL
        c_lbl.alignment = Alignment(horizontal="left", vertical="center")

        c_val = ws.cell(row, 2, val)
        c_val.font = FONT_INPUT
        c_val.fill = FILL_INPUT
        c_val.border = BORDER_INPUT
        c_val.number_format = fmt
        c_val.alignment = Alignment(horizontal="left" if fmt == "@" else "right", vertical="center")
        c_val.protection = Protection(locked=False)

        c_hint = ws.cell(row, 3, hint)
        c_hint.font = FONT_HINT
        c_hint.border = BORDER_CELL
        c_hint.alignment = Alignment(horizontal="left", vertical="center")

    # Reusable Excel validation condition strings:
    # Numeric check on B8:B14 and optional B15 (blank allowed; if non-blank must be number >= 0)
    non_num_cond = (
        'OR(NOT(ISNUMBER(B8)),NOT(ISNUMBER(B9)),NOT(ISNUMBER(B10)),'
        'NOT(ISNUMBER(B11)),NOT(ISNUMBER(B12)),NOT(ISNUMBER(B13)),'
        'NOT(ISNUMBER(B14)),AND(B15<>"",NOT(ISNUMBER(B15))))'
    )
    neg_cond = 'OR(B8<0,B9<0,B10<0,B11<0,B12<0,B13<0,AND(B15<>"",B15<0))'
    margin_cond = 'OR(B14<0,B14>=1)'

    status_formula = (
        f'=IF({non_num_cond},"ERR: Invalid number",'
        f'IF({neg_cond},"ERR: Negative input",'
        f'IF({margin_cond},"ERR: Margin must be 0% to <100%",'
        f'IF(AND(B15<>"",B15<E11),"OK (Loss Warning: Price < Cost)","OK"))))'
    )

    def guarded(expr: str) -> str:
        return (
            f'=IF({non_num_cond},"ERR: Invalid number",'
            f'IF({neg_cond},"ERR: Negative input",'
            f'IF({margin_cond},"ERR: Margin must be 0% to <100%",{expr})))'
        )

    # Effective selling price = IF(B15="", E13, B15) where E13 is Recommended Quoted Price (rounded)
    outputs = [
        (7,  "Validation Status", status_formula, "@", "Checks non-numeric, negative, and margin bounds", True),
        (8,  "Labor Cost (USD)", guarded("B8*B9"), FMT_USD, "Labor Hours x Hourly Rate", False),
        (9,  "Travel Cost (USD)", guarded("B11*B12"), FMT_USD, "Round-Trip Miles x Cost/Mile", False),
        (10, "Materials + Overhead (USD)", guarded("B10+B13"), FMT_USD, "Entered Materials + Allocated Overhead", False),
        (11, "Total Job Cost (USD)", guarded("B8*B9+B10+B11*B12+B13"), FMT_USD, "Labor + Materials + Travel + Overhead", True),
        (12, "Target Selling Price — Unrounded (USD)", guarded("(B8*B9+B10+B11*B12+B13)/(1-B14)"), FMT_USD, "Total Cost / (1 - Target Margin)", False),
        (13, "Recommended Quoted Price — Rounded (USD)", guarded("ROUND((B8*B9+B10+B11*B12+B13)/(1-B14),2)"), FMT_USD, "ROUND(Target Price, 2) to nearest cent", True),
        (14, "Projected Profit (USD)", guarded('ROUND(IF(B15="",ROUND((B8*B9+B10+B11*B12+B13)/(1-B14),2),B15)-(B8*B9+B10+B11*B12+B13),2)'), FMT_USD, "Effective Selling Price - Total Job Cost", True),
        (15, "Actual Profit Margin (%)", guarded('IF(IF(B15="",ROUND((B8*B9+B10+B11*B12+B13)/(1-B14),2),B15)=0,"N/A (Zero Revenue)",(IF(B15="",ROUND((B8*B9+B10+B11*B12+B13)/(1-B14),2),B15)-(B8*B9+B10+B11*B12+B13))/IF(B15="",ROUND((B8*B9+B10+B11*B12+B13)/(1-B14),2),B15))'), FMT_PCT2, "Profit / Selling Price (safe at $0 revenue)", True),
        (16, "Actual Markup (%)", guarded('IF((B8*B9+B10+B11*B12+B13)=0,"N/A (Zero Cost)",(IF(B15="",ROUND((B8*B9+B10+B11*B12+B13)/(1-B14),2),B15)-(B8*B9+B10+B11*B12+B13))/(B8*B9+B10+B11*B12+B13))'), FMT_PCT2, "Profit / Total Cost (distinct from Margin!)", False),
    ]

    for row, label, formula, fmt, note, is_bold in outputs:
        ws.row_dimensions[row].height = max(ws.row_dimensions[row].height or 21, 21)
        c_lbl = ws.cell(row, 4, label)
        c_lbl.font = FONT_LABEL_BOLD if is_bold else FONT_LABEL
        c_lbl.fill = FILL_SUBTLE if is_bold else FILL_WHITE
        c_lbl.border = BORDER_TOTAL if row in (11, 13) else BORDER_CELL
        c_lbl.alignment = Alignment(horizontal="left", vertical="center")

        c_val = ws.cell(row, 5, formula)
        c_val.font = FONT_OUTPUT_BOLD if is_bold else FONT_OUTPUT
        c_val.fill = FILL_SUBTLE if is_bold else FILL_WHITE
        c_val.border = BORDER_TOTAL if row in (11, 13) else BORDER_CELL
        c_val.number_format = fmt
        c_val.alignment = Alignment(horizontal="right" if fmt != "@" else "center", vertical="center")

        c_note = ws.cell(row, 6, note)
        c_note.font = FONT_HINT
        c_note.border = BORDER_CELL
        c_note.alignment = Alignment(horizontal="left", vertical="center")

    # Margin vs Markup educational callout (Feedforward)
    style_section(ws, 18, 1, 6, "C. MARGIN VS. MARKUP CHECK (PREVENT UNDERPRICING)")
    ws.merge_cells("A19:F19")
    ws["A19"] = (
        "Why Margin != Markup:  At $100.00 cost and 40% target MARGIN, Price = $100 / (1 - 0.40) = $166.67 ($66.67 profit, 66.67% markup). "
        "Adding a 40% MARKUP instead gives $140.00 ($40.00 profit, only 28.6% margin — underpricing by $26.67)."
    )
    ws["A19"].font = FONT_HINT
    ws["A19"].fill = FILL_SUBTLE
    ws["A19"].alignment = Alignment(horizontal="left", vertical="center", wrap_text=True, indent=1)
    ws.row_dimensions[19].height = 30

    ws.merge_cells("A21:F21")
    ws["A21"] = (
        "Disclaimer: Deterministic calculation aid based solely on your entered values. Excludes sales tax, income tax, payment-processing fees, and tips. "
        "Not accounting, tax, or legal advice. Experimental internal draft (v0.1.0-draft)."
    )
    ws["A21"].font = FONT_DISCLAIMER
    ws["A21"].alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ws.row_dimensions[21].height = 24

    # Column widths
    widths = {1: 34, 2: 20, 3: 36, 4: 36, 5: 20, 6: 36}
    for col, w in widths.items():
        ws.column_dimensions[get_column_letter(col)].width = w

    # Print setup: 1 page landscape
    ws.page_setup.orientation = ws.ORIENTATION_LANDSCAPE
    ws.page_setup.paperSize = ws.PAPERSIZE_LETTER
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 1
    ws.protection.sheet = True
    ws.protection.enable()


def build_sheet_materials_overhead(wb: openpyxl.Workbook):
    ws = wb.create_sheet("02_Materials_Overhead")
    style_banner(
        ws, 5,
        "OPTIONAL HELPER: CHEMICALS & MONTHLY OVERHEAD ALLOCATOR",
        "Progressive disclosure: use this sheet to estimate per-job chemical cost and fixed overhead, then reference totals on 01_Job_Calculator.",
    )

    style_section(ws, 4, 1, 5, "1. CHEMICALS & CONSUMABLES PER JOB (ENTER YOUR OWN COSTS)")
    for col, text in enumerate(["Item Name", "Bottle / Pack Cost (USD)", "Est. Jobs per Bottle", "Cost per Job (USD)", "Notes"], 1):
        c = ws.cell(5, col, text)
        c.font = FONT_LABEL_BOLD
        c.fill = FILL_SUBTLE
        c.border = BORDER_CELL
    ws.row_dimensions[5].height = 20

    sample_chems = [
        ("pH-Neutral Car Wash Soap (1 gal)", 32.00, 64, "Sample dilution"),
        ("All-Purpose Interior Cleaner (1 gal)", 24.00, 40, "Diluted 10:1"),
        ("Wheel & Tire Cleaner (1 gal)", 28.00, 35, "Per 4-wheel set"),
        ("Spray Sealant / Wax (16 oz)", 22.00, 15, "Exterior protection"),
        ("Glass Cleaner & Towels Wear", 18.00, 30, "Microfiber replacement share"),
        ("Interior Dressing / Protectant", 20.00, 40, "Dash & door panels"),
        ("Custom Item 7", 0.00, 1, "Optional"),
        ("Custom Item 8", 0.00, 1, "Optional"),
    ]
    for idx, (name, cost, uses, note) in enumerate(sample_chems, start=6):
        ws.row_dimensions[idx].height = 20
        c1 = ws.cell(idx, 1, name)
        c1.font = FONT_LABEL
        c1.border = BORDER_CELL
        c1.protection = Protection(locked=False)

        c2 = ws.cell(idx, 2, cost)
        c2.font = FONT_INPUT
        c2.fill = FILL_INPUT
        c2.border = BORDER_INPUT
        c2.number_format = FMT_USD
        c2.protection = Protection(locked=False)

        c3 = ws.cell(idx, 3, uses)
        c3.font = FONT_INPUT
        c3.fill = FILL_INPUT
        c3.border = BORDER_INPUT
        c3.number_format = FMT_INT
        c3.protection = Protection(locked=False)

        c4 = ws.cell(idx, 4, f'=IF(OR(NOT(ISNUMBER(B{idx})),NOT(ISNUMBER(C{idx}))),"ERR: Invalid number",IF(B{idx}<0,"ERR: Negative input",IF(C{idx}<=0,"ERR: Uses must be > 0",B{idx}/C{idx})))')
        c4.font = FONT_OUTPUT
        c4.border = BORDER_CELL
        c4.number_format = FMT_USD

        c5 = ws.cell(idx, 5, note)
        c5.font = FONT_HINT
        c5.border = BORDER_CELL
        c5.protection = Protection(locked=False)

    # Total Materials row 14
    ws.row_dimensions[14].height = 22
    ws.cell(14, 1, "Total Estimated Materials per Job (USD)").font = FONT_LABEL_BOLD
    ws.cell(14, 1).fill = FILL_SUBTLE
    ws.cell(14, 1).border = BORDER_TOTAL
    for col in (2, 3, 5):
        ws.cell(14, col).fill = FILL_SUBTLE
        ws.cell(14, col).border = BORDER_TOTAL
    c_tot = ws.cell(14, 4, "=SUM(D6:D13)")
    c_tot.font = FONT_OUTPUT_BOLD
    c_tot.fill = FILL_SUBTLE
    c_tot.border = BORDER_TOTAL
    c_tot.number_format = FMT_USD
    ws.cell(14, 5, "Link this cell (D14) to 01_Job_Calculator!B10 if desired").font = FONT_HINT

    # Monthly Overhead Allocator
    style_section(ws, 16, 1, 5, "2. MONTHLY FIXED OVERHEAD ALLOCATOR")
    for col, text in enumerate(["Monthly Fixed Expense", "Monthly Cost (USD)", "Notes", "", ""], 1):
        c = ws.cell(17, col, text)
        c.font = FONT_LABEL_BOLD
        c.fill = FILL_SUBTLE
        c.border = BORDER_CELL

    overheads = [
        ("Business / Garagekeepers Insurance", 150.00, "Monthly premium"),
        ("Van / Truck Fixed Payment & Registration", 350.00, "Fixed vehicle cost"),
        ("Equipment Depreciation (Washer, Vac, Generator)", 120.00, "Replacement reserve"),
        ("Phone, Booking & Website Hosting", 80.00, "Monthly subscriptions"),
        ("Water, Generator Maintenance & Storage", 100.00, "Non-job-specific supplies"),
        ("Marketing & Print Supplies", 100.00, "Business cards, flyers, pins"),
    ]
    for idx, (label, val, note) in enumerate(overheads, start=18):
        ws.row_dimensions[idx].height = 20
        ws.cell(idx, 1, label).font = FONT_LABEL
        ws.cell(idx, 1).border = BORDER_CELL
        c2 = ws.cell(idx, 2, val)
        c2.font = FONT_INPUT
        c2.fill = FILL_INPUT
        c2.border = BORDER_INPUT
        c2.number_format = FMT_USD
        c2.protection = Protection(locked=False)
        ws.cell(idx, 3, note).font = FONT_HINT
        ws.cell(idx, 3).border = BORDER_CELL

    ws.row_dimensions[24].height = 21
    ws.cell(24, 1, "Expected Billable Jobs per Month (count > 0)").font = FONT_LABEL_BOLD
    ws.cell(24, 1).border = BORDER_CELL
    c_jobs = ws.cell(24, 2, 40)
    c_jobs.font = FONT_INPUT
    c_jobs.fill = FILL_INPUT
    c_jobs.border = BORDER_INPUT
    c_jobs.number_format = FMT_INT
    c_jobs.protection = Protection(locked=False)
    ws.cell(24, 3, "Must be > 0 (rejects 0 or negative)").font = FONT_HINT
    ws.cell(24, 3).border = BORDER_CELL

    ws.row_dimensions[25].height = 22
    ws.cell(25, 1, "Total Monthly Overhead (USD)").font = FONT_LABEL_BOLD
    ws.cell(25, 1).fill = FILL_SUBTLE
    ws.cell(25, 1).border = BORDER_CELL
    c_mo = ws.cell(25, 2, '=IF(COUNTIF(B18:B23,"<0")>0,"ERR: Negative input",SUM(B18:B23))')
    c_mo.font = FONT_OUTPUT_BOLD
    c_mo.fill = FILL_SUBTLE
    c_mo.border = BORDER_CELL
    c_mo.number_format = FMT_USD

    ws.row_dimensions[26].height = 23
    ws.cell(26, 1, "Allocated Overhead per Job (USD/job)").font = FONT_LABEL_BOLD
    ws.cell(26, 1).fill = FILL_SUBTLE
    ws.cell(26, 1).border = BORDER_TOTAL
    c_per = ws.cell(26, 2, '=IF(OR(NOT(ISNUMBER(B24)),COUNTIF(B18:B23,"<0")>0),"ERR: Invalid number",IF(B24<=0,"ERR: Jobs/month must be > 0",SUM(B18:B23)/B24))')
    c_per.font = FONT_OUTPUT_BOLD
    c_per.fill = FILL_SUBTLE
    c_per.border = BORDER_TOTAL
    c_per.number_format = FMT_USD
    ws.cell(26, 3, "Reference B26 on 01_Job_Calculator!B13 ($900/40 = $22.50)").font = FONT_HINT
    ws.cell(26, 3).fill = FILL_SUBTLE
    ws.cell(26, 3).border = BORDER_TOTAL

    widths = {1: 42, 2: 22, 3: 36, 4: 22, 5: 36}
    for col, w in widths.items():
        ws.column_dimensions[get_column_letter(col)].width = w

    ws.page_setup.orientation = ws.ORIENTATION_LANDSCAPE
    ws.page_setup.paperSize = ws.PAPERSIZE_LETTER
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 1
    ws.protection.sheet = True
    ws.protection.enable()


def build_sheet_package_matrix(wb: openpyxl.Workbook):
    ws = wb.create_sheet("03_Package_Matrix")
    style_banner(
        ws, 11,
        "SERVICE PACKAGE PRICING MATRIX (COPY TO SERVICE-MENU.PDF)",
        "Compare up to 4 service tiers across vehicle sizes using identical deterministic cost and target-margin formulas.",
    )

    cols = [
        "Package & Vehicle Size", "Hours (hrs)", "Hourly Rate ($)", "Materials ($)",
        "Miles (mi)", "Rate/Mile ($)", "Overhead ($)", "Target Margin (%)",
        "Total Cost ($)", "Quoted Price ($)", "Profit ($)",
    ]
    for col, text in enumerate(cols, 1):
        c = ws.cell(4, col, text)
        c.font = FONT_SECTION
        c.fill = FILL_SECTION
        c.border = BORDER_CELL
        c.alignment = Alignment(horizontal="center" if col > 1 else "left", vertical="center", wrap_text=True)
    ws.row_dimensions[4].height = 28

    rows_data = [
        ("Tier 1: Maintenance Wash — Sedan", 1.25, 30.00, 10.00, 15.0, 0.65, 20.00, 0.40),
        ("Tier 1: Maintenance Wash — Mid-Size SUV", 1.50, 30.00, 12.00, 15.0, 0.65, 20.00, 0.40),
        ("Tier 1: Maintenance Wash — Large SUV/Truck", 1.75, 30.00, 15.00, 15.0, 0.65, 20.00, 0.40),
        ("Tier 2: Interior Deep Clean — Sedan", 2.50, 32.00, 16.00, 15.0, 0.65, 22.50, 0.40),
        ("Tier 2: Interior Deep Clean — Mid-Size SUV", 3.00, 32.00, 20.00, 15.0, 0.65, 22.50, 0.40),
        ("Tier 2: Interior Deep Clean — Large SUV/Truck", 3.75, 32.00, 24.00, 15.0, 0.65, 22.50, 0.40),
        ("Tier 3: Full Detail — Sedan", 3.50, 35.00, 22.00, 15.0, 0.65, 22.50, 0.45),
        ("Tier 3: Full Detail — Mid-Size SUV", 4.25, 35.00, 26.00, 15.0, 0.65, 22.50, 0.45),
        ("Tier 3: Full Detail — Large SUV/Truck", 5.00, 35.00, 32.00, 15.0, 0.65, 22.50, 0.45),
        ("Tier 4: Paint Enhancement — Sedan", 5.00, 40.00, 35.00, 15.0, 0.65, 25.00, 0.45),
        ("Tier 4: Paint Enhancement — Mid-Size SUV", 6.00, 40.00, 42.00, 15.0, 0.65, 25.00, 0.45),
        ("Tier 4: Paint Enhancement — Large SUV/Truck", 7.00, 40.00, 50.00, 15.0, 0.65, 25.00, 0.45),
    ]

    fmts = [None, "@", FMT_DEC, FMT_USD, FMT_USD, FMT_DEC, FMT_USD, FMT_USD, FMT_PCT]
    for idx, row_vals in enumerate(rows_data, start=5):
        ws.row_dimensions[idx].height = 20
        for col, val in enumerate(row_vals, 1):
            c = ws.cell(idx, col, val)
            c.border = BORDER_CELL if col == 1 else BORDER_INPUT
            c.fill = FILL_WHITE if col == 1 else FILL_INPUT
            c.font = FONT_LABEL if col == 1 else FONT_INPUT
            c.number_format = fmts[col]
            c.protection = Protection(locked=False)

        chk = f'OR(NOT(ISNUMBER(B{idx})),NOT(ISNUMBER(C{idx})),NOT(ISNUMBER(D{idx})),NOT(ISNUMBER(E{idx})),NOT(ISNUMBER(F{idx})),NOT(ISNUMBER(G{idx})),NOT(ISNUMBER(H{idx})))'
        neg = f'OR(B{idx}<0,C{idx}<0,D{idx}<0,E{idx}<0,F{idx}<0,G{idx}<0)'
        mrg = f'OR(H{idx}<0,H{idx}>=1)'
        cost_expr = f'B{idx}*C{idx}+D{idx}+E{idx}*F{idx}+G{idx}'

        c_cost = ws.cell(idx, 9, f'=IF({chk},"ERR: Invalid number",IF({neg},"ERR: Negative input",IF({mrg},"ERR: Margin must be 0% to <100%",{cost_expr})))')
        c_cost.font = FONT_OUTPUT
        c_cost.border = BORDER_CELL
        c_cost.number_format = FMT_USD

        c_price = ws.cell(idx, 10, f'=IF({chk},"ERR: Invalid number",IF({neg},"ERR: Negative input",IF({mrg},"ERR: Margin must be 0% to <100%",ROUND(({cost_expr})/(1-H{idx}),2))))')
        c_price.font = FONT_OUTPUT_BOLD
        c_price.fill = FILL_SUBTLE
        c_price.border = BORDER_CELL
        c_price.number_format = FMT_USD

        c_prof = ws.cell(idx, 11, f'=IF({chk},"ERR: Invalid number",IF({neg},"ERR: Negative input",IF({mrg},"ERR: Margin must be 0% to <100%",ROUND(J{idx}-I{idx},2))))')
        c_prof.font = FONT_OUTPUT
        c_prof.border = BORDER_CELL
        c_prof.number_format = FMT_USD

    widths = {1: 38, 2: 11, 3: 13, 4: 13, 5: 11, 6: 12, 7: 13, 8: 14, 9: 14, 10: 15, 11: 14}
    for col, w in widths.items():
        ws.column_dimensions[get_column_letter(col)].width = w

    ws.page_setup.orientation = ws.ORIENTATION_LANDSCAPE
    ws.page_setup.paperSize = ws.PAPERSIZE_LETTER
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 1
    ws.protection.sheet = True
    ws.protection.enable()


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    wb = openpyxl.Workbook()
    build_sheet_job_calculator(wb)
    build_sheet_materials_overhead(wb)
    build_sheet_package_matrix(wb)
    wb.save(OUT_FILE)
    print(f"WROTE: {OUT_FILE} ({OUT_FILE.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
