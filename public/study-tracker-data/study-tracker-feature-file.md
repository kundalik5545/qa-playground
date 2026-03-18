# CLAUDE.md — QA Study Tracker

> Drop this file in the project root. Claude (VS Code extension / Claude Code CLI) reads it
> automatically at the start of every session, giving full project context with no re-explaining.

---

## Project Overview

**Name:** QA Study Tracker  
**Purpose:** Personal study progress tracker for a QA engineer learning Manual Testing, Automation Testing, API Testing, and Playwright. Tracks topic completion, notes, resource links, and daily activity with a visual dashboard.  
**Audience:** Solo use (Kundalik) — no auth, no backend, no deployment pipeline needed.  
**Status:** Active / in progress. API and Playwright syllabi are placeholders; more topics will be added.

---

## File Structure

```
qa-tracker/
├── index.html        # HTML shell — mounts #app div, loads scripts in order
├── styles.css        # All styling — reset, layout, components, responsive
├── app.js            # All application logic — rendering, state, charts, events
├── syllabus-data.js  # All syllabus content — edit ONLY this file to add topics
└── CLAUDE.md         # This file
```

### Rules

- **Never split app.js** into multiple files unless explicitly asked
- **Never hardcode syllabus content** in app.js or index.html
- **All topic/section/syllabus additions** go into `syllabus-data.js` only
- **No subdirectories** — all files stay flat in project root
- **No npm, no bundler, no build step** — plain HTML/CSS/JS loaded directly in browser

---

## Tech Stack

| Concern         | Choice                           |
| --------------- | -------------------------------- |
| Language        | Vanilla JavaScript (ES6+)        |
| Styling         | Plain CSS (no preprocessor)      |
| Charts          | Chart.js 4.4.0 via CDN           |
| Fonts           | Google Fonts CDN                 |
| Storage         | `localStorage` only — no backend |
| Build tools     | None                             |
| Package manager | None                             |

### CDN Scripts (loaded in index.html)

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

---

## Design System

### Theme

- **Mode:** Light only — no dark mode
- **Feel:** Clean, minimal, data-dense. Editorial / utilitarian — not playful.

### Color Tokens

| Token              | Value     | Usage                                  |
| ------------------ | --------- | -------------------------------------- |
| Background         | `#F7F8FA` | `body` background                      |
| Surface            | `#FFFFFF` | Cards, sidebar, topbar                 |
| Border             | `#E8EAED` | All card/component borders             |
| Border subtle      | `#F0F2F5` | Inner borders, row separators          |
| Text primary       | `#1C1F26` | Body text, headings                    |
| Text heading dark  | `#0F1117` | h1 elements                            |
| Text secondary     | `#4B5563` | Nav items, secondary labels            |
| Text muted         | `#8D94A5` | Descriptions, captions                 |
| Text placeholder   | `#C4C9D4` | Input placeholders, empty states       |
| Primary blue       | `#0066FF` | Brand color, active states, nav active |
| Primary blue light | `#EBF2FF` | Active nav background, accent bg       |
| Success green      | `#10B981` | Completion date, done indicators       |
| Error red          | `#EF4444` | Delete hover, error input border       |
| Error bg           | `#FEF2F2` | Delete button hover background         |

### Per-Syllabus Colors (defined in `syllabus-data.js`)

| Syllabus   | `color`   | `accentLight` |
| ---------- | --------- | ------------- |
| Manual     | `#0066FF` | `#EBF2FF`     |
| Automation | `#7C3AED` | `#F0EBFF`     |
| API        | `#059669` | `#ECFDF5`     |
| Playwright | `#DC2626` | `#FEF2F2`     |

These are passed as CSS custom properties `--c` and `--ca` on component wrappers.

### Typography

| Font            | Import       | Usage                              |
| --------------- | ------------ | ---------------------------------- |
| Instrument Sans | Google Fonts | All body text, UI, labels          |
| JetBrains Mono  | Google Fonts | Numbers, percentages, badges, KPIs |

```css
@import url("https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap");
```

**Font sizes:**

