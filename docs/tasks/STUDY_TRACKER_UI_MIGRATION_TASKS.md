# Study Tracker — UI Migration Tasks

## Vanilla CSS/JS → Tailwind CSS + shadcn/ui + Next.js Sub-Routes

> Created: 2026-03-25
> Reference plan: `docs/STUDY_TRACKER_MIGRATION_PLAN.md`
> Branch: `feat/css-migration-to-tailwindcss`
> **Status: Not started**

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

- [ ] **1.8** Smoke test — verify:
  - All 5 routes render correctly at their new URLs
  - Browser back/forward works between views
  - Direct URL access (e.g., `/study-tracker/syllabus/manual`) loads correctly
  - State persists when navigating between routes (context is not remounted)
  - No console errors

---

## Phase 2 — Sidebar Migration

> Goal: Eliminate all `.st-*` classes and inline styles from sidebar + nav.
> Risk: Low — visual-only, no logic changes.

- [ ] **2.1** Rewrite `NavBtn.jsx`
  - Fix invalid HTML: remove wrapping `<div>`, render `<li><Link>` only
  - Replace `st-nav-btn` + `active` class with `cn()` Tailwind conditionals
  - Replace `st-nav-icon`, `st-nav-label`, `st-nav-badge` with Tailwind classes
  - Use `usePathname()` for active detection (no more `active` prop)
  - Preserve `id` and `data-testid` props if any

- [ ] **2.2** Migrate sidebar CSS classes in `Sidebar.jsx`
  - `.st-sidebar` → `w-[252px] min-w-[252px] bg-white border-r border-[#e9eaed] flex flex-col h-full overflow-y-auto z-40 flex-shrink-0`
  - `.st-nav` → `list-none p-[10px] flex-1 m-0`
  - `.st-nav-sep` → `block text-[0.67rem] font-semibold tracking-[1.2px] text-[#c1c7d0] px-[10px] pt-[14px] pb-[5px] uppercase`
  - `.st-sidebar-footer` → `p-[10px] border-t border-[#e9eaed] mt-auto`
  - `.st-login-btn` → `flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-blue-600 text-white text-[0.85rem] font-semibold hover:bg-blue-700 transition-colors`

- [ ] **2.3** Create `_components/UserProfileDropdown.jsx`
  - Extract sidebar footer user block from `Sidebar.jsx`
  - Replace all ~15 inline style objects with shadcn `DropdownMenu`
  - `.st-user-btn` → `flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-[#e9eaed] bg-white hover:bg-gray-50 transition-colors cursor-pointer`
  - `.st-user-avatar` → `w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0`
  - `.st-user-name` → `text-[0.8rem] font-semibold text-gray-900 truncate`
  - `.st-user-email` → `text-[0.72rem] text-gray-500 truncate`
  - Logout button inside `DropdownMenuItem` — preserve `id="logout-btn"` and `data-testid="logout-btn"`
  - Preserve `id="sidebar-login-btn"` and `data-testid="sidebar-login-btn"` on login link

- [ ] **2.4** Migrate layout shell CSS in `layout.js`
  - `.st-root` → `flex h-[calc(100vh-64px)] bg-[#f8f9fc] text-[#1a1d23] text-[15px] overflow-hidden`
  - `.st-main` → `flex-1 min-w-0 h-full overflow-y-auto`
  - `.st-content` → `p-7`
  - Remove `study-tracker.css` import from wherever it currently lives (check `page.jsx`)

- [ ] **2.5** Verify sidebar looks identical to before. Run grep:
  ```
  grep -r "st-sidebar\|st-nav\|st-user" app/(study)/study-tracker
  ```
  Expect: zero results.

---

## Phase 3 — Font Migration

> Decision: Use Inter (already loaded globally). Remove DM Sans/Mono CDN import. Add commented CSS vars in globals.css for future reference.
> Risk: Low.

- [ ] **3.1** Add commented-out font variable placeholders to `app/globals.css`
  ```css
  /* Study Tracker — alternative font candidates (uncomment to activate, remove Inter below) */
  /* --font-st-body: 'DM Sans', sans-serif;  */
  /* --font-st-mono: 'DM Mono', monospace;   */
  ```

- [ ] **3.2** Study Tracker inherits Inter from root layout — no extra font setup needed in `layout.js`
  - For monospace numbers/stats: use Tailwind `font-mono` class

- [ ] **3.3** Remove `@import url('https://fonts.googleapis.com/...')` (DM Sans/Mono CDN) from `study-tracker.css`
  - No replacement needed — Inter already loads globally via root layout

---

## Phase 4 — Dashboard Migration

> Goal: Replace CDN Chart.js with npm package. Migrate all `.st-dash-*` CSS to Tailwind.
> Risk: Medium — Chart.js import/registration differs from CDN usage. Test all 6 charts.

- [ ] **4.1** Install Chart.js

  ```bash
  npm install chart.js
  ```

