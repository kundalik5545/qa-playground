---
title: How to Check Element Visibility and State in Selenium and Playwright
description: Learn how to verify element visibility, enabled state, DOM presence, text, and attributes using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python).
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "element visibility selenium, isDisplayed, isEnabled, check element DOM, playwright element state, get attribute selenium"
---

## Introduction

Before interacting with an element — or to assert expected behavior — you need to verify its state. Key checks include:

1. **Is the element visible?** — rendered and not hidden
2. **Is the element enabled?** — can it be interacted with
3. **Is it present in the DOM?** — exists but may be hidden
4. **What is its text or attribute value?** — content assertions

## Key Methods Summary

| Check | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Visible | `isDisplayed()` | `toBeVisible()` | `to_be_visible()` |
| Hidden | `!isDisplayed()` | `toBeHidden()` | `to_be_hidden()` |
| Enabled | `isEnabled()` | `toBeEnabled()` | `to_be_enabled()` |
| Disabled | `!isEnabled()` | `toBeDisabled()` | `to_be_disabled()` |
| In DOM | `findElements().size() > 0` | `count() > 0` | `count() > 0` |
| Get text | `getText()` | `textContent()` | `text_content()` |
| Get attribute | `getAttribute("name")` | `getAttribute("name")` | `get_attribute("name")` |

---

## 1. Check if element is visible

### Selenium (Java)
```java
assertTrue(driver.findElement(By.id("visibleElement")).isDisplayed());
assertFalse(driver.findElement(By.id("hiddenElement")).isDisplayed());
```

### Playwright (JS)
```js
await expect(page.locator("#visibleElement")).toBeVisible();
await expect(page.locator("#hiddenElement")).toBeHidden();
```

### Playwright (Python)
```python
expect(page.locator("#visibleElement")).to_be_visible()
expect(page.locator("#hiddenElement")).to_be_hidden()
```

---

## 2. Check if element is enabled or disabled

### Selenium (Java)
```java
assertTrue(driver.findElement(By.id("enabledBtn")).isEnabled());
assertFalse(driver.findElement(By.id("disabledBtn")).isEnabled());
```

### Playwright (JS)
```js
await expect(page.locator("#enabledBtn")).toBeEnabled();
await expect(page.locator("#disabledBtn")).toBeDisabled();
```

### Playwright (Python)
```python
expect(page.locator("#enabledBtn")).to_be_enabled()
expect(page.locator("#disabledBtn")).to_be_disabled()
```

---

## 3. Check if element exists in the DOM

An element can exist in the DOM but not be visible (e.g. `display:none`). Use `findElements()` to safely check without throwing an exception.

### Selenium (Java)
```java
List<WebElement> elements = driver.findElements(By.id("maybeElement"));
if (elements.size() > 0) {
    System.out.println("Present in DOM");
}
```

### Playwright (JS)
```js
const count = await page.locator("#maybeElement").count();
if (count > 0) {
  console.log("Present in DOM");
}
await expect(page.locator("#maybeElement")).toHaveCount(1);
```

### Playwright (Python)
```python
count = page.locator("#maybeElement").count()
if count > 0:
    print("Present in DOM")
expect(page.locator("#maybeElement")).to_have_count(1)
```

---

## 4. Read element text and assert it

### Selenium (Java)
```java
String text = driver.findElement(By.id("textElement")).getText();
assertEquals("Expected Text", text);
```

### Playwright (JS)
```js
await expect(page.locator("#textElement")).toHaveText("Expected Text");
const text = await page.locator("#textElement").textContent();
```

### Playwright (Python)
```python
expect(page.locator("#textElement")).to_have_text("Expected Text")
text = page.locator("#textElement").text_content()
```

---

## 5. Read and assert element attribute

### Selenium (Java)
```java
String placeholder = driver.findElement(By.id("nameInput")).getAttribute("placeholder");
assertEquals("Enter name", placeholder);

String classes = driver.findElement(By.id("nameInput")).getAttribute("class");
assertTrue(classes.contains("active"));
```

### Playwright (JS)
```js
await expect(page.locator("#nameInput")).toHaveAttribute("placeholder", "Enter name");
const cls = await page.locator("#nameInput").getAttribute("class");
expect(cls).toContain("active");
```

### Playwright (Python)
```python
expect(page.locator("#nameInput")).to_have_attribute("placeholder", "Enter name")
cls = page.locator("#nameInput").get_attribute("class")
assert "active" in cls
```

---

## 6. Check CSS property value

### Selenium (Java)
```java
String color = driver.findElement(By.id("styledEl")).getCssValue("color");
System.out.println(color); // rgba(0, 128, 0, 1)
```

### Playwright (JS)
```js
const color = await page.locator("#styledEl").evaluate(
  (el) => getComputedStyle(el).color
);
```

### Playwright (Python)
```python
color = page.locator("#styledEl").evaluate("el => getComputedStyle(el).color")
print(color)
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
