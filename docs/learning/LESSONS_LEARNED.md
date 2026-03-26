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

| #   | Title                                                                | Section           | Date       |
| --- | -------------------------------------------------------------------- | ----------------- | ---------- |
| 014 | Sitemap Slugs Must Match `Blog/elements/` Filenames Exactly          | Next.js / Vercel  | 2026-03-26 |
| 013 | Central Resource Registry Pattern for Practice Element Metadata      | General           | 2026-03-26 |
| 012 | `label for` Must Match Input `id` — Mismatch Is a Silent Bug         | UI / Styling      | 2026-03-26 |
| 011 | Footer `<h3>` Pollutes Practice Page Heading Hierarchy               | UI / Styling      | 2026-03-26 |
| 010 | `<nav>` Inside `<nav>` Is Valid — Nested Navs Need `aria-label`      | UI / Styling      | 2026-03-26 |
| 009 | `<Link><Button>` in Next.js Renders Invalid `<a><button>` HTML        | UI / Styling      | 2026-03-26 |
| 008 | Tailwind Dynamic Classes Require a Lookup Map                        | UI / Styling      | 2026-03-26 |
| 007 | JSX Comment Nesting Trap Silently Swallows Content                   | UI / Styling      | 2026-03-26 |
| 006 | Auth Session Dedup — One `useSession()` Per Provider                 | Authentication    | 2026-03-26 |
| 005 | `next/script` `id` Prop Prevents Duplicate Script Injection          | Next.js / Vercel  | 2026-03-26 |
| 004 | RSC Prefetch Inside Tab Panels                                       | Next.js / Vercel  | 2026-03-25 |
| 003 | Empty DATABASE_URL in vercel.json Overrides Real Env Var             | Next.js / Vercel  | 2026-03-25 |
| 002 | Prisma 7 + pnpm — `@prisma/client-runtime-utils` Not Found on Vercel | Database / Prisma | 2026-03-25 |
| 001 | better-auth `useSession` Hitting `/get-session` Continuously         | Authentication    | 2026-03-25 |
| 000 | RSC Prefetch Requests Flooding Edge Functions                        | Next.js / Vercel  | 2026-03-25 |

---

## Next.js / Vercel

---

### Lesson 014 — Sitemap Slugs Must Match `Blog/elements/` Filenames Exactly

**Date:** 2026-03-26

#### What Happened

`data/sitemap-links.js` had 11 practice element URLs using stale slugs that no longer matched the actual routes — e.g. `practice/input`, `practice/button`, `practice/select`, `practice/waits`. None of these resolved to real pages. Google was indexing 404s for every one of them.

Additionally, 5 slugs (`drag`, `drop`, `sort`, `slider`, `shadow-dom`) were listed that had no markdown file in `Blog/elements/` and no component — they were wishlist routes that were never built.

#### Root Cause

`sitemap-links.js` was written manually at project start when slugs were simple and short. The slugs were later renamed to be more descriptive (`input` → `input-fields`, `button` → `buttons`, `radio` → `radio-checkbox`, `waits` → `dynamic-waits`, `simple-table` → `data-table`, etc.) as the practice elements were built out. The sitemap file was never updated to match.

There was also no mechanism enforcing that the sitemap stay in sync with `Blog/elements/` — the two were completely independent files with no shared source of truth.

#### Fix

Audited `Blog/elements/` directory and replaced every slug in `sitemap-links.js` with the actual filename (minus `.md`):

```js
// Before (broken slugs)
{ url: "practice/input" },
{ url: "practice/button" },
{ url: "practice/select" },
{ url: "practice/radio" },
{ url: "practice/window" },
{ url: "practice/waits" },
{ url: "practice/simple-table" },
{ url: "practice/upload-download" },
{ url: "practice/drag" },      // no .md file — removed
{ url: "practice/shadow-dom" }, // no .md file — removed

// After (real filenames from Blog/elements/)
{ url: "practice/input-fields" },
{ url: "practice/buttons" },
{ url: "practice/dropdowns" },
{ url: "practice/radio-checkbox" },
{ url: "practice/tabs-windows" },
{ url: "practice/dynamic-waits" },
{ url: "practice/data-table" },
{ url: "practice/file-upload" },
// drag, drop, sort, slider, shadow-dom removed until .md files exist
```

