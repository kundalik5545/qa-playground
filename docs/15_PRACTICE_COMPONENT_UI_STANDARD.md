# Practice Component UI Standard — Migration Guide

**File ID:** 15
**Date:** 2026-03-26
**Scope:** All practice components in `app/(Practice)/practice/_components/`
**Reference:** `InputPage.jsx` is the canonical template. Doc 14 covers the data layer. This doc covers the UI/structural changes needed per component.

---

## 1. The Standard Template (InputPage.jsx as Reference)

Every practice component must follow this exact top-level structure:

```
PracticeComponent (root div.space-y-6)
├── A. Hero Section           — badges, h1, description
├── B. Main Layout Row        — flex md:flex-row flex-col items-start gap-5
│   ├── B1. Practice Card     — section[aria-label], flex-1 min-w-0, numbered scenarios
│   └── B2. What You'll Learn — shrink-0 w-64 md:w-72, tech toggle, methods, tutorial link
└── C. Test Cases Section     — h2, Accordion from elementsTestCases.js
```

### A. Hero Section

```jsx
<div className="px-1">
  {/* Badge row */}
  <div className="flex flex-wrap items-center gap-2 mb-3">
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badgeClass}`}>
      <GraduationCap size={12} /> {res.difficulty}
    </span>
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
      <Clock size={12} /> {res.timeMin} min
    </span>
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
      <ListChecks size={12} /> {res.scenarioCount} scenarios
    </span>
  </div>
  {/* Title + description */}
  <h1 className="text-3xl md:text-4xl font-semibold mb-2">
    {Element Name} Automation Practice
  </h1>
  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
    {1–2 sentence description of what the learner will practice}
  </p>
</div>
```

**Data source:** `practiceResources[SLUG]` from `@/data/practiceResources`

### B1. Practice Card

```jsx
<section aria-label="{element} practice exercises" className="flex-1 min-w-0">
  <Card className="w-full shadow-md rounded-lg">
    <CardContent className="pt-5 pb-4 px-5 space-y-5 text-sm">

      {/* Each scenario follows this pattern */}
      <div className="space-y-2">
        <Label htmlFor="..." className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Scenario N: {Descriptive name}
        </Label>
        {/* Interactive element */}
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Repeat for each scenario... */}

    </CardContent>
  </Card>
