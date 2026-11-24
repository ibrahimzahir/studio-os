# Design and UX psychology
Recovered direction: restrained forest green, editorial typography, responsive layouts, minimal clutter. Original HTML prototype was not recovered; current dashboard is a reconstruction.
Use shared tokens and reusable shadcn/ui components; Framer Motion only for meaningful feedback with reduced-motion support. Official shadcn Base UI and sidebar-03 are installed and used. Framer Motion remains uninstalled; current motion comes from accessible primitive interactions.
Apply /Users/ibrahimzahir/development/standards/UI_UX_PSYCHOLOGY.md across this project and relevant future projects. The named psychology-cheat-sheet.pdf was not located; do not claim it was inspected.
Opportunity radar: visual hierarchy + progressive disclosure + recognition over recall. Show audience, evidence confidence and unresolved risks; disclose sources in details.
Pipeline: mental models + feedback + feedforward. Show current state, owner and next action; never imply a queued job is finished.
Approvals: cognitive load + honest defaults. Summarize exactly what will happen and its cost; publication stays off by default. No confirmshaming or fabricated scarcity.
Verify keyboard navigation, readable contrast, mobile reflow, comprehension of score versus confidence, and understanding of approval consequences. Current page uses semantic sections, native details and visible focus.

24 November refinement: compact overview metrics, Lucide icons, short labels, validation/operations details behind disclosures. Browser verified sample search, clickable page numbers and dark theme. Shared theme uses persisted light/dark/system settings.

Owner palette update: cool white/slate with blue accents replaces the reconstructed forest-green dashboard palette. Shared light/dark/sidebar tokens updated; all sidebar destinations now have lucide-react icons. Product-specific Antigravity print palettes remain in their own briefs unless the owner requests a product redesign.

## Workbench redesign
Replaced the equal-weight metric/card grid with one prominent next-action panel, original product-brief illustration, a secondary priorities/Pinterest rail, connected production track and compact system strip. Cool white/slate and blue remain. New studio empty state hides irrelevant search/reset controls; populated lists retain search/filter/pagination. Added validated opportunity-creation Sheet wired to the real API; viewers cannot create. Lint and TypeScript passed; sample layout inspected in browser. Authenticated creation still requires end-to-end interaction verification.

Form presentation: short forms (such as opportunity capture) use centered shadcn dialogs; long or multi-step forms use dedicated routes/pages. Preserve validation, focus management and accessible labels.

## Dashboard redesign (Antigravity — 24 November 2026)
Applied `ui-ux-pro-max` (Minimalism & Swiss Style + Plus Jakarta Sans + shadcn compound cards) and `/Users/ibrahimzahir/development/standards/UI_UX_PSYCHOLOGY.md` while keeping the owner's cool white/slate + blue palette:
- **Typography & tokens:** Loaded `Plus_Jakarta_Sans` via `next/font/google` (`--font-jakarta` mapped to `--font-sans` in `@theme inline` to prevent Tailwind v4 var cycles). Removed 85+ lines of ad-hoc CSS overrides in `app/globals.css` in favor of semantic shadcn tokens and Tailwind utilities (`DESIGN_SYSTEM_FIDELITY.md`).
- **Natural focal surface:** Replaced the oversized dark-navy billboard and decorative cartoon card with a calm elevated `<Card>` (`border-t-2 border-t-primary`) paired with a compact honest 3-metric Studio Snapshot (`Opportunities`, `Active jobs: 0`, `Daily Pin slots: 0 / 4`, `tabular-nums`) — applying *Visual Hierarchy*, *Spark Effect*, and *Honest Defaults*.
- **Navigation & shell:** Flattened nested sidebar submenus in `src/components/app-sidebar.tsx` into clean top-level grouped items (`Studio` + `Operations`) with proper `"Studio OS"` lockup; added sticky translucent header with breadcrumb and `ThemeToggle` in `src/components/shared/studio-shell.tsx`.
- **Opportunity radar & right rail:** Upgraded opportunity cards with status dot badges, category pills, hover border polish, grouped metadata (`Evidence confidence`, `Next gate`), and progressive-disclosure checklists (*Recognition over Recall*, *Law of Proximity*, *Progressive Disclosure*). Upgraded `Publishing` with a `0 / 4` daily progress bar (*Goal-Gradient Effect*) + RSS timing disclosure (*Feedforward*), and `Performance` with honest dashed metric placeholders (*Visual Anchors*, zero fabricated numbers).
- **Verified:** `eslint`, `tsc --noEmit`, `vitest run` (18 passed, 6 DB integration skipped), `next build`, and headless Chrome screenshots at `1440×960` and `390×844` on `/preview`.
