"use client";

import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

Chart.register(...registerables);

const CHECK_SVG = (
  <svg viewBox="0 0 12 12" width={10} height={10}>
    <polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyTrackerView({ state, updateState, showToast }) {
  const [view, setView]                 = useState("tasks");
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [filterMode, setFilterMode]     = useState("weekly");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime]   = useState("");
  const [habitForm, setHabitForm] = useState({
    title: "", time: "", recurrence: "daily", customDays: [],
    duration: "1month", startDate: getTodayStr(), endDate: "",
  });

  const stripDates = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(selectedDate + "T00:00:00"); d.setDate(d.getDate() + i);
    stripDates.push(d.toISOString().slice(0, 10));
  }

  const habitsForDate = (date) => state.habits.filter((h) => habitAppliesOnDate(h, date));

  const dotClass = (date) => {
    const tasks  = state.daily[date] || [];
    const habits = habitsForDate(date);
    const done   = tasks.filter((t) => t.done).length + habits.filter((h) => state.habitLog[date]?.[h.id]).length;
    const total  = tasks.length + habits.length;
    if (!total) return "";
    return done === total ? "all-done" : "has-tasks";
  };

  const tasksForDate = state.daily[selectedDate] || [];
  const habitsForSel = habitsForDate(selectedDate);
  const taskDone     = tasksForDate.filter((t) => t.done).length;
  const habitDone    = habitsForSel.filter((h) => state.habitLog[selectedDate]?.[h.id]).length;
  const totalMin     = tasksForDate.reduce((s, t) => s + (t.timeMin || 0), 0) + habitsForSel.reduce((s, h) => s + (h.timeMin || 0), 0);
  const doneMin      = tasksForDate.filter((t) => t.done).reduce((s, t) => s + (t.timeMin || 0), 0) + habitsForSel.filter((h) => state.habitLog[selectedDate]?.[h.id]).reduce((s, h) => s + (h.timeMin || 0), 0);
  const totalItems   = tasksForDate.length + habitsForSel.length;
  const totalDone    = taskDone + habitDone;
  const summaryText  = totalItems ? `${totalDone}/${totalItems} done · ${formatMinutes(doneMin)}/${formatMinutes(totalMin)}` : "No tasks";

  const dateLabelText = () => {
    const d       = new Date(selectedDate + "T00:00:00");
    const dateStr = d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
    return selectedDate === getTodayStr() ? "Today — " + dateStr : dateStr;
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task    = { id: Date.now(), title: newTaskTitle.trim(), timeMin: parseInt(newTaskTime) || 0, done: false };
    const current = state.daily[selectedDate] || [];
    updateState("daily", { ...state.daily, [selectedDate]: [...current, task] });
    setNewTaskTitle(""); setNewTaskTime("");
  };

  const toggleTask = (idx) => {
    const tasks = (state.daily[selectedDate] || []).map((t, i) => i === idx ? { ...t, done: !t.done } : t);
    updateState("daily", { ...state.daily, [selectedDate]: tasks });
  };

  const deleteTask = (idx) => {
    const tasks = (state.daily[selectedDate] || []).filter((_, i) => i !== idx);
    updateState("daily", { ...state.daily, [selectedDate]: tasks });
  };

  const toggleHabit = (habitId) => {
    const dayLog    = { ...(state.habitLog[selectedDate] || {}) };
    dayLog[habitId] = !dayLog[habitId];
    updateState("habitLog", { ...state.habitLog, [selectedDate]: dayLog });
  };

  const addHabit = () => {
    if (!habitForm.title.trim()) return;
    if (habitForm.recurrence === "custom" && !habitForm.customDays.length) {
      showToast("Select at least one day", true); return;
    }
    const endDate = habitForm.duration === "indefinite" ? null
      : habitForm.duration === "custom" ? habitForm.endDate || null
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

  const deleteHabit = (idx) => {
    updateState("habits", state.habits.filter((_, i) => i !== idx));
  };

  const exportTasks = () => {
    downloadJSON({ version: 1, type: "qa-tracker-tasks", exportedAt: new Date().toISOString(), data: { daily: state.daily, habits: state.habits, habitLog: state.habitLog } }, `qa-tasks-${getTodayStr()}.json`);
    showToast("Tasks exported!");
  };
  const importTasks = () => {
    pickJSONFile((data) => {
      if (data.type !== "qa-tracker-tasks") { showToast("Not a tasks export file", true); return; }
      const d = data.data || {};
      if (d.daily)    updateState("daily",    d.daily);
      if (d.habits)   updateState("habits",   d.habits);
      if (d.habitLog) updateState("habitLog", d.habitLog);
      showToast("Tasks imported!");
    });
  };

  const inputCls  = "flex-1 min-w-[130px] border border-[#e9eaed] rounded-[7px] px-[10px] py-[6px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors";
  const timeCls   = "w-16 border border-[#e9eaed] rounded-[7px] px-2 py-[6px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors";

  return (
    <div style={{ colorScheme: "light", "--background": "0 0% 100%", "--foreground": "222.2 47.4% 11.2%", "--card": "0 0% 100%", "--card-foreground": "222.2 47.4% 11.2%", "--muted": "210 40% 96.1%", "--muted-foreground": "215.4 16.3% 46.9%", "--border": "214.3 31.8% 91.4%", "--primary": "222.2 47.4% 11.2%", "--primary-foreground": "210 40% 98%", "--secondary": "210 40% 96.1%", "--secondary-foreground": "222.2 47.4% 11.2%" }}>
      {/* Header */}
      <div className="mb-[22px]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-[1.75rem] font-bold tracking-[-0.7px] text-[#111827] m-0">Daily Progress Tracker</h1>
            <p className="text-gray-500 text-[0.9rem] mt-1 mb-0">Daily tasks &amp; recurring habits with time tracking</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={exportTasks}>⬇ Export Tasks</Button>
            <Button size="sm" variant="outline" onClick={importTasks}>⬆ Import Tasks</Button>
          </div>
        </div>
      </div>

      {/* View tabs */}
      <Tabs value={view} onValueChange={setView} className="mb-4">
        <TabsList>
          <TabsTrigger value="tasks">📋 Daily Tasks</TabsTrigger>
          <TabsTrigger value="habits">🔄 Recurring Habits</TabsTrigger>
        </TabsList>

        {/* ── TASKS TAB ── */}
        <TabsContent value="tasks" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-[18px] items-start">
            {/* Left: date strip + task list */}
            <div>
              {/* Date nav bar */}
              <div className="flex items-center gap-[10px] bg-white border border-[#e9eaed] rounded-xl px-3 py-[9px] mb-3">
                <div className="flex items-center gap-[5px] flex-1 min-w-0 overflow-hidden">
                  <button
                    className="bg-gray-100 border-none rounded-[6px] w-7 h-7 cursor-pointer text-[0.7rem] text-[#374151] flex items-center justify-center hover:bg-gray-200 transition-all flex-shrink-0"
                    title="Previous week"
                    onClick={() => { const d = new Date(selectedDate + "T00:00:00"); d.setDate(d.getDate() - 7); setSelectedDate(d.toISOString().slice(0, 10)); }}
                  >◀</button>
                  <div className="flex gap-[3px] flex-1 min-w-0 overflow-hidden [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {stripDates.map((date) => {
                      const d   = new Date(date + "T00:00:00");
                      const dot = dotClass(date);
                      const isActive  = date === selectedDate;
                      const isToday   = date === getTodayStr();
                      return (
                        <div
                          key={date}
                          className={cn(
                            "flex flex-col items-center py-[5px] rounded-lg cursor-pointer transition-all flex-1 min-w-0 border-2 border-transparent hover:bg-gray-100",
                            isActive && "bg-[#eff2ff] border-blue-600"
                          )}
                          onClick={() => setSelectedDate(date)}
                        >
                          <span className="text-[0.6rem] font-semibold text-gray-400 uppercase">
                            {d.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className={cn("text-[0.9rem] font-semibold text-[#1f2937] font-mono", isToday && "text-blue-600 font-bold")}>
                            {d.getDate()}
                          </span>
                          <span className={cn(
                            "w-1 h-1 rounded-full mt-[2px]",
                            dot === "has-tasks" && "bg-amber-400",
                            dot === "all-done"  && "bg-green-500",
                            !dot && "bg-transparent"
                          )} />
                        </div>
                      );
                    })}
                  </div>
                  <button
                    className="bg-gray-100 border-none rounded-[6px] w-7 h-7 cursor-pointer text-[0.7rem] text-[#374151] flex items-center justify-center hover:bg-gray-200 transition-all flex-shrink-0"
                    title="Next week"
                    onClick={() => { const d = new Date(selectedDate + "T00:00:00"); d.setDate(d.getDate() + 7); setSelectedDate(d.toISOString().slice(0, 10)); }}
                  >▶</button>
                </div>
                <div className="flex items-center gap-[7px] flex-shrink-0">
                  <button
                    className="bg-blue-600 text-white border-none rounded-[6px] px-[11px] py-[5px] font-[inherit] text-[0.76rem] font-semibold cursor-pointer flex-shrink-0 hover:bg-blue-700 transition-all"
                    onClick={() => setSelectedDate(getTodayStr())}
                  >Today</button>
                  <input
                    type="date"
                    className="border border-[#e9eaed] rounded-[6px] px-[7px] py-1 font-[inherit] text-[0.76rem] text-[#374151] cursor-pointer flex-shrink-0 outline-none"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Task panel */}
              <div className="bg-white border border-[#e9eaed] rounded-xl overflow-hidden">
                <div className="flex justify-between items-center px-4 py-[13px] border-b border-gray-100 flex-wrap gap-[7px]">
                  <span className="text-[0.83rem] font-semibold text-[#374151]">{dateLabelText()}</span>
                  <span className="text-[0.72rem] font-medium text-gray-500 bg-gray-100 px-[9px] py-[2px] rounded-full whitespace-nowrap">
                    {summaryText}
                  </span>
                </div>
                <div className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {/* Habits section */}
                  {habitsForSel.length > 0 && (
                    <>
                      <div className="text-[0.7rem] font-bold uppercase tracking-[0.7px] text-purple-700 px-[14px] pt-[7px] pb-1 bg-[#f5f3ff] border-b border-purple-100 flex items-center gap-[5px]">
                        🔄 Recurring Habits
                        <span className="ml-auto text-[0.67rem] font-bold font-mono">{habitDone}/{habitsForSel.length}</span>
                      </div>
                      {habitsForSel.map((h) => {
                        const done = !!state.habitLog[selectedDate]?.[h.id];
                        return (
                          <div key={h.id} className={cn(
                            "flex items-center gap-[9px] px-[14px] py-[10px] border-b border-gray-100 last:border-b-0 transition-all",
                            done ? "bg-green-50" : "bg-[#faf5ff] hover:bg-[#f3eeff]"
                          )}>
                            <div
                              className={cn("w-[18px] h-[18px] border-2 rounded-[4px] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer", done ? "bg-purple-700 border-purple-700" : "border-purple-300")}
                              onClick={() => toggleHabit(h.id)}
                            >
                              {done && CHECK_SVG}
                            </div>
                            <span className={cn("flex-1 text-[0.84rem] font-medium text-[#1f2937]", done && "line-through text-gray-400")}>{h.title}</span>
                            {h.timeMin > 0 && <span className="text-[0.69rem] font-semibold bg-amber-50 text-amber-600 px-[7px] py-[2px] rounded-full whitespace-nowrap font-mono">{formatMinutes(h.timeMin)}</span>}
                            <span className="text-[0.65rem] font-semibold bg-[#ede9fe] text-purple-700 px-[6px] py-[2px] rounded-full whitespace-nowrap flex-shrink-0">{formatHabitRecurrence(h)}</span>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {/* Daily tasks section */}
                  {(tasksForDate.length > 0 || habitsForSel.length > 0) && (
                    <div className="text-[0.7rem] font-bold uppercase tracking-[0.7px] text-gray-400 px-[14px] pt-[7px] pb-1 bg-[#f8f9fc] border-b border-[#f0f1f4] flex items-center gap-[5px]">
                      📋 Daily Tasks
                      <span className="ml-auto text-[0.67rem] font-bold font-mono">{taskDone}/{tasksForDate.length}</span>
                    </div>
                  )}
                  {tasksForDate.length === 0 && (
                    <div className="py-[12px] px-4 text-center text-gray-400 text-[0.83rem]">
                      {habitsForSel.length ? "No one-off tasks. Add one below." : "No tasks or habits for this day."}
                    </div>
                  )}
                  {tasksForDate.map((task, i) => (
                    <div key={task.id || i} className={cn(
                      "flex items-center gap-[9px] px-[14px] py-[10px] border-b border-gray-100 last:border-b-0 hover:bg-[#fafafa] transition-all",
                      task.done && "bg-green-50"
                    )}>
                      <div
                        className={cn("w-[18px] h-[18px] border-2 border-gray-300 rounded-[4px] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer", task.done && "bg-green-500 border-green-500")}
                        onClick={() => toggleTask(i)}
                      >
                        {task.done && CHECK_SVG}
                      </div>
                      <span className={cn("flex-1 text-[0.84rem] font-medium text-[#1f2937]", task.done && "line-through text-gray-400")}>{task.title}</span>
                      {task.timeMin > 0 && <span className="text-[0.69rem] font-semibold bg-amber-50 text-amber-600 px-[7px] py-[2px] rounded-full whitespace-nowrap font-mono">{formatMinutes(task.timeMin)}</span>}
                      <button
                        className="bg-transparent border-none cursor-pointer text-gray-300 text-base leading-none px-[2px] hover:text-red-500 transition-all flex-shrink-0"
                        onClick={() => deleteTask(i)}
                      >×</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-[7px] px-[13px] py-[11px] border-t border-gray-100 flex-wrap">
                  <input className={inputCls} placeholder="Add a one-off task..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
                  <input type="number" className={timeCls} placeholder="Min" min={1} value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} />
                  <button className="bg-blue-600 text-white border-none rounded-[7px] px-[14px] py-[6px] font-[inherit] text-[0.82rem] font-semibold cursor-pointer whitespace-nowrap hover:bg-blue-700 transition-all" onClick={addTask}>+ Add</button>
                </div>
              </div>
            </div>

            {/* Right: analytics */}
            <DailyAnalytics state={state} selectedDate={selectedDate} filterMode={filterMode} setFilterMode={setFilterMode} />
          </div>
        </TabsContent>

        {/* ── HABITS TAB ── */}
        <TabsContent value="habits" className="mt-4">
          <HabitsView
            state={state}
            habitForm={habitForm}
            setHabitForm={setHabitForm}
            onAddHabit={addHabit}
            onDeleteHabit={deleteHabit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Analytics panel ──────────────────────────────────────────────────────────
function DailyAnalytics({ state, selectedDate, filterMode, setFilterMode }) {
  const progressRef = useRef(null);
  const timePieRef  = useRef(null);
  const barRef      = useRef(null);
  const charts      = useRef({});

  const days = filterMode === "weekly" ? 7 : 30;

  useEffect(() => {
    renderCharts();
    return () => { Object.values(charts.current).forEach((c) => { try { c.destroy(); } catch (_) {} }); charts.current = {}; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, filterMode, selectedDate]);

  function renderCharts() {
    Object.values(charts.current).forEach((c) => { try { c.destroy(); } catch (_) {} });
    charts.current = {};

    const labels = [], completed = [], totals = [];
    for (let i = days - 1; i >= 0; i--) {
      const d   = new Date(); d.setDate(d.getDate() - i);
      const str = d.toISOString().slice(0, 10);
      labels.push(filterMode === "weekly" ? d.toLocaleDateString("en-US", { weekday: "short" }) : d.getDate().toString());
      const tasks  = state.daily[str] || [];
      const habits = state.habits.filter((h) => habitAppliesOnDate(h, str));
      completed.push(tasks.filter((t) => t.done).length + habits.filter((h) => state.habitLog[str]?.[h.id]).length);
      totals.push(tasks.length + habits.length);
    }

    const totalItems = totals.reduce((a, b) => a + b, 0);
    const doneItems  = completed.reduce((a, b) => a + b, 0);
    const ratePct    = totals.map((t, i) => (t ? Math.round((completed[i] / t) * 100) : null));

    if (progressRef.current) {
      charts.current.progress = new Chart(progressRef.current, {
        type: "line",
        data: { labels, datasets: [{ label: "Completion %", data: ratePct, borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.08)", borderWidth: 2.5, pointBackgroundColor: "#f59e0b", pointRadius: 4, fill: true, tension: 0.35, spanGaps: true }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { callback: (v) => v + "%", font: { family: "Inter" } }, grid: { color: "#f3f4f6" } }, x: { ticks: { font: { family: "Inter", size: 11 } }, grid: { display: false } } } },
      });
    }

    const sTasks  = state.daily[selectedDate] || [];
    const sHabits = state.habits.filter((h) => habitAppliesOnDate(h, selectedDate));
    const doneT   = sTasks.filter((t) => t.done).reduce((s, t) => s + (t.timeMin || 0), 0) + sHabits.filter((h) => state.habitLog[selectedDate]?.[h.id]).reduce((s, h) => s + (h.timeMin || 0), 0);
    const remT    = sTasks.filter((t) => !t.done).reduce((s, t) => s + (t.timeMin || 0), 0) + sHabits.filter((h) => !state.habitLog[selectedDate]?.[h.id]).reduce((s, h) => s + (h.timeMin || 0), 0);
    if (timePieRef.current) {
      charts.current.timePie = new Chart(timePieRef.current, {
        type: "doughnut",
        data: { labels: ["Done", "Remaining"], datasets: [{ data: [doneT || 0, remT || (doneT ? 0 : 1)], backgroundColor: ["#10b981", "#e5e7eb"], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: "bottom", labels: { font: { family: "Inter", size: 12 } } } } },
      });
    }

    if (barRef.current) {
      charts.current.bar = new Chart(barRef.current, {
        type: "bar",
        data: { labels, datasets: [{ label: "Done", data: completed, backgroundColor: "#10b981", borderRadius: 4 }, { label: "Remaining", data: totals.map((t, i) => t - completed[i]), backgroundColor: "#e5e7eb", borderRadius: 4 }] },
        options: { responsive: true, plugins: { legend: { position: "bottom", labels: { font: { family: "Inter", size: 12 } } } }, scales: { x: { stacked: true, ticks: { font: { family: "Inter", size: 11 } }, grid: { display: false } }, y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1, font: { family: "Inter" } }, grid: { color: "#f3f4f6" } } } },
      });
    }
  }

  let cardDone = 0, cardTotal = 0, cardTime = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d   = new Date(); d.setDate(d.getDate() - i);
    const str = d.toISOString().slice(0, 10);
    const tasks  = state.daily[str] || [];
    const habits = state.habits.filter((h) => habitAppliesOnDate(h, str));
    cardTotal += tasks.length + habits.length;
    cardDone  += tasks.filter((t) => t.done).length + habits.filter((h) => state.habitLog[str]?.[h.id]).length;
    cardTime  += tasks.filter((t) => t.done).reduce((s, t) => s + (t.timeMin || 0), 0) + habits.filter((h) => state.habitLog[str]?.[h.id]).reduce((s, h) => s + (h.timeMin || 0), 0);
  }
  const cardPct = cardTotal ? Math.round((cardDone / cardTotal) * 100) : 0;

  const chartCard = "bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px]";
  const chartTitle = "text-sm font-semibold text-[#374151] mb-[14px] mt-0";

  return (
    <div className="bg-white border border-[#e9eaed] rounded-xl p-4">
      <div className="flex justify-between items-center mb-3 flex-wrap gap-[7px]">
        <h3 className={chartTitle}>Analytics</h3>
        <div className="flex gap-[2px] bg-gray-100 p-[3px] rounded-lg">
          <button className={cn("border-none bg-transparent rounded-[6px] px-3 py-1 font-[inherit] text-[0.78rem] font-medium text-gray-500 cursor-pointer transition-all", filterMode === "weekly" && "bg-white text-[#1f2937] shadow-sm")} onClick={() => setFilterMode("weekly")}>Weekly</button>
          <button className={cn("border-none bg-transparent rounded-[6px] px-3 py-1 font-[inherit] text-[0.78rem] font-medium text-gray-500 cursor-pointer transition-all", filterMode === "monthly" && "bg-white text-[#1f2937] shadow-sm")} onClick={() => setFilterMode("monthly")}>Monthly</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[7px] mb-3">
        {[
          { val: cardDone,                    lbl: "Items Done"  },
          { val: cardTotal,                   lbl: "Total Items" },
          { val: cardPct + "%",               lbl: "Completion"  },
          { val: formatMinutes(cardTime),     lbl: "Time Done"   },
        ].map(({ val, lbl }) => (
          <div key={lbl} className="bg-[#f8f9fc] border border-[#e9eaed] rounded-[10px] px-[6px] py-[10px] text-center">
            <div className="text-[1.15rem] font-bold text-[#111827] font-mono">{val}</div>
            <div className="text-[0.64rem] font-semibold text-gray-400 uppercase tracking-[0.4px] mt-[2px]">{lbl}</div>
          </div>
        ))}
      </div>
      <div className={cn(chartCard, "mb-[10px]")}>
        <h3 className={chartTitle}>
          Completion Rate <span className="text-[0.73rem] font-normal text-gray-400 ml-[5px]">({filterMode === "weekly" ? "last 7 days" : "last 30 days"})</span>
        </h3>
        <canvas ref={progressRef} height={140} />
      </div>
      <div className="grid grid-cols-2 gap-[10px] mt-[10px]">
        <div className={chartCard}>
          <h3 className={chartTitle}>Time Allocation</h3>
          <div className="max-w-[260px] mx-auto"><canvas ref={timePieRef} /></div>
        </div>
        <div className={chartCard}>
          <h3 className={chartTitle}>Tasks per Day</h3>
          <canvas ref={barRef} height={180} />
        </div>
      </div>
    </div>
  );
}

// ── Habits view ──────────────────────────────────────────────────────────────
function HabitsView({ state, habitForm, setHabitForm, onAddHabit, onDeleteHabit }) {
  const barRef  = useRef(null);
  const weekRef = useRef(null);
  const charts  = useRef({});

  useEffect(() => {
    renderHabitCharts();
    return () => { Object.values(charts.current).forEach((c) => { try { c.destroy(); } catch (_) {} }); charts.current = {}; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.habits, state.habitLog]);

  function renderHabitCharts() {
    Object.values(charts.current).forEach((c) => { try { c.destroy(); } catch (_) {} });
    charts.current = {};
    const today   = getTodayStr();
    const palette = ["#2563eb","#7c3aed","#059669","#dc2626","#f59e0b","#0891b2","#db2777"];

    if (barRef.current && state.habits.length) {
      const labels = state.habits.map((h) => h.title.length > 14 ? h.title.slice(0, 14) + "…" : h.title);
      const rates  = state.habits.map((h) => { const s = countHabitScheduled(h, today), d = countHabitDone(h, state.habitLog); return s ? Math.round((d / s) * 100) : 0; });
      const colors = state.habits.map((_, i) => palette[i % palette.length]);
      charts.current.bar = new Chart(barRef.current, { type: "bar", data: { labels, datasets: [{ label: "Completion %", data: rates, backgroundColor: colors, borderRadius: 5 }] }, options: { indexAxis: "y", responsive: true, plugins: { legend: { display: false } }, scales: { x: { min: 0, max: 100, ticks: { callback: (v) => v + "%", font: { family: "Inter" } }, grid: { color: "#f3f4f6" } }, y: { ticks: { font: { family: "Inter", size: 11 } }, grid: { display: false } } } } });
    }

    if (weekRef.current) {
      const wlabels = [], wDone = [], wSched = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const str = d.toISOString().slice(0, 10);
        wlabels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
        const habitsDay = state.habits.filter((h) => habitAppliesOnDate(h, str));
        wSched.push(habitsDay.length);
        wDone.push(habitsDay.filter((h) => state.habitLog[str]?.[h.id]).length);
      }
      charts.current.week = new Chart(weekRef.current, { type: "bar", data: { labels: wlabels, datasets: [{ label: "Done", data: wDone, backgroundColor: "#10b981", borderRadius: 4 }, { label: "Scheduled", data: wSched.map((s, i) => s - wDone[i]), backgroundColor: "#e5e7eb", borderRadius: 4 }] }, options: { responsive: true, plugins: { legend: { position: "bottom", labels: { font: { family: "Inter", size: 12 } } } }, scales: { x: { stacked: true, ticks: { font: { family: "Inter", size: 11 } }, grid: { display: false } }, y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1, font: { family: "Inter" } }, grid: { color: "#f3f4f6" } } } } });
    }
  }

  const today       = getTodayStr();
  const computedEnd = habitForm.duration === "indefinite" ? null
    : habitForm.duration === "custom" ? habitForm.endDate
    : computeHabitEndDate(habitForm.startDate, habitForm.duration);

  const hfInput = "w-full border border-[#e9eaed] rounded-lg px-[10px] py-[7px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";
  const hfLabel = "block text-[0.72rem] font-semibold text-gray-500 uppercase tracking-[0.5px]";
  const pill    = (active) => cn("border border-[#e9eaed] bg-white rounded-full px-3 py-1 font-[inherit] text-[0.77rem] font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-all", active && "bg-blue-600 text-white border-blue-600");
  const chartCard = "bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px]";
  const chartTitle = "text-sm font-semibold text-[#374151] mb-[14px] mt-0";

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[18px] mb-[18px] items-start">
        {/* New habit form */}
        <div className="bg-white border border-[#e9eaed] rounded-[14px] p-5">
          <h3 className={cn(chartTitle, "mb-[14px]")}>➕ New Recurring Habit</h3>
          <div className="flex gap-[10px]">
            <div className="flex flex-col gap-1 mb-3" style={{ flex: 2 }}>
              <label className={hfLabel}>Habit Name</label>
              <input className={hfInput} placeholder="e.g. Morning Review" value={habitForm.title} onChange={(e) => setHabitForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1 mb-3 flex-1">
              <label className={hfLabel}>Time (min)</label>
              <input type="number" className={hfInput} placeholder="30" min={1} value={habitForm.time} onChange={(e) => setHabitForm((f) => ({ ...f, time: e.target.value }))} />
            </div>
          </div>
          <div className="flex flex-col gap-1 mb-3">
            <label className={hfLabel}>Repeat Pattern</label>
            <div className="flex flex-wrap gap-[5px]">
              {["daily","weekdays","weekends","custom"].map((r) => (
                <button key={r} className={pill(habitForm.recurrence === r)} onClick={() => setHabitForm((f) => ({ ...f, recurrence: r }))}>
                  {r === "daily" ? "Daily" : r === "weekdays" ? "Weekdays" : r === "weekends" ? "Weekends" : "Custom Days"}
                </button>
              ))}
            </div>
          </div>
          {habitForm.recurrence === "custom" && (
            <div className="flex flex-col gap-1 mb-3">
              <label className={hfLabel}>Select Days</label>
              <div className="flex gap-1 flex-wrap">
                {DAYS.map((d, i) => (
                  <button
                    key={i}
                    className={cn("w-[38px] h-[34px] border border-[#e9eaed] bg-white rounded-lg font-[inherit] text-[0.73rem] font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 transition-all", habitForm.customDays.includes(i) && "bg-purple-700 text-white border-purple-700")}
                    onClick={() => setHabitForm((f) => ({ ...f, customDays: f.customDays.includes(i) ? f.customDays.filter((x) => x !== i) : [...f.customDays, i] }))}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1 mb-3">
            <label className={hfLabel}>Duration</label>
            <div className="flex flex-wrap gap-[5px]">
              {[["1week","1 Week"],["2weeks","2 Weeks"],["3weeks","3 Weeks"],["1month","1 Month"],["2months","2 Months"],["indefinite","Indefinite"],["custom","Custom"]].map(([v, l]) => (
                <button key={v} className={pill(habitForm.duration === v)} onClick={() => setHabitForm((f) => ({ ...f, duration: v }))}>{l}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-[10px]">
            <div className="flex flex-col gap-1 mb-3 flex-1">
              <label className={hfLabel}>Start Date</label>
              <input type="date" className={hfInput} value={habitForm.startDate} onChange={(e) => setHabitForm((f) => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1 mb-3 flex-1">
              <label className={hfLabel}>
                End Date {computedEnd && <span className="text-[0.7rem] text-green-600 font-semibold ml-1">(→ {computedEnd})</span>}
              </label>
              <input type="date" className={hfInput} value={computedEnd || habitForm.endDate || ""} disabled={habitForm.duration !== "indefinite" && habitForm.duration !== "custom"} onChange={(e) => setHabitForm((f) => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white border-none rounded-[9px] py-[9px] font-[inherit] text-[0.86rem] font-semibold cursor-pointer hover:bg-blue-700 transition-all mt-1" onClick={onAddHabit}>
            Create Habit
          </button>
        </div>

        {/* Habits list */}
        <div className="bg-white border border-[#e9eaed] rounded-[14px] p-5">
          <h3 className={cn(chartTitle, "mb-3")}>Your Habits</h3>
          {state.habits.length === 0
            ? <div className="py-[18px] text-center text-gray-400 text-[0.83rem]">No habits yet. Create one using the form!</div>
            : state.habits.map((h, i) => {
              const sched = countHabitScheduled(h, today);
              const done  = countHabitDone(h, state.habitLog);
              const rate  = sched ? Math.round((done / sched) * 100) : 0;
              return (
                <div key={h.id} className="flex items-start gap-[10px] py-[11px] border-b border-gray-100 last:border-b-0">
                  <div className="text-base flex-shrink-0 mt-[2px]">🔄</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.86rem] font-semibold text-[#1f2937] mb-[2px]">{h.title}</div>
                    <div className="text-[0.73rem] text-gray-400 mb-[5px]">
                      {formatHabitRecurrence(h)} {h.timeMin ? "· " + formatMinutes(h.timeMin) : ""} · {h.startDate} {h.endDate ? "→ " + h.endDate : "∞"} · <span className="text-green-600 font-semibold">{done}/{sched} ({rate}%)</span>
                    </div>
                    <div className="h-[3px] bg-[#f0f1f4] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-700 rounded-full transition-[width] duration-500" style={{ width: rate + "%" }} />
                    </div>
                  </div>
                  <button className="bg-transparent border-none cursor-pointer text-gray-300 text-base leading-none px-[2px] hover:text-red-500 transition-all flex-shrink-0" onClick={() => onDeleteHabit(i)}>×</button>
                </div>
              );
            })
          }
        </div>
      </div>

      {/* Habit charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[14px]">
        <div className={chartCard}><h3 className={chartTitle}>Habit Completion Rates</h3><canvas ref={barRef} height={160} /></div>
        <div className={chartCard}><h3 className={chartTitle}>Habits This Week</h3><canvas ref={weekRef} height={160} /></div>
      </div>
    </div>
  );
}