- h1 dashboard: `1.7rem`, weight `700`, letter-spacing `-.6px`
- h1 syllabus: `1.45rem`, weight `700`, letter-spacing `-.5px`
- Section title: `.9rem`, weight `600`
- Topic title: `.875rem`, weight `600`
- Body / descriptions: `.82–.88rem`, weight `400–500`
- Labels/captions: `.7–.78rem`, weight `500–700`
- Monospace numbers: `JetBrains Mono`

### Spacing & Shape

| Property      | Values                                                              |
| ------------- | ------------------------------------------------------------------- |
| Border-radius | `6px` small, `8–9px` inputs/chips, `12px` cards, `14px` large cards |
| Card padding  | `16–20px`                                                           |
| Section gap   | `10px`                                                              |
| Page padding  | `26–28px` desktop, `16px` mobile                                    |

### Scrollbar

```css
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 99px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
```

---

## Layout Architecture

```
body (flex row)
├── #sidebar (sticky, 252px wide)
│   ├── .sb-brand
│   ├── .sb-nav (nav buttons)
│   └── .sb-footer (overall %)
└── #main (flex-1)
    ├── #topbar (sticky, 54px tall)
    └── #mc (scrollable content)
        ├── #view-dashboard  (.main-view)
        └── #view-{id}       (.main-view) × N syllabi
```

**Active view:** Only one `.main-view` has class `.active` at a time — others are `display:none`.  
**Sidebar mobile:** `position:fixed`, `transform:translateX(-100%)`, toggled by `.open` class.  
**Overlay:** `#overlay` covers content on mobile when sidebar is open.

---

## JavaScript Architecture (`app.js`)

### State Object

```js
const appState = {
  activeView: "dashboard", // string — current view id
  progress: {}, // see Progress Record below
  dailyLog: {}, // see Daily Log below
  expanded: {}, // { [sectionId]: boolean }
};
```

### localStorage Keys

| Constant key       | localStorage key | Contains                  |
| ------------------ | ---------------- | ------------------------- |
| `STORAGE.progress` | `qat_progress`   | All topic state           |
| `STORAGE.dailyLog` | `qat_daily_log`  | Daily activity            |
| `STORAGE.expanded` | `qat_expanded`   | Section open/closed state |

### Progress Record Shape

```js
appState.progress = {
  "topic-id": {
    completed: Boolean, // true/false
    completedAt: String | null, // ISO timestamp e.g. "2025-03-18T10:00:00.000Z"
    notes: String, // free text, saved on textarea blur
    resources: [
      { id: Number, label: String, url: String },
      // id is Date.now() at time of creation — used as unique key for deletion
    ],
  },
};
```

### Daily Log Shape

```js
appState.dailyLog = {
  "YYYY-MM-DD": {
    syllabusId: Number, // count of topics completed that day in that syllabus
  },
};
```

### Key Functions

| Function                           | Purpose                                                           |
| ---------------------------------- | ----------------------------------------------------------------- |
| `init()`                           | Entry point — loads state, builds HTML, renders                   |
| `loadState()`                      | Reads all 3 localStorage keys into `appState`                     |
| `saveProgress()`                   | Writes `appState.progress` to localStorage                        |
| `saveDailyLog()`                   | Writes `appState.dailyLog` to localStorage                        |
| `saveExpanded()`                   | Writes `appState.expanded` to localStorage                        |
| `goTo(view)`                       | Switches active view, updates nav, re-renders dashboard if needed |
| `toggleTopic(topicId, sylId)`      | Flips completed state, logs activity, updates all UI              |
| `toggleSection(secId)`             | Expands/collapses section, persists state                         |
| `toggleDetail(topicId)`            | Expands/collapses topic detail panel                              |
| `saveNote(topicId, val)`           | Saves textarea content on blur                                    |
| `addResource(topicId, label, url)` | Adds resource entry, returns bool success                         |
| `removeResource(topicId, resId)`   | Filters out resource by id                                        |
| `handleAddRes(topicId)`            | UI handler — reads inputs, calls addResource, rerenders           |
| `handleRemoveRes(topicId, resId)`  | UI handler — calls removeResource, rerenders                      |
| `rerenderResList(topicId)`         | Replaces `#rlist-{topicId}` innerHTML                             |
| `syllabusStats(id)`                | Returns `{total, completed, pct}` for one syllabus                |
| `allStats()`                       | Returns `{total, completed, pct}` across all syllabi              |
| `logActivity(syllabusId, delta)`   | Increments/decrements today's log count                           |
| `refreshDashboard()`               | Re-renders all 4 charts + stats + KPIs                            |
| `refreshTopicUI(topicId)`          | Updates topic row DOM without full re-render                      |
| `refreshSyllabusHeader(sylId)`     | Updates ring, bar, pct, section counters                          |
| `refreshNavBadge(sylId)`           | Updates `[data-nav-badge]` element                                |
| `buildShell()`                     | Returns full sidebar + topbar + dashboard HTML                    |
| `buildSyllabusView(sylId)`         | Returns HTML for one syllabus view                                |
| `buildSection(sec, syl)`           | Returns HTML for one collapsible section                          |
| `buildTopic(topic, syl)`           | Returns HTML for one topic row + detail panel                     |
| `buildResList(topicId, color)`     | Returns resource list HTML                                        |
| `esc(s)`                           | XSS-safe HTML escape using DOM                                    |
| `todayStr()`                       | Returns `YYYY-MM-DD` for today                                    |
| `fmtDate(s)`                       | Formats date string to `"18 Mar"` format (en-IN locale)           |
| `last14Days()`                     | Returns array of 14 date strings ending today                     |
| `setText(id, val)`                 | Safe `getElementById` + `textContent` setter                      |
| `killChart(k)`                     | Destroys Chart.js instance from `charts` map                      |