Also updated `CLAUDE.md` in three places: the `Blog/` directory tree, the Dynamic Practice Pages flow description, and the Slugs naming convention example.

#### Key Takeaways

- The sitemap source of truth for practice slugs is the `Blog/elements/` directory — check it with `ls Blog/elements/` before editing `sitemap-links.js`.
- `generateStaticParams()` in `app/(Practice)/practice/[slug]/page.jsx` reads from `Blog/elements/` directly — if a `.md` file doesn't exist there, the route is not statically generated and should not be in the sitemap.
- Never add a slug to `sitemap-links.js` for a route that doesn't have a `.md` file yet — submit it to Google only when the page is live.
- When renaming a route, grep for the old slug in: `sitemap-links.js`, `CLAUDE.md`, `data/practiceResources.js`, and `componentMapping` in `page.jsx`.

---

### Lesson 005 — `next/script` `id` Prop Prevents Duplicate Script Injection

**Date:** 2026-03-26

#### What Happened

Google Analytics (`gtag.js`) and Umami (`cloud.umami.is/script.js`) were both loading **twice** on every page — confirmed in the Network tab. Two identical requests fired on initial load and again on client-side navigation.

#### Root Cause

The scripts were injected as raw `<script>` tags inside the `<head>` element of the Next.js root layout:

```jsx
<head>
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-..."
  ></script>
</head>
```

Next.js App Router layouts re-evaluate on every client-side navigation. A raw `<script>` tag has no identity — Next.js does not know it already injected this script, so it injects it again on every route change.

#### Fix

Replace raw `<script>` tags with Next.js's `<Script>` component from `next/script`, with a unique `id` prop:

```jsx
import Script from "next/script";

// In RootLayout body — NOT in <head>
<Script
  id="umami-analytics"
  src="https://cloud.umami.is/script.js"
  data-website-id="YOUR_ID"
  strategy="afterInteractive"
/>;
```

The `id` prop is what Next.js uses to deduplicate — it guarantees the script is injected exactly once per session regardless of how many route changes happen.

#### Key Takeaways

- Never use raw `<script>` tags in Next.js App Router layouts for third-party scripts — they re-inject on every navigation.
- `<Script id="...">` from `next/script` is the correct primitive; `id` is mandatory for deduplication.
- Strategy guide: `"afterInteractive"` for analytics (loads after hydration), `"lazyOnload"` for low-priority widgets (loads during idle time).
- Place `<Script>` components in `<body>`, not `<head>` — Next.js manages placement automatically based on strategy.
- To disable a script temporarily: comment out the `<Script>` JSX block. Keep it as a template so re-enabling is one uncomment away.

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
<SiteAlertPopup />;
```

This stopped the client component from being included in every RSC prefetch payload for the home page.

#### Key Takeaways

- Next.js App Router prefetches aggressively by default. On free/hobbyist Vercel tiers this burns through Edge Function quotas fast.
- `prefetch={false}` on `<Link>` is the correct opt-out — it disables the background RSC fetch while keeping normal navigation working.
- Placing client components directly in high-traffic Server Component pages (especially the root landing page) has hidden costs at the RSC prefetch layer — consider whether a client component truly needs to live there.
- When debugging unexpected Vercel Edge invocations, look at RSC prefetch traffic first before assuming real user load.

---

### Lesson 010 — `<nav>` Inside `<nav>` Is Valid — Nested Navs Need `aria-label`

**Date:** 2026-03-26

#### What Happened

The Header component had a top-level `<nav>` (the flex container for the whole header bar) and a second `<nav aria-label="Main navigation">` inside it for the desktop link list. This raised a question: is `<nav>` inside `<nav>` valid HTML?

#### Root Cause

HTML5 allows nested `<nav>` elements. The spec permits having a site-wide `<nav>` as the outer container and a specific `<nav>` for distinct link groups inside. However, without `aria-label`, assistive technologies cannot distinguish multiple `<nav>` landmarks — they'll announce both as simply "navigation", confusing screen reader users who navigate by landmarks.

#### Fix

Added `aria-label="Main navigation"` to the inner desktop nav:

```jsx
<nav aria-label="Main navigation" className="hidden lg:flex items-center gap-4">
  {/* desktop links */}
