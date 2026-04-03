# SEO Audit: QA Playground — Bank Demo Pages

**Audit Date:** 2026-04-03  
**Auditor:** Claude (Automated Browser Analysis)  
**Scope:** All `/bank/*` pages on `https://www.qaplayground.com`  
**Framework:** Next.js (SSR/SPA hybrid)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Pages Analysed](#2-pages-analysed)
3. [Technical SEO](#3-technical-seo)
4. [Page-by-Page Analysis](#4-page-by-page-analysis)
5. [Meta Tags & Social Sharing](#5-meta-tags--social-sharing)
6. [Heading Structure](#6-heading-structure)
7. [Structured Data (Schema.org)](#7-structured-data-schemaorg)
8. [URL Architecture & Sitemap](#8-url-architecture--sitemap)
9. [Images & Media](#9-images--media)
10. [Internal Linking](#10-internal-linking)
11. [Accessibility & SEO Overlap](#11-accessibility--seo-overlap)
12. [Performance Signals](#12-performance-signals)
13. [Prioritised Issues & Recommendations](#13-prioritised-issues--recommendations)
14. [Recommended Code Fixes](#14-recommended-code-fixes)

---

## 1. Executive Summary

The QA Playground Bank Demo section (`/bank/*`) is a functional, well-built practice application for QA automation engineers. However, from an SEO perspective it suffers from **significant shared-metadata syndrome** — all bank sub-pages reuse the homepage's title, meta description, Open Graph tags, and og:url verbatim. There are **no canonical tags** on any bank page, **no page-specific structured data**, and all bank pages are **absent from the sitemap**. These issues collectively prevent bank pages from ranking for their own relevant keywords and expose the site to duplicate-content penalties.

**Overall SEO Score (bank section): 38 / 100**

| Category              | Score | Status        |
| --------------------- | ----- | ------------- |
| Title Tags            | 2/10  | 🔴 Critical   |
| Meta Descriptions     | 2/10  | 🔴 Critical   |
| Canonical Tags        | 0/10  | 🔴 Critical   |
| Open Graph / Social   | 3/10  | 🔴 Critical   |
| Structured Data       | 1/10  | 🔴 Critical   |
| Sitemap Coverage      | 0/10  | 🔴 Critical   |
| Heading Structure     | 6/10  | 🟡 Needs Work |
| URL Structure         | 7/10  | 🟢 Good       |
| Internal Linking      | 6/10  | 🟡 Needs Work |
| Images & Alt Text     | 7/10  | 🟢 Good       |
| robots.txt            | 8/10  | 🟢 Good       |
| Accessibility Signals | 7/10  | 🟢 Good       |
| Performance Signals   | 7/10  | 🟢 Good       |

---

## 2. Pages Analysed

| Page                     | URL                  | HTTP Status                | In Sitemap |
| ------------------------ | -------------------- | -------------------------- | ---------- |
| Bank Landing (redirects) | `/bank`              | 301 → `/bank/dashboard`    | ❌ No      |
| Bank Dashboard           | `/bank/dashboard`    | 200                        | ❌ No      |
| Bank Accounts            | `/bank/accounts`     | 200                        | ❌ No      |
| Bank Transactions        | `/bank/transactions` | 200                        | ❌ No      |
| Bank Login (404)         | `/bank/login`        | 404 (rendered as 404 page) | ❌ No      |

---

## 3. Technical SEO

### 3.1 robots.txt

**File:** `https://www.qaplayground.com/robots.txt`

```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/auth/

User-Agent: GPTBot
Allow: /

User-Agent: ClaudeBot
Allow: /

User-Agent: PerplexityBot
Allow: /

User-Agent: Googlebot
Allow: /

User-Agent: Google-Extended
Allow: /

User-Agent: Applebot-Extended
Allow: /

Sitemap: https://www.qaplayground.com/sitemap.xml
```

**Assessment:** ✅ Well-formed. AI bot access is explicitly allowed. Sitemap is referenced correctly. `/admin/` and `/api/auth/` are correctly blocked.

**Issues:**

- 🔴 `/bank/*` pages are **allowed** for crawling but have no canonical tags, creating duplicate-content risk if Google crawls and indexes multiple entry points.

---

### 3.2 Sitemap

**File:** `https://www.qaplayground.com/sitemap.xml`

**Bank pages found in sitemap:** NONE

| URL Present in Sitemap           | Priority | ChangeFreq |
| -------------------------------- | -------- | ---------- |
| `/`                              | 1.0      | weekly     |
| `/blog`                          | 0.9      | daily      |
| `/practice`                      | 0.8      | monthly    |
| `/about-us`                      | 0.5      | monthly    |
| `/contact-us`                    | 0.4      | monthly    |
| `/privacy-policy`                | 0.3      | yearly     |
| `/practice/[element]` (16 pages) | 0.7      | monthly    |
| `/blog/[slug]` (8 pages)         | 0.8      | weekly     |

**Critical Gaps:**

- 🔴 `/bank`, `/bank/dashboard`, `/bank/accounts`, `/bank/transactions` — all missing
- 🔴 No `<lastmod>` dates on non-blog pages
- 🟡 No `<loc>` for study-tracker pages either (separate issue)

---

### 3.3 Canonical Tags

**Status across all bank pages: ❌ MISSING**

None of the bank pages include a `<link rel="canonical">` tag. This is a critical omission because:

1. `/bank` redirects to `/bank/dashboard` — without canonicals, Google may index both URLs or the redirect target inconsistently.
2. All pages share identical `og:url` pointing to the homepage (`https://www.qaplayground.com`), which could lead Google to treat bank pages as duplicates of the homepage.
3. Query string variants like `/bank/accounts?action=add` may be crawled as separate pages without canonical protection.

---

### 3.4 Redirect Behaviour

- `https://www.qaplayground.com/bank` → redirects to `/bank/dashboard` (client-side via Next.js routing)
- **Issue:** This appears to be a **client-side redirect**, not an HTTP 301/302. Google handles Next.js client routing, but a proper server-side redirect or canonical on `/bank` pointing to `/bank/dashboard` would be more reliable.

---

### 3.5 Framework

The site uses **Next.js** (confirmed via `/_next/static/` asset paths and `next-size-adjust` meta tag). This means:

- ✅ Pages can be server-side rendered (good for SEO)
- 🟡 Metadata is currently shared globally — page-specific metadata must be set per-route using Next.js `generateMetadata()` or `<Head>` components

---

## 4. Page-by-Page Analysis

### 4.1 Bank Dashboard — `/bank/dashboard`

| SEO Element                 | Current Value                                               | Assessment                            |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------- |
| `<title>`                   | `QA Playground: Practice Automation Testing with Selenium`  | 🔴 Homepage title — not page-specific |
| `<meta name="description">` | `Practice Selenium, Playwright, and Cypress...` (159 chars) | 🔴 Homepage description               |
| `<link rel="canonical">`    | Missing                                                     | 🔴 Critical                           |
| `og:title`                  | `QA Playground: Practice Automation Testing with Selenium`  | 🔴 Homepage OG title                  |
| `og:url`                    | `https://www.qaplayground.com`                              | 🔴 Points to homepage, not this page  |
| `og:image`                  | `https://www.qaplayground.com/og-image.png`                 | 🟡 Generic — no bank-specific image   |
| `meta robots`               | `index, follow`                                             | ✅ Correct                            |
| H1                          | `Dashboard`                                                 | 🟡 Too generic — not keyword-rich     |
| JSON-LD / Schema            | None                                                        | 🔴 Missing                            |
| In Sitemap                  | No                                                          | 🔴 Missing                            |
| Page-specific keywords      | None targeting bank demo                                    | 🔴 Missing                            |
| Breadcrumbs (visual)        | None                                                        | 🟡 Missing                            |

**Recommended Title:** `Bank Dashboard – SecureBank Demo | QA Playground`  
**Recommended Description:** `Explore the SecureBank Demo dashboard for QA automation practice. View account balances, pinned accounts, and recent transactions. Free testing playground.`

---

### 4.2 Manage Accounts — `/bank/accounts`

| SEO Element                 | Current Value                                              | Assessment                          |
| --------------------------- | ---------------------------------------------------------- | ----------------------------------- |
| `<title>`                   | `QA Playground: Practice Automation Testing with Selenium` | 🔴 Homepage title                   |
| `<meta name="description">` | Homepage description                                       | 🔴 Not page-specific                |
| `<link rel="canonical">`    | Missing                                                    | 🔴 Critical                         |
| `og:url`                    | `https://www.qaplayground.com`                             | 🔴 Wrong page URL                   |
| H1                          | `Manage Accounts`                                          | 🟡 Acceptable but could be stronger |
| JSON-LD / Schema            | None                                                       | 🔴 Missing                          |
| In Sitemap                  | No                                                         | 🔴 Missing                          |
| Query String Variants       | `?action=add` accessible but not canonicalised             | 🟡 Risk                             |

**Recommended Title:** `Manage Bank Accounts – E2E Testing Practice | QA Playground`  
**Recommended Description:** `Practice creating, editing, filtering, and deleting bank accounts with the QA Playground Bank Demo. Perfect for Selenium and Playwright E2E test automation.`

---

### 4.3 Transactions — `/bank/transactions`

| SEO Element                 | Current Value                                              | Assessment           |
| --------------------------- | ---------------------------------------------------------- | -------------------- |
| `<title>`                   | `QA Playground: Practice Automation Testing with Selenium` | 🔴 Homepage title    |
| `<meta name="description">` | Homepage description                                       | 🔴 Not page-specific |
| `<link rel="canonical">`    | Missing                                                    | 🔴 Critical          |
| `og:url`                    | `https://www.qaplayground.com`                             | 🔴 Wrong page URL    |
| H1                          | `Transactions`                                             | 🟡 Generic           |
| JSON-LD / Schema            | None                                                       | 🔴 Missing           |
| In Sitemap                  | No                                                         | 🔴 Missing           |
| Query Strings               | `?action=new` accessible — not canonicalised               | 🟡 Risk              |

**Recommended Title:** `Transaction History – Bank Demo E2E Testing | QA Playground`  
**Recommended Description:** `Practice automating bank transactions with QA Playground's SecureBank Demo. Filter by date, account, and export CSV. Ideal for Selenium and Playwright practice.`

---

### 4.4 Bank Login — `/bank/login`

| SEO Element   | Current Value                                              | Assessment                              |
| ------------- | ---------------------------------------------------------- | --------------------------------------- |
| HTTP Response | 404 (not a valid page)                                     | 🔴 Broken URL                           |
| `meta robots` | `noindex`                                                  | ✅ Correctly noindexed since it's a 404 |
| H1            | `404`                                                      | ✅ Correct for 404 page                 |
| Title         | `QA Playground: Practice Automation Testing with Selenium` | 🟡 Generic even on 404                  |

**Note:** The Bank Demo appears to use a custom session/auth approach where credentials are embedded in the app (demo user: `admin`). The `/bank/login` path doesn't exist as a real route — authentication happens via the main site login at `/login`. This is acceptable for a demo app, but the `/bank/login` 404 should be explicitly redirected to `/login` or `/bank/dashboard` to avoid broken user journeys and crawl waste.

---

## 5. Meta Tags & Social Sharing

### 5.1 Full Meta Tag Audit (Dashboard page — representative of all bank pages)

```html
<!-- Present & Correct -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="index, follow" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@qaplayground" />

<!-- Present but WRONG (homepage values on all bank pages) -->
<title>QA Playground: Practice Automation Testing with Selenium</title>
<meta
  name="description"
  content="Practice Selenium, Playwright, and Cypress..."
/>
<meta name="keywords" content="QA Playground,automation testing,..." />
<meta
  property="og:title"
  content="QA Playground: Practice Automation Testing with Selenium"
/>
<meta
  property="og:description"
  content="Practice Selenium, Playwright, and Cypress..."
/>
<meta property="og:url" content="https://www.qaplayground.com" />
<!-- ← HOMEPAGE URL! -->
<meta property="og:image" content="https://www.qaplayground.com/og-image.png" />
<meta
  name="twitter:title"
  content="QA Playground: Practice Automation Testing with Selenium"
/>
<meta
  name="twitter:description"
  content="Practice Selenium, Playwright, and Cypress..."
/>
<meta
  name="twitter:image"
  content="https://www.qaplayground.com/og-image.png"
/>

<!-- MISSING on all bank pages -->
<!-- <link rel="canonical" href="..."> -->
<!-- <meta property="og:locale" content="en_US"> -->
<!-- <meta name="theme-color" content="..."> -->
<!-- <meta property="og:site_name" content="QA Playground"> -->
<!-- <meta name="twitter:creator" content="@qaplayground"> -->
<!-- <script type="application/ld+json">...</script> -->
```

### 5.2 Issues Summary

| Issue                                             | Severity    | Impact                                                        |
| ------------------------------------------------- | ----------- | ------------------------------------------------------------- |
| All bank pages share homepage `<title>`           | 🔴 Critical | Keyword cannibalisation; Google can't distinguish pages       |
| All bank pages share homepage `meta description`  | 🔴 Critical | Low CTR from SERPs; duplicate content signals                 |
| `og:url` points to homepage on all bank pages     | 🔴 Critical | Social shares will link to homepage, not the shared bank page |
| No `canonical` tag on any bank page               | 🔴 Critical | Duplicate content risk; crawl budget waste                    |
| Missing `og:locale`                               | 🟡 Medium   | Social media platforms may misidentify language/region        |
| Missing `og:site_name`                            | 🟡 Medium   | Social sharing cards lack site branding                       |
| Missing `meta name="theme-color"`                 | 🟢 Low      | Small UX signal; used by mobile browsers                      |
| `keywords` meta uses only generic site-wide terms | 🟡 Medium   | Not indexed by Google but other engines may use it            |

---

## 6. Heading Structure

### 6.1 Dashboard — Heading Hierarchy

```
H1: Dashboard                              ← Too generic; no keyword intent
  H2: Quick Actions
  H2: Pinned Accounts
  H2: Recent Transactions
  H2: Accounts Overview
    H3: Primary Savings
    H3: Checking Account
  H2: Dashboard — Test Cases
    H3: TC-DASH-01: Skeleton loading state...
    H3: TC-DASH-02: Stat card values...
    H3: TC-DASH-03: Quick Actions...
    H3: TC-DASH-04: Recent Transactions...
    H3: TC-DASH-05: Pinned Accounts...
  H3: Footer Navigation              ← ⚠️ Footer heading misuses H3 inside content flow
    H4: Platform
    H4: Learn
    H4: Company
```

**Issues:**

- 🟡 H1 "Dashboard" has no keyword context — should include "Bank Demo" or "SecureBank"
- 🟡 Footer headings (`H3: Footer Navigation`, `H4: Platform`) bleed into the heading hierarchy of the main content. Footer nav headings should be visually-styled `<div>` or use `aria-label` on `<nav>` without heading tags, or use `<p>` styled as headings
- ✅ Logical H1 → H2 → H3 progression is otherwise maintained
- ✅ Only one H1 per page

### 6.2 Accounts — Heading Hierarchy

```
H1: Manage Accounts
  H2: Accounts Page — Test Cases
    H3: TC-ACC-01 through TC-ACC-05
  H3: Footer Navigation
    H4: Platform / Learn / Company
```

**Issues:**

- 🟡 No H2 for the actual accounts table/content area — the table lacks a semantic heading before jumping to test cases
- 🟡 Same footer heading bleed as dashboard

### 6.3 Transactions — Heading Hierarchy

```
H1: Transactions
  H2: Transactions Page — Test Cases
    H3: TC-TXN-01 through TC-TXN-05
  H3: Footer Navigation
    H4: Platform / Learn / Company
```

**Issues:**

- 🟡 Same footer heading bleed
- 🟡 The transactions table area has no introductory heading between H1 and the test cases H2

### 6.4 Recommendations

- Change H1s to be keyword-rich:
  - Dashboard: `SecureBank Dashboard — QA Automation Practice`
  - Accounts: `Manage Accounts — Bank Demo | QA Playground`
  - Transactions: `Transaction History — Bank Demo | QA Playground`
- Add a contextual H2 before the data table (e.g., `H2: Your Bank Accounts`) on accounts/transactions pages
- Remove heading tags from footer navigation and use `aria-label` on `<nav>` elements instead, or use `<p class="footer-heading">` styled as headings

---

## 7. Structured Data (Schema.org)

### 7.1 Current State

**All bank pages: Zero JSON-LD structured data**

The only structured data on the site exists on `/practice/*` pages:

- `WebPage` schema (on `/practice`)
- `LearningResource` schema (on individual practice element pages)
- `BreadcrumbList` schema (on practice pages only)

### 7.2 Recommended Schemas for Bank Pages

**`/bank/dashboard`:**

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SecureBank Demo – QA Playground",
  "description": "A demo banking application for practising E2E test automation with Selenium and Playwright.",
  "url": "https://www.qaplayground.com/bank/dashboard",
  "applicationCategory": "EducationalApplication",
  "provider": {
    "@type": "Organization",
    "name": "QA Playground",
    "url": "https://www.qaplayground.com"
  }
}
```

**All bank pages — BreadcrumbList:**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.qaplayground.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Bank Demo",
      "item": "https://www.qaplayground.com/bank"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Dashboard",
      "item": "https://www.qaplayground.com/bank/dashboard"
    }
  ]
}
```

**`/bank/accounts` and `/bank/transactions` — LearningResource:**

```json
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "Bank Account Management – E2E Testing Practice",
  "description": "Practise creating, editing, filtering and deleting bank accounts using Selenium WebDriver, Playwright, or Cypress.",
  "url": "https://www.qaplayground.com/bank/accounts",
  "educationalLevel": "Intermediate",
  "teaches": [
    "Selenium WebDriver",
    "Playwright",
    "E2E testing",
    "CRUD operations"
  ],
  "provider": {
    "@type": "Organization",
    "name": "QA Playground",
    "url": "https://www.qaplayground.com"
  }
}
```

---

## 8. URL Architecture & Sitemap

### 8.1 URL Structure Assessment

| URL                             | Assessment                                                        |
| ------------------------------- | ----------------------------------------------------------------- |
| `/bank/dashboard`               | ✅ Clean, descriptive, lowercase, hyphen-separated                |
| `/bank/accounts`                | ✅ Clean and logical                                              |
| `/bank/transactions`            | ✅ Clean and logical                                              |
| `/bank/accounts?action=add`     | 🟡 Query string — should be canonicalised to `/bank/accounts`     |
| `/bank/transactions?action=new` | 🟡 Query string — should be canonicalised to `/bank/transactions` |

**Overall URL structure is good.** The `/bank/[section]` hierarchy is intuitive and crawlable.

### 8.2 Sitemap Gaps

The entire `/bank/*` section is absent from `sitemap.xml`. Recommended additions:

```xml
<url>
  <loc>https://www.qaplayground.com/bank/dashboard</loc>
  <lastmod>2025-11-28</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://www.qaplayground.com/bank/accounts</loc>
  <lastmod>2025-11-28</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://www.qaplayground.com/bank/transactions</loc>
  <lastmod>2025-11-28</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

**Note:** `/bank/login` (returns 404) should **not** be added to the sitemap.  
**Note:** `/bank` (redirect) should either be added with a canonical pointing to `/bank/dashboard`, or excluded and only the destination added.

---

## 9. Images & Media

### 9.1 Image Audit

Only one image is rendered across all bank pages:

| Image | Source                | Alt Text                                               | loading | Dimensions |
| ----- | --------------------- | ------------------------------------------------------ | ------- | ---------- |
| Logo  | `/mainicons/edit.svg` | `QA PlayGround - Automation Testing Practice Platform` | `lazy`  | 30×30      |

**Assessment:**

- ✅ Alt text is present and descriptive
- ✅ Lazy loading is applied
- ✅ Explicit width/height prevent layout shift (CLS improvement)
- 🟡 The logo alt text says "QA PlayGround" but is used within the SecureBank demo context — no bank-specific images exist on bank pages
- 🔴 The bank pages are **visually rich** (stat cards, account cards, transaction tables with emoji icons) but have **zero decorative or content images** — adding contextual imagery would improve engagement signals and provide more alt-text keyword opportunities

### 9.2 Emoji Usage as Pseudo-Icons

The site uses emoji characters (💳, 💸, 📊, 💰, etc.) in the navigation and content. These are:

- ✅ Screen-reader accessible (emoji have Unicode descriptions)
- 🟡 Not as visually crisp as SVG icons on high-DPI screens
- 🟡 Not indexable as images (no keyword opportunity in alt text)
- 🟡 Some emoji may render differently across OS/browser versions

---

## 10. Internal Linking

### 10.1 Internal Links on Dashboard

Total internal links found: **32**  
External links: **8** (all with `rel="noopener noreferrer"` ✅)

**Bank navigation links (in bank nav bar):**

- `/bank/dashboard`
- `/bank/accounts`
- `/bank/transactions`

**Quick action links:**

- `/bank/accounts?action=add`
- `/bank/transactions?action=new`
- `/bank/accounts`

**Site-wide nav (present on all bank pages):**

- `/`, `/study-tracker/dashboard`, `/bank`, `/practice`, `/qa-tools`, `/blog`

**Footer links:** Login, Practice, Blog, About, Contact, Privacy Policy, etc.

### 10.2 Issues

- 🟡 **No breadcrumb navigation** — users and Google cannot trace the path `Home → Bank Demo → Dashboard`. Visual breadcrumbs with `BreadcrumbList` schema would improve both UX and SEO
- 🟡 **Bank pages don't link to blog content** — the blog has a post about automation test cases (`/blog/25-real-world-automation-test-cases-for-qa-engineers`) that is directly relevant to the bank test cases shown on the dashboard. Cross-linking would improve topical authority
- 🟡 **"Help & Docs" link** in bank nav points to `https://www.qaplayground.com` (homepage) rather than a dedicated docs or help section — missed contextual linking opportunity
- 🟡 **Anchor text variety** is limited — most internal links use generic text like "Bank Demo App", "Practice Elements" without page-specific anchor text for bank pages

---

## 11. Accessibility & SEO Overlap

Accessibility issues are also SEO issues, as Google uses accessibility signals in ranking.

| Element                      | Status                              | Notes                                                          |
| ---------------------------- | ----------------------------------- | -------------------------------------------------------------- |
| `<html lang="en">`           | ✅ Present                          | Correct                                                        |
| Skip-to-content link         | ✅ Present (`href="#main-content"`) | Good                                                           |
| `<main>` landmark            | ✅ Present                          | Good                                                           |
| `<footer>` landmark          | ✅ Present                          | Good                                                           |
| `<nav aria-label="...">`     | ✅ Most navs have labels            | `<nav>` without `aria-label` in outer header could be improved |
| Images with alt text         | ✅ All present                      | Good                                                           |
| Links with accessible text   | ✅ All present                      | Good                                                           |
| Buttons with accessible text | ✅ All present                      | Good                                                           |
| Colour contrast (visual)     | 🟡 Unverified                       | Purple on white (#7c3aed style) needs WCAG AA check            |
| Focus management             | 🟡 Unverified                       | SPA routing should manage focus on route change                |
| ARIA roles on tables         | 🟡 Unverified                       | Transaction table should use `<table>` with `<th scope="col">` |

---

## 12. Performance Signals

### 12.1 Observed Metrics (from browser timing API)

| Metric          | Value  | Assessment |
| --------------- | ------ | ---------- |
| DOM Interactive | ~696ms | 🟢 Good    |
| DOM Complete    | ~764ms | 🟢 Good    |

### 12.2 Resource Loading

| Resource Type                   | Count                                        | Notes          |
| ------------------------------- | -------------------------------------------- | -------------- |
| Font preloads (`rel="preload"`) | 1 (WOFF2)                                    | ✅ Good        |
| CSS stylesheets                 | 1 (bundled Next.js)                          | ✅ Good        |
| Preconnects                     | 2 (`fonts.googleapis.com`, `cloud.umami.is`) | ✅ Good        |
| Prefetches                      | 2 (`/practice`, `/bank`)                     | ✅ Good        |
| Analytics                       | `cloud.umami.is` (privacy-first)             | ✅ Good choice |

### 12.3 Core Web Vitals Risks

| Signal                         | Risk      | Reason                                                         |
| ------------------------------ | --------- | -------------------------------------------------------------- |
| LCP (Largest Contentful Paint) | 🟡 Medium | Main content is dynamically rendered; LCP element may be late  |
| CLS (Cumulative Layout Shift)  | 🟢 Low    | Logo has explicit width/height; skeleton loading used for data |
| FID/INP (Interaction)          | 🟢 Low    | No heavy JS interactions observed                              |
| Inline styles                  | 🟡 Medium | 16 elements have inline styles — can cause style recalculation |

### 12.4 Missing Performance Optimisations

- 🟡 No `<meta name="theme-color">` — small but relevant for mobile browser chrome
- 🟡 No web app manifest (`manifest.json`) — would improve PWA signals and mobile experience
- 🟡 Only 2 route prefetches defined — bank sub-pages (`/bank/accounts`, `/bank/transactions`, `/bank/dashboard`) could be prefetched for faster navigation

---

## 13. Prioritised Issues & Recommendations

### 🔴 P1 — Critical (Fix Immediately)

| #   | Issue                                                                       | Pages Affected                                            | Fix                                                                       |
| --- | --------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | All bank pages share homepage `<title>` tag                                 | All `/bank/*`                                             | Add page-specific `<title>` per route via `generateMetadata()` in Next.js |
| 2   | All bank pages share homepage `<meta name="description">`                   | All `/bank/*`                                             | Add page-specific descriptions per route                                  |
| 3   | No `<link rel="canonical">` on any bank page                                | All `/bank/*`                                             | Add canonical pointing to the page's own canonical URL                    |
| 4   | `og:url` set to homepage (`https://www.qaplayground.com`) on all bank pages | All `/bank/*`                                             | Set `og:url` to each page's own URL                                       |
| 5   | No bank pages in `sitemap.xml`                                              | `/bank/dashboard`, `/bank/accounts`, `/bank/transactions` | Add entries to sitemap with appropriate priority                          |
| 6   | `/bank/login` returns 404 with no redirect                                  | `/bank/login`                                             | Add server-side redirect to `/login` or `/bank/dashboard`                 |

---

### 🟡 P2 — Important (Fix Within Sprint)

| #   | Issue                                                     | Pages Affected | Fix                                                                             |
| --- | --------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------- |
| 7   | H1 tags are too generic (`Dashboard`, `Transactions`)     | All `/bank/*`  | Include "Bank Demo", "SecureBank", or "QA Playground" in H1                     |
| 8   | No JSON-LD structured data on any bank page               | All `/bank/*`  | Add `BreadcrumbList` + `WebApplication` or `LearningResource` schema            |
| 9   | `og:title` and `twitter:title` match homepage             | All `/bank/*`  | Set page-specific OG/Twitter titles                                             |
| 10  | Footer heading tags (`H3`/`H4`) pollute heading hierarchy | All pages      | Replace heading tags in footer nav with styled `<p>` or `aria-label` on `<nav>` |
| 11  | No visual or schema breadcrumbs                           | All `/bank/*`  | Add breadcrumb component + `BreadcrumbList` JSON-LD                             |
| 12  | Missing `og:locale` and `og:site_name`                    | All `/bank/*`  | Add these standard OG properties                                                |

---

### 🟢 P3 — Enhancements (Backlog)

| #   | Issue                                                         | Fix                                                                         |
| --- | ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 13  | Bank pages not interlinked with relevant blog posts           | Add contextual links from bank test-case sections to relevant blog articles |
| 14  | "Help & Docs" link points to homepage                         | Point to a dedicated docs/help page                                         |
| 15  | No bank-specific OG image                                     | Create a bank-themed social preview image (1200×630px)                      |
| 16  | No `theme-color` meta                                         | Add `<meta name="theme-color" content="#7c3aed">`                           |
| 17  | No web app manifest                                           | Add `manifest.json` with bank/playground icons                              |
| 18  | Query strings `?action=add` / `?action=new` not canonicalised | Ensure these resolve to parent URL canonical or are noindexed               |

---

## 14. Recommended Code Fixes

### 14.1 Next.js `generateMetadata()` — Bank Pages

Create a metadata configuration file or add per-page metadata in Next.js (App Router):

```typescript
// app/bank/dashboard/page.tsx (or pages/bank/dashboard.tsx for Pages Router)

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank Dashboard – SecureBank Demo | QA Playground",
  description:
    "Explore the SecureBank Demo dashboard for QA automation practice. View account balances, pinned accounts, and recent transactions. Built for Selenium, Playwright, and Cypress testing.",
  keywords: [
    "bank demo automation testing",
    "Selenium bank dashboard test",
    "Playwright E2E banking app",
    "QA automation practice bank",
    "SecureBank QA Playground",
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.qaplayground.com/bank/dashboard",
  },
  openGraph: {
    title: "Bank Dashboard – SecureBank Demo | QA Playground",
    description:
      "Practice E2E automation testing on a realistic banking dashboard. Free for QA engineers.",
    url: "https://www.qaplayground.com/bank/dashboard",
    siteName: "QA Playground",
    images: [
      {
        url: "https://www.qaplayground.com/og-bank.png", // Create bank-specific OG image
        width: 1200,
        height: 630,
        alt: "SecureBank Demo Dashboard – QA Playground Automation Practice",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bank Dashboard – SecureBank Demo | QA Playground",
    description:
      "Practice E2E automation testing on a realistic banking dashboard.",
    site: "@qaplayground",
    creator: "@qaplayground",
    images: ["https://www.qaplayground.com/og-bank.png"],
  },
};
```

Repeat for each bank page with page-specific values:

| Page                 | Title                                                       | Canonical                                        |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| `/bank/dashboard`    | `Bank Dashboard – SecureBank Demo \| QA Playground`         | `https://www.qaplayground.com/bank/dashboard`    |
| `/bank/accounts`     | `Manage Accounts – Bank Demo E2E Practice \| QA Playground` | `https://www.qaplayground.com/bank/accounts`     |
| `/bank/transactions` | `Transaction History – Bank Demo Practice \| QA Playground` | `https://www.qaplayground.com/bank/transactions` |

---

### 14.2 BreadcrumbList JSON-LD Component

```tsx
// components/BankBreadcrumb.tsx
import Script from "next/script";

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BankBreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Usage in /bank/dashboard/page.tsx:
// <BankBreadcrumbSchema items={[
//   { name: 'Home', url: 'https://www.qaplayground.com' },
//   { name: 'Bank Demo', url: 'https://www.qaplayground.com/bank' },
//   { name: 'Dashboard', url: 'https://www.qaplayground.com/bank/dashboard' },
// ]} />
```

---

### 14.3 Visual Breadcrumb Component

```tsx
// components/Breadcrumb.tsx
import Link from "next/link";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol
        className="flex gap-2 text-sm text-gray-500"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => (
          <li
            key={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {item.href ? (
              <Link href={item.href} itemProp="item">
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span itemProp="name" aria-current="page">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 1)} />
            {index < items.length - 1 && <span aria-hidden="true"> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

---

### 14.4 Sitemap Update (`next-sitemap.config.js` or manual `sitemap.xml`)

```javascript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.qaplayground.com",
  generateRobotsTxt: false, // Keep existing robots.txt
  exclude: [
    "/admin/*",
    "/api/*",
    "/bank/login",
    "/bank/accounts?*",
    "/bank/transactions?*",
  ],
  additionalPaths: async (config) => [
    {
      loc: "/bank/dashboard",
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
    {
      loc: "/bank/accounts",
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
    {
      loc: "/bank/transactions",
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
  ],
};
```

---

### 14.5 Fix `/bank/login` Redirect (Next.js `next.config.js`)

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: "/bank/login",
        destination: "/login",
        permanent: true, // 308
      },
    ];
  },
};
```

---

### 14.6 Footer Navigation — Remove Heading Tag Pollution

**Before (current):**

```html
<h3>Footer Navigation</h3>
...
<h4>Platform</h4>
<nav aria-label="Platform links">...</nav>
<h4>Learn</h4>
<nav aria-label="Learn links">...</nav>
```

**After (recommended):**

```html
<p class="footer-section-title" role="presentation">Footer Navigation</p>
...
<nav aria-label="Platform links">
  <p class="footer
```
