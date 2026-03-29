# QA Playground — API Overview
> Plain-English explanation of every API route, how sync works, what happens on login, and security gaps.

---

## Table of Contents
1. [How Authentication Works](#1-how-authentication-works)
2. [How the Sync System Works](#2-how-the-sync-system-works)
3. [Tracker API Routes — What Each One Does](#3-tracker-api-routes)
4. [Resources API](#4-resources-api)
5. [The Dual-Write Pattern — Sync vs Individual APIs](#5-the-dual-write-pattern)
6. [First Login Flow (Step-by-Step)](#6-first-login-flow)
7. [Security Analysis](#7-security-analysis)
8. [Missing Features & Gaps](#8-missing-features--gaps)

---

## 1. How Authentication Works

### The Library: Better-Auth
We use [Better-Auth](https://better-auth.com) — a session-based auth library. It handles login, signup, session creation, and session verification. Our config is in `lib/auth.js`.

### What happens when a user signs up?
1. User hits `/signup` → form POSTs to `/api/auth/[...all]` (Better-Auth catch-all)
2. Better-Auth hashes the password using bcrypt internally
3. A `User` row is created in PostgreSQL
4. A `Session` row is created — contains a random token, expiry (7 days), userId
5. A cookie (`better-auth.session_token`) is set in the browser

### What happens when a user logs in?
1. User hits `/login` → form POSTs to `/api/auth/[...all]`
2. Better-Auth looks up the user by email, verifies the bcrypt hash
3. If valid → creates a new `Session` row + sets cookie
4. Session token expires in **7 days**, cookie refreshes daily

### What happens on every API request?
Every tracker route does this at the top:
```js
const session = await auth.api.getSession({ headers: request.headers });
const userId = session?.user?.id;
if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```
Better-Auth reads the session cookie from the request headers, looks up the `Session` table in DB, and returns the user. If no session or expired → 401.

### Role field
The `User` model has a `role` field: `USER` (default) or `ADMIN`. The role **cannot** be set during signup (it's `input: false` in auth config) — only a DB admin can promote someone to ADMIN. Admin routes are protected but there's no middleware file present in the codebase source (only in `.next/` build output).

---

## 2. How the Sync System Works

### The Big Picture

The Study Tracker has two storage layers:
- **localStorage** — always used, works without login, instant
- **PostgreSQL (via Prisma)** — only for logged-in users, survives across devices

The state shape is the same in both:
```
{
  daily:    { "2026-03-29": [{ id, title, done, timeMin, reason }] }
  habits:   [{ id, title, timeMin, recurrence, startDate, ... }]
  habitLog: { "2026-03-29": { "h-123": true } }
  progress: { "m-t1": { done: true, doneAt: "2026-03-01" } }
  subtopics: { ... }
  syllabi:  { ... }
  log:      [...]
}
```

### The Sync API: `POST /api/tracker/sync`

This is the **main persistence route**. It accepts any combination of state keys and upserts them into the DB.

```
POST /api/tracker/sync
Body: { fullState: { daily?, habits?, habitLog?, progress?, ... } }
```

It handles all 7 data types in a single Prisma transaction:
- syllabi → `UserSyllabus` table
- progress → `TopicProgress` table
- subtopics → `SubtopicProgress` table
- daily tasks → `DailyTask` table
- habits → `Habit` table
- habitLog → `HabitLog` table
- activity log → `ActivityLog` table

**Important:** sync only ever UPSERTS — it never deletes. If you remove a task in localStorage and sync runs, the task still exists in DB. This is why explicit DELETE API calls are needed for deletions.

### When does sync fire?

`StudyTrackerProvider` wraps `updateState()` with a `syncToDb()` call:

```
User action (check habit, add task, etc.)
  → updateState("daily", newValue)
    → setState() — React UI updates instantly
    → saveKey("daily", newValue) — localStorage updated instantly
    → syncToDb("daily", newValue) — POST /api/tracker/sync (if logged in)
```

Timing per key:
| Key | Sync delay |
|---|---|
| `daily`, `habits`, `habitLog` | **Immediate** (0ms) |
| `progress`, `subtopics` | 1 second debounce |
| `syllabi` | 2 second debounce |

---

## 3. Tracker API Routes

### `GET /api/tracker/state`
**When is it used?** Once on app load for logged-in users.

Fetches the full tracker state from DB in 7 parallel queries, then reshapes it via `reshapeToState()` into the same shape as localStorage. The result is then merged with the local state in `StudyTrackerProvider`.

---

### `POST /api/tracker/sync`
**When is it used?** On every `updateState()` call (with debouncing for heavy keys). Also used for first-login migration and import.

Accepts `{ fullState: { ... } }` and bulk-upserts whatever keys are provided. All writes happen in a single Prisma `$transaction`.

**Does NOT delete.** Only creates or updates rows.

---

### `GET /api/tracker/daily`
**When is it used?** Not called from the UI currently — the main load goes through `/api/tracker/state`. This is more of a standalone endpoint.

Returns daily tasks, habits, and habit logs shaped for the frontend.

### `POST /api/tracker/daily`
**When is it used?** Not used from the UI currently. Adding a task goes through `/api/tracker/sync`.

Upserts a single daily task by `taskId`.

---

### `DELETE /api/tracker/daily/[taskId]`
**When is it used?** When a user deletes a todo from **Pending Todos** tab (if logged in).

Permanently removes a task from DB by its client-generated `taskId`. Without calling this, a deleted task would come back on the next page load because sync only upserts.

> **Gap:** When a user deletes a task from the **Daily Tasks tab**, this DELETE endpoint is NOT called. Only `updateState()` runs, meaning the task still exists in DB and will reappear after refresh for logged-in users.

---

### `POST /api/tracker/habits`
**When is it used?** When a user **edits** an existing habit in the Recurring Habits tab.

Upserts a single habit. Called directly (not via sync) from `DailyTrackerView.updateHabit()`.

### `DELETE /api/tracker/habits`
**When is it used?** When a user deletes a habit in the Recurring Habits tab.

Deletes a habit by `habitId`. HabitLog rows cascade-delete automatically via the Prisma schema `onDelete: Cascade`.

---

### `PATCH /api/tracker/habit-log`
**When is it used?** Not called from the UI currently. Toggling a habit checkbox goes through `/api/tracker/sync`.

Upserts a single habit log entry (done/undone for a specific date).

---

### `GET /api/tracker/pending-todos`
**When is it used?** Available but not called from the UI (UI reads from `state.daily` directly).

Returns all incomplete tasks from DB for the logged-in user, sorted date descending.

### `PATCH /api/tracker/pending-todos`
**When is it used?** Available but not called from the UI (UI uses `updateState()` instead).

Updates a task's `reason` or `done` status by `taskId`.

---

### `DELETE /api/tracker/clear`
**When is it used?** When the user clicks "Clear Data" in the Daily Tracker header.

Deletes ALL `DailyTask`, `Habit`, and `HabitLog` rows for the user in a single transaction.

---

### `DELETE /api/tracker/state`
**When is it used?** Not wired to any UI button currently (may be leftover or for admin use).

Nukes everything — progress, subtopics, syllabi, tasks, habits, logs — for the user.

---

### `PATCH /api/tracker/progress`
**When is it used?** When a user marks a syllabus topic as done. Called directly alongside `updateState()`.

Updates a single `TopicProgress` row.

### `PATCH /api/tracker/subtopics`
**When is it used?** When a user checks/unchecks a subtopic.

Updates a single `SubtopicProgress` row.

### `PUT /api/tracker/syllabus/[syllabusId]`
**When is it used?** When a user saves changes to a custom syllabus.

Upserts a single `UserSyllabus` row.

### `POST /api/tracker/log`
**When is it used?** When an activity log entry is appended.

Creates a single `ActivityLog` row.

---

## 4. Resources API

### `GET /api/resources`
Returns saved resources (articles, videos, courses, etc.) for the session user. Supports `?search=`, `?type=`, `?tag=` query filters.

**Auth:** Session only (no API key support on GET — inconsistency with POST).

### `POST /api/resources`
Creates a new resource. `resourceType`, `title`, and `url` are required.

**Auth:** Dual — accepts either:
- **Bearer token** in `Authorization` header (for Chrome extension use)
- **Session cookie** (for website use)

**CORS headers** are set to allow `*` origins — needed for Chrome extension.

---

## 5. The Dual-Write Pattern

This is the most important thing to understand about how the app works.

### For most actions → sync API only
When a user does something (toggle a habit, mark progress, etc.), the app:
1. Updates React state immediately
2. Saves to localStorage immediately
3. POSTs to `/api/tracker/sync` with just the changed key

There is **no dedicated "add task" API call**. Everything goes through sync.

### Exceptions — actions that also call individual APIs

| Action | What happens |
|---|---|
| Edit a habit | `updateState()` + `POST /api/tracker/habits` |
| Delete a habit | `updateState()` + `DELETE /api/tracker/habits` |
| Delete todo (Pending Todos tab) | `updateState()` + `DELETE /api/tracker/daily/[taskId]` |

### Why the mixed approach?

- **Sync** is simple and works for bulk operations, first login, import/export
- **Individual APIs** are needed for **deletions** because sync never deletes. They're also used for habits because the habits tab has an explicit edit/save UX (not just a toggle)

### What the UI does NOT call individual APIs for (but should)

| Action | Current | Gap |
|---|---|---|
| Add new daily task | sync only | No POST to `/api/tracker/daily` |
| Delete task from Daily Tasks tab | sync only (no delete) | Should call `DELETE /api/tracker/daily/[taskId]` |
| Toggle habit done | sync only | No PATCH to `/api/tracker/habit-log` |

These gaps mean that **for logged-in users, deletions from the Daily Tasks tab will reappear after refresh** because the DB still has those rows.

---

## 6. First Login Flow

When a logged-in user loads the app for the first time (DB is empty):

```
1. Load localStorage → render UI instantly
2. Fetch GET /api/tracker/state
3. DB returns empty state (no rows)
4. hasDbData = false → trigger first-sync
5. POST /api/tracker/sync with full localStorage state
6. DB is now seeded with the user's local history
```

When a logged-in user loads on a subsequent visit:

```
1. Load localStorage → render UI instantly
2. Fetch GET /api/tracker/state
3. DB returns full state
4. mergeStates(localStorage, dbState) runs
5. DB wins for most keys (progress, daily, habitLog, subtopics)
6. Habits are merged by ID (local + DB unioned, local fields win on conflict)
7. Final merged state saved back to localStorage and React state
```

---

## 7. Security Analysis

### What is working well

| Area | Status |
|---|---|
| Password hashing | bcrypt via Better-Auth — good |
| Session tokens | Cryptographically random, stored in DB, 7-day expiry |
| Session cookie | httpOnly (managed by Better-Auth) — JS can't read it |
| Role protection | `role: { input: false }` prevents client from setting ADMIN |
| Per-user data isolation | Every DB query is scoped by `userId` from session — users cannot access other users' data |
| API key for resources | Separate Bearer token flow for Chrome extension — doesn't expose session cookies |

### Gaps and risks

#### 1. No email verification
When a user signs up, their email is stored but `emailVerified` stays `false` forever. Better-Auth supports email verification with a confirmation link, but `emailAndPassword.requireEmailVerification` is not enabled. This means:
- Anyone can create an account with a fake email
- Password reset via email is not possible

**Fix needed:** Enable `requireEmailVerification: true` in `lib/auth.js` and wire up an email provider (Resend, SendGrid, etc.). Better-Auth has a built-in `sendVerificationEmail` hook.

#### 2. No OTP / two-factor authentication
There is no 2FA. Better-Auth has a `twoFactor` plugin but it's not configured.

**Fix needed (optional):** Add the `twoFactor()` plugin to `lib/auth.js` if account security is a priority.

#### 3. No password reset flow
Without email verification enabled, there is no "forgot password" feature. Users who lose their password cannot recover their account.

#### 4. No rate limiting on auth endpoints
`/api/auth/[...all]` has no rate limiting. An attacker could brute-force passwords by hammering the login endpoint. Better-Auth supports rate limiting via plugins, or it can be handled at the Vercel edge/middleware level.

**Fix needed:** Add IP-based rate limiting to auth endpoints (max 5 failed attempts per minute per IP).

#### 5. Sync endpoint accepts arbitrary JSON
`POST /api/tracker/sync` accepts `{ fullState: { ... } }` and upserts whatever is provided with no field-level validation. A malicious request with very large arrays or deeply nested data could be expensive. The only protection is `userId` scoping.

**Fix needed (low priority):** Add basic size/type validation on `fullState` keys.

#### 6. CORS on resources API is wide open
`Access-Control-Allow-Origin: *` on `/api/resources` POST means any website could make authenticated POST requests if they somehow obtained a Bearer token. For session-based requests this is mitigated by `SameSite` cookie policy, but API key holders should be aware.

#### 7. API key has no expiry and no scoping
`ApiKey` model has no `expiresAt` and no permission scope field. A leaked API key would have permanent, unlimited access to the resources endpoint for that user.

**Fix needed:** Add `expiresAt DateTime?` and optionally a `scope String[]` to `ApiKey`.

#### 8. No middleware.js in source
The `middleware.js` file (which protects `/admin` routes) is not visible in the project source — only in the `.next/` build output. This means it may not be committed to the repo. If missing from source, the `/admin` route would be unprotected in a fresh deploy.

**Fix needed:** Verify `middleware.js` exists at the project root and is committed to git.

---

## 8. Missing Features & Gaps

### Email / OTP Confirmation

Better-Auth has everything needed but it's not turned on. Here's what's required to enable it:

**Step 1 — Enable in `lib/auth.js`:**
```js
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true,   // ← add this
  sendVerificationEmail: async ({ user, url }) => {
    // call your email provider here
    await sendEmail({ to: user.email, subject: "Verify your email", html: `<a href="${url}">Verify</a>` });
  },
},
```

**Step 2 — Add an email provider** (recommended: [Resend](https://resend.com) — free tier, simple API):
```js
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// inside sendVerificationEmail:
await resend.emails.send({ from: "noreply@qaplayground.com", to: user.email, ... });
```

**Step 3 — Environment variable:**
```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

**Step 4 — Password reset:**
Better-Auth also has `sendResetPasswordEmail` — add alongside `sendVerificationEmail`.

### Habit delete from Daily Tasks tab doesn't call DB

When a task is deleted from the Daily Tasks tab, only localStorage is updated. The DB row stays. On next login + refresh, the task comes back. The fix is to call `DELETE /api/tracker/daily/[taskId]` in `DailyTrackerView.deleteTask()` (same pattern already done for Pending Todos tab).

### No pagination on state endpoint

`GET /api/tracker/state` fetches ALL daily tasks ever for a user. If someone has 2 years of daily tasks, that's a lot of rows. Activity logs are capped at 500 but daily tasks are not.

**Fix needed (future):** Add date-range filtering — e.g., only fetch last 90 days of daily tasks on load.

---

## Quick Reference Table

| Route | Method | Auth | Used from UI? | Purpose |
|---|---|---|---|---|
| `/api/auth/[...all]` | ALL | — | Yes | Login, signup, session management |
| `/api/tracker/state` | GET | Session | On load | Fetch full DB state |
| `/api/tracker/state` | DELETE | Session | No | Wipe all user data |
| `/api/tracker/sync` | POST | Session | Every update | Bulk upsert any state keys |
| `/api/tracker/daily` | GET | Session | No | Fetch tasks+habits+logs |
| `/api/tracker/daily` | POST | Session | No | Upsert single task |
| `/api/tracker/daily/[taskId]` | DELETE | Session | Pending Todos only | Delete task from DB |
| `/api/tracker/habits` | POST | Session | Edit habit | Upsert single habit |
| `/api/tracker/habits` | DELETE | Session | Delete habit | Delete habit + cascade logs |
| `/api/tracker/habit-log` | PATCH | Session | No | Toggle habit log entry |
| `/api/tracker/pending-todos` | GET | Session | No | Fetch all undone tasks |
| `/api/tracker/pending-todos` | PATCH | Session | No | Update reason/done on task |
| `/api/tracker/clear` | DELETE | Session | Clear Data button | Wipe tasks+habits+logs |
| `/api/tracker/progress` | PATCH | Session | Yes | Update topic progress |
| `/api/tracker/subtopics` | PATCH | Session | Yes | Update subtopic check |
| `/api/tracker/syllabus/[id]` | PUT | Session | Yes | Save custom syllabus |
| `/api/tracker/log` | POST | Session | Yes | Append activity log |
| `/api/resources` | GET | Session | Yes | Fetch saved resources |
| `/api/resources` | POST | Session or Bearer | Yes + Chrome ext | Save new resource |
| `/api/resources/[id]` | GET/PUT/DELETE | Session | Yes | Single resource CRUD |