</nav>
```

The outer `<nav>` that wraps the full header layout does not need a label because it acts as the flex container, not a landmark (though it technically is one). If two unlabeled `<nav>` elements exist, give them both distinct `aria-label` values.

#### Key Takeaways

- Two `<nav>` elements on the same page must each have a distinct `aria-label` — screen readers list landmarks by name.
- An outer `<nav>` used only for layout flex container is a semantic smell — consider using a `<div>` instead to avoid creating an unintended landmark.
- NVDA/VoiceOver announce `<nav>` as a "navigation" landmark — if two exist unlabeled, users can't tell them apart.

---

### Lesson 013 — Central Resource Registry Pattern for Practice Element Metadata

**Date:** 2026-03-26

#### What Happened

Every practice component had `const youtubeLink = ""` hardcoded inline. Adding a YouTube link to any element required opening and editing a specific component file. Difficulty, time estimates, and scenario counts were also hardcoded strings scattered across components.

#### Root Cause

No single source of truth for practice element metadata. Each component was self-contained with its own magic strings, making bulk updates or future data-driven features (e.g. filtering by difficulty) impossible without touching every file.

#### Fix

Created `data/practiceResources.js` — a keyed object indexed by URL slug:

```js
export const practiceResources = {
  "input-fields": {
    difficulty: "Beginner",
    difficultyColor: "green",
    timeMin: 15,
    scenarioCount: 6,
    youtubeUrl: "",           // set when video is published
    relatedElements: ["dropdowns", "forms"],
  },
  // ... one entry per element
};
```

Components import and destructure:
```js
const res = practiceResources["input-fields"];
// res.difficulty, res.timeMin, res.youtubeUrl — all from one file
```

#### Key Takeaways

- Any data that appears in multiple components and needs periodic updates belongs in a central data file, not hardcoded in each component.
- Keying by URL slug ties the data directly to routing — no separate mapping needed.
- Tailwind dynamic class problem applies here too: store full class strings in a lookup (`difficultyStyles`) not constructed at runtime.
- When a YouTube URL is empty string, render "coming soon" text; when it has a value, render a real link — zero component changes needed.

---

### Lesson 012 — `label for` Must Match Input `id` — Mismatch Is a Silent Bug

**Date:** 2026-03-26

#### What Happened

The first input in `InputPage.jsx` had `<Label htmlFor="fullName">` but the `<Input id="movieName">`. The `for`/`id` values didn't match, so clicking the label did nothing and screen readers couldn't associate the label with the input.

#### Root Cause

The label and input were added at different times. The label used a draft name (`fullName`) that was never updated when the input got its real id (`movieName`). No browser error or console warning is thrown — the mismatch fails silently.

#### Fix

```jsx
// Before (broken)
<Label htmlFor="fullName">Enter any movie name</Label>
<Input id="movieName" ... />

