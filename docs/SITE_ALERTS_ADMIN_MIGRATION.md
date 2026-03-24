# Site Alerts — Admin Migration Plan

> Migration of the site-alerts feature from `(contact)` route group to `(admin)`, with Prisma-backed storage replacing localStorage + Formspree.

---

## 1. Current State

### Where it lives
| File | Role |
|---|---|
| `app/(contact)/site-alerts/page.jsx` | Admin UI — password-gated via `ADMIN_PASSWORD` env var |
| `components/SiteAlertPopup.jsx` | Popup shown to visitors on homepage (`app/page.js`) |
| `lib/alertStorage.js` | localStorage abstraction for config + state |
| `app/api/admin/verify/route.js` | Simple password check endpoint |

### How it works today
1. Admin visits `/site-alerts`, enters `ADMIN_PASSWORD`.
2. Config (enabled, durationDays, questions, Formspree endpoint) is saved to **localStorage** in the admin's browser.
3. `SiteAlertPopup` reads config from **localStorage** on homepage load.
4. Visitor answers → saved to visitor's **localStorage** + POSTed to **Formspree**.
5. Admin can only see the **last** single visitor's response (from their own localStorage).

### Problems
- Config lives only in the admin's browser localStorage — invisible to other browsers/devices.
- Responses go to Formspree (third-party email), not a database — no history, no querying.
- Auth is a plain password, bypassing the existing Better-Auth session system.
- Page lives in `(contact)` despite being an admin-only operation.
- No way to see aggregate responses across all visitors.
- No button to stop/deactivate an individual question without deleting it.

---

## 2. Target State

### Auth
Use the existing Better-Auth session (`authClient.useSession()`). Only users with `role === "ADMIN"` can access the site-alerts management UI, identical to how `app/(admin)/admin/dashboard/page.jsx` works today.

### Storage
All configuration and responses move to Postgres via Prisma. localStorage is still used on the **visitor side** as a cache so the popup loads instantly without an API call.

### URL structure
| Route | Purpose |
|---|---|
| `/admin/site-alerts` | Tab UI — Questions tab + Responses tab |
| `/admin/site-alerts?tab=questions` | Manage questions (add, edit, deactivate, delete) |
| `/admin/site-alerts?tab=responses` | View all visitor responses |

The old `/site-alerts` route stays temporarily and redirects to `/admin/site-alerts` (or is deleted after the migration).

### Data sync contract
```
Prisma DB (canonical)
   |
   | GET /api/admin/site-alerts/config  (on admin page load)
   | GET /api/public/site-alerts/config (on homepage load → SiteAlertPopup)
   v
localStorage["qaPlayground_alertConfig"]  (visitor-side cache, TTL = 1 hour)
   |
   | read synchronously
   v
SiteAlertPopup renders immediately
   |
   | visitor answers
   v
POST /api/public/site-alerts/respond  → Prisma SiteAlertResponse
   +
localStorage["qaPlayground_alertState"] (suppress re-show per visitor)
```

---

## 3. Prisma Models

Add three models to `prisma/schema.prisma`.

```prisma
// Global on/off switch + frequency setting (singleton — only ever one row)
model SiteAlertConfig {
  id           String   @id @default(cuid())
  enabled      Boolean  @default(true)
  durationDays Int      @default(7)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// One row per question the admin creates
model SiteAlertQuestion {
  id        String               @id @default(cuid())
  text      String
  type      SiteAlertQuestionType @default(YESNO)
  order     Int                  @default(0)
  isActive  Boolean              @default(true)   // false = paused (not deleted)
  createdAt DateTime             @default(now())
  updatedAt DateTime             @updatedAt
  responses SiteAlertResponse[]
}

// One row per answer a visitor submits
model SiteAlertResponse {
  id          String            @id @default(cuid())
  questionId  String
  question    SiteAlertQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  answer      String            // "Yes" | "No" | "Liked it" | "Did not like"
  visitorId   String            // anonymous stable ID stored in visitor's localStorage
  userAgent   String?
  createdAt   DateTime          @default(now())
}

enum SiteAlertQuestionType {
  YESNO
  THUMBS
}
```

**Migration command after adding models:**
```bash
npx prisma migrate dev --name add_site_alerts
npx prisma generate
```

---

## 4. API Routes

### Public (no auth — called by visitor's browser)

#### `GET /api/public/site-alerts/config`
Returns the active config + active questions for the popup.

Response:
```json
{
  "enabled": true,
  "durationDays": 7,
  "questions": [
    { "id": "...", "text": "Have you tried Study Tracker?", "type": "YESNO" }
  ]
}
```
Cache-Control: `s-maxage=300, stale-while-revalidate` (5 min edge cache).

#### `POST /api/public/site-alerts/respond`
Saves visitor answers to DB.

Body:
```json
{
  "visitorId": "visitor_abc123",   // from localStorage, generated on first visit
  "responses": [
    { "questionId": "...", "answer": "Yes" }
  ]
}
```
No auth. Rate-limited by visitorId (one submission per visitor per durationDays window — enforced in the route handler by checking the latest response timestamp for that visitorId).

### Admin (requires ADMIN session)

All routes below check the Better-Auth session and return 401 if not ADMIN.

#### `GET /api/admin/site-alerts/config`
Returns full config (same shape as public endpoint).

#### `PUT /api/admin/site-alerts/config`
Updates `enabled` and/or `durationDays`.

Body: `{ "enabled": false }` or `{ "durationDays": 14 }`

#### `GET /api/admin/site-alerts/questions`
Returns all questions (including inactive ones).

