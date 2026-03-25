# Study Tracker — localStorage → Database Migration Analysis

> Analysis date: 2026-03-24
> Author: Claude Code
> Scope: Move study-tracker state from browser `localStorage` to Postgres (Supabase) via Prisma, keyed by authenticated user ID.

---

## 1. Current localStorage Structure

The study-tracker stores **8 keys** in `localStorage`. All reads/writes go through `lib/studyTrackerStorage.js`. There is **no server involvement today**.

| localStorage key | Type | Description |
|---|---|---|
| `qa_tracker_syllabi` | `Record<string, Syllabus>` | Full syllabus trees (default + user-custom) |
| `qa_tracker_progress` | `Record<topicId, { done, notes?, doneAt? }>` | Per-topic completion state |
| `qa_tracker_custom` | `Record<string, any>` | User-edited topic overrides |
| `qa_tracker_log` | `Array<LogEntry>` | Append-only activity log |
| `qa_tracker_subtopics` | `Record<topicId, Record<subtopicTitle, boolean>>` | Subtopic checked state |
| `qa_tracker_daily` | `Record<dateStr, Task[]>` | Daily tasks per date |
| `qa_tracker_habits` | `Habit[]` | Habit definitions |
| `qa_tracker_habit_log` | `Record<dateStr, Record<habitId, boolean>>` | Habit completion log |

### 1.1 Detailed Shape of Each Key

#### `qa_tracker_syllabi`
```json
{
  "manual": {
    "id": "manual",
    "label": "Manual Testing",
    "icon": "🧪",
    "color": "#2563eb",
    "sections": [
      {
        "id": "manual-s1",
        "title": "Fundamentals of Software Testing",
        "topics": [
          {
            "id": "m-t1",
            "title": "What is Software Testing?",
            "subtopics": ["Definition & Goals", "Verification vs Validation"],
            "resources": []
          }
        ]
      }
    ]
  },
  "automation": { ... },
  "playwright": { ... },
  "api": { ... }
}
```

#### `qa_tracker_progress`
```json
{
  "m-t1": { "done": true, "notes": "Read ISTQB chapter 1", "doneAt": "2026-03-20" },
  "m-t5": { "done": false }
}
```

#### `qa_tracker_subtopics`
```json
{
  "m-t1": {
    "Definition & Goals": true,
    "Verification vs Validation": false
  }
}
```

#### `qa_tracker_daily`
```json
{
  "2026-03-24": [
    { "id": "task-uuid", "title": "Practice Selenium", "done": false, "timeMin": 30 }
  ]
}
```

#### `qa_tracker_habits`
```json
[
  {
    "id": "habit-uuid",
    "title": "Practice automation daily",
    "timeMin": 45,
    "recurrence": "daily",
    "customDays": [],
    "startDate": "2026-03-01",
    "endDate": "2026-04-01",
    "active": true
  }
]
```

#### `qa_tracker_habit_log`
```json
{
  "2026-03-24": {
    "habit-uuid": true
  }
}
```

#### `qa_tracker_log`
```json
[
  { "date": "2026-03-20", "topicId": "m-t1", "action": "completed", "syllabusId": "manual" }
]
```

---

## 2. Proposed Prisma Schema

The goal is to store all 8 localStorage structures per user. The design principle: **store each concern as its own model** so they can be queried and updated independently, rather than one giant JSONB blob per user.

```prisma
// ── Syllabus trees (user's custom overrides of the default syllabi) ──
model UserSyllabus {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  syllabusId String                          // e.g. "manual", "automation"
  data       Json                            // full syllabus object (sections + topics)
  updatedAt  DateTime @updatedAt

  @@unique([userId, syllabusId])
}

// ── Topic progress ──
model TopicProgress {
  id         String    @id @default(cuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId    String                          // e.g. "m-t1"
  done       Boolean   @default(false)
  notes      String?
  doneAt     DateTime?
  updatedAt  DateTime  @updatedAt

  @@unique([userId, topicId])
}

// ── Subtopic checked state ──
model SubtopicProgress {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId      String
  subtopicTitle String
  checked      Boolean  @default(false)
  updatedAt    DateTime @updatedAt

  @@unique([userId, topicId, subtopicTitle])
}

// ── Daily tasks ──
model DailyTask {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date      String                           // "YYYY-MM-DD"
  taskId    String                           // client-generated uuid
  title     String
  done      Boolean  @default(false)
  timeMin   Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, taskId])
  @@index([userId, date])
}

// ── Habit definitions ──
model Habit {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  habitId     String                         // client-generated uuid
  title       String
  timeMin     Int         @default(0)
  recurrence  String                         // "daily" | "weekdays" | "weekends" | "custom"
  customDays  Int[]                          // 0=Sun..6=Sat
  startDate   String
  endDate     String?
  active      Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  logs        HabitLog[]

  @@unique([userId, habitId])
}

// ── Habit completion log ──
model HabitLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  habitId   String
  habit     Habit    @relation(fields: [habitId], references: [id], onDelete: Cascade)
  date      String                           // "YYYY-MM-DD"
  done      Boolean  @default(false)
  updatedAt DateTime @updatedAt

  @@unique([userId, habitId, date])
  @@index([userId, date])
}

// ── Activity log ──
model ActivityLog {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date       String
  topicId    String?
  syllabusId String?
  action     String                          // "completed", "uncompleted", "note_added"
  createdAt  DateTime @default(now())

  @@index([userId, date])
}
```

