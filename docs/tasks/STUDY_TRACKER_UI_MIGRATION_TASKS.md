# Study Tracker — UI Migration Tasks

## Vanilla CSS/JS → Tailwind CSS + shadcn/ui + Next.js Sub-Routes

> Created: 2026-03-25
> Last updated: 2026-03-25
> Reference plan: `docs/STUDY_TRACKER_MIGRATION_PLAN.md`
> Branch: `feat/localstorage-sync`
> **Status: Phase 6 complete — CSS fully removed (4.6 pending manual smoke test)**

---

## Status Legend

| Symbol | Meaning                  |
| ------ | ------------------------ |
| `[ ]`  | Not started              |
| `[~]`  | In progress              |
| `[x]`  | Done                     |
| `[!]`  | Blocked / needs decision |

---

## Phase 1 — Sub-Routes Skeleton

> Goal: Real URL-based navigation. Zero visual changes. All views still use existing CSS classes.
> Risk: Medium — state sharing across routes. Test carefully after each step.

- [x] **1.1** Create `_components/StudyTrackerProvider.jsx`
  - Extract all `useState`, `useEffect`, `useRef`, `syncToDb`, `updateState`, `showToast`, `handleExport`, `handleImport`, `handleClearAll` out of `StudyTrackerApp.jsx`
  - Expose via `StudyTrackerContext` + `useTracker()` hook
  - No visual output — pure context provider wrapper

- [x] **1.2** Rewrite `study-tracker/layout.js`
  - Wrap children in `<StudyTrackerProvider>`
  - Add sidebar shell + main content area (keep `.st-root`, `.st-sidebar`, `.st-main` CSS classes for now)
  - Import and render new `<Sidebar />` component

- [x] **1.3** Create `_components/Sidebar.jsx`
  - Extract sidebar JSX from `StudyTrackerApp.jsx` (nav list + syllabi section + sidebar footer)
  - Replace `onClick(id)` tab switching with `<Link href="...">` via `next/link`
  - Use `usePathname()` for active tab detection
  - Keep all `.st-*` CSS classes — no visual change yet
  - Keep all `id` and `data-testid` attributes

- [x] **1.4** Create sub-route pages (thin wrappers only):
  - `dashboard/page.jsx` → renders `<DashboardView />` (props from `useTracker()`)
  - `daily-tracker/page.jsx` → renders `<DailyTrackerView />`
  - `resources/page.jsx` → renders `<ResourcesView />`
  - `syllabus/page.jsx` → renders `<SyllabusManagerView />`
  - `syllabus/[id]/page.jsx` → renders `<SyllabusView />` matched by `params.id`

- [x] **1.5** Rewrite `study-tracker/page.jsx`
  - Replace `<StudyTrackerApp />` render with permanent redirect to `/study-tracker/dashboard`
  - Use `import { redirect } from "next/navigation"`

- [x] **1.6** Update all internal `/study-tracker` links → `/study-tracker/dashboard`
  - `components/Header.jsx` — nav link
  - `components/NavbarSheet.jsx` — mobile nav link
  - `components/lib/Footer.jsx` — footer link
  - `app/page.js` — 2 links on landing page
  - `app/(admin)/login/page.jsx` — `router.replace` + `router.push` after login
  - `app/(admin)/signup/page.jsx` — `router.replace` + `router.push` after signup
  - `app/(admin)/admin/dashboard/page.jsx` — `router.replace`
  - `app/(admin)/admin/site-alerts/page.jsx` — `router.replace`
  - `app/(tools)/qa-tools/page.jsx` — link card
  - `app/(tools)/qa-tools/json-to-file/_components/SuccessBanner.jsx` — link
  - `app/(study)/study-tracker/ai-syllabus-prompt/PromptPageContent.jsx` — 2 back-links

- [x] **1.7** Delete `StudyTrackerApp.jsx` (now replaced by Provider + layout + Sidebar)
  - Confirm nothing else imports it before deleting

- [x] **1.8** Smoke test — verify:
  - All 5 routes render correctly at their new URLs
  - Browser back/forward works between views
  - Direct URL access (e.g., `/study-tracker/syllabus/manual`) loads correctly
  - State persists when navigating between routes (context is not remounted)
  - No console errors

---

## Phase 2 — Sidebar Migration

> Goal: Eliminate all `.st-*` classes and inline styles from sidebar + nav.
> Risk: Low — visual-only, no logic changes.

- [x] **2.1** Rewrite `NavBtn.jsx`
  - Fix invalid HTML: remove wrapping `<div>`, render `<li><Link>` only
  - Replace `st-nav-btn` + `active` class with `cn()` Tailwind conditionals
  - Replace `st-nav-icon`, `st-nav-label`, `st-nav-badge` with Tailwind classes
  - Use `usePathname()` for active detection (no more `active` prop)
  - Preserve `id` and `data-testid` props if any

