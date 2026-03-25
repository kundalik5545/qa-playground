# Study Tracker DB Migration — Verification Checklist

> Created: 2026-03-25
> Branch: `feat/localstorage-sync`
> Purpose: Manual test cases to verify Phases 1–6 of the localStorage → DB migration are working correctly.
> Run these checks before merging to `master`.

---

## Legend

| Symbol | Meaning                              |
| ------ | ------------------------------------ |
| `[ ]`  | Not tested                           |
| `[x]`  | Pass                                 |
| `[f]`  | Fail — note the issue below the item |

---

## Section 1 — Anonymous User (No Regression)

> Goal: Verify logged-out users are completely unaffected.

- [x] **1.1** Visit `/study-tracker` without being logged in. App loads with default syllabus data — no errors in console.
- [x] **1.2** Mark a topic as done in any syllabus. Refresh the page. Topic is still marked done (saved to localStorage).
- [x] **1.3** Add a daily task. Refresh. Task persists.
- [x] **1.4** Add a habit. Refresh. Habit persists.
- [x] **1.5** Open DevTools → Network. Confirm **no calls to `/api/tracker/*`** are made for anonymous users.
- [x] **1.6** Open DevTools → Application → localStorage. Confirm `qa_tracker_*` keys are being written on every change.

---

## Section 2 — First Login (localStorage → DB Migration)

> Goal: Verify that existing localStorage data is pushed to DB on first login.
> Pre-condition: Use a **fresh account** that has never logged into Study Tracker before. Have some data in localStorage (mark a topic, add a task, add a habit).

- [ ] **2.1** With data in localStorage (as anonymous user), log in. App loads instantly with existing local data — no flash or blank screen.
- [ ] **2.2** Open DevTools → Network. Confirm `GET /api/tracker/state` is called after login.
- [ ] **2.3** Confirm `POST /api/tracker/sync` is called once (first-login migration) and returns `{ ok: true }`.
- [ ] **2.4** Open Prisma Studio (`npx prisma studio`). Verify the logged-in user's data now appears in: `TopicProgress`, `DailyTask`, `Habit`, `HabitLog`, `SubtopicProgress`, `UserSyllabus` (if syllabus was customised), `ActivityLog` (if any log entries).
- [ ] **2.5** Reload the page. Confirm `POST /api/tracker/sync` is **not** called again (DB already has data — no second migration).

---

## Section 3 — Returning Login (DB → Client Merge)

> Goal: Verify DB data is loaded and merged on subsequent logins.
> Pre-condition: User from Section 2 (has data in DB).

- [ ] **3.1** Log out, clear localStorage (`localStorage.clear()` in console), then log back in.
- [ ] **3.2** App should load with **DB data** (not empty state) — topics, tasks, habits all present.
- [ ] **3.3** Open DevTools → Application → localStorage. Confirm `qa_tracker_*` keys have been re-populated from DB (offline cache mirrored back).
- [ ] **3.4** No `POST /api/tracker/sync` call (DB has data, no first-login migration runs).

---

## Section 4 — Dual-Write (updateState)

> Goal: Every state mutation by a logged-in user reaches the DB.

### 4A — Topic Progress

- [ ] **4A.1** Mark a topic as done. Wait 1 second. Check Prisma Studio → `TopicProgress` — row appears with `done: true`.
- [ ] **4A.2** Unmark the topic. Wait 1 second. `TopicProgress` row updates to `done: false`.
- [ ] **4A.3** Add a note to a topic. Wait 1 second. `TopicProgress` row has the `notes` value.
- [ ] **4A.4** Rapid-click done/undone 5 times quickly. Confirm only **one** DB write fires (debounce at 1s).

### 4B — Subtopics

- [ ] **4B.1** Check a subtopic checkbox. Wait 1 second. `SubtopicProgress` row appears with `checked: true`.
- [ ] **4B.2** Uncheck it. Wait 1 second. `checked` updates to `false`.

### 4C — Daily Tasks

- [ ] **4C.1** Add a daily task. `DailyTask` row appears in DB immediately (no debounce).
- [ ] **4C.2** Mark the task as done. `DailyTask.done` updates to `true` immediately.
- [ ] **4C.3** Delete the task. `DailyTask` row is removed from DB immediately.
- [ ] **4C.4** Task `taskId` stored as a string in DB (not a number) — check `DailyTask.taskId` column in Prisma Studio.

### 4D — Habits

