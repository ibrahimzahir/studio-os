#!/usr/bin/env python3
"""
Reproducible HTML+SVG -> PDF generator for Mobile Detailing Planner (US Letter & A4)
Uses installed Google Chrome headless (/Applications/Google Chrome.app/Contents/MacOS/Google Chrome).
Outputs under output/v0.1.0-draft/:
  - service-menu-us-letter.pdf, service-menu-a4.pdf (2 pages)
  - vehicle-inspection-us-letter.pdf, vehicle-inspection-a4.pdf (strictly 1 page)
  - quick-start-guide-us-letter.pdf, quick-start-guide-a4.pdf (3 pages)

Honest limitation: Chrome print-to-pdf generates crisp vector/printable PDFs without AcroForm
interactive widgets (recorded explicitly in QA-REPORT.md and manifest.json).
"""

import subprocess
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent
HTML_DIR = OUT_DIR / "src" / "html"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

VARIANTS = [
    ("us-letter", "8.5in 11in", "8.5in", "11in"),
    ("a4", "210mm 297mm", "210mm", "297mm"),
]

BASE_CSS = """
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #fff; color: #161B18; font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif; }
  .page {
    position: relative;
    width: var(--page-w);
    height: var(--page-h);
    padding: var(--pad-t, 0.55in) 0.55in 0.50in 0.55in;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
  }
  .page:last-child { page-break-after: auto; break-after: auto; }
  .header {
    background: #1B4332;
    color: #fff;
    padding: 13px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .header h1 { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: 19px; font-weight: 700; letter-spacing: 0.01em; }
  .header p { margin: 3px 0 0 0; font-size: 10px; color: #DCE7E1; }
  .badge {
    background: #2D6A4F;
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 5px 9px;
    border-radius: 3px;
    white-space: nowrap;
  }
  h2 {
    margin: 12px 0 7px 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #1B4332;
    border-bottom: 1.5px solid #1B4332;
    padding-bottom: 3px;
  }
  .muted { color: #4A5550; }
  .box { border: 1px solid #8A9A92; background: #fff; margin-bottom: 10px; }
  .subtle { background: #F4F7F5; }
  .input-slot {
    display: inline-block;
    background: #EAF2EE;
    border: 1px solid #6E8277;
    height: 19px;
    min-width: 72px;
    vertical-align: middle;
    padding: 2px 5px;
    font-size: 9.5px;
    color: #4A5550;
  }
  .footer {
    position: absolute;
    left: 0.55in;
    right: 0.55in;
    bottom: 0.34in;
    border-top: 0.8px solid #C7D1CC;
    padding-top: 5px;
    display: flex;
    justify-content: space-between;
    font-size: 8.5px;
    color: #4A5550;
  }
  table { width: 100%; border-collapse: collapse; font-size: 10px; font-variant-numeric: tabular-nums; }
  th, td { border: 1px solid #C7D1CC; padding: 5px 7px; text-align: left; }
  th { background: #F4F7F5; color: #1B4332; font-weight: 700; font-size: 9.5px; }
  ul { margin: 5px 0; padding-left: 16px; }
  li { margin-bottom: 4px; font-size: 10px; line-height: 1.38; }
"""


def wrap_html(page_css_size: str, pw: str, ph: str, body: str, extra_css: str = "") -> str:
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @page {{ size: {page_css_size}; margin: 0; }}
  :root {{ --page-w: {pw}; --page-h: {ph}; }}
  {BASE_CSS}
  {extra_css}