- [ ] **4.2** Rewrite Chart.js initialisation in `DashboardView.jsx`
  - Remove `document.createElement("script")` CDN injection block
  - Remove `window.Chart` check
  - Add at top of file:
    ```js
    import { Chart, registerables } from "chart.js";
    Chart.register(...registerables);
    ```
  - Replace all `new window.Chart(...)` with `new Chart(...)`

- [ ] **4.3** Fix chart `useEffect` dependency array
  - Current: `useEffect([state])` — recreates all 6 charts on any state change
  - New: scope to specific derived values (syllabusIds, progressSnapshot, dailySnapshot, todayTasks)
  - Use `useMemo` to derive chart data outside the effect

- [ ] **4.4** Migrate Dashboard CSS classes to Tailwind
  - Header row, title, subtitle, action buttons area
  - Quick stats grid (4 cards)
  - Overview cards grid (per-syllabus cards with progress bars)
  - Chart cards (two rows)
  - Recent activity list

- [ ] **4.5** Replace action buttons with shadcn `Button`
  - Export → `<Button>` with blue variant
  - Import → `<Button variant="outline">`
  - Clear All → `<AlertDialogTrigger asChild><Button>` with red/destructive style
  - Preserve existing `AlertDialog` wrapping on Clear All

- [ ] **4.6** Verify all 6 charts render identically:
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

- [ ] **5.1** Migrate `DailyTrackerView.jsx`
  - Replace all `.st-daily-*` classes with Tailwind equivalents
  - Replace custom tab buttons (`"tasks"` / `"habits"`) with shadcn `Tabs` + `TabsList` + `TabsTrigger`
  - Keep `CHECK_SVG` inline SVG as-is
  - Keep data-driven inline styles (dynamic colors from habit/syllabus data)

- [ ] **5.2** Migrate `SyllabusView.jsx`
  - Replace all `.st-syl-*`, `.st-section-*`, `.st-topic-*`, `.st-subtopic-*` classes with Tailwind
  - `.st-topic-card.done` → `cn("...", done && "bg-green-50 border-green-200")`
  - `.st-topic-title.done` → `cn("...", done && "line-through text-gray-400")`
  - `.st-custom-check.checked` → keep `style={{ borderColor: sylColor, background: sylColor }}` (data-driven)
  - Preserve ring SVG for syllabus progress circle

- [ ] **5.3** Migrate `SyllabusManagerView.jsx`
  - Replace remaining raw `<input>`, `<button>`, `<select>` elements with shadcn `Input`, `Button`, `Select`
  - Replace any remaining `.st-*` class references with Tailwind
  - Color picker swatch grid stays as-is

- [ ] **5.4** Replace custom toast with `sonner` across all components
  - In `StudyTrackerProvider.jsx`: remove `toast` useState, remove `showToast` setTimeout logic
  - Replace `showToast("msg")` calls with `toast.success("msg")` / `toast.error("msg")`
  - Remove `.st-toast` CSS block

- [ ] **5.5** Set global toast position to `bottom-center` in root layout
  - In `app/layout.js`: update `<Toaster>` to `<Toaster position="bottom-center" />`
  - This applies site-wide — all existing sonner toasts (Resources, etc.) will also move to bottom-center
  - Verify no existing toast is visually broken at the new position

---

## Phase 6 — CSS Cleanup

> Goal: Delete `study-tracker.css` entirely. Zero `.st-*` references remain.
> Risk: Low — final cleanup only after all phases above pass.

- [ ] **6.1** Run grep to confirm no `.st-*` references remain:

  ```
  grep -r "st-" app/(study)/study-tracker --include="*.jsx" --include="*.js"
  ```

  Fix any remaining hits before proceeding.

- [ ] **6.2** Remove `study-tracker.css` import from `page.jsx` (or wherever it is currently imported)

- [ ] **6.3** Delete `study-tracker.css`

- [ ] **6.4** Remove dead code:
  - Delete `getTabTitle()` function (already commented out in current code)
  - Delete the commented-out `.st-topbar` JSX block
  - Delete `dashboard/page.jsx` stub (already deleted per git status — confirm)

- [ ] **6.5** Run full verification grep suite (from plan Section 8):
  ```bash
  grep -r "st-" app/(study)/study-tracker --include="*.jsx" --include="*.js"
  grep -r "style={{" app/(study)/study-tracker --include="*.jsx"
  grep -r "window.Chart\|cdn.jsdelivr" app/(study)/study-tracker --include="*.jsx"
  grep -r "data-testid" app/(study)/study-tracker --include="*.jsx"
  ```

  - First three: expect zero results (or only data-driven inline styles for `style={{`)
  - Last one: expect all `data-testid` attributes still present

---

## Constraints (do not break these)

