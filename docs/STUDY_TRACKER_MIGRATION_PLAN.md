# Study Tracker — Migration Plan
## CSS/HTML/JS → Tailwind CSS + shadcn/ui + Next.js Sub-Routes

**Date:** 2026-03-25
**Branch:** feat/localstorage-sync
**Scope:** Migrate the Study Tracker from its custom CSS file and inline styles to Tailwind CSS + shadcn/ui components, while preserving the exact visual design. Simultaneously restructure from a single-page tab switcher to proper Next.js sub-routes.

---

## 1. Current State — What We Have

### File inventory

| File | Role | Problem |
|---|---|---|
| `study-tracker.css` | ~500 lines of custom CSS with `.st-*` class names | Non-Tailwind, duplicates design tokens already in globals.css |
| `StudyTrackerApp.jsx` | Root shell: state, sync, nav, layout | ~490 lines — owns state + layout + sidebar all in one, many inline styles |
| `NavBtn.jsx` | Sidebar nav button | Wraps `<div><li><button>` — invalid HTML nesting, CSS-class-only |
| `DashboardView.jsx` | Charts + overview | ~613 lines — Chart.js loaded from CDN via dynamic `<script>` injection |
| `DailyTrackerView.jsx` | Tasks + habits | Mix of CSS classes and inline styles |
| `SyllabusView.jsx` | Syllabus topic browser | Rendered by ID match: `state.syllabi[activeTab]` |
| `SyllabusManagerView.jsx` | Import/export/manage syllabi | Mix of CSS classes + some raw HTML styling |
| `ResourcesView.jsx` | Save/manage learning resources | Already fully uses shadcn/ui components |
| `page.jsx` | Entry point | Just renders `<StudyTrackerApp />` |
| `layout.js` | Study tracker layout | Trivial pass-through |

### Navigation model (current)

Navigation is faked via `useState("activeTab")` in `StudyTrackerApp`. The URL never changes. There are no real sub-routes. This means:
- No browser back/forward support
- No shareable/bookmarkable deep links
- No code splitting per view
- The entire state tree is always mounted

### CSS problems

The `study-tracker.css` file has three categories of styles:

**Category A — Layout primitives** (sidebar, main, content padding)
These map directly to Tailwind utilities and should be eliminated.

**Category B — Design tokens** (colors, border-radius, fonts)
These are currently hardcoded as hex values. They should become Tailwind classes or CSS variables via `globals.css`.

**Category C — Component-specific visual states** (`.st-topic-card.done`, `.st-custom-check.checked`, `.st-nav-btn.active`)
These need careful handling because they use dynamic class toggling. They must be replicated with `cn()` conditional classes.

### Inline style problems in StudyTrackerApp.jsx

The sidebar footer (user profile dropdown) has 15+ inline style objects. This is the primary offender. Examples:

```jsx
// Current — inline styles everywhere
style={{ position: "absolute", bottom: "calc(100% + 6px)", left: 0, right: 0,
         background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px",
         boxShadow: "0 8px 24px rgba(0,0,0,0.10)", padding: "8px", zIndex: 50 }}
```

These should become Tailwind classes + shadcn/ui `DropdownMenu`.

### Chart.js loading strategy (current problem)

`DashboardView.jsx` dynamically injects a `<script>` tag from a CDN at runtime on every state change, then calls `renderCharts()`. Problems:
- CDN dependency (fails offline / blocked by CSP)
- Script injection on every `useEffect([state])` trigger
- Re-creates all 6 chart instances on any state change
- Chart.js is not in `package.json` — invisible dependency

---

## 2. Design Tokens — CSS → Tailwind Mapping

These are the exact colors/values used in `study-tracker.css` and inline styles. They must be preserved pixel-for-pixel.

### Colors

