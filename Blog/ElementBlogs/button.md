---
title: How to Handle Button Clicks in Selenium and Playwright
description: Learn how to automate single click, double click, right click, and disabled button checks using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python).
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "button click selenium, double click selenium, right click selenium, Actions class, disabled button automation, playwright click python js"
---

## Introduction

Buttons are the most commonly interacted element in web automation. Engineers must handle:

1. **Single click** — basic `click()` action
2. **Double click** — fires a different browser event
3. **Right click** — opens the context menu
4. **Disabled button** — assert it cannot be interacted with

Selenium uses the **Actions** class for advanced mouse interactions. Playwright has click options built in.

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Single click | `element.click()` | `locator.click()` | `locator.click()` |
| Double click | `actions.doubleClick(el).perform()` | `locator.dblclick()` | `locator.dblclick()` |
| Right click | `actions.contextClick(el).perform()` | `locator.click({ button: "right" })` | `locator.click(button="right")` |
| Is disabled | `!isEnabled()` | `toBeDisabled()` | `to_be_disabled()` |
| Get text | `getText()` | `textContent()` | `text_content()` |

---

## 1. Single Click

### Selenium (Java)
```java
driver.findElement(By.id("clickBtn")).click();
assertTrue(driver.findElement(By.id("clickResult")).isDisplayed());
```

### Playwright (JS)
```js
await page.locator("#clickBtn").click();
await expect(page.locator("#clickResult")).toBeVisible();
```

### Playwright (Python)
```python
page.locator("#clickBtn").click()
expect(page.locator("#clickResult")).to_be_visible()
```

---

## 2. Double Click

### Selenium (Java)
```java
WebElement btn = driver.findElement(By.id("doubleClickBtn"));
new Actions(driver).doubleClick(btn).perform();

assertEquals("Double clicked!", driver.findElement(By.id("doubleClickResult")).getText());
```

### Playwright (JS)
```js
await page.locator("#doubleClickBtn").dblclick();
await expect(page.locator("#doubleClickResult")).toHaveText("Double clicked!");
```

### Playwright (Python)
```python
page.locator("#doubleClickBtn").dblclick()
expect(page.locator("#doubleClickResult")).to_have_text("Double clicked!")
```

---

## 3. Right Click (Context Menu)

### Selenium (Java)
```java
WebElement btn = driver.findElement(By.id("rightClickBtn"));
new Actions(driver).contextClick(btn).perform();

assertTrue(driver.findElement(By.id("contextMenu")).isDisplayed());
```

### Playwright (JS)
```js
await page.locator("#rightClickBtn").click({ button: "right" });
await expect(page.locator("#contextMenu")).toBeVisible();
```

### Playwright (Python)
```python
page.locator("#rightClickBtn").click(button="right")
expect(page.locator("#contextMenu")).to_be_visible()
```

---

## 4. Disabled Button — verify it cannot be clicked

### Selenium (Java)
```java
WebElement btn = driver.findElement(By.id("disabledBtn"));
assertFalse(btn.isEnabled());
assertNotNull(btn.getAttribute("disabled"));
```

### Playwright (JS)
```js
await expect(page.locator("#disabledBtn")).toBeDisabled();
```

### Playwright (Python)
```python
expect(page.locator("#disabledBtn")).to_be_disabled()
```

---

## 5. Verify button text changes after click

### Selenium (Java)
```java
WebElement btn = driver.findElement(By.id("toggleBtn"));
String before = btn.getText();
btn.click();
assertNotEquals(before, btn.getText());
```

### Playwright (JS)
```js
const btn = page.locator("#toggleBtn");
const before = await btn.textContent();
await btn.click();
expect(await btn.textContent()).not.toBe(before);
```

### Playwright (Python)
```python
btn = page.locator("#toggleBtn")
before = btn.text_content()
btn.click()
assert btn.text_content() != before
```

---

## 6. Click using keyboard Enter

### Selenium (Java)
```java
driver.findElement(By.id("submitBtn")).sendKeys(Keys.ENTER);
```

### Playwright (JS)
```js
await page.locator("#submitBtn").press("Enter");
```

### Playwright (Python)
```python
page.locator("#submitBtn").press("Enter")
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
