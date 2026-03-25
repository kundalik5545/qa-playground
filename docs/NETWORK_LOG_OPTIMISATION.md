You are working on a Next.js web application at `qaplayground.com`. A network audit has been performed on both the **homepage** (`/`) and the **study-tracker dashboard** (`/study-tracker/dashboard`). Please fix all of the following issues across the entire application:

---

## 1. Fix Duplicate RSC (React Server Component) Prefetch Requests

**Problem:** Multiple routes are fetched repeatedly on a single page load due to aggressive prefetching. This is happening on BOTH the homepage and dashboard.

**Homepage (`/`) excessive prefetches:**

- `/practice` — fetched **6 times** (requests 120, 124–127, 131)
- `/` (homepage itself) — fetched **5 times** (requests 56, 65–67, 121, 133–134)

**Dashboard excessive prefetches (also present on homepage load):**

- `/study-tracker/resources` — fetched **5 times**
- `/study-tracker/syllabus` — fetched **4 times**
- `/study-tracker/daily-tracker` — fetched **4 times**
- `/study-tracker/dashboard` — fetched **4 times**
- `/study-tracker/syllabus/playwright`, `/manual`, `/performance`, `/api` — each fetched **2 times**

**Fix:**

- Find all `<Link>` components across the entire app and set `prefetch={false}` on non-critical navigation links, or use `prefetch="intent"` (Next.js 14+) to only prefetch on hover.
- Ensure RSC routes return proper HTTP cache headers (e.g. `Cache-Control: private, max-age=30`) so repeated fetches are served from cache.
- Check if any `useEffect`, `router.prefetch()`, or data-fetching hooks are triggering duplicate calls for the same route and deduplicate them.
- Pay special attention to the navigation/sidebar component — it is likely triggering prefetch for all nav links simultaneously on mount.

---

## 2. Remove Duplicate Script Loads for Analytics

**Problem:** Two analytics scripts are loaded **twice** on every page (both homepage and dashboard):

- `https://www.googletagmanager.com/gtag/js?id=G-Z4H9RTYGS4` — loaded **twice per page**
- `https://cloud.umami.is/script.js` — loaded **twice per page**

**Fix:**

- Search the codebase for all places where these scripts are injected (likely in `_app.tsx`, `layout.tsx`, or a custom `<Head>` component).
- Ensure each script exists in exactly **one** place — the root layout (`app/layout.tsx` or `pages/_app.tsx`).
- Use Next.js `<Script>` component with `strategy="afterInteractive"` and a unique `id` prop to prevent duplicate injection:

```tsx
<Script
  id="google-analytics"
  src="https://www.googletagmanager.com/gtag/js?id=G-Z4H9RTYGS4"
  strategy="afterInteractive"
/>
```

---

## 3. Consolidate Analytics — Remove One of Two Trackers

**Problem:** Both Google Analytics (GTM) and Umami are running simultaneously on every page, creating redundant tracking overhead (4 requests + POST pings per page load, confirmed on both homepage and dashboard).

**Fix:**

- Decide on **one** analytics provider. Umami is recommended as it is privacy-friendly, lightweight, and self-hostable.
- Remove all references to the unused provider from `layout.tsx` / `_app.tsx` / any custom `Analytics` component.
- If keeping Umami, remove all GTM/GA related code including the `gtag()` initialisation script and all `dataLayer` push calls.

---

## 4. Fix Google Analytics POST Returning 503

**Problem (Homepage-specific):** The Google Analytics data collection endpoint is returning a **503 error**:

- `POST https://www.google-analytics.com/g/collect?v=2&tid=G-Z4H9RTYGS4&...` → **503**

This means GA data is not being collected despite the script loading. This also confirms GA is expendable — Umami is working correctly.

**Fix:**