| Token | Hex value | Tailwind equivalent |
|---|---|---|
| Page background | `#f8f9fc` | `bg-[#f8f9fc]` or `bg-slate-50` |
| Sidebar / card bg | `#ffffff` | `bg-white` |
| Sidebar border | `#e9eaed` | `border-[#e9eaed]` |
| Active nav bg | `#eff2ff` | `bg-[#eff2ff]` (close: `bg-indigo-50`) |
| Active nav text | `#2563eb` | `text-blue-600` |
| Nav hover bg | `#f3f4f6` | `bg-gray-100` |
| Primary blue | `#2563eb` | `bg-blue-600` / `text-blue-600` |
| Body text | `#1a1d23` | `text-[#1a1d23]` |
| Dark heading | `#111827` | `text-gray-900` |
| Medium heading | `#1f2937` | `text-gray-800` |
| Secondary text | `#374151` | `text-gray-700` |
| Muted text | `#6b7280` | `text-gray-500` |
| Placeholder text | `#9ca3af` | `text-gray-400` |
| Separator / light border | `#f0f1f4` | `border-gray-100` |
| Topic done bg | `#f0fdf4` | `bg-green-50` |
| Topic done border | `#bbf7d0` | `border-green-200` |
| Export btn bg | `#2563eb` | `bg-blue-600` |
| Import btn bg | `#f3f4f6` | `bg-gray-100` |
| Clear btn bg | `#fee2e2` | `bg-red-100` |
| Clear btn text | `#dc2626` | `text-red-600` |
| Badge blue bg | `#eff2ff` | `bg-blue-50` |

### Typography

The fonts `DM Sans` (body) and `DM Mono` (numbers) are loaded from Google Fonts in the CSS file. They should be moved to `app/layout.js` via `next/font/google` (same pattern as Inter is already loaded).

```js
// In app/layout.js — add alongside existing Inter import
import { DM_Sans, DM_Mono } from "next/font/google"
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400","500"], variable: "--font-dm-mono" })
```

Then add `font-[family-name:--font-dm-sans]` via Tailwind or scope with a CSS variable inside `globals.css`:

```css
/* In globals.css */
.st-scope {
  font-family: var(--font-dm-sans), sans-serif;
}
```

### Dimensions

| Token | Value | Tailwind equivalent |
|---|---|---|
| Sidebar width | `252px` | `w-[252px]` |
| Content padding | `26px 28px` | `p-7` (28px, close enough) |
| Card border-radius | `12px–14px` | `rounded-xl` (12px) |
| Nav item border-radius | `8px` | `rounded-lg` |
| Nav item padding | `9px 10px` | `py-2 px-2.5` |
| Nav separator font-size | `0.67rem` | `text-[0.67rem]` |
| Badge font-size | `0.68rem` | `text-[0.68rem]` |
| Scrollbar width | `4–5px` | Keep in `globals.css` (Tailwind has no scrollbar utilities by default) |

---

## 3. Sub-Routes Architecture

### Route structure (proposed)

```
app/(study)/
  layout.js                          — (study) group layout, unchanged
  study-tracker/
    layout.js                        — NEW: context provider + sidebar shell
    page.jsx                         — redirect to /study-tracker/dashboard
    _components/
      StudyTrackerProvider.jsx       — NEW: context with state + sync logic (extracted from StudyTrackerApp)
      Sidebar.jsx                    — NEW: sidebar nav (uses Next.js <Link> instead of onClick)
      UserProfileDropdown.jsx        — NEW: extracted from StudyTrackerApp sidebar footer
    dashboard/
      page.jsx                       — renders DashboardView
    daily-tracker/
      page.jsx                       — renders DailyTrackerView
    resources/
      page.jsx                       — renders ResourcesView
    syllabus/
      page.jsx                       — renders SyllabusManagerView
      [id]/
        page.jsx                     — renders SyllabusView for a specific syllabus ID
```

### URL mapping

| Current activeTab value | New URL |
|---|---|
| `"dashboard"` | `/study-tracker/dashboard` |
| `"daily"` | `/study-tracker/daily-tracker` |
| `"syllabi"` | `/study-tracker/syllabus` |
| `"resources"` | `/study-tracker/resources` |
| `syl.id` (e.g. `"manual"`) | `/study-tracker/syllabus/manual` |

### State management across routes

The current design puts all state in `StudyTrackerApp` and passes it down as props. When split across routes, this breaks — each route would remount and lose state.

**Solution: React Context in the layout.**

```
study-tracker/layout.js
  → renders <StudyTrackerProvider>   (holds all useState, useEffect, sync logic)
      → renders <Sidebar />          (reads context for active path detection)
      → renders {children}           (each sub-route page reads from context)
```