#### `POST /api/admin/site-alerts/questions`
Creates a new question.

Body: `{ "text": "...", "type": "YESNO", "order": 3 }`

#### `PUT /api/admin/site-alerts/questions/[id]`
Updates text, type, order, or `isActive`.

Body: `{ "isActive": false }` — this is the "stop/pause" action without deleting.

#### `DELETE /api/admin/site-alerts/questions/[id]`
Hard-deletes the question and all its responses (cascades).

#### `GET /api/admin/site-alerts/responses`
Returns paginated responses with question text joined.

Query params: `?questionId=...&page=1&limit=50`

Response:
```json
{
  "total": 312,
  "page": 1,
  "responses": [
    {
      "id": "...",
      "questionText": "Have you tried Study Tracker?",
      "answer": "Yes",
      "visitorId": "visitor_abc123",
      "createdAt": "2026-03-24T10:00:00Z"
    }
  ]
}
```

---

## 5. Pages & Components

### `app/(admin)/admin/site-alerts/page.jsx`
Client component. Guards with `authClient.useSession()` — redirects to `/login` if no session or `role !== "ADMIN"`.

Two tabs at the top (using shadcn `Tabs` component):

**Tab 1: Questions**
- Toggle switch for "Enable popup globally" (calls `PUT /api/admin/site-alerts/config`)
- "Show again after" select (durationDays)
- List of questions, each showing:
  - Question text (editable inline)
  - Answer type badge
  - Active/Paused badge
  - "Pause" toggle button — sets `isActive: false` without deleting
  - "Delete" button with confirmation dialog
  - Drag handle for reordering (optional — can use up/down arrows instead)
- "Add Question" button → inline form
- "Save" button

**Tab 2: Responses**
- Filter by question (Select dropdown)
- Table: Question | Answer | Visitor ID (truncated) | Date
- Aggregate summary per question: Yes count / No count / total
- "Export CSV" button (client-side, generates CSV from fetched data)

### `app/(admin)/admin/site-alerts/layout.jsx` (optional)
Thin layout that just wraps children — shared breadcrumb or back-to-dashboard link.

### Component: `components/SiteAlertPopup.jsx` (modified)
Changes:
1. On mount, call `GET /api/public/site-alerts/config` and cache result in localStorage with a `_cachedAt` timestamp.
2. If cached config is < 1 hour old, use it directly (no API call).
3. Generate a `visitorId` (random UUID) on first visit and persist it in localStorage.
4. On final answer, POST to `/api/public/site-alerts/respond` instead of Formspree.
5. Remove all `formspreeEndpoint` references.

### `lib/alertStorage.js` (modified)
Add helpers:
- `getVisitorId()` — returns or creates a stable anonymous ID
- `getCachedAlertConfig()` — returns cached config if fresh (< 1 hour)
- `setCachedAlertConfig(config)` — saves config with timestamp

Remove `saveAlertConfig()` (no longer needed — admin saves to DB).

---

## 6. `app/(contact)/site-alerts/page.jsx` — What to do with it

Two options:

**Option A — Redirect (safest):**
Replace the entire file with:
```jsx
import { redirect } from "next/navigation";
export default function OldSiteAlertsPage() {
  redirect("/admin/site-alerts");
}
```

**Option B — Delete:**
Remove the file entirely. Any bookmarks to `/site-alerts` will 404 (acceptable since it's an internal admin page).

Recommendation: **Option A** during transition, delete after confirming no references.

---

## 7. Remove / Deprecate

| Item | Action |
|---|---|
| `app/api/admin/verify/route.js` | Delete — superseded by Better-Auth session checks |
| `config.formspreeEndpoint` in `BasicSetting.js` | Remove field |
| `DEFAULT_ALERT_CONFIG.formspreeEndpoint` in `alertStorage.js` | Remove field |
| `PasswordGate` component in old `site-alerts/page.jsx` | Deleted with the file |
| Formspree `fetch` call in `SiteAlertPopup.jsx` | Replace with DB API call |

---

## 8. Implementation Order

1. **Prisma** — add 3 models + enum, run migration.
2. **Public API** — `GET /api/public/site-alerts/config` and `POST /api/public/site-alerts/respond`.
3. **Admin API** — config CRUD + questions CRUD + responses GET.
4. **`lib/alertStorage.js`** — add `getVisitorId`, `getCachedAlertConfig`, `setCachedAlertConfig`.
5. **`SiteAlertPopup.jsx`** — switch from localStorage config to API fetch + remove Formspree.
6. **Admin page** — `app/(admin)/admin/site-alerts/page.jsx` with Questions tab and Responses tab.
7. **Old page** — redirect or delete `app/(contact)/site-alerts/page.jsx`.
8. **Cleanup** — remove `api/admin/verify/route.js`, Formspree fields.
9. **Seed** — optionally seed the DB with the two default questions from `DEFAULT_ALERT_CONFIG`.

---

## 9. Environment Variables

No new env vars needed. `ADMIN_PASSWORD` can be removed from `.env` after step 8.

`DATABASE_URL` must be set (already required by Prisma for other features).

---

## 10. Admin Dashboard Navigation

The existing `app/(admin)/admin/dashboard/page.jsx` shows only user info + logout. After this migration, add a navigation card or sidebar link to "Site Alerts" so the admin can get there from the dashboard without typing the URL.

Suggested addition to dashboard:
```jsx
<Link href="/admin/site-alerts">
  <Button variant="outline" className="w-full">
    <Bell className="mr-2 h-4 w-4" />
    Manage Site Alerts
  </Button>
</Link>
```