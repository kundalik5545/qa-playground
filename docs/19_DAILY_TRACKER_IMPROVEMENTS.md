# Daily Tracker Improvements — Plan 19

> Analysis and implementation plan for Daily Tracker enhancements.
> Status: **Planned**

---

## Scope

8 improvement areas across clear-data, API, Prisma model, date bar UI, habit form UX, chart sync, progress chart relocation, and analytics filter unification.

---

## Feature Analysis

### 1. Clear All Data Button

**Current state:** No clear-data capability. Users can only export/import. `DailyTrackerView.jsx` header has export + import buttons only.

**What's needed:**
- "Clear Data" button in the header, next to export/import (top-right area)
- Confirm dialog before clearing (destructive action)
- Clear three localStorage keys: `qa_tracker_daily`, `qa_tracker_habits`, `qa_tracker_habit_log`
- If user is logged in: also call API to wipe DB rows for that user
- If user is logged out: localStorage-only clear
- Login-after-clear sync: when a logged-out user clears data and later logs in, the empty localStorage state should be written to DB (overwriting any old DB data) — this is handled by existing sync-on-login logic if it pushes local state to DB

**API route:** `DELETE /api/tracker/clear` — deletes all DailyTask, Habit, HabitLog rows for the authenticated user.

**Files to change:**
- `app/(study)/study-tracker/daily-tracker/_components/DailyTrackerView.jsx` — add button + confirm + handler
- `app/api/tracker/clear/route.js` — new file

---

### 2. API Route — Clear Daily Tracker Data

**Endpoint:** `DELETE /api/tracker/clear`

**Logic:**
1. Get session — return 401 if not authenticated
2. Delete all `HabitLog` rows for userId (delete first due to FK constraint on Habit)
3. Delete all `Habit` rows for userId
4. Delete all `DailyTask` rows for userId
5. Return `{ ok: true }`

**No request body needed** — userId comes from session.

**Login-after-clear sync consideration:** The existing StudyTracker sync-on-login mechanism (if it exists) should push local state to DB when user logs in. If local state is empty arrays/objects at that point, the DB will be cleared/overwritten. If no sync-on-login exists yet, add a note in the task file to implement it as part of the Study Tracker DB migration (tracked in `docs/tasks/STUDY_TRACKER_DB_MIGRATION_TASKS.md`).

---

### 3. Prisma Model — JSON vs Normalized Analysis

**Current normalized schema:**
```
DailyTask  — one row per task per day per user
Habit      — one row per habit per user
HabitLog   — one row per habit per date per user (~5 habits × 365 days = 1,825 rows/year)
```

**JSON/blob alternative (single row per user):**
```prisma
model DailyTrackerData {
  id        String   @id @default(cuid())
  userId    String   @unique
  dailyData Json     // { "YYYY-MM-DD": [{id, title, done, timeMin}] }
  habits    Json     // [{id, title, timeMin, recurrence, ...}]
  habitLog  Json     // { "YYYY-MM-DD": { "h-xxx": true } }
  updatedAt DateTime @updatedAt
}
```

**Analysis:**

| Factor | Normalized (current) | JSON blob |
|--------|---------------------|-----------|
| DB rows at 1 year | ~3,000–5,000 | 1 per user |
| Write cost | 1 upsert per task/toggle | 1 upsert for entire user blob |
| Read cost | Filtered query by date | Full blob read always |
| Concurrent write safety | Safe (row-level) | Race conditions possible |
| Query flexibility | Can filter by date range in DB | Must filter in application code |
| Schema already in DB | Yes, migrations done | Would need new migration + data migration |

**Verdict: Keep the current normalized schema.** The data volume is tiny (personal tracker, not multi-tenant scale). The normalized tables are already migrated and working. Switching to JSON blobs gains nothing at this scale and introduces race-condition risk. No Prisma schema changes needed.

---

### 4. Fetch Daily Tracker Route — Review

