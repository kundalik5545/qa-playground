# Daily Tracker Improvements — Tasks

**Source doc:** `docs/19_DAILY_TRACKER_IMPROVEMENTS.md`
**Branch:** `fix/ui-issue-all-pages`
**Status:** ✅ Complete

---

## Overview

8 improvement areas: clear-data button + API, Prisma timeSlot field, GET fetch route, date bar 2xl+ fix, habit form UX simplification, chart filter sync, progress chart relocation, analytics filter unification.

---

## Phase 1 — Prisma Schema: Add `timeSlot` to Habit

- [x] **T1** — Open `prisma/schema.prisma` and add `timeSlot String?` field to the `Habit` model (after the `endDate` field)
- [x] **T2** — Run `npx prisma migrate dev --name add_timeslot_to_habit` to generate and apply the migration
- [x] **T3** — Verify migration applied cleanly (no errors, new column present)

---

## Phase 2 — GET /api/tracker/daily Route

- [x] **T4** — Create `app/api/tracker/daily/route.js` GET handler (add to existing file alongside POST)
  - Get session → return 401 if not authenticated
  - Query all `DailyTask` rows for userId
  - Query all `Habit` rows for userId
  - Query all `HabitLog` rows for userId (include habit relation for habitId mapping)
  - Shape response to match localStorage format:
    ```json
    {
      "daily":    { "YYYY-MM-DD": [{ "id": taskId, "title": ..., "done": ..., "timeMin": ... }] },
      "habits":   [{ "id": habitId, "title": ..., "timeMin": ..., "timeSlot": ..., ... }],
      "habitLog": { "YYYY-MM-DD": { "h-xxx": true } }
    }
    ```
  - Return shaped data with 200

---

## Phase 3 — Habit Form UI Simplification

- [x] **T5** — Update `habitForm` initial state in `DailyTrackerView.jsx`
  - Add `timeSlotFrom: ""` and `timeSlotTo: ""` to the default shape (raw `<input type="time">` values)
  - Remove `recurrence` and `customDays` fields (no longer used)
  - Remove `"indefinite"` and `"2months"` from duration options (guard in addHabit logic)

- [x] **T6** — Update `addHabit()` handler in `DailyTrackerView.jsx`
  - Remove recurrence/customDays from the habit object being created
  - Derive `timeSlot` string from `habitForm.timeSlotFrom` + `habitForm.timeSlotTo` using `formatTimeTo12h()` (see T8)
  - Add `timeSlot` (formatted string) to the new habit object
  - Set recurrence to hardcoded `"daily"` (simplified) or remove field entirely

- [x] **T7** — Update `HabitForm.jsx` — remove Repeat section
  - Delete the recurrence pills block (Daily / Weekdays / Weekends / Custom Days)
  - Delete the custom days selector (7 day-buttons, shown when recurrence === "custom")
  - Remove all `habitForm.recurrence` and `habitForm.customDays` references

