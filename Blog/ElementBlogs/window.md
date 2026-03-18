---
title: How to Handle Multiple Windows and Tabs in Selenium and Playwright
description: Learn how to switch between multiple browser windows and tabs using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Covers window handles, new tab handling, and closing windows.
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "multiple windows selenium, switchTo window, window handles selenium, new tab selenium, playwright new page, handle browser tabs"
---

## Introduction

Modern web apps frequently open content in new tabs or popup windows. Automation must:

1. **Detect new windows/tabs** opened after a click
2. **Switch focus** to the new window
3. **Interact** with elements in the new window
4. **Switch back** to the original window
5. **Close** windows when done

Selenium tracks windows via **window handles** (unique string IDs). Playwright exposes new tabs as `Page` objects — much simpler to work with.

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Get current handle | `getWindowHandle()` | `page` (already have it) | `page` (already have it) |
| Get all handles | `getWindowHandles()` | `context.pages()` | `context.pages` |
| Switch to window | `switchTo().window(handle)` | use the new `Page` object | use the new `Page` object |
| Close current window | `close()` | `page.close()` | `page.close()` |
| Back to original | `switchTo().window(original)` | use original `page` reference | use original `page` reference |

---

## 1. Open a new tab and switch to it

### Selenium (Java)
```java
String originalWindow = driver.getWindowHandle();
driver.findElement(By.id("newTabBtn")).click();

// Wait for the new window to open
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
wait.until(ExpectedConditions.numberOfWindowsToBe(2));

// Switch to the new window
for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(originalWindow)) {
        driver.switchTo().window(handle);
        break;
    }
}

System.out.println("New tab URL: " + driver.getCurrentUrl());
```

### Playwright (JS)
```js
const [newPage] = await Promise.all([
  page.context().waitForEvent("page"),
  page.locator("#newTabBtn").click(),
]);

await newPage.waitForLoadState();
console.log("New tab URL:", newPage.url());
```

### Playwright (Python)
```python
with page.context.expect_page() as new_page_info:
    page.locator("#newTabBtn").click()

new_page = new_page_info.value
new_page.wait_for_load_state()
print("New tab URL:", new_page.url)
```

---

## 2. Interact with elements in the new window

### Selenium (Java)
```java
// (After switching to new window)
driver.findElement(By.id("newWindowInput")).sendKeys("Hello");
driver.findElement(By.id("newWindowSubmit")).click();
```

### Playwright (JS)
```js
// Use newPage directly
await newPage.locator("#newWindowInput").fill("Hello");
await newPage.locator("#newWindowSubmit").click();
```

### Playwright (Python)
```python
new_page.locator("#newWindowInput").fill("Hello")
new_page.locator("#newWindowSubmit").click()
```

---

## 3. Switch back to the original window

### Selenium (Java)
```java
driver.close(); // close new window
driver.switchTo().window(originalWindow); // return to original

// Verify we're back on the original page
assertEquals("https://www.qaplayground.com/practice/window", driver.getCurrentUrl());
```

### Playwright (JS)
```js
await newPage.close();
// The original "page" variable still points to the first page — just use it
await expect(page).toHaveURL(/window/);
```

### Playwright (Python)
```python
new_page.close()
# Original page reference is still valid
expect(page).to_have_url(re.compile("window"))
```

---

## 4. Handle a popup window (not a tab)

### Selenium (Java)
```java
String mainWindow = driver.getWindowHandle();
driver.findElement(By.id("popupBtn")).click();

// Switch to popup
Set<String> handles = driver.getWindowHandles();
for (String handle : handles) {
    if (!handle.equals(mainWindow)) {
        driver.switchTo().window(handle);
    }
}

// Interact in popup
String popupTitle = driver.getTitle();
driver.close();
driver.switchTo().window(mainWindow);
```

### Playwright (JS)
```js
const [popup] = await Promise.all([
  page.waitForEvent("popup"),
  page.locator("#popupBtn").click(),
]);
await popup.waitForLoadState();
console.log("Popup title:", await popup.title());
await popup.close();
```

### Playwright (Python)
```python
with page.expect_popup() as popup_info:
    page.locator("#popupBtn").click()

popup = popup_info.value
popup.wait_for_load_state()
print("Popup title:", popup.title())
popup.close()
```

---

## 5. Count total open windows/tabs

### Selenium (Java)
```java
int windowCount = driver.getWindowHandles().size();
System.out.println("Open windows: " + windowCount);
assertEquals(2, windowCount);
```

### Playwright (JS)
```js
const pages = page.context().pages();
console.log("Open tabs:", pages.length);
expect(pages.length).toBe(2);
```

### Playwright (Python)
```python
pages = page.context.pages
print("Open tabs:", len(pages))
assert len(pages) == 2
```

---

## 6. Open a new tab programmatically

### Selenium (Java)
```java
// Open a blank new tab using JavaScript
((JavascriptExecutor) driver).executeScript("window.open('https://www.qaplayground.com', '_blank');");

// Switch to new tab
List<String> handles = new ArrayList<>(driver.getWindowHandles());
driver.switchTo().window(handles.get(1));
```

### Playwright (JS)
```js
const newPage = await page.context().newPage();
await newPage.goto("https://www.qaplayground.com");
```

### Playwright (Python)
```python
new_page = page.context.new_page()
new_page.goto("https://www.qaplayground.com")
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
