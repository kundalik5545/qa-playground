---
title: How to Automate Date Picker and Calendar in Selenium and Playwright
description: Learn how to automate native date inputs and custom calendar widgets using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Covers sendKeys, JS injection, and calendar navigation.
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "date picker selenium, calendar automation, sendKeys date, datepicker playwright python js, automate calendar widget"
---

## Introduction

Date pickers come in two forms:

1. **Native `<input type="date">`** — the browser renders its own date picker UI
2. **Custom calendar widgets** — JavaScript UI components (react-day-picker, flatpickr, etc.)

Native inputs can be automated with `sendKeys` / `fill`. Custom widgets require navigating the calendar UI by clicking navigation arrows and day cells.

## Key Methods Summary

| Scenario | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Set date | `sendKeys("YYYY-MM-DD")` | `fill("YYYY-MM-DD")` | `fill("YYYY-MM-DD")` |
| Clear date | `clear()` | `fill("")` | `fill("")` |
| Read value | `getAttribute("value")` | `toHaveValue("...")` | `to_have_value("...")` |
| JS inject | `executeScript(...)` | `evaluate(...)` | `evaluate(...)` |
| Navigate calendar | click arrow element | click arrow element | click arrow element |

---

## 1. Set a date on native input

### Selenium (Java)
```java
WebElement dateInput = driver.findElement(By.id("dateInput"));
dateInput.sendKeys("2025-06-15");
assertEquals("2025-06-15", dateInput.getAttribute("value"));
```

### Playwright (JS)
```js
await page.fill("#dateInput", "2025-06-15");
await expect(page.locator("#dateInput")).toHaveValue("2025-06-15");
```

### Playwright (Python)
```python
page.fill("#dateInput", "2025-06-15")
expect(page.locator("#dateInput")).to_have_value("2025-06-15")
```

---

## 2. Clear a date and set a new one

### Selenium (Java)
```java
WebElement dateInput = driver.findElement(By.id("dateInput"));
dateInput.clear();
dateInput.sendKeys("2026-01-01");
```

### Playwright (JS)
```js
await page.locator("#dateInput").fill("");
await page.locator("#dateInput").fill("2026-01-01");
```

### Playwright (Python)
```python
page.locator("#dateInput").fill("")
page.locator("#dateInput").fill("2026-01-01")
```

---

## 3. Set date via JavaScript (for read-only inputs)

Some date pickers mark the input as `readOnly`. Use JavaScript to set the value and fire the change event.

### Selenium (Java)
```java
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript(
    "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('change'));",
    driver.findElement(By.id("dateInput")),
    "2025-12-31"
);
```

### Playwright (JS)
```js
await page.evaluate(() => {
  const el = document.getElementById("dateInput");
  el.value = "2025-12-31";
  el.dispatchEvent(new Event("change", { bubbles: true }));
});
```

### Playwright (Python)
```python
page.evaluate("""() => {
    const el = document.getElementById('dateInput');
    el.value = '2025-12-31';
    el.dispatchEvent(new Event('change', { bubbles: true }));
}""")
```

---

## 4. Navigate a custom calendar widget

### Selenium (Java)
```java
// Open the calendar
driver.findElement(By.id("calendarTrigger")).click();

// Click next month
driver.findElement(By.cssSelector("[data-testid='calendar-next']")).click();

// Pick day 15
driver.findElement(By.cssSelector("[data-testid='day-15']")).click();

// Verify something was selected
assertFalse(driver.findElement(By.id("selectedDateDisplay")).getText().isEmpty());
```

### Playwright (JS)
```js
await page.getByTestId("calendarTrigger").click();
await page.getByTestId("calendar-next").click();
await page.getByTestId("day-15").click();
await expect(page.locator("#selectedDateDisplay")).not.toBeEmpty();
```

### Playwright (Python)
```python
page.get_by_test_id("calendarTrigger").click()
page.get_by_test_id("calendar-next").click()
page.get_by_test_id("day-15").click()
expect(page.locator("#selectedDateDisplay")).not_to_be_empty()
```

---

## 5. Verify a date is disabled in the calendar

### Selenium (Java)
```java
driver.findElement(By.id("calendarTrigger")).click();
WebElement pastDay = driver.findElement(By.cssSelector("[data-day='2020-01-01']"));
assertEquals("true", pastDay.getAttribute("aria-disabled"));
```

### Playwright (JS)
```js
await page.getByTestId("calendarTrigger").click();
await expect(page.locator("[data-day='2020-01-01']")).toHaveAttribute("aria-disabled", "true");
```

### Playwright (Python)
```python
page.get_by_test_id("calendarTrigger").click()
expect(page.locator("[data-day='2020-01-01']")).to_have_attribute("aria-disabled", "true")
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
