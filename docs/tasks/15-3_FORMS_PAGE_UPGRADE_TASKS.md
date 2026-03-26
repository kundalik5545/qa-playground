# Task 15-3 — Forms Page Upgrade

**Goal:** Upgrade `practice/forms` page to the standard UI template defined in `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md`.

**Branch:** `fix/practice-page-ui-issues`
**Ref docs:** `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md`

---

## Scope

- `app/(Practice)/practice/_components/FormsPage.jsx`
- `data/formsTestCases.js` — add `formsTC` with proper steps

---

## Pre-work Finding

`formsTestCases.js` only contained `basicDetailsTC` (accordion test cases — completely wrong data, old copy-paste error). No forms test cases existed. `formsTC` was created fresh.

---

## Tasks

### Phase 1 — Data

- [x] **Task 1.1** — Add `formsTC` export to `data/formsTestCases.js` with 15 test cases and `steps[]` arrays
  - TC01–TC15 cover: valid submit, required validation, email/phone/password format, T&C, success state, reset, gender, dropdown, checkboxes, field retention, Fill Again button, page load

### Phase 2 — FormsPage.jsx Rewrite

- [x] **Task 2.1** — Remove `const youtubeLink = ""` (module-level), `LearningInsight` inner function
- [x] **Task 2.2** — Add `SLUG = "forms"` constant at module level
- [x] **Task 2.3** — Define `techMethods` at module level (Selenium + Playwright, 5 methods each)
- [x] **Task 2.4** — Rename `QAPlayGround` → `RegistrationForm` at module level; fold all state/handlers inside it (form, errors, submitted, all handlers)
- [x] **Task 2.5** — Rewrite `FormsPage` with standard layout: Hero + flex row (Practice card | What You'll Learn) + Test Cases
- [x] **Task 2.6** — Hero section pulled from `practiceResources["forms"]`
- [x] **Task 2.7** — Practice card wraps `<RegistrationForm />` in `<section aria-label>` with `flex-1 min-w-0`
- [x] **Task 2.8** — Replace Insight card with standard "What You'll Learn" card (tech toggle + method dots + tutorial link footer)
- [x] **Task 2.9** — Add Test Cases Accordion using `formsTC` from `@/data/formsTestCases`

---

## formsTC Test Cases Reference

| ID | Test Case |
|---|---|
| TC01 | Fill all fields with valid data and submit successfully |
| TC02 | Verify required field errors appear on empty submit |
| TC03 | Verify invalid email format shows validation error |
| TC04 | Verify invalid phone number format shows error |
| TC05 | Verify password minimum length validation |
| TC06 | Verify password mismatch shows confirm password error |
| TC07 | Verify T&C checkbox required error appears |
| TC08 | Verify success message shows submitted name |
| TC09 | Verify reset button clears all fields |
| TC10 | Verify gender radio button selection |
| TC11 | Verify country dropdown selection |
| TC12 | Verify multiple interest checkboxes can be selected |
| TC13 | Verify form fields retain values after validation failure |
| TC14 | Verify Fill Again button returns to empty form from success |
| TC15 | Verify form page loads without errors |

## techMethods Reference

| Tech | Methods |
|---|---|
| Selenium | `sendKeys()` (purple), `click()` (blue), `Select.selectByVisibleText()` (orange), `submit()` (emerald), `isDisplayed()` (slate) |
| Playwright | `fill()` (blue), `check()` (emerald), `selectOption()` (orange), `locator.click()` (purple), `toBeVisible()` (red) |

---

## Progress Summary

| Phase | Total | Done | Remaining |
|---|---|---|---|
| Phase 1 — Data | 1 | 1 | 0 |
| Phase 2 — FormsPage rewrite | 9 | 9 | 0 |
| **Total** | **10** | **10** | **0** |