### Chart Instances

Stored in `const charts = {}` map — keys: `'donut'`, `'radar'`, `'line'`.  
Always call `killChart(key)` before re-creating a chart to avoid canvas reuse error.

### Chart Configs

| Chart | Type       | Canvas ID | Data source                                                        |
| ----- | ---------- | --------- | ------------------------------------------------------------------ |
| Donut | `doughnut` | `c-donut` | Completed topics per syllabus                                      |
| Radar | `radar`    | `c-radar` | % complete per syllabus                                            |
| Line  | `line`     | `c-line`  | `appState.dailyLog` last 14 days, one dataset per syllabus + Total |

All charts use `font-family: 'Instrument Sans'` in ticks/legend labels.

---

## Data Structure (`syllabus-data.js`)

### Global Variable

```js
const SYLLABI = { manual: {...}, automation: {...}, api: {...}, playwright: {...} }
```

### Syllabus Object Shape

```js
{
  id:          String,   // matches key in SYLLABI, e.g. "manual"
  title:       String,   // display name e.g. "Manual Testing"
  icon:        String,   // SVG string for sidebar nav
  color:       String,   // hex, used for progress bars, badges, charts
  accentLight: String,   // light hex bg, used for section header, nav active
  sections: [Section]
}
```

### Section Object Shape

```js
{
  id:     String,   // unique e.g. "m-s1" — used for DOM id and localStorage key
  title:  String,   // display name
  topics: [Topic]
}
```

### Topic Object Shape

```js
{
  id:          String,    // unique e.g. "m-t1" — primary key in appState.progress
  title:       String,    // display name
  description: String,    // one-line description shown below title
  subtopics:   String[],  // shown as chips in detail panel
  resources:   []         // always empty array in source — runtime data goes to localStorage
}
```

### Adding a New Syllabus

1. Add a new key to `SYLLABI` in `syllabus-data.js` following the shape above
2. Choose unique `id`, `color`, and `accentLight`
3. Create an SVG icon string for the `icon` field
4. That's it — `app.js` reads `SYLLABI` dynamically, no other file changes needed

### Adding Topics to Existing Syllabus

1. Open `syllabus-data.js`
2. Find the right section under the right syllabus key
3. Push a new topic object to `topics[]`
4. Give it a globally unique `id` string (convention: `"{syllabus-prefix}-t{n}"`)

---

## CSS Component Reference

### Sidebar Components

| Class             | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `.sb-brand`       | Logo + name row at top of sidebar                        |
| `.sb-logo`        | 36×36 blue rounded square with SVG icon                  |
| `.sb-nav`         | `<nav>` wrapper, `padding: 10px`                         |
| `.nav-sep`        | Section separator label (uppercase, muted, `0.65rem`)    |
| `.nav-btn`        | Full-width nav button, `flex`, `9px 10px` padding        |
| `.nav-btn.active` | `background:#EEF3FF`, `color:#0066FF`                    |
| `.nav-icon-wrap`  | SVG icon container, `color:#8D94A5`                      |
| `.nav-badge`      | Percentage badge, `JetBrains Mono`, `border-radius:20px` |
| `.sb-footer`      | Overall % at bottom of sidebar                           |

