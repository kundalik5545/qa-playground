# Habit Matrix UI — Tasks

**Source doc:** `docs/17_HABIT_MATRIX_PLAN.md`
**File:** `app/(study)/study-tracker/daily-tracker/_components/DailyTrackerView.jsx`
**Branch:** `feat/habit-matrix`
**Status:** ✅ Complete

---

## Overview

Replace the two Chart.js bar charts at the bottom of the **Recurring Habits** tab with a new interactive `HabitMatrix` table component — a date-grid that shows each habit as a row and each day as a column, with clickable checkboxes and a per-row progress bar.

---

## Phase 1 — Remove Chart Code from `HabitsView`

- [x] **T1** — Remove `barRef`, `weekRef`, `charts` refs and `useEffect` from `HabitsView`
  - Deleted: `const barRef = useRef(null)`
  - Deleted: `const weekRef = useRef(null)`
  - Deleted: `const charts = useRef({})`
  - Deleted: the `useEffect(() => { renderHabitCharts(); ... }, [state.habits, state.habitLog])`

- [x] **T2** — Remove `renderHabitCharts()` function body entirely

- [x] **T3** — Remove the two chart `<canvas>` card divs from `HabitsView` JSX
  - Removed: `<div className="grid grid-cols-1 xl:grid-cols-2 gap-[14px]">` with Habit Completion Rates + Habits This Week canvas cards
  - Replaced with: `<HabitMatrix state={state} updateState={updateState} />`

- [x] **T4** — Add `updateState` to `HabitsView` props destructuring
  - `function HabitsView({ state, habitForm, setHabitForm, onAddHabit, onDeleteHabit, updateState })`

- [x] **T5** — Pass `updateState={updateState}` to `<HabitsView>` at its call site in `DailyTrackerView`

---

## Phase 2 — Build `HabitMatrix` Component

- [x] **T6** — Scaffold `HabitMatrix` function at the bottom of `DailyTrackerView.jsx`
  - Props: `{ state, updateState }`
  - Local state: `viewMode` (`"day"` | `"week"` | `"month"`), `anchorDate` (string `"YYYY-MM-DD"`, default today)

- [x] **T7** — Build date-column generator based on `viewMode`
  - `"day"` → 1 date: `[anchorDate]`
  - `"week"` → 7 dates: Sun–Sat of the week containing `anchorDate`
  - `"month"` → all days of the month of `anchorDate` (28–31 columns)

- [x] **T8** — Build the header/controls row
  - Title: "Habit Tracker"
  - Mode toggle buttons: `[Day]` `[Week]` `[Month]` — active style: `bg-blue-600 text-white`
  - Date navigation controls:
    - **Day mode**: `<input type="date">` + "Today" button
    - **Week mode**: `◀` / `▶` buttons (shift 7 days) + "This Week" link
    - **Month mode**: `<input type="month">` picker

- [x] **T9** — Build the table header row
  - Columns: `Habit` | one column per date (weekday abbr + day number) | `Progress`
  - Today's column: blue text + bold
  - Future columns: muted gray text

- [x] **T10** — Build each habit row (one `<tr>` per habit in `state.habits`)
  - First cell: habit title + recurrence label
  - Date cells: uses `habitAppliesOnDate(habit, date)` to decide cell type
  - Doesn't apply → empty cell; future → grey, not clickable; past/today → clickable checkbox
  - Today → blue ring on checkbox

- [x] **T11** — Implement `toggleHabitInMatrix(habitId, date)` inside `HabitMatrix`
  - Same `updateState("habitLog", ...)` pattern as existing `toggleHabit`

- [x] **T12** — Build Progress column (last cell per row)
  - Counts done / applicable past+today dates in visible period
  - 5px bar: purple normally, green at 100%; `X/Y` label below in mono

- [x] **T13** — Empty state: if `state.habits.length === 0`, show placeholder message inside the card

---

## Phase 3 — Styling & Polish

- [x] **T14** — Wrap `HabitMatrix` in the standard card: `bg-white border border-[#e9eaed] rounded-[14px] p-5`
- [x] **T15** — Table styles applied: `border-collapse`, header uppercase small caps, row hover `bg-[#faf5ff]`
- [x] **T16** — Month view: wrapped table in `overflow-x-auto` with dynamic `minWidth` for 28–31 columns
- [x] **T17** — Habit name cell: `max-w-[140px] truncate`; recurrence in `text-[0.68rem] text-gray-400`

---

## Phase 4 — Cleanup

- [x] **T18** — Verified `Chart`/`registerables` imports remain (still used by `DailyAnalytics` in Tasks tab)
- [x] **T19** — Removed `chartCard` local var from `HabitsView`; `chartTitle` and `chartCard` remain in `DailyAnalytics` where they belong
- [x] **T20** — Code review pass: no stale refs, no broken imports, all three functions (`DailyAnalytics`, `HabitsView`, `HabitMatrix`) correctly delimited

---

## Acceptance Criteria

- [x] Habits tab renders `HabitMatrix` below the form + list — no chart canvases
- [x] Day / Week / Month mode switching works with correct column sets
- [x] Checkbox click correctly toggles `habitLog` via `updateState`
- [x] Progress bar shows correct ratio for the visible period only
- [x] Today's cell is visually distinct (blue ring); future cells are non-clickable
- [x] Empty-cell days (habit doesn't apply) are truly blank
- [x] Month view scrolls horizontally without breaking layout
- [x] Existing Tasks tab analytics unaffected (`DailyAnalytics` unchanged)
