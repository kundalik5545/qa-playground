// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STORAGE_KEY    = "qa_tracker_progress";
const CUSTOM_KEY     = "qa_tracker_custom";
const LOG_KEY        = "qa_tracker_log";
const SUBTOPIC_KEY   = "qa_tracker_subtopics";
const DAILY_KEY      = "qa_tracker_daily";
const HABITS_KEY     = "qa_tracker_habits";
const HABIT_LOG_KEY  = "qa_tracker_habit_log";
const SYLLABUS_KEY   = "qa_tracker_syllabi";

// ─── DYNAMIC SYLLABUS DATA ────────────────────────────────────────────────────
// Populated from localStorage in loadState(); seeded from DEFAULT_SYLLABUS_DATA
let SYLLABUS_DATA = {};
// Syllabus Manager UI state
let sylMgrExpanded = null; // syllabusId currently expanded for editing

// ─── STATE ────────────────────────────────────────────────────────────────────
let state = {
  progress:  {},  // { topicId: { done: bool, date: string } }
  custom:    {},  // { topicId: { notes: string, resources: [{label,url}] } }
  log:       [],  // [{ date, tabId, count }]
  subtopics: {},  // { topicId: { 0: bool, 1: bool, ... } }
  daily:     {},  // { "YYYY-MM-DD": [{id, title, timeMin, done}] }
  habits:    [],  // [{id, title, timeMin, recurrence, customDays, startDate, endDate, active}]
  habitLog:  {},  // { "YYYY-MM-DD": { "habit-id": true } }
};

let selectedDate     = "";
let dailyFilterMode  = "weekly";
let currentDailyView = "tasks"; // "tasks" | "habits"
// habit form state
let habitForm = { recurrence:"daily", customDays:[], duration:"1month", startDate:"", endDate:"" };

let dailyProgressChart, dailyTimePieChart, dailyBarChart;
let pieChart, lineChart, barChart, doughnutChart, dashDailyPieChart, dashDailyLineChart;

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  selectedDate     = getTodayStr();
  habitForm.startDate = getTodayStr();
  loadState();
  buildNav();
  buildTabs();
  renderDashboard();
  setActiveTab("dashboard");
  attachGlobalListeners();
});

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function loadState() {
  try {
    const savedSyllabi = localStorage.getItem(SYLLABUS_KEY);
    if (savedSyllabi) {
      SYLLABUS_DATA = JSON.parse(savedSyllabi);
    } else {
      SYLLABUS_DATA = JSON.parse(JSON.stringify(DEFAULT_SYLLABUS_DATA));
      localStorage.setItem(SYLLABUS_KEY, JSON.stringify(SYLLABUS_DATA));
    }
    state.progress  = JSON.parse(localStorage.getItem(STORAGE_KEY)   || "{}");
    state.custom    = JSON.parse(localStorage.getItem(CUSTOM_KEY)    || "{}");
    state.log       = JSON.parse(localStorage.getItem(LOG_KEY)       || "[]");
    state.subtopics = JSON.parse(localStorage.getItem(SUBTOPIC_KEY)  || "{}");
    state.daily     = JSON.parse(localStorage.getItem(DAILY_KEY)     || "{}");
    state.habits    = JSON.parse(localStorage.getItem(HABITS_KEY)    || "[]");
    state.habitLog  = JSON.parse(localStorage.getItem(HABIT_LOG_KEY) || "{}");
  } catch(e) { console.warn("State load error", e); }
}
function saveSyllabi() { localStorage.setItem(SYLLABUS_KEY, JSON.stringify(SYLLABUS_DATA)); }

function saveProgress()  { localStorage.setItem(STORAGE_KEY,   JSON.stringify(state.progress));  }
function saveCustom()    { localStorage.setItem(CUSTOM_KEY,    JSON.stringify(state.custom));    }
function saveLog()       { localStorage.setItem(LOG_KEY,       JSON.stringify(state.log));       }
function saveSubtopics() { localStorage.setItem(SUBTOPIC_KEY,  JSON.stringify(state.subtopics)); }
function saveDaily()     { localStorage.setItem(DAILY_KEY,     JSON.stringify(state.daily));     }
function saveHabits()    { localStorage.setItem(HABITS_KEY,    JSON.stringify(state.habits));    }
function saveHabitLog()  { localStorage.setItem(HABIT_LOG_KEY, JSON.stringify(state.habitLog));  }

function logActivity(tabId, delta) {
  if (delta <= 0) return;
  const today = getTodayStr();
  const last  = state.log[state.log.length - 1];
  if (last && last.date === today && last.tabId === tabId) last.count += delta;
  else state.log.push({ date: today, tabId, count: delta });
  saveLog();
}
function getTodayStr() { return new Date().toISOString().slice(0, 10); }

// ─── MAIN EXPORT / IMPORT ─────────────────────────────────────────────────────
function exportData() {
  const payload = {
    version: 1, exportedAt: new Date().toISOString(),
    syllabi: SYLLABUS_DATA,
    progress: state.progress, custom: state.custom, log: state.log,
    subtopics: state.subtopics, daily: state.daily,
    habits: state.habits, habitLog: state.habitLog,
  };
  downloadJSON(payload, `qa-tracker-${getTodayStr()}.json`);
  showToast("Full data exported!");
}

function importData() {
  pickJSONFile(data => {
    if (data.syllabi)   { SYLLABUS_DATA = data.syllabi;     localStorage.setItem(SYLLABUS_KEY,  JSON.stringify(SYLLABUS_DATA));   }
    if (data.progress)  { state.progress  = data.progress;  localStorage.setItem(STORAGE_KEY,   JSON.stringify(state.progress));  }
    if (data.custom)    { state.custom    = data.custom;    localStorage.setItem(CUSTOM_KEY,    JSON.stringify(state.custom));    }
    if (data.log)       { state.log       = data.log;       localStorage.setItem(LOG_KEY,       JSON.stringify(state.log));       }
    if (data.subtopics) { state.subtopics = data.subtopics; localStorage.setItem(SUBTOPIC_KEY,  JSON.stringify(state.subtopics)); }
    if (data.daily)     { state.daily     = data.daily;     localStorage.setItem(DAILY_KEY,     JSON.stringify(state.daily));     }
    if (data.habits)    { state.habits    = data.habits;    localStorage.setItem(HABITS_KEY,    JSON.stringify(state.habits));    }
    if (data.habitLog)  { state.habitLog  = data.habitLog;  localStorage.setItem(HABIT_LOG_KEY, JSON.stringify(state.habitLog));  }
    destroyAllCharts();
    document.getElementById("tab-content").innerHTML = "";
    buildTabs(); buildNav(); setActiveTab("dashboard");
    showToast("Data imported successfully!");
  });
}

// ─── TASKS EXPORT / IMPORT ────────────────────────────────────────────────────
function exportTasksData() {
  const analytics = computeTasksAnalytics();
  const payload = {
    version: 1, type: "qa-tracker-tasks",
    exportedAt: new Date().toISOString(),
    data: { daily: state.daily, habits: state.habits, habitLog: state.habitLog },
    analytics,
  };
  downloadJSON(payload, `qa-tasks-analytics-${getTodayStr()}.json`);
  showToast("Tasks analytics exported!");
}

function importTasksData() {
  pickJSONFile(data => {
    if (data.type !== "qa-tracker-tasks") { showToast("Not a tasks export file", true); return; }
    const d = data.data || {};
    if (d.daily)    { state.daily    = d.daily;    localStorage.setItem(DAILY_KEY,     JSON.stringify(state.daily));     }
    if (d.habits)   { state.habits   = d.habits;   localStorage.setItem(HABITS_KEY,    JSON.stringify(state.habits));    }
    if (d.habitLog) { state.habitLog = d.habitLog; localStorage.setItem(HABIT_LOG_KEY, JSON.stringify(state.habitLog));  }
    destroyAllCharts();
    document.getElementById("tab-content").innerHTML = "";
    buildTabs(); buildNav(); setActiveTab("daily");
    showToast("Tasks data imported!");
  });
}

function computeTasksAnalytics() {
  const today = getTodayStr();
  // Collect all unique dates
  const allDates = new Set([...Object.keys(state.daily), ...Object.keys(state.habitLog)]);
  const sorted   = [...allDates].sort();
  const from     = sorted[0] || today;
  const to       = today;

  let totalOnceTasks=0, doneOnceTasks=0, totalOnceMin=0, doneOnceMin=0;
  let totalHabitInst=0, doneHabitInst=0;
  const habitStats = {};
  for (const h of state.habits) habitStats[h.id] = { title:h.title, recurrence:h.recurrence, scheduled:0, done:0 };

  // Iterate all days from first data to today
  let bestStreak=0, curStreak=0;
  const startD = new Date(from+"T00:00:00");
  const endD   = new Date(to+"T00:00:00");
  const dailyRows = [];

  for (let d = new Date(startD); d <= endD; d.setDate(d.getDate()+1)) {
    const str   = d.toISOString().slice(0,10);
    const tasks = state.daily[str] || [];
    totalOnceTasks += tasks.length;
    doneOnceTasks  += tasks.filter(t=>t.done).length;
    totalOnceMin   += tasks.reduce((s,t)=>s+(t.timeMin||0),0);
    doneOnceMin    += tasks.filter(t=>t.done).reduce((s,t)=>s+(t.timeMin||0),0);

    let dayHabSched=0, dayHabDone=0, dayHabMin=0;
    for (const h of state.habits) {
      if (habitAppliesOnDate(h, str)) {
        habitStats[h.id].scheduled++;
        totalHabitInst++;
        dayHabSched++;
        dayHabMin += (h.timeMin||0);
        if (state.habitLog[str]?.[h.id]) { habitStats[h.id].done++; doneHabitInst++; dayHabDone++; }
      }
    }

    const dayActive = tasks.some(t=>t.done) || dayHabDone > 0;
    if (dayActive) { curStreak++; bestStreak = Math.max(bestStreak, curStreak); }
    else curStreak = 0;

    dailyRows.push({ date:str, onceTasks:tasks.length, onceDone:tasks.filter(t=>t.done).length,
      habitSched:dayHabSched, habitDone:dayHabDone, minTracked:tasks.reduce((s,t)=>s+(t.timeMin||0),0)+dayHabMin });
  }

  return {
    period: { from, to },
    onceTasks: { total:totalOnceTasks, done:doneOnceTasks, rate: totalOnceTasks?Math.round(doneOnceTasks/totalOnceTasks*100):0,
      minutesTracked:totalOnceMin, minutesDone:doneOnceMin },
    habits: { total:totalHabitInst, done:doneHabitInst, rate: totalHabitInst?Math.round(doneHabitInst/totalHabitInst*100):0,
      byHabit: Object.entries(habitStats).map(([id,s])=>({id,...s,rate:s.scheduled?Math.round(s.done/s.scheduled*100):0})) },
    streaks: { current:curStreak, best:bestStreak },
    dailyBreakdown: dailyRows,
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type:"application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a"); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
}

function pickJSONFile(callback) {
  const input = document.createElement("input"); input.type="file"; input.accept=".json,application/json";
  input.onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => { try { callback(JSON.parse(ev.target.result)); } catch(err) { showToast("Parse error: "+err.message, true); } };
    r.readAsText(file);
  };
  input.click();
}

