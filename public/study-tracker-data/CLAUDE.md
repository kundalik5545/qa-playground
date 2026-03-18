# QA Study Tracker — Project Guide for Claude

## What This Project Is

A **single-page, vanilla JS study tracker** for QA engineers learning Manual Testing, Automation Testing, API Testing, and Playwright. No build tools, no frameworks, no bundlers. Everything runs directly in the browser by opening `index.html`.

---

## File Structure

```
d:\Planning\Study Tracker\
├── index.html      # Shell: sidebar nav, topbar, #tab-content mount point
├── app.js          # All application logic (~1600 lines)
├── syllabus.js     # Seed data: DEFAULT_SYLLABUS_DATA constant (read-only defaults)
└── styles.css      # All styles (~1150 lines)
```

There is no `package.json`, no node_modules, no build step. Do not suggest adding them unless explicitly asked.

---

## Tech Stack

| Layer       | Choice                          |
|-------------|----------------------------------|
| HTML        | Plain HTML5, no templating       |
| CSS         | Vanilla CSS, no preprocessors    |
| JS          | Vanilla ES6+, no frameworks      |
| Charts      | Chart.js 4.4.0 via CDN           |
| Fonts       | Google Fonts — DM Sans + DM Mono |
| Persistence | `localStorage` only              |

**No TypeScript, no React, no Vue, no npm.** Keep it that way unless the user explicitly requests a change.

---

## Design System

### Colors
- **Background:** `#f8f9fc` (body), `#ffffff` (cards/sidebar)
- **Border:** `#e9eaed` (default), `#f0f1f4` (subtle)
- **Text primary:** `#1a1d23`
- **Text secondary:** `#6b7280`, `#9ca3af`
- **Blue accent:** `#2563eb` (primary actions, links, active states)
- **Green success:** `#10b981` (completions, done states)
- **Purple habits:** `#7c3aed` (recurring habits feature)
- **Amber analytics:** `#f59e0b` (daily task charts)
- **Red danger:** `#dc2626` (error toasts, delete)

### Syllabus-specific colors (defined in `syllabus.js`)
- Manual Testing: `#2563eb`
- Automation Testing: `#7c3aed`
- API Testing: `#059669`
- Playwright: `#dc2626`

### Typography
- **Body font:** `'DM Sans', sans-serif` — used everywhere
- **Monospace font:** `'DM Mono', monospace` — used for numbers, badges, percentages
- Base font size: `15px` on `html`
- Headings: `dash-title` = 1.75rem/700, `syl-title` = 1.45rem/700, `chart-title` = 0.88rem/600
- Labels (uppercase caps): `0.75rem`, `600`, `text-transform: uppercase`, `letter-spacing: 0.5px`

### Spacing / Radius
- Card padding: `18–22px`
- Card border-radius: `12–14px`
- Button border-radius: `7–9px`
- Pill/badge border-radius: `20px` (fully rounded)
- Standard gap between grid items: `14–20px`
- Tab content padding: `28px` (desktop), `16px` (mobile)

### Elevation
- Cards: `border: 1px solid #e9eaed` — no box-shadow by default
- Hover lift: `box-shadow: 0 4px 18px rgba(0,0,0,0.07); transform: translateY(-1px)`
- Active filter tab: `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`

### Animations
- Page tab transitions: `fadeUp` keyframe (opacity 0→1, translateY 8px→0, 0.22s ease)
- Progress bars: `transition: width 0.5–0.6s ease`
- Interactive states: `transition: all 0.15s` on most interactive elements

---

## localStorage Keys

