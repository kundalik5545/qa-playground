"use client";

import { useState, useEffect, useRef } from "react";
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

  const habitsForDate = (date) =>
    state.habits.filter((h) => habitAppliesOnDate(h, date));

  // Date strip dot class
  const dotClass = (date) => {
    const tasks = state.daily[date] || [];
    const habits = habitsForDate(date);
    const done =
      tasks.filter((t) => t.done).length +
      habits.filter((h) => state.habitLog[date]?.[h.id]).length;
    const total = tasks.length + habits.length;
    if (!total) return "";
    return done === total ? "all-done" : "has-tasks";
  };

  // Task summary for selected date
  const tasksForDate = state.daily[selectedDate] || [];
  const habitsForSel = habitsForDate(selectedDate);
  const taskDone = tasksForDate.filter((t) => t.done).length;
  const habitDone = habitsForSel.filter(
    (h) => state.habitLog[selectedDate]?.[h.id],
  ).length;
  const totalMin =
    tasksForDate.reduce((s, t) => s + (t.timeMin || 0), 0) +
    habitsForSel.reduce((s, h) => s + (h.timeMin || 0), 0);
  const doneMin =
    tasksForDate
      .filter((t) => t.done)
      .reduce((s, t) => s + (t.timeMin || 0), 0) +
    habitsForSel
      .filter((h) => state.habitLog[selectedDate]?.[h.id])
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
    const current = state.daily[selectedDate] || [];
    updateState("daily", {
      ...state.daily,
      [selectedDate]: [...current, task],
    });
    setNewTaskTitle("");
    setNewTaskTime("");
  };

  // Toggle task done
  const toggleTask = (idx) => {
    const tasks = (state.daily[selectedDate] || []).map((t, i) =>
      i === idx ? { ...t, done: !t.done } : t,
    );
    updateState("daily", { ...state.daily, [selectedDate]: tasks });
  };

  // Delete task
  const deleteTask = (idx) => {
    const tasks = (state.daily[selectedDate] || []).filter((_, i) => i !== idx);
    updateState("daily", { ...state.daily, [selectedDate]: tasks });
  };

  // Toggle habit done
  const toggleHabit = (habitId) => {
    const dayLog = { ...(state.habitLog[selectedDate] || {}) };
    dayLog[habitId] = !dayLog[habitId];
    updateState("habitLog", { ...state.habitLog, [selectedDate]: dayLog });
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
    updateState("habits", [...state.habits, habit]);
    setHabitForm((f) => ({ ...f, title: "", time: "" }));
    showToast(`Habit "${habit.title}" created!`);
  };

  // Delete habit
  const deleteHabit = (idx) => {
    updateState(
      "habits",
      state.habits.filter((_, i) => i !== idx),
    );
  };

  // Export/import tasks
  const exportTasks = () => {
    const payload = {
      version: 1,
      type: "qa-tracker-tasks",
      exportedAt: new Date().toISOString(),
      data: {
        daily: state.daily,
        habits: state.habits,
        habitLog: state.habitLog,
      },
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
                      const done = !!state.habitLog[selectedDate]?.[h.id];
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
  const progressRef = useRef(null);
  const timePieRef = useRef(null);
  const barRef = useRef(null);
  const charts = useRef({});

  const days = filterMode === "weekly" ? 7 : 30;

  useEffect(() => {
    const loadAndRender = () => {
      if (window.Chart) {
        renderCharts();
        return;
      }
      const s = document.createElement("script");
      s.src =
        "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
      s.onload = renderCharts;
      document.head.appendChild(s);
    };
    loadAndRender();
    return () => {
      Object.values(charts.current).forEach((c) => {
        try {
          c.destroy();
        } catch (_) {}
      });
      charts.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, filterMode, selectedDate]);

  function renderCharts() {
    Object.values(charts.current).forEach((c) => {
      try {
        c.destroy();
      } catch (_) {}
    });
    charts.current = {};
    const C = window.Chart;
    if (!C) return;

    const labels = [],
      completed = [],
      totals = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().slice(0, 10);
      labels.push(
        filterMode === "weekly"
          ? d.toLocaleDateString("en-US", { weekday: "short" })
          : d.getDate().toString(),
      );
      const tasks = state.daily[str] || [];
      const habits = state.habits.filter((h) => habitAppliesOnDate(h, str));
      completed.push(
        tasks.filter((t) => t.done).length +
          habits.filter((h) => state.habitLog[str]?.[h.id]).length,
      );
      totals.push(tasks.length + habits.length);
    }

    const totalItems = totals.reduce((a, b) => a + b, 0);
    const doneItems = completed.reduce((a, b) => a + b, 0);
    const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;
    const ratePct = totals.map((t, i) =>
      t ? Math.round((completed[i] / t) * 100) : null,
    );

    // Completion rate line
    if (progressRef.current) {
      charts.current.progress = new C(progressRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Completion %",
              data: ratePct,
              borderColor: "#f59e0b",
              backgroundColor: "rgba(245,158,11,0.08)",
              borderWidth: 2.5,
              pointBackgroundColor: "#f59e0b",
              pointRadius: 4,
              fill: true,
              tension: 0.35,
              spanGaps: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: {
                callback: (v) => v + "%",
                font: { family: "'DM Sans'" },
              },
              grid: { color: "#f3f4f6" },
            },
            x: {
              ticks: { font: { family: "'DM Sans'", size: 11 } },
              grid: { display: false },
            },
          },
        },
      });
    }

    // Time pie for selected date
    const sTasks = state.daily[selectedDate] || [];
    const sHabits = state.habits.filter((h) =>
      habitAppliesOnDate(h, selectedDate),
    );
    const doneT =
      sTasks.filter((t) => t.done).reduce((s, t) => s + (t.timeMin || 0), 0) +
      sHabits
        .filter((h) => state.habitLog[selectedDate]?.[h.id])
        .reduce((s, h) => s + (h.timeMin || 0), 0);
    const remT =
      sTasks.filter((t) => !t.done).reduce((s, t) => s + (t.timeMin || 0), 0) +
      sHabits
        .filter((h) => !state.habitLog[selectedDate]?.[h.id])
        .reduce((s, h) => s + (h.timeMin || 0), 0);
    if (timePieRef.current) {
      charts.current.timePie = new C(timePieRef.current, {
        type: "doughnut",
        data: {
          labels: ["Done", "Remaining"],
          datasets: [
            {
              data: [doneT || 0, remT || (doneT ? 0 : 1)],
              backgroundColor: ["#10b981", "#e5e7eb"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: { font: { family: "'DM Sans'", size: 12 } },
            },
          },
        },
      });
    }

    // Tasks per day bar
    if (barRef.current) {
      charts.current.bar = new C(barRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Done",
              data: completed,
              backgroundColor: "#10b981",
              borderRadius: 4,
            },
            {
              label: "Remaining",
              data: totals.map((t, i) => t - completed[i]),
              backgroundColor: "#e5e7eb",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: { font: { family: "'DM Sans'", size: 12 } },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: { font: { family: "'DM Sans'", size: 11 } },
              grid: { display: false },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { stepSize: 1, font: { family: "'DM Sans'" } },
              grid: { color: "#f3f4f6" },
            },
          },
        },
      });
    }

    return { totalItems, doneItems, pct };
  }

  // Recalculate for analytics cards
  let cardDone = 0,
    cardTotal = 0,
    cardTime = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const str = d.toISOString().slice(0, 10);
    const tasks = state.daily[str] || [];
    const habits = state.habits.filter((h) => habitAppliesOnDate(h, str));
    cardTotal += tasks.length + habits.length;
    cardDone +=
      tasks.filter((t) => t.done).length +
      habits.filter((h) => state.habitLog[str]?.[h.id]).length;
    cardTime +=
      tasks.filter((t) => t.done).reduce((s, t) => s + (t.timeMin || 0), 0) +
      habits
        .filter((h) => state.habitLog[str]?.[h.id])
        .reduce((s, h) => s + (h.timeMin || 0), 0);
  }
  const cardPct = cardTotal ? Math.round((cardDone / cardTotal) * 100) : 0;

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
      <div className="st-chart-card" style={{ marginBottom: 10 }}>
        <h3 className="st-chart-title">
          Completion Rate{" "}
          <span className="st-chart-subtitle">
            ({filterMode === "weekly" ? "last 7 days" : "last 30 days"})
          </span>
        </h3>
        <canvas ref={progressRef} height={140} />
      </div>
      <div className="st-charts-row-2">
        <div className="st-chart-card">
          <h3 className="st-chart-title">Time Allocation</h3>
          <div className="st-pie-wrap">
            <canvas ref={timePieRef} />
          </div>
        </div>
        <div className="st-chart-card">
          <h3 className="st-chart-title">Tasks per Day</h3>
          <canvas ref={barRef} height={180} />
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
  const barRef = useRef(null);
  const weekRef = useRef(null);
  const charts = useRef({});

  useEffect(() => {
    const load = () => {
      if (window.Chart) {
        renderHabitCharts();
        return;
      }
      const s = document.createElement("script");
      s.src =
        "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
      s.onload = renderHabitCharts;
      document.head.appendChild(s);
    };
    load();
    return () => {
      Object.values(charts.current).forEach((c) => {
        try {
          c.destroy();
        } catch (_) {}
      });
      charts.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.habits, state.habitLog]);

  function renderHabitCharts() {
    Object.values(charts.current).forEach((c) => {
      try {
        c.destroy();
      } catch (_) {}
    });
    charts.current = {};
    const C = window.Chart;
    if (!C) return;
    const today = getTodayStr();
    const palette = [
      "#2563eb",
      "#7c3aed",
      "#059669",
      "#dc2626",
      "#f59e0b",
      "#0891b2",
      "#db2777",
    ];

    // Completion rates per habit
    if (barRef.current && state.habits.length) {
      const labels = state.habits.map((h) =>
        h.title.length > 14 ? h.title.slice(0, 14) + "…" : h.title,
      );
      const rates = state.habits.map((h) => {
        const s = countHabitScheduled(h, today),
          d = countHabitDone(h, state.habitLog);
        return s ? Math.round((d / s) * 100) : 0;
      });
      const colors = state.habits.map((_, i) => palette[i % palette.length]);
      charts.current.bar = new C(barRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Completion %",
              data: rates,
              backgroundColor: colors,
              borderRadius: 5,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              min: 0,
              max: 100,
              ticks: {
                callback: (v) => v + "%",
                font: { family: "'DM Sans'" },
              },
              grid: { color: "#f3f4f6" },
            },
            y: {
              ticks: { font: { family: "'DM Sans'", size: 11 } },
              grid: { display: false },
            },
          },
        },
      });
    }

    // This week
    if (weekRef.current) {
      const wlabels = [],
        wDone = [],
        wSched = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const str = d.toISOString().slice(0, 10);
        wlabels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
        const habitsDay = state.habits.filter((h) =>
          habitAppliesOnDate(h, str),
        );
        wSched.push(habitsDay.length);
        wDone.push(habitsDay.filter((h) => state.habitLog[str]?.[h.id]).length);
      }
      charts.current.week = new C(weekRef.current, {
        type: "bar",
        data: {
          labels: wlabels,
          datasets: [
            {
              label: "Done",
              data: wDone,
              backgroundColor: "#10b981",
              borderRadius: 4,
            },
            {
              label: "Scheduled",
              data: wSched.map((s, i) => s - wDone[i]),
              backgroundColor: "#e5e7eb",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: { font: { family: "'DM Sans'", size: 12 } },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: { font: { family: "'DM Sans'", size: 11 } },
              grid: { display: false },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { stepSize: 1, font: { family: "'DM Sans'" } },
              grid: { color: "#f3f4f6" },
            },
          },
        },
      });
    }
  }

  const today = getTodayStr();
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
          {state.habits.length === 0 ? (
            <div className="st-no-tasks" style={{ padding: 18 }}>
              No habits yet. Create one using the form!
            </div>
          ) : (
            state.habits.map((h, i) => {
              const sched = countHabitScheduled(h, today);
              const done = countHabitDone(h, state.habitLog);
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
          <canvas ref={barRef} height={160} />
        </div>
        <div className="st-chart-card">
          <h3 className="st-chart-title">Habits This Week</h3>
          <canvas ref={weekRef} height={160} />
        </div>
      </div>
    </div>
  );
}