function destroyAllCharts() {
  [pieChart,lineChart,barChart,doughnutChart,dashDailyPieChart,dashDailyLineChart,
   dailyProgressChart,dailyTimePieChart,dailyBarChart].forEach(c=>{ try{if(c)c.destroy();}catch(e){} });
  pieChart=lineChart=barChart=doughnutChart=dashDailyPieChart=dashDailyLineChart=
  dailyProgressChart=dailyTimePieChart=dailyBarChart=null;
}

function showToast(msg, isError=false) {
  let t = document.getElementById("app-toast");
  if (!t) { t=document.createElement("div"); t.id="app-toast"; document.body.appendChild(t); }
  t.textContent=msg; t.className="app-toast"+(isError?" error":""); t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 3000);
}

// ─── STATS HELPERS ────────────────────────────────────────────────────────────
function getTabStats(tabId) {
  const syllabus = SYLLABUS_DATA[tabId];
  if (!syllabus) return { total:0, done:0, pct:0 };
  let total=0, done=0;
  for (const sec of syllabus.sections)
    for (const topic of sec.topics) { total++; if (state.progress[topic.id]?.done) done++; }
  return { total, done, pct: total ? Math.round((done/total)*100) : 0 };
}
function getAllStats() {
  let total=0, done=0;
  for (const id of Object.keys(SYLLABUS_DATA)) { const s=getTabStats(id); total+=s.total; done+=s.done; }
  return { total, done, pct: total ? Math.round((done/total)*100) : 0 };
}

// ─── NAV BUILDER ──────────────────────────────────────────────────────────────
function buildNav() {
  const nav = document.getElementById("sidebar-nav");
  nav.innerHTML = "";
  const addLink = (tab, icon, label, badge) => {
    const li = document.createElement("li");
    li.innerHTML = `<a class="nav-link" data-tab="${tab}" href="#">
      <span class="nav-icon">${icon}</span><span>${label}</span>
      ${badge ? `<span class="nav-badge" style="${badge.style}">${badge.text}</span>` : ""}
    </a>`;
    nav.appendChild(li);
  };
  addLink("dashboard","📊","Dashboard");
  addLink("daily","📅","Daily Tracker");
  addLink("syllabi","📚","Syllabus Manager");
  const div = document.createElement("li");
  div.innerHTML = `<span class="nav-divider">SYLLABI</span>`;
  nav.appendChild(div);
  for (const [id,s] of Object.entries(SYLLABUS_DATA)) {
    const st = getTabStats(id);
    addLink(id, s.icon, s.label, { style:`background:${s.color}20;color:${s.color}`, text:st.pct+"%" });
  }
  nav.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => { e.preventDefault(); setActiveTab(link.dataset.tab); });
  });
}
function refreshNavBadges() {
  document.querySelectorAll(".nav-link[data-tab]").forEach(link => {
    const tabId = link.dataset.tab;
    if (tabId==="dashboard"||tabId==="daily"||tabId==="syllabi") return;
    const badge = link.querySelector(".nav-badge");
    if (badge) badge.textContent = getTabStats(tabId).pct+"%";
  });
}

// ─── TAB BUILDER ─────────────────────────────────────────────────────────────
function buildTabs() {
  const c = document.getElementById("tab-content");
  const mk = (id, html) => { const d=document.createElement("div"); d.id=`tab-${id}`; d.className="tab-pane"; d.innerHTML=html; c.appendChild(d); };
  mk("dashboard", buildDashboardHTML());
  mk("daily",     buildDailyTrackerHTML());
  mk("syllabi",   buildSyllabusManagerHTML());
  for (const [id, syl] of Object.entries(SYLLABUS_DATA)) mk(id, buildSyllabusHTML(syl));
}

// ─── DASHBOARD HTML ───────────────────────────────────────────────────────────
function buildDashboardHTML() {
  return `
    <div class="dashboard">
      <div class="dash-header">
        <div class="dash-header-row">
          <div><h1 class="dash-title">QA Study Tracker</h1><p class="dash-subtitle">Your personal learning progress dashboard</p></div>
          <div class="dash-actions">
            <button class="action-btn export-btn" onclick="exportData()">⬇ Export</button>
            <button class="action-btn import-btn" onclick="importData()">⬆ Import</button>
          </div>
        </div>
      </div>
      <div id="dash-overview" class="overview-cards"></div>
      <div class="charts-row">
        <div class="chart-card"><h3 class="chart-title">Overall Progress</h3><div class="pie-wrap"><canvas id="chart-pie"></canvas></div></div>
        <div class="chart-card wide"><h3 class="chart-title">Topics Completed <span class="chart-subtitle">(last 14 days)</span></h3><canvas id="chart-line" height="120"></canvas></div>
      </div>
      <div class="charts-row">
        <div class="chart-card wide"><h3 class="chart-title">Progress by Syllabus</h3><canvas id="chart-bar" height="110"></canvas></div>
        <div class="chart-card"><h3 class="chart-title">Completion Breakdown</h3><div class="pie-wrap"><canvas id="chart-doughnut"></canvas></div></div>
      </div>
      <div class="charts-row">
        <div class="chart-card"><h3 class="chart-title">Today's Tasks <span class="chart-subtitle">(time)</span></h3><div class="pie-wrap"><canvas id="chart-daily-pie"></canvas></div></div>
        <div class="chart-card wide"><h3 class="chart-title">Daily Task Completion % <span class="chart-subtitle">(last 14 days)</span></h3><canvas id="chart-daily-line" height="120"></canvas></div>
      </div>
      <div class="recent-activity"><h3 class="chart-title">Recent Activity</h3><div id="activity-list"></div></div>
    </div>`;
}

// ─── SYLLABUS HTML ────────────────────────────────────────────────────────────
function buildSyllabusHTML(syllabus) {
  const stats = getTabStats(syllabus.id);
  let html = `
    <div class="syllabus-header" style="border-left:4px solid ${syllabus.color}">
      <div class="syl-title-row">
        <span class="syl-icon">${syllabus.icon}</span>
        <div><h1 class="syl-title">${syllabus.label}</h1><p class="syl-meta">${stats.total} topics &bull; ${stats.done} completed</p></div>
        <div class="syl-progress-ring">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" fill="none" stroke="#e5e7eb" stroke-width="6"/>
            <circle cx="36" cy="36" r="30" fill="none" stroke="${syllabus.color}" stroke-width="6"
              stroke-dasharray="${Math.round(2*Math.PI*30)}" stroke-dashoffset="${Math.round(2*Math.PI*30*(1-stats.pct/100))}"
              stroke-linecap="round" transform="rotate(-90 36 36)"/>
          </svg>
          <span class="ring-pct" style="color:${syllabus.color}">${stats.pct}%</span>
        </div>
      </div>
      <div class="syl-prog-bar-wrap"><div class="syl-prog-bar" style="background:${syllabus.color};width:${stats.pct}%"></div></div>
    </div>
    <div class="section-list">`;
  for (const section of syllabus.sections) {
    const secDone = section.topics.filter(t=>state.progress[t.id]?.done).length;
    html += `
      <div class="section-card" id="sec-${section.id}">
        <div class="section-header" onclick="toggleSection('${section.id}')">
          <div class="sec-title-wrap"><span class="sec-chevron" id="chev-${section.id}">▶</span><h2 class="sec-title">${section.title}</h2></div>
          <span class="sec-count" style="color:${syllabus.color}">${secDone}/${section.topics.length}</span>
        </div>
        <div class="section-body collapsed" id="secbody-${section.id}">`;
    for (const topic of section.topics) {
      const done   = !!state.progress[topic.id]?.done;
      const custom = state.custom[topic.id] || { notes:"", resources:[] };
      html += buildTopicCard(topic, done, custom, syllabus.color);
    }
    html += `</div></div>`;
  }
  html += `</div>`;
  return html;
}

function buildTopicCard(topic, done, custom, color) {
  const resHtml = custom.resources.map((r,i)=>`
    <span class="resource-chip">
      <a href="${escHtml(r.url)}" target="_blank" rel="noopener">${escHtml(r.label||r.url)}</a>
      <button class="res-del" onclick="deleteResource('${topic.id}',${i})" title="Remove">×</button>
    </span>`).join("");
  const stState = state.subtopics[topic.id] || {};
  const svgCheck = `<svg viewBox="0 0 12 12"><polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;
  const subtopicsHtml = topic.subtopics.map((st,i) => {
    const checked = !!stState[i];
    return `<label class="subtopic-check-item ${checked?"checked":""}">
      <input type="checkbox" class="subtopic-checkbox"
        data-topic="${topic.id}" data-index="${i}" data-total="${topic.subtopics.length}"
        ${checked?"checked":""} onchange="toggleSubtopic('${topic.id}',${i},${topic.subtopics.length})">
      <span class="subtopic-custom-check" style="--c:${color}">${checked?svgCheck:""}</span>
      <span class="subtopic-label">${escHtml(st)}</span>
    </label>`;
  }).join("");
  return `
    <div class="topic-card ${done?"done":""}" id="topic-${topic.id}">
      <div class="topic-top">
        <label class="topic-check-wrap">
          <input type="checkbox" class="topic-checkbox" data-id="${topic.id}" ${done?"checked":""} onchange="toggleTopic(this)">
          <span class="custom-check" style="--c:${color}">${done?svgCheck:""}</span>
        </label>
        <span class="topic-title ${done?"strikethrough":""}" onclick="toggleTopicDetails('${topic.id}')" style="cursor:pointer">${escHtml(topic.title)}</span>
        <button class="topic-expand-btn" onclick="toggleTopicDetails('${topic.id}')"><span id="topicexp-${topic.id}">＋</span></button>
      </div>
      <div class="topic-details collapsed" id="details-${topic.id}">
        ${topic.subtopics.length ? `<div class="subtopics-section"><label class="notes-label">📋 Subtopics</label><div class="subtopics-checklist">${subtopicsHtml}</div></div>` : ""}
        <div class="notes-area">
          <label class="notes-label">📝 Notes</label>
          <textarea class="notes-input" placeholder="Add your notes here..." data-id="${topic.id}" onblur="saveNotes(this)">${escHtml(custom.notes||"")}</textarea>
        </div>
        <div class="resources-area">
          <label class="notes-label">🔗 Resources</label>
          <div class="resources-list" id="res-${topic.id}">${resHtml||'<span class="no-res">No resources added yet</span>'}</div>
          <div class="add-resource-row">
            <input type="text" class="res-input" id="res-label-${topic.id}" placeholder="Label (e.g. MDN Docs)">
            <input type="text" class="res-input" id="res-url-${topic.id}" placeholder="URL (https://...)">
            <button class="add-res-btn" onclick="addResource('${topic.id}')" style="background:${color}">Add</button>
          </div>
        </div>
      </div>
    </div>`;
}

// ─── TOPIC INTERACTIONS ───────────────────────────────────────────────────────
function toggleTopic(checkbox) {
  const id=checkbox.dataset.id, done=checkbox.checked, prev=!!state.progress[id]?.done;
  state.progress[id] = { done, date: done ? getTodayStr() : null };
  saveProgress();
  const topic = findTopicById(id);
  if (topic?.subtopics.length) {
    if (!state.subtopics[id]) state.subtopics[id]={};
    topic.subtopics.forEach((_,i)=>{ state.subtopics[id][i]=done; });
    saveSubtopics();
    const svgCheck=`<svg viewBox="0 0 12 12"><polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;
    document.getElementById(`topic-${id}`)?.querySelectorAll(".subtopic-checkbox").forEach(cb=>{
      cb.checked=done;
      const item=cb.closest(".subtopic-check-item"), chk=cb.nextElementSibling;
      if(done){item.classList.add("checked");chk.innerHTML=svgCheck;}
      else{item.classList.remove("checked");chk.innerHTML="";}
    });
  }
  const card=document.getElementById(`topic-${id}`);
  const svgCheck=`<svg viewBox="0 0 12 12"><polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;
  if(done){card?.classList.add("done");card?.querySelector(".topic-title")?.classList.add("strikethrough");const c=card?.querySelector(".custom-check");if(c)c.innerHTML=svgCheck;if(!prev)logActivity(getCurrentTab(),1);}
  else{card?.classList.remove("done");card?.querySelector(".topic-title")?.classList.remove("strikethrough");const c=card?.querySelector(".custom-check");if(c)c.innerHTML="";}
  refreshSyllabusHeader(getCurrentTab()); refreshNavBadges(); updateDashboardIfVisible();
}

function toggleSubtopic(topicId, index, total) {
  if (!state.subtopics[topicId]) state.subtopics[topicId]={};
  const cb=document.querySelector(`.subtopic-checkbox[data-topic="${topicId}"][data-index="${index}"]`);
  const checked=cb.checked; state.subtopics[topicId][index]=checked; saveSubtopics();
  const item=cb.closest(".subtopic-check-item"), chk=cb.nextElementSibling;
  const svgCheck=`<svg viewBox="0 0 12 12"><polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;
  if(checked){item.classList.add("checked");chk.innerHTML=svgCheck;}else{item.classList.remove("checked");chk.innerHTML="";}
  const allDone=Array.from({length:total},(_,i)=>!!state.subtopics[topicId][i]).every(Boolean);
  const mainCb=document.querySelector(`.topic-checkbox[data-id="${topicId}"]`);
  if(mainCb&&allDone!==mainCb.checked){mainCb.checked=allDone;toggleTopic(mainCb);}
}