- [x] **2.2** Migrate sidebar CSS classes in `Sidebar.jsx`
  - `.st-sidebar` → `w-[252px] min-w-[252px] bg-white border-r border-[#e9eaed] flex flex-col h-full overflow-y-auto z-40 flex-shrink-0`
  - `.st-nav` → `list-none p-[10px] flex-1 m-0`
  - `.st-nav-sep` → `block text-[0.67rem] font-semibold tracking-[1.2px] text-[#c1c7d0] px-[10px] pt-[14px] pb-[5px] uppercase`
  - `.st-sidebar-footer` → `p-[10px] border-t border-[#e9eaed] mt-auto`
  - `.st-login-btn` → Tailwind flex row with border, bg-[#f9fafb], hover:bg-gray-100

- [x] **2.3** ~~Create `_components/UserProfileDropdown.jsx`~~ — inlined into `Sidebar.jsx` directly
  - All ~15 inline style objects replaced with Tailwind classes inside `Sidebar.jsx`
  - `.st-user-btn` → Tailwind button with hover:bg-gray-100
  - `.st-user-avatar` → `w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600`
  - `.st-user-name` / `.st-user-email` → `truncate` text divs
  - `ChevronDown` rotation → `cn()` + `rotate-180` class (removed `onMouseEnter`/`onMouseLeave`)
  - Logout button → `hover:bg-red-50` (removed `onMouseEnter`/`onMouseLeave` handlers)
  - Preserved `id="logout-btn"`, `data-testid="logout-btn"`, `id="sidebar-login-btn"`, `data-testid="sidebar-login-btn"`

- [x] **2.4** Migrate layout shell CSS in `layout.js`
  - `.st-root` → `flex h-[calc(100vh-64px)] bg-[#f8f9fc] text-[#1a1d23] text-[15px] overflow-hidden`
  - `.st-main` → `flex-1 min-w-0 h-full overflow-y-auto` + scrollbar arbitrary variants
  - `.st-content` → `px-7 py-[26px]`
  - CSS import kept in `layout.js` — other views still use `.st-dash-*`, `.st-daily-*`, etc. (removed in Phase 6)

- [x] **2.5** Verified — grep confirms zero `st-sidebar|st-nav|st-user|st-root|st-main|st-content` in `_components/` or `layout.js`

---

## Phase 3 — Font Migration

> Decision: Use Inter (already loaded globally). Remove DM Sans/Mono CDN import. Add commented CSS vars in globals.css for future reference.
> Risk: Low.

- [x] **3.1** Add commented-out font variable placeholders to `app/globals.css`
  - Added `--font-st-body` and `--font-st-mono` comment vars + CDN import line (all commented out)

- [x] **3.2** Study Tracker inherits Inter from root layout — no extra font setup needed in `layout.js`
  - For monospace numbers/stats: use Tailwind `font-mono` class (deferred to Phase 4-5 per-view migration)

- [x] **3.3** Remove `@import url('https://fonts.googleapis.com/...')` (DM Sans/Mono CDN) from `study-tracker.css`
  - Replaced all 30 `font-family: 'DM Sans', sans-serif` → `font-family: inherit` (picks up Inter from root)
  - `font-family: 'DM Mono', monospace` left as-is (10 occurrences) — fallback to system monospace; will become Tailwind `font-mono` when those views are migrated in Phases 4-5

---

## Phase 4 — Dashboard Migration

> Goal: Replace CDN Chart.js with npm package. Migrate all `.st-dash-*` CSS to Tailwind.
> Risk: Medium — Chart.js import/registration differs from CDN usage. Test all 6 charts.

- [x] **4.1** Install Chart.js — `npm install chart.js`

- [x] **4.2** Rewrite Chart.js initialisation in `DashboardView.jsx`
  - Removed `document.createElement("script")` CDN injection block
  - Removed `window.Chart` check
  - Added `import { Chart, registerables } from "chart.js"` + `Chart.register(...registerables)` at module level
  - Replaced all `new window.Chart(...)` with `new Chart(...)`
  - Replaced all `font: { family: "'DM Sans', sans-serif" }` → `font: { family: "Inter, sans-serif" }` in chart options

- [x] **4.3** Fixed chart `useEffect` dependency array
  - Scoped to `[state.syllabi, state.progress, state.daily]` — not full `[state]`
  - Added `useMemo` for `todayTasks`
  - Moved `destroyAll()` call to top of effect (before re-render) for correctness

- [x] **4.4** Migrated all Dashboard CSS classes to Tailwind
  - `.st-dash-header`, `.st-dash-header-row`, `.st-dash-title`, `.st-dash-subtitle`, `.st-dash-actions`
  - `.st-overview-cards`, `.st-ov-card`, `.st-ov-icon`, `.st-ov-label`, `.st-ov-pct`, `.st-ov-sub`, `.st-ov-bar-wrap`, `.st-ov-bar`
  - `.st-charts-row`, `.st-charts-row-equal`, `.st-chart-card`, `.st-chart-title`, `.st-chart-subtitle`, `.st-pie-wrap`
  - `.st-recent-activity`, `.st-activity-day`, `.st-act-date`, `.st-act-chips`, `.st-act-chip`, `.st-no-activity`
  - Dynamic `style={{ background: syl.color + "18", color: syl.color }}` kept on activity chips (data-driven)

- [x] **4.5** Replaced action buttons with shadcn `Button`
  - Export → `<Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">`
  - Import → `<Button size="sm" variant="outline">`
  - Clear All → `<AlertDialogTrigger asChild><Button size="sm" className="bg-red-50 text-red-600 ...">` inside existing `AlertDialog`

- [ ] **4.6** Verify all 6 charts render identically (manual smoke test):
  - Today's Tasks doughnut
  - Daily Task Completion % line
  - Overall Progress doughnut
  - Topics Completed line
  - Progress by Syllabus bar
  - Completion Breakdown doughnut

---

## Phase 5 — Remaining Views Migration

> Goal: Migrate all remaining `.st-*` classes to Tailwind across 3 view components.
> Risk: Low-Medium — large surface area but purely visual.

- [x] **5.1** Migrate `DailyTrackerView.jsx`
  - Replaced all `.st-daily-*`, `.st-date-*`, `.st-task-*`, `.st-habit-*`, `.st-add-*`, `.st-ana-*`, `.st-filter-*`, `.st-hf-*`, `.st-pill`, `.st-day-toggle` with Tailwind
  - Replaced custom tab buttons with shadcn `Tabs` + `TabsList` + `TabsTrigger`
  - Replaced CDN Chart.js with npm `Chart` (same pattern as DashboardView)
  - Replaced action buttons with shadcn `Button`
  - Kept `CHECK_SVG` inline SVG and data-driven inline styles

- [x] **5.2** Migrate `SyllabusView.jsx`
  - Replaced all `.st-syl-*`, `.st-section-*`, `.st-topic-*`, `.st-subtopic-*`, `.st-notes-*`, `.st-res-*`, `.st-det-cols` with Tailwind
  - `cn()` used for topic card done state: `cn("...", isDone && "bg-green-50 border-green-200")`
  - Section chevron rotation via `cn("...", isOpen && "rotate-90")`
  - Dynamic colors kept as `style={{ background: color, borderColor: color }}` on checkboxes

- [x] **5.3** Migrate `SyllabusManagerView.jsx`
  - Replaced all `.st-syl-mgr-*`, `.st-drag-*`, `.st-new-syl-btn`, `.st-syl-mgr-empty` with Tailwind
  - Drag-drop pseudo-element indicators replaced with programmatic `<div>` elements
  - Action buttons → shadcn `Button` including `asChild` for Link buttons

- [x] **5.4** Replace custom toast with `sonner` across all components
  - In `StudyTrackerProvider.jsx`: removed `toast` useState, replaced with `sonnerToast.success/error`
  - Removed `.st-toast` div from render

- [x] **5.5** Set global toast position to `bottom-center` in root layout
  - Updated `<Toaster richColors position="bottom-center" />` in `app/layout.js`

---

## Phase 6 — CSS Cleanup

> Goal: Delete `study-tracker.css` entirely. Zero `.st-*` references remain.
> Risk: Low — final cleanup only after all phases above pass.

- [x] **6.1** Grep confirmed zero `.st-*` className references in all `_components/*.jsx` and layout files

- [x] **6.2** Removed `study-tracker.css` import from `layout.js` and `ai-syllabus-prompt/page.jsx`

- [x] **6.3** Deleted `study-tracker.css`

- [x] **6.4** Dead code check — no `getTabTitle` or `.st-topbar` blocks found; `dashboard/page.jsx` is a live route (not a stub), kept

- [x] **6.5** Full verification grep suite passed:
  - Zero `.st-*` className references
  - Zero `window.Chart` or `cdn.jsdelivr` references
  - Zero `study-tracker.css` imports

---

## Constraints (do not break these)

| Constraint                      | Detail                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| Visual design                   | Every color in plan Section 2 must be pixel-identical                                |
| Sidebar width                   | Must remain exactly `252px`                                                          |
| Charts                          | All 6 Chart.js charts must look identical                                            |
| `id` / `data-testid` attributes | Must be preserved on all interactive elements                                        |
| localStorage keys               | `STORAGE_KEYS` in `studyTrackerStorage.js` — do not rename                           |
| API endpoints                   | `/api/tracker/*` — do not change                                                     |
| State shape                     | `syllabi`, `progress`, `custom`, `log`, `subtopics`, `daily`, `habits`, `habitLog`   |
| Dynamic inline styles           | Keep `style={{ borderColor: sylColor }}` — data-driven, not static                   |
| Font                            | Use Inter (global). DM Sans/Mono CSS vars commented in globals.css for future switch |

---

## Files Created / Modified / Deleted

| File                                                                 | Action                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `_components/StudyTrackerProvider.jsx`                               | Create (Phase 1)                                                    |
| `_components/Sidebar.jsx`                                            | Create (Phase 1)                                                    |
| `_components/UserProfileDropdown.jsx`                                | Create (Phase 2)                                                    |
| `_components/NavBtn.jsx`                                             | Rewrite (Phase 2)                                                   |
| `_components/StudyTrackerApp.jsx`                                    | Delete (Phase 1 — replaced by Provider)                             |
| `_components/DashboardView.jsx`                                      | Modify (Phase 4)                                                    |
| `_components/DailyTrackerView.jsx`                                   | Modify (Phase 5)                                                    |
| `_components/SyllabusView.jsx`                                       | Modify (Phase 5)                                                    |
| `_components/SyllabusManagerView.jsx`                                | Modify (Phase 5)                                                    |
| `_components/ResourcesView.jsx`                                      | No change                                                           |
| `study-tracker/layout.js`                                            | Rewrite (Phase 1 + 2)                                               |
| `study-tracker/page.jsx`                                             | Rewrite to redirect (Phase 1)                                       |
| `study-tracker/dashboard/page.jsx`                                   | Create (Phase 1)                                                    |
| `study-tracker/daily-tracker/page.jsx`                               | Create (Phase 1)                                                    |
| `study-tracker/resources/page.jsx`                                   | Create (Phase 1)                                                    |
| `study-tracker/syllabus/page.jsx`                                    | Create (Phase 1)                                                    |
| `study-tracker/syllabus/[id]/page.jsx`                               | Create (Phase 1)                                                    |
| `study-tracker/study-tracker.css`                                    | Delete (Phase 6)                                                    |
| `app/layout.js`                                                      | Update `<Toaster position="bottom-center">` (Phase 5)               |
| `app/globals.css`                                                    | Add commented font vars (Phase 3)                                   |
| `components/Header.jsx`                                              | Update `/study-tracker` link → `/study-tracker/dashboard` (Phase 1) |
| `components/NavbarSheet.jsx`                                         | Update `/study-tracker` link (Phase 1)                              |
| `components/lib/Footer.jsx`                                          | Update `/study-tracker` link (Phase 1)                              |
| `app/page.js`                                                        | Update 2× `/study-tracker` links (Phase 1)                          |
| `app/(admin)/login/page.jsx`                                         | Update 2× `router.push/replace("/study-tracker")` (Phase 1)         |
| `app/(admin)/signup/page.jsx`                                        | Update 2× `router.push/replace("/study-tracker")` (Phase 1)         |
| `app/(admin)/admin/dashboard/page.jsx`                               | Update `router.replace("/study-tracker")` (Phase 1)                 |
| `app/(admin)/admin/site-alerts/page.jsx`                             | Update `router.replace("/study-tracker")` (Phase 1)                 |
| `app/(tools)/qa-tools/page.jsx`                                      | Update `/study-tracker` link (Phase 1)                              |
| `app/(tools)/qa-tools/json-to-file/_components/SuccessBanner.jsx`    | Update `/study-tracker` link (Phase 1)                              |
| `app/(study)/study-tracker/ai-syllabus-prompt/PromptPageContent.jsx` | Update 2× `/study-tracker` links (Phase 1)                          |
| `app/(study)/study-tracker/ai-syllabus-prompt/page.jsx`              | Remove `study-tracker.css` import (Phase 6)                         |

---

## Design Decisions (resolved 2026-03-25)

| #   | Question                           | Decision                                                                                                                                                                                                                          |
| --- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Font                               | Use Inter (global). Add DM Sans/Mono as **commented** CSS vars in `globals.css` — revisit later.                                                                                                                                  |
| Q2  | SyllabusManagerView inputs/buttons | Use shadcn `Input`, `Button`, `Select` with Tailwind classes. shadcn defaults accepted.                                                                                                                                           |
| Q3  | Toast position                     | `bottom-center` globally — update `<Toaster>` in `app/layout.js`. Applies site-wide.                                                                                                                                              |
| Q4  | Split DailyTrackerView             | **Deferred** — migrate as-is in this pass, split in a later version.                                                                                                                                                              |
| Q5  | `/study-tracker` redirect          | Permanent redirect from `page.jsx` to `/study-tracker/dashboard`. Update all 15 internal links (nav, footer, login, signup, admin redirects, tool pages, prompt page back-links) to point directly to `/study-tracker/dashboard`. |