The provider exposes:
```js
const StudyTrackerContext = createContext(null)
export const useTracker = () => useContext(StudyTrackerContext)
```

Each view component uses `useTracker()` instead of receiving props. This is a mechanical refactor — no logic changes.

### Active nav detection (from URL)

The sidebar currently compares `activeTab === id`. With real routes, use `usePathname()`:

```jsx
import { usePathname } from "next/navigation"
const pathname = usePathname()
const isActive = (href) => pathname === href || pathname.startsWith(href + "/")
```

Syllabus items: `/study-tracker/syllabus/${syl.id}` — active when `pathname === that URL`.

---

## 4. Component Migration Plan

### 4.1 — StudyTrackerApp.jsx → split into 3 pieces

**Keep as StudyTrackerProvider.jsx** (state + sync only, no JSX layout):
- All `useState`, `useEffect`, `useRef` for state/sync
- `updateState`, `syncToDb`, `showToast` functions
- `handleExport`, `handleImport`, `handleClearAll`
- Expose via context

**New Sidebar.jsx** (sidebar only):
- Replace `.st-sidebar` → `w-[252px] min-w-[252px] bg-white border-r border-[#e9eaed] flex flex-col h-full overflow-y-auto z-40 flex-shrink-0`
- Replace `.st-nav` → `list-none p-[10px] flex-1`
- Replace `.st-nav-sep` → `block text-[0.67rem] font-semibold tracking-[1.2px] text-[#c1c7d0] px-[10px] pt-[14px] pb-[5px] uppercase`
- Nav items use `<Link href="...">` + `usePathname()` for active detection
- Sidebar footer (login/user section) → extract to UserProfileDropdown.jsx using shadcn `DropdownMenu`

**New layout.js** (wraps both):
```jsx
export default function StudyTrackerLayout({ children }) {
  return (
    <StudyTrackerProvider>
      <div className="flex h-[calc(100vh-64px)] bg-[#f8f9fc] text-[#1a1d23] text-[15px] overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 h-full overflow-y-auto">
          <div className="p-7">{children}</div>
        </main>
      </div>
    </StudyTrackerProvider>
  )
}
```

### 4.2 — NavBtn.jsx → rewrite

Current problems:
- Invalid HTML: `<div><li><button>` — a `div` cannot be a child of `ul`, and `li` wraps a `button` which is fine but the outer `div` breaks it
- Uses CSS class string concatenation for active state

Migrated version (as part of Sidebar.jsx, or kept as NavBtn):
```jsx
import Link from "next/link"
import { cn } from "@/lib/utils"

export function NavBtn({ href, label, icon, badge, badgeStyle }) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + "/")
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-[9px] px-[10px] py-[9px] rounded-lg text-[14px] font-medium transition-all w-full",
          active ? "bg-[#eff2ff] text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:text-[#1a1d23]"
        )}
      >
        <span className="text-[1rem] flex-shrink-0">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="text-[0.68rem] font-semibold px-[7px] py-[2px] rounded-full font-mono flex-shrink-0" style={badgeStyle}>
            {badge}
          </span>
        )}
      </Link>
    </li>
  )
}
```

### 4.3 — UserProfileDropdown (extracted from StudyTrackerApp)

The profile dropdown in the sidebar footer currently uses ~15 inline style objects. Replace with shadcn `DropdownMenu`:

```jsx
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// Trigger: same st-user-btn visual → Tailwind classes
// Dropdown content: replaces the position:absolute div with DropdownMenuContent
// Logout item: replaces inline-styled button with DropdownMenuItem
```

Tailwind replacement for `.st-user-btn`:
```
flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-[#e9eaed] bg-white hover:bg-gray-50 transition-colors cursor-pointer
```

Tailwind replacement for `.st-user-avatar`:
```
w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0
```

### 4.4 — DashboardView.jsx

Two problems to solve:

**Problem 1: Chart.js CDN injection**

Install Chart.js as a proper dependency:
```bash
npm install chart.js
```
Then import directly:
```js
import { Chart, registerables } from "chart.js"
Chart.register(...registerables)
```
Remove the `document.createElement("script")` block entirely. This also removes the CDN network dependency and makes the bundle deterministic.

