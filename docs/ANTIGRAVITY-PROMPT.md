# Antigravity handoff prompt

LATEST: Follow [ANTIGRAVITY-RELEASE-SPRINT.md](ANTIGRAVITY-RELEASE-SPRINT.md) next. It preserves completed preparation and authorizes the next internal draft/QA/marketing handoff queue. It takes precedence over the original preparation-only stop below; public release still needs owner review.

Start with [ANTIGRAVITY-EXECUTION-FLOW.md](ANTIGRAVITY-EXECUTION-FLOW.md). It defines the current ordered tasks, automatic continuation rules and approval gates. The context below remains applicable.

You are joining Studio OS — AI-Powered Digital Product Studio at /Users/ibrahimzahir/development/studio-os.

First read the parent development/AGENTS.md, standards/ENGINEERING_PLAYBOOK.md, standards/UI_UX_PSYCHOLOGY.md, then project AGENTS.md, README.md, CLAUDE.md and every Markdown file under docs/. Read HANDOFF.md again immediately before changing anything because Codex is actively developing the engineering platform.

Context: The original ChatGPT session proposed an orchestration ZIP but it was never extracted here. Codex is reconstructing the project from the recovered conversation, preserved in docs/RECOVERED-CONTEXT.md. Original HTML prototype and psychology-cheat-sheet.pdf are not available. The current Next.js dashboard is a reconstruction with labeled product hypotheses, not validated research. No products, sales, live research, private account connections or production approvals exist yet.

Responsibilities: Codex owns engineering, Next.js dashboard, Fastify/API, market intelligence and trend discovery, workflow automation, Antigravity integration, infrastructure and CI/CD. You own commercial product content, PDFs, spreadsheets, design assets and product acceptance reviews. Do not refactor app/, src/, tests/, package manifests, lockfiles or CI while Codex is working on them. Write your work under antigravity/ and report dependencies via docs/ANTIGRAVITY-HANDOFF.md. Claude can continue from the shared handoff later.

Technology constraints: Next.js/TypeScript, shadcn/ui, Framer Motion, Fastify, Zod, self-hosted PostgreSQL/Prisma, Better Auth, Redis/BullMQ, Cloudflare R2, existing Cloudflare and Hostinger VPS accounts, Docker Compose, Caddy, GitHub Actions, pnpm, Vitest and Playwright. No Supabase. GitHub repository: https://github.com/ibrahimzahir/studio-os.git. Never request or write secret values in source or documentation. Do not deploy, publish, spend money, modify live infrastructure or run paid APIs without owner authorization.

Your first task is PRODUCT PREPARATION, not approved commercial production:
1. Create antigravity/mobile-detailing/PRODUCT-BRIEF.md for the Mobile Detailing Planner hypothesis. Audience: independent mobile detailers; initial market hypothesis: US; test price $24.99, unvalidated. Proposed needs: job costing, service menus, vehicle inspection and operating organization. Distinguish proposed needs from customer-validated evidence.
2. Create VALIDATION-QUESTIONS.md covering buyer interviews, current tools, labor/chemical/fuel/overhead costs, mobile workflows, competitor shortcomings, willingness to pay and acquisition channels. Do not claim interviews or research occurred. If researching public sources, preserve exact URLs, retrieved dates, quoted evidence and limitations; only use permitted access. No invented search volume, sales, trend labels or revenue.
3. Create DELIVERABLE-SPEC.md proposing job-costing-calculator.xlsx, service-menu.pdf, vehicle-inspection.pdf and quick-start-guide.pdf. Specify purpose, inputs, outputs, editable fields, units, print sizes and testable acceptance criteria. Final scope needs owner review.
4. Create FORMULA-TEST-CASES.md. Define total cost as entered labor + materials + travel + allocated overhead; distinguish markup from margin; selling price for target margin = cost/(1-margin). Reject negative/nonfinite inputs and margins >=100%; handle zero revenue without division errors. Include hand-calculated expected values and rounding policy. Financial calculations are deterministic, not generated estimates disguised as facts.
5. Create DESIGN-BRIEF.md with a restrained premium design system. Apply 2–4 relevant UX psychology principles per surface: progressive disclosure, recognition over recall, visual hierarchy, feedforward and honest defaults. Prioritize usable forms, clear units, legibility, accessibility, grayscale printing, US Letter and A4. No fake urgency, proof, scarcity or guarantees. No religious-holiday products; ask before Islamic-themed content.
6. Create QA-CHECKLIST.md for page-by-page PDF rendering, clipping/overflow, typography, print margins, original/licensed assets and attribution, spreadsheet formula recalculation, boundary cases, no macros/external links or hidden executable content, and final owner approval.
7. Update docs/ANTIGRAVITY-HANDOFF.md with created files, decisions, assumptions, actual validation performed, unresolved questions and next steps. Do not overwrite Codex's HANDOFF.md; give it an entry it can merge.

Stop after the reviewable preparation documents. Do not generate final commercial assets or treat the hypothesis as a production-approved opportunity. Studio OS will require fresh evidence, owner production approval, artifact QA and a separate release approval. No supported automated Antigravity runner has been verified; use explicit file handoffs.

Deliver a concise report with links to the documents and any questions that materially block product preparation. Keep engineering and commercial work separate so both agents can progress safely.
