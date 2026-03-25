# Lessons Learned — QA Playground

A running log of real bugs hit in this project, why they happened, and how they were fixed.
Add new lessons at the top of the relevant section (newest first).

---

## Table of Contents

- [Next.js / Vercel](#nextjs--vercel)
- [Authentication](#authentication)
- [Database / Prisma](#database--prisma)
- [UI / Styling](#ui--styling)
- [General](#general)

---

## Lesson Index

| # | Title | Section | Date |
|---|---|---|---|
| 004 | RSC Prefetch Inside Tab Panels | Next.js / Vercel | 2026-03-25 |
| 003 | Empty DATABASE_URL in vercel.json Overrides Real Env Var | Next.js / Vercel | 2026-03-25 |
| 002 | Prisma 7 + pnpm — `@prisma/client-runtime-utils` Not Found on Vercel | Database / Prisma | 2026-03-25 |
| 001 | better-auth `useSession` Hitting `/get-session` Continuously | Authentication | 2026-03-25 |
| 000 | RSC Prefetch Requests Flooding Edge Functions | Next.js / Vercel | 2026-03-25 |

---

## Next.js / Vercel

---

### Lesson 004 — RSC Prefetch Inside Tab Panels

**Date:** 2026-03-25

#### What Happened

Visiting the Study Tracker Resources tab was triggering an RSC prefetch request for `/qa-tools/json-to-file` — a page the user never navigated to. Similarly, visiting any page was fetching `blog`, `practice`, `bank`, `login` in the background.

#### Root Cause

Two separate cases of the same underlying issue:

1. **Header/NavbarSheet** — all 6 nav links are always in the DOM on every page. Next.js sees them in the viewport on mount and prefetches all of them. This means every page load fires 6+ RSC invocations for pages the user may never visit.

2. **Tab panels (SyllabusManagerView)** — the Study Tracker renders all tab views in the DOM simultaneously, not lazily. `SyllabusManagerView` contains a `<Link href="/qa-tools/json-to-file">`. Even when the user is on a different tab (e.g. Resources), that Link is present in the DOM and Next.js prefetches it.

#### Fix

Added `prefetch={false}` to the offending links:

```jsx
// components/Header.jsx
<Link key={index} href={to} prefetch={false}>

// components/NavbarSheet.jsx
<Link key={link.href} href={link.href} prefetch={false}>

// SyllabusManagerView.jsx
<Link href="/qa-tools/json-to-file" prefetch={false}>

// PromptPageContent.jsx
<Link href="/qa-tools/json-to-file" prefetch={false}>
```

#### Key Takeaways

- Links inside tab panels prefetch even when the tab is not active — if all tabs are mounted in the DOM, all their links are visible to Next.js's prefetch observer.
- Nav links in a fixed Header that renders on every page are the highest-impact prefetch source — fixing them reduces invocations on every single page load across the entire site.
- The rule: `prefetch={false}` on any `<Link>` that is not a primary CTA the user is highly likely to click immediately.

---

### Lesson 003 — Empty `DATABASE_URL` in `vercel.json` Overrides Real Env Var

**Date:** 2026-03-25

#### What Happened

Prisma threw `Can't reach database server at 127.0.0.1:5432` in production. The error code was `P1001` — Prisma trying to connect to localhost instead of the real PostgreSQL server.

#### Root Cause

`vercel.json` had this entry:

```json
"env": {
  "DATABASE_URL": ""
}
```

Vercel treats env vars in `vercel.json` as overrides. An empty string `""` is a valid value — it is not ignored. So even though `DATABASE_URL` was set correctly in the Vercel dashboard, this blank entry in `vercel.json` was winning and passing an empty string to Prisma. Prisma received no connection string and fell back to `127.0.0.1:5432`.

#### Fix

Removed `DATABASE_URL` from `vercel.json` entirely:

```json
// Before
{
  "env": {
    "DATABASE_URL": ""
  },
  "buildCommand": "npm run build"
}

// After
{
  "buildCommand": "npm run build"
}
```

Real secrets and env vars belong only in the Vercel dashboard (Settings → Environment Variables), never in `vercel.json`.

#### Key Takeaways

- Never put real secrets or placeholder env vars in `vercel.json` — the file is committed to git and entries override dashboard values.
- An empty string `""` in `vercel.json` env is not a no-op — it actively overrides the dashboard value with blank.
- If Prisma reports `127.0.0.1:5432` in production, check `vercel.json` env entries before anything else.

---

### Lesson 000 — RSC Prefetch Requests Flooding Edge Functions

**Date:** 2026-03-25
**Commits:** `266e612`, `6418acc`

#### What Happened

The app was generating a large number of unexpected Edge Function invocations on Vercel. These showed up as RSC Prefetch requests — not real user navigations, but background fetches triggered automatically by Next.js.

#### Root Cause

Next.js App Router (v13+) **prefetches linked pages by default**. When a `<Link>` component enters the viewport or is hovered, Next.js fires a background RSC request to pre-load the target page's React Server Component payload.

On Vercel, every one of these RSC prefetch requests hits an **Edge Function** invocation. With many `<Link>` components on the landing page, header, footer, and nav sheet, the number of invocations multiplied fast — even with zero real user clicks.

Additionally, `<SiteAlertPopup />` was imported inside `app/page.js` (a Server Component). This client component was being pulled into the RSC prefetch boundary and triggering extra server-side work on every prefetch of the home page.

#### Two-Part Fix

**Part 1 — Disable prefetch on all `<Link>` components** (`266e612`)

Added `prefetch={false}` to every `<Link>` across the app:

```jsx
// Before
<Link href="/practice">...</Link>

// After
<Link href="/practice" prefetch={false}>...</Link>
```

Files touched:
- `components/lib/Footer.jsx` — 3 links
- `components/Header.jsx`
- `components/NavbarSheet.jsx`
- `app/page.js` — all landing page links
- `app/(Practice)/practice/page.jsx`
- `app/(blog)/blog/page.jsx`
- `app/(tools)/qa-tools/ToolCard.jsx`

**Part 2 — Remove `<SiteAlertPopup />` from the landing page** (`6418acc`)

```jsx
// Removed from app/page.js
import SiteAlertPopup from "@/components/SiteAlertPopup";
// ...
<SiteAlertPopup />
```

This stopped the client component from being included in every RSC prefetch payload for the home page.

#### Key Takeaways

- Next.js App Router prefetches aggressively by default. On free/hobbyist Vercel tiers this burns through Edge Function quotas fast.
- `prefetch={false}` on `<Link>` is the correct opt-out — it disables the background RSC fetch while keeping normal navigation working.
- Placing client components directly in high-traffic Server Component pages (especially the root landing page) has hidden costs at the RSC prefetch layer — consider whether a client component truly needs to live there.
- When debugging unexpected Vercel Edge invocations, look at RSC prefetch traffic first before assuming real user load.

---

<!-- ADD NEW LESSONS ABOVE THIS LINE -->
<!-- Use the template below when adding a new lesson -->

---

## Authentication

---

### Lesson 001 — better-auth `useSession` Hitting `/get-session` Continuously

**Date:** 2026-03-25

#### What Happened

The `/api/auth/get-session` endpoint was being called on every component mount and every time the browser window regained focus. With multiple components across the app calling `useSession()`, this generated a constant stream of API calls — visible in the Network tab as repeated GET requests to `get-session`.

#### Root Cause

better-auth's `useSession()` hook has two built-in refetch triggers:

1. **On mount** — every component that calls `useSession()` triggers a fetch when it first renders.
2. **On `visibilitychange`** — whenever the browser tab regains focus, all `useSession()` hooks refetch.

Without caching, every page navigation + every tab switch fires a new API call. The project had `useSession()` in multiple components (admin pages, StudyTrackerProvider, ResourcesView) and the Header on every page.

#### Fix

Enabled `cookieCache` in `lib/auth-client.js`:

```js
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // cache for 5 minutes
    },
  },
});
```

`cookieCache` stores a copy of the session in a short-lived cookie. `useSession()` reads the cookie instead of calling the API. The server is only hit once every 5 minutes per browser tab.

#### Key Takeaways

- `cookieCache` does not affect session lifetime (`expiresIn`) — it only reduces how often the client polls the server.
- `signOut()` still clears both the session and the cache cookie immediately — no security concern.
- Trade-off: if a session is forcibly deleted server-side, the client stays "logged in" for up to `maxAge` seconds. Acceptable for non-sensitive apps.
- If `get-session` appears repeatedly in logs, `cookieCache` is the fix.

---

---

## Database / Prisma

---

### Lesson 002 — Prisma 7 + pnpm: `@prisma/client-runtime-utils` Not Found on Vercel

**Date:** 2026-03-25

#### What Happened

All API routes crashed on Vercel production with:

```
Error: Cannot find module '@prisma/client-runtime-utils'
Require stack:
- /var/task/node_modules/.prisma/client/runtime/client.js
```

Every API route that touched Prisma (auth, resources, tracker) was broken. The `/500.html` error also appeared as a knock-on failure.

#### Root Cause

Two separate issues compounding each other:

**1. pnpm strict module resolution**
The project has a `pnpm-lock.yaml`, so Vercel uses pnpm for installation. Prisma 7 introduced `@prisma/client-runtime-utils` as a runtime dependency of the generated `.prisma/client`. pnpm only makes packages accessible to their declared dependents — the generated `.prisma/client` directory is not a real package with a `package.json`, so pnpm does not hoist `@prisma/client-runtime-utils` to the root `node_modules/`. The generated client can't find it at runtime.

**2. Next.js bundling Prisma**
Without explicit configuration, Next.js bundles `@prisma/client` into server-side chunks. The bundled code calls `require('@prisma/client-runtime-utils')` at runtime, but the bundler didn't include that module as a separately resolvable path.

#### Fix

**Part 1 — `.npmrc`** (fixes pnpm hoisting):

```ini
public-hoist-pattern[]=*prisma*
public-hoist-pattern[]=@prisma*
```

This tells pnpm to hoist all `@prisma/*` packages to root `node_modules/`, making them resolvable by the generated client.

**Part 2 — `next.config.mjs`** (prevents Next.js from bundling Prisma):

```js
const nextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client", "@prisma/adapter-pg"],
  // ...
};
```

This tells Next.js to load Prisma from `node_modules` at runtime instead of inlining it into server chunks.

Both fixes are required together.

#### Key Takeaways

- If you have a `pnpm-lock.yaml`, Vercel uses pnpm even if you run `npm` locally — check this first.
- Prisma 7 changed internal package structure. Always add `.npmrc` hoisting rules when using Prisma with pnpm.
- `serverExternalPackages` is the standard Next.js fix for any native/binary package that can't be bundled (Prisma, sharp, etc.).
- Check `vercel.json` `buildCommand` vs the install command — they are separate. `buildCommand: "npm run build"` does not change what package manager Vercel uses for `install`.

---

---

## UI / Styling

<!-- Add lessons about Tailwind, shadcn/ui, dark mode, responsive layout here -->

---

## General

<!-- Add lessons that don't fit other categories here -->

---

## How to Add a New Lesson

Copy and fill in this template at the top of the relevant section:

```md
### Lesson NNN — Short Title

**Date:** YYYY-MM-DD
**Commits / PRs:** `abc1234` (optional)

#### What Happened

Describe the bug or problem you hit.

#### Root Cause

Explain why it happened — the underlying mechanism.

#### Fix

Show the before/after code or config change.

#### Key Takeaways

- Bullet point learnings you want to remember.
- What to check first if this happens again.
```