# Practice Page Elements UI Improvement — Task List

**Ref Doc:** `docs/12_PRACTICE_PAGE_ELEMENTS_UI_IMPRO.md`
**Branch:** `fix/practice-page-ui-issues`
**Scope:** `/practice/input` page — bugs, UI, accessibility, SEO, markdown fixes

---

## Phase 1 — Bug Fixes (InputPage.jsx)

- [x] **Task 1.1** — Fix `htmlFor="fullName"` → `htmlFor="movieName"` on the first Label (label/input mismatch bug — clicking label doesn't focus input)
- [x] **Task 1.2** — Add `name` attribute to all 6 inputs matching their `id` values
- [x] **Task 1.3** — Add `data-testid` to all 6 inputs: `input-movie-name`, `input-append-text`, `input-verify-text`, `input-clear-text`, `input-disabled`, `input-readonly`

---

## Phase 2 — InputPage.jsx UI & Accessibility

- [x] **Task 2.1** — Replace bare `<h2>Input</h2>` with a rich hero section: difficulty badge (Beginner), time estimate (~15 min), scenario count (6 scenarios), descriptive subtitle
- [x] **Task 2.2** — Add visual differentiation for **disabled** input: amber border + `[DISABLED]` pill badge
- [x] **Task 2.3** — Add visual differentiation for **readonly** input: blue/indigo border + `[READ-ONLY]` pill badge
- [x] **Task 2.4** — Add `aria-label="Input field practice exercises"` to the practice card `<section>`
- [x] **Task 2.5** — Expand Insight card: add Playwright methods (`fill()`, `press()`, `inputValue()`, `toBeDisabled()`), difficulty indicator bar, time estimate

---

## Phase 3 — [slug]/page.jsx — SEO & Breadcrumb

- [x] **Task 3.1** — Add breadcrumb nav (Home → Practice → {element title}) above the practice component for non-blog pages
- [x] **Task 3.2** — Improve `generateMetadata`: add `og:type: "article"`, `twitter:title` from page title (not site default), `twitter:card`
- [x] **Task 3.3** — Add JSON-LD `LearningResource` + `BreadcrumbList` structured data for practice pages (read from markdown frontmatter: `teaches`, `programmingLanguage`, `educationalLevel`)

---

## Phase 4 — input.md Content Fixes

- [x] **Task 4.1** — Update frontmatter: improve `title` and `description` to be page-specific and include CTA keywords
- [x] **Task 4.2** — Fix Playwright "Append text" code (scenario 2): `fill()` clears first — replace with `click()` + `keyboard.type()` and add ⚠️ note explaining the difference
- [x] **Task 4.3** — Add `teaches`, `programmingLanguage`, `educationalLevel` fields to frontmatter (used by JSON-LD in Task 3.3)

---

## Phase 5 — Footer Heading Hierarchy

- [x] **Task 5.1** — Change `<h3>` → `<h4>` for "Platform", "Learn", "Company" headings in `Footer.jsx` (they pollute the heading hierarchy on practice pages which now have a real h1)

---

## Phase 6 — URL Slug Alignment (SEO)

- [x] **Task 6.1** — Rename `input.md` → `input-fields.md`
- [x] **Task 6.2** — Rename `button.md` → `buttons.md`
- [x] **Task 6.3** — Rename `select.md` → `dropdowns.md`
- [x] **Task 6.4** — Rename `alert.md` → `alerts-dialogs.md`
- [x] **Task 6.5** — Rename `radio.md` → `radio-checkbox.md`
- [x] **Task 6.6** — Rename `calendar.md` → `date-picker.md`
- [x] **Task 6.7** — Rename `window.md` → `tabs-windows.md`
- [x] **Task 6.8** — Rename `waits.md` → `dynamic-waits.md`
- [x] **Task 6.9** — Rename `simple-table.md` → `data-table.md`
- [x] **Task 6.10** — Rename `upload-download.md` → `file-upload.md`
- [x] **Task 6.11** — Update `componentMapping` keys in `[slug]/page.jsx` to match new slugs
- [x] **Task 6.12** — Update all `link` values in `PracticeClientContent.jsx` to new slugs
- [x] **Task 6.13** — Add 301 redirects in `next.config.mjs` for all 10 old slugs → new slugs

---

## Phase 7 — Deferred (Future Sprint)

- [ ] **Task 7.1** — Tabbed code view per scenario (Selenium Java / Playwright JS / Playwright Python) with global language preference saved to localStorage
- [ ] **Task 7.2** — Locator Strategies section per practice element (XPath, CSS, data-testid, Playwright locators)
- [ ] **Task 7.3** — "Test Cases to Automate" section in practice pages
- [ ] **Task 7.4** — Progress tracker checkbox per scenario (connect to Study Tracker)
- [ ] **Task 7.5** — TOC jump-links bar above the scenarios
- [ ] **Task 7.6** — AI/MCP locator examples section

---

## Progress Summary

| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| Phase 1 — Bug Fixes | 3 | 3 | 0 |
| Phase 2 — UI & A11y | 5 | 5 | 0 |
| Phase 3 — SEO ([slug]) | 3 | 3 | 0 |
| Phase 4 — Markdown | 3 | 3 | 0 |
| Phase 5 — Footer | 1 | 1 | 0 |
| Phase 6 — Slug Alignment | 13 | 13 | 0 |
| Phase 7 — Deferred | 6 | 0 | 6 |
| **Total (active)** | **28** | **28** | **0** |
