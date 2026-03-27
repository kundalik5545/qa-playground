# Habit Matrix UI Plan

> Redesign of the recurring habit tracking UI in the Daily Tracker.
> Status: **In Progress**

---

## What We're Changing

### Remove
- The two bar charts at the bottom of the "Recurring Habits" tab:
  - "Habit Completion Rates" (horizontal bar, Chart.js)
  - "Habits This Week" (stacked bar, Chart.js)
- All chart-related code in `HabitsView`: `barRef`, `weekRef`, `charts` ref, `useEffect`, `renderHabitCharts()` function

### Keep (unchanged)
- New Recurring Habit creation form (top left of Habits tab)
- Existing habits list with inline progress bars (top right of Habits tab)

### Add
- **`HabitMatrix` component** — replaces the removed charts
- Placed directly below the form + list grid in the Habits tab

---

## HabitMatrix Component Design

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│ Habit Tracker                    [Day] [Week] [Month]  [controls]│
├──────────────────────────────────────────────────────────────────┤
│ Habit          │ Sun │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │Progress│
│                │ 23  │ 24  │ 25  │ 26  │ 27  │ 28  │ 29  │       │
├──────────────────────────────────────────────────────────────────┤
│ Morning Review │ [✓] │ [✓] │ [ ] │ [✓] │ [ ] │ [░] │ [░] │ ▓▓▓░ 60% │
│ Daily          │     │     │     │     │     │     │     │       │
├──────────────────────────────────────────────────────────────────┤
│ GYM            │     │ [✓] │     │ [✓] │     │ [░] │     │ ▓▓░░ 50% │
│ Weekdays       │     │     │     │     │     │     │     │       │
└──────────────────────────────────────────────────────────────────┘
```

Legend:
- `[✓]` = done (purple checkbox)
- `[ ]` = missed (grey checkbox, past date)
- `[░]` = future (greyed out, not clickable)
- blank cell = habit doesn't apply on that day (e.g. weekend-only habit on a weekday)

### Filter Modes

| Mode  | Columns shown | Date control |
|-------|---------------|--------------|
| Day   | 1 column (selected date) | Date picker input + "Today" shortcut |
| Week  | 7 columns (Sun–Sat of selected week) | ◀ / ▶ week nav + "This Week" link |
| Month | All days of selected month (28–31 cols) | `<input type="month">` picker |

### Progress Bar (per habit row)
- Thin bar (5px height) in the rightmost "Progress" column
- Calculation: `done / applicable_past_dates` for the **visible period only**
- Color: purple normally, green when 100%
- Shows `X/Y` count below the bar in small text

### Checkbox behavior
- Past dates: clickable, toggles `habitLog[date][habitId]`
- Today: clickable, highlighted blue border
- Future dates: not clickable, greyed out (opacity)
- Dates where habit doesn't apply (e.g. weekday habit on weekend): empty cell, no checkbox

---

## Data Flow

### localStorage (anonymous users)
No changes needed — existing `updateState("habitLog", ...)` path already writes to `qa_tracker_habit_log` in localStorage via `StudyTrackerProvider`.

### Database (signed-in users)
No changes needed — existing `/api/tracker/habit-log` PATCH endpoint and `StudyTrackerProvider` DB sync already handles `habitLog` for authenticated users.

The `HabitMatrix` uses `updateState("habitLog", newLog)` — identical to the existing `toggleHabit` in `DailyTrackerView`.

---

## File Changes

### `app/(study)/study-tracker/daily-tracker/_components/DailyTrackerView.jsx`

1. **`HabitsView` function** — add `updateState` to props destructuring
2. **Remove from `HabitsView`**:
   - `const barRef = useRef(null)`
   - `const weekRef = useRef(null)`
   - `const charts = useRef({})`
   - `useEffect` that calls `renderHabitCharts`
   - `function renderHabitCharts() { ... }`
3. **Replace in `HabitsView` JSX** (bottom of return):
   - Old: two `<div className={chartCard}>` with `<canvas>` elements
   - New: `<HabitMatrix state={state} updateState={updateState} />`
4. **Update call site** in main `DailyTrackerView` component:
   - Add `updateState={updateState}` to `<HabitsView>` props
5. **Add `HabitMatrix` component** at the bottom of the file

### No other files need changes.

---

## Existing Prisma Models Used (no schema changes needed)

```prisma
model Habit {
  habitId    String   // client-side ID used as key
  title      String
  recurrence String   // "daily" | "weekdays" | "weekends" | "custom"
  customDays Int[]    // day-of-week numbers for custom recurrence
  startDate  String
  endDate    String?
  active     Boolean
}

model HabitLog {
  habitId   String   // FK to Habit.id (DB id, not client habitId)
  date      String   // "YYYY-MM-DD"
  done      Boolean
  @@unique([userId, habitId, date])
}
```

Client-side `habitLog` shape (localStorage): `{ "2026-03-27": { "h-1234": true, "h-5678": false } }`

---

## Styling Notes
- Follow existing study-tracker color palette: blue-600 (primary), purple-700 (habits), green-500 (done)
- White card with `border border-[#e9eaed] rounded-[14px] p-5`
- Table overflow-x: auto for month view (up to 31 columns)
- Hover row: `bg-[#faf5ff]` (light purple tint, matches habit section color)
- No new CSS files — Tailwind only

---

## Out of Scope (this PR)
- Removing the bar charts from the **Daily Tasks** tab analytics panel (those are separate)
- Adding DB-specific API calls — existing `updateState` handles sync
- Mobile-specific layout changes beyond horizontal scroll