// After (fixed)
<Label htmlFor="movieName">Enter any movie name</Label>
<Input id="movieName" ... />
```

#### Key Takeaways

- `htmlFor` must equal the `id` of the target input — any mismatch silently breaks click-to-focus and screen reader association.
- Accessibility audits and automated tests (axe, Playwright `getByLabel`) will catch this; eyeballing the UI will not.
- When renaming an input `id`, always grep for `htmlFor` referencing the old value.

---

### Lesson 011 — Footer `<h3>` Pollutes Practice Page Heading Hierarchy

**Date:** 2026-03-26

#### What Happened

The audit found `<h3>Platform</h3>`, `<h3>Learn</h3>`, `<h3>Company</h3>` in the footer appearing in the page heading outline of practice pages. Since practice pages now have a real `<h1>`, screen readers and crawlers saw h3 footer headings without any intervening h2 — broken hierarchy.

#### Root Cause

Footer section labels were marked as `<h3>` when they were first built (before practice pages had a proper h1/h2 structure). They were styled to look small and subtle but semantically acted as heading landmarks.

#### Fix

Changed footer section labels from `<h3>` to `<h4>`. Visually identical (same Tailwind classes), semantically correct within a page that has h1 → h2 → content structure.

#### Key Takeaways

- Footer heading elements participate in the full page heading outline — they're not isolated.
- Use `<h4>` or a visually styled `<p>` for footer section labels; never `<h2>` or `<h3>` which are too high in the hierarchy.
- When adding a real `<h1>` to a page, audit the full heading tree including footer and nav.

---

### Lesson 009 — `<Link><Button>` in Next.js Renders Invalid `<a><button>` HTML

**Date:** 2026-03-26

#### What Happened

Navigation items in the Header used the pattern `<Link href="..."><Button>Label</Button></Link>`. This compiles to `<a href="..."><button>Label</button></a>` in the DOM — invalid HTML per the spec. Accessibility audits flag this as a High-severity issue.

#### Root Cause

The HTML spec forbids interactive elements inside other interactive elements. `<a>` and `<button>` are both interactive — nesting them produces undefined behavior in browsers and confuses screen readers (which element is the actual interactive control?). Tab order becomes ambiguous.

The pattern is tempting in Next.js + shadcn/ui because `<Button variant="ghost">` provides convenient hover/focus styles that `<Link>` does not inherently have.

#### Fix

Two options:

1. **Use `<Link>` with direct Tailwind classes** (simplest):
```jsx
<Link
  href={to}
  className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
>
  {text}
</Link>
```

2. **Use shadcn `<Button asChild>`** with `<Link>` as the child (keeps Button styles, correct DOM):
```jsx
<Button variant="ghost" asChild>
  <Link href={to}>{text}</Link>
</Button>
```
The `asChild` pattern merges `<Button>` props onto `<Link>`, rendering a single `<a>` in the DOM.

#### Key Takeaways

- Never wrap `<Button>` inside `<Link>` — it produces `<a><button>`, which is invalid HTML.
- Prefer direct `<Link>` with Tailwind classes for nav items, or use `<Button asChild><Link>` to merge the two into one element.
- shadcn/ui `asChild` is the canonical fix when you need Button styles on a link element.

---

<!-- ADD NEW LESSONS ABOVE THIS LINE -->
<!-- Use the template below when adding a new lesson -->

---

## Authentication

---

### Lesson 006 — Auth Session Dedup — One `useSession()` Per Provider

**Date:** 2026-03-26

#### What Happened

`/api/auth/get-session` was being called **twice** on every Study Tracker page load. The Network tab showed two back-to-back GET requests to the session endpoint on mount.

#### Root Cause

`ResourcesView` — a child of `StudyTrackerProvider` — was calling `authClient.useSession()` independently:

```jsx
// StudyTrackerProvider.jsx — fetches session #1
const { data: session } = authClient.useSession();

// ResourcesView.jsx — fetches session #2 (unnecessary)
const { data: session, isPending } = authClient.useSession();
```

Even with `cookieCache` enabled, two components calling `useSession()` simultaneously on first mount (before the cache is populated) both fire before either result is cached — resulting in two real network requests.

#### Fix

`StudyTrackerProvider` already owns the session. Expose `user` and `sessionPending` via context, and have child components read from context instead of calling `useSession()` directly:

```jsx
// StudyTrackerProvider.jsx
const { data: session, isPending: sessionPending } = authClient.useSession();
const user = session?.user;
// expose in context value: { user, sessionPending, ... }

