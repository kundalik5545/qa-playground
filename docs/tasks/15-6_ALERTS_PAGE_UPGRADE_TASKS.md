# Task 15-6 — Alerts & Dialogs Page Upgrade

**Goal:** Upgrade `practice/alerts-dialogs` page to the standard UI template defined in `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md` (section 4.5).

**Branch:** `fix/small-bug-fix`
**Ref docs:** `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md` — section 4.5

---

## Scope

- `app/(Practice)/practice/_components/AlertPage.jsx`
- `data/elementsTestCases.js` — add `alertTC` export
- `data/practiceResources.js` — update `scenarioCount` for alerts-dialogs from 3 → 6
- `data/practiceElementFaqs.js` — add `alerts-dialogs` FAQ entry

---

## Pre-work Findings (current state of AlertPage.jsx)

| Area | Current State |
|---|---|
| Hero | ❌ Only plain `<h2>Alert</h2>` — no badges, no h1, no description |
| Layout | ❌ Old: `sm:w-2/3` / `sm:w-1/3` split |
| Practice card | ❌ Delegates to `QAPlayGround` inner function; no `Scenario N:` labels |
| Insight card | ❌ Old `LearningInsight` inner function — correct methods this time but no tech toggle |
| `youtubeLink` | ❌ `const youtubeLink = ""` hardcoded inside component |
| Test cases | ❌ None |
| `SLUG` constant | ❌ Missing |
| Bug 1 | ❌ `id="toast-alert"` used on BOTH toast button AND sweet alert button — duplicate ids |
| Bug 2 | ❌ Toast and Sweet Alert scenarios show `{promptText}` result — wrong, copied from prompt scenario |
| Bug 3 | ❌ Dialog URL shows `/practice/alert` — should be `/practice/alerts-dialogs` |
| `scenarioCount` | ❌ Set to 3 in practiceResources but page has 6 scenarios |
| `data-testid` | ❌ Missing on several buttons |

---

## Tasks

### Phase 1 — Data & Config

- [x] **Task 1.1** — Update `scenarioCount` from 3 → 6 in `data/practiceResources.js` for `alerts-dialogs`
- [x] **Task 1.2** — Add `alertTC` export to `data/elementsTestCases.js` with 10 test cases and `steps[]`

### Phase 2 — AlertPage.jsx Rewrite

- [x] **Task 2.1** — Remove `const youtubeLink = ""`, `LearningInsight` inner function, standalone `<h2>`
- [x] **Task 2.2** — Add `const SLUG = "alerts-dialogs"` at module level
- [x] **Task 2.3** — Define `techMethods` at module level (Selenium + Playwright, 5 alert-specific methods each)
- [x] **Task 2.4** — Rename `QAPlayGround` → `AlertsPractice` at module level; keep all 6 scenarios
- [x] **Task 2.5** — Add `Scenario N:` label + description to each of the 6 alert groups
- [x] **Task 2.6** — Fix bug: give toast button `id="btn-toast-alert"` / `data-testid="btn-toast-alert"`; give sweet alert button `id="btn-modal-alert"` / `data-testid="btn-modal-alert"`
- [x] **Task 2.7** — Fix bug: remove `{promptText}` display from toast and sweet alert scenarios — only show in prompt scenario
- [x] **Task 2.8** — Fix bug: update Dialog URL from `/practice/alert` → `/practice/alerts-dialogs`
- [x] **Task 2.9** — Add confirm alert result display (Accepted / Dismissed)
- [x] **Task 2.10** — Rewrite `AlertPage` with standard layout: Hero + flex row (Practice card | What You'll Learn) + Test Cases
- [x] **Task 2.11** — Replace Insight card with standard "What You'll Learn" card (tech toggle + method dots + tutorial link footer)
- [x] **Task 2.12** — Add Test Cases Accordion using `alertTC`
- [x] **Task 2.13** — Add `NextElementCard` below What You'll Learn card
- [x] **Task 2.14** — Keep `ModalAlert` and `DialogCloseButton` as named components at module level

### Phase 3 — FAQ

- [x] **Task 3.1** — Add `alerts-dialogs` FAQ entry to `data/practiceElementFaqs.js` (6 FAQs)

---

## alertTC Test Cases Reference

| ID | Test Case |
|---|---|
| TC01 | Accept a simple browser alert and verify it closes |
| TC02 | Get text from a simple browser alert before accepting |
| TC03 | Accept a confirm dialog and verify accepted state |
| TC04 | Dismiss a confirm dialog and verify dismissed state |
| TC05 | Enter text in a prompt dialog and accept it |
| TC06 | Dismiss a prompt dialog and verify no input is captured |
| TC07 | Verify toast notification appears after triggering |
| TC08 | Close a modal/sweet alert using the Cancel button |
| TC09 | Close an advanced dialog using the Close button |
| TC10 | Verify alert page loads without errors |

## techMethods Reference

| Tech | Methods |
|---|---|
| Selenium | `driver.switchTo().alert()` (purple), `Alert.accept()` (blue), `Alert.dismiss()` (orange), `Alert.getText()` (emerald), `Alert.sendKeys()` (slate) |
| Playwright | `page.on("dialog")` (blue), `dialog.accept()` (purple), `dialog.dismiss()` (orange), `dialog.message()` (emerald), `dialog.type()` (red) |

---

## Progress Summary

| Phase | Total | Done | Remaining |
|---|---|---|---|
| Phase 1 — Data | 2 | 2 | 0 |
| Phase 2 — Rewrite | 14 | 14 | 0 |
| Phase 3 — FAQ | 1 | 1 | 0 |
| **Total** | **17** | **17** | **0** |
