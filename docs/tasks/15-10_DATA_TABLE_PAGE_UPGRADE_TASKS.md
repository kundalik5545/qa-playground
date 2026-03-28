# Task 15-10 — Data Table Page Upgrade

**Goal:** Upgrade `practice/data-table` page to the standard UI template defined in `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md` (section 4.10).

**Branch:** `fix/small-bug-fix`
**Ref docs:** `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md` — section 4.10

---

## Scope

- `app/(Practice)/practice/_components/TablePage.jsx`
- `data/elementsTestCases.js` — add `dataTableTC` export
- `data/practiceElementFaqs.js` — add `data-table` FAQ entry

---

## Pre-work Findings (current state of TablePage.jsx)

| Area | Current State |
|---|---|
| Hero | ❌ No hero section — no badges, no h1, no description |
| Layout | ❌ Old: `sm:w-2/3` / `sm:w-1/3` split |
| Practice card | ❌ Delegates to async `QAPlayGround` inner function; no `Scenario N:` labels |
| Insight card | ❌ Old `LearningInsight` inner function — wrong methods (shows alert methods) |
| `youtubeLink` | ❌ `const youtubeLink = ""` hardcoded inside component |
| Test cases | ❌ None |
| `SLUG` constant | ❌ Missing |
| Data fetch | ⚠️ Uses async `QAPlayGround` server component — must convert to `useEffect` when going "use client" |
| `dataTableTC` | ❌ Missing in elementsTestCases.js |

---

## Tasks

### Phase 1 — Data & Config

- [x] **Task 1.1** — Add `dataTableTC` export to `data/elementsTestCases.js` with 6 test cases and `steps[]`

### Phase 2 — TablePage.jsx Rewrite

- [x] **Task 2.1** — Add `"use client"` directive; replace async `QAPlayGround` fetch with `useEffect` + `useState` (client-side fetch to fakerapi)
- [x] **Task 2.2** — Add `const SLUG = "data-table"` at module level
- [x] **Task 2.3** — Define `techMethods` at module level (Selenium + Playwright, 5 table-specific methods each)
- [x] **Task 2.4** — Remove `const youtubeLink = ""`, `LearningInsight` inner function, `QAPlayGround` inner function
- [x] **Task 2.5** — Add Hero section with difficulty badge, time badge, scenario count badge, h1, description
- [x] **Task 2.6** — Add `Scenario N:` labels to each table interaction group (6 scenarios)
- [x] **Task 2.7** — Rewrite main layout: `flex md:flex-row flex-col items-start gap-5` + `flex-1 min-w-0` / `shrink-0 w-64 md:w-72`
- [x] **Task 2.8** — Replace Insight card with standard "What You'll Learn" card (tech toggle + method dots + tutorial footer)
- [x] **Task 2.9** — Add Test Cases Accordion using `dataTableTC`
- [x] **Task 2.10** — Add `NextElementCard` below What You'll Learn card

### Phase 3 — FAQ

- [x] **Task 3.1** — Add `data-table` FAQ entry to `data/practiceElementFaqs.js` (5 FAQs)

---

## dataTableTC Test Cases Reference

| ID | Test Case |
|---|---|
| TC01 | Verify all table column headers are present |
| TC02 | Count the total number of rows in the data table |
| TC03 | Read a cell value from a specific row and column |
| TC04 | Find a book row by author name using XPath/filter |
| TC05 | Verify the table is not empty after page load |
| TC06 | Assert the ISBN column contains only string values |

## techMethods Reference

| Tech | Methods |
|---|---|
| Selenium | `findElements(By.tagName("tr"))` (purple), `findElement(By.xpath("//td[text()='val']"))` (blue), `getText()` (emerald), `getAttribute()` (orange), `Actions.moveToElement()` (slate) |
| Playwright | `locator("table tr")` (blue), `locator.nth()` (purple), `filter({hasText})` (orange), `textContent()` (emerald), `toHaveCount()` (red) |

---

## Progress Summary

| Phase | Total | Done | Remaining |
|---|---|---|---|
| Phase 1 — Data | 1 | 1 | 0 |
| Phase 2 — Rewrite | 10 | 10 | 0 |
| Phase 3 — FAQ | 1 | 1 | 0 |
| **Total** | **12** | **12** | **0** |
