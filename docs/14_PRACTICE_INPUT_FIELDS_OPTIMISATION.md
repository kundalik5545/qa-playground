# Practice Page Architecture Optimisation Report

**File ID:** 14
**Date:** 2026-03-26
**Scope:** `practice/input-fields` route + data layer refactor for all practice elements

---

## 1. Current State — Problems

### 1.1 `data/elementsTestCases.js` — Structural Mess

| Problem | Detail |
|---|---|
| Mixed data quality | `inputFieldTC` has proper `steps[]` arrays; all others (`buttonTC`, `radioBoxTC`, etc.) have only `TestId` + `TestCaseName` — no steps |
| Wrong data | `linksTC` contains accordion test cases (copy-paste error) — completely wrong |
| Unused export | `text_BoxTC` exists but there's no TextBox practice page |
| No grouping by element | All exports are at the top level — no namespace, no per-element file |
| No steps on 5 of 6 exports | `text_BoxTC`, `radioBoxTC`, `buttonTC`, `linksTC`, `fileUploadTC`, `fileDownloadTC` have no `steps` array |

### 1.2 Tutorial Links — Hardcoded in Every Component

Every practice component has:
```js
const youtubeLink = "";  // hardcoded empty string inside component
```

There is no central place to add/update tutorial links. To add a YouTube link to the Button page, you must edit `ButtonPage.jsx`. Scattered across 14+ components.

### 1.3 Practice Components — No Standard Structure

Components vary wildly:
- `InputPage.jsx` (updated) — has hero, scenario labels, insight card, test cases accordion ✅
- `ButtonPage.jsx` — has `QAPlayGround` inner function, old insight card style, no hero, no test cases ❌
- No shared pattern for: difficulty badge, time estimate, scenario numbering, locator display

### 1.4 `[slug]/page.jsx` — Metadata Pulled Only from Markdown

Difficulty, time, scenario count, and tutorial links are not in frontmatter and not wired to the page metadata or hero display. Inconsistent between elements.

---

## 2. Proposed Data Architecture

### 2.1 `data/practiceResources.js` — New File (central resource registry)

One file holds per-element: difficulty, time estimate, scenario count, YouTube link, related links.

```js
// data/practiceResources.js
export const practiceResources = {
  "input-fields": {
    difficulty: "Beginner",
    difficultyColor: "green",
    timeMin: 15,
    scenarioCount: 6,
    youtubeUrl: "",           // add link when video is ready
    relatedElements: ["dropdowns", "forms", "radio-checkbox"],
  },
  "buttons": {
    difficulty: "Beginner",
    difficultyColor: "green",
    timeMin: 10,
    scenarioCount: 5,
    youtubeUrl: "",
    relatedElements: ["forms", "links"],
  },
  // ... one entry per slug
};
```

**Why:** Adding a YouTube link to any element = edit one line in one file. No component changes needed.

### 2.2 `data/elementsTestCases.js` — Refactor In-Place

Add `steps[]` to all existing exports that lack them. Fix `linksTC` (currently has accordion test cases). Remove `text_BoxTC` (no practice page).

Each test case entry must have:
```js
{
  TestId: "TC01",
  TestCaseName: "Short descriptive name",
  steps: [
    "Step 1 — action",
    "Step 2 — assertion",
  ]
}
```

### 2.3 Standard Practice Component Template

All practice components must follow this structure:

```
PracticeComponent
├── Hero section          (h1, difficulty badge, time, scenario count)
├── Main layout row
│   ├── Practice Card     (section[aria-label], scenarios numbered)
│   └── What You'll Learn (tech toggle: Selenium / Playwright, methods list, tutorial link)
└── Test Cases section    (h2, Accordion from data/elementsTestCases.js)
```

**Data consumed from:**
- `data/practiceResources.js` → difficulty, time, youtubeUrl, relatedElements
- `data/elementsTestCases.js` → test cases with steps

---

## 3. Implementation Plan — input-fields Route

### 3.1 `InputPage.jsx` — Already Done ✅

The updated `InputPage.jsx` (from system-reminder) already implements:
- Hero with Beginner badge, 15 min, 6 scenarios
- Scenario-numbered practice card
- What You'll Learn with tech toggle (Selenium / Playwright)
- Test Cases accordion pulling from `inputFieldTC`
- Proper `data-testid`, `name`, `htmlFor` attributes
- Visual badges for disabled (amber) and readonly (blue)

**Remaining gap:** Tutorial link is hardcoded as "coming soon" text — should pull from `practiceResources`.

### 3.2 `data/practiceResources.js` — Create

Create with entries for all 13 active practice elements. Each entry:
- `difficulty`, `difficultyColor`, `timeMin`, `scenarioCount`
- `youtubeUrl` (empty string initially, easy to fill later)
- `relatedElements` array

### 3.3 `data/elementsTestCases.js` — Add steps to all exports

Add `steps[]` arrays to:
- `buttonTC` (15 entries)
- `radioBoxTC` (15 entries)
- `fileUploadTC` (15 entries)
- `fileDownloadTC` (14 entries)
- Fix `linksTC` (currently wrong data — has accordion TCs)
- Remove `text_BoxTC` (unused)

### 3.4 Wire `InputPage.jsx` to `practiceResources`

Update the hero section and What You'll Learn card to pull `difficulty`, `timeMin`, `scenarioCount`, and `youtubeUrl` from `practiceResources["input-fields"]` instead of hardcoding.

---

## 4. Consistent Naming — Export Convention for `elementsTestCases.js`

| Element Slug | Export Name |
|---|---|
| `input-fields` | `inputFieldTC` ✅ exists |
| `buttons` | `buttonTC` ✅ exists (needs steps) |
| `dropdowns` | `dropdownTC` ❌ missing |
| `alerts-dialogs` | `alertTC` ❌ missing |
| `radio-checkbox` | `radioBoxTC` ✅ exists (needs steps) |
| `date-picker` | `datePickerTC` ❌ missing |
| `tabs-windows` | `tabsWindowsTC` ❌ missing |
| `dynamic-waits` | `dynamicWaitsTC` ❌ missing |
| `data-table` | `dataTableTC` ❌ missing |
| `file-upload` | `fileUploadTC` ✅ exists (needs steps) |
| `links` | `linksTC` ✅ exists (needs correct data + steps) |
| `forms` | `formsTC` — check `formsTestCases.js` |
| `multi-select` | `multiSelectTC` ❌ missing |

Missing test case exports (7) are deferred — add them as each element is upgraded.

---

## 5. File Changes Summary

| File | Action |
|---|---|
| `data/practiceResources.js` | **Create** — central registry for all element metadata + tutorial links |
| `data/elementsTestCases.js` | **Refactor** — add steps, fix linksTC, remove text_BoxTC |
| `app/(Practice)/practice/_components/InputPage.jsx` | **Update** — wire to practiceResources |
| All other `_components/*.jsx` | **Defer** — upgrade one-by-one in future sprints |