**Problem 2: CSS classes → Tailwind**

`.st-dash-header` → `mb-[22px]`
`.st-dash-header-row` → `flex items-center justify-between flex-wrap gap-3`
`.st-dash-title` → `text-[1.75rem] font-bold tracking-[-0.7px] text-gray-900`
`.st-dash-subtitle` → `text-gray-500 text-[0.9rem] mt-1`
`.st-dash-actions` → `flex gap-2`

Action buttons — replace `.st-action-btn` variants with shadcn `Button`:
```jsx
// Export
<Button onClick={onExport} className="bg-blue-600 hover:bg-blue-700 text-white text-[0.82rem] font-semibold">
  ⬇ Export
</Button>

// Import
<Button variant="outline" onClick={onImport} className="text-[0.82rem] font-semibold">
  ⬆ Import
</Button>

// Clear All — already uses AlertDialog, keep that, just fix trigger button
<AlertDialogTrigger asChild>
  <Button variant="destructive" className="bg-red-100 text-red-600 border border-red-300 hover:bg-red-200 text-[0.82rem] font-semibold">
    🗑 Clear All
  </Button>
</AlertDialogTrigger>
```

`.st-quick-stats` → `grid grid-cols-4 gap-3 mb-5`
`.st-quick-stat` → `rounded-xl p-4 border border-[#e9eaed] flex flex-col gap-px hover:shadow-md transition-shadow`
`.st-qs-value` → `text-[1.55rem] font-bold tracking-[-0.8px] font-mono leading-none`
`.st-qs-label` → `text-[0.7rem] font-semibold text-gray-500 uppercase tracking-[0.6px] mt-1`
`.st-qs-sub` → `text-[0.72rem] text-gray-400 mt-px`

`.st-overview-cards` → `grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 mb-[22px]`
`.st-ov-card` → `bg-white rounded-xl p-4 border border-[#e9eaed] border-t-[3px] cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all`
`.st-ov-icon` → `text-[1.6rem] mb-2.5`
`.st-ov-label` → `text-[0.68rem] font-semibold text-gray-400 uppercase tracking-[0.8px] mb-[3px]`
`.st-ov-pct` → `text-[1.9rem] font-bold tracking-[-1px] leading-none mb-[3px] font-mono`
`.st-ov-sub` → `text-[0.73rem] text-gray-400 mb-2.5`
`.st-ov-bar-wrap` → `h-1 bg-[#f0f1f4] rounded-full overflow-hidden`
`.st-ov-bar` → `h-full rounded-full transition-[width] duration-500`

`.st-charts-row` → `grid grid-cols-[1fr_2fr] gap-[14px] mb-[14px]`
`.st-charts-row-equal` → `grid grid-cols-[2fr_1fr] gap-[14px] mb-[14px]`
`.st-chart-card` → `bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px]`
`.st-chart-title` → `text-[0.875rem] font-semibold text-gray-700 mb-[14px]`
`.st-chart-subtitle` → `text-[0.73rem] font-normal text-gray-400 ml-[5px]`
`.st-pie-wrap` → `max-w-[260px] mx-auto`

`.st-recent-activity` → `bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px] mt-[14px]`
`.st-activity-day` → `flex flex-nowrap items-center gap-3 py-[9px] border-b border-gray-100 last:border-b-0`
`.st-act-date` → `text-[0.76rem] font-semibold text-gray-500 min-w-[96px] flex-shrink-0`
`.st-act-chips` → `flex flex-wrap gap-[6px] flex-1`
`.st-act-chip` → `text-[0.72rem] font-medium px-[10px] py-[3px] rounded-full whitespace-nowrap`
`.st-no-activity` → `text-gray-400 text-[0.86rem] text-center py-[18px]`

### 4.5 — DailyTrackerView.jsx

The bulk of this file is logic. CSS surface is moderate.

Key class replacements:
`.st-daily-*` classes → Tailwind equivalents following the same pattern above.
The date strip (7-day selector) and progress bar already use inline styles for dynamic colors — those stay as inline styles since they're data-driven.

The `CHECK_SVG` inline SVG is fine to keep — it's a custom checkmark not in any icon library.