**Add relations to existing `User` model:**
```prisma
model User {
  // ... existing fields ...
  syllabi         UserSyllabus[]
  topicProgress   TopicProgress[]
  subtopicProgress SubtopicProgress[]
  dailyTasks      DailyTask[]
  habits          Habit[]
  habitLogs       HabitLog[]
  activityLogs    ActivityLog[]
}
```

---

## 3. localStorage → Database Sync Strategy

### 3.1 Recommended Approach: Lazy Sync on Login

The smoothest user experience that avoids breaking the current system:

```
User visits /study-tracker (not logged in)
  → Works exactly as today (localStorage only)
  → No change for anonymous users

User logs in
  → Check if DB has any data for this userId
  → If DB is EMPTY → upload all localStorage data to DB (one-time migration)
  → If DB has DATA → merge (DB wins for conflicts, prefer more recent updatedAt)
  → From this point: ALL reads/writes go to DB (localStorage becomes a cache/fallback)
```

### 3.2 Sync Flow Diagram

```
loadAllState() (current)
       ↓
  [is user logged in?]
       │
  NO   │   YES
  ↓    │    ↓
local  │  fetchFromDB(userId)
only   │    ↓
       │  [DB has data?]
       │    │
       │  NO│  YES
       │  ↓ │   ↓
       │  pushLocalToDb()  mergeLocalAndDb()
       │    ↓
       │  use DB state
       │    ↓
       └──→ render StudyTrackerApp
```

### 3.3 Write Strategy

Once synced, all mutations must **write to both DB and localStorage** (localStorage = offline cache):

```js
// Current pattern (localStorage only):
updateState("progress", newProgress);  // calls saveKey()

// New pattern (dual-write):
updateState("progress", newProgress);  // still saves to localStorage
await syncToDb("progress", newProgress, userId);  // also writes to DB
```

For debounced/batched writes (to avoid hitting the API on every keystroke):
- **Daily tasks / habit log**: write immediately (user action)
- **Topic progress / subtopics**: debounce 1s
- **Syllabi**: debounce 2s (large payload)

---

## 4. API Routes Needed

| Method | Route | Body | Description |
|---|---|---|---|
| `GET` | `/api/tracker/state` | — | Fetch full tracker state for session user |
| `POST` | `/api/tracker/sync` | `{ fullState }` | Bulk upsert all keys (migration / full sync) |
| `PATCH` | `/api/tracker/progress` | `{ topicId, done, notes, doneAt }` | Update single topic |
| `PATCH` | `/api/tracker/subtopics` | `{ topicId, subtopicTitle, checked }` | Update single subtopic |
| `POST` | `/api/tracker/daily` | `{ date, task }` | Add/update daily task |
| `DELETE` | `/api/tracker/daily/[taskId]` | — | Delete daily task |
| `POST` | `/api/tracker/habits` | `{ habit }` | Create/update habit |
| `DELETE` | `/api/tracker/habits/[habitId]` | — | Delete habit |
| `PATCH` | `/api/tracker/habit-log` | `{ habitId, date, done }` | Toggle habit completion |
| `PUT` | `/api/tracker/syllabus/[syllabusId]` | `{ data }` | Save custom syllabus |
| `POST` | `/api/tracker/log` | `{ entry }` | Append activity log entry |

All routes authenticate via `auth.api.getSession()` — same pattern as `/api/resources`.

---

## 5. Impact on Existing UI Rendering

### 5.1 `StudyTrackerApp.jsx` — Central State

Current: `setState(loadAllState())` on mount (reads localStorage).

Impact after migration:
- `loadAllState()` must become async: first check login, then fetch from DB or fall back to localStorage.
- The `state` object shape **does not change** — all child components receive the same props.
- No changes needed in `DashboardView`, `DailyTrackerView`, `SyllabusView`, `SyllabusManagerView`.

```js
// New mount sequence
useEffect(() => {
  async function init() {
    const localState = loadAllState();   // always load local first (instant)
    setState(localState);                // render immediately (no loading flash)

    if (user) {
      const dbState = await fetchTrackerState(user.id);
      if (dbState) {
        const merged = mergeStates(localState, dbState);
        setState(merged);
        // Mirror back to localStorage so offline works
        Object.entries(merged).forEach(([k, v]) => saveKey(k, v));
      } else {
        // First login — push local to DB silently
        await pushStateToDB(localState, user.id);
      }
    }
  }
  init();
}, [user]);
```

### 5.2 `updateState()` — Mutation Hook

Current: writes to localStorage only.

Impact: needs a second async write to DB. Wrap with a `syncPatch()` helper so existing call sites don't change signature:

