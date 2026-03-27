# Daily Tracker Component Refactor

> Splitting the monolithic `DailyTrackerView.jsx` (~1300 lines) into small,
> focused Next.js-style components.
> Status: **Complete**

---

## Why

The original `DailyTrackerView.jsx` contained everything in one file:
- Date navigation strip
- Task panel with habit + task rows
- Add-task form
- Analytics panel (stat cards + 3 Chart.js charts)
- Habit creation form
- Habit list with progress bars
- Habit matrix table

This made the file hard to read, hard to test, and impossible to reuse any part independently. All Chart.js instances shared a single `useEffect` and a single `charts` ref object, causing subtle bugs when any part of state changed.

---

## What Changed

### Before

```
daily-tracker/
└── _components/
    └── DailyTrackerView.jsx   ← ~1300 lines, everything in one file
```

### After

```
daily-tracker/
└── _components/
    ├── _constants.jsx           shared constants (CHECK_SVG, DAYS, style objects)
    ├── _chartSetup.js           Chart.js registration (runs once, idempotent)
    ├── DailyTrackerView.jsx     root orchestrator — state + handlers only
    ├── DateNavigator.jsx        7-day date strip with prev/next + date picker
    ├── TaskList.jsx             habit rows + task rows panel
    ├── AddTaskForm.jsx          title + time input + add button
    ├── AnalyticsPanel.jsx       stat cards + filter toggle + chart layout
    ├── CompletionRateChart.jsx  amber line chart (completion % over time)
    ├── TimeAllocationChart.jsx  green/gray doughnut (done vs remaining time)
    ├── TasksPerDayChart.jsx     stacked bar chart (done vs remaining count)
    ├── HabitsTab.jsx            habits tab layout wrapper
    ├── HabitForm.jsx            new habit creation form
    ├── HabitList.jsx            existing habits list with progress bars
    └── HabitMatrix.jsx          interactive grid (day / week / month views)
```

---

## Component Responsibilities

### `DailyTrackerView.jsx` — Root Orchestrator
- Owns all top-level state: `selectedDate`, `view`, `filterMode`, `newTaskTitle`, `newTaskTime`, `habitForm`
- Owns all business-logic handlers: `addTask`, `toggleTask`, `deleteTask`, `addHabit`, `deleteHabit`, `toggleHabit`, `exportTasks`, `importTasks`
- Renders page header (title + export/import buttons) and the two Tabs
- Passes only what each child needs — no prop drilling beyond one level

### `DateNavigator.jsx`
- Computes the 7-day window centred on `selectedDate`
- Handles prev/next week navigation internally
- Emits `onSelectDate(date)` for all selection events
- Shows dot indicators (amber = has tasks, green = all done)

### `TaskList.jsx`
- Derives all data for the selected date (tasks, habits, counts, minutes)
- Renders the "Recurring Habits" section header + habit rows
- Renders the "Daily Tasks" section header + task rows
- Delegates to `AddTaskForm` for the input row at the bottom

### `AddTaskForm.jsx`
- Pure controlled component: title input + time input + add button
- Submits on Enter key inside the title field

### `AnalyticsPanel.jsx`
- Computes per-period arrays (`labels`, `completed`, `totals`, `ratePct`) for the line and bar charts
- Computes per-day time data (`selDoneMin`, `selRemainingMin`) for the doughnut chart
- Computes the 4 summary stat card values
- Renders the Weekly / Monthly toggle
- Passes pre-computed data down to chart components — charts do zero computation

### `CompletionRateChart.jsx`
- Owns `canvasRef` + `chartRef`
- Creates / destroys Chart.js `line` instance in `useEffect`
- Re-renders only when `labels` or `ratePct` change

### `TimeAllocationChart.jsx`
- Owns `canvasRef` + `chartRef`
- Creates / destroys Chart.js `doughnut` instance in `useEffect`
- Re-renders only when `doneMinutes` or `remainingMinutes` change

### `TasksPerDayChart.jsx`
- Owns `canvasRef` + `chartRef`
- Creates / destroys Chart.js `bar` instance in `useEffect`
- Re-renders only when `labels`, `completed`, or `totals` change