| Constant        | Key                        | Value shape                                              |
|-----------------|----------------------------|----------------------------------------------------------|
| `STORAGE_KEY`   | `qa_tracker_progress`      | `{ topicId: { done: bool, date: "YYYY-MM-DD" } }`       |
| `CUSTOM_KEY`    | `qa_tracker_custom`        | `{ topicId: { notes: string, resources: [{label,url}] } }` |
| `LOG_KEY`       | `qa_tracker_log`           | `[{ date, tabId, count }]`                               |
| `SUBTOPIC_KEY`  | `qa_tracker_subtopics`     | `{ topicId: { 0: bool, 1: bool, ... } }`                 |
| `DAILY_KEY`     | `qa_tracker_daily`         | `{ "YYYY-MM-DD": [{id, title, timeMin, done}] }`         |
| `HABITS_KEY`    | `qa_tracker_habits`        | `[{id, title, timeMin, recurrence, customDays, startDate, endDate, active}]` |
| `HABIT_LOG_KEY` | `qa_tracker_habit_log`     | `{ "YYYY-MM-DD": { "habit-id": bool } }`                 |
| `SYLLABUS_KEY`  | `qa_tracker_syllabi`       | `{ [id]: { id, label, icon, color, sections: [...] } }`  |

---

## Application State (`app.js`)

```js
// Dynamic syllabus data — loaded from localStorage, seeded from DEFAULT_SYLLABUS_DATA on first run
let SYLLABUS_DATA = {};
let sylMgrExpanded = null;  // syllabusId currently expanded in Syllabus Manager

let state = {
  progress:  {},  // topic completion + date
  custom:    {},  // per-topic notes & resource links
  log:       [],  // activity log for Recent Activity panel
  subtopics: {},  // per-subtopic checkbox state
  daily:     {},  // one-off daily tasks per date
  habits:    [],  // recurring habit definitions
  habitLog:  {},  // habit completion per date
};

let selectedDate     = "";          // currently viewed date in Daily Tracker
let dailyFilterMode  = "weekly";    // "weekly" | "monthly" for analytics
let currentDailyView = "tasks";     // "tasks" | "habits" — active view tab
let habitForm = { recurrence, customDays, duration, startDate, endDate };
```

---

## Page / Tab Architecture

Tabs are built dynamically by `buildTabs()` on DOMContentLoaded. Each tab is a `<div id="tab-{id}" class="tab-pane">`. Only one has `class="active"` at a time. `setActiveTab(tabId)` switches them.

| Tab ID      | Content                              | Triggered render             |
|-------------|--------------------------------------|------------------------------|
| `dashboard` | Charts, overview cards, activity log | `renderDashboard()`          |
| `daily`     | Daily tasks + habits tracker         | `renderDailyTracker()`       |
| `syllabi`   | Syllabus Manager (CRUD)              | `renderSyllabusManager()`    |
| `manual`    | Manual Testing syllabus              | Built once, updated on check |
| `automation`| Automation Testing syllabus          | Built once, updated on check |
| `api`       | API Testing syllabus                 | Built once, updated on check |
| `playwright`| Playwright syllabus                  | Built once, updated on check |
| `syl-*`     | User-created syllabi (dynamic IDs)   | `rebuildSyllabusTab(id)`     |

---

## Syllabus Data Structure

```js
// Shape used in both DEFAULT_SYLLABUS_DATA (syllabus.js) and SYLLABUS_DATA (localStorage)
SYLLABUS_DATA = {
  [tabId]: {
    id: string,
    label: string,
    icon: string,         // emoji
    color: string,        // hex color for this syllabus
    sections: [{
      id: string,
      title: string,
      topics: [{
        id: string,       // e.g. "m-t1", "a-t4", "pw-t3", or "t-syl1-abc123" for user-created
        title: string,
        subtopics: string[],  // displayed as interactive checklist
        resources: [],        // always [] in static data; user adds via UI
      }]
    }]
  }
}
```

**`syllabus.js`** holds `DEFAULT_SYLLABUS_DATA` — the seed data loaded on first run only. Never mutate this file at runtime.

**`SYLLABUS_DATA`** (module-level `let` in `app.js`) is the live copy read from `qa_tracker_syllabi` in localStorage. All runtime reads/writes go through this variable + `saveSyllabi()`.

**To add a new syllabus at runtime:** use the Syllabus Manager UI (📚 tab). To add one to the seed defaults, add an entry to `DEFAULT_SYLLABUS_DATA` in `syllabus.js` — it only applies on first ever load (before localStorage is populated).

---

## Key Functions Reference

