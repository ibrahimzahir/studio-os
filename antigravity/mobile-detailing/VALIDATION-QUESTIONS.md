# Validation Questions & Research Protocol — Mobile Detailing Planner

- **Status:** Preparation draft — **NO buyer interviews, surveys, or live public-source research have been conducted yet.**
- **Product slug:** `mobile-detailing-planner`
- **Date:** 2026-11-24
- **Owner authorization required before outreach:** Do **not** message mobile detailers, post in communities, or run paid research tools without explicit owner authorization.

---

## 1. Research Rules & Anti-Bias Guardrails

To comply with Studio OS evidence policy (`docs/MARKET.md`, `docs/ANTIGRAVITY-EXECUTION-FLOW.md`) and `standards/UI_UX_PSYCHOLOGY.md` (specifically guarding against **Survey Bias**, **Empathy Gap**, **Confirmation Bias**, and **Observer-Expectancy Effect**):

1. **Ask about past behavior, not hypothetical intent:** Ask *"How did you price your last three jobs?"* rather than *"Would you use a job costing spreadsheet?"*
2. **Never pitch before probing:** Do not describe our `$24.99` toolkit until after the interviewee has described their real workflow, costs, and current tools.
3. **Preserve exact provenance for any public research:** Every external finding entered into `EVIDENCE-REGISTER.md` must record exact URL, source/platform, observation date, retrieval date, verbatim supporting passage, direct observation vs. inference, confidence, and limitations. Use only permitted access.
4. **Zero fabricated metrics:** Never invent search volume, monthly sales, competitor revenue, trend/virality labels, or fake customer quotes.

---

## 2. Target Interviewee Screening Criteria

Aim for **5–10 independent mobile detailers** (owner-authorized outreach only):
- Operates a mobile detailing business (travels to customer locations) in the United States.
- Solo operator or 1–2 person crew (not a multi-bay fixed shop).
- Completed at least 5 paid jobs in the past 30 days.
- Currently does **not** use an enterprise shop-management suite (or recently churned from one due to cost/complexity).

---

## 3. Structured Buyer Interview Guide (20–30 Minutes)

### A. Context & Current Tools
1. How long have you been running your mobile detailing business, and how many vehicles do you typically detail in a week?
2. Walk me through every tool you used on your last paid job — from the customer's first inquiry to driving away (notes app, paper, Excel/Google Sheets, Canva, detailing app, text messages, invoices).
3. What do you currently pay per month (or one-time) for business templates, forms, or software? What have you tried and stopped using, and why?

### B. Job Costing — Labor, Chemicals, Fuel & Overhead
4. Think about the last job that took longer than expected. How did you decide what to charge for it?
5. Do you know how much you actually netted on that job after chemicals/pads/towels, fuel/generator/water, and your time? How did you calculate it (if at all)?
6. Which costs are hardest to track or most frequently forgotten when quoting a mobile job? (Probe: diluted chemical cost per vehicle, travel/drive time, vehicle wear/fuel, insurance, equipment depreciation, unpaid setup/teardown time.)
7. How do you handle pricing adjustments for vehicle size (sedan vs. 3-row SUV/truck) or extreme condition (pet hair, mud, smoke, oxidation)?

### C. Mobile Workflows — Service Menus & Vehicle Inspection
8. When a new prospect asks *"What do you charge?"*, what do you send them today? (Screenshot, text list, PDF menu, website, verbal quote?)
9. Have you ever had a customer expect something you considered an extra charge? How did that happen, and how do you prevent it now?
10. Before you start washing or polishing a customer's car, how do you record pre-existing scratches, dents, curb rash, interior stains, or personal belongings?
11. If you use a paper or digital inspection form on-site, what is annoying about it in real driveway conditions (glare, clipboard space, printer ink/grayscale legibility, writing room, wet hands)? If you don't use one, why not?

### D. Competitor Shortcomings (Templates, Spreadsheets & Apps)
12. Have you ever bought or downloaded a detailing pricing calculator, service menu template, or inspection form (from Etsy, Gumroad, YouTube creators, or detailing groups)?
13. If yes: what broke, felt confusing, or didn't match how mobile detailing actually works? What did you have to fix yourself?
14. If you tried a detailing SaaS app (e.g., Mobile Tech RX, Urable, Jobber, Square) and didn't keep it, what made you walk away?

### E. Willingness to Pay (Ask Only After Workflow Discovery)
15. *(Show concept scope: deterministic job-costing Excel/Sheets calculator + editable/printable service menu + grayscale-safe vehicle inspection checklist + 15-minute quick-start guide; no subscription.)* What is missing from this bundle that would make it genuinely useful to you, and what feels unnecessary?
16. What price would feel **so cheap** you'd question its quality? What price feels like a **fair one-time purchase**? What price feels **too expensive** for a template/spreadsheet kit? *(Van Westendorp framing — test `$24.99` without anchoring first.)*
17. Would you prefer editable PDFs, Canva links, Excel (`.xlsx`), Google Sheets, or printable blank PDFs? Which format is a dealbreaker if missing?

### F. Acquisition Channels & Discovery
18. When you look for detailing business advice, pricing help, or templates, where do you actually search first? (YouTube, Reddit `r/AutoDetailing` / detailing subs, Facebook groups, Instagram/TikTok, Google search, Etsy, forums?)
19. Who are 2–3 creators, podcasts, or communities you trust for the *business side* of mobile detailing?
20. What search phrase would you type if you wanted a pricing calculator or vehicle inspection sheet tonight?

---

## 4. Public-Source Desk Research Checklist (Permitted Access Only)

For Codex's market intelligence adapters or owner-authorized public desk research (every item must be logged in `EVIDENCE-REGISTER.md` with exact URL, retrieval date, and limitations):

1. **Competitor listing audit (marketplace demand & competitive opportunity):**
   - Collect 10–20 real mobile detailing template/spreadsheet/inspection-form listings across at least two platforms (e.g., Etsy, Gumroad, Creative Market, or detailing supply blogs).
   - Record listed price, included file formats, apparent target audience (mobile vs. fixed shop), and verbatim negative-review complaints (e.g., broken formulas, non-editable PDFs, generic copy, poor print layout).
2. **Community pain-point audit (purchase intent & social velocity):**
   - Inspect permitted public discussions (e.g., public detailing forums/subreddits, YouTube comment threads on mobile detailing pricing videos) for recurring, unsolicited questions about quoting, chemical cost per car, and pre-inspection liability/disputes.
   - Distinguish engagement (likes/views) from genuine purchase intent (explicit requests for a calculator/template or willingness to pay).
3. **Search demand check (search growth):**
   - Pending Codex's authorized search-demand adapter; do **not** manually estimate or invent monthly search volumes.

---

## 5. Validation Exit Criteria (What Would Support vs. Reject the Hypothesis)

- **Supports moving to Production Approval Gate:**
  - Studio OS evidence engine receives fresh (<=30 days) observations across all 6 metrics from >=2 declared platforms, meeting policy thresholds (`confidence >= 0.7`, `score >= 80`).
  - At least 3–5 interviewed mobile detailers confirm active pain in job costing and/or pre-service inspection documentation, and price sensitivity data supports `$19.99–$29.99` (or suggests a revised price/scope).
- **Suggests scope revision or rejection:**
  - Target buyers overwhelmingly rely on free tools or existing low-cost mobile apps and refuse one-time spreadsheet/PDF kits above `$10`.
  - Buyers require formats outside current scope (e.g., native mobile app or Canva-only templates) as a hard requirement.
  - Multi-platform evidence fails freshness, confidence, or demand thresholds.