Tabs (`"tasks"` | `"habits"`) — replace the custom tab buttons with shadcn `Tabs`:
```jsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
```

### 4.6 — SyllabusView.jsx

`.st-syl-header` → `bg-white rounded-[14px] border border-[#e9eaed] p-[20px_22px_16px] mb-[18px]`
`.st-syl-title-row` → `flex items-center gap-3`
`.st-syl-icon` → `text-[1.9rem] flex-shrink-0`
`.st-syl-title` → `text-[1.4rem] font-bold tracking-[-0.5px] text-gray-900`
`.st-syl-meta` → `text-[0.8rem] text-gray-400 mt-[3px]`
`.st-syl-ring-wrap` → `ml-auto relative flex-shrink-0 w-[68px] h-[68px]`
`.st-ring-pct` → `absolute inset-0 flex items-center justify-center text-[0.85rem] font-bold font-mono`
`.st-syl-bar-wrap` → `h-1 bg-[#f0f1f4] rounded-full overflow-hidden mt-4`
`.st-syl-bar` → `h-full rounded-full transition-[width] duration-500`
`.st-section-list` → `flex flex-col gap-[10px]`
`.st-section-card` → `bg-white border border-[#e9eaed] rounded-xl overflow-hidden`
`.st-section-header` → `flex justify-between items-center px-4 py-[13px] cursor-pointer hover:bg-[#fafafa] transition-colors select-none border-none bg-white w-full`
`.st-sec-title` → `text-[0.92rem] font-semibold text-gray-800`
`.st-sec-count` → `text-[0.76rem] font-semibold font-mono`
`.st-section-body` → `px-3 pb-3`
`.st-topic-card` → `border border-[#f0f1f4] rounded-[10px] mt-[9px] bg-[#fafbfc] transition-all overflow-hidden`
`.st-topic-card.done` → `bg-green-50 border-green-200` (via `cn()`)
`.st-topic-top` → `flex items-center gap-[9px] px-[13px] py-[10px]`
`.st-custom-check` → `w-5 h-5 border-2 border-gray-300 rounded-[5px] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer`
`.st-custom-check.checked` → border/bg set via `style={{ borderColor: sylColor, background: sylColor }}` — keep as inline style since it's data-driven (dynamic color per syllabus)
`.st-topic-title` → `flex-1 text-[0.875rem] font-medium text-gray-800 cursor-pointer transition-colors`
`.st-topic-title.done` → `line-through text-gray-400`
`.st-topic-expand-btn` → `bg-none border-none cursor-pointer text-[0.95rem] text-gray-400 w-6 h-6 rounded-[5px] flex items-center justify-center hover:bg-gray-100 hover:text-gray-700 transition-colors`
`.st-topic-details` → `px-[13px] pb-3 border-t border-[#f0f1f4]`
`.st-subtopic-item` → `flex items-center gap-[7px] cursor-pointer px-[5px] py-1 rounded-[6px] hover:bg-gray-100 transition-colors select-none`
`.st-subtopic-label` → `text-[0.8rem] text-gray-600 leading-[1.3]`

### 4.7 — SyllabusManagerView.jsx

