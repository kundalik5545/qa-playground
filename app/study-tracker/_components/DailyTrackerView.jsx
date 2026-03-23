"use client";

import { useState } from "react";
import {
  getTodayStr,
  formatMinutes,
  habitAppliesOnDate,
  computeHabitEndDate,
  formatHabitRecurrence,
  countHabitScheduled,
  countHabitDone,
  downloadJSON,
  pickJSONFile,
} from "@/lib/studyTrackerStorage";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const CHECK_SVG = (
  <svg viewBox="0 0 12 12" width={10} height={10}>
    <polyline
      points="1.5,6 5,9.5 10.5,2.5"
      stroke="white"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyTrackerView({ state, updateState, showToast }) {
  const [view, setView] = useState("tasks"); // "tasks" | "habits"
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [filterMode, setFilterMode] = useState("weekly");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [habitForm, setHabitForm] = useState({
    title: "",
    time: "",
    recurrence: "daily",
    customDays: [],
    duration: "1month",
    startDate: getTodayStr(),
    endDate: "",
  });

  // Strip dates (±3 days from selectedDate)
  const stripDates = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + i);
    stripDates.push(d.toISOString().slice(0, 10));
  }

  const daily = state.daily || {};
  const habits = state.habits || [];
  const habitLog = state.habitLog || {};

  const habitsForDate = (date) =>
    habits.filter((h) => habitAppliesOnDate(h, date));

  // Date strip dot class
  const dotClass = (date) => {
    const tasks = daily[date] || [];
    const habitsOnDate = habitsForDate(date);
    const done =
      tasks.filter((t) => t.done).length +
      habitsOnDate.filter((h) => habitLog[date]?.[h.id]).length;
    const total = tasks.length + habitsOnDate.length;
    if (!total) return "";
    return done === total ? "all-done" : "has-tasks";
  };

  // Task summary for selected date
  const tasksForDate = daily[selectedDate] || [];
  const habitsForSel = habitsForDate(selectedDate);
  const taskDone = tasksForDate.filter((t) => t.done).length;
  const habitDone = habitsForSel.filter(
    (h) => habitLog[selectedDate]?.[h.id],
  ).length;
  const totalMin =
    tasksForDate.reduce((s, t) => s + (t.timeMin || 0), 0) +
    habitsForSel.reduce((s, h) => s + (h.timeMin || 0), 0);
  const doneMin =
    tasksForDate
      .filter((t) => t.done)
      .reduce((s, t) => s + (t.timeMin || 0), 0) +
    habitsForSel
      .filter((h) => habitLog[selectedDate]?.[h.id])
      .reduce((s, h) => s + (h.timeMin || 0), 0);
  const totalItems = tasksForDate.length + habitsForSel.length;
  const totalDone = taskDone + habitDone;
  const summaryText = totalItems
    ? `${totalDone}/${totalItems} done · ${formatMinutes(doneMin)}/${formatMinutes(totalMin)}`
    : "No tasks";

  const dateLabelText = () => {
    const d = new Date(selectedDate + "T00:00:00");
    const dateStr = d.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return selectedDate === getTodayStr() ? "Today — " + dateStr : dateStr;
  };

  // Add daily task
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      timeMin: parseInt(newTaskTime) || 0,
      done: false,
    };
    const current = daily[selectedDate] || [];
    updateState("daily", {
      ...daily,
      [selectedDate]: [...current, task],
    });
    setNewTaskTitle("");
    setNewTaskTime("");
  };

  // Toggle task done
  const toggleTask = (idx) => {
    const tasks = (daily[selectedDate] || []).map((t, i) =>
      i === idx ? { ...t, done: !t.done } : t,
    );
    updateState("daily", { ...daily, [selectedDate]: tasks });
  };

  // Delete task
  const deleteTask = (idx) => {
    const tasks = (daily[selectedDate] || []).filter((_, i) => i !== idx);
    updateState("daily", { ...daily, [selectedDate]: tasks });
  };

  // Toggle habit done
  const toggleHabit = (habitId) => {
    const dayLog = { ...(habitLog[selectedDate] || {}) };
    dayLog[habitId] = !dayLog[habitId];
    updateState("habitLog", { ...habitLog, [selectedDate]: dayLog });
  };

  // Add habit
  const addHabit = () => {
    if (!habitForm.title.trim()) return;
    if (habitForm.recurrence === "custom" && !habitForm.customDays.length) {
      showToast("Select at least one day", true);
      return;
    }
    const endDate =
      habitForm.duration === "indefinite"
        ? null
        : habitForm.duration === "custom"
          ? habitForm.endDate || null
          : computeHabitEndDate(habitForm.startDate, habitForm.duration);
    const habit = {
      id: "h-" + Date.now(),
      title: habitForm.title.trim(),
      timeMin: parseInt(habitForm.time) || 0,
      recurrence: habitForm.recurrence,
      customDays: [...habitForm.customDays],
      startDate: habitForm.startDate,
      endDate,
      active: true,
    };
    updateState("habits", [...habits, habit]);
    setHabitForm((f) => ({ ...f, title: "", time: "" }));
    showToast(`Habit "${habit.title}" created!`);
  };

  // Delete habit
  const deleteHabit = (idx) => {
    updateState(
      "habits",
      habits.filter((_, i) => i !== idx),
    );
  };

  // Export/import tasks
  const exportTasks = () => {
    const payload = {
      version: 1,
      type: "qa-tracker-tasks",
      exportedAt: new Date().toISOString(),
      data: { daily, habits, habitLog },
    };
    downloadJSON(payload, `qa-tasks-${getTodayStr()}.json`);
    showToast("Tasks exported!");
  };
  const importTasks = () => {
    pickJSONFile((data) => {
      if (data.type !== "qa-tracker-tasks") {
        showToast("Not a tasks export file", true);
        return;
      }
      const d = data.data || {};
      if (d.daily) updateState("daily", d.daily);
      if (d.habits) updateState("habits", d.habits);
      if (d.habitLog) updateState("habitLog", d.habitLog);
      showToast("Tasks imported!");
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="st-dash-header">
        <div className="st-dash-header-row">
          <div>
            <h1 className="st-dash-title">Daily Progress Tracker</h1>
            <p className="st-dash-subtitle">
              Daily tasks &amp; recurring habits with time tracking
            </p>
          </div>
          <div className="st-dash-actions">
            <button
              className="st-action-btn st-export-btn"
              onClick={exportTasks}
            >
              ⬇ Export Tasks
            </button>
            <button
              className="st-action-btn st-import-btn"
              onClick={importTasks}
            >
              ⬆ Import Tasks
            </button>
          </div>
        </div>
      </div>

      {/* View tabs */}
      <div className="st-view-tabs">
        <button
          className={`st-view-tab${view === "tasks" ? " active" : ""}`}
          onClick={() => setView("tasks")}
        >
          📋 Daily Tasks
        </button>
        <button
          className={`st-view-tab${view === "habits" ? " active" : ""}`}
          onClick={() => setView("habits")}
        >
          🔄 Recurring Habits
        </button>
      </div>

      {/* ── TASKS VIEW ── */}
      {view === "tasks" && (
        <div className="st-daily-main-grid">
          {/* Left: date strip + task list */}
          <div>
            {/* Date nav bar */}
            <div className="st-date-nav-bar">
              <div className="st-date-nav-main">
                <button
                  className="st-date-nav-btn"
                  title="Previous week"
                  onClick={() => {
                    const d = new Date(selectedDate + "T00:00:00");
                    d.setDate(d.getDate() - 7);
                    setSelectedDate(d.toISOString().slice(0, 10));
                  }}
                >
                  ◀
                </button>
                <div className="st-date-strip">
                  {stripDates.map((date) => {
                    const d = new Date(date + "T00:00:00");
                    const dot = dotClass(date);
                    return (
                      <div
                        key={date}
                        className={`st-date-chip${date === selectedDate ? " active" : ""}${date === getTodayStr() ? " today" : ""}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="st-date-chip-day">
                          {d.toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                        <span className="st-date-chip-num">{d.getDate()}</span>
                        <span
                          className={`st-date-chip-dot${dot ? " " + dot : ""}`}
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  className="st-date-nav-btn"
                  title="Next week"
                  onClick={() => {
                    const d = new Date(selectedDate + "T00:00:00");
                    d.setDate(d.getDate() + 7);
                    setSelectedDate(d.toISOString().slice(0, 10));
                  }}
                >
                  ▶
                </button>
              </div>
              <div className="st-date-nav-controls">
                <button
                  className="st-today-btn"
                  onClick={() => setSelectedDate(getTodayStr())}
                >
                  Today
                </button>
                <input
                  type="date"
                  className="st-date-picker-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Task panel */}
            <div className="st-task-panel">
              <div className="st-task-panel-header">
                <span className="st-task-date-label">{dateLabelText()}</span>
                <span className="st-task-summary-badge">{summaryText}</span>
              </div>
              <div className="st-task-list">
                {/* Habits section */}
                {habitsForSel.length > 0 && (
                  <>
                    <div className="st-task-section-hdr st-habit-section-hdr">
                      🔄 Recurring Habits
                      <span className="st-task-section-cnt">
                        {habitDone}/{habitsForSel.length}
                      </span>
                    </div>
                    {habitsForSel.map((h) => {
                      const done = !!habitLog[selectedDate]?.[h.id];
                      return (
                        <div
                          key={h.id}
                          className={`st-task-item st-habit-item${done ? " done" : ""}`}
                        >
                          <div
                            className={`st-task-check st-habit-check${done ? " done" : ""}`}
                            onClick={() => toggleHabit(h.id)}
                          >
                            {done && CHECK_SVG}
                          </div>
                          <span
                            className={`st-task-text${done ? " done" : ""}`}
                          >
                            {h.title}
                          </span>
                          {h.timeMin > 0 && (
                            <span className="st-task-time-badge">
                              {formatMinutes(h.timeMin)}
                            </span>
                          )}
                          <span className="st-habit-recur-badge">
                            {formatHabitRecurrence(h)}
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Daily tasks section */}
                {(tasksForDate.length > 0 || habitsForSel.length > 0) && (
                  <div className="st-task-section-hdr">
                    📋 Daily Tasks
                    <span className="st-task-section-cnt">
                      {taskDone}/{tasksForDate.length}
                    </span>
                  </div>
                )}
                {tasksForDate.length === 0 && (
                  <div className="st-no-tasks" style={{ padding: "12px 16px" }}>
                    {habitsForSel.length
                      ? "No one-off tasks. Add one below."
                      : "No tasks or habits for this day."}
                  </div>
                )}
                {tasksForDate.map((task, i) => (
                  <div
                    key={task.id || i}
                    className={`st-task-item${task.done ? " done" : ""}`}
                  >
                    <div
                      className={`st-task-check${task.done ? " done" : ""}`}
                      onClick={() => toggleTask(i)}
                    >
                      {task.done && CHECK_SVG}
                    </div>
                    <span className={`st-task-text${task.done ? " done" : ""}`}>
                      {task.title}
                    </span>
                    {task.timeMin > 0 && (
                      <span className="st-task-time-badge">
                        {formatMinutes(task.timeMin)}
                      </span>
                    )}
                    <button
                      className="st-task-del-btn"
                      onClick={() => deleteTask(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="st-add-task-form">
                <input
                  className="st-task-title-input"
                  placeholder="Add a one-off task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <input
                  type="number"
                  className="st-task-time-input"
                  placeholder="Min"
                  min={1}
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                />
                <button className="st-add-task-btn" onClick={addTask}>
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* Right: analytics */}
          <DailyAnalytics
            state={state}
            selectedDate={selectedDate}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
          />
        </div>
      )}

      {/* ── HABITS VIEW ── */}
      {view === "habits" && (
        <HabitsView
          state={state}
          habitForm={habitForm}
          setHabitForm={setHabitForm}
          onAddHabit={addHabit}
          onDeleteHabit={deleteHabit}
        />
      )}
    </div>
  );
}

// ── Analytics panel ──────────────────────────────────────────────────────────
function DailyAnalytics({ state, selectedDate, filterMode, setFilterMode }) {
  const daily = state.daily || {};
  const habits = state.habits || [];
  const habitLog = state.habitLog || {};

  const days = filterMode === "weekly" ? 7 : 30;

  // Build chart data
  const completionRateData = [];
  const tasksPerDayData = [];
  let cardDone = 0,
    cardTotal = 0,
    cardTime = 0;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const str = d.toISOString().slice(0, 10);
    const label =
      filterMode === "weekly"
        ? d.toLocaleDateString("en-US", { weekday: "short" })
        : d.getDate().toString();

    const tasks = daily[str] || [];
    const habitsOnDay = habits.filter((h) => habitAppliesOnDate(h, str));
    const total = tasks.length + habitsOnDay.length;
    const done =
      tasks.filter((t) => t.done).length +
      habitsOnDay.filter((h) => habitLog[str]?.[h.id]).length;
    const remaining = total - done;
    const pct = total ? Math.round((done / total) * 100) : null;

    completionRateData.push({ date: label, completion: pct });
    tasksPerDayData.push({ date: label, done, remaining });

    cardTotal += total;
    cardDone += done;
    cardTime +=
      tasks.filter((t) => t.done).reduce((s, t) => s + (t.timeMin || 0), 0) +
      habitsOnDay
        .filter((h) => habitLog[str]?.[h.id])
        .reduce((s, h) => s + (h.timeMin || 0), 0);
  }
  const cardPct = cardTotal ? Math.round((cardDone / cardTotal) * 100) : 0;

  // Time allocation pie data for selected date
  const sTasks = daily[selectedDate] || [];
  const sHabits = habits.filter((h) =>
    habitAppliesOnDate(h, selectedDate),
  );
  const doneTime =
    sTasks.filter((t) => t.done).reduce((s, t) => s + (t.timeMin || 0), 0) +
    sHabits
      .filter((h) => habitLog[selectedDate]?.[h.id])
      .reduce((s, h) => s + (h.timeMin || 0), 0);
  const remTime =
    sTasks.filter((t) => !t.done).reduce((s, t) => s + (t.timeMin || 0), 0) +
    sHabits
      .filter((h) => !habitLog[selectedDate]?.[h.id])
      .reduce((s, h) => s + (h.timeMin || 0), 0);
  const pieData =
    doneTime + remTime > 0
      ? [
          { name: "Done", value: doneTime },
          { name: "Remaining", value: remTime },
        ]
      : [{ name: "No data", value: 1 }];

  const completionChartConfig = {
    completion: { label: "Completion %", color: "#f59e0b" },
  };
  const tasksChartConfig = {
    done: { label: "Done", color: "#10b981" },
    remaining: { label: "Remaining", color: "#e5e7eb" },
  };

  return (
    <div className="st-daily-right">
      <div className="st-analytics-top-row">
        <h3 className="st-chart-title">Analytics</h3>
        <div className="st-filter-tabs">
          <button
            className={`st-filter-tab${filterMode === "weekly" ? " active" : ""}`}
            onClick={() => setFilterMode("weekly")}
          >
            Weekly
          </button>
          <button
            className={`st-filter-tab${filterMode === "monthly" ? " active" : ""}`}
            onClick={() => setFilterMode("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="st-analytics-cards">
        <div className="st-ana-card">
          <div className="st-ana-val">{cardDone}</div>
          <div className="st-ana-lbl">Items Done</div>
        </div>
        <div className="st-ana-card">
          <div className="st-ana-val">{cardTotal}</div>
          <div className="st-ana-lbl">Total Items</div>
        </div>
        <div className="st-ana-card">
          <div className="st-ana-val">{cardPct}%</div>
          <div className="st-ana-lbl">Completion</div>
        </div>
        <div className="st-ana-card">
          <div className="st-ana-val">{formatMinutes(cardTime)}</div>
          <div className="st-ana-lbl">Time Done</div>
        </div>
      </div>

      {/* Completion Rate line chart */}
      <div className="st-chart-card" style={{ marginBottom: 10 }}>
        <h3 className="st-chart-title">
          Completion Rate{" "}
          <span className="st-chart-subtitle">
            ({filterMode === "weekly" ? "last 7 days" : "last 30 days"})
          </span>
        </h3>
        <ChartContainer config={completionChartConfig} className="h-[140px] w-full">
          <LineChart data={completionRateData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => v + "%"} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent formatter={(v) => (v !== null ? v + "%" : "—")} />} />
            <Line
              type="monotone"
              dataKey="completion"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#f59e0b" }}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      </div>

      {/* Time Allocation + Tasks per Day */}
      <div className="st-charts-row-2">
        <div className="st-chart-card">
          <h3 className="st-chart-title">Time Allocation</h3>
          <div className="st-pie-wrap">
            <ChartContainer config={{ done: { label: "Done", color: "#10b981" }, remaining: { label: "Remaining", color: "#e5e7eb" } }} className="h-[180px] w-full">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                  paddingAngle={pieData.length > 1 ? 2 : 0}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        entry.name === "Done"
                          ? "#10b981"
                          : entry.name === "Remaining"
                            ? "#e5e7eb"
                            : "#e5e7eb"
                      }
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => [formatMinutes(v), n]} hideLabel />} />
                <Legend
                  iconType="square"
                  iconSize={10}
                  formatter={(value) => value}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ChartContainer>
          </div>
        </div>

        <div className="st-chart-card">
          <h3 className="st-chart-title">Tasks per Day</h3>
          <ChartContainer config={tasksChartConfig} className="h-[180px] w-full">
            <BarChart data={tasksPerDayData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="done" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

// ── Habits view ──────────────────────────────────────────────────────────────
function HabitsView({
  state,
  habitForm,
  setHabitForm,
  onAddHabit,
  onDeleteHabit,
}) {
  const today = getTodayStr();
  const habits = state.habits || [];
  const habitLog = state.habitLog || {};

  // Habit completion rates bar data
  const palette = ["#2563eb", "#7c3aed", "#059669", "#dc2626", "#f59e0b", "#0891b2", "#db2777"];
  const completionRatesData = habits.map((h, i) => {
    const s = countHabitScheduled(h, today);
    const d = countHabitDone(h, habitLog);
    return {
      name: h.title.length > 14 ? h.title.slice(0, 14) + "…" : h.title,
      completion: s ? Math.round((d / s) * 100) : 0,
      fill: palette[i % palette.length],
    };
  });

  // Habits this week bar data
  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const str = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const habitsDay = habits.filter((h) => habitAppliesOnDate(h, str));
    const scheduled = habitsDay.length;
    const done = habitsDay.filter((h) => habitLog[str]?.[h.id]).length;
    weekData.push({ date: label, done, remaining: scheduled - done });
  }

  const weekChartConfig = {
    done: { label: "Done", color: "#10b981" },
    remaining: { label: "Scheduled", color: "#e5e7eb" },
  };
  const ratesChartConfig = {
    completion: { label: "Completion %", color: "#2563eb" },
  };

  const computedEnd =
    habitForm.duration === "indefinite"
      ? null
      : habitForm.duration === "custom"
        ? habitForm.endDate
        : computeHabitEndDate(habitForm.startDate, habitForm.duration);

  return (
    <div>
      <div className="st-habits-layout">
        {/* New habit form */}
        <div className="st-habit-form-card">
          <h3 className="st-chart-title" style={{ marginBottom: 14 }}>
            ➕ New Recurring Habit
          </h3>
          <div className="st-hf-row">
            <div className="st-hf-group" style={{ flex: 2 }}>
              <label className="st-hf-label">Habit Name</label>
              <input
                className="st-hf-input"
                placeholder="e.g. Morning Review"
                value={habitForm.title}
                onChange={(e) =>
                  setHabitForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="st-hf-group">
              <label className="st-hf-label">Time (min)</label>
              <input
                type="number"
                className="st-hf-input"
                placeholder="30"
                min={1}
                value={habitForm.time}
                onChange={(e) =>
                  setHabitForm((f) => ({ ...f, time: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="st-hf-group">
            <label className="st-hf-label">Repeat Pattern</label>
            <div className="st-hf-pills">
              {["daily", "weekdays", "weekends", "custom"].map((r) => (
                <button
                  key={r}
                  className={`st-pill${habitForm.recurrence === r ? " active" : ""}`}
                  onClick={() => setHabitForm((f) => ({ ...f, recurrence: r }))}
                >
                  {r === "daily"
                    ? "Daily"
                    : r === "weekdays"
                      ? "Weekdays"
                      : r === "weekends"
                        ? "Weekends"
                        : "Custom Days"}
                </button>
              ))}
            </div>
          </div>
          {habitForm.recurrence === "custom" && (
            <div className="st-hf-group">
              <label className="st-hf-label">Select Days</label>
              <div className="st-day-toggles">
                {DAYS.map((d, i) => (
                  <button
                    key={i}
                    className={`st-day-toggle${habitForm.customDays.includes(i) ? " active" : ""}`}
                    onClick={() =>
                      setHabitForm((f) => ({
                        ...f,
                        customDays: f.customDays.includes(i)
                          ? f.customDays.filter((x) => x !== i)
                          : [...f.customDays, i],
                      }))
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="st-hf-group">
            <label className="st-hf-label">Duration</label>
            <div className="st-hf-pills">
              {[
                ["1week", "1 Week"],
                ["2weeks", "2 Weeks"],
                ["3weeks", "3 Weeks"],
                ["1month", "1 Month"],
                ["2months", "2 Months"],
                ["indefinite", "Indefinite"],
                ["custom", "Custom"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  className={`st-pill${habitForm.duration === v ? " active" : ""}`}
                  onClick={() => setHabitForm((f) => ({ ...f, duration: v }))}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="st-hf-row">
            <div className="st-hf-group">
              <label className="st-hf-label">Start Date</label>
              <input
                type="date"
                className="st-hf-input"
                value={habitForm.startDate}
                onChange={(e) =>
                  setHabitForm((f) => ({ ...f, startDate: e.target.value }))
                }
              />
            </div>
            <div className="st-hf-group">
              <label className="st-hf-label">
                End Date{" "}
                {computedEnd && (
                  <span className="st-hf-computed">(→ {computedEnd})</span>
                )}
              </label>
              <input
                type="date"
                className="st-hf-input"
                value={computedEnd || habitForm.endDate || ""}
                disabled={
                  habitForm.duration !== "indefinite" &&
                  habitForm.duration !== "custom"
                }
                onChange={(e) =>
                  setHabitForm((f) => ({ ...f, endDate: e.target.value }))
                }
              />
            </div>
          </div>
          <button className="st-add-habit-btn" onClick={onAddHabit}>
            Create Habit
          </button>
        </div>

        {/* Habits list */}
        <div className="st-habits-list-card">
          <h3 className="st-chart-title" style={{ marginBottom: 12 }}>
            Your Habits
          </h3>
          {habits.length === 0 ? (
            <div className="st-no-tasks" style={{ padding: 18 }}>
              No habits yet. Create one using the form!
            </div>
          ) : (
            habits.map((h, i) => {
              const sched = countHabitScheduled(h, today);
              const done = countHabitDone(h, habitLog);
              const rate = sched ? Math.round((done / sched) * 100) : 0;
              return (
                <div key={h.id} className="st-habit-list-item">
                  <div className="st-habit-list-icon">🔄</div>
                  <div className="st-habit-list-body">
                    <div className="st-habit-list-title">{h.title}</div>
                    <div className="st-habit-list-meta">
                      {formatHabitRecurrence(h)}{" "}
                      {h.timeMin ? "· " + formatMinutes(h.timeMin) : ""} ·{" "}
                      {h.startDate} {h.endDate ? "→ " + h.endDate : "∞"} ·{" "}
                      <span style={{ color: "#10b981", fontWeight: 600 }}>
                        {done}/{sched} ({rate}%)
                      </span>
                    </div>
                    <div className="st-habit-rate-bar">
                      <div
                        className="st-habit-rate-fill"
                        style={{ width: rate + "%" }}
                      />
                    </div>
                  </div>
                  <button
                    className="st-task-del-btn"
                    style={{ fontSize: "1rem" }}
                    onClick={() => onDeleteHabit(i)}
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Habit charts */}
      <div className="st-habit-analytics-row">
        <div className="st-chart-card">
          <h3 className="st-chart-title">Habit Completion Rates</h3>
          {habits.length === 0 ? (
            <div className="st-no-tasks" style={{ padding: 18, textAlign: "center" }}>
              No habits to display.
            </div>
          ) : (
            <ChartContainer config={ratesChartConfig} className="h-[160px] w-full">
              <BarChart
                layout="vertical"
                data={completionRatesData}
                margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke="#f3f4f6" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(v) => v + "%"}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => v + "%"} />} />
                <Bar dataKey="completion" radius={5}>
                  {completionRatesData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </div>

        <div className="st-chart-card">
          <h3 className="st-chart-title">Habits This Week</h3>
          <ChartContainer config={weekChartConfig} className="h-[160px] w-full">
            <BarChart data={weekData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="done" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