</section>
```

**Rules:**
- Every scenario must have a `Scenario N:` label
- Scenarios are separated by `<hr className="border-gray-100 dark:border-gray-800" />`
- Last scenario has no trailing `<hr>`
- All interactive elements must have `id`, `name`, `data-testid` attributes
- State badges (DISABLED, READ-ONLY) use the amber/blue pill pattern from InputPage

### B2. What You'll Learn Card

```jsx
<div className="shrink-0 w-64 md:w-72">
  <Card className="shadow-md">
    <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 border-b space-y-0">
      <p className="text-base font-semibold">What You&apos;ll Learn</p>
      <GraduationCap size={18} />
    </CardHeader>
    <CardContent className="p-3 space-y-3">
      {/* Segmented tech toggle */}
      <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 gap-0.5">
        <button onClick={() => setActiveTech("selenium")} className={...}>Selenium (Java)</button>
        <button onClick={() => setActiveTech("playwright")} className={...}>Playwright (JS/PY)</button>
      </div>
      {/* Method list with colored dots */}
      <ul className="space-y-1.5">
        {techMethods[activeTech].map((method) => (
          <li key={method.name} className="flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full shrink-0 ${method.color}`} />
            <span className="font-light">{method.name}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="flex items-center justify-center gap-1.5 p-3 border-t">
      <Video size={14} className="text-gray-400 dark:text-gray-500" />
      {res.youtubeUrl ? (
        <Link href={res.youtubeUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          Watch Tutorial
        </Link>
      ) : (
        <span className="text-xs text-gray-400 dark:text-gray-500">Tutorial video coming soon</span>
      )}
    </CardFooter>
  </Card>
</div>
```

**Rules:**
- `techMethods` is a `const` defined at module level (outside the component), not inside
- Each method entry: `{ name: "methodName()", color: "bg-{color}-500" }` — full Tailwind class strings only (no dynamic construction)
- Provide 4–6 methods per tech
- `activeTech` state is managed inside the component with `useState("selenium")`

### C. Test Cases Section

```jsx
<div>
  <h2 className="text-lg font-semibold mb-3">Test Cases</h2>
  <Accordion type="multiple" className="space-y-2">
    {someTC.map((tc) => (
      <AccordionItem key={tc.TestId} value={tc.TestId}
        className="border rounded-lg px-4 bg-background">
        <AccordionTrigger className="text-sm py-3 hover:no-underline">
          <span className="font-medium text-left">{tc.TestId}: {tc.TestCaseName}</span>
        </AccordionTrigger>
        <AccordionContent className="pb-3">
          <ol className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
            {tc.steps.map((step, i) => (
              <li key={i} className="flex gap-3 py-2 text-xs xl:text-sm text-gray-600 dark:text-gray-400">
                <span className="shrink-0 font-medium text-gray-400 dark:text-gray-500 w-4 text-right">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</div>
```

**Rules:**
- Import the TC array from `@/data/elementsTestCases` (or `@/data/formsTestCases` for forms)
- Every TC entry must have `TestId`, `TestCaseName`, `steps[]`
- If the TC export for an element doesn't exist yet, create it in `elementsTestCases.js` before upgrading the component

---

## 2. Standard Imports Checklist

Every upgraded component needs these imports — remove what was there before:

```js
"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Clock, ListChecks, Video, BookOpen } from "lucide-react";
import Link from "next/link";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";
import { xyzTC } from "@/data/elementsTestCases";  // replace xyzTC with the actual export name
```

**Remove these patterns (old style):**
- `const youtubeLink = ""` — hardcoded inside component
- `const LearningInsight = () => { ... }` — old inner component pattern
- `const QAPlayGround = () => { ... }` — old inner component wrapper (fold content inline)
- `import { Label } from "@/components/ui/label"` — only if used in scenarios; keep if needed

---

## 3. Required Data Setup Before Each Component

Before upgrading any component, verify these two things exist:

### 3.1 `data/practiceResources.js` — entry for the slug

All 13 entries already exist. Verify the values are accurate (scenarioCount especially — update it to match actual scenarios in the new design).

### 3.2 `data/elementsTestCases.js` — TC export for the element

| Component File | Slug | TC Export | Status |
|---|---|---|---|
| `InputPage.jsx` | `input-fields` | `inputFieldTC` | ✅ Done — has steps |
| `ButtonPage.jsx` | `buttons` | `buttonTC` | ✅ Done — has steps |
| `RadioButton.jsx` | `radio-checkbox` | `radioBoxTC` | ✅ Done — has steps |
| `FileUploadDownloadPage.jsx` | `file-upload` / `file-download` | `fileUploadTC`, `fileDownloadTC` | ✅ Done — has steps |
| `LinkPage.jsx` | `links` | `linksTC` | ✅ Fixed (was wrong data) |
| `SelectPage.jsx` | `dropdowns` | `dropdownTC` | ❌ Missing — must create |
| `AlertPage.jsx` | `alerts-dialogs` | `alertTC` | ❌ Missing — must create |
| `CalendarPage.jsx` | `date-picker` | `datePickerTC` | ❌ Missing — must create |
| `WindowsPage.jsx` | `tabs-windows` | `tabsWindowsTC` | ❌ Missing — must create |
| `WaitPage.jsx` | `dynamic-waits` | `dynamicWaitsTC` | ❌ Missing — must create |
| `TablePage.jsx` / `AdvanceTablePage.jsx` | `data-table` | `dataTableTC` | ❌ Missing — must create |
| `FormsPage.jsx` | `forms` | check `formsTestCases.js` | ⚠️ Separate file — verify steps exist |
| `MultiSelectPage.jsx` | `multi-select` | `multiSelectTC` | ❌ Missing — must create |

---

## 4. Per-Component Change Analysis

### 4.1 `ButtonPage.jsx` — slug: `buttons`

**Current state:** No hero, old `QAPlayGround` inner function, old `LearningInsight` inner function, `const youtubeLink = ""`, `w-2/3` / `w-1/3` split, no scenario numbering, no test cases accordion.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Add full hero section — pull from `practiceResources["buttons"]` |
| Layout | Replace `sm:flex-row w-full gap-4` + `w-2/3` / `w-1/3` with `flex md:flex-row flex-col items-start gap-5` + `flex-1 min-w-0` / `shrink-0 w-64 md:w-72` |
| Practice card | Wrap `QAPlayGround` content inline in the card; remove inner `QAPlayGround` function; add `Scenario N:` label to each button group |
| Insight card | Replace old `LearningInsight` list with tech toggle (Selenium/Playwright) + method dots |
| `youtubeLink` | Remove; use `res.youtubeUrl` from `practiceResources` |
| Tutorial footer | Replace `<Link href={youtubeLink}>` with conditional render (link if URL, "coming soon" if empty) |
| Test cases | Add Accordion section below using `buttonTC` |
| `techMethods` | Define at module level: Selenium: `click()`, `doubleClick()`, `rightClick()`, `isEnabled()`, `getLocation()` / Playwright: `click()`, `dblclick()`, `click({button:"right"})`, `isDisabled()`, `boundingBox()` |
| `ClickHoldButton` | Keep as a named export at module level — it's fine |
| Scenario numbering | 7 scenarios exist in current UI; number them 1–7 |

**`data-testid` attributes to add (currently missing on some elements):**
- `button-color` div → add `data-testid="btn-goto-home"`
- `button-xyCordinate` → add `data-testid="btn-find-location"`
- `button-color` (duplicate id!) → fix: rename second id to `button-find-color`, add `data-testid="btn-find-color"`
- `button-heightWidth` → add `data-testid="btn-size"`
- `button-disabled` → add `data-testid="btn-disabled"`
- `button-clickHold` → add `data-testid="btn-click-hold"`
- `double-click` → add `data-testid="btn-double-click"`
- `right-click` → add `data-testid="btn-right-click"`

---

### 4.2 `RadioButton.jsx` — slug: `radio-checkbox`

**Current state:** No hero, no h1/h2, old `LearningInsight` inner function, `const youtubeLink = ""`, no scenario numbering, no test cases accordion, old `w-2/3` / `w-1/3` layout.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Add full hero section — pull from `practiceResources["radio-checkbox"]` |
| Layout | Same layout migration as ButtonPage |
| Insight card | Replace old list with tech toggle + method dots |
| Scenario labels | Add `Scenario N:` label to each radio/checkbox group |
| `youtubeLink` | Remove; use `res.youtubeUrl` |
| Test cases | Add Accordion section using `radioBoxTC` |
| `techMethods` | Selenium: `click()`, `isSelected()`, `getAttribute("checked")`, `findElements()`, `WebElement.isEnabled()` / Playwright: `check()`, `uncheck()`, `isChecked()`, `locator.all()`, `toBeChecked()` |

---

### 4.3 `SelectPage.jsx` — slug: `dropdowns`

**Current state:** No hero, no scenario labels, old `LearningInsight` inner function, `const youtubeLink = ""`, no test cases, old layout. Has a `Select` dropdown (shadcn) — interactive.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Add full hero section — pull from `practiceResources["dropdowns"]` |
| Layout | Same layout migration |
| Insight card | Replace with tech toggle + method dots |
| Scenario labels | Audit current select interactions and number them |
| `dropdownTC` | Create in `elementsTestCases.js` before upgrading |
| Test cases | Add Accordion using `dropdownTC` |
| `techMethods` | Selenium: `Select.selectByVisibleText()`, `Select.selectByValue()`, `Select.getOptions()`, `Select.getAllSelectedOptions()`, `Select.deselectAll()` / Playwright: `selectOption()`, `locator.selectOption({label})`, `locator.inputValue()`, `locator.allInnerTexts()`, `toHaveValue()` |

---

### 4.4 `LinkPage.jsx` — slug: `links`

**Current state:** Has h2 "Link" title and 7 numbered sections (already uses numbered pattern). Has a test cases Table (not Accordion). Uses `linksTC` already. Old `LearningInsight` inner function. Old layout width split. No difficulty badge/time badge.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Upgrade existing h2 to full hero section with badges — pull from `practiceResources["links"]` |
| Layout | Same layout migration |
| Insight card | Replace old list with tech toggle + method dots |
| Test cases display | Replace current Table component with the standard Accordion pattern |
| `youtubeLink` | Remove; use `res.youtubeUrl` |
| `techMethods` | Selenium: `click()`, `getAttribute("href")`, `getAttribute("target")`, `driver.navigate().back()`, `driver.getWindowHandles()` / Playwright: `click()`, `getAttribute("href")`, `getAttribute("target")`, `page.goBack()`, `context.pages()` |

**Scenarios:** Keep existing 7 numbered sections — they map to: Internal link, External link, New tab link, Email link, Broken link, Relative URL, Download link.

---

### 4.5 `AlertPage.jsx` — slug: `alerts-dialogs`

**Current state:** Has h2 "Alert" title, 3 action groups (Alert, Confirm, Prompt). Old `LearningInsight`. Old layout. No test cases.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Upgrade to full hero section with badges |
| Layout | Same layout migration |
| Insight card | Replace with tech toggle + method dots |
| Scenario labels | Add `Scenario N:` to each alert group (Alert, Confirm, Prompt = 3 scenarios) |
| `alertTC` | Create in `elementsTestCases.js` |
| Test cases | Add Accordion using `alertTC` |
| `techMethods` | Selenium: `Alert.accept()`, `Alert.dismiss()`, `Alert.getText()`, `Alert.sendKeys()`, `driver.switchTo().alert()` / Playwright: `page.on("dialog")`, `dialog.accept()`, `dialog.dismiss()`, `dialog.message()`, `dialog.type()` |

---

### 4.6 `WindowsPage.jsx` — slug: `tabs-windows`

**Current state:** No hero, no h1/h2, 8-item steps list (not scenarios), old `LearningInsight` inner function, `const youtubeLink = ""`, no test cases accordion, old layout.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Add full hero section |
| Layout | Same layout migration |
| Insight card | Replace with tech toggle + method dots |
| Scenario labels | Audit the 8 step items; group into scenarios (new tab, switch window, close window, etc.) and number them |
| `tabsWindowsTC` | Create in `elementsTestCases.js` |
| Test cases | Add Accordion using `tabsWindowsTC` |
| `techMethods` | Selenium: `driver.getWindowHandles()`, `driver.switchTo().window()`, `driver.close()`, `driver.getWindowHandle()`, `Actions.keyDown(Keys.CONTROL).click()` / Playwright: `context.pages()`, `page.waitForEvent("popup")`, `page.close()`, `browserContext.newPage()`, `page.bringToFront()` |

---

### 4.7 `WaitPage.jsx` — slug: `dynamic-waits`

**Current state:** No hero, no h1/h2, 3-item list, old `LearningInsight`, `const youtubeLink = ""`, no test cases, old layout.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Add full hero section |
| Layout | Same layout migration |
| Insight card | Replace with tech toggle + method dots |
| Scenario labels | Add `Scenario N:` labels to each wait scenario |
| `dynamicWaitsTC` | Create in `elementsTestCases.js` |
| Test cases | Add Accordion using `dynamicWaitsTC` |
| `techMethods` | Selenium: `WebDriverWait.until()`, `ExpectedConditions.visibilityOf()`, `ExpectedConditions.elementToBeClickable()`, `FluentWait`, `implicitlyWait()` / Playwright: `page.waitForSelector()`, `page.waitForTimeout()`, `expect(locator).toBeVisible()`, `waitForResponse()`, `waitForLoadState()` |

---

### 4.8 `FileUploadDownloadPage.jsx` — slug: `file-upload`

**Current state:** No hero, no scenario labels, old `LearningInsight`, `const youtubeLink = ""`, no test cases accordion, old layout. Has `fileUploadTC` and `fileDownloadTC` already with steps.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Add full hero section — pull from `practiceResources["file-upload"]` |
| Layout | Same layout migration |
| Insight card | Replace with tech toggle + method dots |
| Scenario labels | Add `Scenario N:` to upload + download groups |
| Test cases | Add Accordion using `fileUploadTC` (and optionally `fileDownloadTC` in a second section) |
| `techMethods` | Selenium: `sendKeys("/path/to/file")`, `driver.findElement(By.cssSelector("input[type='file']"))`, `Robot.keyPress()`, `AutoIT`, `getAttribute("value")` / Playwright: `setInputFiles()`, `locator.setInputFiles()`, `page.on("download")`, `download.path()`, `download.saveAs()` |

---

### 4.9 `CalendarPage.jsx` — slug: `date-picker`

**Current state:** No hero, no scenario labels, old `LearningInsight`, `const youtubeLink = ""`, no test cases, old layout. Uses `react-day-picker`.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Add full hero section — pull from `practiceResources["date-picker"]` |
| Layout | Same layout migration |
| Insight card | Replace with tech toggle + method dots |
| Scenario labels | Number existing calendar interactions as scenarios |
| `datePickerTC` | Create in `elementsTestCases.js` |
| Test cases | Add Accordion using `datePickerTC` |
| `techMethods` | Selenium: `sendKeys("MM/DD/YYYY")`, `JavascriptExecutor`, `WebDriverWait.until(ExpectedConditions.visibilityOf())`, `click()`, `getText()` / Playwright: `fill("2024-01-15")`, `click()`, `locator.textContent()`, `waitForSelector()`, `toHaveValue()` |

---

### 4.10 `TablePage.jsx` — slug: `data-table`

**Current state:** No hero, no scenario labels, old `LearningInsight`, `const youtubeLink = ""`, no test cases, old layout. Fetches data from fakerapi (external — async). No sidebar equivalent of AdvanceTablePage.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Add full hero section — pull from `practiceResources["data-table"]` |
| Layout | Same layout migration |
| Insight card | Replace with tech toggle + method dots |
| Scenario labels | Number table interaction groups (read cell, sort column, filter rows, paginate, etc.) |
| `dataTableTC` | Create in `elementsTestCases.js` |
| Test cases | Add Accordion using `dataTableTC` |
| `techMethods` | Selenium: `findElements(By.tagName("tr"))`, `findElement(By.xpath("//td[text()='value']"))`, `getText()`, `getAttribute()`, `Actions.moveToElement()` / Playwright: `locator("table tr")`, `locator.nth()`, `filter({hasText})`, `textContent()`, `toHaveCount()` |

**Note:** `AdvanceTablePage.jsx` has no sidebar at all and a completely standalone layout. Treat it separately — it needs the full structure added from scratch.

---

### 4.11 `FormsPage.jsx` — slug: `forms`

**Current state:** Has h2 "Forms" title. No hero badges. Old `LearningInsight`. `const youtubeLink = ""`. Old layout. Has `formsTestCases.js` — verify steps exist before upgrading.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Upgrade existing h2 to full hero section with badges — pull from `practiceResources["forms"]` |
| Layout | Same layout migration |
| Insight card | Replace with tech toggle + method dots |
| Scenario labels | Number each form section |
| TC export | Verify `formsTestCases.js` exports have `steps[]`; add if missing |
| Test cases | Add Accordion using the forms TC export |
| `techMethods` | Selenium: `sendKeys()`, `click()`, `Select.selectByVisibleText()`, `submit()`, `isDisplayed()` / Playwright: `fill()`, `selectOption()`, `check()`, `click()`, `locator.evaluate()` |

---

### 4.12 `MultiSelectPage.jsx` — slug: `multi-select`

**Current state:** Has h2 "Multi-Select" title, 5 numbered scenarios (already numbered). Old `LearningInsight`. `const youtubeLink = ""`. Old layout. No test cases.

**What needs to change:**

| Area | Change |
|---|---|
| Hero | Upgrade existing h2 to full hero section with badges |
| Layout | Same layout migration |
| Insight card | Replace with tech toggle + method dots |
| Scenario labels | Already numbered — keep; convert labels to `Scenario N:` prefix pattern |
| `multiSelectTC` | Create in `elementsTestCases.js` |
| Test cases | Add Accordion using `multiSelectTC` |
| `techMethods` | Selenium: `Select.selectByVisibleText()`, `Actions.keyDown(Keys.CONTROL).click()`, `Select.getAllSelectedOptions()`, `Select.deselectByVisibleText()`, `Select.isMultiple()` / Playwright: `selectOption([...])`, `locator.selectOption({label})`, `locator.evaluate()`, `toHaveValues()`, `locator.allInnerTexts()` |

---

## 5. What Does NOT Change

- The interactive element behavior itself — buttons still click, calendars still pick dates, tables still load data
- `data-testid`, `id`, `name` attributes — preserve all existing ones; only add missing ones
- External data fetches (e.g. `TablePage` fetching from fakerapi) — keep as-is
- `ClickHoldButton` component in `ButtonPage` — keep as named export at module level
- `react-day-picker` usage in `CalendarPage` — keep
- `AdvanceTablePage` complex internal state — preserve, only add the wrapper structure around it

---

## 6. Dark Mode Requirements

Every element in the template has dark mode variants. When upgrading components, never add a class without a `dark:` counterpart for:
- Background colors → `dark:bg-*`
- Text colors → `dark:text-*`
- Border colors → `dark:border-*`
- Card backgrounds → `dark:bg-gray-800` (already handled by shadcn Card)

Tailwind dynamic class rule: never build class strings from variables. All color variants in `techMethods` must be full strings like `"bg-purple-500"` — not `"bg-" + color + "-500"`.

---

## 7. Slug → SLUG Constant Pattern

Each component must define a `SLUG` constant at module level that matches the URL slug and the `practiceResources` key:

```js
const SLUG = "buttons";          // ButtonPage.jsx
const SLUG = "radio-checkbox";   // RadioButton.jsx
const SLUG = "dropdowns";        // SelectPage.jsx
// etc.
```

This keeps the `practiceResources[SLUG]` lookup clean and makes the slug explicit.

---

## 8. Recommended Upgrade Order

Upgrade one component per sprint. Suggested sequence based on complexity (simplest first):

1. `ButtonPage.jsx` — TC data ready, most similar to InputPage
2. `RadioButton.jsx` — TC data ready
3. `LinkPage.jsx` — TC data ready, already has numbered sections
4. `FileUploadDownloadPage.jsx` — TC data ready
5. `MultiSelectPage.jsx` — already has numbered scenarios
6. `SelectPage.jsx` — needs `dropdownTC` created first
7. `AlertPage.jsx` — needs `alertTC` created first
8. `WindowsPage.jsx` — needs `tabsWindowsTC` created first
9. `WaitPage.jsx` — needs `dynamicWaitsTC` created first
10. `FormsPage.jsx` — verify `formsTestCases.js` first
11. `CalendarPage.jsx` — needs `datePickerTC` created first
12. `TablePage.jsx` — needs `dataTableTC` created first
13. `AdvanceTablePage.jsx` — most complex, standalone layout — last

For each upgrade: create the TC export first → then upgrade the component.