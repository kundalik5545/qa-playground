# Study Tracker — localStorage → DB Migration: Task Tracker

> Created: 2026-03-24
> Last updated: 2026-03-25
> Reference analysis: `docs/STUDY_TRACKER_DB_MIGRATION_ANALYSIS.md`
> Branch: `feat/localstorage-sync`
> **Status: Phases 1–6 complete. Phase 7 deferred pending prod validation.**

---

## Status Legend

| Symbol | Meaning |
|---|---|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Done |
| `[!]` | Blocked / needs decision |

---

## Phase 1 — Prisma Schema

> Risk: Low. No UI changes, no data loss. Safe to ship independently.

- [x] **1.1** Add `UserSyllabus` model to `prisma/schema.prisma`
- [x] **1.2** Add `TopicProgress` model
- [x] **1.3** Add `SubtopicProgress` model
- [x] **1.4** Add `DailyTask` model
- [x] **1.5** Add `Habit` model
- [x] **1.6** Add `HabitLog` model (with relation to `Habit`)
- [x] **1.7** Add `ActivityLog` model
- [x] **1.8** Add all new relations to existing `User` model
- [x] **1.9** Migration applied manually via `prisma db execute` + `prisma migrate resolve --applied 20260324000000_study_tracker_db`
  - Note: DB was previously managed with `db push` (no local migrations folder). Baseline `20260323192247_init` was reconstructed in `prisma/migrations/` for history. New migration in `prisma/migrations/20260324000000_study_tracker_db/migration.sql`.
- [x] **1.10** Run `npx prisma generate` — Prisma Client v7.5.0 regenerated with all 7 new models.

**Acceptance criteria:** `npx prisma studio` shows all 7 new tables; existing tables unaffected.

---

## Phase 2 — Core API Routes (Read + Bulk Sync)

> Risk: Low. New routes only, nothing existing is touched.

- [x] **2.1** Create `app/api/tracker/state/route.js` — `GET` full tracker state for session user + `DELETE` wipe all tracker data
  - Uses `Promise.all` to fetch all 7 models in parallel
  - Returns reshaped state matching the localStorage shape
- [x] **2.2** Create `app/api/tracker/sync/route.js` — `POST` bulk upsert (used for first-login migration + partial key sync)
  - Accepts `{ fullState }` in request body
  - Upserts all supplied keys in a `prisma.$transaction`
  - Habit log resolution: looks up existing DB habit IDs so partial syncs work
- [x] **2.3** Create `lib/trackerDb.js` — shared utilities:
  - `reshapeToState(dbRows)` — converts flat DB rows → state object shape
  - `mergeStates(local, db)` — DB wins for any key that has DB content

**Acceptance criteria:** `GET /api/tracker/state` returns correct shape for a seeded user; `POST /api/tracker/sync` upserts without error.

---

## Phase 3 — Granular PATCH/POST/DELETE Routes

> Risk: Low. New routes only.

- [x] **3.1** `PATCH /api/tracker/progress` — single topic progress update
- [x] **3.2** `PATCH /api/tracker/subtopics` — single subtopic toggle
- [x] **3.3** `POST /api/tracker/daily` — add/update daily task
- [x] **3.4** `DELETE /api/tracker/daily/[taskId]/route.js` — delete daily task
- [x] **3.5** `POST /api/tracker/habits` — create/update habit
- [x] **3.6** `DELETE /api/tracker/habits/[habitId]/route.js` — delete habit
- [x] **3.7** `PATCH /api/tracker/habit-log` — toggle habit completion for a date
- [x] **3.8** `PUT /api/tracker/syllabus/[syllabusId]/route.js` — save custom syllabus
- [x] **3.9** `POST /api/tracker/log` — append activity log entry
- [x] **3.10** `DELETE /api/tracker/state` — wipe all tracker data for user (handled in state/route.js)

All routes must:
- Authenticate via `auth.api.getSession()` (same pattern as `/api/resources`)
- Return `401` if no session
- Return `200` / `204` on success

---

## Phase 4 — StudyTrackerApp: Async Mount + DB Fetch

> Risk: Medium. Touch `StudyTrackerApp.jsx`. Test merge logic carefully.

- [x] **4.1** Make `loadAllState()` call in `useEffect` async
  - Load localStorage first (instant render, no flash)
  - If user session exists: call `GET /api/tracker/state`
