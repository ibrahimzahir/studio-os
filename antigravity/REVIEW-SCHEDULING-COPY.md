# Review, Approval & Scheduling UI Microcopy — Studio OS

- **Status:** Draft UI copy specification for Codex's Studio OS dashboard (`shadcn/ui` Base UI)
- **Updated:** 2026-11-24
- **UX Psychology applied (`standards/UI_UX_PSYCHOLOGY.md`):**
  - **Cognitive Load & Minimalism:** Concise primary-screen labels; technical details disclosed progressively.
  - **Feedforward & Honest Defaults:** Always state exact consequences before an action; publication stays **OFF** by default.
  - **Feedback Loop:** Clearly distinguish queued/scheduled items from live/published items — never imply a scheduled RSS item is already posted on Pinterest.

---

## 1. Pipeline & Content State Microcopy

| State | Badge Label | One-Line Status Description (UI Subtitle / Tooltip) |
|---|---|---|
| `draft` | **Draft** | Private internal draft. Not visible publicly and not eligible for RSS or storefront release. |
| `review` | **Awaiting Review** | Draft assets and QA results are ready. Human release approval is required before scheduling or public promotion. |
| `approved` | **Approved** | Approved for the current content hash. Ready to assign a schedule slot and promote approved public assets. |
| `scheduled` | **Scheduled** | Queued for RSS feed eligibility at its scheduled slot. Public visibility begins only when due and all eligibility checks pass. |
| `published` | **Published** | Live in the public RSS feed and SSR landing page. Published Pin `id`, `link`, and `publishAt` are locked to prevent duplicate pins. |
| `failed` | **Failed** | Generation, QA, or promotion stopped due to an error or budget limit. Inspect the error log before retrying. |

---

## 2. Human Review Action Copy (Mandatory Release Gate)

### Action Buttons
- **Approve for Release** (Primary — disabled if required QA failed or is missing)
  - *Confirmation modal title:* `Approve this revision for scheduling?`
  - *Confirmation body:* `This records your approval for revision {{revision}} (content hash {{shortHash}}). Approving does NOT automatically publish or spend ad budget; public release still requires a valid schedule slot, approved public image, and live SSR landing URL.`
  - *Checkbox / Honest default:* `[ ] Confirm I reviewed the rendered previews, QA report, and unresolved limitations.` (Unchecked by default; no confirmshaming.)
- **Request Revision** (Secondary)
  - *Prompt label:* `What needs to change before re-review?`
  - *Helper text:* `Returns this item to Draft status and logs your note for the next revision cycle. Current files remain private.`
- **Reject** (Destructive / Outline)
  - *Confirmation title:* `Reject this draft?`
  - *Confirmation body:* `Marks this revision as rejected and keeps all files private in draft storage. You can archive or start a fresh revision later.`

---

## 3. Cost & Telemetry Summary Microcopy

- **When measured telemetry exists:**
  - `Run cost: ${{measuredCostUsd}} · {{totalTokens}} tokens ({{tierBreakdown}}) · Cap: ${{maxRunCostUsd}}`
- **When telemetry is unavailable (honest fallback):**
  - `Run cost: Not measured (local/manual session) · Direct paid API spend: $0.00`
- **Budget stop banner (`failed` due to budget):**
  - `Run paused: Daily or per-run budget cap (${{maxRunCostUsd}}) reached. No additional paid calls were made.`

---

## 4. Pinterest Feed & Scheduling Guardrail Microcopy

- **Pin Feed Eligibility Checklist (shown before scheduling):**
  - `A Pin enters the public RSS feed only when all 4 checks pass:`
    1. `Human-approved content (bound to current hash)`
    2. `Scheduled slot is due (publishAt <= now)`
    3. `Approved unique 1000×1500 image promoted to public R2`
    4. `Live, crawlable SSR product landing URL returning HTTP 200`
- **RSS Timing Honesty Notice (always visible near the 4-slot daily schedule):**
  - `Four daily RSS slots control when Studio OS exposes approved Pins in the feed. Pinterest ingests RSS feeds on its own schedule (up to 24 hours), so RSS visibility does not guarantee exact-minute posting on Pinterest.`
- **Published Pin Immutability Warning (shown on `published` items):**
  - `Locked after publish: Do not edit this Pin's ID, destination link, or publishAt timestamp. Changing them creates a new RSS GUID and causes duplicate pins.`
- **Single-Channel Delivery Guardrail:**
  - `Delivery mode: RSS Feed Only. Never send the same Pin through both RSS auto-publish and a direct Pinterest API publisher.`
- **Placeholder Domain Blocker (current state until owner provides production domain):**
  - `Scheduling blocked: Public domain not configured yet. Drafts use {{PUBLIC_DOMAIN_TBD}} and cannot enter the public RSS feed until a live SSR landing URL is verified.`