</style>
</head>
<body>
{body}
</body>
</html>
"""


def service_menu_html(page_css_size: str, pw: str, ph: str) -> str:
    extra = """
      .biz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px 14px; padding: 9px 12px; background: #F4F7F5; border: 1px solid #C7D1CC; margin-bottom: 10px; }
      .biz-field label { display: block; font-size: 8.5px; font-weight: 700; color: #4A5550; margin-bottom: 2px; }
      .biz-field .line { height: 17px; background: #EAF2EE; border: 1px solid #6E8277; }
      .tier { border: 1px solid #8A9A92; margin-bottom: 11px; }
      .tier-head { background: #F4F7F5; border-bottom: 1px solid #C7D1CC; padding: 6px 11px; display: flex; justify-content: space-between; align-items: center; }
      .tier-head .tname { font-family: Georgia, serif; font-size: 13px; font-weight: 700; color: #1B4332; }
      .tier-body { display: grid; grid-template-columns: 1.9fr 1fr; gap: 10px; padding: 8px 11px; }
      .tier-desc { font-size: 9.5px; font-style: italic; color: #4A5550; margin: 0 0 5px 0; }
      .price-col { border-left: 1px solid #C7D1CC; padding-left: 10px; }
      .price-col h3 { margin: 0 0 6px 0; font-size: 8.5px; color: #1B4332; letter-spacing: 0.05em; }
      .price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 9.5px; }
      .notes-box { border: 1px solid #6E8277; background: #EAF2EE; height: 54px; margin-top: 4px; }
    """

    def tier_card(name, desc, bullets):
        li = "".join(f"<li>{b}</li>" for b in bullets)
        return f"""
        <div class="tier">
          <div class="tier-head">
            <span class="tname">{name}</span>
            <span style="font-size:9px;color:#4A5550;">Est. Time: <span class="input-slot" style="min-width:58px;height:16px;">___ hrs</span></span>
          </div>
          <div class="tier-body">
            <div>
              <p class="tier-desc">{desc}</p>
              <ul>{li}</ul>
            </div>
            <div class="price-col">
              <h3>YOUR PRICE (USD)</h3>
              <div class="price-row"><span>Sedan / Coupe</span><span class="input-slot">$________</span></div>
              <div class="price-row"><span>Mid-Size SUV</span><span class="input-slot">$________</span></div>
              <div class="price-row"><span>Large SUV / Truck</span><span class="input-slot">$________</span></div>
            </div>
          </div>
        </div>
        """

    p1 = f"""
    <div class="page">
      <div class="header">
        <div>
          <h1>Mobile Detailing Service Menu</h1>
          <p>Clear tiered packages by vehicle size. Enter your own business details and calculator-derived prices.</p>
        </div>
        <div class="badge">PRINT &amp; DIGITAL MENU</div>
      </div>

      <div class="biz-grid">
        <div class="biz-field"><label>BUSINESS NAME</label><div class="line"></div></div>
        <div class="biz-field"><label>PHONE / SMS</label><div class="line"></div></div>
        <div class="biz-field"><label>EMAIL / WEBSITE</label><div class="line"></div></div>
        <div class="biz-field"><label>SERVICE AREA</label><div class="line"></div></div>
      </div>

      <h2>Core Detailing Packages (Transfer Rates from Job Costing Calculator)</h2>
      {tier_card("Tier 1 — Maintenance Wash & Refresh", "Ideal for well-maintained daily drivers needing regular upkeep.", [
          "Two-bucket pH-neutral hand wash & gentle microfiber dry",
          "Wheel faces, barrels, tires cleaned & satin dressing applied",
          "Exterior glass cleaned streak-free & door jambs wiped",
          "Quick interior vacuum (seats, carpets, mats) & dash dust-down",
      ])}
      {tier_card("Tier 2 — Interior Deep Clean", "Thorough cabin restoration for soiled upholstery, spills, and buildup.", [
          "Full vacuum including crevices, under seats, and trunk/cargo",
          "Deep scrub of dash, console, vents, cupholders, and door panels",
          "Fabric shampoo / extraction OR leather clean & matte conditioning",
          "Interior glass & mirrors cleaned; floor mats washed & dressed",
      ])}
      {tier_card("Tier 3 — Full Interior + Exterior Detail", "Complete inside-and-out restoration and durable paint protection.", [
          "Everything included in Tier 1 Maintenance Wash + Tier 2 Interior",
          "Iron fallout decontamination & clay-bar paint surface prep",
          "3–6 month spray sealant / synthetic wax application",
          "Exterior trim restoration & thorough final quality walkaround",
      ])}

      <div class="footer">
        <span>Prices are intentionally blank — calculate your own rates in job-costing-calculator.xlsx before sending.</span>
        <span>Page 1 of 2</span>
      </div>
    </div>
    """

    p2 = f"""
    <div class="page">
      <div class="header">
        <div>
          <h1>Add-On Services &amp; Service Expectations</h1>
          <p>Explicit scope boundaries prevent misunderstandings on arrival.</p>
        </div>
        <div class="badge">PAGE 2 OF 2</div>
      </div>

      <h2>Optional Tier 4 — Paint Enhancement &amp; Protection</h2>
      {tier_card("Tier 4 — Single-Stage Paint Enhancement", "For dull paintwork needing higher gloss and swirl reduction.", [
          "Full decon hand wash, iron remover, and clay-bar paint preparation",
          "Single-stage machine polish to boost gloss and reduce light swirls",
          "Panel wipe & durable polymer sealant or entry ceramic spray coating",
          "Final paint inspection under dedicated lighting",
      ])}

      <h2>Optional Add-On Services (Priced Separately)</h2>
      <table>
        <thead>
          <tr><th style="width:27%;">Add-On Service</th><th>Scope Description</th><th style="width:18%;text-align:right;">Your Price (USD)</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Pet Hair Removal</strong></td><td class="muted">Intensive rubber-brush &amp; vacuum extraction for embedded hair</td><td style="text-align:right;"><span class="input-slot">$________</span></td></tr>
          <tr><td><strong>Heavy Stain / Odor Extraction</strong></td><td class="muted">Targeted enzyme treatment &amp; hot-water extraction per area</td><td style="text-align:right;"><span class="input-slot">$________</span></td></tr>
          <tr><td><strong>Engine Bay Detail</strong></td><td class="muted">Gentle degrease, rinse protection, and non-greasy dressing</td><td style="text-align:right;"><span class="input-slot">$________</span></td></tr>
          <tr><td><strong>Headlight Restoration</strong></td><td class="muted">Multi-stage wet sand, polish, and UV sealant (pair)</td><td style="text-align:right;"><span class="input-slot">$________</span></td></tr>
          <tr><td><strong>Clay Bar &amp; Iron Decon</strong></td><td class="muted">Removes bonded brake dust and industrial fallout</td><td style="text-align:right;"><span class="input-slot">$________</span></td></tr>
          <tr><td><strong>Extreme Soil Surcharge</strong></td><td class="muted">Quoted on-site for heavy mud, sand, smoke, or neglect</td><td style="text-align:right;"><span class="input-slot">$________</span></td></tr>
        </tbody>
      </table>

      <h2>Service Expectations &amp; Exclusions</h2>
      <ul>
        <li><strong>On-Site Inspection:</strong> Final quote is confirmed after a brief pre-service walkaround of vehicle condition.</li>
        <li><strong>Personal Belongings:</strong> Please remove valuables, child seats, and loose items prior to appointment start.</li>
        <li><strong>Access &amp; Safety:</strong> Safe off-street parking or permitted driveway required; confirm water/power access when booking.</li>
        <li><strong>Exclusions:</strong> Biohazard cleanup, deep paint scratches through clear coat, and mechanical/body repairs are not included.</li>
        <li><strong>Taxes &amp; Payment:</strong> Enter your own payment methods and applicable local tax policy below.</li>
      </ul>

      <div style="margin-top:8px;">
        <div style="font-size:8.5px;font-weight:700;color:#4A5550;">YOUR BOOKING, CANCELLATION &amp; PAYMENT NOTES:</div>
        <div class="notes-box"></div>
      </div>

      <div class="footer">
        <span>Studio OS Mobile Detailing Planner (v0.1.0-draft) — Operational menu template; not legal or tax advice.</span>
        <span>Page 2 of 2</span>
      </div>
    </div>
    """
    return wrap_html(page_css_size, pw, ph, p1 + p2, extra)


ORIGINAL_CAR_SVG = """
<svg viewBox="0 0 680 182" width="100%" height="158" xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <rect x="1" y="1" width="678" height="180" fill="#FFFFFF" stroke="#8A9A92" stroke-width="1"/>
  <text x="10" y="16" font-family="Helvetica, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#1B4332">EXTERIOR CONDITION MAP — Mark defect codes directly on affected panels:</text>

  <!-- 1. TOP / ROOF VIEW -->
  <g transform="translate(18, 26)">
    <rect x="6" y="4" width="76" height="128" rx="18" ry="18" fill="#FFFFFF" stroke="#161B18" stroke-width="1.4"/>
    <rect x="16" y="34" width="56" height="64" rx="6" fill="none" stroke="#161B18" stroke-width="1"/>
    <line x1="16" y1="54" x2="72" y2="54" stroke="#161B18" stroke-width="0.9"/>
    <line x1="16" y1="80" x2="72" y2="80" stroke="#161B18" stroke-width="0.9"/>
    <line x1="18" y1="34" x2="14" y2="10" stroke="#161B18" stroke-width="0.8"/>
    <line x1="70" y1="34" x2="74" y2="10" stroke="#161B18" stroke-width="0.8"/>
    <rect x="0" y="38" width="6" height="11" rx="2" fill="#FFFFFF" stroke="#161B18" stroke-width="1"/>
    <rect x="82" y="38" width="6" height="11" rx="2" fill="#FFFFFF" stroke="#161B18" stroke-width="1"/>
    <text x="44" y="146" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="8.5" font-weight="700" fill="#4A5550">TOP / ROOF</text>
  </g>

  <!-- 2. LEFT / DRIVER SIDE -->
  <g transform="translate(128, 26)">
    <path d="M 8 44 L 8 28 L 44 23 L 70 6 L 138 6 L 166 22 L 190 26 L 190 44 Z" fill="#FFFFFF" stroke="#161B18" stroke-width="1.4"/>
    <line x1="50" y1="23" x2="162" y2="23" stroke="#161B18" stroke-width="0.9"/>
    <line x1="104" y1="6" x2="104" y2="44" stroke="#161B18" stroke-width="0.9"/>
    <circle cx="42" cy="44" r="12" fill="#FFFFFF" stroke="#161B18" stroke-width="1.4"/>
    <circle cx="42" cy="44" r="5.5" fill="none" stroke="#161B18" stroke-width="1"/>
    <circle cx="152" cy="44" r="12" fill="#FFFFFF" stroke="#161B18" stroke-width="1.4"/>
    <circle cx="152" cy="44" r="5.5" fill="none" stroke="#161B18" stroke-width="1"/>
    <text x="99" y="68" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="8.5" font-weight="700" fill="#4A5550">LEFT / DRIVER SIDE</text>
  </g>

  <!-- 3. RIGHT / PASSENGER SIDE -->
  <g transform="translate(128, 102)">
    <path d="M 6 44 L 6 26 L 30 22 L 58 6 L 126 6 L 152 23 L 188 28 L 188 44 Z" fill="#FFFFFF" stroke="#161B18" stroke-width="1.4"/>
    <line x1="34" y1="23" x2="146" y2="23" stroke="#161B18" stroke-width="0.9"/>
    <line x1="92" y1="6" x2="92" y2="44" stroke="#161B18" stroke-width="0.9"/>
    <circle cx="44" cy="44" r="12" fill="#FFFFFF" stroke="#161B18" stroke-width="1.4"/>
    <circle cx="44" cy="44" r="5.5" fill="none" stroke="#161B18" stroke-width="1"/>
    <circle cx="154" cy="44" r="12" fill="#FFFFFF" stroke="#161B18" stroke-width="1.4"/>
    <circle cx="154" cy="44" r="5.5" fill="none" stroke="#161B18" stroke-width="1"/>
    <text x="99" y="68" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="8.5" font-weight="700" fill="#4A5550">RIGHT / PASSENGER SIDE</text>
  </g>

  <!-- 4. FRONT VIEW -->
  <g transform="translate(345, 26)">
    <path d="M 10 22 L 20 6 L 82 6 L 92 22 Z" fill="#FFFFFF" stroke="#161B18" stroke-width="1.3"/>
    <rect x="2" y="22" width="98" height="24" rx="5" fill="#FFFFFF" stroke="#161B18" stroke-width="1.4"/>
    <rect x="8" y="27" width="18" height="8" fill="none" stroke="#161B18" stroke-width="1"/>
    <rect x="76" y="27" width="18" height="8" fill="none" stroke="#161B18" stroke-width="1"/>
    <rect x="31" y="29" width="40" height="11" fill="none" stroke="#161B18" stroke-width="1"/>
    <rect x="8" y="46" width="15" height="8" fill="#161B18"/>
    <rect x="79" y="46" width="15" height="8" fill="#161B18"/>
    <text x="51" y="68" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="8.5" font-weight="700" fill="#4A5550">FRONT</text>
  </g>

  <!-- 5. REAR VIEW -->
  <g transform="translate(345, 102)">
    <path d="M 10 22 L 20 6 L 82 6 L 92 22 Z" fill="#FFFFFF" stroke="#161B18" stroke-width="1.3"/>
    <rect x="2" y="22" width="98" height="24" rx="5" fill="#FFFFFF" stroke="#161B18" stroke-width="1.4"/>
    <rect x="8" y="26" width="20" height="8" fill="none" stroke="#161B18" stroke-width="1"/>
    <rect x="74" y="26" width="20" height="8" fill="none" stroke="#161B18" stroke-width="1"/>
    <rect x="35" y="30" width="32" height="10" fill="none" stroke="#161B18" stroke-width="1"/>
    <rect x="8" y="46" width="15" height="8" fill="#161B18"/>
    <rect x="79" y="46" width="15" height="8" fill="#161B18"/>
    <text x="51" y="68" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="8.5" font-weight="700" fill="#4A5550">REAR</text>
  </g>

  <!-- DEFECT LEGEND -->
  <g transform="translate(472, 24)">
    <rect x="0" y="0" width="194" height="146" fill="#F4F7F5" stroke="#C7D1CC" stroke-width="1"/>
    <text x="10" y="18" font-family="Helvetica, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#1B4332">DEFECT CODE LEGEND</text>
    <text x="10" y="37" font-family="Helvetica, Arial, sans-serif" font-size="9.5" fill="#161B18"><tspan font-weight="700" fill="#1B4332">S</tspan>   — Scratch / Scuff</text>
    <text x="10" y="54" font-family="Helvetica, Arial, sans-serif" font-size="9.5" fill="#161B18"><tspan font-weight="700" fill="#1B4332">D</tspan>   — Dent / Ding</text>
    <text x="10" y="71" font-family="Helvetica, Arial, sans-serif" font-size="9.5" fill="#161B18"><tspan font-weight="700" fill="#1B4332">C</tspan>   — Paint Chip</text>
    <text x="10" y="88" font-family="Helvetica, Arial, sans-serif" font-size="9.5" fill="#161B18"><tspan font-weight="700" fill="#1B4332">R</tspan>   — Rust / Oxidation</text>
    <text x="10" y="105" font-family="Helvetica, Arial, sans-serif" font-size="9.5" fill="#161B18"><tspan font-weight="700" fill="#1B4332">CR</tspan> — Curb Rash (Wheel)</text>
    <text x="10" y="122" font-family="Helvetica, Arial, sans-serif" font-size="9.5" fill="#161B18"><tspan font-weight="700" fill="#1B4332">G</tspan>   — Glass Chip / Crack</text>
    <text x="10" y="139" font-family="Helvetica, Arial, sans-serif" font-size="9.5" fill="#161B18"><tspan font-weight="700" fill="#1B4332">M</tspan>   — Missing Trim / Emblem</text>
  </g>
</svg>
"""


def vehicle_inspection_html(page_css_size: str, pw: str, ph: str) -> str:
    extra = """
      .page { --pad-t: 0.78in; padding-bottom: 0.42in; }
      .header { padding: 10px 14px; margin-bottom: 8px; }
      .header h1 { font-size: 16.5px; }
      .info-grid { display: grid; grid-template-columns: 2fr 1.2fr 1.1fr 0.8fr; gap: 6px 10px; padding: 7px 10px; background: #F4F7F5; border: 1px solid #C7D1CC; margin-bottom: 8px; }
      .f label { display: block; font-size: 7.8px; font-weight: 700; color: #4A5550; margin-bottom: 2px; }
      .f .box-in { height: 16px; background: #EAF2EE; border: 1px solid #6E8277; }
      .split { display: grid; grid-template-columns: 1.45fr 1fr; gap: 12px; margin-top: 8px; }
      .cb { display: inline-block; width: 13px; height: 13px; border: 1.3px solid #161B18; background: #fff; vertical-align: middle; }
      .insp-tbl td, .insp-tbl th { padding: 3.5px 6px; font-size: 9.2px; }
      .insp-tbl td.c { text-align: center; width: 42px; }
      .chk-item { display: flex; align-items: center; gap: 7px; font-size: 9.2px; margin-bottom: 6px; }
      .scope-f { margin-bottom: 6px; }
      .scope-f label { display: block; font-size: 7.8px; font-weight: 700; color: #4A5550; margin-bottom: 2px; }
      .scope-f .box-in { height: 17px; background: #EAF2EE; border: 1px solid #6E8277; }
      .write-line { border-bottom: 0.9px solid #8A9A92; height: 22px; }
      .ack { background: #F4F7F5; border: 1.2px solid #1B4332; padding: 8px 11px; margin-top: 10px; }
      .ack p { margin: 2px 0 18px 0; font-size: 8.8px; color: #161B18; }
      .sig-row { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; }
      .sig-line { border-top: 1px solid #161B18; padding-top: 3px; font-size: 8px; color: #4A5550; }
    """

    zones = [
        "Seats &amp; Upholstery",
        "Carpets &amp; Floor Mats",
        "Dashboard &amp; Console",
        "Door Panels &amp; Trim",
        "Headliner &amp; Visors",
        "Trunk / Cargo Area",
        "Pet Hair / Odor / Smoke",
        "Dash Warning Lights",
    ]
    zrows = "".join(
        f'<tr><td>{z}</td><td class="c"><span class="cb"></span></td><td class="c"><span class="cb"></span></td><td class="c"><span class="cb"></span></td></tr>'
        for z in zones
    )

    body = f"""
    <div class="page">
      <div class="header">
        <div>
          <h1>Pre-Service Vehicle Inspection &amp; Walkaround Form</h1>
          <p>Complete together with customer before starting service. Clipboard &amp; grayscale print ready (0.78 in top clip margin).</p>
        </div>
        <div class="badge">1-PAGE CHECKLIST</div>
      </div>

      <div class="info-grid">
        <div class="f"><label>CUSTOMER NAME</label><div class="box-in"></div></div>
        <div class="f"><label>PHONE</label><div class="box-in"></div></div>
        <div class="f"><label>DATE / TIME</label><div class="box-in"></div></div>
        <div class="f"><label>JOB #</label><div class="box-in"></div></div>
        <div class="f"><label>VEHICLE YEAR / MAKE / MODEL</label><div class="box-in"></div></div>
        <div class="f"><label>COLOR</label><div class="box-in"></div></div>
        <div class="f"><label>PLATE / LAST 6 VIN</label><div class="box-in"></div></div>
        <div class="f"><label>ODOMETER</label><div class="box-in"></div></div>
      </div>

      {ORIGINAL_CAR_SVG}

      <div class="split">
        <div>
          <h2 style="margin-top:4px;">Interior Condition Check</h2>
          <table class="insp-tbl">
            <thead><tr><th>Interior Zone</th><th class="c">Good</th><th class="c">Issue</th><th class="c">N/A</th></tr></thead>
            <tbody>{zrows}</tbody>
          </table>
        </div>
        <div>
          <h2 style="margin-top:4px;">Access, Items &amp; Agreed Scope</h2>
          <div class="chk-item"><span class="cb"></span><span>Valuables removed by customer</span></div>
          <div class="chk-item"><span class="cb"></span><span>Child seat(s) present (noted)</span></div>
          <div class="chk-item"><span class="cb"></span><span>Water &amp; power confirmed / self-contained</span></div>
          <div class="chk-item"><span class="cb"></span><span>Pre-existing photos taken (optional)</span></div>
          <div class="scope-f" style="margin-top:8px;"><label>AGREED SERVICE PACKAGE</label><div class="box-in"></div></div>
          <div class="scope-f"><label>APPROVED ADD-ONS</label><div class="box-in"></div></div>
          <div class="scope-f"><label>CONFIRMED QUOTE (USD)</label><div class="box-in" style="width:65%;"></div></div>
        </div>
      </div>

      <h2 style="margin-top:10px;">Pre-Existing Defects &amp; Special Notes (Handwriting Space)</h2>
      <div class="write-line"></div>
      <div class="write-line"></div>
      <div class="write-line"></div>
      <div class="write-line"></div>

      <div class="ack">
        <div style="font-size:8.8px;font-weight:700;color:#1B4332;">CUSTOMER PRE-SERVICE ACKNOWLEDGMENT</div>
        <p>I have reviewed the vehicle condition and pre-existing items noted above with the detailer and confirm the agreed service scope and price.</p>
        <div class="sig-row">
          <div class="sig-line">Customer Signature / Initials</div>
          <div class="sig-line">Detailer Initials</div>
          <div class="sig-line">Date / Time</div>
        </div>
      </div>

      <div class="footer">
        <span>Operational inspection record only — not legal advice or a jurisdiction-specific liability waiver. (v0.1.0-draft)</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
    """
    return wrap_html(page_css_size, pw, ph, body, extra)


def quick_start_guide_html(page_css_size: str, pw: str, ph: str) -> str:
    extra = """
      .step-card { background: #F4F7F5; border: 1px solid #2D6A4F; border-left: 4px solid #1B4332; padding: 10px 14px; margin-bottom: 12px; }
      .step-card h3 { margin: 0 0 4px 0; font-family: Georgia, serif; font-size: 13px; color: #1B4332; }
      .step-card p { margin: 0; font-size: 10.2px; line-height: 1.45; }
      .formula-box { background: #F4F7F5; border: 1.2px solid #1B4332; padding: 11px 14px; margin-bottom: 14px; font-variant-numeric: tabular-nums; }
      .formula-box .eq { font-weight: 700; color: #1B4332; font-size: 11px; margin-bottom: 5px; }
      .compare { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 12px 0 16px 0; }
      .cmp-good { background: #EAF2EE; border: 1.4px solid #1B4332; padding: 12px 14px; }
      .cmp-bad { background: #FFFFFF; border: 1.2px solid #8A9A92; padding: 12px 14px; }
      .cmp-good h3 { margin: 0 0 8px 0; font-size: 11.5px; color: #1B4332; }
      .cmp-bad h3 { margin: 0 0 8px 0; font-size: 11.5px; color: #9B1C1C; }
      .kv { display: flex; justify-content: space-between; font-size: 10px; padding: 3.5px 0; border-bottom: 0.6px solid #C7D1CC; font-variant-numeric: tabular-nums; }
      .kv:last-child { border-bottom: none; }
      p.body-p { font-size: 10.2px; line-height: 1.48; margin: 4px 0 10px 0; }
    """

    p1 = """
    <div class="page">
      <div class="header">
        <div>
          <h1>Mobile Detailing Planner — Quick-Start Guide</h1>
          <p>Set up your real job costs, service menu, and walkaround checklist in ~15 minutes.</p>
        </div>
        <div class="badge">QUICK START</div>
      </div>

      <h2>1. What Is Included in Your Toolkit</h2>
      <table>
        <thead><tr><th style="width:32%;">File</th><th>Purpose &amp; Format</th></tr></thead>
        <tbody>
          <tr><td><strong>job-costing-calculator.xlsx</strong></td><td>Deterministic 3-tab Excel / LibreOffice / Google Sheets workbook (zero macros, zero external links).</td></tr>
          <tr><td><strong>service-menu.pdf</strong></td><td>Clean 2-page tiered service menu (US Letter &amp; A4) with blank vehicle-size price slots and explicit exclusions.</td></tr>
          <tr><td><strong>vehicle-inspection.pdf</strong></td><td>1-page clipboard-ready pre-service walkaround checklist with original 5-view car outline &amp; customer sign-off.</td></tr>
          <tr><td><strong>quick-start-guide.pdf</strong></td><td>This 3-page setup guide, worked margin-vs-markup math example, and print tips.</td></tr>
        </tbody>
      </table>

      <h2>2. Your 15-Minute Setup Sequence (3 Steps)</h2>
      <div class="step-card">
        <h3>Step 1 — Enter Your Real Baseline Costs (7 minutes)</h3>
        <p>Open <strong>job-costing-calculator.xlsx</strong>. Edit ONLY the shaded <strong>[INPUT]</strong> cells: your hourly labor rate, chemical/consumable cost per job (or use Tab 02 for bottle dilutions), round-trip miles &amp; per-mile vehicle rate, and fixed monthly overhead divided by expected monthly jobs.</p>
      </div>
      <div class="step-card">
        <h3>Step 2 — Set Your Service Menu Prices (5 minutes)</h3>
        <p>Use Tab 03 (<strong>03_Package_Matrix</strong>) to test target profit margins across your 3–4 service tiers and vehicle sizes (Sedan, Mid-Size SUV, Large SUV/Truck). Copy your resulting quoted prices onto <strong>service-menu.pdf</strong>.</p>
      </div>
      <div class="step-card">
        <h3>Step 3 — Print Clipboard Inspection Sheets (3 minutes)</h3>
        <p>Print 10–20 copies of <strong>vehicle-inspection.pdf</strong> (US Letter or A4, 100% / Actual Size, grayscale OK). Keep them on a clipboard in your vehicle and complete a 3-minute walkaround with every customer before touching the paint.</p>
      </div>

      <h2>3. Upfront Scope Boundaries (Feedforward)</h2>
      <ul>
        <li><strong>Deterministic math only:</strong> Every price is calculated strictly from numbers you enter — never guessed averages.</li>
        <li><strong>No tax or legal advice:</strong> Excludes sales tax, income tax, and jurisdiction-specific liability waivers.</li>
        <li><strong>No guaranteed income:</strong> This toolkit organizes pricing and on-site documentation; results depend on your local market and execution.</li>
      </ul>

      <div class="footer">
        <span>Studio OS Mobile Detailing Planner (v0.1.0-draft) — Quick-Start Guide</span>
        <span>Page 1 of 3</span>
      </div>
    </div>
    """

    p2 = """
    <div class="page">
      <div class="header">
        <div>
          <h1>Worked Pricing Example: Margin vs. Markup</h1>
          <p>Why confusing margin and markup quietly underprices mobile detailing jobs.</p>
        </div>
        <div class="badge">PAGE 2 OF 3</div>
      </div>

      <h2>The Core Formula Used in job-costing-calculator.xlsx</h2>
      <div class="formula-box">
        <div class="eq">Total Cost = (Hours × Hourly Rate) + Materials + (Miles × Rate/Mile) + Allocated Overhead</div>
        <div class="eq">Target Selling Price = Total Cost ÷ (1 − Target Margin)</div>
        <div class="muted" style="font-size:9.5px;">Quoted Price rounds to the nearest cent ($0.01). Profit = Quoted Price − Total Cost.</div>
      </div>

      <h2>Canonical Worked Example: $100.00 Total Job Cost at 40% Target</h2>
      <p class="body-p">Suppose a job's real cost is <strong>$100.00</strong> ($50.00 labor + $20.00 chemicals + $10.00 travel + $20.00 overhead) and you want a <strong>40% profit margin</strong>:</p>

      <div class="compare">
        <div class="cmp-good">
          <h3>CORRECT: 40% Target Margin</h3>
          <div class="kv"><span>Formula</span><strong>$100.00 ÷ (1 − 0.40)</strong></div>
          <div class="kv"><span>Unrounded Target Price</span><span>$166.6666...</span></div>
          <div class="kv"><span>Rounded Quoted Price</span><strong>$166.67</strong></div>
          <div class="kv"><span>Dollar Profit</span><strong>$66.67</strong></div>
          <div class="kv"><span>Actual Profit Margin</span><strong>40.00%</strong></div>
          <div class="kv"><span>Equivalent Markup</span><span>66.67%</span></div>
        </div>
        <div class="cmp-bad">
          <h3>COMMON MISTAKE: 40% Markup</h3>
          <div class="kv"><span>Formula</span><strong>$100.00 × (1 + 0.40)</strong></div>
          <div class="kv"><span>Quoted Price</span><strong>$140.00</strong></div>
          <div class="kv"><span>Dollar Profit</span><strong>$40.00</strong></div>
          <div class="kv"><span>Actual Profit Margin</span><strong style="color:#9B1C1C;">28.57%</strong></div>
          <div class="kv"><span>Shortfall vs. 40% Margin</span><strong style="color:#9B1C1C;">−$26.67 / job</strong></div>
          <div class="kv"><span>Impact</span><span>Underprices every quote</span></div>
        </div>
      </div>

      <h2>Rounding &amp; Boundary-Case Behavior</h2>
      <ul>
        <li><strong>Intermediate precision:</strong> Labor and travel stay unrounded until Total Cost is summed, avoiding compounding penny drift on fractional hours or miles.</li>
        <li><strong>Nearest-cent quoting:</strong> Recommended Quoted Price uses standard half-away-from-zero rounding to $0.01; Projected Profit uses that rounded quoted price.</li>
        <li><strong>Zero-revenue / comped jobs:</strong> Entering $0.00 as an Actual Selling Price shows exact negative profit and <code>N/A (Zero Revenue)</code> for margin — never a <code>#DIV/0!</code> error.</li>
        <li><strong>Invalid input protection:</strong> Negative numbers, non-numeric entries, or target margins of 100% or higher trigger an explicit <code>ERR:</code> message.</li>
      </ul>

      <div class="footer">
        <span>Canonical math matches FORMULA-TEST-CASES.md (TC-01).</span>
        <span>Page 2 of 3</span>
      </div>
    </div>
    """

    p3 = """
    <div class="page">
      <div class="header">
        <div>
          <h1>Job-Day Workflow, Printing &amp; Troubleshooting</h1>
          <p>Practical habits for driveway walkarounds, grayscale printing, and spreadsheet use.</p>
        </div>
        <div class="badge">PAGE 3 OF 3</div>
      </div>

      <h2>1. Repeatable Job-Day Routine</h2>
      <ul>
        <li><strong>Before Driving:</strong> Confirm address, vehicle size tier, and water/power availability; keep blank <em>vehicle-inspection.pdf</em> sheets on a clipboard.</li>
        <li><strong>On Arrival (3–5 minutes):</strong> Walk around the vehicle with the customer. Mark pre-existing scratches, dents, chips, curb rash, stains, or pet hair on the 5-view diagram; confirm final price and collect initials.</li>
        <li><strong>After Heavy Jobs (2 minutes):</strong> Enter actual hours and extra chemical use into <em>01_Job_Calculator</em> with your quoted price in the Override cell to verify your real margin.</li>
      </ul>

      <h2>2. Printing &amp; Paper-Size Settings</h2>
      <ul>
        <li><strong>Match your paper size:</strong> Use <code>*-us-letter.pdf</code> for US Letter (8.5 × 11 in) or <code>*-a4.pdf</code> for A4 (210 × 297 mm).</li>
        <li><strong>Scale to 100%:</strong> Choose <em>Actual Size</em> / <em>100%</em> in your print dialog so checkboxes and the 0.78 in clipboard top margin stay accurate.</li>
        <li><strong>Grayscale-safe design:</strong> All forms print cleanly in black-and-white / grayscale with zero heavy dark ink backgrounds.</li>
      </ul>

      <h2>3. Spreadsheet Compatibility &amp; Troubleshooting</h2>
      <ul>
        <li><strong>Supported apps:</strong> Microsoft Excel, LibreOffice Calc, and Google Sheets (<em>File → Import → Upload .xlsx</em>).</li>
        <li><strong>Entering percentages:</strong> Enter <code>40%</code> (or <code>0.40</code>) for Target Profit Margin. Entering <code>100%</code> or higher displays an <code>ERR:</code> banner because 100% margin is mathematically undefined for positive cost.</li>
        <li><strong>Protected formula cells:</strong> Sheets use light, password-free protection to prevent accidental formula overwrites. You may unprotect any sheet in Excel/Calc to customize layout.</li>
        <li><strong>Security hygiene:</strong> Zero VBA macros, zero external workbook links, and zero network calls.</li>
      </ul>

      <div class="footer">
        <span>Studio OS Mobile Detailing Planner (v0.1.0-draft) — Internal experimental draft; not legal, tax, or financial advice.</span>
        <span>Page 3 of 3</span>
      </div>
    </div>
    """
    return wrap_html(page_css_size, pw, ph, p1 + p2 + p3, extra)


def render_pdf(html_path: Path, pdf_path: Path):
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        html_path.as_uri(),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def main():
    HTML_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    builders = [
        ("service-menu", service_menu_html),
        ("vehicle-inspection", vehicle_inspection_html),
        ("quick-start-guide", quick_start_guide_html),
    ]
    for suffix, css_size, pw, ph in VARIANTS:
        for base, fn in builders:
            html_file = HTML_DIR / f"{base}-{suffix}.html"
            pdf_file = OUT_DIR / f"{base}-{suffix}.pdf"
            html_file.write_text(fn(css_size, pw, ph), encoding="utf-8")
            render_pdf(html_file, pdf_file)
            print(f"WROTE: {pdf_file.name} ({pdf_file.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