**Existing routes:**
- `POST /api/tracker/daily` — upsert a task
- `DELETE /api/tracker/daily/[taskId]` — delete a task
- `POST /api/tracker/habits` — upsert a habit
- `PATCH /api/tracker/habit-log` — toggle habit log

**Missing:** `GET /api/tracker/daily` — no fetch route exists for loading user data from DB on login.

**Required for clear-data + login-sync to work properly:** A GET route that returns all DailyTask, Habit, and HabitLog rows for the authenticated user, shaped to match the localStorage format:
```json
{
  "daily":    { "YYYY-MM-DD": [{ "id": ..., "title": ..., "done": ..., "timeMin": ... }] },
  "habits":   [{ "id": ..., "title": ..., ... }],
  "habitLog": { "YYYY-MM-DD": { "h-xxx": true } }
}
```

**Action:** Create `GET /api/tracker/daily` as part of this plan. If the Study Tracker DB migration already plans this route, cross-reference and avoid duplication.

---

### 5. Date Bar UI — Large Screen Fix

**Current state:** `DateNavigator.jsx` renders a 7-day strip. At `2xl` and above, the bar stretches awkwardly — items spread too wide with no max constraint.

**Root cause:** The strip container uses full-width flex with no `max-w-*` cap.

**Fix:**
- Wrap the date strip in a `max-w-3xl mx-auto` container (or `max-w-screen-md`) so it stays centered and compact on large displays
- The prev/next arrows and Today/date-picker controls stay aligned with the strip
- On `xl`+ screens, pin the strip width to a readable size instead of stretching edge-to-edge
- Adjust day cell `min-w` so cells don't become comically wide at large breakpoints

**File:** `app/(study)/study-tracker/daily-tracker/_components/DateNavigator.jsx`

---

### 6. Recurring Habits Form — UI Simplification

**Current state** (`HabitForm.jsx`):
- Title + Time row
- Repeat pattern pills: Daily, Weekdays, Weekends, Custom Days
- Custom days selector (7 buttons)
- Duration pills: 1week, 2weeks, 3weeks, 1month, **2months**, **Indefinite**, Custom
- Start date + End date (two separate rows)
- "Create Habit" full-width blue button

**Required changes:**

#### Remove
- `Repeat` section (recurrence pills + custom day selector) — **remove entirely**
- Duration options: `2months` and `Indefinite`

#### Add
- **Planned time slot input** — a time picker field for selecting start and end times with AM/PM (e.g. `05:30 PM – 06:30 PM`), stored as a formatted string alongside `timeMin`
  - Label: "Time Slot (optional)"
  - Two `<input type="time">` fields side by side: "From" and "To"
  - Display the selected times in 12-hour format with AM/PM (`hh:mm AM/PM`)
  - Stored in habit object as `timeSlot: string` — formatted as `"05:30 PM – 06:30 PM"` before saving
  - On save: format both time values to 12-hour AM/PM string and join with ` – ` separator
  - If either field is empty, store `timeSlot` as `""` (not stored)
- `time` field remains mandatory (validate > 0 before submit)

#### Keep (with changes)
- Duration pills: `1week`, `2weeks`, `3weeks`, `1month`, `custom` only
- Start date + End date — place **on one line** (flex row, gap-2)
- "Create Habit" button — reduce size (not full-width, use `w-auto px-4 py-1.5 text-sm`)
- Add **"Cancel" button** on the left of the Create button — clicking navigates to the Daily Tasks tab (calls the `setView("tasks")` prop or equivalent)

#### UI style rules
- Do NOT use shadcn components — keep existing plain HTML + Tailwind approach
- Keep existing color scheme (purple accents for habits)
- Keep existing input styles (`border rounded px-2 py-1` pattern)

