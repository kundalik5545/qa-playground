import DEFAULT_SYLLABUS_DATA from "@/data/studyTrackerSyllabi";

// ─── STORAGE KEYS ────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  progress:  "qa_tracker_progress",
  custom:    "qa_tracker_custom",
  log:       "qa_tracker_log",
  subtopics: "qa_tracker_subtopics",
  daily:     "qa_tracker_daily",
  habits:    "qa_tracker_habits",
  habitLog:  "qa_tracker_habit_log",
  syllabi:   "qa_tracker_syllabi",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function formatMinutes(min) {
  if (!min || min <= 0) return "0m";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatDate(str) {
  if (!str) return "";
  return new Date(str + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatHabitRecurrence(h) {
  const map = { daily: "Daily", weekdays: "Weekdays", weekends: "Weekends", custom: "Custom" };
  return map[h.recurrence] || h.recurrence;
}

export function habitAppliesOnDate(h, dateStr) {
  if (!h.active) return false;
  if (dateStr < h.startDate) return false;
  if (h.endDate && dateStr > h.endDate) return false;
  const day = new Date(dateStr + "T00:00:00").getDay();
  switch (h.recurrence) {
    case "daily":    return true;
    case "weekdays": return day >= 1 && day <= 5;
    case "weekends": return day === 0 || day === 6;
    case "custom":   return (h.customDays || []).includes(day);
    default:         return false;
  }
}

export function computeHabitEndDate(startDate, duration) {
  const d = new Date(startDate + "T00:00:00");
  switch (duration) {
    case "1week":    d.setDate(d.getDate() + 7);   break;
    case "2weeks":   d.setDate(d.getDate() + 14);  break;
    case "3weeks":   d.setDate(d.getDate() + 21);  break;
    case "1month":   d.setMonth(d.getMonth() + 1); break;
    case "2months":  d.setMonth(d.getMonth() + 2); break;
    case "indefinite": return null;
    case "custom":   return null;
    default:         return null;
  }
  return d.toISOString().slice(0, 10);
}

// ─── LOAD / SAVE ──────────────────────────────────────────────────────────────
export function loadAllState() {
  if (typeof window === "undefined") return getEmptyState();
  try {
    const savedSyllabi = localStorage.getItem(STORAGE_KEYS.syllabi);
    const syllabi = savedSyllabi
      ? JSON.parse(savedSyllabi)
      : JSON.parse(JSON.stringify(DEFAULT_SYLLABUS_DATA));
    if (!savedSyllabi) {
      localStorage.setItem(STORAGE_KEYS.syllabi, JSON.stringify(syllabi));
    }
    return {
      syllabi,
      progress:  JSON.parse(localStorage.getItem(STORAGE_KEYS.progress)  || "{}"),
      custom:    JSON.parse(localStorage.getItem(STORAGE_KEYS.custom)     || "{}"),
      log:       JSON.parse(localStorage.getItem(STORAGE_KEYS.log)        || "[]"),
      subtopics: JSON.parse(localStorage.getItem(STORAGE_KEYS.subtopics)  || "{}"),
      daily:     JSON.parse(localStorage.getItem(STORAGE_KEYS.daily)      || "{}"),
      habits:    JSON.parse(localStorage.getItem(STORAGE_KEYS.habits)     || "[]"),
      habitLog:  JSON.parse(localStorage.getItem(STORAGE_KEYS.habitLog)   || "{}"),
    };
  } catch (e) {
    console.warn("State load error", e);
    return getEmptyState();
  }
}

function getEmptyState() {
  return {
    syllabi:   JSON.parse(JSON.stringify(DEFAULT_SYLLABUS_DATA)),
    progress:  {},
    custom:    {},
    log:       [],
    subtopics: {},
    daily:     {},
    habits:    [],
    habitLog:  {},
  };
}

export function saveKey(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
}

// ─── STATS ────────────────────────────────────────────────────────────────────
export function getSyllabusStats(syllabi, progress, syllabusId) {
  const syl = syllabi[syllabusId];
  if (!syl) return { total: 0, done: 0, pct: 0 };
  let total = 0, done = 0;
  for (const sec of syl.sections)
    for (const topic of sec.topics) {
      total++;
      if (progress[topic.id]?.done) done++;
    }
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function getAllStats(syllabi, progress) {
  let total = 0, done = 0;
  for (const id of Object.keys(syllabi)) {
    const s = getSyllabusStats(syllabi, progress, id);
    total += s.total;
    done  += s.done;
  }
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function getLast14Days() {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function countHabitScheduled(habit, todayStr) {
  let count = 0;
  const start = new Date(habit.startDate + "T00:00:00");
  const end   = new Date((habit.endDate || todayStr) + "T00:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (habitAppliesOnDate(habit, d.toISOString().slice(0, 10))) count++;
  }
  return count;
}

export function countHabitDone(habit, habitLog) {
  return Object.entries(habitLog).reduce((sum, [date, log]) => {
    return sum + (habitAppliesOnDate(habit, date) && log[habit.id] ? 1 : 0);
  }, 0);
}

// ─── EXPORT / IMPORT ─────────────────────────────────────────────────────────
export function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function pickJSONFile(callback) {
  const input = document.createElement("input");
  input.type = "file"; input.accept = ".json,application/json";
  input.onchange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try { callback(JSON.parse(ev.target.result)); }
      catch (err) { alert("Parse error: " + err.message); }
    };
    r.readAsText(file);
  };
  input.click();
}
