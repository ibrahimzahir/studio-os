# Live Public-Web Research Report — Digital Product Opportunities

- **Retrieved Date:** 2026-11-24
- **Method:** Permitted public web search (`search_web`) synthesized alongside `docs/BUYER-RESEARCH-2026-11-24.md`.
- **Honest Limitations:** Public search summaries and marketplace review patterns are **directional screening signals**, NOT verified monthly search volumes, seller revenue, or guaranteed conversion rates. No customer interviews, paid tests, or unauthorized scraping were conducted. Zero religious-holiday niches included.

---

## 1. Researched Opportunity Shortlist (Ranked by Evidence Signal)

| Priority (Hypothesis) | Opportunity | Audience | Key Observed Demand & Review Signals (2026-11-24) | Key Differentiation / Gap to Win | Evidence Status |
|---|---|---|---|---|---|
| **1 (Strongest signal)** | **Short-Term Rental Guest Welcome Book & Host Kit** | Independent Airbnb/VRBO & guesthouse hosts (US, Europe, UK, AU) | `docs/BUYER-RESEARCH-2026-11-24.md` observed **216 item reviews** (including 2026 comments) on an editable welcome book. Live search confirms strong demand for printable US Letter/A4 + digital/QR guest guides covering Wi-Fi, check-in/out, appliance how-tos, house rules, and local recommendations. | Clean, restraint-first editorial layout with zero clutter, clear appliance/checkout structure, and instant printable US Letter + A4 readiness without fighting bloated 60-page templates. | `needs_research` (strong comparative signal; own paid validation pending) |
| **2** | **Family Caregiver Emergency & Handoff Binder** | Adults coordinating aging-parent or senior care | `docs/BUYER-RESEARCH-2026-11-24.md` observed **109 item reviews** on a caregiver binder. Live search confirms physical "grab-and-go" ER/doctor binders (emergency contacts, medication log, respite handoff notes) solve real offline emergencies where phone apps fail. | Calm, high-legibility large-print layout that looks welcoming rather than clinical; strictly organizational (no medical advice). | `needs_research` (strong comparative signal; own paid validation pending) |
| **3** | **Reseller Profit, COGS & Inventory Tracker** | Multi-platform resellers (eBay, Poshmark, Mercari, Etsy) | Live search highlights reseller COGS/inventory/profit spreadsheets as a top-selling Etsy digital-download category. Buyers praise clean UI, dual Excel + Google Sheets compatibility, sample data, and step-by-step guides; complain about broken formulas and rigid layouts. | Deterministic zero-macro `.xlsx` with protected formulas, clear margin/COGS math, and user-entered fee/mileage fields (avoiding stale hardcoded tax laws). | `needs_research` (category signal; own paid validation pending) |
| **4 (Internal Pilot)** | **Mobile Detailing Planner** | Independent mobile car detailers | Internal pilot `v0.1.0-draft` built (7 files + 4 Pinterest pins). Sampled Etsy detailing listings (`$7.99`) had zero item reviews (`BUYER-RESEARCH-2026-11-24.md`), indicating competing low-price supply rather than validated demand. | Keep as internal engineering pilot until owner-authorized buyer interviews validate willingness to pay. | `needs_research` (weak signal; internal pilot only) |

---

## 2. Action Taken Automatically (Experimental Draft)

Based on **#1 (Short-Term Rental Guest Welcome Book & Host Kit)** showing the strongest public item-review and feature-completeness signal across both `BUYER-RESEARCH-2026-11-24.md` and today's live web search:
- Generated experimental draft PDF **`guest-welcome-book-us-letter.pdf`** and **`guest-welcome-book-a4.pdf`** (4 pages, US Letter + A4, rendered PNG previews, zero JS/launch actions) under `antigravity/str-welcome-guide/output/v0.1.0-draft/`.
- Populated researched opportunities directly into the local Studio OS database (removing manual opportunity entry burden from the owner) while preserving `status: "needs_research"` and `demandValidated: false` until owner approval.