This view mixes some shadcn imports with raw CSS classes. Finish the migration:
- Replace the raw `<input>`, `<button>`, `<select>` elements with shadcn `Input`, `Button`, `Select`
- Replace any remaining `.st-*` class references with Tailwind
- The color picker (for new syllabus) uses a color swatch grid — keep it as-is (it's just `grid grid-cols-4 gap-2`)

### 4.8 — ResourcesView.jsx

**Already fully migrated to shadcn/ui.** No changes needed.

### 4.9 — Toast notification

The current toast is a custom CSS `.st-toast` element managed by `useState`. Replace with `sonner` (already installed and configured globally):
```jsx
import { toast } from "sonner"
// Replace showToast("msg") calls with:
toast.success("msg")
toast.error("msg")
```
This eliminates the `toast` useState, the `setTimeout`, and the `.st-toast` CSS block entirely.

---

## 5. Code Optimisations

### 5.1 — Install Chart.js properly

```bash
npm install chart.js
```
Remove the CDN `<script>` injection in `DashboardView.jsx`. Import directly. This:
- Removes a runtime network request
- Makes Chart.js part of the module graph (tree-shakeable)
- Removes the `window.Chart` global check
- Fixes the issue where charts re-initialise on every state change (use a dependency array that only re-triggers on meaningful data changes)

### 5.2 — Memoise chart re-renders

Currently `useEffect([state])` destroys and recreates all 6 charts on any state change. Scope to specific derived values:
```js
useEffect(() => { renderCharts() }, [
  // Only relevant derived values, not the entire state object
  JSON.stringify(syllabusIds), JSON.stringify(progressSnapshot), JSON.stringify(dailySnapshot)
])
```
Or use `useMemo` to derive chart data separately from render logic.

### 5.3 — Eliminate `getTabTitle` dead function

`getTabTitle()` in `StudyTrackerApp.jsx` is defined but the `st-topbar` that uses it is commented out. Delete both.

### 5.4 — Fix NavBtn HTML structure

The current NavBtn renders `<div><li><button>`. A `div` as a direct child of `ul` is invalid HTML. The migrated version should render just `<li><Link>` with no wrapping `div`.

### 5.5 — Remove `dashboard/page.jsx` stub

`app/(study)/study-tracker/dashboard/page.jsx` is listed as deleted in the current git status. Confirm it is removed — the dashboard will be at the new sub-route location.

### 5.6 — Split DailyTrackerView

At ~400+ lines, DailyTrackerView mixes task management and habit management. These are independent feature areas. Consider extracting:
- `DailyTasksPanel.jsx` — the task list and add-task form
- `HabitsPanel.jsx` — the habit list, add-habit form, habit log toggle

Both would receive the same props/context slice they need.

### 5.7 — Lazy-load sub-route pages

Since views are now real routes, Next.js will code-split them automatically. No extra work needed — this is a free optimisation from switching to sub-routes.

### 5.8 — Remove inline styles where color is static

The sidebar footer dropdown currently uses 15 inline style objects for static, non-data-driven values (position, padding, border, etc.). These all become Tailwind classes. Only keep inline styles where the value comes from data (e.g., `style={{ borderTopColor: syl.color }}`).

---

## 6. Implementation Order

Do these in order — each step is independently shippable.

### Phase 1 — Sub-routes skeleton (no visual changes)
1. Create `StudyTrackerProvider.jsx` — extract all state/sync from `StudyTrackerApp.jsx` into a context provider
2. Rewrite `study-tracker/layout.js` to render the provider + sidebar shell + `{children}`
3. Create route pages: `dashboard/page.jsx`, `daily-tracker/page.jsx`, `resources/page.jsx`, `syllabus/page.jsx`, `syllabus/[id]/page.jsx`
4. Each page just renders its existing view component (e.g., `<DashboardView />`) pulling state from context
5. Rewrite `study-tracker/page.jsx` to redirect to `/study-tracker/dashboard`
6. Keep all CSS classes — no visual changes yet
7. Verify: all views render correctly, browser back/forward works, direct URL access works

### Phase 2 — Sidebar migration
1. Rewrite `NavBtn.jsx` to use `<Link>` + `usePathname()` for active detection
2. Migrate sidebar CSS classes to Tailwind in `layout.js`
3. Replace user profile dropdown inline styles with shadcn `DropdownMenu`
4. Delete now-unused CSS blocks from `study-tracker.css`

### Phase 3 — Font migration
1. Add `DM_Sans` and `DM_Mono` to `app/layout.js` via `next/font/google`
2. Remove the Google Fonts `@import` from `study-tracker.css`
3. Apply font variables via a wrapper class in `study-tracker/layout.js`

### Phase 4 — Dashboard migration
1. Install Chart.js: `npm install chart.js`
2. Rewrite chart initialisation to use `import { Chart }` instead of CDN injection
3. Fix `useEffect` dependency array to avoid destroying/recreating charts on every change
4. Migrate all `.st-dash-*`, `.st-quick-stat`, `.st-ov-*`, `.st-chart-*`, `.st-recent-activity` classes to Tailwind
5. Replace action buttons with shadcn `Button`

### Phase 5 — Remaining views
1. Migrate `DailyTrackerView.jsx` CSS classes to Tailwind (tabs → shadcn `Tabs`)
2. Migrate `SyllabusView.jsx` CSS classes to Tailwind
3. Migrate `SyllabusManagerView.jsx` remaining raw elements to shadcn
4. Migrate `DashboardView.jsx` toast calls to `sonner`

### Phase 6 — CSS cleanup
1. Remove `study-tracker.css` import from `page.jsx`
2. Delete `study-tracker.css`
3. Remove the `@import url('https://fonts.googleapis.com/...')` that was in it
4. Verify no `.st-*` class references remain in any component (grep check)

---

## 7. What Must NOT Change

These are constraints — do not alter them during migration:

- **Colors and visual design:** every color value listed in Section 2 must be preserved exactly. Use arbitrary Tailwind values (`bg-[#hexvalue]`) where Tailwind's named palette doesn't match precisely.
- **Sidebar width:** must remain `252px` exactly.
- **Chart.js chart types and configurations:** the 6 charts (Today's Tasks doughnut, Daily Task Completion line, Overall Progress doughnut, Topics Completed line, Progress by Syllabus bar, Completion Breakdown doughnut) must look identical.
- **`id` and `data-testid` attributes:** all automation testing attributes on elements (e.g., `id="user-profile-btn"`, `data-testid="logout-btn"`, `id="sidebar-login-btn"`) must be preserved on the equivalent migrated elements.
- **LocalStorage keys:** all `STORAGE_KEYS` in `studyTrackerStorage.js` — do not rename.
- **API endpoints:** `/api/tracker/state`, `/api/tracker/sync` — do not change.
- **State shape:** the state object structure (`syllabi`, `progress`, `custom`, `log`, `subtopics`, `daily`, `habits`, `habitLog`) must remain identical.
- **The `--syl-color` CSS variable pattern** on topic/subtopic checkboxes is data-driven (color comes from syllabus metadata). Keep as `style={{ borderColor, background }}` inline — not CSS.
- **DM Sans + DM Mono fonts** — the Study Tracker's typographic identity depends on these. Do not replace with Inter (the rest of the site font).

---

## 8. Grep Commands for Verification

After migration, run these to confirm cleanup is complete:

```bash
# No st-* classes should remain in JSX files
grep -r "st-" app/(study)/study-tracker --include="*.jsx" --include="*.js"

# No inline style objects for static values (dynamic colors are OK)
grep -r "style={{" app/(study)/study-tracker --include="*.jsx"

# No window.Chart CDN check remaining
grep -r "window.Chart\|cdn.jsdelivr" app/(study)/study-tracker --include="*.jsx"

# All data-testid attributes preserved
grep -r "data-testid" app/(study)/study-tracker --include="*.jsx"
```

---

## 9. File Change Summary

| File | Action |
|---|---|
| `study-tracker/study-tracker.css` | Delete (after Phase 6) |
| `study-tracker/page.jsx` | Rewrite to redirect |
| `study-tracker/layout.js` | Rewrite — sidebar shell + provider mount |
| `study-tracker/_components/StudyTrackerApp.jsx` | Rewrite → becomes `StudyTrackerProvider.jsx` |
| `study-tracker/_components/NavBtn.jsx` | Rewrite — Link-based, Tailwind classes |
| `study-tracker/_components/DashboardView.jsx` | Migrate CSS → Tailwind, fix Chart.js loading |
| `study-tracker/_components/DailyTrackerView.jsx` | Migrate CSS → Tailwind |
| `study-tracker/_components/SyllabusView.jsx` | Migrate CSS → Tailwind |
| `study-tracker/_components/SyllabusManagerView.jsx` | Complete shadcn migration |
| `study-tracker/_components/ResourcesView.jsx` | No changes needed |
| `study-tracker/_components/Sidebar.jsx` | New file |
| `study-tracker/_components/UserProfileDropdown.jsx` | New file |
| `study-tracker/_components/StudyTrackerProvider.jsx` | New file |
| `study-tracker/dashboard/page.jsx` | New file |
| `study-tracker/daily-tracker/page.jsx` | New file |
| `study-tracker/resources/page.jsx` | New file |
| `study-tracker/syllabus/page.jsx` | New file |
| `study-tracker/syllabus/[id]/page.jsx` | New file |
| `app/layout.js` | Add DM_Sans + DM_Mono font imports |
