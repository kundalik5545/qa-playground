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
import { cn } from "@/lib/utils";

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
  const [view, setView] = useState("tasks");
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

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      timeMin: parseInt(newTaskTime) || 0,
      done: false,
    };
    const current = daily[selectedDate] || [];
    updateState("daily", { ...daily, [selectedDate]: [...current, task] });
    setNewTaskTitle("");
    setNewTaskTime("");
  };

  const toggleTask = (idx) => {
    const tasks = (daily[selectedDate] || []).map((t, i) =>
      i === idx ? { ...t, done: !t.done } : t,
    );
    updateState("daily", { ...daily, [selectedDate]: tasks });
  };

  const deleteTask = (idx) => {
    const tasks = (daily[selectedDate] || []).filter((_, i) => i !== idx);
    updateState("daily", { ...daily, [selectedDate]: tasks });
  };

  const toggleHabit = (habitId) => {
    const dayLog = { ...(habitLog[selectedDate] || {}) };
    dayLog[habitId] = !dayLog[habitId];
    updateState("habitLog", { ...habitLog, [selectedDate]: dayLog });
  };

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

  const deleteHabit = (idx) => {
    updateState("habits", habits.filter((_, i) => i !== idx));
  };

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
      <div className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Daily Progress Tracker</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Daily tasks &amp; recurring habits with time tracking
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
              onClick={exportTasks}
            >
              ⬇ Export Tasks
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
              onClick={importTasks}
            >
              ⬆ Import Tasks
            </button>
          </div>
        </div>
      </div>

      {/* View tabs */}
      <div className="mb-4 flex gap-1.5">
        <button
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            view === "tasks"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted",
          )}
          onClick={() => setView("tasks")}
        >
          📋 Daily Tasks
        </button>
        <button
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            view === "habits"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted",
          )}
          onClick={() => setView("habits")}
        >
          🔄 Recurring Habits
        </button>
      </div>

      {/* ── TASKS VIEW ── */}
      {view === "tasks" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] items-start">
          {/* Left: date strip + task list */}
          <div>
            {/* Date nav bar */}
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-3">
              <button
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                title="Previous week"
                onClick={() => {
                  const d = new Date(selectedDate + "T00:00:00");
                  d.setDate(d.getDate() - 7);
                  setSelectedDate(d.toISOString().slice(0, 10));
                }}
              >
                ◀
              </button>
              <div className="flex flex-1 justify-between gap-0.5">
                {stripDates.map((date) => {
                  const d = new Date(date + "T00:00:00");
                  const dot = dotClass(date);
                  const isSelected = date === selectedDate;
                  const isToday = date === getTodayStr();
                  return (
                    <div
                      key={date}
                      className={cn(
                        "flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl py-2 transition-colors hover:bg-muted",
                        isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                        !isSelected && isToday && "ring-2 ring-primary ring-offset-1",
                      )}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className={cn(
                        "text-[10px] font-semibold uppercase tracking-wide",
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground",
                      )}>
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-base font-bold leading-none">{d.getDate()}</span>
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          isSelected && dot === "all-done" && "bg-white",
                          isSelected && dot === "has-tasks" && "bg-white/60",
                          !isSelected && dot === "all-done" && "bg-emerald-500",
                          !isSelected && dot === "has-tasks" && "bg-amber-400",
                          !dot && "bg-transparent",
                        )}
                      />
                    </div>
                  );
                })}
              </div>
              <button
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                title="Next week"
                onClick={() => {
                  const d = new Date(selectedDate + "T00:00:00");
                  d.setDate(d.getDate() + 7);
                  setSelectedDate(d.toISOString().slice(0, 10));
                }}
              >
                ▶
              </button>
              <div className="flex shrink-0 items-center gap-2 border-l border-border pl-2">
                <button
                  className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  onClick={() => setSelectedDate(getTodayStr())}
                >
                  Today
                </button>
                <input
                  type="date"
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Task panel */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold">{dateLabelText()}</span>
                <span className="text-xs text-muted-foreground">{summaryText}</span>
              </div>
              <div className="divide-y divide-border">
                {/* Habits section */}
                {habitsForSel.length > 0 && (
                  <>
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      🔄 Recurring Habits
                      <span className="font-bold text-foreground">
                        {habitDone}/{habitsForSel.length}
                      </span>
                    </div>
                    {habitsForSel.map((h) => {
                      const done = !!habitLog[selectedDate]?.[h.id];
                      return (
                        <div
                          key={h.id}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors",
                            done && "opacity-60",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors",
                              done
                                ? "border-blue-500 bg-blue-500"
                                : "border-border hover:border-blue-500",
                            )}
                            onClick={() => toggleHabit(h.id)}
                          >
                            {done && CHECK_SVG}
                          </div>
                          <span className={cn("flex-1 text-sm", done && "line-through text-muted-foreground")}>
                            {h.title}
                          </span>
                          {h.timeMin > 0 && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              {formatMinutes(h.timeMin)}
                            </span>
                          )}
                          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {formatHabitRecurrence(h)}
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Daily tasks section */}
                {(tasksForDate.length > 0 || habitsForSel.length > 0) && (
                  <div className="flex items-center justify-between bg-muted/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    📋 Daily Tasks
                    <span className="font-bold text-foreground">
                      {taskDone}/{tasksForDate.length}
                    </span>
                  </div>
                )}
                {tasksForDate.length === 0 && (
                  <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                    {habitsForSel.length
                      ? "No one-off tasks. Add one below."
                      : "No tasks or habits for this day."}
                  </div>
                )}
                {tasksForDate.map((task, i) => (
                  <div
                    key={task.id || i}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors",
                      task.done && "opacity-60",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors",
                        task.done
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-border hover:border-emerald-500",
                      )}
                      onClick={() => toggleTask(i)}
                    >
                      {task.done && CHECK_SVG}
                    </div>
                    <span className={cn("flex-1 text-sm", task.done && "line-through text-muted-foreground")}>
                      {task.title}
                    </span>
                    {task.timeMin > 0 && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        {formatMinutes(task.timeMin)}
                      </span>
                    )}
                    <button
                      className="flex h-6 w-6 items-center justify-center rounded text-base leading-none text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      onClick={() => deleteTask(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                <input
                  className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Add a one-off task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <input
                  type="number"
                  className="w-16 rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Min"
                  min={1}
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                />
                <button
                  className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  onClick={addTask}
                >
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

  const completionRateData = [];
  const tasksPerDayData = [];
  let cardDone = 0, cardTotal = 0, cardTime = 0;

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

  const sTasks = daily[selectedDate] || [];
  const sHabits = habits.filter((h) => habitAppliesOnDate(h, selectedDate));
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

  const completionChartConfig = { completion: { label: "Completion %", color: "#f59e0b" } };
  const tasksChartConfig = {
    done: { label: "Done", color: "#10b981" },
    remaining: { label: "Remaining", color: "#e5e7eb" },
  };

  return (
    <div>
      {/* Analytics header + filter */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Analytics</h3>
        <div className="flex gap-1 rounded-lg bg-muted p-0.5">
          <button
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              filterMode === "weekly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setFilterMode("weekly")}
          >
            Weekly
          </button>
          <button
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              filterMode === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setFilterMode("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        {[
          { val: cardDone, lbl: "Items Done" },
          { val: cardTotal, lbl: "Total Items" },
          { val: `${cardPct}%`, lbl: "Completion" },
          { val: formatMinutes(cardTime), lbl: "Time Done" },
        ].map(({ val, lbl }) => (
          <div key={lbl} className="rounded-lg border border-border bg-card px-3 py-2.5 text-center">
            <div className="text-xl font-bold">{val}</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{lbl}</div>
          </div>
        ))}
      </div>

      {/* Completion Rate chart */}
      <div className="mb-3 rounded-xl border border-border bg-card p-3">
        <h3 className="mb-2 text-sm font-semibold">
          Completion Rate{" "}
          <span className="text-xs font-normal text-muted-foreground">
            ({filterMode === "weekly" ? "last 7 days" : "last 30 days"})
          </span>
        </h3>
        <ChartContainer config={completionChartConfig} className="h-[220px] w-full">
          <LineChart data={completionRateData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => v + "%"} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent formatter={(v) => (v !== null ? v + "%" : "—")} />} />
            <Line type="monotone" dataKey="completion" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: "#f59e0b" }} connectNulls />
          </LineChart>
        </ChartContainer>
      </div>

      {/* Time Allocation + Tasks per Day */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold">Time Allocation</h3>
          <ChartContainer config={{ done: { label: "Done", color: "#10b981" }, remaining: { label: "Remaining", color: "#e5e7eb" } }} className="h-[240px] w-full">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={pieData.length > 1 ? 2 : 0}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.name === "Done" ? "#10b981" : "#e5e7eb"} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => [formatMinutes(v), n]} hideLabel />} />
              <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ChartContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold">Tasks per Day</h3>
          <ChartContainer config={tasksChartConfig} className="h-[240px] w-full">
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
function HabitsView({ state, habitForm, setHabitForm, onAddHabit, onDeleteHabit }) {
  const today = getTodayStr();
  const habits = state.habits || [];
  const habitLog = state.habitLog || {};

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
  const ratesChartConfig = { completion: { label: "Completion %", color: "#2563eb" } };

  const computedEnd =
    habitForm.duration === "indefinite"
      ? null
      : habitForm.duration === "custom"
        ? habitForm.endDate
        : computeHabitEndDate(habitForm.startDate, habitForm.duration);

  return (
    <div>
      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* New habit form */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3.5 text-sm font-semibold">➕ New Recurring Habit</h3>

          <div className="mb-3 flex gap-3">
            <div className="flex flex-col gap-1" style={{ flex: 2 }}>
              <label className="text-xs font-semibold text-muted-foreground">Habit Name</label>
              <input
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="e.g. Morning Review"
                value={habitForm.title}
                onChange={(e) => setHabitForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">Time (min)</label>
              <input
                type="number"
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="30"
                min={1}
                value={habitForm.time}
                onChange={(e) => setHabitForm((f) => ({ ...f, time: e.target.value }))}
              />
            </div>
          </div>

          <div className="mb-3 flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Repeat Pattern</label>
            <div className="flex flex-wrap gap-1.5">
              {["daily", "weekdays", "weekends", "custom"].map((r) => (
                <button
                  key={r}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    habitForm.recurrence === r
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                  onClick={() => setHabitForm((f) => ({ ...f, recurrence: r }))}
                >
                  {r === "daily" ? "Daily" : r === "weekdays" ? "Weekdays" : r === "weekends" ? "Weekends" : "Custom Days"}
                </button>
              ))}
            </div>
          </div>

          {habitForm.recurrence === "custom" && (
            <div className="mb-3 flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">Select Days</label>
              <div className="flex gap-1.5">
                {DAYS.map((d, i) => (
                  <button
                    key={i}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                      habitForm.customDays.includes(i)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                    )}
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

          <div className="mb-3 flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Duration</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                ["1week", "1 Week"], ["2weeks", "2 Weeks"], ["3weeks", "3 Weeks"],
                ["1month", "1 Month"], ["2months", "2 Months"], ["indefinite", "Indefinite"], ["custom", "Custom"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    habitForm.duration === v
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                  onClick={() => setHabitForm((f) => ({ ...f, duration: v }))}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3 flex gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">Start Date</label>
              <input
                type="date"
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={habitForm.startDate}
                onChange={(e) => setHabitForm((f) => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">
                End Date{" "}
                {computedEnd && (
                  <span className="text-xs text-muted-foreground">(→ {computedEnd})</span>
                )}
              </label>
              <input
                type="date"
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                value={computedEnd || habitForm.endDate || ""}
                disabled={habitForm.duration !== "indefinite" && habitForm.duration !== "custom"}
                onChange={(e) => setHabitForm((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </div>

          <button
            className="mt-1 w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            onClick={onAddHabit}
          >
            Create Habit
          </button>
        </div>

        {/* Habits list */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold">Your Habits</h3>
          {habits.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No habits yet. Create one using the form!
            </div>
          ) : (
            habits.map((h, i) => {
              const sched = countHabitScheduled(h, today);
              const done = countHabitDone(h, habitLog);
              const rate = sched ? Math.round((done / sched) * 100) : 0;
              return (
                <div key={h.id} className="flex items-start gap-3 border-b border-border py-2.5 last:border-0">
                  <div className="mt-0.5 text-xl">🔄</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{h.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {formatHabitRecurrence(h)}{" "}
                      {h.timeMin ? "· " + formatMinutes(h.timeMin) : ""} ·{" "}
                      {h.startDate} {h.endDate ? "→ " + h.endDate : "∞"} ·{" "}
                      <span style={{ color: "#10b981", fontWeight: 600 }}>
                        {done}/{sched} ({rate}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: rate + "%" }}
                      />
                    </div>
                  </div>
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded text-lg leading-none text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold">Habit Completion Rates</h3>
          {habits.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">No habits to display.</div>
          ) : (
            <ChartContainer config={ratesChartConfig} className="h-[220px] w-full">
              <BarChart layout="vertical" data={completionRatesData} margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => v + "%"} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
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

        <div className="rounded-xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold">Habits This Week</h3>
          <ChartContainer config={weekChartConfig} className="h-[220px] w-full">
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