function findTopicById(id) {
  for (const s of Object.values(SYLLABUS_DATA)) for (const sec of s.sections) for (const t of sec.topics) if(t.id===id) return t;
  return null;
}
function toggleSection(id) {
  const b=document.getElementById(`secbody-${id}`),c=document.getElementById(`chev-${id}`);
  b.classList.toggle("collapsed"); c.textContent=b.classList.contains("collapsed")?"▶":"▼";
}
function toggleTopicDetails(id) {
  const d=document.getElementById(`details-${id}`),b=document.getElementById(`topicexp-${id}`);
  d.classList.toggle("collapsed"); b.textContent=d.classList.contains("collapsed")?"＋":"－";
}
function saveNotes(textarea) {
  const id=textarea.dataset.id;
  if(!state.custom[id])state.custom[id]={notes:"",resources:[]};
  state.custom[id].notes=textarea.value; saveCustom();
}
function addResource(topicId) {
  const lEl=document.getElementById(`res-label-${topicId}`), uEl=document.getElementById(`res-url-${topicId}`);
  const url=uEl.value.trim(); if(!url){uEl.focus();return;}
  if(!state.custom[topicId])state.custom[topicId]={notes:"",resources:[]};
  state.custom[topicId].resources.push({label:lEl.value.trim()||url,url});
  saveCustom(); lEl.value=""; uEl.value=""; rerenderTopicResources(topicId);
}
function deleteResource(topicId,idx) {
  if(!state.custom[topicId])return;
  state.custom[topicId].resources.splice(idx,1); saveCustom(); rerenderTopicResources(topicId);
}
function rerenderTopicResources(topicId) {
  const c=document.getElementById(`res-${topicId}`), resources=state.custom[topicId]?.resources||[];
  if(!resources.length){c.innerHTML=`<span class="no-res">No resources added yet</span>`;return;}
  c.innerHTML=resources.map((r,i)=>`<span class="resource-chip"><a href="${escHtml(r.url)}" target="_blank" rel="noopener">${escHtml(r.label||r.url)}</a><button class="res-del" onclick="deleteResource('${topicId}',${i})" title="Remove">×</button></span>`).join("");
}

// ─── DAILY TRACKER HTML ───────────────────────────────────────────────────────
function buildDailyTrackerHTML() {
  return `
    <div class="daily-tracker">
      <div class="dash-header">
        <div class="dash-header-row">
          <div><h1 class="dash-title">Daily Progress Tracker</h1><p class="dash-subtitle">Daily tasks &amp; recurring habits with time tracking</p></div>
          <div class="dash-actions">
            <button class="action-btn export-btn" onclick="exportTasksData()">⬇ Export Tasks</button>
            <button class="action-btn import-btn" onclick="importTasksData()">⬆ Import Tasks</button>
          </div>
        </div>
      </div>

      <!-- View switcher -->
      <div class="daily-view-tabs">
        <button class="daily-view-tab active" id="view-tab-tasks"   onclick="switchDailyView('tasks',this)">📋 Daily Tasks</button>
        <button class="daily-view-tab"         id="view-tab-habits" onclick="switchDailyView('habits',this)">🔄 Recurring Habits</button>
      </div>

      <!-- ── TASKS VIEW ── -->
      <div id="daily-tasks-view" class="daily-main-grid">
        <div class="daily-left">
          <div class="date-nav-bar">
            <button class="date-nav-btn" onclick="shiftDate(-1)">◀</button>
            <div id="date-strip" class="date-strip"></div>
            <button class="date-nav-btn" onclick="shiftDate(1)">▶</button>
            <button class="today-btn" onclick="goToToday()">Today</button>
            <input type="date" id="date-picker" class="date-picker-input" onchange="selectDateFromPicker(this.value)">
          </div>
          <div class="task-panel">
            <div class="task-panel-header">
              <span id="task-date-label" class="task-date-label"></span>
              <span id="task-summary"    class="task-summary-badge"></span>
            </div>
            <div id="task-list" class="task-list"></div>
            <div class="add-task-form">
              <input type="text" id="new-task-title" placeholder="Add a one-off task..." class="task-title-input"
                onkeydown="if(event.key==='Enter')addDailyTask()">
              <input type="number" id="new-task-time" placeholder="Min" class="task-time-input" min="5" max="480">
              <button onclick="addDailyTask()" class="add-task-btn">+ Add</button>
            </div>
          </div>
        </div>
        <div class="daily-right">
          <div class="analytics-top-row">
            <h3 class="chart-title">Analytics</h3>
            <div class="filter-tabs">
              <button class="filter-tab active" onclick="setDailyFilter('weekly',this)">Weekly</button>
              <button class="filter-tab"         onclick="setDailyFilter('monthly',this)">Monthly</button>
            </div>
          </div>
          <div id="daily-analytics"></div>
        </div>
      </div>

      <!-- ── HABITS VIEW ── -->
      <div id="daily-habits-view" class="daily-habits-page" style="display:none">
        <div class="habits-layout">
          <!-- New habit form -->
          <div class="habit-form-card">
            <h3 class="chart-title" style="margin-bottom:16px">➕ New Recurring Habit</h3>

            <div class="hf-row">
              <div class="hf-group" style="flex:2">
                <label class="hf-label">Habit Name</label>
                <input type="text" id="hf-title" placeholder="e.g. Morning Review" class="hf-input">
              </div>
              <div class="hf-group">
                <label class="hf-label">Time (min)</label>
                <input type="number" id="hf-time" placeholder="30" class="hf-input" min="5" max="480">
              </div>
            </div>

            <div class="hf-group">
              <label class="hf-label">Repeat Pattern</label>
              <div class="hf-pills" id="hf-recurrence">
                <button class="pill active" onclick="setHabitRecurrence('daily',this)">Daily</button>
                <button class="pill"         onclick="setHabitRecurrence('weekdays',this)">Weekdays</button>
                <button class="pill"         onclick="setHabitRecurrence('weekends',this)">Weekends</button>
                <button class="pill"         onclick="setHabitRecurrence('custom',this)">Custom Days</button>
              </div>
            </div>

            <div id="hf-custom-days" class="hf-group" style="display:none">
              <label class="hf-label">Select Days</label>
              <div class="hf-day-toggles">
                ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=>
                  `<button class="day-toggle" data-day="${i}" onclick="toggleHabitDay(${i},this)">${d}</button>`
                ).join("")}
              </div>
            </div>

            <div class="hf-group">
              <label class="hf-label">Duration</label>
              <div class="hf-pills" id="hf-duration">
                <button class="pill" onclick="setHabitDuration('1week',this)">1 Week</button>
                <button class="pill" onclick="setHabitDuration('2weeks',this)">2 Weeks</button>
                <button class="pill" onclick="setHabitDuration('3weeks',this)">3 Weeks</button>
                <button class="pill active" onclick="setHabitDuration('1month',this)">1 Month</button>
                <button class="pill" onclick="setHabitDuration('2months',this)">2 Months</button>
                <button class="pill" onclick="setHabitDuration('indefinite',this)">Indefinite</button>
                <button class="pill" onclick="setHabitDuration('custom',this)">Custom</button>
              </div>
            </div>

            <div class="hf-row">
              <div class="hf-group">
                <label class="hf-label">Start Date</label>
                <input type="date" id="hf-start" class="hf-input" value="${getTodayStr()}" onchange="onHabitStartChange(this.value)">
              </div>
              <div class="hf-group" id="hf-end-group">
                <label class="hf-label">End Date <span id="hf-end-computed" class="hf-computed-label"></span></label>
                <input type="date" id="hf-end" class="hf-input" onchange="habitForm.endDate=this.value">
              </div>
            </div>

            <button class="add-habit-btn" onclick="addHabit()">Create Habit</button>
          </div>

          <!-- Existing habits -->
          <div class="habits-list-card">
            <h3 class="chart-title" style="margin-bottom:14px">Your Habits</h3>
            <div id="habits-list"></div>
          </div>
        </div>

        <!-- Habit analytics -->
        <div class="habit-analytics-row">
          <div class="chart-card">
            <h3 class="chart-title">Habit Completion Rates</h3>
            <canvas id="chart-habit-bar" height="160"></canvas>
          </div>
          <div class="chart-card">
            <h3 class="chart-title">Habits This Week</h3>
            <canvas id="chart-habit-week" height="160"></canvas>
          </div>
        </div>
      </div>
    </div>`;
}

// ─── DAILY TRACKER RENDER ─────────────────────────────────────────────────────
function renderDailyTracker() {
  if (currentDailyView === "tasks") {
    renderDateStrip();
    renderTaskList();
    renderDailyAnalytics();
  } else {
    renderHabitsManager();
    renderHabitAnalytics();
  }
}

function switchDailyView(view, btn) {
  currentDailyView = view;
  document.querySelectorAll(".daily-view-tab").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("daily-tasks-view").style.display  = view==="tasks"  ? "" : "none";
  document.getElementById("daily-habits-view").style.display = view==="habits" ? "" : "none";
  if (view==="tasks")  { renderDateStrip(); renderTaskList(); renderDailyAnalytics(); }
  if (view==="habits") { renderHabitsManager(); renderHabitAnalytics(); }
}

