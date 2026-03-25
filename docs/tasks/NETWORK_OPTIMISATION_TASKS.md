# Network Optimisation Tasks

Source analysis: `docs/NETWORK_LOG_OPTIMISATION.md`
Estimated savings: ~60 fewer network requests per page load.

---

## Task 1 — Add `prefetch={false}` to all missing Link components

**Status:** Pending
**Files:**
- `components/hero.jsx` — `/practice` link (line 27)
- `app/page.js` — `/practice` (line 191), `/bank` (line 216), `/study-tracker/dashboard` (lines 245, 299)
- `app/(study)/study-tracker/_components/NavBtn.jsx` — all sidebar nav links
- `app/(tools)/qa-tools/page.jsx` — `/study-tracker/dashboard` (line 186), `/practice` (line 201)
- `app/(tools)/qa-tools/json-to-file/_components/SuccessBanner.jsx` — `/study-tracker/syllabus`
- `app/(tools)/qa-tools/json-to-file/_components/RelatedToolsBar.jsx` — `/study-tracker/ai-syllabus-prompt`
- `app/(study)/study-tracker/_components/SyllabusManagerView.jsx` — `/study-tracker/ai-syllabus-prompt`
- `app/(study)/study-tracker/ai-syllabus-prompt/PromptPageContent.jsx` — `/study-tracker/dashboard` (x2)

**Why:** Next.js aggressively prefetches all visible links on mount. Without `prefetch={false}`, every nav link fires an RSC request. This causes 4–6 duplicate prefetch requests per route.

---

## Task 2 — Add `revalidate` to `/practice` page for RSC caching

**Status:** Pending
**File:** `app/(Practice)/practice/page.jsx`
**Fix:** Add `export const revalidate = 3600;` at the top of the file.
**Why:** `/practice` is a static page. Without a revalidation hint, Next.js re-renders it on every RSC prefetch from every visitor. ISR caching eliminates redundant server work.

---

## Task 3 — Replace Buy Me Coffee CDN image in hero with static button

**Status:** Pending
**File:** `components/hero.jsx`
**Fix:** Replace `<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png">` with a styled Tailwind anchor tag.
**Why:** The external CDN image fires a network request on every page load that renders the hero section. A self-contained Tailwind button eliminates the request entirely.

---

## Task 4 — Clean up stray `*/` text in layout.js `<head>`

**Status:** Pending
**File:** `app/layout.js` (line 98)
**Fix:** Remove the orphaned `*/` that renders as literal text in the HTML `<head>` element.
**Why:** It is invalid content in `<head>` and may cause unexpected rendering artefacts.

---

## Task 5 — Fix duplicate auth session call in ResourcesView

**Status:** Pending
**File:** `app/(study)/study-tracker/_components/ResourcesView.jsx`
**Fix:** Remove `authClient.useSession()` call. Use `useTracker()` context to get `user` instead, since `StudyTrackerProvider` already fetches the session once and exposes it.
**Why:** `ResourcesView` is a child of `StudyTrackerProvider` but independently calls `authClient.useSession()`, triggering a second `/api/auth/get-session` request on every study tracker page load.

---

## Task 6 — Add error boundary to syllabus `[id]` page to prevent 503

**Status:** Pending
**File:** `app/(study)/study-tracker/syllabus/[id]/page.jsx`
**Fix:** Wrap render logic in a try/catch and return a user-friendly fallback if context or syllabus data is unavailable.
**Why:** RSC prefetch of `/study-tracker/syllabus/automation` consistently returns 503. Adding a safe fallback prevents a server crash from surfacing as a 503 to clients and RSC prefetch machinery.

---

## Summary

| Task | File(s) | Requests Saved |
|------|---------|---------------|
| 1 — prefetch=false | 8 files | ~25–30 |
| 2 — practice revalidate | 1 file | ~5 |
| 3 — BMC image | hero.jsx | 1–2 |
| 4 — stray `*/` | layout.js | cosmetic |
| 5 — auth session dedup | ResourcesView.jsx | 1 |
| 6 — syllabus 503 | [id]/page.jsx | 1 broken route |
