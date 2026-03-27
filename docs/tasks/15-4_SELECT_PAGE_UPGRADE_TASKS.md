# Task 15-4 — Select / Dropdown Page Upgrade

**Goal:** Upgrade `practice/dropdowns` page to the standard UI template defined in `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md` (section 4.3).

**Branch:** `fix/small-bug-fix`
**Ref docs:** `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md` — section 4.3

---

## Scope

- `app/(Practice)/practice/_components/SelectPage.jsx`
- `data/elementsTestCases.js` — add `dropdownTC` export

---

## Pre-work Findings (current state of SelectPage.jsx)

| Area | Current State |
|---|---|
| Hero | ❌ None — no badges, no h1, no description |
| Layout | ❌ Old: `flex flex-col sm:flex-row`, `sm:w-2/3` / `sm:w-1/3` |
| Practice card | ❌ Delegates to `QAPlayGround` inner function; no `Scenario N:` labels; no `id`/`data-testid` on dropdowns |
| Insight card | ❌ Old `LearningInsight` inner function; static ordered list; no tech toggle |
| `youtubeLink` | ❌ `const youtubeLink = ""` hardcoded inside component |
| Test cases | ❌ None |
| Bug | ❌ Country dropdown has duplicate `value="argentina"` for both Argentina and UK entries |
| `SLUG` constant | ❌ Missing |
| `data-testid` | ❌ Missing on all interactive dropdowns |

---

## Tasks

### Phase 1 — Data

- [x] **Task 1.1** — Add `dropdownTC` export to `data/elementsTestCases.js` with 10 test cases and `steps[]` arrays
  - TC01–TC10 cover: select by text, select by value, get selected value, get all options, select last option, multi-select multiple, multi-select deselect, default placeholder, disabled state, verify option count

### Phase 2 — SelectPage.jsx Rewrite

- [x] **Task 2.1** — Remove `const youtubeLink = ""` and `LearningInsight` inner function
- [x] **Task 2.2** — Add `const SLUG = "dropdowns"` at module level
- [x] **Task 2.3** — Define `techMethods` at module level (Selenium + Playwright, 5 methods each)
- [x] **Task 2.4** — Move `QAPlayGround` state/JSX into a `DropdownPractice` function at module level; fold inline into Practice Card
- [x] **Task 2.5** — Fix bug: country dropdown had `value="argentina"` on the UK entry — corrected to `value="uk"`
- [x] **Task 2.6** — Add `id` and `data-testid` attributes to all interactive dropdowns
- [x] **Task 2.7** — Add `Scenario N:` label to each dropdown group (4 scenarios)
- [x] **Task 2.8** — Add result display (current selected value) below each dropdown
- [x] **Task 2.9** — Rewrite `SelectPage` with standard layout: Hero + flex row (Practice card | What You'll Learn) + Test Cases
- [x] **Task 2.10** — Hero section pulled from `practiceResources["dropdowns"]`
- [x] **Task 2.11** — Replace Insight card with standard "What You'll Learn" card (tech toggle + method dots + tutorial link footer)
- [x] **Task 2.12** — Add Test Cases Accordion using `dropdownTC`
- [x] **Task 2.13** — Add `NextElementCard` below What You'll Learn card (matches other upgraded pages)

---

## dropdownTC Test Cases Reference

| ID | Test Case |
|---|---|
| TC01 | Select "Apple" from fruit dropdown by visible text |
| TC02 | Select "India" from country dropdown by value |
| TC03 | Verify selected value is displayed after selection |
| TC04 | Get all available options from a dropdown |
| TC05 | Select the last option from the programming language dropdown |
| TC06 | Multi-select: select multiple heroes using CTRL+click |
| TC07 | Multi-select: deselect a previously selected option |
| TC08 | Verify default placeholder text before any selection |
| TC09 | Verify a dropdown is enabled and interactable |
| TC10 | Verify the total count of options in a dropdown |

---

## techMethods Reference

| Tech | Methods |
|---|---|
| Selenium | `Select.selectByVisibleText()` (purple), `Select.selectByValue()` (blue), `Select.getOptions()` (orange), `Select.getAllSelectedOptions()` (emerald), `Select.deselectAll()` (slate) |
| Playwright | `selectOption()` (blue), `selectOption({label})` (purple), `locator.inputValue()` (orange), `locator.allInnerTexts()` (emerald), `toHaveValue()` (red) |

---

## Progress Summary

| Phase | Total | Done | Remaining |
|---|---|---|---|
| Phase 1 — Data | 1 | 1 | 0 |
| Phase 2 — SelectPage rewrite | 13 | 13 | 0 |
| **Total** | **14** | **14** | **0** |