// ─── DATE STRIP ───────────────────────────────────────────────────────────────
function renderDateStrip() {
  const strip = document.getElementById("date-strip"); if(!strip) return;
  const dates = [];
  for (let i=-3; i<=3; i++) { const d=new Date(); d.setDate(d.getDate()+i); dates.push(d.toISOString().slice(0,10)); }
  strip.innerHTML = dates.map(date => {
    const d       = new Date(date+"T00:00:00");
    const tasks   = state.daily[date] || [];
    const habits  = state.habits.filter(h=>habitAppliesOnDate(h,date));
    const taskDone   = tasks.filter(t=>t.done).length;
    const habitDone  = habits.filter(h=>state.habitLog[date]?.[h.id]).length;
    const totalItems = tasks.length + habits.length;
    const doneItems  = taskDone + habitDone;
    const dotClass   = totalItems===0 ? "" : doneItems===totalItems ? "all-done" : "has-tasks";
    return `<div class="date-chip ${date===selectedDate?"active":""} ${date===getTodayStr()?"today":""}" onclick="selectDate('${date}')">
      <span class="date-chip-day">${d.toLocaleDateString("en-US",{weekday:"short"})}</span>
      <span class="date-chip-num">${d.getDate()}</span>
      <span class="date-chip-dot ${dotClass}"></span>
    </div>`;
  }).join("");
  const picker = document.getElementById("date-picker"); if(picker) picker.value=selectedDate;
}