- [x] **T8** — Update `HabitForm.jsx` — add Time Slot input
  - Add a new row after the Title + Time row, labeled `Time Slot (optional)`
  - Row contains two `<input type="time">` fields side by side: "From" and "To"
  - `formatTimeTo12h` defined in `DailyTrackerView.jsx` (where it's used in addHabit)
  - Stores raw values in `habitForm.timeSlotFrom` / `habitForm.timeSlotTo`; formatted on save

- [x] **T9** — Update `HabitForm.jsx` — clean up Duration pills
  - Remove `2months` pill
  - Remove `indefinite` pill
  - Remaining pills: `1week`, `2weeks`, `3weeks`, `1month`, `custom`

- [x] **T10** — Update `HabitForm.jsx` — Start/End date on one line
  - Wrapped in `flex flex-row gap-2 items-end`; each input takes `flex-1`

- [x] **T11** — Update `HabitForm.jsx` — restyle action buttons
  - Reduced "Create Habit" button: `px-4 py-1.5 text-sm`
  - Added "Cancel" button to the left
  - Wrapped in `flex gap-2 justify-end`

- [x] **T12** — Update `HabitsTab.jsx`
  - Accept new `onCancel` prop from `DailyTrackerView`
  - Pass `onCancel` down to `HabitForm`

- [x] **T13** — Update `DailyTrackerView.jsx`
  - Pass `onCancel={() => setView("tasks")}` to `HabitsTab`

- [x] **T14** — Update `app/api/tracker/habits/route.js`
  - Add `timeSlot: habit.timeSlot ?? null` to both create and update objects

---

## Phase 4 — Clear All Data Button + API Route

- [x] **T15** — Create `app/api/tracker/clear/route.js`
  - Export `DELETE` handler
  - Get session → return 401 if not authenticated
  - Delete all `HabitLog` rows for userId first (FK constraint)
  - Delete all `Habit` rows for userId
  - Delete all `DailyTask` rows for userId
  - Return `{ ok: true }`

- [x] **T16** — Add `clearAllData()` handler in `DailyTrackerView.jsx`
  - `window.confirm()` for confirm dialog
  - Calls `updateState` three times to reset daily/habits/habitLog
  - If user logged in: calls `DELETE /api/tracker/clear` (fire-and-forget)
  - Shows success toast

- [x] **T17** — Add "Clear Data" button in `DailyTrackerView.jsx` header
  - Positioned left of Export/Import buttons
  - Red border style; calls `clearAllData()`

---

## Phase 5 — Date Bar Large Screen Fix

- [x] **T18** — Update `DateNavigator.jsx`
  - Added `max-w-4xl mx-auto w-full` to outer container — strip stays centred and compact at 2xl+
  - Day cells: `flex-1 min-w-[60px] max-w-[80px]` — won't balloon on wide screens

---

## Phase 6 — Lift viewMode State (prerequisite for Phases 7 + 8)

- [x] **T19** — Remove internal `viewMode` + `setViewMode` state from `HabitMatrix.jsx`
  - Replaced with props: `viewMode` and `setViewMode` accepted from parent
  - Removed `useState` import (no longer needed)

- [x] **T20** — Update `AnalyticsPanel.jsx`
  - Added `viewMode` state (`useState("week")`); removed `filterMode`/`setFilterMode` props
  - Toggle replaced: Weekly/Monthly → Day/Week/Month (blue-600 active style)
  - Passes `viewMode`+`setViewMode` to HabitMatrix; `viewMode` to CompletionRateChart
  - `days` maps: day→1, week→7, month→30
  - `DailyTrackerView` cleaned up: removed `filterMode` state and props

- [x] **T21** — Update `CompletionRateChart.jsx`
  - Replaced `filterMode` prop with `viewMode`
  - Subtitle: day→"today", week→"last 7 days", month→"last 30 days"

---

## Phase 7 — Analytics Filter Unification

- [x] **T22** — Update `AnalyticsPanel.jsx` header
  - Done in Phase 6 — Weekly/Monthly replaced with Day/Week/Month toggle (blue-600 active style)

- [x] **T23** — Update stat card computation in `AnalyticsPanel.jsx`
  - Accepts `selectedDate` as a new prop
  - day → `[selectedDate]`; week → last 7 days; month → last 30 days
  - Single loop over `dateRange` builds labels, completed, totals, periodTimeMin together

- [x] **T24** — Update `DailyTrackerView.jsx`
  - Passes `selectedDate` prop to `<AnalyticsPanel>` ✅

---

## Phase 8 — Progress Chart Relocation

- [x] **T25** — Update `HabitMatrix.jsx` — remove Progress column
  - Remove `<th>Progress</th>` from table header
  - Remove the progress `<td>` cell block from each habit row (the div with progress bar + done/total text)
  - Table now ends at the last date column

- [x] **T26** — Add "Habit Progress" section in `AnalyticsPanel.jsx`
  - Render after `<CompletionRateChart>` and before end of the component
  - Section heading: `<h3>Habit Progress</h3>` (same heading style as other sections)
  - For each habit in `state.habits`, render one row:
    ```
    [Habit Name] [timeSlot pill if set] ────── [progress bar] ──── [done/total]
    ```
  - Row layout: `flex items-center gap-3 py-2`
  - Habit name: `text-sm font-medium text-gray-800 w-40 truncate`
  - Time slot pill (if `habit.timeSlot`): `text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full`
  - Progress bar container: `flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`
  - Progress bar fill: green if 100%, purple otherwise — width = `${pct}%`
  - Done/total: `text-xs text-gray-500 w-12 text-right font-mono`
  - Empty state (no habits): show `<p className="text-sm text-gray-400">No habits yet.</p>`

---

## Decisions Made (from Open Questions)

1. **Login-after-clear sync:** Out of scope for this plan. Documented as a future item in `docs/tasks/STUDY_TRACKER_DB_MIGRATION_TASKS.md`. Current behavior: clear wipes localStorage + DB (if logged in). If user logs out, clears locally, then logs back in — DB data (if any remaining) will be loaded. Full bi-directional sync is part of the DB migration plan.

2. **HabitsTab cancel navigation:** Pass `onCancel` as a new prop from `DailyTrackerView` → `HabitsTab` → `HabitForm`. Handled in T12 + T13.

3. **Day-mode stat cards:** Use `selectedDate` (from DateNavigator) for consistency with what the user is viewing. Handled in T23.

---

## Progress Tracker

| Phase | Tasks | Done | Status |
|-------|-------|------|--------|
| Phase 1 — Prisma timeSlot | T1–T3 | 3/3 | ✅ Done |
| Phase 2 — GET fetch route | T4 | 1/1 | ✅ Done |
| Phase 3 — Habit form UX | T5–T14 | 10/10 | ✅ Done |
| Phase 4 — Clear data | T15–T17 | 3/3 | ✅ Done |
| Phase 5 — Date bar fix | T18 | 1/1 | ✅ Done |
| Phase 6 — Lift viewMode | T19–T21 | 3/3 | ✅ Done |
| Phase 7 — Analytics filter | T22–T24 | 3/3 | ✅ Done |
| Phase 8 — Progress relocation | T25–T26 | 2/2 | ✅ Done |
| **Total** | **T1–T26** | **26/26** | ✅ Complete |