- [x] **4.2** Implement `mergeStates(local, db)` in `lib/trackerDb.js` — DB wins on conflict
- [x] **4.3** On first login (DB empty): call `POST /api/tracker/sync` with current localStorage state
- [x] **4.4** After merge: mirror final state back to localStorage (offline cache)
- [x] **4.5** No extra loading indicator needed — local data renders instantly; DB merge is a silent update

**Acceptance criteria:**
- Anonymous user: behaves exactly as before (localStorage only)
- First login: localStorage data uploaded to DB silently, no visible change
- Second login (DB has data): DB state loaded and merged, localStorage updated

---

## Phase 5 — Dual-Write in updateState()

> Risk: Medium. Every state mutation now makes an async API call.

- [x] **5.1** `syncToDb(key, value, currentState)` inline in `StudyTrackerApp.jsx`
  - Routes all keys through `POST /api/tracker/sync` with partial `fullState`
  - Debounce: `progress` / `subtopics` = 1s, `syllabi` = 2s, others = immediate
  - `habitLog` includes `habits` in payload for ID resolution
- [x] **5.2** `updateState()` calls `syncToDb` when user is logged in; localStorage write unchanged; DB failures are silent

**Acceptance criteria:** Updating topic progress while logged in reflects in DB within 2s; localStorage still updated synchronously.

---

## Phase 6 — handleClearAll + handleImport

> Risk: Low. Isolated functions.

- [x] **6.1** Updated `handleClearAll` to also call `DELETE /api/tracker/state` when user is logged in
- [x] **6.2** Updated `handleImport` to also call `POST /api/tracker/sync` with imported data when user is logged in

---

## Phase 7 — Remove localStorage Dependency for Logged-in Users (Optional / Later)

> Risk: High. Only do this after all phases above are stable in production.

- [ ] **7.1** Decision needed: keep localStorage as perpetual cache, or phase it out for auth users?
- [ ] **7.2** If phasing out: replace all `loadAllState()` calls with DB fetch, remove localStorage writes on mutation
- [ ] **7.3** Thorough E2E testing: login, logout, offline behaviour, re-login

---

## Meta / Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-03-24 | Use normalised rows (not JSONB blob) | Individual records can be queried and patched independently |
| 2026-03-24 | Preserve client `topicId` / `habitId` strings as DB keys | Default syllabus IDs (e.g. `m-t1`) are stable; avoids ID remapping |
| 2026-03-24 | localStorage stays as offline cache | Anonymous users unaffected; instant renders before DB responds |
| 2026-03-24 | Bulk sync only on first login | One-way migration; avoids conflict complexity |
| 2026-03-24 | `UserSyllabus.data` stored as `Json` | Syllabus is deeply nested and rarely queried field-by-field |
| 2026-03-24 | DB write failures are silent | Never block the UI for a background sync failure |
| 2026-03-25 | All keys routed through `POST /api/tracker/sync` for dual-write | Avoids maintaining per-key granular routes in `updateState()`; sync endpoint handles partial `fullState` |
| 2026-03-25 | `habitLog` dual-write includes `habits` in payload | Sync endpoint resolves `clientHabitId → DB Habit.id` from existing rows; passing habits ensures new habits are resolvable |
| 2026-03-25 | `HabitLog` FK points to `Habit.id` (CUID), not `Habit.habitId` | Enforces referential integrity; client ID stored separately as `habitId` field |

---

## Files To Touch (by phase)

| Phase | Files |
|---|---|
| 1 | `prisma/schema.prisma` |
| 2–3 | `app/api/tracker/*` (new), `lib/trackerDb.js` (new) |
| 4–5 | `app/(study)/study-tracker/_components/StudyTrackerApp.jsx` |
| 6 | `app/(study)/study-tracker/_components/StudyTrackerApp.jsx` (handleClearAll, handleImport) |
| 7 | `lib/studyTrackerStorage.js`, `StudyTrackerApp.jsx` |

---

## Open Questions

- [x] Should `qa_tracker_custom` (user topic overrides) be migrated to DB or kept localStorage-only? **Resolved: localStorage-only** (low value, large payload, not worth the complexity).
- [x] Should the Resources tab (already on DB) be factored into this migration or stay as-is? **Resolved: stays as-is** — Resources already has full DB CRUD via `/api/resources`.
- [ ] Phase 7 timing: ship phases 1–6 to prod, monitor for regressions, then decide on localStorage removal for auth users.
