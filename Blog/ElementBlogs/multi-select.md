---
title: How to Handle Multi-Select Elements in Selenium and Playwright
description: Learn how to automate multi-select dropdowns, checkbox groups, and tag-based selection in Selenium WebDriver (Java), Playwright (JS), and Playwright (Python).
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "multi-select selenium, select multiple options, checkbox group automation, playwright multi-select, deselect all selenium"
---

## Introduction

Multi-select elements come in several flavours in modern web apps:

1. **Native `<select multiple>`** — the classic HTML multi-select box
2. **Checkbox groups** — a list of checkboxes acting as a multi-select
3. **Tag / chip selectors** — click-to-toggle pill buttons

Each type requires a different automation strategy.

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Select multiple | `selectByVisibleText()` × N | `selectOption([...])` | `select_option([...])` |
| Deselect one | `deselectByVisibleText()` | re-select filtered array | re-select filtered list |
| Deselect all | `deselectAll()` | `selectOption([])` | `select_option([])` |
| Count selected | `getAllSelectedOptions().size()` | `locator:checked.count()` | `locator.count()` |
| Is multiple | `isMultiple()` | check `multiple` attribute | check `multiple` attribute |

---

## 1. Basic native multi-select — select multiple fruits

### Selenium (Java)
```java
Select select = new Select(driver.findElement(By.id("fruitMultiSelect")));
assertTrue(select.isMultiple());

select.selectByVisibleText("Apple");
select.selectByVisibleText("Mango");
select.selectByIndex(2); // Grapes

List<WebElement> selected = select.getAllSelectedOptions();
assertEquals(3, selected.size());
```

### Playwright (JS)
```js
await page.locator("#fruitMultiSelect").selectOption([
  { label: "Apple" },
  { label: "Mango" },
  { index: 2 },
]);
const count = await page.locator("#fruitMultiSelect option:checked").count();
expect(count).toBe(3);
```

### Playwright (Python)
```python
page.locator("#fruitMultiSelect").select_option([
    {"label": "Apple"},
    {"label": "Mango"},
    {"index": 2},
])
count = page.locator("#fruitMultiSelect option:checked").count()
assert count == 3
```

---

## 2. Pre-selected values — deselect a specific one

### Selenium (Java)
```java
Select skills = new Select(driver.findElement(By.id("skillsMultiSelect")));
skills.deselectByValue("playwright");

List<WebElement> remaining = skills.getAllSelectedOptions();
// Should still contain selenium and cypress
assertEquals(2, remaining.size());
```

### Playwright (JS)
```js
const el = page.locator("#skillsMultiSelect");
const current = await el.evaluate((s) =>
  Array.from(s.selectedOptions).map((o) => o.value)
);
const updated = current.filter((v) => v !== "playwright");
await el.selectOption(updated.map((v) => ({ value: v })));
```

### Playwright (Python)
```python
el = page.locator("#skillsMultiSelect")
current = el.evaluate("s => Array.from(s.selectedOptions).map(o => o.value)")
updated = [v for v in current if v != "playwright"]
el.select_option([{"value": v} for v in updated])
```

---

## 3. Select all / Deselect all buttons

### Selenium (Java)
```java
driver.findElement(By.id("selectAllBtn")).click();

Select country = new Select(driver.findElement(By.id("countryMultiSelect")));
int total = country.getOptions().size();
assertEquals(total, country.getAllSelectedOptions().size());

driver.findElement(By.id("deselectAllBtn")).click();
assertEquals(0, country.getAllSelectedOptions().size());
```

### Playwright (JS)
```js
await page.getByTestId("select-all-btn").click();
const total = await page.locator("#countryMultiSelect option").count();
const selected = await page.locator("#countryMultiSelect option:checked").count();
expect(selected).toBe(total);

await page.getByTestId("deselect-all-btn").click();
expect(await page.locator("#countryMultiSelect option:checked").count()).toBe(0);
```

### Playwright (Python)
```python
page.get_by_test_id("select-all-btn").click()
total = page.locator("#countryMultiSelect option").count()
selected = page.locator("#countryMultiSelect option:checked").count()
assert selected == total

page.get_by_test_id("deselect-all-btn").click()
assert page.locator("#countryMultiSelect option:checked").count() == 0
```

---

## 4. Checkbox-based multi-select

### Selenium (Java)
```java
driver.findElement(By.id("tech-react")).click();
driver.findElement(By.id("tech-nextjs")).click();

assertTrue(driver.findElement(By.id("tech-react")).isSelected());

List<WebElement> checked = driver.findElements(
    By.cssSelector("#techCheckboxGroup input[type='checkbox']:checked")
);
assertEquals(2, checked.size());
```

### Playwright (JS)
```js
await page.getByTestId("tech-checkbox-react").check();
await page.getByTestId("tech-checkbox-nextjs").check();

await expect(page.getByTestId("tech-checkbox-react")).toBeChecked();
const count = await page.locator("[data-testid^='tech-checkbox-']:checked").count();
expect(count).toBe(2);
```

### Playwright (Python)
```python
page.get_by_test_id("tech-checkbox-react").check()
page.get_by_test_id("tech-checkbox-nextjs").check()

expect(page.get_by_test_id("tech-checkbox-react")).to_be_checked()
count = page.locator("[data-testid^='tech-checkbox-']:checked").count()
assert count == 2
```

---

## 5. Tag/chip-based multi-select

### Selenium (Java)
```java
driver.findElement(By.id("tag-option-automation")).click();
driver.findElement(By.id("tag-option-selenium")).click();

assertTrue(driver.findElement(By.id("tag-badge-automation")).isDisplayed());

driver.findElement(By.cssSelector("[data-testid='remove-tag-automation']")).click();

String count = driver.findElement(By.id("tagCount")).getText();
assertEquals("1", count);
```

### Playwright (JS)
```js
await page.getByTestId("tag-option-automation").click();
await page.getByTestId("tag-option-selenium").click();

await expect(page.getByTestId("tag-badge-automation")).toBeVisible();

await page.getByTestId("remove-tag-automation").click();
await expect(page.getByTestId("tag-count")).toHaveText("1");
```

### Playwright (Python)
```python
page.get_by_test_id("tag-option-automation").click()
page.get_by_test_id("tag-option-selenium").click()

expect(page.get_by_test_id("tag-badge-automation")).to_be_visible()

page.get_by_test_id("remove-tag-automation").click()
expect(page.get_by_test_id("tag-count")).to_have_text("1")
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
