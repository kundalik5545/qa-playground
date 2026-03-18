---
title: How to Handle Links in Selenium and Playwright
description: Learn how to automate link clicks, verify URLs, handle new tabs, and find links by text using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python).
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "click link selenium, findElement link text, open new tab selenium, playwright link, verify URL automation, anchor tag"
---

## Introduction

Links (`<a>` tags) are fundamental navigation elements. Automation scenarios include:

1. **Click a link** — navigate to another page
2. **Find link by text** — locate by visible text
3. **Verify the href** — assert the destination URL
4. **Handle new tab** — link opens in a new window/tab
5. **Verify broken links** — check HTTP status codes

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Click link | `findElement(By.linkText(...)).click()` | `getByRole("link", { name: ... }).click()` | `get_by_role("link", name=...).click()` |
| By partial text | `By.partialLinkText(...)` | `getByText(...)` | `get_by_text(...)` |
| Get href | `getAttribute("href")` | `getAttribute("href")` | `get_attribute("href")` |
| New tab | switch to window handle | `context.waitForEvent("page")` | `context.wait_for_event("page")` |
| Current URL | `getCurrentUrl()` | `page.url()` | `page.url` |

---

## 1. Click a link by visible text

### Selenium (Java)
```java
driver.findElement(By.linkText("Click Me")).click();
```

### Playwright (JS)
```js
await page.getByRole("link", { name: "Click Me" }).click();
```

### Playwright (Python)
```python
page.get_by_role("link", name="Click Me").click()
```

---

## 2. Click a link by partial text

### Selenium (Java)
```java
driver.findElement(By.partialLinkText("Click")).click();
```

### Playwright (JS)
```js
await page.getByText("Click").click();
```

### Playwright (Python)
```python
page.get_by_text("Click").click()
```

---

## 3. Verify href attribute

### Selenium (Java)
```java
String href = driver.findElement(By.id("externalLink")).getAttribute("href");
assertTrue(href.contains("qaplayground.com"));
```

### Playwright (JS)
```js
const href = await page.locator("#externalLink").getAttribute("href");
expect(href).toContain("qaplayground.com");
```

### Playwright (Python)
```python
href = page.locator("#externalLink").get_attribute("href")
assert "qaplayground.com" in href
```

---

## 4. Handle link that opens a new tab

### Selenium (Java)
```java
String originalWindow = driver.getWindowHandle();

driver.findElement(By.id("newTabLink")).click();

// Wait for new window and switch to it
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
wait.until(ExpectedConditions.numberOfWindowsToBe(2));

for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(originalWindow)) {
        driver.switchTo().window(handle);
        break;
    }
}

System.out.println("New tab URL: " + driver.getCurrentUrl());
driver.close();
driver.switchTo().window(originalWindow);
```

### Playwright (JS)
```js
const [newPage] = await Promise.all([
  page.context().waitForEvent("page"),
  page.locator("#newTabLink").click(),
]);
await newPage.waitForLoadState();
console.log("New tab URL:", newPage.url());
await newPage.close();
```

### Playwright (Python)
```python
with page.context.expect_page() as new_page_info:
    page.locator("#newTabLink").click()
new_page = new_page_info.value
new_page.wait_for_load_state()
print("New tab URL:", new_page.url)
new_page.close()
```

---

## 5. Verify current URL after navigation

### Selenium (Java)
```java
driver.findElement(By.id("homeLink")).click();
assertEquals("https://www.qaplayground.com/", driver.getCurrentUrl());
```

### Playwright (JS)
```js
await page.locator("#homeLink").click();
await expect(page).toHaveURL("https://www.qaplayground.com/");
```

### Playwright (Python)
```python
page.locator("#homeLink").click()
expect(page).to_have_url("https://www.qaplayground.com/")
```

---

## 6. Count all links on the page

### Selenium (Java)
```java
List<WebElement> links = driver.findElements(By.tagName("a"));
System.out.println("Total links: " + links.size());
```

### Playwright (JS)
```js
const count = await page.locator("a").count();
console.log("Total links:", count);
```

### Playwright (Python)
```python
count = page.locator("a").count()
print("Total links:", count)
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