- [ ] **4D.1** Create a habit. `Habit` row appears in DB immediately.
- [ ] **4D.2** Toggle habit completion for today. `HabitLog` row appears with `done: true`.
- [ ] **4D.3** Toggle it off. `HabitLog.done` updates to `false`.
- [ ] **4D.4** Delete a habit. `Habit` row removed from DB. Confirm related `HabitLog` rows are also deleted (cascade).

### 4E — Syllabus

- [ ] **4E.1** Import a custom syllabus via Syllabus Manager. Wait 2 seconds. `UserSyllabus` row appears in DB with the correct `syllabusId` and `data`.
- [ ] **4E.2** Modify a topic title in the syllabus. Wait 2 seconds. `UserSyllabus.data` updates in DB.

---

## Section 5 — Clear All

> Goal: `handleClearAll` wipes both localStorage and DB.

- [ ] **5.1** As a logged-in user with data, click "Clear All" in the Dashboard.
- [ ] **5.2** UI resets to default syllabus, empty progress, empty tasks, empty habits.
- [ ] **5.3** Open DevTools → Network. Confirm `DELETE /api/tracker/state` was called and returned `204`.
- [ ] **5.4** Check Prisma Studio. Confirm all rows are gone for this user: `TopicProgress`, `SubtopicProgress`, `DailyTask`, `Habit`, `HabitLog`, `UserSyllabus`, `ActivityLog`.
- [ ] **5.5** Reload. Data remains empty (DB is clear, not just localStorage).

---

## Section 6 — Import

> Goal: `handleImport` pushes imported data to DB.

- [ ] **6.1** Export current data via Dashboard → Export. Clear all (Section 5). Import the exported file.
- [ ] **6.2** UI restores all previous data correctly.
- [ ] **6.3** Open DevTools → Network. Confirm `POST /api/tracker/sync` was called with the full imported state and returned `{ ok: true }`.
- [ ] **6.4** Check Prisma Studio. Confirm DB rows match the imported data.
- [ ] **6.5** Import a file with numeric task IDs (old format). No `Invalid value — Expected String, provided Int` error. Tasks appear correctly.

---

## Section 7 — API Authentication

> Goal: All `/api/tracker/*` routes reject unauthenticated requests.

- [x] **7.1** In a browser where you are **not logged in**, run in console:
  ```js
  fetch("/api/tracker/state")
    .then((r) => r.json())
    .then(console.log);
  ```
  Expect: `{ error: "Unauthorized" }` with status `401`.
- [ ] **7.2** Same test for `POST /api/tracker/sync` with a dummy body. Expect `401`.
- [ ] **7.3** Same test for `DELETE /api/tracker/state`. Expect `401`.
- [ ] **7.4** Same test for `PATCH /api/tracker/progress`. Expect `401`.

---

## Section 8 — Cross-Device / Multi-Session

> Goal: Data syncs correctly across devices for the same user.

- [ ] **8.1** Log in on Device A. Mark 3 topics as done.
- [ ] **8.2** Log in on Device B (fresh browser, no localStorage). Data from Device A is present after login.
- [ ] **8.3** Mark a new topic done on Device B. Check Prisma Studio — new row appears.
- [ ] **8.4** Reload Device A (manual refresh). Confirm the topic marked on Device B is now visible (after DB fetch on mount).

---

## Section 9 — Edge Cases

- [ ] **9.1** Log in with a user that has **no** localStorage data and **no** DB data. App loads with default syllabus, empty state. No errors.
- [ ] **9.2** Simulate DB failure (temporarily set wrong `DATABASE_URL`). App still loads from localStorage. No crash — error logged to console only.
- [ ] **9.3** Add a habit log entry for a habit that doesn't exist in DB (orphaned client state). No crash — entry is silently skipped by sync.
- [ ] **9.4** Rapid navigation between tabs while DB sync is in flight. No race condition or stale state override.
- [ ] **9.5** Log out mid-session. Confirm no further `/api/tracker/*` calls are made after logout.

---

## Notes / Issues Found

| #   | Section | Description | Status |
| --- | ------- | ----------- | ------ |
| —   | —       | —           | —      |

---

## Sign-off

| Check                                              | Result |
| -------------------------------------------------- | ------ |
| All Section 1 items pass (no anonymous regression) | [ ]    |
| All Section 2–3 items pass (login sync)            | [ ]    |
| All Section 4 items pass (dual-write)              | [ ]    |
| All Section 5–6 items pass (clear + import)        | [ ]    |
| All Section 7 items pass (auth guards)             | [ ]    |
| No console errors in any scenario                  | [ ]    |

**Ready to merge:** [ ] Yes &nbsp;&nbsp; [ ] No