// ─── TASK LIST ────────────────────────────────────────────────────────────────
function renderTaskList() {
  const list=document.getElementById("task-list"), label=document.getElementById("task-date-label"), summary=document.getElementById("task-summary");
  if(!list) return;
  const tasks   = state.daily[selectedDate] || [];
  const habits  = state.habits.filter(h=>habitAppliesOnDate(h,selectedDate));
  const d       = new Date(selectedDate+"T00:00:00");
  const dateStr = d.toLocaleDateString("en-US",{weekday:"long",day:"numeric",month:"long"});
  if(label) label.textContent = selectedDate===getTodayStr() ? "Today — "+dateStr : dateStr;

  const taskDone  = tasks.filter(t=>t.done).length;
  const habitDone = habits.filter(h=>state.habitLog[selectedDate]?.[h.id]).length;
  const totalMin  = tasks.reduce((s,t)=>s+(t.timeMin||0),0) + habits.reduce((s,h)=>s+(h.timeMin||0),0);
  const doneMin   = tasks.filter(t=>t.done).reduce((s,t)=>s+(t.timeMin||0),0) + habits.filter(h=>state.habitLog[selectedDate]?.[h.id]).reduce((s,h)=>s+(h.timeMin||0),0);
  const totalDone = taskDone+habitDone, total=tasks.length+habits.length;
  if(summary) summary.textContent = total ? `${totalDone}/${total} done · ${formatMinutes(doneMin)}/${formatMinutes(totalMin)}` : "No tasks";

  const svgCheck = `<svg viewBox="0 0 12 12"><polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;
  let html = "";

  // Recurring habits section
  if (habits.length) {
    html += `<div class="task-section-header habit-section-header">🔄 Recurring Habits <span class="task-section-count">${habitDone}/${habits.length}</span></div>`;
    html += habits.map(h => {
      const done = !!state.habitLog[selectedDate]?.[h.id];
      return `<div class="task-item habit-item ${done?"done":""}" id="habit-item-${h.id}">
        <label class="task-check-wrap">
          <input type="checkbox" class="task-checkbox" ${done?"checked":""} onchange="toggleHabitDone('${h.id}')">
          <span class="task-custom-check habit-check">${done?svgCheck:""}</span>
        </label>
        <span class="task-title-text ${done?"strikethrough":""}">${escHtml(h.title)}</span>
        ${h.timeMin?`<span class="task-time-badge">${formatMinutes(h.timeMin)}</span>`:""}
        <span class="habit-recur-badge">${formatHabitRecurrence(h)}</span>
      </div>`;
    }).join("");
  }

  // One-off tasks section
  if (tasks.length || habits.length) {
    html += `<div class="task-section-header">📋 Daily Tasks <span class="task-section-count">${taskDone}/${tasks.length}</span></div>`;
  }
  if (!tasks.length) {
    html += `<div class="no-tasks" style="padding:12px 16px">No one-off tasks. Add one below.</div>`;
  } else {
    html += tasks.map((task,i) => `
      <div class="task-item ${task.done?"done":""}" id="daily-task-${i}">
        <label class="task-check-wrap">
          <input type="checkbox" class="task-checkbox" ${task.done?"checked":""} onchange="toggleDailyTask(${i})">
          <span class="task-custom-check">${task.done?svgCheck:""}</span>
        </label>
        <span class="task-title-text ${task.done?"strikethrough":""}">${escHtml(task.title)}</span>
        ${task.timeMin?`<span class="task-time-badge">${formatMinutes(task.timeMin)}</span>`:""}
        <button class="task-del-btn" onclick="deleteDailyTask(${i})" title="Delete">×</button>
      </div>`).join("");
  }

  if (!habits.length && !tasks.length) {
    list.innerHTML = `<div class="no-tasks">No tasks or habits for this day. Add one below!</div>`;
    return;
  }
  list.innerHTML = html;
}

// ─── HABIT FUNCTIONS ──────────────────────────────────────────────────────────
function habitAppliesOnDate(h, dateStr) {
  if (!h.active) return false;
  if (dateStr < h.startDate) return false;
  if (h.endDate && dateStr > h.endDate) return false;
  const day = new Date(dateStr+"T00:00:00").getDay(); // 0=Sun
  switch(h.recurrence) {
    case "daily":    return true;
    case "weekdays": return day>=1 && day<=5;
    case "weekends": return day===0 || day===6;
    case "custom":   return (h.customDays||[]).includes(day);
    default:         return false;
  }
}

function formatHabitRecurrence(h) {
  const map = { daily:"Daily", weekdays:"Weekdays", weekends:"Weekends", custom:"Custom" };
  return map[h.recurrence] || h.recurrence;
}

function toggleHabitDone(habitId) {
  if (!state.habitLog[selectedDate]) state.habitLog[selectedDate]={};
  state.habitLog[selectedDate][habitId] = !state.habitLog[selectedDate][habitId];
  saveHabitLog();
  renderTaskList();
  renderDateStrip();
  if (document.getElementById("chart-daily-bar")) renderDailyAnalyticsCharts();
  updateDashboardIfVisible();
}

function renderHabitsManager() {
  const container = document.getElementById("habits-list"); if(!container) return;
  if (!state.habits.length) {
    container.innerHTML = `<div class="no-tasks" style="padding:20px">No habits yet. Create one using the form!</div>`;
    return;
  }
  container.innerHTML = state.habits.map((h,i) => {
    const scheduled = countHabitScheduled(h);
    const done      = countHabitDone(h);
    const rate      = scheduled ? Math.round((done/scheduled)*100) : 0;
    const endLabel  = h.endDate ? `→ ${h.endDate}` : "∞ indefinite";
    return `
      <div class="habit-list-item">
        <div class="habit-list-icon">🔄</div>
        <div class="habit-list-body">
          <div class="habit-list-title">${escHtml(h.title)}</div>
          <div class="habit-list-meta">
            ${formatHabitRecurrence(h)} &bull;
            ${h.timeMin?formatMinutes(h.timeMin)+" &bull;":""}
            ${h.startDate} ${endLabel} &bull;
            <span style="color:#10b981;font-weight:600">${done}/${scheduled} (${rate}%)</span>
          </div>
          <div class="habit-rate-bar"><div class="habit-rate-fill" style="width:${rate}%"></div></div>
        </div>
        <button class="task-del-btn" style="font-size:1rem" onclick="deleteHabit(${i})" title="Delete">×</button>
      </div>`;
  }).join("");
}

function countHabitScheduled(h) {
  let count=0;
  const start=new Date(h.startDate+"T00:00:00"), end=new Date((h.endDate||getTodayStr())+"T00:00:00");
  for (let d=new Date(start); d<=end; d.setDate(d.getDate()+1)) {
    if(habitAppliesOnDate(h, d.toISOString().slice(0,10))) count++;
  }
  return count;
}
function countHabitDone(h) {
  return Object.entries(state.habitLog).reduce((sum,[date,log])=> {
    return sum + (habitAppliesOnDate(h,date) && log[h.id] ? 1 : 0);
  }, 0);
}

function addHabit() {
  const title = document.getElementById("hf-title")?.value.trim();
  if (!title) { document.getElementById("hf-title")?.focus(); return; }
  const timeMin = parseInt(document.getElementById("hf-time")?.value)||0;
  const start   = document.getElementById("hf-start")?.value || getTodayStr();
  let   endDate = habitForm.endDate || computeHabitEndDate(start, habitForm.duration);
  const habit = {
    id:          "h-"+Date.now(),
    title, timeMin,
    recurrence:  habitForm.recurrence,
    customDays:  [...habitForm.customDays],
    startDate:   start,
    endDate:     endDate,
    active:      true,
  };
  if (!habit.recurrence) { showToast("Choose a repeat pattern",true); return; }
  if (habit.recurrence==="custom" && !habit.customDays.length) { showToast("Select at least one day",true); return; }
  state.habits.push(habit);
  saveHabits();
  // Reset form
  document.getElementById("hf-title").value="";
  document.getElementById("hf-time").value="";
  renderHabitsManager();
  renderHabitAnalytics();
  renderDateStrip();
  renderTaskList();
  showToast(`Habit "${title}" created!`);
}

function deleteHabit(idx) {
  const h = state.habits[idx];
  if (!h) return;
  state.habits.splice(idx,1);
  saveHabits();
  renderHabitsManager();
  renderHabitAnalytics();
  renderDateStrip();
  renderTaskList();
}

function computeHabitEndDate(startDate, duration) {
  const d = new Date(startDate+"T00:00:00");
  switch(duration) {
    case "1week":    d.setDate(d.getDate()+7);  break;
    case "2weeks":   d.setDate(d.getDate()+14); break;
    case "3weeks":   d.setDate(d.getDate()+21); break;
    case "1month":   d.setMonth(d.getMonth()+1); break;
    case "2months":  d.setMonth(d.getMonth()+2); break;
    case "indefinite": return null;
    case "custom":   return habitForm.endDate || null;
    default:         return null;
  }
  return d.toISOString().slice(0,10);
}

function setHabitRecurrence(type, btn) {
  habitForm.recurrence = type;
  document.querySelectorAll("#hf-recurrence .pill").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("hf-custom-days").style.display = type==="custom" ? "" : "none";
}

function toggleHabitDay(day, btn) {
  const idx = habitForm.customDays.indexOf(day);
  if (idx>-1) { habitForm.customDays.splice(idx,1); btn.classList.remove("active"); }
  else { habitForm.customDays.push(day); btn.classList.add("active"); }
}

function setHabitDuration(dur, btn) {
  habitForm.duration = dur;
  document.querySelectorAll("#hf-duration .pill").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  const endGroup = document.getElementById("hf-end-group");
  const endInput = document.getElementById("hf-end");
  const computed  = document.getElementById("hf-end-computed");
  if (dur==="indefinite") {
    endGroup.style.opacity="0.4"; endInput.disabled=true; if(computed) computed.textContent="(no end)";
  } else if (dur==="custom") {
    endGroup.style.opacity="1"; endInput.disabled=false; if(computed) computed.textContent="";
  } else {
    endGroup.style.opacity="1"; endInput.disabled=true;
    const start = document.getElementById("hf-start")?.value || getTodayStr();
    const end   = computeHabitEndDate(start, dur);
    if (end) { endInput.value=end; habitForm.endDate=end; if(computed) computed.textContent=`(→ ${end})`; }
  }
}

function onHabitStartChange(val) {
  habitForm.startDate = val;
  if (habitForm.duration && habitForm.duration!=="indefinite" && habitForm.duration!=="custom") {
    const end = computeHabitEndDate(val, habitForm.duration);
    if (end) {
      document.getElementById("hf-end").value=end; habitForm.endDate=end;
      const lbl=document.getElementById("hf-end-computed"); if(lbl) lbl.textContent=`(→ ${end})`;
    }
  }
}

// ─── HABIT ANALYTICS ─────────────────────────────────────────────────────────
let habitBarChart, habitWeekChart;

function renderHabitAnalytics() {
  const ctx1 = document.getElementById("chart-habit-bar");
  const ctx2 = document.getElementById("chart-habit-week");
  if (!ctx1||!ctx2) return;
  if (habitBarChart) habitBarChart.destroy();
  if (habitWeekChart) habitWeekChart.destroy();

  // Completion rates per habit
  const hlabels=[], rates=[], colors=[];
  const palette = ["#2563eb","#7c3aed","#059669","#dc2626","#f59e0b","#0891b2","#db2777"];
  state.habits.forEach((h,i)=>{
    const sched=countHabitScheduled(h), done=countHabitDone(h);
    hlabels.push(h.title.length>15?h.title.slice(0,15)+"…":h.title);
    rates.push(sched?Math.round((done/sched)*100):0);
    colors.push(palette[i%palette.length]);
  });

  if (!hlabels.length) {
    ctx1.closest(".chart-card").innerHTML=`<div class="no-tasks" style="padding:20px;text-align:center;color:#9ca3af">No habits to analyse yet.</div>`;
  } else {
    habitBarChart = new Chart(ctx1, {
      type:"bar",
      data:{ labels:hlabels, datasets:[{ label:"Completion %", data:rates, backgroundColor:colors, borderRadius:6 }] },
      options:{ indexAxis:"y", responsive:true, plugins:{legend:{display:false}},
        scales:{ x:{min:0,max:100,ticks:{callback:v=>v+"%",font:{family:"'DM Sans'"}},grid:{color:"#f3f4f6"}},
          y:{ticks:{font:{family:"'DM Sans'",size:11}},grid:{display:false}} } }
    });
  }

  // This week day-by-day habit completion
  const wlabels=[], wDone=[], wSched=[];
  for (let i=6;i>=0;i--) {
    const d=new Date(); d.setDate(d.getDate()-i);
    const str=d.toISOString().slice(0,10);
    wlabels.push(d.toLocaleDateString("en-US",{weekday:"short"}));
    const habitsForDay=state.habits.filter(h=>habitAppliesOnDate(h,str));
    wSched.push(habitsForDay.length);
    wDone.push(habitsForDay.filter(h=>state.habitLog[str]?.[h.id]).length);
  }
  habitWeekChart = new Chart(ctx2, {
    type:"bar",
    data:{ labels:wlabels, datasets:[
      { label:"Done",      data:wDone,  backgroundColor:"#10b981", borderRadius:4 },
      { label:"Scheduled", data:wSched.map((s,i)=>s-wDone[i]), backgroundColor:"#e5e7eb", borderRadius:4 }
    ]},
    options:{ responsive:true, plugins:{legend:{position:"bottom",labels:{font:{family:"'DM Sans'",size:12}}}},
      scales:{ x:{stacked:true,ticks:{font:{family:"'DM Sans'",size:11}},grid:{display:false}},
        y:{stacked:true,beginAtZero:true,ticks:{stepSize:1,font:{family:"'DM Sans'"}},grid:{color:"#f3f4f6"}} } }
  });
}

// ─── DAILY ANALYTICS ─────────────────────────────────────────────────────────
function renderDailyAnalytics() {
  const container = document.getElementById("daily-analytics"); if(!container) return;
  container.innerHTML = `
    <div class="analytics-cards" id="analytics-cards"></div>
    <div class="chart-card" style="margin-bottom:12px">
      <h3 class="chart-title">Completion Rate <span class="chart-subtitle" id="analytics-period-label"></span></h3>
      <canvas id="chart-daily-progress" height="140"></canvas>
    </div>
    <div class="charts-row-2">
      <div class="chart-card"><h3 class="chart-title">Time Allocation</h3><div class="pie-wrap"><canvas id="chart-daily-time-pie"></canvas></div></div>
      <div class="chart-card"><h3 class="chart-title">Tasks per Day</h3><canvas id="chart-daily-bar" height="180"></canvas></div>
    </div>`;
  renderDailyAnalyticsCharts();
}

function renderDailyAnalyticsCharts() {
  const isWeekly = dailyFilterMode==="weekly";
  const days     = isWeekly ? 7 : 30;
  const labels=[], completedArr=[], totalArr=[], doneTimeArr=[];

  for (let i=days-1; i>=0; i--) {
    const d=new Date(); d.setDate(d.getDate()-i);
    const str=d.toISOString().slice(0,10);
    labels.push(isWeekly ? d.toLocaleDateString("en-US",{weekday:"short"}) : d.getDate().toString());
    const tasks  = state.daily[str]||[];
    const habits = state.habits.filter(h=>habitAppliesOnDate(h,str));
    const taskDone  = tasks.filter(t=>t.done).length;
    const habitDone = habits.filter(h=>state.habitLog[str]?.[h.id]).length;
    completedArr.push(taskDone+habitDone);
    totalArr.push(tasks.length+habits.length);
    doneTimeArr.push(
      tasks.filter(t=>t.done).reduce((s,t)=>s+(t.timeMin||0),0) +
      habits.filter(h=>state.habitLog[str]?.[h.id]).reduce((s,h)=>s+(h.timeMin||0),0)
    );
  }

  const totalTasks=totalArr.reduce((a,b)=>a+b,0), doneTasks=completedArr.reduce((a,b)=>a+b,0);
  const doneTime=doneTimeArr.reduce((a,b)=>a+b,0);
  const pct=totalTasks?Math.round((doneTasks/totalTasks)*100):0;

  const cardsEl=document.getElementById("analytics-cards");
  if(cardsEl) cardsEl.innerHTML=`
    <div class="ana-card"><div class="ana-val">${doneTasks}</div><div class="ana-lbl">Items Done</div></div>
    <div class="ana-card"><div class="ana-val">${totalTasks}</div><div class="ana-lbl">Total Items</div></div>
    <div class="ana-card"><div class="ana-val">${pct}%</div><div class="ana-lbl">Completion</div></div>
    <div class="ana-card"><div class="ana-val">${formatMinutes(doneTime)}</div><div class="ana-lbl">Time Done</div></div>`;

  const pLabel=document.getElementById("analytics-period-label");
  if(pLabel) pLabel.textContent=isWeekly?"(last 7 days)":"(last 30 days)";

  const ctx1=document.getElementById("chart-daily-progress");
  if(ctx1){
    if(dailyProgressChart)dailyProgressChart.destroy();
    const ratePct=totalArr.map((t,i)=>t?Math.round((completedArr[i]/t)*100):null);
    dailyProgressChart=new Chart(ctx1,{type:"line",
      data:{labels,datasets:[{label:"Completion %",data:ratePct,borderColor:"#f59e0b",backgroundColor:"rgba(245,158,11,0.08)",
        borderWidth:2.5,pointBackgroundColor:"#f59e0b",pointRadius:4,fill:true,tension:0.35,spanGaps:true}]},
      options:{responsive:true,plugins:{legend:{display:false}},
        scales:{y:{min:0,max:100,ticks:{callback:v=>v+"%",font:{family:"'DM Sans'"}},grid:{color:"#f3f4f6"}},
          x:{ticks:{font:{family:"'DM Sans'",size:11}},grid:{display:false}}}}});
  }

  // Pie for selected date (tasks + habits)
  const sTasks=state.daily[selectedDate]||[], sHabits=state.habits.filter(h=>habitAppliesOnDate(h,selectedDate));
  const ctx2=document.getElementById("chart-daily-time-pie");
  if(ctx2){
    if(dailyTimePieChart)dailyTimePieChart.destroy();
    const doneT=sTasks.filter(t=>t.done).reduce((s,t)=>s+(t.timeMin||0),0)+sHabits.filter(h=>state.habitLog[selectedDate]?.[h.id]).reduce((s,h)=>s+(h.timeMin||0),0);
    const remT =sTasks.filter(t=>!t.done).reduce((s,t)=>s+(t.timeMin||0),0)+sHabits.filter(h=>!state.habitLog[selectedDate]?.[h.id]).reduce((s,h)=>s+(h.timeMin||0),0);
    dailyTimePieChart=new Chart(ctx2,{type:"doughnut",
      data:{labels:["Done","Remaining"],datasets:[{data:[doneT||0,remT||(doneT?0:1)],backgroundColor:["#10b981","#e5e7eb"],borderWidth:0}]},
      options:{responsive:true,maintainAspectRatio:true,
        plugins:{legend:{position:"bottom",labels:{font:{family:"'DM Sans'",size:12}}},
          tooltip:{callbacks:{label:c=>` ${c.label}: ${formatMinutes(c.raw)}`}}}}});
  }

  const ctx3=document.getElementById("chart-daily-bar");
  if(ctx3){
    if(dailyBarChart)dailyBarChart.destroy();
    dailyBarChart=new Chart(ctx3,{type:"bar",
      data:{labels,datasets:[{label:"Done",data:completedArr,backgroundColor:"#10b981",borderRadius:4},
        {label:"Remaining",data:totalArr.map((t,i)=>t-completedArr[i]),backgroundColor:"#e5e7eb",borderRadius:4}]},
      options:{responsive:true,plugins:{legend:{position:"bottom",labels:{font:{family:"'DM Sans'",size:12}}}},
        scales:{x:{stacked:true,ticks:{font:{family:"'DM Sans'",size:11}},grid:{display:false}},
          y:{stacked:true,beginAtZero:true,ticks:{stepSize:1,font:{family:"'DM Sans'"}},grid:{color:"#f3f4f6"}}}}});
  }
}

function setDailyFilter(mode, btn) {
  dailyFilterMode=mode;
  document.querySelectorAll(".filter-tab").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderDailyAnalyticsCharts();
}

function selectDate(dateStr) {
  selectedDate=dateStr;
  renderDateStrip();
  renderTaskList();
  if(document.getElementById("chart-daily-bar")) renderDailyAnalyticsCharts();
}
function selectDateFromPicker(v) { selectDate(v); }
function shiftDate(delta) { const d=new Date(selectedDate+"T00:00:00"); d.setDate(d.getDate()+delta); selectDate(d.toISOString().slice(0,10)); }
function goToToday() { selectDate(getTodayStr()); }

function addDailyTask() {
  const tEl=document.getElementById("new-task-title"), tMin=document.getElementById("new-task-time");
  const title=tEl.value.trim(); if(!title){tEl.focus();return;}
  if(!state.daily[selectedDate])state.daily[selectedDate]=[];
  state.daily[selectedDate].push({id:Date.now().toString(),title,timeMin:parseInt(tMin.value)||0,done:false});
  saveDaily(); tEl.value=""; tMin.value="";
  renderTaskList(); renderDateStrip();
  if(document.getElementById("chart-daily-bar"))renderDailyAnalyticsCharts();
  updateDashboardIfVisible();
}

function toggleDailyTask(index) {
  const tasks=state.daily[selectedDate]; if(!tasks?.[index])return;
  tasks[index].done=!tasks[index].done; saveDaily();
  renderTaskList(); renderDateStrip();
  if(document.getElementById("chart-daily-bar"))renderDailyAnalyticsCharts();
  updateDashboardIfVisible();
}

function deleteDailyTask(index) {
  const tasks=state.daily[selectedDate]; if(!tasks)return;
  tasks.splice(index,1); saveDaily();
  renderTaskList(); renderDateStrip();
  if(document.getElementById("chart-daily-bar"))renderDailyAnalyticsCharts();
  updateDashboardIfVisible();
}

function formatMinutes(min) {
  if(!min)return"0m"; const h=Math.floor(min/60),m=min%60;
  if(h&&m)return`${h}h ${m}m`; return h?`${h}h`:`${m}m`;
}

// ─── TAB SWITCHING ────────────────────────────────────────────────────────────
function setActiveTab(tabId) {
  document.querySelectorAll(".tab-pane").forEach(p=>p.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(l=>l.classList.remove("active"));
  const pane=document.getElementById(`tab-${tabId}`), link=document.querySelector(`.nav-link[data-tab="${tabId}"]`);
  if(pane)pane.classList.add("active"); if(link)link.classList.add("active");
  document.body.dataset.activeTab=tabId;
  if(tabId==="dashboard")renderDashboard();
  if(tabId==="daily")renderDailyTracker();
  if(tabId==="syllabi")renderSyllabusManager();
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("visible");
}
function getCurrentTab(){return document.body.dataset.activeTab||"manual";}

// ─── DASHBOARD RENDER ────────────────────────────────────────────────────────
function renderDashboard() {
  renderOverviewCards(); renderPieChart(); renderLineChart();
  renderBarChart(); renderDoughnutChart(); renderDashDailyPieChart();
  renderDashDailyLineChart(); renderActivityList();
}
function updateDashboardIfVisible() { if(getCurrentTab()==="dashboard")renderDashboard(); }

function renderOverviewCards() {
  const c=document.getElementById("dash-overview"); if(!c)return;
  const all=getAllStats();
  const cards=Object.entries(SYLLABUS_DATA).map(([id,s])=>{
    const st=getTabStats(id);
    return `<div class="overview-card" onclick="setActiveTab('${id}')" style="cursor:pointer;border-top:3px solid ${s.color}">
      <div class="ov-icon">${s.icon}</div><div class="ov-label">${s.label}</div>
      <div class="ov-pct" style="color:${s.color}">${st.pct}%</div><div class="ov-sub">${st.done}/${st.total} topics</div>
      <div class="ov-bar-wrap"><div class="ov-bar" style="background:${s.color};width:${st.pct}%"></div></div>
    </div>`;
  });
  cards.unshift(`<div class="overview-card total" style="border-top:3px solid #374151">
    <div class="ov-icon">🎯</div><div class="ov-label">Overall</div>
    <div class="ov-pct" style="color:#374151">${all.pct}%</div><div class="ov-sub">${all.done}/${all.total} topics</div>
    <div class="ov-bar-wrap"><div class="ov-bar" style="background:#374151;width:${all.pct}%"></div></div>
  </div>`);
  c.innerHTML=cards.join("");
}

function renderPieChart() {
  const ctx=document.getElementById("chart-pie"); if(!ctx)return; if(pieChart)pieChart.destroy();
  const all=getAllStats();
  pieChart=new Chart(ctx,{type:"pie",data:{labels:["Completed","Remaining"],datasets:[{data:[all.done,all.total-all.done],backgroundColor:["#2563eb","#e5e7eb"],borderWidth:0}]},
    options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{position:"bottom",labels:{font:{family:"'DM Sans', sans-serif",size:13}}}}}});
}
function renderDoughnutChart() {
  const ctx=document.getElementById("chart-doughnut"); if(!ctx)return; if(doughnutChart)doughnutChart.destroy();
  const labels=[],data=[],colors=[];
  for(const[id,s]of Object.entries(SYLLABUS_DATA)){const st=getTabStats(id);labels.push(s.label);data.push(st.done);colors.push(s.color);}
  doughnutChart=new Chart(ctx,{type:"doughnut",data:{labels,datasets:[{data,backgroundColor:colors,borderWidth:2,borderColor:"#fff"}]},
    options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{position:"bottom",labels:{font:{family:"'DM Sans', sans-serif",size:12}}}}}});
}
function renderLineChart() {
  const ctx=document.getElementById("chart-line"); if(!ctx)return; if(lineChart)lineChart.destroy();
  const labels=[],counts=[];
  for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const str=d.toISOString().slice(0,10);labels.push(str.slice(5));counts.push(Object.values(state.progress).filter(p=>p.done&&p.date===str).length);}
  lineChart=new Chart(ctx,{type:"line",data:{labels,datasets:[{label:"Topics Completed",data:counts,borderColor:"#2563eb",backgroundColor:"rgba(37,99,235,0.08)",borderWidth:2.5,pointBackgroundColor:"#2563eb",pointRadius:4,fill:true,tension:0.35}]},
    options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{stepSize:1,font:{family:"'DM Sans', sans-serif"}},grid:{color:"#f3f4f6"}},x:{ticks:{font:{family:"'DM Sans', sans-serif",size:11}},grid:{display:false}}}}});
}
function renderBarChart() {
  const ctx=document.getElementById("chart-bar"); if(!ctx)return; if(barChart)barChart.destroy();
  const labels=[],done=[],total=[],colors=[];
  for(const[id,s]of Object.entries(SYLLABUS_DATA)){const st=getTabStats(id);labels.push(s.label);done.push(st.done);total.push(st.total-st.done);colors.push(s.color);}
  barChart=new Chart(ctx,{type:"bar",data:{labels,datasets:[{label:"Completed",data:done,backgroundColor:colors,borderRadius:4},{label:"Remaining",data:total,backgroundColor:colors.map(c=>c+"33"),borderRadius:4}]},
    options:{responsive:true,plugins:{legend:{position:"bottom",labels:{font:{family:"'DM Sans', sans-serif"}}}},scales:{x:{stacked:true,ticks:{font:{family:"'DM Sans', sans-serif"}},grid:{display:false}},y:{stacked:true,beginAtZero:true,ticks:{stepSize:5,font:{family:"'DM Sans', sans-serif"}},grid:{color:"#f3f4f6"}}}}});
}
function renderDashDailyPieChart() {
  const ctx=document.getElementById("chart-daily-pie"); if(!ctx)return; if(dashDailyPieChart)dashDailyPieChart.destroy();
  const today=getTodayStr(), tasks=state.daily[today]||[], habits=state.habits.filter(h=>habitAppliesOnDate(h,today));
  const doneT=tasks.filter(t=>t.done).reduce((s,t)=>s+(t.timeMin||0),0)+habits.filter(h=>state.habitLog[today]?.[h.id]).reduce((s,h)=>s+(h.timeMin||0),0);
  const remT =tasks.filter(t=>!t.done).reduce((s,t)=>s+(t.timeMin||0),0)+habits.filter(h=>!state.habitLog[today]?.[h.id]).reduce((s,h)=>s+(h.timeMin||0),0);
  const doneC=tasks.filter(t=>t.done).length+habits.filter(h=>state.habitLog[today]?.[h.id]).length, totalC=tasks.length+habits.length;
  dashDailyPieChart=new Chart(ctx,{type:"doughnut",data:{labels:["Done","Remaining"],datasets:[{data:[doneT||0,remT||(doneT?0:1)],backgroundColor:["#10b981","#e5e7eb"],borderWidth:0}]},
    options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{position:"bottom",labels:{font:{family:"'DM Sans', sans-serif",size:13}}},title:{display:true,text:totalC?`${doneC}/${totalC} today`:"No tasks today",font:{family:"'DM Sans', sans-serif",size:12},color:"#6b7280",padding:{top:6}},tooltip:{callbacks:{label:c=>` ${c.label}: ${formatMinutes(c.raw)}`}}}}});
}
function renderDashDailyLineChart() {
  const ctx=document.getElementById("chart-daily-line"); if(!ctx)return; if(dashDailyLineChart)dashDailyLineChart.destroy();
  const labels=[],rates=[];
  for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const str=d.toISOString().slice(0,10);labels.push(str.slice(5));const t=state.daily[str]||[],h=state.habits.filter(hb=>habitAppliesOnDate(hb,str));const total=t.length+h.length,done=t.filter(x=>x.done).length+h.filter(hb=>state.habitLog[str]?.[hb.id]).length;rates.push(total?Math.round((done/total)*100):null);}
  dashDailyLineChart=new Chart(ctx,{type:"line",data:{labels,datasets:[{label:"Task Completion %",data:rates,borderColor:"#f59e0b",backgroundColor:"rgba(245,158,11,0.08)",borderWidth:2.5,pointBackgroundColor:"#f59e0b",pointRadius:4,fill:true,tension:0.35,spanGaps:true}]},
    options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+"%",font:{family:"'DM Sans', sans-serif"}},grid:{color:"#f3f4f6"}},x:{ticks:{font:{family:"'DM Sans', sans-serif",size:11}},grid:{display:false}}}}});
}

function renderActivityList() {
  const el=document.getElementById("activity-list"); if(!el)return;
  const recent=[...state.log].reverse().slice(0,20);
  if(!recent.length){el.innerHTML=`<p class="no-activity">No activity yet. Start checking off topics! 🚀</p>`;return;}
  const grouped={};
  for(const e of recent){if(!grouped[e.date])grouped[e.date]=[];grouped[e.date].push(e);}
  let html="";
  for(const[date,entries]of Object.entries(grouped)){
    html+=`<div class="activity-day"><span class="act-date">${formatDate(date)}</span>`;
    for(const e of entries){const s=SYLLABUS_DATA[e.tabId];if(!s)continue;html+=`<span class="act-chip" style="background:${s.color}18;color:${s.color};border:1px solid ${s.color}33">${s.icon} +${e.count} in ${s.label}</span>`;}
    html+=`</div>`;
  }
  el.innerHTML=html;
}

// ─── REFRESH SYLLABUS HEADER ──────────────────────────────────────────────────
function refreshSyllabusHeader(tabId) {
  const syllabus=SYLLABUS_DATA[tabId]; if(!syllabus)return;
  const stats=getTabStats(tabId);
  const metaEl=document.querySelector(`#tab-${tabId} .syl-meta`), pctEl=document.querySelector(`#tab-${tabId} .ring-pct`);
  const barEl=document.querySelector(`#tab-${tabId} .syl-prog-bar`), ringEl=document.querySelector(`#tab-${tabId} circle:last-child`);
  if(metaEl)metaEl.textContent=`${stats.total} topics • ${stats.done} completed`;
  if(pctEl)pctEl.textContent=stats.pct+"%"; if(barEl)barEl.style.width=stats.pct+"%";
  if(ringEl){const c=Math.round(2*Math.PI*30);ringEl.setAttribute("stroke-dashoffset",Math.round(c*(1-stats.pct/100)));}
  for(const sec of syllabus.sections){const el=document.querySelector(`#sec-${sec.id} .sec-count`);if(el)el.textContent=`${sec.topics.filter(t=>state.progress[t.id]?.done).length}/${sec.topics.length}`;}
}