// ResourcesView.jsx — now reads from context
const { user, sessionPending: isPending } = useTracker(); // ✓ no extra network call
```

#### Key Takeaways

- `useSession()` should be called exactly **once** per component tree — in the nearest shared context provider.
- All child components should consume session state via context (`useTracker()`, `useAuth()`, etc.), never by calling `useSession()` independently.
- This applies even when `cookieCache` is enabled — the cache is populated after the first response, so simultaneous cold-mount calls still both fire.
- When auditing duplicate `/get-session` calls: grep for `useSession` across the codebase and count the call sites.

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
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-pg",
  ],
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

---

### Lesson 007 — JSX Comment Nesting Trap Silently Swallows Content

**Date:** 2026-03-26

#### What Happened

Several commented-out script blocks in `app/layout.js` appeared correctly commented in the editor, but the Google Analytics label `{/* Google tag (gtag.js) */}` was silently consumed by the Buy Me Coffee comment block above it. The stray `*/` text was also rendering as literal text in the HTML `<head>`.

#### Root Cause

JSX comments (`{/* ... */}`) do not nest. The `{/*` on line 64 opened a comment but had no `*/}` to close it before line 78. Line 78 contained `{/* Google tag (gtag.js) */}` — the `*/` inside this expression closed the **outer** comment from line 64, not a new inner one. Everything between lines 64 and 78 became one giant single comment block, swallowing both the BMC script and the GA label:

```jsx
{/* <script src="buy-me-coffee.js">    ← opens comment, never closed

{/* Google tag (gtag.js) */}           ← the */ here closes the OUTER comment
                                        ← all content between is silently consumed
```

The remaining `}` after the `*/` then orphaned a stray `*/` on the next line which rendered as text in `<head>`.

#### Fix

Rewrote all commented-out script blocks as **single-line** `{/* ... */}` entries — each self-contained, impossible to accidentally merge:

```jsx
{
  /* Buy Me Coffee — replaced with inline button in hero.jsx */
}
{
  /* <script type="text/javascript" src="https://cdnjs.buymeacoffee.com/..."></script> */
}

{
  /* Google Analytics — disabled */
}
{
  /* <script async src="https://www.googletagmanager.com/gtag/js?id=G-..."></script> */
}
```

#### Key Takeaways

- JSX `{/* */}` block comments do not nest — the first `*/` found anywhere closes the outermost open comment.
- Multi-line commented-out JSX blocks are a trap: always verify `*/}` is present before starting another `{/*`.
- Safest practice: keep each disabled code block on a single line inside its own `{/* ... */}`.
- Symptom to watch for: commented-out code disappearing in the rendered HTML, or stray `*/` appearing as text content.

---

### Lesson 008 — Tailwind Dynamic Classes Require a Lookup Map

**Date:** 2026-03-26

#### What Happened

A `SECONDARY_GRID_POSTS` constant was added to control how many posts appear in the blog secondary grid. Setting it to `3` had no visible effect on the layout — the grid stayed at 2 columns.

#### Root Cause

The grid column class was constructed dynamically:

```jsx
// This does NOT work
className={`grid grid-cols-${SECONDARY_GRID_POSTS}`}
```

Tailwind's build step statically scans source files for complete class name strings. A template literal like `` `grid-cols-${n}` `` is never seen as `grid-cols-3` by the compiler — only the raw string `grid-cols-3` qualifies. The dynamically constructed class is purged from the CSS bundle and has no effect at runtime.

#### Fix

Use a lookup object where every value is a complete, literal class string — Tailwind sees all of them at build time:

```jsx
const SECONDARY_GRID_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

<ul
  className={`grid ${SECONDARY_GRID_COLS[SECONDARY_GRID_POSTS] ?? SECONDARY_GRID_COLS[2]} gap-6`}
/>;
```

#### Key Takeaways

- Tailwind is a **static** CSS generator — it cannot respond to runtime values.
- Any class built with string interpolation, concatenation, or template literals will be purged.
- The fix is always the same: a lookup map with full literal strings as values.
- This applies to any dynamic Tailwind value: colors (`text-${color}-500`), spacing (`p-${size}`), columns (`grid-cols-${n}`), etc.
- If a Tailwind class has no visible effect, check whether it is being constructed dynamically.

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