### State / Storage
- `loadState()` — reads all localStorage keys into `state`; seeds `SYLLABUS_DATA` from `DEFAULT_SYLLABUS_DATA` on first run
- `saveProgress()`, `saveCustom()`, `saveLog()`, `saveSubtopics()`, `saveDaily()`, `saveHabits()`, `saveHabitLog()` — individual save functions; call the specific one after mutations
- `saveSyllabi()` — persists `SYLLABUS_DATA` to `qa_tracker_syllabi`

### Dashboard
- `renderDashboard()` — calls all chart renders + overview cards + activity list
- `updateDashboardIfVisible()` — calls `renderDashboard()` only when dashboard tab is active
- `renderLineChart()` — reads from `state.progress` dates (NOT log) so unchecked topics are excluded

### Syllabus
- `getTabStats(tabId)` → `{ total, done, pct }` — used everywhere for progress
- `refreshSyllabusHeader(tabId)` — updates the ring/bar/meta without full re-render

### Topics
- `toggleTopic(checkbox)` — marks done, syncs all subtopics, logs activity
- `toggleSubtopic(topicId, index, total)` — marks subtopic; auto-checks main topic when all subtopics done
- `toggleTopicDetails(topicId)` — expand/collapse notes + subtopics panel (also triggered by clicking the title)

### Daily Tracker
- `renderDailyTracker()` — entry point; dispatches to tasks or habits view
- `switchDailyView(view, btn)` — toggles between "tasks" and "habits" views
- `renderTaskList()` — renders habit section + daily task section for `selectedDate`
- `habitAppliesOnDate(habit, dateStr)` — core recurrence check logic
- `addHabit()` — reads `habitForm` state + form inputs, creates habit
- `computeHabitEndDate(startDate, duration)` — returns end date string or null

### Syllabus Manager
- `renderSyllabusManager()` — re-renders the full manager list into `#syl-mgr-list`
- `buildSylMgrCard(syl)` — card HTML for one syllabus (collapsed or expanded)
- `buildSylMgrEditBody(syl)` — expanded edit panel: metadata form + sections tree
- `buildSylMgrSection(syl, sec)` — one section row with topics list
- `buildSylMgrTopic(syl, sec, topic)` — one topic row with inline editor
- `toggleSylMgrExpand(syllabusId)` — toggle edit mode; updates `sylMgrExpanded`
- `openNewSyllabusForm()` — renders inline creation form into `#new-syl-form-area`
- `createNewSyllabus()` — creates syllabus from form, adds tab + nav entry
- `saveSyllabusMetadata(id)` — saves label/icon/color changes in-place
- `deleteSyllabus(id)` — removes from `SYLLABUS_DATA`, DOM, and nav
- `exportSyllabusData(id)` — downloads single syllabus as `qa-syllabus-{id}-DATE.json`
- `addSection(syllabusId)` / `deleteSection(syllabusId, sectionId)` — section CRUD
- `startSectionRename(syllabusId, sectionId)` / `saveSectionRename(...)` — inline DOM swap for rename
- `reRenderSylMgrSections(syllabusId)` — re-renders only the sections subtree (avoids full page re-render)
- `addTopic(syllabusId, sectionId)` / `deleteTopicMgr(...)` / `saveTopicTitleMgr(...)` — topic CRUD
- `toggleTopicEditorMgr(topicId)` — collapse/expand inline topic editor
- `addSubtopicMgr(...)` / `deleteSubtopicMgr(...)` — subtopic CRUD
- `reRenderSubtopicsContainer(syllabusId, sectionId, topicId)` — re-renders subtopic tag chips only
- `rebuildSyllabusTab(syllabusId)` — rebuilds `#tab-{id}` innerHTML from current `SYLLABUS_DATA`; creates tab element if missing

### Export / Import
- `exportData()` — full backup of all 8 localStorage keys (incl. `syllabi`) → `qa-tracker-DATE.json`
- `importData()` — restores all keys incl. syllabi, rebuilds UI
- `exportTasksData()` — tasks-only export with embedded analytics → `qa-tasks-analytics-DATE.json`
- `importTasksData()` — validates `type: "qa-tracker-tasks"` before importing
- `computeTasksAnalytics()` — calculates per-habit rates, streaks, daily breakdown

