---
title: How to Handle Radio Buttons and Checkboxes in Selenium and Playwright
description: Learn how to automate radio buttons and checkboxes using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Covers click, isSelected, isEnabled, and group selection.
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "radio button selenium, checkbox automation, isSelected selenium, click radio button, playwright checkbox, handle radio group"
---

## Introduction

Radio buttons and checkboxes are common form controls:

- **Radio buttons** — only one option in a group can be selected at a time
- **Checkboxes** — multiple options can be checked simultaneously

Key automation tasks:
1. Click to select a radio button or checkbox
2. Verify it is selected
3. Verify a disabled radio/checkbox cannot be selected
4. Uncheck a checked checkbox

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Select radio / check | `element.click()` | `locator.check()` | `locator.check()` |
| Uncheck checkbox | `element.click()` (if checked) | `locator.uncheck()` | `locator.uncheck()` |
| Is selected | `isSelected()` | `toBeChecked()` | `to_be_checked()` |
| Is not selected | `!isSelected()` | `not.toBeChecked()` | `not_to_be_checked()` |
| Is disabled | `!isEnabled()` | `toBeDisabled()` | `to_be_disabled()` |

---

## 1. Select a radio button

### Selenium (Java)
```java
driver.findElement(By.id("gender-male")).click();
assertTrue(driver.findElement(By.id("gender-male")).isSelected());
```

### Playwright (JS)
```js
await page.locator("#gender-male").check();
await expect(page.locator("#gender-male")).toBeChecked();
```

### Playwright (Python)
```python
page.locator("#gender-male").check()
expect(page.locator("#gender-male")).to_be_checked()
```

---

## 2. Confirm only one radio can be selected in a group

### Selenium (Java)
```java
driver.findElement(By.id("gender-male")).click();
driver.findElement(By.id("gender-female")).click();

// Male should now be deselected
assertFalse(driver.findElement(By.id("gender-male")).isSelected());
assertTrue(driver.findElement(By.id("gender-female")).isSelected());
```

### Playwright (JS)
```js
await page.locator("#gender-male").check();
await page.locator("#gender-female").check();

await expect(page.locator("#gender-male")).not.toBeChecked();
await expect(page.locator("#gender-female")).toBeChecked();
```

### Playwright (Python)
```python
page.locator("#gender-male").check()
page.locator("#gender-female").check()

expect(page.locator("#gender-male")).not_to_be_checked()
expect(page.locator("#gender-female")).to_be_checked()
```

---

## 3. Check a checkbox

### Selenium (Java)
```java
WebElement checkbox = driver.findElement(By.id("rememberMe"));
if (!checkbox.isSelected()) {
    checkbox.click();
}
assertTrue(checkbox.isSelected());
```

### Playwright (JS)
```js
await page.locator("#rememberMe").check();
await expect(page.locator("#rememberMe")).toBeChecked();
```

### Playwright (Python)
```python
page.locator("#rememberMe").check()
expect(page.locator("#rememberMe")).to_be_checked()
```

---

## 4. Uncheck a checkbox

### Selenium (Java)
```java
WebElement checkbox = driver.findElement(By.id("acceptTerms"));
if (checkbox.isSelected()) {
    checkbox.click();
}
assertFalse(checkbox.isSelected());
```

### Playwright (JS)
```js
await page.locator("#acceptTerms").uncheck();
await expect(page.locator("#acceptTerms")).not.toBeChecked();
```

### Playwright (Python)
```python
page.locator("#acceptTerms").uncheck()
expect(page.locator("#acceptTerms")).not_to_be_checked()
```

---

## 5. Verify a radio button is disabled

### Selenium (Java)
```java
WebElement disabledRadio = driver.findElement(By.id("gender-other"));
assertFalse(disabledRadio.isEnabled());
```

### Playwright (JS)
```js
await expect(page.locator("#gender-other")).toBeDisabled();
```

### Playwright (Python)
```python
expect(page.locator("#gender-other")).to_be_disabled()
```

---

## 6. Count all radio buttons in a group

### Selenium (Java)
```java
List<WebElement> radios = driver.findElements(By.cssSelector("input[name='gender']"));
System.out.println("Total options: " + radios.size());
```

### Playwright (JS)
```js
const count = await page.locator("input[name='gender']").count();
console.log("Total options:", count);
```

### Playwright (Python)
```python
count = page.locator("input[name='gender']").count()
print("Total options:", count)
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