- If keeping GA: investigate whether the measurement ID `G-Z4H9RTYGS4` is correctly configured in the GA4 console.
- Recommended: remove GA entirely and rely solely on Umami (see Fix #3).

---

## 5. Lazy-Load or Replace Usercentrics Consent Management Platform

**Problem:** Usercentrics loads **10 separate network requests** on every page (confirmed on both homepage and dashboard), significantly delaying Time To Interactive:

- `app.usercentrics.eu/browser-ui/latest/loader.js`
- `app.usercentrics.eu/browser-ui/3.95.0/index.module.js`
- `app.usercentrics.eu/browser-ui/3.95.0/DefaultData-*.js`
- `app.usercentrics.eu/browser-ui/3.95.0/DefaultUI-*.js`
- `app.usercentrics.eu/browser-ui/3.95.0/FirstLayerCustomization-*.js`
- `app.usercentrics.eu/browser-ui/3.95.0/ButtonsCustomization-*.js`
- `app.usercentrics.eu/browser-ui/3.95.0/SecondLayerUI-*.js`
- `api.usercentrics.eu/settings/*/latest/en.json`
- `api.usercentrics.eu/translations/translations-en.json`
- `app.usercentrics.eu/session/1px.png`

**Fix:**

- Delay loading by using Next.js `<Script strategy="lazyOnload">`:

```tsx
<Script
  id="usercentrics-cmp"
  src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
  data-settings-id="RCGf52YH07pmK7"
  strategy="lazyOnload"
/>
```

- Or replace with a lightweight self-hosted cookie consent solution to eliminate all 10 external requests.

---

## 6. Replace "Buy Me a Coffee" External Widget with a Static Link

**Problem:** The Buy Me a Coffee embed loads an external JS script and image on every page (confirmed on both homepage and dashboard):

- `cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js`
- `cdn.buymeacoffee.com/buttons/v2/default-yellow.png`

**Fix:**

- Remove the `<script src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js">` embed.
- Replace with a plain styled anchor tag:

```tsx
<a
  href="https://www.buymeacoffee.com/YOUR_USERNAME"
  target="_blank"
  rel="noopener noreferrer"
  className="bmc-button"
>
  ☕ Buy me a coffee
</a>
```

- Style it with Tailwind or your existing CSS to match the current appearance.

---

## 7. Self-Host the "Cookie" Google Font

**Problem:** The `Cookie` font is loaded from external Google servers on every page (both homepage and dashboard):

- `fonts.googleapis.com/css?family=Cookie&display=swap`
- `fonts.gstatic.com/s/cookie/v23/syky-y18lb0tSbf9kgqS.woff2`

Other fonts are already self-hosted in `/_next/static/media/`. This font should follow the same pattern.

**Fix:**

- Download the `Cookie` font woff2 file.
- Place it in `public/fonts/` or alongside other fonts.
- Add a `@font-face` rule in your global CSS:

```css
@font-face {
  font-family: "Cookie";
  src: url("/fonts/cookie.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
```

- Remove the `<link>` tag referencing `fonts.googleapis.com` from your root layout.

---

## 8. Fix 503 Error on Automation Syllabus Route

**Problem:** `GET /study-tracker/syllabus/automation?_rsc=*` consistently returns **503 Service Unavailable** (seen on both homepage and dashboard loads).

**Fix:**

- Investigate the route handler or page component at `app/study-tracker/syllabus/automation/`.
- Check server logs for the root cause (likely a failed API call, missing data, or a crashed async function).
- Add proper error boundaries and fallback UI so a failure here returns a user-friendly error page instead of a 503.
- Wrap data-fetching logic in try/catch with a graceful fallback:

```tsx
try {
  const data = await fetchAutomationSyllabus();
  return <AutomationSyllabus data={data} />;
} catch (error) {
  return <ErrorFallback message="Automation syllabus unavailable" />;
}
```

---

## 9. Fix Duplicate Auth Session Call

**Problem:** `GET /api/auth/get-session` is called **twice** on every page load (confirmed on both homepage and dashboard).

**Fix:**

- Find all components and hooks calling `get-session` (likely `useSession()` from NextAuth or a custom auth hook).
- Ensure session fetching is done **once** at root layout level and shared via React context, not triggered independently by multiple child components.
- If using NextAuth, verify `<SessionProvider>` wraps the app exactly once in `layout.tsx` and that no child component is independently calling `getSession()` or `fetch('/api/auth/get-session')`.

---

## 10. Remove Inline SVG Data URI (Homepage + Dashboard)

**Problem:** An X/close icon is rendered as a `data:image/svg+xml` URL loaded via network request on every page:

```
data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%2020'...
```

**Fix:**

- Replace the `<img src="data:image/svg+xml,...">` usage with an inline `<svg>` JSX component or import it as a React SVG component:

```tsx
// Instead of <img src="data:image/svg+xml...">
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="gray"
    className="w-5 h-5"
  >
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72..." />
  </svg>
);
```

- This eliminates the network request entirely and improves rendering performance.

---

## 11. Add Cache-Control Headers for Static RSC Routes (Homepage-Specific)

**Problem (Homepage-specific):** The `/practice` route is being prefetched **6 times** on homepage load alone. This, combined with missing cache headers, means the server processes the same request multiple times.

**Fix:**

- Add `Cache-Control` headers to the `/practice` page and other static-ish RSC routes:

```tsx
// In app/practice/page.tsx
export const revalidate = 60; // ISR — revalidate every 60 seconds
```

- Or set response headers in the route handler:

```tsx
  headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
```

---

## Summary of Expected Request Savings

| Issue                                    | Requests Saved Per Page Load |
| ---------------------------------------- | ---------------------------- |
| Fix duplicate RSC prefetches (homepage)  | ~10 requests                 |
| Fix duplicate RSC prefetches (dashboard) | ~20 requests                 |
| Remove duplicate analytics script loads  | 2 requests                   |
| Remove one analytics provider (GA)       | 2–3 requests                 |
| Lazy-load Usercentrics (deferred)        | 10 requests deferred         |
| Replace Buy Me a Coffee widget           | 2 requests                   |
| Self-host Cookie font                    | 2 requests                   |
| Fix duplicate auth session call          | 1 request                    |
| Remove data URI SVG network call         | 1 request                    |
| Fix 503 on automation syllabus           | 1 broken route fixed         |
| Cache `/practice` RSC route              | 5 redundant requests         |

**Total estimated savings: ~60 fewer network requests per page load across homepage and dashboard.**

Please make all changes incrementally and verify the browser Network tab after each fix to confirm request counts are reduced.