---

## CSS Patterns to Follow

### Adding a new card/panel
```css
.my-card {
  background: #fff;
  border: 1px solid #e9eaed;
  border-radius: 14px;
  padding: 20px 22px;
}
```

### Adding a new pill/tag
```css
.my-pill {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
  /* Color: use inline style or a specific class like .habit-recur-badge */
}
```

### Adding a new action button
```css
.my-btn {
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
```

### Section label (uppercase)
```css
.notes-label {  /* reuse this class */
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### Responsive breakpoints
- `@media (max-width: 960px)` — collapse two-column grids to one column
- `@media (max-width: 900px)` — charts row collapses
- `@media (max-width: 700px)` — mobile: sidebar becomes off-canvas, hamburger appears, padding reduces

---

## HTML Template Conventions

- Tab panes: `<div id="tab-{id}" class="tab-pane">` — `active` class added by JS
- Sections in syllabus: `id="sec-{sectionId}"`, body: `id="secbody-{sectionId}"`, chevron: `id="chev-{sectionId}"`
- Topic cards: `id="topic-{topicId}"`, detail panel: `id="details-{topicId}"`, expand button: `id="topicexp-{topicId}"`
- Resources list: `id="res-{topicId}"`
- Charts: `id="chart-pie"`, `id="chart-line"`, `id="chart-bar"`, `id="chart-doughnut"`, `id="chart-daily-pie"`, `id="chart-daily-line"`, `id="chart-daily-progress"`, `id="chart-daily-time-pie"`, `id="chart-daily-bar"`, `id="chart-habit-bar"`, `id="chart-habit-week"`
- Always use `escHtml(str)` before inserting user-controlled strings into innerHTML

### Syllabus Manager IDs (prefix `smgr-` / `sme-` / `smcard-` / `sms-` / `smtopic-` / `smte-` / `smts-`)
- Manager list: `id="syl-mgr-list"`, new-form area: `id="new-syl-form-area"`
- Syllabus card: `id="smcard-{syllabusId}"`
- Edit body inputs: `id="sme-label-{id}"`, `id="sme-icon-{id}"`, `id="sme-color-{id}"`
- Sections container: `id="sme-sections-{syllabusId}"`; new-section input: `id="smgr-new-sec-{syllabusId}"`
- Section row: `id="sms-{sectionId}"`; title span: `id="smgr-sec-title-{sectionId}"`; rename btn: `id="smgr-rename-btn-{sectionId}"`; rename input (transient): `id="smgr-sec-input-{sectionId}"`
- New-topic input per section: `id="smt-new-{sectionId}"`
- Topic row: `id="smtopic-{topicId}"`; editor panel: `id="smte-{topicId}"`; title input: `id="smte-title-{topicId}"`
- Subtopics container: `id="smts-{topicId}"`; new-subtopic input: `id="smst-new-{topicId}"`

---

## Chart.js Usage Patterns

All charts are destroyed before re-render using the module-level variables (`pieChart`, `lineChart`, etc.). Pattern:
```js
if (myChart) myChart.destroy();
myChart = new Chart(ctx, { ... });
```

`destroyAllCharts()` clears all chart variables at once (used during import).

Common options used:
- `font: { family: "'DM Sans', sans-serif" }` on all tick/legend labels
- `font: { family: "'DM Mono', monospace" }` for percentage ticks
- `borderRadius: 4–6` on bar datasets
- `tension: 0.35`, `fill: true` on line charts
- `spanGaps: true` on line charts with null data points

---

## Coding Conventions

- **No classes/OOP** — everything is functions and module-level `let` variables
- **Inline event handlers** in HTML strings (`onclick="fn()"`) — this is intentional for the dynamic-render pattern
- **`escHtml(str)`** — always sanitize before innerHTML insertion
- **`formatMinutes(min)`** — use for all time display (`0m`, `30m`, `1h 15m`)
- **`formatDate(str)`** — for activity log dates (`Mon, 18 Mar`)
- **`getTodayStr()`** — always use this for today's date string (`YYYY-MM-DD`)
- Section comments use `// ─── SECTION NAME ───` pattern with em-dashes
- Keep chart render functions pure: read from `state`, create Chart, return nothing