### Dashboard Components

| Class           | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `.dash-wrap`    | Page container, `padding:28px`, `max-width:1100px`             |
| `.dash-hero`    | Title + KPI row, flex space-between                            |
| `.kpi`          | KPI card, `min-width:90px`, white, bordered                    |
| `.kpi-val`      | Large number in `JetBrains Mono`                               |
| `.dc-cards-row` | 4-col grid of syllabus cards                                   |
| `.dc-card`      | Clickable syllabus card, `border-top:3px solid var(--cc)`      |
| `.charts-grid`  | 2-col grid for chart cards                                     |
| `.chart-card`   | White bordered card, `padding:18px 20px`                       |
| `.chart-span2`  | `grid-column:span 2` — full width chart card                   |
| `.d-bar-row`    | Progress bar row (clickable), flex with min-width info section |

### Syllabus View Components

| Class             | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `.syl-view-inner` | `padding:26px`, `max-width:920px`                                    |
| `.syl-head`       | Header card with left colored border `4px solid var(--c)`            |
| `.syl-ring-wrap`  | 72×72 SVG ring container (position:relative)                         |
| `.syl-ring-pct`   | Absolute centered text in ring                                       |
| `.syl-prog-track` | 4px tall progress bar track                                          |
| `.sections`       | Flex column, `gap:10px`                                              |
| `.sec-card`       | White bordered section card, `border-radius:12px`, `overflow:hidden` |
| `.sec-hdr`        | Full-width `<button>` section toggle                                 |
| `.sec-chev`       | SVG chevron, rotates via `.open` class                               |
| `.sec-body`       | Section content, hidden via `.collapsed`                             |

### Topic Components

| Class                | Description                                                       |
| -------------------- | ----------------------------------------------------------------- | ------------------------------------- |
| `.topic-row`         | Topic container, `border-radius:9px`, `background:#FAFBFD`        |
| `.topic-row.is-done` | `background:#F0FFF6`, `border-color:#BBF7D0`                      |
| `.topic-main`        | Clickable row (opens detail), flex                                |
| `.chk-btn`           | Circular checkbox button, `22×22px`, `border-radius:6px`          |
| `.chk-btn.checked`   | `background:var(--c)`, `border-color:var(--c)`                    |
| `.chk-icon`          | SVG checkmark, `opacity:0` unchecked → `1` checked                |
| `.topic-title`       | Topic name, `.875rem`, `weight:600`                               |
| `.topic-title.done`  | `text-decoration:line-through`, `color:#9CA3AF`                   |
| `.topic-desc`        | One-line description, `.78rem`, `color:#8D94A5`                   |
| `.topic-done-date`   | Completion date label, `color:#10B981`, `display:none` until done |
| `.topic-arr`         | Chevron arrow, rotates via `.open`                                |
| `.subtopic-count`    | Pill showing "N subtopics"                                        |
| `.topic-det`         | Expandable detail panel, hidden via `.collapsed`                  |
| `.st-chip`           | Subtopic tag pill                                                 |
| `.det-cols`          | 2-col grid (notes                                                 | resources), collapses to 1 col mobile |
| `.notes-ta`          | Textarea, `min-height:84px`, saves on `blur`                      |
| `.res-list`          | Resource link list container                                      |
| `.res-item`          | Single resource row, flex space-between                           |
| `.res-link`          | Anchor, `color:var(--c)`, truncated with ellipsis                 |
| `.res-del`           | Delete button, hover → `color:#EF4444`                            |
| `.res-form`          | Add resource form (flex column)                                   |
| `.res-inp`           | Text/URL input, `.error` adds red border                          |
| `.res-add-btn`       | Add button, `background:var(--c)`                                 |

### State Classes Summary