**Files:**
- `app/(study)/study-tracker/daily-tracker/_components/habbits/HabitForm.jsx`
- `app/(study)/study-tracker/daily-tracker/_components/DailyTrackerView.jsx` — update `habitForm` state shape (add `timeSlot`), update `addHabit()` to pass `timeSlot` through
- `lib/studyTrackerStorage.js` — no change needed (habitForm state is passed as-is)
- `app/api/tracker/habits/route.js` — add `timeSlot` field to upsert
- Prisma schema — add `timeSlot String?` to `Habit` model + migration

---

### 7. Completion Rate Chart Sync with Habit Tracker Filter

**Current state:**
- `AnalyticsPanel.jsx` owns a `filterMode` state ("weekly" | "monthly")
- `CompletionRateChart.jsx` receives `filterMode` and plots N days accordingly
- `HabitMatrix.jsx` has its own independent `viewMode` state ("day" | "week" | "month")
- The two charts are NOT in sync — changing HabitMatrix view does not affect CompletionRateChart

**Required change:**
- Lift `HabitMatrix` view mode state out of `HabitMatrix.jsx` into `AnalyticsPanel.jsx` (or `DailyTrackerView.jsx`)
- Pass this unified filter down to both `HabitMatrix` and `CompletionRateChart`
- `CompletionRateChart` maps the filter: `day` → 1-day range, `week` → 7-day range, `month` → 30-day range
- This also affects the **Analytics stat cards** (see Feature 8)

**Files:**
- `app/(study)/study-tracker/daily-tracker/_components/analytics/AnalyticsPanel.jsx` — lift viewMode state, pass to HabitMatrix + CompletionRateChart
- `app/(study)/study-tracker/daily-tracker/_components/habbits/HabitMatrix.jsx` — accept `viewMode` + `setViewMode` as props instead of owning state
- `app/(study)/study-tracker/daily-tracker/_components/analytics/CompletionRateChart.jsx` — accept unified `viewMode` prop, compute date range from it

---

### 8. Progress Chart — Move from HabitMatrix to Below CompletionRateChart

**Current state:**
- `HabitMatrix.jsx` has a **Progress column** (last column) showing a mini progress bar + done/total count for each habit
- Progress bars sit inside the matrix table at the right end

**Required changes:**

#### Remove from HabitMatrix
- Remove the "Progress" column header and all `<td>` progress cells from the table
- This simplifies the matrix to: Habit Name | Date columns only

#### Add below CompletionRateChart
- New section: **"Habit Progress"** rendered after `CompletionRateChart` in `AnalyticsPanel.jsx`
- For each habit in `state.habits`, show:
  - Habit name (left)
  - Time slot badge (e.g., "05:30 PM – 06:30 PM") in a small pill next to the name — shown only if `timeSlot` is set
  - Progress bar (fills proportionally to done/total)
  - Done/total count ("12/21") on the right
  - Color: green if 100%, purple otherwise (same as current)
- Layout: vertical list of rows, each row is `flex items-center gap-3`

**Files:**
- `app/(study)/study-tracker/daily-tracker/_components/habbits/HabitMatrix.jsx` — remove Progress column
- `app/(study)/study-tracker/daily-tracker/_components/analytics/AnalyticsPanel.jsx` — render habit progress list after CompletionRateChart

---

### 9. Analytics Filter Unification

**Current state:**
- `AnalyticsPanel.jsx` header shows **Weekly / Monthly toggle** buttons
- This filter controls the 4 stat cards AND charts
- `HabitMatrix.jsx` has its own **Day / Week / Month** toggle (internal state)
- Two separate filters exist in the same analytics area → confusing UX

**Required changes:**

#### Remove
- The Weekly/Monthly toggle buttons from `AnalyticsPanel.jsx` header

#### Add
- A single **Day / Week / Month** toggle (same as current HabitMatrix toggle) in the `AnalyticsPanel.jsx` header
- This is the unified `viewMode` from Feature 7
- All of the following update when this filter changes:
  - **Stat cards** (Items Done, Total Items, Completion %, Time Done) — compute for the selected period
  - `CompletionRateChart` — plots the selected period
  - `HabitMatrix` — shows the selected period