// ─── HAMBURGER ────────────────────────────────────────────────────────────────
function attachGlobalListeners() {
  document.getElementById("hamburger").addEventListener("click",()=>{document.getElementById("sidebar").classList.toggle("open");document.getElementById("overlay").classList.toggle("visible");});
  document.getElementById("overlay").addEventListener("click",()=>{document.getElementById("sidebar").classList.remove("open");document.getElementById("overlay").classList.remove("visible");});
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function escHtml(str){return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function formatDate(str){return new Date(str+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"});}

// ─── SYLLABUS MANAGER ─────────────────────────────────────────────────────────

function buildSyllabusManagerHTML() {
  return `
    <div class="syl-mgr">
      <div class="dash-header">
        <div class="dash-header-row">
          <div>
            <h1 class="dash-title">Syllabus Manager</h1>
            <p class="dash-subtitle">Create, edit, and organise your study syllabi</p>
          </div>
          <div class="dash-actions">
            <button class="action-btn export-btn" onclick="openNewSyllabusForm()">+ New Syllabus</button>
          </div>
        </div>
      </div>
      <div id="new-syl-form-area"></div>
      <div id="syl-mgr-list"></div>
    </div>`;
}

function renderSyllabusManager() {
  const el = document.getElementById("syl-mgr-list");
  if (!el) return;
  const syls = Object.values(SYLLABUS_DATA);
  if (!syls.length) {
    el.innerHTML = `<div class="syl-mgr-empty">No syllabi yet. Click <strong>+ New Syllabus</strong> to create your first one.</div>`;
    return;
  }
  el.innerHTML = syls.map(syl => buildSylMgrCard(syl)).join("");
}

function buildSylMgrCard(syl) {
  const totalTopics = syl.sections.reduce((s, sec) => s + sec.topics.length, 0);
  const isExpanded  = sylMgrExpanded === syl.id;
  return `
    <div class="syl-mgr-card" id="smcard-${syl.id}" style="border-left:4px solid ${syl.color}">
      <div class="syl-mgr-card-header">
        <span class="syl-mgr-icon">${syl.icon}</span>
        <div class="syl-mgr-info">
          <div class="syl-mgr-name">${escHtml(syl.label)}</div>
          <div class="syl-mgr-meta">${totalTopics} topics &bull; ${syl.sections.length} sections</div>
        </div>
        <div class="syl-mgr-actions">
          <button class="syl-mgr-btn" onclick="exportSyllabusData('${syl.id}')" title="Export as JSON">⬇ Export</button>
          <button class="syl-mgr-btn ${isExpanded ? 'active' : ''}" onclick="toggleSylMgrExpand('${syl.id}')">
            ${isExpanded ? '✕ Close' : '✏️ Edit'}
          </button>
          <button class="syl-mgr-btn danger" onclick="deleteSyllabus('${syl.id}')">🗑️ Delete</button>
        </div>
      </div>
      ${isExpanded ? buildSylMgrEditBody(syl) : ''}
    </div>`;
}

function buildSylMgrEditBody(syl) {
  return `
    <div class="syl-mgr-body">
      <div class="syl-mgr-meta-form">
        <div class="notes-label" style="margin-bottom:10px;display:block">Syllabus Details</div>
        <div class="syl-mgr-form-row">
          <div class="syl-mgr-form-group" style="flex:2">
            <label class="notes-label">Label</label>
            <input type="text" class="res-input" id="sme-label-${syl.id}" value="${escHtml(syl.label)}">
          </div>
          <div class="syl-mgr-form-group" style="width:80px;flex:none">
            <label class="notes-label">Icon</label>
            <input type="text" class="res-input" id="sme-icon-${syl.id}" value="${escHtml(syl.icon)}" style="text-align:center;font-size:1.25rem" maxlength="4">
          </div>
          <div class="syl-mgr-form-group" style="width:90px;flex:none">
            <label class="notes-label">Color</label>
            <input type="color" class="hf-input" id="sme-color-${syl.id}" value="${syl.color}" style="height:36px;cursor:pointer;padding:2px 4px">
          </div>
          <div class="syl-mgr-form-group" style="flex:none;align-self:flex-end">
            <button class="syl-mgr-btn success" onclick="saveSyllabusMetadata('${syl.id}')">✓ Save Details</button>
          </div>
        </div>
      </div>

      <div class="syl-mgr-sections-header">
        <label class="notes-label" style="margin:0">Sections (${syl.sections.length})</label>
      </div>
      <div id="sme-sections-${syl.id}">
        ${syl.sections.map(sec => buildSylMgrSection(syl, sec)).join("")}
      </div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <input type="text" class="res-input" style="flex:1" id="smgr-new-sec-${syl.id}" placeholder="New section title..." onkeydown="if(event.key==='Enter')addSection('${syl.id}')">
        <button class="syl-mgr-btn primary" onclick="addSection('${syl.id}')">+ Add Section</button>
      </div>
    </div>`;
}

function buildSylMgrSection(syl, sec) {
  return `
    <div class="syl-mgr-section" id="sms-${sec.id}">
      <div class="syl-mgr-section-header">
        <span class="syl-mgr-section-title-text" id="smgr-sec-title-${sec.id}">${escHtml(sec.title)}</span>
        <div class="syl-mgr-actions">
          <button class="syl-mgr-btn" id="smgr-rename-btn-${sec.id}" onclick="startSectionRename('${syl.id}','${sec.id}')">Rename</button>
          <button class="syl-mgr-btn danger" onclick="deleteSection('${syl.id}','${sec.id}')">Delete</button>
        </div>
      </div>
      <div class="syl-mgr-topics">
        ${sec.topics.map(topic => buildSylMgrTopic(syl, sec, topic)).join("")}
        <div class="syl-mgr-add-topic-row">
          <input type="text" class="res-input" style="flex:1" id="smt-new-${sec.id}" placeholder="New topic title..." onkeydown="if(event.key==='Enter')addTopic('${syl.id}','${sec.id}')">
          <button class="syl-mgr-btn primary" onclick="addTopic('${syl.id}','${sec.id}')">+ Topic</button>
        </div>
      </div>
    </div>`;
}

function buildSylMgrTopic(syl, sec, topic) {
  const subtopicsHtml = topic.subtopics.length
    ? topic.subtopics.map((st, i) => `
        <span class="syl-mgr-subtopic-tag">
          ${escHtml(st)}
          <button class="res-del" onclick="deleteSubtopicMgr('${syl.id}','${sec.id}','${topic.id}',${i})" title="Remove">×</button>
        </span>`).join("")
    : `<span style="font-size:0.75rem;color:#c1c7d0;font-style:italic">No subtopics yet</span>`;
  return `
    <div class="syl-mgr-topic" id="smtopic-${topic.id}">
      <div class="syl-mgr-topic-header">
        <span class="syl-mgr-topic-title-text">${escHtml(topic.title)}</span>
        <div class="syl-mgr-actions">
          <button class="syl-mgr-btn" onclick="toggleTopicEditorMgr('${topic.id}')">Edit</button>
          <button class="syl-mgr-btn danger" onclick="deleteTopicMgr('${syl.id}','${sec.id}','${topic.id}')">Del</button>
        </div>
      </div>
      <div class="syl-mgr-topic-editor collapsed" id="smte-${topic.id}">
        <div class="syl-mgr-form-row" style="margin-bottom:10px">
          <div class="syl-mgr-form-group" style="flex:1">
            <label class="notes-label">Topic Title</label>
            <input type="text" class="res-input" id="smte-title-${topic.id}" value="${escHtml(topic.title)}" onkeydown="if(event.key==='Enter')saveTopicTitleMgr('${syl.id}','${sec.id}','${topic.id}')">
          </div>
          <div class="syl-mgr-form-group" style="flex:none;align-self:flex-end">
            <button class="syl-mgr-btn success" onclick="saveTopicTitleMgr('${syl.id}','${sec.id}','${topic.id}')">✓ Save</button>
          </div>
        </div>
        <label class="notes-label">Subtopics</label>
        <div class="syl-mgr-subtopics" id="smts-${topic.id}">${subtopicsHtml}</div>
        <div style="display:flex;gap:6px;margin-top:6px">
          <input type="text" class="res-input" style="flex:1" id="smst-new-${topic.id}" placeholder="Add subtopic..." onkeydown="if(event.key==='Enter')addSubtopicMgr('${syl.id}','${sec.id}','${topic.id}')">
          <button class="syl-mgr-btn primary" onclick="addSubtopicMgr('${syl.id}','${sec.id}','${topic.id}')">+ Add</button>
        </div>
      </div>
    </div>`;
}

// ─── SYLLABUS CRUD ────────────────────────────────────────────────────────────

function toggleSylMgrExpand(syllabusId) {
  sylMgrExpanded = (sylMgrExpanded === syllabusId) ? null : syllabusId;
  renderSyllabusManager();
}

function openNewSyllabusForm() {
  const area = document.getElementById("new-syl-form-area");
  if (!area) return;
  if (area.innerHTML) { area.innerHTML = ""; return; }
  area.innerHTML = `
    <div class="syl-mgr-new-form">
      <div class="notes-label" style="margin-bottom:12px;display:block;font-size:0.88rem">New Syllabus</div>
      <div class="syl-mgr-form-row">
        <div class="syl-mgr-form-group" style="flex:2">
          <label class="notes-label">Label *</label>
          <input type="text" class="res-input" id="nsyl-label" placeholder="e.g. Performance Testing" onkeydown="if(event.key==='Enter')createNewSyllabus()">
        </div>
        <div class="syl-mgr-form-group" style="width:80px;flex:none">
          <label class="notes-label">Icon</label>
          <input type="text" class="res-input" id="nsyl-icon" placeholder="⚡" style="text-align:center;font-size:1.25rem" maxlength="4">
        </div>
        <div class="syl-mgr-form-group" style="width:90px;flex:none">
          <label class="notes-label">Color</label>
          <input type="color" class="hf-input" id="nsyl-color" value="#2563eb" style="height:36px;cursor:pointer;padding:2px 4px">
        </div>
        <div class="syl-mgr-form-group" style="flex:none;align-self:flex-end;display:flex;gap:6px">
          <button class="syl-mgr-btn primary" onclick="createNewSyllabus()">Create</button>
          <button class="syl-mgr-btn" onclick="document.getElementById('new-syl-form-area').innerHTML=''">✕</button>
        </div>
      </div>
    </div>`;
  document.getElementById("nsyl-label")?.focus();
}

function createNewSyllabus() {
  const label = document.getElementById("nsyl-label")?.value.trim();
  const icon  = document.getElementById("nsyl-icon")?.value.trim()  || "📚";
  const color = document.getElementById("nsyl-color")?.value        || "#2563eb";
  if (!label) { showToast("Label is required", true); return; }
  const id = "syl-" + Date.now().toString(36);
  SYLLABUS_DATA[id] = { id, label, icon, color, sections: [] };
  saveSyllabi();
  rebuildSyllabusTab(id);
  buildNav();
  sylMgrExpanded = id;
  document.getElementById("new-syl-form-area").innerHTML = "";
  renderSyllabusManager();
  showToast(`"${label}" created!`);
}

function saveSyllabusMetadata(syllabusId) {
  const label = document.getElementById(`sme-label-${syllabusId}`)?.value.trim();
  const icon  = document.getElementById(`sme-icon-${syllabusId}`)?.value.trim()  || "📚";
  const color = document.getElementById(`sme-color-${syllabusId}`)?.value        || "#2563eb";
  if (!label) { showToast("Label is required", true); return; }
  const syl = SYLLABUS_DATA[syllabusId];
  syl.label = label; syl.icon = icon; syl.color = color;
  saveSyllabi();
  // Update card header in-place
  const card = document.getElementById(`smcard-${syllabusId}`);
  if (card) {
    card.style.borderLeftColor = color;
    const iconEl = card.querySelector(".syl-mgr-icon"); if (iconEl) iconEl.textContent = icon;
    const nameEl = card.querySelector(".syl-mgr-name"); if (nameEl) nameEl.textContent = label;
  }
  rebuildSyllabusTab(syllabusId);
  buildNav();
  showToast("Syllabus details saved!");
}

function deleteSyllabus(syllabusId) {
  const syl = SYLLABUS_DATA[syllabusId];
  if (!syl) return;
  if (!confirm(`Delete "${syl.label}" and all its structure? Progress data is kept.`)) return;
  delete SYLLABUS_DATA[syllabusId];
  saveSyllabi();
  if (sylMgrExpanded === syllabusId) sylMgrExpanded = null;
  const tabEl = document.getElementById(`tab-${syllabusId}`);
  if (tabEl) tabEl.remove();
  buildNav();
  renderSyllabusManager();
  showToast("Syllabus deleted");
}

function exportSyllabusData(syllabusId) {
  const syl = SYLLABUS_DATA[syllabusId];
  if (!syl) return;
  const payload = {
    version: 1, type: "qa-tracker-syllabus",
    exportedAt: new Date().toISOString(),
    syllabus: JSON.parse(JSON.stringify(syl)),
  };
  downloadJSON(payload, `qa-syllabus-${syllabusId}-${getTodayStr()}.json`);
  showToast(`"${syl.label}" exported!`);
}

// ─── SECTION CRUD ─────────────────────────────────────────────────────────────

function addSection(syllabusId) {
  const input = document.getElementById(`smgr-new-sec-${syllabusId}`);
  const title = input?.value.trim();
  if (!title) { showToast("Enter a section title", true); input?.focus(); return; }
  const id = `sec-${syllabusId.replace(/[^a-z0-9]/gi,"")}-${Date.now().toString(36)}`;
  SYLLABUS_DATA[syllabusId].sections.push({ id, title, topics: [] });
  saveSyllabi();
  input.value = "";
  reRenderSylMgrSections(syllabusId);
  rebuildSyllabusTab(syllabusId);
  showToast("Section added!");
}

function startSectionRename(syllabusId, sectionId) {
  const titleEl = document.getElementById(`smgr-sec-title-${sectionId}`);
  const btn     = document.getElementById(`smgr-rename-btn-${sectionId}`);
  if (!titleEl || !btn) return;
  const sec = SYLLABUS_DATA[syllabusId]?.sections.find(s => s.id === sectionId);
  if (!sec) return;
  titleEl.outerHTML = `<input type="text" class="syl-mgr-section-rename-input" id="smgr-sec-input-${sectionId}" value="${escHtml(sec.title)}" onkeydown="if(event.key==='Enter')saveSectionRename('${syllabusId}','${sectionId}')">`;
  document.getElementById(`smgr-sec-input-${sectionId}`)?.select();
  btn.textContent = "✓ Save";
  btn.onclick = () => saveSectionRename(syllabusId, sectionId);
}

function saveSectionRename(syllabusId, sectionId) {
  const input = document.getElementById(`smgr-sec-input-${sectionId}`);
  const newTitle = input?.value.trim();
  if (!newTitle) return;
  const sec = SYLLABUS_DATA[syllabusId]?.sections.find(s => s.id === sectionId);
  if (!sec) return;
  sec.title = newTitle;
  saveSyllabi();
  input.outerHTML = `<span class="syl-mgr-section-title-text" id="smgr-sec-title-${sectionId}">${escHtml(newTitle)}</span>`;
  const btn = document.getElementById(`smgr-rename-btn-${sectionId}`);
  if (btn) { btn.textContent = "Rename"; btn.onclick = () => startSectionRename(syllabusId, sectionId); }
  rebuildSyllabusTab(syllabusId);
}

function deleteSection(syllabusId, sectionId) {
  const syl = SYLLABUS_DATA[syllabusId];
  const sec = syl?.sections.find(s => s.id === sectionId);
  if (!sec) return;
  if (!confirm(`Delete section "${sec.title}" and all its topics?`)) return;
  syl.sections = syl.sections.filter(s => s.id !== sectionId);
  saveSyllabi();
  reRenderSylMgrSections(syllabusId);
  rebuildSyllabusTab(syllabusId);
  showToast("Section deleted");
}

function reRenderSylMgrSections(syllabusId) {
  const el  = document.getElementById(`sme-sections-${syllabusId}`);
  const syl = SYLLABUS_DATA[syllabusId];
  if (!el || !syl) return;
  el.innerHTML = syl.sections.map(sec => buildSylMgrSection(syl, sec)).join("");
  // Update meta counts
  const card = document.getElementById(`smcard-${syllabusId}`);
  if (card) {
    const totalTopics = syl.sections.reduce((s, sec) => s + sec.topics.length, 0);
    const metaEl = card.querySelector(".syl-mgr-meta");
    if (metaEl) metaEl.textContent = `${totalTopics} topics \u2022 ${syl.sections.length} sections`;
    const hdrLabel = card.querySelector(".syl-mgr-sections-header label");
    if (hdrLabel) hdrLabel.textContent = `Sections (${syl.sections.length})`;
  }
}

// ─── TOPIC CRUD ───────────────────────────────────────────────────────────────

function addTopic(syllabusId, sectionId) {
  const input = document.getElementById(`smt-new-${sectionId}`);
  const title = input?.value.trim();
  if (!title) { showToast("Enter a topic title", true); input?.focus(); return; }
  const sec = SYLLABUS_DATA[syllabusId]?.sections.find(s => s.id === sectionId);
  if (!sec) return;
  const id = `t-${syllabusId.replace(/[^a-z0-9]/gi,"").slice(0,4)}-${Date.now().toString(36)}`;
  sec.topics.push({ id, title, subtopics: [], resources: [] });
  saveSyllabi();
  input.value = "";
  reRenderSylMgrSections(syllabusId);
  rebuildSyllabusTab(syllabusId);
  showToast("Topic added!");
}

function toggleTopicEditorMgr(topicId) {
  const ed = document.getElementById(`smte-${topicId}`);
  if (!ed) return;
  ed.classList.toggle("collapsed");
}

function saveTopicTitleMgr(syllabusId, sectionId, topicId) {
  const newTitle = document.getElementById(`smte-title-${topicId}`)?.value.trim();
  if (!newTitle) { showToast("Title cannot be empty", true); return; }
  const sec   = SYLLABUS_DATA[syllabusId]?.sections.find(s => s.id === sectionId);
  const topic = sec?.topics.find(t => t.id === topicId);
  if (!topic) return;
  topic.title = newTitle;
  saveSyllabi();
  const titleEl = document.querySelector(`#smtopic-${topicId} .syl-mgr-topic-title-text`);
  if (titleEl) titleEl.textContent = newTitle;
  reRenderSylMgrSections(syllabusId);
  rebuildSyllabusTab(syllabusId);
  showToast("Topic saved!");
}

function deleteTopicMgr(syllabusId, sectionId, topicId) {
  const sec   = SYLLABUS_DATA[syllabusId]?.sections.find(s => s.id === sectionId);
  const topic = sec?.topics.find(t => t.id === topicId);
  if (!topic) return;
  if (!confirm(`Delete topic "${topic.title}"?`)) return;
  sec.topics = sec.topics.filter(t => t.id !== topicId);
  saveSyllabi();
  reRenderSylMgrSections(syllabusId);
  rebuildSyllabusTab(syllabusId);
  showToast("Topic deleted");
}

// ─── SUBTOPIC CRUD ────────────────────────────────────────────────────────────

function addSubtopicMgr(syllabusId, sectionId, topicId) {
  const input = document.getElementById(`smst-new-${topicId}`);
  const name  = input?.value.trim();
  if (!name) { showToast("Enter a subtopic name", true); input?.focus(); return; }
  const sec   = SYLLABUS_DATA[syllabusId]?.sections.find(s => s.id === sectionId);
  const topic = sec?.topics.find(t => t.id === topicId);
  if (!topic) return;
  topic.subtopics.push(name);
  saveSyllabi();
  input.value = "";
  reRenderSubtopicsContainer(syllabusId, sectionId, topicId);
  rebuildSyllabusTab(syllabusId);
  showToast("Subtopic added!");
}

function deleteSubtopicMgr(syllabusId, sectionId, topicId, index) {
  const sec   = SYLLABUS_DATA[syllabusId]?.sections.find(s => s.id === sectionId);
  const topic = sec?.topics.find(t => t.id === topicId);
  if (!topic) return;
  topic.subtopics.splice(index, 1);
  saveSyllabi();
  reRenderSubtopicsContainer(syllabusId, sectionId, topicId);
  rebuildSyllabusTab(syllabusId);
}

function reRenderSubtopicsContainer(syllabusId, sectionId, topicId) {
  const container = document.getElementById(`smts-${topicId}`);
  if (!container) return;
  const sec   = SYLLABUS_DATA[syllabusId]?.sections.find(s => s.id === sectionId);
  const topic = sec?.topics.find(t => t.id === topicId);
  if (!topic) return;
  container.innerHTML = topic.subtopics.length
    ? topic.subtopics.map((st, i) => `
        <span class="syl-mgr-subtopic-tag">
          ${escHtml(st)}
          <button class="res-del" onclick="deleteSubtopicMgr('${syllabusId}','${sectionId}','${topicId}',${i})" title="Remove">×</button>
        </span>`).join("")
    : `<span style="font-size:0.75rem;color:#c1c7d0;font-style:italic">No subtopics yet</span>`;
}

// ─── TAB REBUILD HELPER ───────────────────────────────────────────────────────

function rebuildSyllabusTab(syllabusId) {
  const syl = SYLLABUS_DATA[syllabusId];
  if (!syl) return;
  let el = document.getElementById(`tab-${syllabusId}`);
  if (!el) {
    el = document.createElement("div");
    el.id = `tab-${syllabusId}`;
    el.className = "tab-pane";
    document.getElementById("tab-content").appendChild(el);
  }
  el.innerHTML = buildSyllabusHTML(syl);
  refreshNavBadges();
  updateDashboardIfVisible();
}
