# API Overview — Task List

> Derived from `docs/api-docs/API_OVERVIEW.md`. Tasks ordered from easiest (low resource) to most complex.

**Branch:** `fix/recurring-task-sync-issue`
**Status:** In progress

---

## Phase 1 — Quick Fixes (Low effort, no new dependencies)

### Task 1 — Verify proxy.js (middleware) is correct ✅

- [x] Confirmed project is on **Next.js 16.1.7** — in v16 the file is `proxy.js` with `export function proxy(request)` (not `middleware.js`)
- [x] `proxy.js` at project root is already the correct v16 format — no changes needed
- [x] Deleted the incorrectly created `middleware.js` (was a wrong assumption based on v15 docs)
- [x] `proxy.js` correctly protects `/admin/*` — fetches session via `fetch("/api/auth/get-session")` to stay off Edge runtime (Node.js runtime default in v16)

---

### Task 2 — Fix: Delete task from Daily Tasks tab (recurring task sync bug) ✅

> **This is the bug this branch was created to fix.**

- [x] Located `deleteTask(index)` in `app/(study)/study-tracker/daily-tracker/_components/DailyTrackerView.jsx`
- [x] Before filtering array, now captures `taskToDelete = existing[index]` to get its `id`
- [x] After `updateState()`, calls `DELETE /api/tracker/daily/[taskId]` when `user && taskToDelete?.id`
- [x] Logged-out users unaffected — API call is guarded by `if (user && ...)`
- [x] Pattern mirrors exactly what `PendingTodosView.deleteTask()` already does correctly

---

### Task 3 — Add `expiresAt` to `ApiKey` model ✅

- [x] Added `expiresAt DateTime?` to `ApiKey` model in `prisma/schema.prisma`
- [x] Ran migration `20260329074416_add_apikey_expiry` — DB in sync
- [x] `app/api/api-keys/route.js` GET: now includes `expiresAt` in select
- [x] `app/api/api-keys/route.js` POST: accepts optional `expiresAt` from request body, stored as `DateTime`
- [x] `app/api/resources/route.js` `resolveUserId`: rejects keys where `expiresAt < now()`

---

## Phase 2 — Email Verification & Password Reset (Resend)

### Task 4 — Install and configure Resend ✅

- [x] Installed resend: `npm install resend` → `resend@6.9.4`
- [x] `RESEND_API_KEY` and `RESEND_FROM_EMAIL` already present in `.env`
- [x] Created `lib/email.js` — thin wrapper around Resend client

---

### Task 5 — Enable email verification in Better-Auth ✅

- [x] In `lib/auth.js` `emailAndPassword` config, added `requireEmailVerification: true`
- [x] `sendVerificationEmail` moved to top-level `emailVerification` block (correct key for v1.5.6 — was wrongly placed inside `emailAndPassword` initially)
- [x] HTML email template for verification email written inline
- [ ] Test: sign up with a new account → receive verification email → click link → `emailVerified` becomes `true` in DB

---

### Task 6 — Add Forgot Password / Password Reset flow ✅

- [x] `sendResetPassword` hook added in `lib/auth.js` under `emailAndPassword` (correct key name for v1.5.6 — `sendResetPasswordEmail` was wrong)
- [x] HTML email template for password reset written inline
- [x] Created `app/(admin)/forgot-password/page.jsx` — email input, calls `authClient.requestPasswordReset` (fixed from `forgetPassword` which caused 404), shows success state
- [x] Created `app/(admin)/reset-password/page.jsx` — reads `?token=` from URL via `useSearchParams`, new+confirm password fields with show/hide, calls `authClient.resetPassword`, redirects to `/login` on success
- [x] "Forgot password?" link already present in `/login` page pointing to `/forgot-password`
- [ ] Test end-to-end: request reset → receive email → set new password → login with new password

---

## Phase 3 — Rate Limiting on Auth Endpoints

### Task 7 — Add rate limiting to `/api/auth` routes ✅

- [x] Chose `@upstash/ratelimit` + `@upstash/redis` — works on Edge Runtime, no in-memory state needed
- [x] Installed `@upstash/ratelimit@2.0.8` and `@upstash/redis@1.37.0`
- [x] Added `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` placeholders to `.env`
- [x] `proxy.js` — rate limiter created only when Upstash env vars are present; skipped gracefully in local dev
- [x] Sliding window: 5 requests per IP per minute on all `/api/auth/*` paths
- [x] Returns `429` JSON with `X-RateLimit-*` and `Retry-After` headers when exceeded
- [x] IP read from `x-forwarded-for` → `x-real-ip` → fallback `"anonymous"`
- [x] Extended `matcher` in `proxy.js` to include `/api/auth/:path*`
- [ ] Test: fill in Upstash env vars → fire 6+ rapid login attempts → confirm 6th returns 429

---

## Phase 4 — Sync Endpoint Validation

### Task 8 — Add basic validation to `POST /api/tracker/sync` ✅

- [x] `fullState` must be a plain object — returns 400 if array, primitive, or null
- [x] Each of the 7 keys (`daily`, `habits`, `habitLog`, `progress`, `subtopics`, `syllabi`, `log`) must be array or object if present — returns 400 with key name and actual type
- [x] `habits` and `log` arrays capped at 5,000 items; `daily.<date>` task arrays also capped
- [x] Payload size checked via `Content-Length` header before parsing (fast path) + `Buffer.byteLength` fallback after parsing (for requests without Content-Length)
- [x] All guards return `400` with descriptive `{ error: "..." }` JSON
- [x] Happy path (the `prisma.$transaction`) is unchanged

---

## Phase 5 — Pagination on State Endpoint (Future)

### Task 9 — Add date-range filter to `GET /api/tracker/state` ✅

- [x] `?since=YYYY-MM-DD` query param accepted; invalid/missing value defaults to 90 days ago
- [x] `DailyTask` query filtered with `date: { gte: sinceDate }` (YYYY-MM-DD string comparison)
- [x] `HabitLog` query filtered with `date: { gte: sinceDate }`
- [x] `ActivityLog` 500-row cap preserved — no `since` filter applied to it
- [x] `StudyTrackerProvider.jsx` — computes `since` (90 days ago) and passes `?since=YYYY-MM-DD` on initial load
- [ ] Test: user with 2+ years of daily tasks → initial load should only pull last 90 days

---

## Progress Summary

| #   | Task                                             | Status         |
| --- | ------------------------------------------------ | -------------- |
| 1   | Verify middleware.js in git                      | ✅ Done        |
| 2   | Fix delete task from Daily Tasks tab             | ✅ Done        |
| 3   | Add expiresAt to ApiKey model                    | ✅ Done        |
| 4   | Install & configure Resend                       | ✅ Done        |
| 5   | Enable email verification (Better-Auth + Resend) | ✅ Done        |
| 6   | Forgot password / reset password pages           | ✅ Done        |
| 7   | Rate limiting on auth endpoints                  | ✅ Done        |
| 8   | Sync endpoint input validation                   | ✅ Done        |
| 9   | Pagination on state endpoint                     | ✅ Done        |
