# Task 15-1 — Buttons Page Upgrade

**Goal:** Upgrade `practice/buttons` page to the standard UI template defined in `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md`, using `InputPage.jsx` as the canonical reference.

**Branch:** `fix/practice-page-ui-issues`
**Ref docs:** `docs/14_PRACTICE_INPUT_FIELDS_OPTIMISATION.md`, `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md`

---

## Scope

- `app/(Practice)/practice/_components/ButtonPage.jsx`
- `data/practiceResources.js` — fix `scenarioCount` for `buttons`

---

## Tasks

### Phase 1 — Data Fix

- [x] **Task 1.1** — Update `practiceResources["buttons"].scenarioCount` from `5` to `8` (page has 8 actual scenarios)

### Phase 2 — ButtonPage.jsx Rewrite

- [x] **Task 2.1** — Add `SLUG = "buttons"` constant at module level
- [x] **Task 2.2** — Define `techMethods` object at module level (Selenium + Playwright, 5 methods each with colored dots)
- [x] **Task 2.3** — Move `ClickHoldButton` to module level (already was — keep it)
- [x] **Task 2.4** — Remove old patterns: `const youtubeLink = ""`, `LearningInsight` inner function, `QAPlayGround` inner function, `w-2/3`/`w-1/3` layout split
- [x] **Task 2.5** — Add Hero section: difficulty badge + time badge + scenario count badge + h1 + description (pulled from `practiceResources[SLUG]`)
- [x] **Task 2.6** — Migrate Practice Card to `flex-1 min-w-0` layout inside `<section aria-label>`, number all 8 scenarios with `Scenario N:` labels and `<BookOpen>` icon
- [x] **Task 2.7** — Add DISABLED badge (amber pill) to Scenario 5
- [x] **Task 2.8** — Add action result feedback element with `id="btn-action-result"` and `data-testid="btn-action-result"`
- [x] **Task 2.9** — Replace Insight card with standard "What You'll Learn" card: tech toggle + method dots + tutorial link footer (conditional on `res.youtubeUrl`)
- [x] **Task 2.10** — Add Test Cases Accordion section using `buttonTC` from `@/data/elementsTestCases`
- [x] **Task 2.11** — Fix `data-testid` and `id` attributes:
  - Fix duplicate `id="button-color"` bug (was on both Go To Home and Find Color buttons)
  - Standardise ids: `btn-goto-home`, `btn-find-location`, `btn-find-color`, `btn-size`, `btn-disabled`, `btn-click-hold`, `btn-double-click`, `btn-right-click`
  - Add matching `data-testid` on every interactive element

---

## Scenarios Reference

| # | Scenario | Element | id | data-testid |
|---|---|---|---|---|
| 1 | Navigate to Home Page | Destructive Button → Link `/` | `btn-goto-home` | `btn-goto-home` |
| 2 | Get Button X & Y Coordinates | Plain teal button | `btn-find-location` | `btn-find-location` |
| 3 | Get Button Color | Plain blue button | `btn-find-color` | `btn-find-color` |
| 4 | Get Button Height & Width | shadcn Button | `btn-size` | `btn-size` |
| 5 | Disabled Button | shadcn Button disabled | `btn-disabled` | `btn-disabled` |
| 6 | Click and Hold 1.5s | ClickHoldButton | `btn-click-hold` | `btn-click-hold` |
| 7 | Double Click | shadcn Button + onDoubleClick | `btn-double-click` | `btn-double-click` |
| 8 | Right Click | shadcn Button + onContextMenu | `btn-right-click` | `btn-right-click` |

## techMethods Reference

| Tech | Methods |
|---|---|
| Selenium | `click()` (purple), `doubleClick()` (blue), `contextClick()` (orange), `isEnabled()` (emerald), `getLocation()` (slate) |
| Playwright | `click()` (blue), `dblclick()` (purple), `click({button:'right'})` (orange), `isDisabled()` (red), `boundingBox()` (emerald) |

---

## Progress Summary

| Phase | Total | Done | Remaining |
|---|---|---|---|
| Phase 1 — Data fix | 1 | 1 | 0 |
| Phase 2 — ButtonPage rewrite | 11 | 11 | 0 |
| **Total** | **12** | **12** | **0** |