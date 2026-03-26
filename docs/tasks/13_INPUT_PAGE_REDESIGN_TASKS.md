# Task 13 — Input Page Redesign

**Goal:** Redesign `practice/input-fields` page to match the new UI design with a wider practice card, interactive tech-toggle learning sidebar, scenario labels, and a test cases accordion section.

---

## Scope

- File: `app/(Practice)/practice/_components/InputPage.jsx`
- Data: `data/elementsTestCases.js` (new `inputFieldTC` export)

---

## Tasks

### Phase 1 — Data

- [x] Add `inputFieldTC` export to `data/elementsTestCases.js`
  - 12 test cases total (2 per scenario)
  - Each entry has: `TestId`, `TestCaseName`, `description`

### Phase 2 — Hero Section

- [x] Replace plain text badges with icon-enhanced badges:
  - `<GraduationCap>` + "Beginner" (green pill)
  - `<Clock>` + "~15 min" (gray text)
  - `<ListChecks>` + "6 scenarios" (gray text)
- [x] Keep existing h1 title and description text

### Phase 3 — Layout

- [x] Replace fixed-width practice card (`w-[350px] sm:w-[500px]`) with `flex-1 min-w-0` so it expands to fill available space
- [x] Keep "What You'll Learn" card at `shrink-0 w-64 md:w-72`
- [x] Maintain `flex md:flex-row flex-col` responsive stacking

### Phase 4 — Practice Card

- [x] Add scenario number labels (`Scenario 1: Movie Name Input`, etc.) with `<BookOpen>` icon per scenario
- [x] Add horizontal dividers between each scenario group
- [x] Scenario 2: Wrap input + "Tab" key badge in flex row
- [x] Scenario 3: Add `<CheckCircle2>` icon inside input using relative wrapper; green border/bg
- [x] Scenario 4: Keep controlled input (clear-the-text)
- [x] Scenario 5: Keep DISABLED badge + amber styling
- [x] Scenario 6: Keep READ-ONLY badge + blue styling

### Phase 5 — What You'll Learn Card

- [x] Add segmented tab toggle: "Selenium (Java)" | "Playwright (JS/PY)"
- [x] Show method list with colored dot per method for active tech
- [x] Methods per tech:
  - Selenium: sendKeys(), clear(), getAttribute(), isEnabled(), Keys.TAB
  - Playwright: fill(), press("Tab"), inputValue(), toBeDisabled(), toHaveAttribute()
- [x] Keep "Tutorial video coming soon" footer

### Phase 6 — Test Cases Section

- [x] Add `<Accordion type="multiple">` below the two main cards
- [x] Import `inputFieldTC` from `@/data/elementsTestCases`
- [x] Render all 12 test cases as `AccordionItem`s
- [x] Each item: `TC01: <TestCaseName>` as trigger, description as content

---

## Test Cases Reference (2 per scenario)

| ID   | Scenario | Test Case Name |
|------|----------|----------------|
| TC01 | 1 – Movie Name Input | Verify successful movie name input |
| TC02 | 1 – Movie Name Input | Verify input placeholder disappears on typing |
| TC03 | 2 – Append & Tab | Verify keyboard tab triggers focus change after append |
| TC04 | 2 – Append & Tab | Verify appended text value is retained in the field |
| TC05 | 3 – Verify Text | Verify text present inside input field matches expected value |
| TC06 | 3 – Verify Text | Verify getAttribute returns the correct input value |
| TC07 | 4 – Clear Text | Verify input field text can be cleared successfully |
| TC08 | 4 – Clear Text | Verify field is empty after executing clear action |
| TC09 | 5 – Disabled | Verify disabled input field cannot be edited by user |
| TC10 | 5 – Disabled | Verify isEnabled() returns false for disabled input |
| TC11 | 6 – Readonly | Verify readonly input field does not accept user typing |
| TC12 | 6 – Readonly | Verify getAttribute returns correct readonly attribute value |