| Class        | Applied to                           | Meaning                           |
| ------------ | ------------------------------------ | --------------------------------- |
| `.active`    | `.main-view`, `.nav-btn`, `#overlay` | Currently visible/selected        |
| `.open`      | `.sec-chev`, `.topic-arr`            | Chevron rotated (expanded)        |
| `.collapsed` | `.sec-body`, `.topic-det`            | Hidden via `display:none`         |
| `.is-done`   | `.topic-row`                         | Topic completed — green bg/border |
| `.done`      | `.topic-title`                       | Strikethrough style               |
| `.checked`   | `.chk-btn`                           | Filled checkbox state             |
| `.error`     | `.res-inp`                           | Red border for URL validation     |

---

## DOM ID Conventions

| Pattern                                       | Example          | Purpose                          |
| --------------------------------------------- | ---------------- | -------------------------------- |
| `view-{id}`                                   | `view-dashboard` | Main view pane                   |
| `sb-{sectionId}`                              | `sb-m-s1`        | Section body (collapsible)       |
| `chev-{sectionId}`                            | `chev-m-s1`      | Section chevron SVG wrapper      |
| `det-{topicId}`                               | `det-m-t1`       | Topic detail panel               |
| `arr-{topicId}`                               | `arr-m-t1`       | Topic expand arrow               |
| `rlist-{topicId}`                             | `rlist-m-t1`     | Resource list container          |
| `rl-{topicId}`                                | `rl-m-t1`        | Resource label input             |
| `ru-{topicId}`                                | `ru-m-t1`        | Resource URL input               |
| `c-donut` / `c-radar` / `c-line`              | —                | Chart.js canvas elements         |
| `d-bars`                                      | —                | Progress bar rows container      |
| `d-done` / `d-total`                          | —                | Topbar counters                  |
| `d-streak` / `d-days` / `d-total-pct`         | —                | Dashboard KPI values             |
| `nav-total-pct`                               | —                | Sidebar footer % value           |
| `dc-pct-{id}` / `dc-cnt-{id}` / `dc-bar-{id}` | —                | Dashboard syllabus card elements |

### Data Attributes

| Attribute               | Used for                                                 |
| ----------------------- | -------------------------------------------------------- |
| `data-nav="{id}"`       | Nav buttons — matched by `goTo()` for active state       |
| `data-nav-badge="{id}"` | Badge spans — updated by `refreshNavBadge()`             |
| `data-topic="{id}"`     | Topic row — queried by `refreshTopicUI()`                |
| `data-syl-pct="{id}"`   | Ring % text — updated by `refreshSyllabusHeader()`       |
| `data-syl-bar="{id}"`   | Progress bar fill — updated by `refreshSyllabusHeader()` |
| `data-syl-cnt="{id}"`   | "X/Y topics" text — updated by `refreshSyllabusHeader()` |
| `data-syl-ring="{id}"`  | SVG circle — stroke-dashoffset updated directly          |
| `data-sec-cnt="{id}"`   | Section counter — updated by `refreshSyllabusHeader()`   |

---

## Responsive Breakpoints

| Breakpoint | Changes                                                                |
| ---------- | ---------------------------------------------------------------------- |
| `≤ 1080px` | Dashboard syllabus cards: 4 cols → 2 cols                              |
| `≤ 880px`  | Charts grid: 2 cols → 1 col; topic detail: 2 cols → 1 col              |
| `≤ 700px`  | Sidebar becomes fixed overlay, hamburger appears; page padding shrinks |
| `≤ 420px`  | Dashboard cards: 2 cols → 1 col                                        |

---

## Upcoming / Planned

- [ ] Add more topics to `api` and `playwright` sections in `syllabus-data.js`
- [ ] Export progress as JSON backup
- [ ] Import/restore progress from JSON
- [ ] Study streak calendar heatmap
- [ ] Filter topics by status (all / done / pending)

---

## My Preferences

- **Be direct** — no flattery, no "great question!", get to the point
- **Targeted edits** — show only changed code with enough context to locate it, not full rewrites
- **Always prefix with filename** — e.g. `**app.js**` before any code block
- **Flag bad ideas immediately** — if my approach is wrong, say so before implementing
- **One clarifying question at a time** — not five at once
- **No new dependencies** — prefer native solutions; if a library is genuinely needed, justify it
- **Prefer editing over refactoring** — do not restructure working code unless asked
