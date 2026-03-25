---
title: How to Handle Input Fields in Selenium and Playwright
description: Learn how to automate text input fields using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Covers sendKeys, clear, getAttribute, disabled, and readonly inputs.
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "input field selenium, sendKeys selenium, clear input, disabled input, readonly input, playwright fill, input automation"
---

## Introduction

Input fields are the foundation of form automation. Common scenarios include:

1. **Type into a field** — `sendKeys` / `fill`
2. **Clear a field** — remove existing text before typing
3. **Read the current value** — `getAttribute("value")`
4. **Check disabled inputs** — field exists but cannot be edited
5. **Check readonly inputs** — field displays text but rejects keyboard input

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Type text | `sendKeys("text")` | `fill("text")` | `fill("text")` |
| Clear field | `clear()` | `fill("")` | `fill("")` |
| Read value | `getAttribute("value")` | `inputValue()` | `input_value()` |
| Is disabled | `!isEnabled()` | `toBeDisabled()` | `to_be_disabled()` |
| Is readonly | `getAttribute("readonly")` | `toHaveAttribute("readonly", "")` | `to_have_attribute(...)` |
| Press Tab | `sendKeys(Keys.TAB)` | `press("Tab")` | `press("Tab")` |

---

## 1. Type text into an input field

### Selenium (Java)
```java
driver.findElement(By.id("movieName")).sendKeys("Inception");
```

### Playwright (JS)
```js
await page.fill("#movieName", "Inception");
```

### Playwright (Python)
```python
page.fill("#movieName", "Inception")
```

---

## 2. Append text and press Tab

### Selenium (Java)
```java
WebElement field = driver.findElement(By.id("appendText"));
field.sendKeys(" and feeling great");
field.sendKeys(Keys.TAB);
```

### Playwright (JS)
```js
await page.locator("#appendText").fill("I am good and feeling great");
await page.locator("#appendText").press("Tab");
```

### Playwright (Python)
```python
page.locator("#appendText").fill("I am good and feeling great")
page.locator("#appendText").press("Tab")
```

---

## 3. Verify text present inside an input field

### Selenium (Java)
```java
String value = driver.findElement(By.id("insideText")).getAttribute("value");
assertEquals("QA PlayGround", value);
```

### Playwright (JS)
```js
await expect(page.locator("#insideText")).toHaveValue("QA PlayGround");
```

### Playwright (Python)
```python
expect(page.locator("#insideText")).to_have_value("QA PlayGround")
```

---

## 4. Clear an input field

### Selenium (Java)
```java
WebElement field = driver.findElement(By.id("clearText"));
field.clear();
assertEquals("", field.getAttribute("value"));
```

### Playwright (JS)
```js
await page.locator("#clearText").fill("");
await expect(page.locator("#clearText")).toHaveValue("");
```

### Playwright (Python)
```python
page.locator("#clearText").fill("")
expect(page.locator("#clearText")).to_have_value("")
```

---

## 5. Check an input is disabled

### Selenium (Java)
```java
WebElement disabledInput = driver.findElement(By.id("disabledInput"));
assertFalse(disabledInput.isEnabled());
```

### Playwright (JS)
```js
await expect(page.locator("#disabledInput")).toBeDisabled();
```

### Playwright (Python)
```python
expect(page.locator("#disabledInput")).to_be_disabled()
```

---

## 6. Check an input is readonly

### Selenium (Java)
```java
WebElement readonlyInput = driver.findElement(By.id("readonlyInput"));
assertNotNull(readonlyInput.getAttribute("readonly"));
// Attempt to type — it won't change
readonlyInput.sendKeys("test");
assertEquals("This text is readonly", readonlyInput.getAttribute("value"));
```

### Playwright (JS)
```js
await expect(page.locator("#readonlyInput")).toHaveAttribute("readonly", "");
await page.locator("#readonlyInput").fill("test"); // no effect
await expect(page.locator("#readonlyInput")).toHaveValue("This text is readonly");
```

### Playwright (Python)
```python
expect(page.locator("#readonlyInput")).to_have_attribute("readonly", "")
page.locator("#readonlyInput").fill("test")  # no effect
expect(page.locator("#readonlyInput")).to_have_value("This text is readonly")
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
