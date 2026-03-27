# Task 15-5 — Links Page Upgrade

**Goal:** Upgrade `practice/links` page to the standard UI template defined in `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md` (section 4.4).

**Branch:** `fix/small-bug-fix`
**Ref docs:** `docs/15_PRACTICE_COMPONENT_UI_STANDARD.md` — section 4.4

---

## Scope

- `app/(Practice)/practice/_components/LinkPage.jsx`
- `data/practiceResources.js` — update `scenarioCount` for links from 4 → 7
- `data/practiceElementFaqs.js` — add `links` FAQ entry

---

## Pre-work Findings (current state of LinkPage.jsx)

| Area | Current State |
|---|---|
| Hero | ❌ Only a plain `<h2>Link</h2>` — no badges, no h1, no description |
| Layout | ❌ Old: `sm:w-2/3` / `sm:w-1/3` split, no standard flex pattern |
| Practice card | ❌ No wrapping Card — sections use individual `border shadow-md rounded-md` divs; no `Scenario N:` prefix labels |
| Insight card | ❌ Old `LearningInsight` with wrong methods (accept, dismiss, switchTo — these are Alert methods, not Links!) |
| `youtubeLink` | ❌ `const youtubeLink = ""` hardcoded inside component |
| Test cases | ❌ Rendered as a `<Table>` component — must be converted to standard Accordion |
| `SLUG` constant | ❌ Missing |
| `data-testid` | ❌ Missing on all link/anchor elements |
| `scenarioCount` | ❌ Set to 4 in practiceResources but page has 7 scenarios |
| Bug | ❌ LearningInsight shows Alert methods (`accept()`, `dismiss()`) — completely wrong for a links page |

---

## Tasks

### Phase 1 — Data & Config

- [x] **Task 1.1** — Update `scenarioCount` from 4 → 7 in `data/practiceResources.js` for `links`
- [x] **Task 1.2** — `linksTC` already exists with 12 TCs and steps — no new data needed ✅

### Phase 2 — LinkPage.jsx Rewrite

- [x] **Task 2.1** — Remove `const youtubeLink = ""`, `LearningInsight` inner function, standalone `h2`
- [x] **Task 2.2** — Add `const SLUG = "links"` at module level
- [x] **Task 2.3** — Define correct `techMethods` at module level (Selenium + Playwright, 5 methods each — link-specific, not alert)
- [x] **Task 2.4** — Extract `QAPlayGround` content inline as `LinksPractice` function at module level; keep all 7 scenarios and API call logic
- [x] **Task 2.5** — Wrap all scenarios inside a single `<Card>` with `<hr>` separators instead of individual bordered sections
- [x] **Task 2.6** — Add `Scenario N:` label prefix to all 7 scenario headings
- [x] **Task 2.7** — Add `data-testid` and `id` attributes to all link and anchor elements
- [x] **Task 2.8** — Rewrite `LinksPage` with standard layout: Hero + flex row (Practice card | What You'll Learn) + Test Cases
- [x] **Task 2.9** — Hero section pulled from `practiceResources["links"]`
- [x] **Task 2.10** — Replace Insight card with standard "What You'll Learn" card (correct tech toggle + method dots + tutorial link footer)
- [x] **Task 2.11** — Replace `<Table>` test cases with standard Accordion using `linksTC`
- [x] **Task 2.12** — Add `NextElementCard` below What You'll Learn card

### Phase 3 — FAQ

- [x] **Task 3.1** — Add `links` FAQ entry to `data/practiceElementFaqs.js` (6 FAQs)

---

## techMethods Reference

| Tech | Methods |
|---|---|
| Selenium | `click()` (purple), `getAttribute("href")` (blue), `getAttribute("target")` (orange), `driver.navigate().back()` (emerald), `driver.getWindowHandles()` (slate) |
| Playwright | `click()` (blue), `getAttribute("href")` (purple), `page.goBack()` (orange), `page.waitForEvent("popup")` (emerald), `context.pages()` (red) |

---

## Scenario Map

| # | Scenario | data-testid pattern |
|---|---|---|
| 1 | Internal Following Links | `link-internal-home`, `link-internal-about` |
| 2 | External Links (New Tab) | `link-external-selenium`, `link-external-course` |
| 3 | Broken Links | `link-broken-newtab`, `link-broken-same`, `link-broken-empty` |
| 4 | Image Links | `link-image-ironman` |
| 5 | Button Links | `link-btn-broken`, `link-btn-broken-2`, `link-btn-home` |
| 6 | Text Links & Anchor | `link-text-garbled`, `link-text-anchor` |
| 7 | API Status Code Links | buttons keep existing onClick handlers |

---

## Progress Summary

| Phase | Total | Done | Remaining |
|---|---|---|---|
| Phase 1 — Data | 2 | 2 | 0 |
| Phase 2 — Rewrite | 12 | 12 | 0 |
| Phase 3 — FAQ | 1 | 1 | 0 |
| **Total** | **15** | **15** | **0** |