---

## Features Implemented

- [x] Syllabus tabs (Manual, Automation, API, Playwright) with collapsible sections
- [x] Topic checkboxes with custom styled check marks (per-syllabus color)
- [x] Subtopic checklists — checking all subtopics auto-checks the main topic
- [x] Click topic title to expand notes/subtopics/resources panel
- [x] Per-topic notes (textarea, saves on blur)
- [x] Per-topic resource links (label + URL, deletable chips)
- [x] Dashboard with 6 charts: pie, line (topics/14d), bar (by syllabus), doughnut, daily-pie, daily-line
- [x] Overview cards (overall + per syllabus) with progress bars
- [x] Recent activity log
- [x] Full data export/import (JSON backup of all state, including syllabi)
- [x] Daily Tracker — one-off tasks per date with time allocation
- [x] Daily Tracker — recurring habits (Daily/Weekdays/Weekends/Custom days, configurable duration)
- [x] Date strip navigation (±3 days), date picker, Prev/Next/Today buttons
- [x] Task/habit analytics — completion rate line chart, time pie, tasks-per-day bar, summary cards
- [x] Habits Manager — create/delete habits, per-habit completion rate bar + weekly habit chart
- [x] Tasks analytics export/import (separate from full backup, includes computed analytics)
- [x] Toast notifications for export/import feedback
- [x] Responsive layout (mobile sidebar with hamburger)
- [x] **Syllabus Manager** — create, edit, delete syllabi stored in localStorage
  - Add/rename/delete sections within any syllabus
  - Add/edit/delete topics within sections
  - Add/delete subtopics within topics
  - Export any single syllabus as `qa-syllabus-{id}-DATE.json`
  - Default syllabi seeded from `DEFAULT_SYLLABUS_DATA` on first load; user edits persist independently

---

## Known Patterns / Gotchas

- **Import rebuilds tabs**: `importData()` clears `#tab-content`, calls `buildTabs()` + `buildNav()` + `setActiveTab("dashboard")`. Chart variables must be nulled before this — `destroyAllCharts()` handles it.
- **Line chart uses `state.progress` not `state.log`**: So unchecking a topic correctly removes it from the daily count. The `state.log` array is only used for the Recent Activity list.
- **Habit recurrence check**: `habitAppliesOnDate(habit, dateStr)` is the single source of truth. It checks `startDate`, `endDate`, and recurrence pattern. Call this anywhere you need to know if a habit is active on a day.
- **`habitForm` is a module-level object** updated by the pill/toggle click handlers. It must be read inside `addHabit()` — not at form build time.
- **Chart canvas IDs are fixed** — they live inside `buildDashboardHTML()` / `renderDailyAnalytics()` / `buildDailyTrackerHTML()`. If you add a new chart, add its canvas in the appropriate HTML builder and a module-level variable for the Chart instance.
- **`SYLLABUS_DATA` is a mutable `let`** — not `const`. Always read it at call time; never cache it in a closure. After any mutation call `saveSyllabi()`.
- **`DEFAULT_SYLLABUS_DATA` is seed-only** — it lives in `syllabus.js` and is only read once (when `qa_tracker_syllabi` doesn't exist in localStorage). Never write to it at runtime.
- **Syllabus Manager re-render strategy**: structural changes (add/delete section or topic) call `reRenderSylMgrSections(syllabusId)` to refresh just the sections subtree. Full `renderSyllabusManager()` is only called when the card list itself changes (new/deleted syllabus, toggle expand). This avoids losing `sylMgrExpanded` state.
- **`rebuildSyllabusTab(id)`** creates the tab DOM element if it doesn't exist yet (used for newly created syllabi). Safe to call any time after mutating `SYLLABUS_DATA`.
- **`refreshNavBadges()` skips `syllabi`** tab — it has no badge. The skip list is `dashboard`, `daily`, `syllabi`.