```js
const updateState = useCallback((key, value) => {
  setState((prev) => {
    const next = { ...prev, [key]: value };
    saveKey(key, value);           // localStorage (unchanged)
    if (user) syncPatch(key, value, user.id);  // new: DB write
    return next;
  });
}, [user]);
```

### 5.3 Export/Import

Current export (`handleExport`) serialises `state` to JSON — **no change needed**, it already exports the full state object.

Import (`handleImport`) currently writes to localStorage and resets state — after migration, it should also call the bulk sync API to push the imported data to DB.

### 5.4 `handleClearAll`

Currently removes all localStorage keys. After migration, it must also call `DELETE /api/tracker/state` to wipe the user's DB rows.

### 5.5 Dashboard Charts

`DashboardView` reads `state.syllabi`, `state.progress`, `state.daily`, `state.habits`, `state.habitLog` — all passed as props from `StudyTrackerApp`. **No changes needed** in dashboard as long as the state shape is preserved.

### 5.6 Anonymous Users

Users who are NOT logged in continue using localStorage exactly as today. The migration is **additive and opt-in** — it activates only when a session is present.

---

## 6. Rendering by userId

Once data is in the DB, fetching and rendering for any userId is straightforward:

```js
// GET /api/tracker/state
export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return unauthorized();

  const [progress, subtopics, dailyTasks, habits, habitLogs, syllabi, logs] =
    await Promise.all([
      prisma.topicProgress.findMany({ where: { userId: session.user.id } }),
      prisma.subtopicProgress.findMany({ where: { userId: session.user.id } }),
      prisma.dailyTask.findMany({ where: { userId: session.user.id } }),
      prisma.habit.findMany({ where: { userId: session.user.id } }),
      prisma.habitLog.findMany({ where: { userId: session.user.id } }),
      prisma.userSyllabus.findMany({ where: { userId: session.user.id } }),
      prisma.activityLog.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 500 }),
    ]);

  // Reshape to match the localStorage state object shape
  return NextResponse.json(reshapeToState({ progress, subtopics, dailyTasks, habits, habitLogs, syllabi, logs }));
}
```

The `reshapeToState()` function converts flat DB rows back into the nested objects expected by the UI:

```js
function reshapeToState({ progress, subtopics, dailyTasks, habits, habitLogs, syllabi, logs }) {
  return {
    progress:  Object.fromEntries(progress.map(p => [p.topicId, { done: p.done, notes: p.notes, doneAt: p.doneAt }])),
    subtopics: subtopics.reduce((acc, s) => {
      acc[s.topicId] = acc[s.topicId] || {};
      acc[s.topicId][s.subtopicTitle] = s.checked;
      return acc;
    }, {}),
    daily: dailyTasks.reduce((acc, t) => {
      acc[t.date] = acc[t.date] || [];
      acc[t.date].push({ id: t.taskId, title: t.title, done: t.done, timeMin: t.timeMin });
      return acc;
    }, {}),
    habits: habits.map(h => ({ id: h.habitId, title: h.title, timeMin: h.timeMin, recurrence: h.recurrence, customDays: h.customDays, startDate: h.startDate, endDate: h.endDate, active: h.active })),
    habitLog: habitLogs.reduce((acc, l) => {
      acc[l.date] = acc[l.date] || {};
      acc[l.date][l.habitId] = l.done;
      return acc;
    }, {}),
    syllabi: syllabi.length
      ? Object.fromEntries(syllabi.map(s => [s.syllabusId, s.data]))
      : null,  // null = use DEFAULT_SYLLABUS_DATA
    log: logs.map(l => ({ date: l.date, topicId: l.topicId, syllabusId: l.syllabusId, action: l.action })),
    custom: {},  // retained in localStorage only (low-value, large)
  };
}
```

---

## 7. Implementation Order (Recommended)

| Phase | Work | Risk |
|---|---|---|
| **1** | Add Prisma models (schema + migration) | Low |
| **2** | `GET /api/tracker/state` + `POST /api/tracker/sync` (bulk) | Low |
| **3** | `reshapeToState()` utility + `pushStateToDB()` | Low |
| **4** | Update `StudyTrackerApp` mount to fetch DB on login | Medium — test merge logic |
| **5** | Dual-write in `updateState()` via granular PATCH routes | Medium |
| **6** | Update `handleClearAll` + `handleImport` | Low |
| **7** | Remove localStorage dependency for logged-in users | High — thorough testing needed |

---

## 8. Key Design Decisions

| Decision | Rationale |
|---|---|
| Normalised rows (not JSONB blob) | Individual records can be queried, filtered, and patched without deserialising the whole state |
| Preserve `topicId` / `habitId` as client strings | Avoids re-mapping IDs; the default syllabus topic IDs (e.g. `m-t1`) are stable |
| localStorage remains as offline cache | Anonymous users unaffected; logged-in users get instant renders before DB responds |
| Bulk sync only on first login | Avoids conflicts and keeps migration one-way |
| `UserSyllabus` stores custom syllabus as `Json` | Syllabus structure is deeply nested and rarely queried field-by-field; JSONB is appropriate here |
| Separate `HabitLog` model (not embedded in `Habit`) | Enables date-range queries without loading all habit data |