| Constraint                      | Detail                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| Visual design                   | Every color in plan Section 2 must be pixel-identical                              |
| Sidebar width                   | Must remain exactly `252px`                                                        |
| Charts                          | All 6 Chart.js charts must look identical                                          |
| `id` / `data-testid` attributes | Must be preserved on all interactive elements                                      |
| localStorage keys               | `STORAGE_KEYS` in `studyTrackerStorage.js` — do not rename                         |
| API endpoints                   | `/api/tracker/*` — do not change                                                   |
| State shape                     | `syllabi`, `progress`, `custom`, `log`, `subtopics`, `daily`, `habits`, `habitLog` |
| Dynamic inline styles           | Keep `style={{ borderColor: sylColor }}` — data-driven, not static                 |
| Font | Use Inter (global). DM Sans/Mono CSS vars commented in globals.css for future switch |

---

## Files Created / Modified / Deleted

| File                                   | Action                                  |
| -------------------------------------- | --------------------------------------- |
| `_components/StudyTrackerProvider.jsx` | Create (Phase 1)                        |
| `_components/Sidebar.jsx`              | Create (Phase 1)                        |
| `_components/UserProfileDropdown.jsx`  | Create (Phase 2)                        |
| `_components/NavBtn.jsx`               | Rewrite (Phase 2)                       |
| `_components/StudyTrackerApp.jsx`      | Delete (Phase 1 — replaced by Provider) |
| `_components/DashboardView.jsx`        | Modify (Phase 4)                        |
| `_components/DailyTrackerView.jsx`     | Modify (Phase 5)                        |
| `_components/SyllabusView.jsx`         | Modify (Phase 5)                        |
| `_components/SyllabusManagerView.jsx`  | Modify (Phase 5)                        |
| `_components/ResourcesView.jsx`        | No change                               |
| `study-tracker/layout.js`              | Rewrite (Phase 1 + 2)                   |
| `study-tracker/page.jsx`               | Rewrite to redirect (Phase 1)           |
| `study-tracker/dashboard/page.jsx`     | Create (Phase 1)                        |
| `study-tracker/daily-tracker/page.jsx` | Create (Phase 1)                        |
| `study-tracker/resources/page.jsx`     | Create (Phase 1)                        |
| `study-tracker/syllabus/page.jsx`      | Create (Phase 1)                        |
| `study-tracker/syllabus/[id]/page.jsx` | Create (Phase 1)                        |
| `study-tracker/study-tracker.css`                         | Delete (Phase 6)                                     |
| `app/layout.js`                                           | Update `<Toaster position="bottom-center">` (Phase 5) |
| `app/globals.css`                                         | Add commented font vars (Phase 3)                    |
| `components/Header.jsx`                                   | Update `/study-tracker` link → `/study-tracker/dashboard` (Phase 1) |
| `components/NavbarSheet.jsx`                              | Update `/study-tracker` link (Phase 1)               |
| `components/lib/Footer.jsx`                               | Update `/study-tracker` link (Phase 1)               |
| `app/page.js`                                             | Update 2× `/study-tracker` links (Phase 1)           |
| `app/(admin)/login/page.jsx`                              | Update 2× `router.push/replace("/study-tracker")` (Phase 1) |
| `app/(admin)/signup/page.jsx`                             | Update 2× `router.push/replace("/study-tracker")` (Phase 1) |
| `app/(admin)/admin/dashboard/page.jsx`                    | Update `router.replace("/study-tracker")` (Phase 1)  |
| `app/(admin)/admin/site-alerts/page.jsx`                  | Update `router.replace("/study-tracker")` (Phase 1)  |
| `app/(tools)/qa-tools/page.jsx`                           | Update `/study-tracker` link (Phase 1)               |
| `app/(tools)/qa-tools/json-to-file/_components/SuccessBanner.jsx` | Update `/study-tracker` link (Phase 1)     |
| `app/(study)/study-tracker/ai-syllabus-prompt/PromptPageContent.jsx` | Update 2× `/study-tracker` links (Phase 1) |
| `app/(study)/study-tracker/ai-syllabus-prompt/page.jsx`   | Remove `study-tracker.css` import (Phase 6)          |

---

## Design Decisions (resolved 2026-03-25)

| # | Question | Decision |
|---|---|---|
| Q1 | Font | Use Inter (global). Add DM Sans/Mono as **commented** CSS vars in `globals.css` — revisit later. |
| Q2 | SyllabusManagerView inputs/buttons | Use shadcn `Input`, `Button`, `Select` with Tailwind classes. shadcn defaults accepted. |
| Q3 | Toast position | `bottom-center` globally — update `<Toaster>` in `app/layout.js`. Applies site-wide. |
| Q4 | Split DailyTrackerView | **Deferred** — migrate as-is in this pass, split in a later version. |
| Q5 | `/study-tracker` redirect | Permanent redirect from `page.jsx` to `/study-tracker/dashboard`. Update all 15 internal links (nav, footer, login, signup, admin redirects, tool pages, prompt page back-links) to point directly to `/study-tracker/dashboard`. |
