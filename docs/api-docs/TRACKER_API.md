# Study Tracker API — Quick Reference

> All routes require a valid session cookie (set by logging in via `/api/auth/sign-in/email`).
> All routes return `401` if unauthenticated.

Import `tracker-api.postman_collection.json` into Postman to run everything interactively.

---

## Auth (run first)

| Method | Route | Body |
|---|---|---|
| POST | `/api/auth/sign-in/email` | `{ email, password }` |

Sets the session cookie automatically. All tracker routes depend on it.

---

## Tracker State

### GET `/api/tracker/state`
Fetch full tracker state for the session user.

**Response `200`**
```json
{
  "progress":  { "m-t1": { "done": true, "notes": "...", "doneAt": "2026-03-25" } },
  "subtopics": { "m-t1": { "Definition & Goals": true } },
  "daily":     { "2026-03-25": [{ "id": "1774414905686", "title": "...", "done": false, "timeMin": 30 }] },
  "habits":    [{ "id": "habit-uuid", "title": "...", "recurrence": "daily", "startDate": "2026-03-01", "active": true }],
  "habitLog":  { "2026-03-25": { "habit-uuid": true } },
  "syllabi":   null,
  "log":       [{ "date": "2026-03-25", "topicId": "m-t1", "syllabusId": "manual", "action": "completed" }],
  "custom":    {}
}
```
> `syllabi: null` means "use DEFAULT_SYLLABUS_DATA" — client handles this.

---

### DELETE `/api/tracker/state`
Wipe **all** tracker data for the session user.
Deletes: TopicProgress, SubtopicProgress, DailyTask, Habit, HabitLog, UserSyllabus, ActivityLog.

**Response `204`** — no body.

---

## Bulk Sync

### POST `/api/tracker/sync`
Bulk upsert any supplied keys. All keys are optional — send only what changed.

**Body**
```json
{
  "fullState": {
    "progress":  { "m-t1": { "done": true, "notes": "...", "doneAt": "2026-03-25" } },
    "subtopics": { "m-t1": { "Definition & Goals": true } },
    "daily":     { "2026-03-25": [{ "id": "1774414905686", "title": "...", "done": false, "timeMin": 30 }] },
    "habits":    [{ "id": "habit-uuid", "title": "...", "timeMin": 45, "recurrence": "daily", "customDays": [], "startDate": "2026-03-01", "active": true }],
    "habitLog":  { "2026-03-25": { "habit-uuid": true } },
    "syllabi":   { "manual": { <full syllabus object> } },
    "log":       [{ "date": "2026-03-25", "topicId": "m-t1", "syllabusId": "manual", "action": "completed" }]
  }
}
```

**Notes**
- `task.id` can be a string or number — coerced to `String` internally.
- `habitLog` needs habits present in same payload **or** already in DB for ID resolution.
- Activity log entries are appended — no dedup.

**Response `200`** `{ "ok": true }`

---

## Progress

### PATCH `/api/tracker/progress`
Update a single topic's completion state.

**Body**
```json
{
  "topicId": "m-t1",
  "done": true,
  "notes": "Read ISTQB chapter 1",
  "doneAt": "2026-03-25"
}
```
Required: `topicId`. All others optional.

**Response `200`** `{ "ok": true }`

---

## Subtopics

### PATCH `/api/tracker/subtopics`
Update a single subtopic's checked state.

**Body**
```json
{
  "topicId": "m-t1",
  "subtopicTitle": "Definition & Goals",
  "checked": true
}
```
Required: `topicId`, `subtopicTitle`.

**Response `200`** `{ "ok": true }`

---

## Daily Tasks

### POST `/api/tracker/daily`
Add or update a daily task.

**Body**
```json
{
  "date": "2026-03-25",
  "task": {
    "id": "1774414905686",
    "title": "Practice Selenium locators",
    "done": false,
    "timeMin": 45
  }
}
```
Required: `date`, `task.id`. `task.id` can be string or number.

**Response `200`** `{ "ok": true }`

---

### DELETE `/api/tracker/daily/:taskId`
Delete a daily task by its client `taskId`.

```
DELETE /api/tracker/daily/1774414905686
```

**Response `204`** — no body. Returns 204 even if task doesn't exist.

---

## Habits

### POST `/api/tracker/habits`
Create or update a habit.

**Body**
```json
{
  "habit": {
    "id": "habit-uuid-abc123",
    "title": "Practice automation daily",
    "timeMin": 45,
    "recurrence": "daily",
    "customDays": [],
    "startDate": "2026-03-01",
    "endDate": null,
    "active": true
  }
}
```
Required: `habit.id`.
`recurrence` values: `daily` | `weekdays` | `weekends` | `custom`
`customDays`: array of ints — `[0=Sun, 1=Mon … 6=Sat]`, only used when `recurrence = "custom"`.

**Response `200`** `{ "ok": true }`

---

### DELETE `/api/tracker/habits/:habitId`
Delete a habit by its client `habitId`. Related HabitLog rows are deleted via DB cascade.

```
DELETE /api/tracker/habits/habit-uuid-abc123
```

**Response `204`** — no body.

---

## Habit Log

### PATCH `/api/tracker/habit-log`
Toggle habit completion for a date.

**Body**
```json
{
  "habitId": "habit-uuid-abc123",
  "date": "2026-03-25",
  "done": true
}
```
Required: `habitId` (client UUID, not DB id), `date`.
Returns `404` if the habit doesn't exist in DB — create it first via `POST /api/tracker/habits`.

**Response `200`** `{ "ok": true }`

---

## Syllabus

### PUT `/api/tracker/syllabus/:syllabusId`
Save a custom syllabus tree.

```
PUT /api/tracker/syllabus/manual
```

**Body**
```json
{
  "data": {
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
  }
}
```
`syllabusId` path values in use: `manual`, `automation`, `playwright`, `api` (and any user-created ones).

**Response `200`** `{ "ok": true }`

---

## Activity Log

### POST `/api/tracker/log`
Append a single activity log entry.

**Body**
```json
{
  "entry": {
    "date": "2026-03-25",
    "topicId": "m-t1",
    "syllabusId": "manual",
    "action": "completed"
  }
}
```
Required: `entry.date`, `entry.action`.
`action` values: `completed` | `uncompleted` | `note_added` (or any string).
Append-only — do not call repeatedly for the same event.

**Response `200`** `{ "ok": true }`

---

## Error Reference

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "<field> required" }` | Missing required field in body |
| `401` | `{ "error": "Unauthorized" }` | No valid session cookie |
| `404` | `{ "error": "Habit not found" }` | PATCH habit-log for a habit not in DB |
| `204` | _(no body)_ | Successful DELETE |
| `200` | `{ "ok": true }` | Successful mutation |
