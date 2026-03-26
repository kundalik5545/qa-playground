# Practice Page UI & SEO Improvement — Task List

**Ref Doc:** `docs/11_PRACTICE_PAGE_UI_IMPROVMENT.md`
**Branch:** `fix/practice-page-ui-issues`
**Files in scope:** `app/(Practice)/practice/page.jsx`, `app/(Practice)/practice/layout.js`, `components/Header.jsx`

---

## Phase 1 — SEO Fixes

### 🔴 Critical

- [x] **Task 1.1** — Add `generateMetadata()` to `practice/page.jsx` with a page-specific `<title>` tag:
  `"Practice Elements | QA Playground – Selenium, Playwright & Cypress"`

- [x] **Task 1.2** — Set `og:url` to `https://www.qaplayground.com/practice` (not the homepage) inside `generateMetadata()`

- [x] **Task 1.3** — Add `<link rel="canonical" href="https://www.qaplayground.com/practice" />` via `alternates.canonical` in metadata

### 🟡 High / Medium

- [x] **Task 1.4** — Add JSON-LD structured data (`WebPage` + `BreadcrumbList`) as a `<Script>` with `id` in `practice/page.jsx`

- [x] **Task 1.5** — Fix H1 typo: `"Ai"` → `"AI"` in `practice/page.jsx` line 176

- [x] **Task 1.6** — Change subtitle from `<h2>` to `<p>` tag in `practice/page.jsx` line 178 (it's a tagline, not a section heading)

- [x] **Task 1.7** — Write practice-page-specific `description` and `keywords` in `generateMetadata()`

- [x] **Task 1.8** — Add `twitter:url` meta tag for the practice page in metadata

### 🟢 Low

- [x] **Task 1.9** — Add `alternates: { canonical }` to cover sitemap link hint (already handled by Next.js sitemap route — verify no extra change needed)

---

## Phase 2 — Accessibility Fixes

### 🔴 High

- [x] **Task 2.1** — Add `aria-label="Main navigation"` to the `<nav>` element in `components/Header.jsx` line 23

- [x] **Task 2.2** — Fix `<Link><Button>` nesting in `Header.jsx` — `<Button>` inside `<Link>` renders as `<a><button>` (invalid HTML). Replace with a single styled `<Link>` using `asChild` or remove the inner `<Button>` and style the link directly.

- [x] **Task 2.3** — Make entire practice cards clickable by wrapping `CardHeader` + `CardContent` + `CardFooter` in a single `<Link>` (or use the CSS pseudo-element stretch trick)

- [x] **Task 2.4** — Add descriptive `aria-label` to each card link (e.g., `aria-label="Practice Input fields"`)

### 🟡 Medium

- [x] **Task 2.5** — Set `aria-hidden="true"` and `alt=""` on all card `<Image>` icons in `practice/page.jsx` (they are decorative; title text covers the meaning)

- [x] **Task 2.6** — Add `cursor-pointer` to card containers (cards are interactive but show no pointer affordance)

---

## Phase 3 — UI / UX Fixes

### 🔴 High

- [x] **Task 3.1** — Standardize all card `footerTitle` (CTA labels) to `"Practice Now"` across `allElements` array in `practice/page.jsx`. Exception: POM card — use `"Start Practice"`.

- [x] **Task 3.2** — Add visible hover/focus styles to the card footer link: color change + underline + focus outline (currently no hover feedback on the link)

### 🟡 Medium

- [x] **Task 3.3** — Rewrite inconsistent card `Description` values:
  - `Multi-Select`: `"Be a multi-tasker"` → `"Practice selecting multiple items from lists and dropdowns"`
  - `Waits`: `"It's ok to wait but you know.."` → `"Practice explicit and implicit waits for dynamic content"`
  - `Calendar`: `"My time is precious & your?"` → `"Interact with date pickers and time selection elements"`
  - `Table`: `"It's all about rows & columns"` → `"Practice reading, sorting, and filtering table data"`
  - `File`: `"All your data is secured!"` → `"Practice file upload and download automation scenarios"`

- [x] **Task 3.4** — Increase H1 font size for the hero heading. Change `text-3xl` (30px) to `text-4xl md:text-5xl` for better visual hierarchy

- [x] **Task 3.5** — Darken the subtitle text color from `text-gray-500` to `text-gray-600` for better contrast

- [x] **Task 3.6** — Add a card hover elevation effect: `hover:shadow-lg` + `hover:-translate-y-1` (currently only `hover:scale-105` — replace or augment)

- [x] **Task 3.7** — Add a visible `<h2>` section label above the card grid (e.g., `"Practice Elements"`) for semantic structure and screen reader navigation

- [x] **Task 3.8** — Visually differentiate the POM card (it links to `/bank`, not `/practice/[slug]`). Add a small badge or note: e.g., `"Uses Bank Demo"` tag or an external-link icon.

### 🟢 Low

- [ ] **Task 3.9** — Add difficulty/category badges to each card (`Beginner`, `Intermediate`, `Advanced`) — requires adding a `difficulty` field to `allElements` array

- [ ] **Task 3.10** — Add a search/filter input above the card grid to let users quickly find practice elements

- [ ] **Task 3.11** — Fix the "New" badge on the Study Tracker nav item in `Header.jsx` — add `aria-label="(New feature)"` to the badge `<span>`

---

## Progress Summary

| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| Phase 1 — SEO | 9 | 9 | 0 |
| Phase 2 — Accessibility | 6 | 6 | 0 |
| Phase 3 — UI/UX | 11 | 8 | 3 |
| **Total** | **26** | **23** | **3** |

---

## Notes

- `practice/layout.js` is `"use client"` — `generateMetadata()` must be exported from `practice/page.jsx` (server component), not from the layout.
- `Header.jsx` is `"use client"` — the `<nav>` fix (aria-label) is a one-liner addition.
- Phase 3 low-priority tasks (3.9, 3.10, 3.11) are enhancements; they can ship separately.