### `HabitsTab.jsx`
- Layout-only wrapper: renders `HabitForm` + `HabitList` in a 2-column grid, then `HabitMatrix` full-width below

### `HabitForm.jsx`
- Controlled form for creating a new recurring habit
- Handles recurrence pills (Daily / Weekdays / Weekends / Custom Days)
- Custom day-of-week selector shown only when recurrence = "custom"
- Duration pills with computed end-date preview in the label
- Calls `onAddHabit` on button click

### `HabitList.jsx`
- Lists all habits with recurrence, time, date range, and completion stats
- Shows a purple progress bar per habit
- Calls `onDeleteHabit(index)` on the × button

### `HabitMatrix.jsx`
- Owns its own `viewMode` ("day" | "week" | "month") and `anchorDate` state
- Builds the date array based on view mode
- Renders a scrollable table with one column per date
- Future date cells are disabled (opacity + cursor-not-allowed)
- Today's cells are highlighted with a blue ring
- Calls `updateState("habitLog", ...)` on toggle — same pattern as `toggleHabit`

---

## Shared Utilities (`_constants.jsx`, `_chartSetup.js`)

### `_constants.jsx`
| Export | Type | Purpose |
|---|---|---|
| `CHECK_SVG` | JSX | White checkmark rendered inside completed checkboxes |
| `DAYS` | string[] | Day abbreviations, index 0 = Sunday |
| `LIGHT_MODE_STYLE` | object | CSS variable overrides that force light mode on the outer div |
| `CARD_CLS` | string | Shared card wrapper Tailwind class string |
| `CARD_TITLE_CLS` | string | Shared card section title Tailwind class string |

### `_chartSetup.js`
Imports `Chart` and `registerables` from `chart.js`, calls `Chart.register(...registerables)` once, and re-exports `Chart`. Every chart component imports `Chart` from here instead of from `chart.js` directly — registration is guaranteed before any instance is created, and it is idempotent so calling it from multiple modules is safe.

---

## Design Decisions

### Each chart owns its own lifecycle
Previously all three charts shared one `useEffect` that destroyed and recreated all charts together. Now each chart component manages its own `canvasRef`, `chartRef`, and cleanup. This means:
- Only the affected chart re-renders when its data changes
- Destroy-on-unmount is localised and cannot accidentally destroy a sibling chart
- Each chart component is independently testable

### AnalyticsPanel computes, charts render
`AnalyticsPanel` does all the data computation and passes primitive arrays/numbers down. Chart components receive no `state` prop — they only know about the data they need to draw. This keeps chart components framework-agnostic and easy to swap out.

### No UI or style changes
Every class, inline style, and pixel value is preserved exactly from the original monolith. The refactor is purely structural.

### `_chartSetup.js` naming convention
The leading underscore follows Next.js convention for non-route files inside `app/`. The double underscore is used for utilities that are internal to the `_components` folder and not meant to be imported from outside it.

---

## Files Modified

| File | Change |
|---|---|
| `daily-tracker/_components/DailyTrackerView.jsx` | Replaced with slim orchestrator (~175 lines) |

## Files Created

| File | Lines | Purpose |
|---|---|---|
| `_constants.jsx` | ~47 | Shared constants |
| `_chartSetup.js` | ~11 | Chart.js registration |
| `AddTaskForm.jsx` | ~53 | Add-task input row |
| `DateNavigator.jsx` | ~148 | 7-day date strip |
| `TaskList.jsx` | ~234 | Task + habit panel |
| `CompletionRateChart.jsx` | ~88 | Line chart |
| `TimeAllocationChart.jsx` | ~72 | Doughnut chart |
| `TasksPerDayChart.jsx` | ~80 | Bar chart |
| `AnalyticsPanel.jsx` | ~155 | Analytics wrapper |
| `HabitForm.jsx` | ~175 | Habit creation form |
| `HabitList.jsx` | ~85 | Habits list |
| `HabitMatrix.jsx` | ~235 | Habit grid table |
| `HabitsTab.jsx` | ~55 | Habits tab layout |
