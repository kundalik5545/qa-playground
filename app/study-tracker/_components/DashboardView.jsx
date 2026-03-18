"use client";

import { useEffect, useRef } from "react";
import {
  getSyllabusStats,
  getLast14Days,
  habitAppliesOnDate,
  getTodayStr,
} from "@/lib/studyTrackerStorage";

export default function DashboardView({
  state,
  allStats,
  onExport,
  onImport,
  onNavigate,
}) {
  const pieRef = useRef(null);       // Today's Tasks doughnut
  const overallRef = useRef(null);   // Overall Progress doughnut
  const lineRef = useRef(null);      // Topics Completed line
  const barRef = useRef(null);       // Progress by Syllabus bar
  const doughnutRef = useRef(null);  // Completion Breakdown doughnut
  const taskChartRef = useRef(null); // Daily Task Completion % line
  const charts = useRef({});

  // Today's quick stats
  const today = getTodayStr();
  const todayTasks = state.daily[today] || [];
  const todayTaskDone = todayTasks.filter((t) => t.done).length;
  const todayHabits = state.habits.filter((h) => habitAppliesOnDate(h, today));
  const todayHabitDone = todayHabits.filter(
    (h) => state.habitLog[today]?.[h.id],
  ).length;

  useEffect(() => {
    if (window.Chart) {
      renderCharts();
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
    script.onload = renderCharts;
    document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function destroyAll() {
    Object.values(charts.current).forEach((c) => {
      try {
        c.destroy();
      } catch (_) {}
    });
    charts.current = {};
  }

  function renderCharts() {
    destroyAll();
    const C = window.Chart;
    if (!C) return;

    const syllabusIds = Object.keys(state.syllabi);
    const syllabusLabels = syllabusIds.map((id) => state.syllabi[id].label);
    const syllabusColors = syllabusIds.map((id) => state.syllabi[id].color);
    const sylStats = syllabusIds.map((id) =>
      getSyllabusStats(state.syllabi, state.progress, id),
    );
    const days = getLast14Days();

    // ── Today's Tasks doughnut ──
    if (pieRef.current) {
      const done = todayTaskDone;
      const total = todayTasks.length;
      const remaining = Math.max(total - done, 0);
      charts.current.pie = new C(pieRef.current, {
        type: "doughnut",
        data: {
          labels: ["Done", "Remaining"],
          datasets: [
            {
              data: [done, remaining || (done ? 0 : 1)],
              backgroundColor: ["#10b981", "#e5e7eb"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: "74%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "'DM Sans', sans-serif", size: 12 },
                boxWidth: 12,
                padding: 14,
              },
            },
            title: {
              display: true,
              text: total ? `${done}/${total} today` : "No tasks today",
              font: {
                family: "'DM Sans', sans-serif",
                size: 13,
                weight: "600",
              },
              color: "#374151",
              padding: { top: 10 },
            },
          },
        },
      });
    }

    // ── Overall Progress doughnut (syllabus topics) ──
    if (overallRef.current) {
      const total = allStats.total, done = allStats.done;
      charts.current.overall = new C(overallRef.current, {
        type: "doughnut",
        data: {
          labels: ["Completed", "Remaining"],
          datasets: [
            {
              data: [done, Math.max(total - done, 0) || (done ? 0 : 1)],
              backgroundColor: ["#2563eb", "#e5e7eb"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: "74%",
          plugins: {
            legend: {
              position: "bottom",
              labels: { font: { family: "'DM Sans', sans-serif", size: 12 }, boxWidth: 12, padding: 14 },
            },
            title: {
              display: true,
              text: `${done} / ${total} topics`,
              font: { family: "'DM Sans', sans-serif", size: 13, weight: "600" },
              color: "#374151",
              padding: { top: 10 },
            },
          },
        },
      });
    }

    // ── Topics completed (line) — last 14 days ──
    if (lineRef.current) {
      const datasets = syllabusIds.map((id) => {
        const syl = state.syllabi[id];
        const data = days.map((day) => {
          let count = 0;
          for (const sec of syl.sections)
            for (const topic of sec.topics)
              if (
                state.progress[topic.id]?.done &&
                state.progress[topic.id]?.date === day
              )
                count++;
          return count;
        });
        return {
          label: syl.label,
          data,
          borderColor: syl.color,
          backgroundColor: syl.color + "18",
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.35,
          spanGaps: true,
        };
      });
      charts.current.line = new C(lineRef.current, {
        type: "line",
        data: { labels: days.map((d) => d.slice(5)), datasets },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "'DM Sans', sans-serif", size: 11 },
                boxWidth: 12,
                padding: 14,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1, font: { family: "'DM Sans'" } },
              grid: { color: "#f3f4f6" },
            },
            x: {
              ticks: { font: { family: "'DM Sans'", size: 10 } },
              grid: { display: false },
            },
          },
        },
      });
    }

    // ── Progress by syllabus (bar) ──
    if (barRef.current) {
      charts.current.bar = new C(barRef.current, {
        type: "bar",
        data: {
          labels: syllabusLabels,
          datasets: [
            {
              label: "Completed",
              data: sylStats.map((s) => s.done),
              backgroundColor: syllabusColors,
              borderColor: syllabusColors,
              borderWidth: 0,
              borderRadius: 0,
              borderSkipped: "bottom",
              barPercentage: 0.55,
              categoryPercentage: 0.65,
            },
            {
              label: "Remaining",
              data: sylStats.map((s) => Math.max(s.total - s.done, 0)),
              backgroundColor: syllabusColors.map((c) => c + "33"),
              borderColor: syllabusColors.map((c) => c + "55"),
              borderWidth: 0,
              borderRadius: { topLeft: 6, topRight: 6 },
              borderSkipped: "bottom",
              barPercentage: 0.55,
              categoryPercentage: 0.65,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "'DM Sans', sans-serif", size: 11 },
                boxWidth: 10,
                padding: 12,
                usePointStyle: true,
                pointStyle: "rectRounded",
              },
            },
            tooltip: {
              callbacks: {
                label: (item) => {
                  const idx = item.dataIndex;
                  const s = sylStats[idx];
                  if (item.datasetIndex === 0)
                    return ` Completed: ${s.done} (${s.pct}%)`;
                  return ` Remaining: ${Math.max(s.total - s.done, 0)}`;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                font: { family: "'DM Sans'", size: 12 },
                maxRotation: 40,
                minRotation: 30,
                autoSkip: false,
              },
              grid: { display: false },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { stepSize: 5, font: { family: "'DM Sans'", size: 10 } },
              grid: { color: "#f3f4f6" },
            },
          },
        },
      });
    }

    // ── Completion breakdown doughnut (per syllabus) ──
    if (doughnutRef.current) {
      charts.current.doughnut = new C(doughnutRef.current, {
        type: "doughnut",
        data: {
          labels: syllabusLabels,
          datasets: [
            {
              data: sylStats.map((s) => s.done || 0),
              backgroundColor: syllabusColors,
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "'DM Sans', sans-serif", size: 12 },
                boxWidth: 12,
                padding: 14,
              },
            },
          },
        },
      });
    }

    // ── Daily tasks chart — last 14 days (completion % line) ──
    if (taskChartRef.current) {
      const taskData = days.map((day) => {
        const tasks = state.daily[day] || [];
        const done = tasks.filter((t) => t.done).length;
        const total = tasks.length;
        return {
          pct: total > 0 ? Math.round((done / total) * 100) : null,
          done,
          total,
        };
      });
      charts.current.taskChart = new C(taskChartRef.current, {
        type: "line",
        data: {
          labels: days.map((d) => d.slice(5)),
          datasets: [
            {
              label: "Completion %",
              data: taskData.map((d) => d.pct),
              borderColor: "#f59e0b",
              backgroundColor: "#f59e0b22",
              borderWidth: 2.5,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#f59e0b",
              fill: true,
              tension: 0.35,
              spanGaps: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "'DM Sans', sans-serif", size: 12 },
                boxWidth: 12,
                padding: 14,
              },
            },
            tooltip: {
              callbacks: {
                label: (item) => {
                  const d = taskData[item.dataIndex];
                  return d.total
                    ? `${d.pct}% (${d.done}/${d.total} tasks)`
                    : "No tasks";
                },
              },
            },
          },
          scales: {
            x: {
              ticks: { font: { family: "'DM Sans'", size: 10 } },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              min: 0,
              max: 100,
              ticks: {
                stepSize: 10,
                font: { family: "'DM Sans'" },
                callback: (v) => v + "%",
              },
              grid: { color: "#f3f4f6" },
            },
          },
        },
      });
    }
  }

  // Group log entries by date, most recent first, max 7 days
  const recentByDate = [];
  const seen = new Map();
  for (const entry of [...state.log].reverse()) {
    if (!seen.has(entry.date)) {
      seen.set(entry.date, []);
      recentByDate.push({ date: entry.date, entries: seen.get(entry.date) });
    }
    seen.get(entry.date).push(entry);
    if (recentByDate.length >= 7 && seen.has(entry.date)) {
      if (recentByDate[recentByDate.length - 1].date !== entry.date) break;
    }
  }
  const recentLog = recentByDate.slice(0, 7);

  return (
    <div>
      {/* Header */}
      <div className="st-dash-header">
        <div className="st-dash-header-row">
          <div>
            <h1 className="st-dash-title">QA Study Tracker</h1>
            <p className="st-dash-subtitle">
              Your personal learning progress dashboard
            </p>
          </div>
          <div className="st-dash-actions">
            <button className="st-action-btn st-export-btn" onClick={onExport}>
              ⬇ Export
            </button>
            <button className="st-action-btn st-import-btn" onClick={onImport}>
              ⬆ Import
            </button>
          </div>
        </div>
      </div>

      {/* Quick stat cards */}
      <div className="st-quick-stats">
        <QuickStat
          icon="🎯"
          label="Overall Progress"
          value={`${allStats.pct}%`}
          sub={`${allStats.done} / ${allStats.total} topics`}
          color="#2563eb"
          bg="#eff6ff"
        />
        <QuickStat
          icon="📋"
          label="Today's Tasks"
          value={
            todayTasks.length ? `${todayTaskDone} / ${todayTasks.length}` : "—"
          }
          sub={
            todayTasks.length
              ? todayTaskDone === todayTasks.length
                ? "All done!"
                : `${todayTasks.length - todayTaskDone} remaining`
              : "No tasks added"
          }
          color="#10b981"
          bg="#f0fdf4"
        />
        <QuickStat
          icon="🔥"
          label="Today's Habits"
          value={
            todayHabits.length
              ? `${todayHabitDone} / ${todayHabits.length}`
              : "—"
          }
          sub={
            todayHabits.length
              ? todayHabitDone === todayHabits.length
                ? "All done!"
                : `${todayHabits.length - todayHabitDone} remaining`
              : "No habits today"
          }
          color="#f59e0b"
          bg="#fffbeb"
        />
        <QuickStat
          icon="📚"
          label="Active Syllabi"
          value={Object.keys(state.syllabi).length}
          sub="learning paths"
          color="#7c3aed"
          bg="#f5f3ff"
        />
      </div>

      {/* Syllabus overview cards */}
      <div className="st-overview-cards">
        {Object.values(state.syllabi).map((syl) => {
          const s = getSyllabusStats(state.syllabi, state.progress, syl.id);
          return (
            <OverviewCard
              key={syl.id}
              icon={syl.icon}
              label={syl.label}
              pct={s.pct}
              sub={`${s.done} / ${s.total} topics`}
              color={syl.color}
              onClick={() => onNavigate(syl.id)}
            />
          );
        })}
      </div>

      {/* Row 1: Today's Tasks pie + Daily Task Completion % line */}
      <div className="st-charts-row">
        <div className="st-chart-card">
          <h3 className="st-chart-title">Today's Tasks</h3>
          <div className="st-pie-wrap">
            <canvas ref={pieRef} />
          </div>
        </div>
        <div className="st-chart-card">
          <h3 className="st-chart-title">
            Daily Task Completion %{" "}
            <span className="st-chart-subtitle">(last 14 days)</span>
          </h3>
          <canvas ref={taskChartRef} height={110} />
        </div>
      </div>

      {/* Row 2: Overall Progress pie + Topics Completed line */}
      <div className="st-charts-row">
        <div className="st-chart-card">
          <h3 className="st-chart-title">Overall Progress</h3>
          <div className="st-pie-wrap">
            <canvas ref={overallRef} />
          </div>
        </div>
        <div className="st-chart-card">
          <h3 className="st-chart-title">
            Topics Completed{" "}
            <span className="st-chart-subtitle">(last 14 days)</span>
          </h3>
          <canvas ref={lineRef} height={110} />
        </div>
      </div>

      {/* Row 3: Progress by Syllabus + Completion Breakdown */}
      <div className="st-charts-row-equal" style={{ marginBottom: 14 }}>
        <div className="st-chart-card">
          <h3 className="st-chart-title">Progress by Syllabus</h3>
          <canvas ref={barRef} height={100} />
        </div>
        <div className="st-chart-card">
          <h3 className="st-chart-title">Completion Breakdown</h3>
          <div className="st-pie-wrap">
            <canvas ref={doughnutRef} />
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="st-recent-activity">
        <h3 className="st-chart-title">Recent Activity</h3>
        {recentLog.length === 0 ? (
          <div className="st-no-activity">
            No activity yet. Start checking off topics!
          </div>
        ) : (
          recentLog.map((entry, i) => {
            const syl = state.syllabi[entry.tabId];
            return (
              <div key={i} className="st-activity-day">
                <span className="st-act-date">{entry.date}</span>
                {syl && (
                  <span
                    className="st-act-chip"
                    style={{ background: syl.color + "18", color: syl.color }}
                  >
                    {syl.icon} {syl.label} +{entry.count}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value, sub, color, bg }) {
  return (
    <div
      className="st-quick-stat"
      style={{ borderLeft: `3px solid ${color}`, background: bg }}
    >
      <div className="st-qs-icon" style={{ color }}>
        {icon}
      </div>
      <div className="st-qs-value" style={{ color }}>
        {value}
      </div>
      <div className="st-qs-label">{label}</div>
      <div className="st-qs-sub">{sub}</div>
    </div>
  );
}

function OverviewCard({ icon, label, pct, sub, color, onClick }) {
  return (
    <div className="st-ov-card" onClick={onClick}>
      <div className="st-ov-icon">{icon}</div>
      <div className="st-ov-label">{label}</div>
      <div className="st-ov-pct" style={{ color }}>
        {pct}%
      </div>
      <div className="st-ov-sub">{sub}</div>
      <div className="st-ov-bar-wrap">
        <div
          className="st-ov-bar"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