**Period mapping for stat cards:**
| Filter | Period |
|--------|--------|
| `day` | selected date only (default: today) |
| `week` | last 7 days |
| `month` | last 30 days |

**Files:**
- `app/(study)/study-tracker/daily-tracker/_components/analytics/AnalyticsPanel.jsx`
  - Remove `filterMode` state ("weekly"/"monthly")
  - Use unified `viewMode` from Feature 7
  - Update stat card computation to use viewMode-based date range
  - Replace Weekly/Monthly buttons with Day/Week/Month buttons (or pass the toggle from HabitMatrix header up)

---

## Implementation Order

Features depend on each other as follows:

```
Feature 7 (lift viewMode) ──► Feature 8 (progress below chart uses viewMode)
                          ──► Feature 9 (analytics filter uses viewMode)

Feature 6 (add timeSlot field) ──► Feature 8 (show timeSlot in progress list)
                               ──► Prisma migration needed first

Feature 1 (clear button) ──► Feature 2 (API route)
                         ──► Feature 3 (confirmed no schema change needed)
```

**Recommended order:**
1. Feature 3 — Prisma decision (no change = unblock all other work)
2. Feature 4 — GET /api/tracker/daily route (enables sync)
3. Feature 6 — Habit form simplification + Prisma `timeSlot` migration
4. Feature 1 + 2 — Clear data button + DELETE /api/tracker/clear
5. Feature 5 — Date bar large screen fix (independent, can be done anytime)
6. Feature 7 — Lift viewMode state (prerequisite for 8 + 9)
7. Feature 9 — Analytics filter unification (depends on 7)
8. Feature 8 — Progress chart relocation (depends on 6 + 7)

---

## Files Affected Summary

| File | Change Type |
|------|-------------|
| `DailyTrackerView.jsx` | Add clear button + confirm + handler; update habitForm state shape |
| `DateNavigator.jsx` | Fix max-width constraint for 2xl+ screens |
| `HabitForm.jsx` | Remove repeat section; remove 2months/indefinite duration; add timeSlot input; rearrange start/end date to one line; resize Create button; add Cancel button |
| `HabitsTab.jsx` | Pass `setView` down to HabitForm for Cancel navigation |
| `AnalyticsPanel.jsx` | Lift viewMode; remove weekly/monthly buttons; add day/week/month buttons; update stat card computation; render habit progress section |
| `HabitMatrix.jsx` | Accept viewMode + setViewMode props; remove progress column |
| `CompletionRateChart.jsx` | Accept unified viewMode; compute date range from it |
| `app/api/tracker/clear/route.js` | **New file** — DELETE route, wipes all 3 tables for userId |
| `app/api/tracker/daily/route.js` | Add GET handler for loading all user data |
| `app/api/tracker/habits/route.js` | Add `timeSlot` field to upsert |
| `prisma/schema.prisma` | Add `timeSlot String?` to Habit model |

---

## Open Questions / Decisions

1. **Login-after-clear sync:** Does the Study Tracker currently push local state to DB on login? If not, this needs to be scoped — either implement a simple "overwrite DB with local state on login" or note it as out of scope and document the edge case.

2. **HabitsTab cancel navigation:** `HabitsTab` receives `habitForm`/`setHabitForm`/`onAddHabit` from `DailyTrackerView`. The cancel button needs access to `setView`. Either pass `setView` as a new prop through `HabitsTab → HabitForm`, or lift the cancel action to `HabitsTab` directly.

3. **Day-mode stat cards:** In "day" view, the stat cards show data for the selected date (from DateNavigator), not necessarily today. Decide: should it show stats for `selectedDate` or always today? Recommendation: use `selectedDate` for consistency.