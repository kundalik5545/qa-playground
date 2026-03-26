# Practice Page Architecture Optimisation — Tasks

**Ref Doc:** `docs/14_PRACTICE_INPUT_FIELDS_OPTIMISATION.md`
**Branch:** `fix/practice-page-ui-issues`

---

## Phase 1 — Create `data/practiceResources.js`

- [x] **Task 1.1** — Create `data/practiceResources.js` with one entry per active practice element containing: `difficulty`, `difficultyColor`, `timeMin`, `scenarioCount`, `youtubeUrl`, `relatedElements`

---

## Phase 2 — Refactor `data/elementsTestCases.js`

- [x] **Task 2.1** — Remove `text_BoxTC` export (no practice page uses it)
- [x] **Task 2.2** — Fix `linksTC` — currently contains accordion test cases (wrong data); replace with proper links test cases
- [x] **Task 2.3** — Add `steps[]` to `buttonTC` (15 entries)
- [x] **Task 2.4** — Add `steps[]` to `radioBoxTC` (15 entries)
- [x] **Task 2.5** — Add `steps[]` to `fileUploadTC` (15 entries)
- [x] **Task 2.6** — Add `steps[]` to `fileDownloadTC` (14 entries)

---

## Phase 3 — Wire `InputPage.jsx` to `practiceResources`

- [x] **Task 3.1** — Import `practiceResources` in `InputPage.jsx` and replace hardcoded `difficulty`, `timeMin`, `scenarioCount` with values from `practiceResources["input-fields"]`
- [x] **Task 3.2** — Wire `youtubeUrl` to the tutorial link in the What You'll Learn card footer (show link button if URL exists, "coming soon" text if empty)

---

## Phase 4 — Deferred (Future Sprints)

- [ ] **Task 4.1** — Upgrade `ButtonPage.jsx` to new standard structure (hero, scenario labels, insight card toggle, test cases accordion)
- [ ] **Task 4.2** — Add missing test case exports for: `dropdownTC`, `alertTC`, `datePickerTC`, `tabsWindowsTC`, `dynamicWaitsTC`, `dataTableTC`, `multiSelectTC`
- [ ] **Task 4.3** — Upgrade all remaining practice components to standard structure
- [ ] **Task 4.4** — Add `formsTC` steps (check `data/formsTestCases.js`)

---

## Progress Summary

| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| Phase 1 — practiceResources | 1 | 1 | 0 |
| Phase 2 — elementsTestCases | 6 | 6 | 0 |
| Phase 3 — InputPage wiring | 2 | 2 | 0 |
| Phase 4 — Deferred | 4 | 0 | 4 |
| **Total (active)** | **9** | **9** | **0** |
