# Shared agent instructions
Read README.md, every docs/*.md file and CLAUDE.md before changes. Parent /Users/ibrahimzahir/development/AGENTS.md and standards/ENGINEERING_PLAYBOOK.md apply.
Use the established stack; no Supabase. Do not replace Next.js with a standalone HTML prototype.
Apply standards/UI_UX_PSYCHOLOGY.md across relevant surfaces; choose 2–4 principles per surface and verify real behavior. No deceptive urgency, fabricated proof or hidden costs.
Codex owns engineering, intelligence, integration, dashboard and CI/CD. Antigravity owns commercial content, PDFs, spreadsheets and product assets. Claude can continue either role from HANDOFF.md.
Never fabricate market evidence. Demo data must stay labeled and must never qualify production.
Keep approval and authorization server-side. Internal domain functions do not authenticate callers. No public deployment before Better Auth, scoped DAL, audit history and persistent approval controls exist.
Update docs/HANDOFF.md with actual changes, checks, blockers and next actions before stopping. Never report a queued command as passed.
No religious-holiday marketing. Ask before Islamic-themed content. No paid services, live infrastructure changes or publishing without explicit authorization.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Form presentation: short forms (such as opportunity capture) use centered shadcn dialogs; long or multi-step forms use dedicated routes/pages. Preserve validation, focus management and accessible labels.
