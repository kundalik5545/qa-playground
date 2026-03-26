# Task 15-2 — Radio & Checkbox Page Upgrade

**Goal:** Upgrade `practice/radio-checkbox` page to the standard UI template defined in `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md`.

**Branch:** `fix/practice-page-ui-issues`
**Ref docs:** `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md`

---

## Scope

- `app/(Practice)/practice/_components/RadioButton.jsx`
- `data/practiceResources.js` — fix `scenarioCount` for `radio-checkbox`

---

## Tasks

### Phase 1 — Data Fix

- [x] **Task 1.1** — Update `practiceResources["radio-checkbox"].scenarioCount` from `4` to `7`

### Phase 2 — RadioButton.jsx Rewrite

- [x] **Task 2.1** — Add `SLUG = "radio-checkbox"` constant at module level
- [x] **Task 2.2** — Define `techMethods` at module level (Selenium + Playwright, 5 methods each)
- [x] **Task 2.3** — Remove old patterns: `const youtubeLink = ""`, `LearningInsight` inner function, `QAPlayGround` inner function, `w-2/3`/`w-1/3` layout
- [x] **Task 2.4** — Add Hero section pulled from `practiceResources[SLUG]`
- [x] **Task 2.5** — Add 7 numbered `Scenario N:` labels with `<BookOpen>` icon and `<hr>` dividers
- [x] **Task 2.6** — Add DISABLED badge (amber pill) inline with Scenario 5 label
- [x] **Task 2.7** — Replace Insight card with standard "What You'll Learn" card: tech toggle + method dots + tutorial link footer
- [x] **Task 2.8** — Add Test Cases Accordion using `radioBoxTC`
- [x] **Task 2.9** — Add `id` and `data-testid` to every radio input and checkbox element

---

## Scenarios Reference

| # | Scenario | Element | ids / testids |
|---|---|---|---|
| 1 | Select Any One Radio Button | Yes/No radios (`name="selectOne"`) | `radio-yes-1`, `radio-no-1` |
| 2 | Confirm Only One Radio Can Be Selected | Yes/No radios (`name="confirm"`) | `radio-yes-2`, `radio-no-2` |
| 3 | Find the Bug | Yes/No radios (different name groups — intentional bug) | `radio-bug-yes`, `radio-bug-no` |
| 4 | Find Which Radio Is Selected | Foo/Bar radios (`name="find"`) | `radio-foo`, `radio-bar` |
| 5 | Disabled Radio Button | Going/Not going/Maybe(disabled) (`name="disabled"`) | `radio-going`, `radio-not-going`, `radio-maybe` |
| 6 | Check If Checkbox Is Selected | Remember Me (pre-checked) | `checkbox-remember-me` |
| 7 | Accept Terms and Conditions | Accept T&C checkbox | `checkbox-terms` |

## techMethods Reference

| Tech | Methods |
|---|---|
| Selenium | `click()` (purple), `isSelected()` (emerald), `getAttribute("checked")` (blue), `findElements()` (slate), `isEnabled()` (amber) |
| Playwright | `check()` (blue), `uncheck()` (red), `isChecked()` (emerald), `locator.all()` (purple), `toBeChecked()` (orange) |

---

## Progress Summary

| Phase | Total | Done | Remaining |
|---|---|---|---|
| Phase 1 — Data fix | 1 | 1 | 0 |
| Phase 2 — RadioButton rewrite | 9 | 9 | 0 |
| **Total** | **10** | **10** | **0** |
