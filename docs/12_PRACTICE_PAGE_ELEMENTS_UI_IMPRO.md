# QA Playground — `/practice/input` Page Audit Report

**URL:** https://www.qaplayground.com/practice/input  
**Audit Date:** 2026-03-26  
**Auditor:** Claude (Sonnet 4.6)  
**Target Audience:** QA Automation Engineers & AI Engineers using Selenium, Playwright, Java, JavaScript, Python, MCP/AI tooling

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [SEO Issues & Fixes](#2-seo-issues--fixes)
3. [UI Issues & Fixes](#3-ui-issues--fixes)
4. [Accessibility & HTML Issues](#4-accessibility--html-issues)
5. [Locator & XPath Strategy Issues](#5-locator--xpath-strategy-issues)
6. [Code Section Issues & Fixes](#6-code-section-issues--fixes)
7. [Missing Content & Features](#7-missing-content--features)
8. [Generic Practice Page Template (Best Practice)](#8-generic-practice-page-template-best-practice)
9. [Recommended UI Component Redesign — Input Page Specific](#9-recommended-ui-component-redesign--input-page-specific)
10. [Prioritised Fix List for Claude](#10-prioritised-fix-list-for-claude)

---

## 1. Executive Summary

The `/practice/input` page provides solid technical content (6 input scenarios, code snippets for Selenium Java / Playwright JS / Playwright Python) but has significant gaps across **SEO**, **UI/UX**, **accessibility**, **locator design**, and **content completeness** that reduce discoverability, user confidence, and automation practice value — especially for AI engineers.

**Score Estimates (before fixes):**
| Category | Score |
|---|---|
| SEO | 42 / 100 |
| UI/UX | 48 / 100 |
| Accessibility | 35 / 100 |
| Locator Quality | 30 / 100 |
| Content Completeness | 40 / 100 |
| Developer Experience | 45 / 100 |

---

## 2. SEO Issues & Fixes

### 2.1 Page Title — Incomplete, Missing Brand Hierarchy

**Current:**

```
How to Handle Input Fields in Selenium and Playwright
```

**Issues:**

- No brand suffix (`| QA Playground`)
- Missing target keyword "practice" and "automate"
- Does not reflect the page is interactive/hands-on
- Missing language qualifiers (Java, Python, JavaScript)

**Fix:**

```
How to Automate Input Fields in Selenium & Playwright (Java, JS, Python) | QA Playground
```

---

### 2.2 Meta Description — Truncated & Misses CTA

**Current (truncated at ~155 chars):**

```
Learn how to automate text input fields using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Covers sendKeys, clear, getAttribute, disable...
```

**Issues:**

- Cuts off mid-word ("disable..." — should end with "disabled and readonly inputs")
- No call-to-action ("Practice now", "Try it live")
- Doesn't mention it's an **interactive** hands-on exercise
- Missing keywords: `automation testing`, `practice`, `QA engineer`, `test automation`

**Fix (155 chars):**

```
Practice automating input fields with Selenium (Java) & Playwright (JS/Python). Interactive exercises covering sendKeys, clear, disabled, readonly. Try it free.
```

---

### 2.3 H1 Tag — MISSING (Critical SEO Bug)

**Current:** There is NO `<h1>` on the page. The word "Input" renders as an `<h2>`, and "Introduction" also renders as `<h2>`.

**Evidence from DOM:** `h1s: (empty)` — confirmed via `document.querySelectorAll('h1')`

**Impact:** Google cannot determine the primary topic. This alone can drop rankings significantly.

**Fix:**

- Change the page title heading "Input" to `<h1>` with descriptive text:

```html
<h1>Input Field Automation Practice — Selenium & Playwright</h1>
```

- All other section headings (`Introduction`, `Key Methods Summary`, scenario headings) should be `<h2>`
- Sub-headings like `Selenium (Java)`, `Playwright (JS)` should be `<h3>`

---

### 2.4 Heading Hierarchy — Broken

**Current heading structure:**

```
h2: Input
h2: Introduction
h2: Key Methods Summary
h2: 1. Type text into an input field
h2: 2. Append text and press Tab
...
h3: Selenium (Java)
h3: Playwright (JS)
h3: Playwright (Python)
h3: PLATFORM  ← footer headings leaking into heading hierarchy
h3: LEARN
h3: COMPANY
```

**Issues:**

- No `<h1>` at all
- Footer headings (`PLATFORM`, `LEARN`, `COMPANY`) are `<h3>` — they should be `<h4>` or visually styled `<p>` elements so they don't pollute heading hierarchy
- "Input" is a non-descriptive h2

**Fix:** Full heading map:

```
h1: Input Field Automation Practice — Selenium & Playwright
  h2: Introduction
  h2: Key Methods Summary
  h2: 1. Type text into an input field
    h3: Selenium (Java)
    h3: Playwright (JS)
    h3: Playwright (Python)
  h2: 2. Append text and press Tab
    h3: Selenium (Java)
    ...
footer:
  h4: Platform (or <p class="footer-heading">)
  h4: Learn
  h4: Company
```

---

### 2.5 Structured Data (JSON-LD) — COMPLETELY MISSING

**Current:** `LD+JSON count: 0` — zero structured data on the page.

**Fix:** Add the following schema types:

```json
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "Input Field Automation Practice — Selenium & Playwright",
  "description": "Interactive practice page for automating input fields using Selenium WebDriver and Playwright across Java, JavaScript and Python.",
  "url": "https://www.qaplayground.com/practice/input",
  "educationalLevel": "Beginner to Intermediate",
  "teaches": [
    "sendKeys",
    "fill",
    "clear",
    "getAttribute",
    "isEnabled",
    "Keyboard TAB"
  ],
  "programmingLanguage": ["Java", "JavaScript", "Python"],
  "provider": {
    "@type": "Organization",
    "name": "QA Playground",
    "url": "https://www.qaplayground.com"
  }
}
```

Also add `BreadcrumbList` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.qaplayground.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Practice",
      "item": "https://www.qaplayground.com/practice"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Input Fields",
      "item": "https://www.qaplayground.com/practice/input"
    }
  ]
}
```

---

### 2.6 Open Graph Tags — Partially Broken

**Current:**

- `og:title` = "How to Handle Input Fields in Selenium and Playwright" ✅
- `og:image` = `/Images/blogs/b3.jpg` ⚠️ — generic blog image, not page-specific
- No `og:type` set (should be `article` or `website`)
- No `og:locale`
- No `article:published_time` or `article:modified_time`

**Twitter Card mismatch:**

- `twitter:title` = "QA Playground: Practice Automation Testing with Selenium" — this is the **site-level** title, NOT the page-specific title! Wrong tag.
- `twitter:image` = `/og-image.png` — different image than OG image, inconsistent

**Fix:**

```html
<meta property="og:type" content="article" />
<meta property="og:locale" content="en_US" />
<meta
  property="og:image"
  content="https://www.qaplayground.com/og/practice-input.png"
/>
<meta
  name="twitter:title"
  content="Input Field Automation Practice | QA Playground"
/>
<meta
  name="twitter:image"
  content="https://www.qaplayground.com/og/practice-input.png"
/>
```

---

### 2.7 Canonical Tag — OK but Verify

**Current:** `https://www.qaplayground.com/practice/input` ✅  
No trailing slash issue detected. This is correct.

---

### 2.8 Breadcrumb Navigation — MISSING

No breadcrumb exists on the page at all. This hurts both SEO (no BreadcrumbList signals) and UX (user has no sense of location).

**Fix:** Add visible breadcrumb immediately below the navbar:

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/practice">Practice</a></li>
    <li aria-current="page">Input Fields</li>
  </ol>
</nav>
```

---

### 2.9 Keyword Coverage — Missing Key Terms

The page lacks coverage of important search terms that the target audience uses:

**Missing keywords to integrate naturally:**

- `xpath for input field`
- `css selector input selenium`
- `data-testid automation`
- `AI test automation`
- `Playwright locator strategy`
- `automation practice website`
- `input field test cases`
- `selenium java sendkeys example`

---

### 2.10 Internal Linking — Very Weak

**Current:** Only one internal link at the bottom (`Top 10 Best Automation Practice Website`).

**Fix:** Add contextual internal links:

- In the intro, link `Playwright` → `/practice` (overview)
- After each code scenario, link to related elements (e.g., after Tab key → link to keyboard events practice page)
- Add "Next Practice Element →" navigation at bottom
- Add "Related: Checkbox, Select, TextArea" links within content

---

## 3. UI Issues & Fixes

### 3.1 Page Header / Hero Section — Too Sparse & Generic

**Current:** Just the single word `Input` (h2) with no context, no description, no difficulty indicator, no time estimate.

**Issues:**

- User lands with zero context about what they'll practice
- No difficulty badge (Beginner/Intermediate/Advanced)
- No estimated completion time
- No list of skills they'll gain (above the fold)
- No "what you need" prerequisites

**Fix — Redesigned Hero:**

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏷️ [Beginner]  ⏱️ ~15 min  ✅ 6 scenarios                      │
│                                                                   │
│ h1: Input Field Automation Practice                               │
│ p:  Master text input interactions in Selenium & Playwright.      │
│     Practice typing, clearing, reading values, and detecting      │
│     disabled/readonly states — with real runnable examples.       │
│                                                                   │
│ [🚀 Start Practicing]  [📖 View Docs]  [▶️ Watch Tutorial]       │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Practice Card (Interactive Zone) — Poor Visual Design

**Current state:**

- Plain white card with no visual hierarchy
- No visible numbering or scenario titles on the card inputs
- No status indicators (✅ Done, 🔒 Disabled, 👁️ ReadOnly)
- No colour coding between normal / disabled / readonly states
- "Insight" box is partially cut off on the right (overflow issue on 885px viewport)
- "Watch tutorial" link has no icon or CTA style — looks like plain text

**Specific Issues:**

**a) Input labels are instructions, not identifiers**
Labels like "Append a text and press keyboard tab" are instructions, not names. Users can't instantly map which input is which in their test code.

**Fix:** Each input card should show:

```
┌──────────────────────────────────────────────────────┐
│ #2  Append & Tab                          [Scenario]  │
│ ─────────────────────────────────────────────────────│
│ 📝 Instruction: Type text, then press Tab key        │
│ 🔑 Element ID: #appendText                           │
│ 🏷️ XPath: //input[@id='appendText']                  │
│ [___________________________] ← input field          │
│                                                       │
│ 💡 What to test: Tab triggers focus change           │
└──────────────────────────────────────────────────────┘
```

**b) Disabled field looks identical to enabled fields**

- No visual differentiation except very subtle opacity
- Users may not realise it's disabled without reading the label

**Fix:** Add a 🔒 icon badge and a `[DISABLED]` pill badge on the input card. Change border colour to amber/orange.

**c) ReadOnly field looks identical to editable fields**

- No visual cue that it's readonly

**Fix:** Add a 👁️ icon badge and a `[READ-ONLY]` pill badge. Change border colour to blue/indigo.

**d) Insight box is overflowing / cut off**
On standard viewport (885px) the Insight box is clipped. It needs proper responsive handling.

**Fix:**

- Convert the 2-column layout (practice card + insight) to a stacked layout on screens < 1024px
- Or make Insight box sticky on the right on desktop only, with full visibility

---

### 3.3 Insight Box — Content Too Generic

**Current content:**

- Lists: `sendKeys()`, `Keyboard TAB`, `getAttribute()`, `clear()`, `isEnabled()`
- "Watch tutorial" link

**Issues:**

- Only 5 concepts listed — missing `fill()`, `press()`, `toBeDisabled()`, `isReadOnly()`, `inputValue()`
- No difficulty context
- No language-specific notes
- "Watch tutorial" link has no styling — it looks like plain underlined text with no affordance
- No estimated time

**Fix — Expanded Insight Box:**

```
┌─────────────────────────────────────────────┐
│ 💡 What You'll Learn                         │
│ ─────────────────────────────────────────── │
│ ⏱️ Estimated time: ~15 minutes               │
│ 📊 Difficulty: ██░░░ Beginner                │
│                                              │
│ Selenium (Java)          Playwright          │
│ ✅ sendKeys()            ✅ fill()           │
│ ✅ clear()               ✅ press("Tab")     │
│ ✅ getAttribute()        ✅ inputValue()     │
│ ✅ isEnabled()           ✅ toBeDisabled()  │
│ ✅ Keys.TAB              ✅ toHaveAttribute │
│                                              │
│ [▶️ Watch Tutorial]  [📋 Test Cases]         │
└─────────────────────────────────────────────┘
```

---

### 3.4 Code Blocks — Major UX Problems

**Current:**

- `<code>` elements have NO language class (e.g. `class="language-java"`) — confirmed from DOM audit
- No syntax highlighting differentiation between languages
- 18 code blocks with no tab switching — user must scroll through 3 separate blocks for each scenario
- Copy button exists ✅ but is very small (24×24px) and hard to click on mobile
- No "Run" or "Open in playground" button
- No line numbers
- No file name / context label above code block

**Fix per code block:**

```
┌─ Selenium (Java) ─────────────────────── [Copy] [Expand] ─┐
│ 1  WebElement field = driver                                │
│ 2    .findElement(By.id("movieName"));                     │
│ 3  field.sendKeys("Inception");                            │
└────────────────────────────────────────────────────────────┘
```

**Critical fix:** Add language-specific tab switcher per scenario so all 3 code blocks collapse into one tabbed view:

```
[Selenium (Java)] [Playwright (JS)] [Playwright (Python)]
```

---

### 3.5 Navigation — No Active State, No Prev/Next

**Current:** No "you are here" active state on the nav bar for "Practice". No prev/next element navigation.

**Fix:**

- Highlight "Practice" in nav as active
- Add bottom navigation bar:

```
← Previous: [Checkbox]          Next: [Select Dropdown] →
```

---

### 3.6 "Also Read" Section — Poor Styling

**Current:** A blockquote-style element with `📄 Also Read: [link]` — only one link, styled as a quote.

**Fix:** Convert to a proper "Related Articles" card grid at the bottom:

```
┌──────────────────────┐  ┌──────────────────────┐
│ 📝 Top 10 Practice   │  │ 🤖 Selenium vs        │
│ Automation Sites     │  │ Playwright Guide      │
└──────────────────────┘  └──────────────────────┘
```

---

### 3.7 Mobile Responsiveness — Layout Issues

**Current:** Two-column layout (practice card + insight) on a viewport of 885px causes the Insight box to clip off-screen.

**Fix:**

- Below 1024px: stack practice card above insight box
- Insight box should be collapsible on mobile with an expand button
- Code blocks should have horizontal scroll, not break the layout
- Copy button should be minimum 44×44px (touch target standard)

---

### 3.8 Theme Toggle — Duplicate Element

**Current DOM:** There are TWO theme toggle buttons (`ref_6` and `ref_21`) in the navigation — one shows on desktop, one on mobile. Both are in the DOM simultaneously which causes duplicate accessibility landmarks.

**Fix:** Use CSS `display:none` / `hidden` properly via media queries, or use a single toggle repositioned via CSS, not two separate DOM elements.

---

## 4. Accessibility & HTML Issues

### 4.1 `<label for="fullName">` Points to Non-Existent ID (Bug!)

**Critical Bug:** The first label has `for="fullName"` but the input has `id="movieName"`. They do NOT match.

```html
<!-- Current (BROKEN) -->
<label for="fullName">Enter any movie name</label>
<input id="movieName" ... />

<!-- Fix -->
<label for="movieName">Enter any movie name</label>
<input id="movieName" ... />
```

This means:

- Clicking the label doesn't focus the input
- Screen readers don't associate the label with the input
- Automated accessibility tests will fail

---

### 4.2 All Input Elements Missing `name` Attribute

**Current:** Every `<input>` has `name=""` (empty). While not critical for practice elements, it's bad practice and breaks form semantics.

**Fix:** Add meaningful `name` attributes:

```html
<input id="movieName" name="movieName" ... />
<input id="appendText" name="appendText" ... />
```

---

### 4.3 No `data-testid` or `data-cy` Attributes on ANY Element

**Current:** `testId: null`, `dataCy: null` on all 6 inputs.

This is a major gap for a **practice automation site**. Engineers learning best practices should see `data-testid` attributes modelled.

**Fix:** Add `data-testid` to every practice element:

```html
<input id="movieName" data-testid="input-movie-name" ... />
<input id="appendText" data-testid="input-append-text" ... />
<input id="insideText" data-testid="input-verify-text" ... />
<input id="clearText" data-testid="input-clear-text" ... />
<input id="disabledInput" data-testid="input-disabled" ... />
<input id="readonlyInput" data-testid="input-readonly" ... />
```

---

### 4.4 Table Missing `<caption>` and `summary` Role

**Current:** The "Key Methods Summary" table has `<thead>` and `<th>` ✅ but has no `<caption>`.

**Fix:**

```html
<table>
  <caption>
    Key Methods for Input Field Automation — Selenium vs Playwright
  </caption>
  <thead>
    ...
  </thead>
</table>
```

---

### 4.5 No `aria-label` on Practice Card Region

**Current:** The practice card section has no ARIA landmark label. Screen readers announce it as an unnamed "region".

**Fix:**

```html
<section aria-label="Input field practice exercises" role="region"></section>
```

---

### 4.6 `<code>` Blocks Missing Language Class

**Current:** All 18 code blocks have `class=""` — no language identifier.

**Fix:** Add appropriate language classes for syntax highlighting and accessibility tools:

```html
<code class="language-java">...</code>
<code class="language-javascript">...</code>
<code class="language-python">...</code>
```

---

### 4.7 No Skip Navigation Link

**Fix:** Add at the very top of the `<body>`:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

---

## 5. Locator & XPath Strategy Issues

This section is critical — the page teaches automation but the actual HTML elements on the page are **poorly structured for learning locator strategies**.

### 5.1 Only `id`-Based Locators Are Modelled

**Current code examples only use `By.id()` and `#id` CSS selectors.** This is overly simple and doesn't prepare engineers for real-world scenarios.

**What's missing:**
| Locator Type | Status | Importance |
|---|---|---|
| `By.id()` | ✅ Present | Basic |
| `By.cssSelector()` | ❌ Missing | Essential |
| `By.xpath()` — absolute | ❌ Missing | Common |
| `By.xpath()` — relative | ❌ Missing | Best Practice |
| `By.name()` | ❌ Missing | Common |
| `By.placeholder()` (Playwright) | ❌ Missing | Modern |
| `getByLabel()` (Playwright) | ❌ Missing | Recommended |
| `getByRole()` (Playwright) | ❌ Missing | Accessibility-first |
| `data-testid` locator | ❌ Missing | Industry Standard |
| `By.xpath()` with `@placeholder` | ❌ Missing | Real-world |
| `By.xpath()` with `text()` | ❌ Missing | Common |
| `By.xpath()` with `contains()` | ❌ Missing | Flexible |

---

### 5.2 XPath Examples — Completely Absent

No XPath examples exist anywhere on the page. For a practice site targeting automation engineers, this is a critical gap.

**Fix:** Add a dedicated "Locator Strategies" section per scenario. Example for `movieName` input:

```
━━━ Locator Strategies for: Movie Name Input ━━━

By.id            →  By.id("movieName")
By.name          →  By.name("movieName")                    [after name attr added]
By.cssSelector   →  By.cssSelector("input#movieName")
By.cssSelector   →  By.cssSelector("input[placeholder='Enter hollywood movie name']")
By.xpath abs     →  /html/body/main/section/div/div[1]/input
By.xpath rel     →  //input[@id='movieName']
By.xpath attr    →  //input[@placeholder='Enter hollywood movie name']
By.xpath parent  →  //label[text()='Enter any movie name']/following-sibling::input
By.xpath contains→  //input[contains(@placeholder,'movie')]
data-testid      →  [data-testid='input-movie-name']  (after fix)

Playwright:
  page.locator("#movieName")
  page.locator("input[placeholder='Enter hollywood movie name']")
  page.getByLabel("Enter any movie name")
  page.getByPlaceholder("Enter hollywood movie name")
  page.locator("[data-testid='input-movie-name']")
```

---

### 5.3 No Selenium JavaScript (WebDriver.io / selenium-webdriver npm) Examples

The site covers Selenium Java and Playwright JS/Python but misses:

- Selenium WebDriver for JavaScript (npm `selenium-webdriver`)
- WebdriverIO
- Cypress (mentioned in footer but not on practice pages)

**Fix:** Add a collapsible "More Languages" section with Selenium JS:

```javascript
// Selenium JS (selenium-webdriver npm)
const { Builder, By } = require("selenium-webdriver");
const field = await driver.findElement(By.id("movieName"));
await field.sendKeys("Inception");
```

---

### 5.4 No AI / MCP Locator Examples

The platform targets AI engineers yet has zero AI-tooling context. MCP (Model Context Protocol) and AI-driven test generation are completely absent.

**Fix:** Add an "AI Automation" collapsible section per scenario:

```
━━━ AI & MCP Context ━━━

Natural Language Selector (AI tools):
  "the movie name input field"
  "input with placeholder 'Enter hollywood movie name'"
  "first text field on the page"

MCP Tool Call (Playwright MCP):
  { tool: "fill", selector: "#movieName", value: "Inception" }

Copilot/AI Test Suggestion:
  // Given the input with id="movieName"
  // When I fill it with "Inception"
  // Then the value should equal "Inception"
```

---

## 6. Code Section Issues & Fixes

### 6.1 No Grouped/Tabbed Code View

**Current:** Each scenario has 3 separate H3 headings + 3 separate code blocks. Scrolling through 6 scenarios × 3 languages = 18 code blocks creates significant scroll fatigue.

**Fix:** Tab switcher per scenario (global language preference saved to localStorage):

```
Scenario 1: Type text into an input field
┌─────────────────────────────────────────────────────────────┐
│ [Selenium Java] [Playwright JS] [Playwright Python] [Sel JS] │
│─────────────────────────────────────────────────────────────│
│ driver.findElement(By.id("movieName")).sendKeys("Inception");│
│                                              [Copy] [Run ▶] │
└─────────────────────────────────────────────────────────────┘
```

When user selects "Playwright JS" globally, ALL scenarios flip to JS. This is a huge DX improvement.

---

### 6.2 Code Examples Missing Import Statements

**Current Selenium Java example:**

```java
driver.findElement(By.id("movieName")).sendKeys("Inception");
```

A beginner won't know they need:

```java
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.Keys;
```

**Fix:** Add a collapsible "Full Example with Imports" block per language at the top of the code section.

---

### 6.3 No Full Test Method Wrapper

**Current:** Code snippets are bare lines, not wrapped in a test method.

**Fix:** Provide a toggle "Show as full test":

```java
@Test
public void testTypeMovieName() {
    driver.get("https://www.qaplayground.com/practice/input");
    driver.findElement(By.id("movieName")).sendKeys("Inception");
    String value = driver.findElement(By.id("movieName")).getAttribute("value");
    assertEquals("Inception", value);
}
```

---

### 6.4 Append Text Scenario — Playwright Code Is Wrong/Misleading

**Current Playwright JS code:**

```javascript
await page.locator("#appendText").fill("I am good and feeling great");
```

But `fill()` **clears first then types** — it doesn't append. For a true "append" scenario, the correct code should be:

```javascript
// To actually APPEND:
await page.locator("#appendText").click();
await page.keyboard.press("End"); // go to end
await page.keyboard.type(" and feeling great");
```

The current code misleads users about what "append" means in Playwright.

**Fix:** Correct the code and add an explanatory note:

> ⚠️ Note: Playwright's `fill()` clears the field before typing. To truly append, use `click()` + `keyboard.type()` or `pressSequentially()`.

---

### 6.5 Selenium JS (npm) — Completely Absent

The page has no Selenium JavaScript (node selenium-webdriver) examples. Given JavaScript is the most popular language for automation, this is a major gap.

---

## 7. Missing Content & Features

### 7.1 No Difficulty / Level Badge

Every practice page should show: `[🟢 Beginner]` | `[🟡 Intermediate]` | `[🔴 Advanced]`

### 7.2 No Estimated Time

Add: `⏱️ ~15 minutes` near the page title.

### 7.3 No Table of Contents (TOC)

With 6 scenarios + intro + methods table, a sticky TOC on the left or a jump-links bar at the top would massively improve navigation.

**Fix:** Add TOC:

```
Jump to: [Intro] [Methods] [1.Type] [2.Append] [3.Verify] [4.Clear] [5.Disabled] [6.Readonly]
```

### 7.4 No Progress Tracker

No way for users to mark a scenario as "done". The site has a Study Tracker but it's not integrated with the practice pages.

**Fix:** Add a checkbox per scenario:

```
[☐] Scenario 1: Type text     → [☑] Mark as done
```

Connect to the Study Tracker.

### 7.5 No "Test Cases" Section

What test cases should an automation engineer write for input fields? This is missing entirely.

**Fix:** Add a "Test Cases to Automate" section:
