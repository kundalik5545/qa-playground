---
title: How to Handle Waits in Selenium and Playwright
description: Learn how to use implicit wait, explicit wait, and fluent wait in Selenium WebDriver (Java), and auto-waiting with custom timeouts in Playwright (JS) and Playwright (Python).
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "selenium waits, explicit wait selenium, implicit wait, WebDriverWait, playwright auto-wait, wait for element visible, fluent wait"
---

## Introduction

Waits are critical for stable automation — without them tests fail on slow networks or dynamic pages. There are three types of waits in Selenium:

1. **Implicit Wait** — global timeout applied to every `findElement` call
2. **Explicit Wait** — wait for a specific condition on a specific element
3. **Fluent Wait** — explicit wait with polling interval and ignored exceptions

Playwright **auto-waits** for elements to be ready before acting — explicit waits are rarely needed, but custom timeouts can be set.

## Key Methods Summary

| Wait Type | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Implicit | `implicitlyWait(Duration)` | Not applicable | Not applicable |
| Wait for visible | `visibilityOfElementLocated(By)` | `toBeVisible()` | `to_be_visible()` |
| Wait for clickable | `elementToBeClickable(By)` | `toBeEnabled()` | `to_be_enabled()` |
| Wait for text | `textToBePresentInElement(el, text)` | `toHaveText("text")` | `to_have_text("text")` |
| Wait for URL | `urlContains("path")` | `toHaveURL(...)` | `to_have_url(...)` |
| Custom timeout | `new WebDriverWait(driver, Duration)` | `{ timeout: 10000 }` | `timeout=10000` |

---

## 1. Implicit Wait

Sets a default timeout for all `findElement` calls across the session.

### Selenium (Java)
```java
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
// All findElement calls will now wait up to 10s before throwing NoSuchElementException
```

### Playwright (JS)
```js
// Playwright auto-waits — no implicit wait needed.
// To set a global default timeout:
page.setDefaultTimeout(10000); // 10 seconds
```

### Playwright (Python)
```python
# Playwright auto-waits — set global timeout if needed:
page.set_default_timeout(10000)  # 10 seconds
```

---

## 2. Explicit Wait — wait for element to be visible

### Selenium (Java)
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement element = wait.until(
    ExpectedConditions.visibilityOfElementLocated(By.id("dynamicElement"))
);
System.out.println(element.getText());
```

### Playwright (JS)
```js
// Playwright waits automatically — just assert/interact
await expect(page.locator("#dynamicElement")).toBeVisible({ timeout: 10000 });
const text = await page.locator("#dynamicElement").textContent();
```

### Playwright (Python)
```python
expect(page.locator("#dynamicElement")).to_be_visible(timeout=10000)
text = page.locator("#dynamicElement").text_content()
```

---

## 3. Explicit Wait — wait for element to be clickable

### Selenium (Java)
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement button = wait.until(
    ExpectedConditions.elementToBeClickable(By.id("submitBtn"))
);
button.click();
```

### Playwright (JS)
```js
await page.locator("#submitBtn").waitFor({ state: "visible" });
await page.locator("#submitBtn").click(); // auto-waits for clickable
```

### Playwright (Python)
```python
page.locator("#submitBtn").wait_for(state="visible")
page.locator("#submitBtn").click()  # auto-waits for clickable
```

---

## 4. Wait for text to appear on page

### Selenium (Java)
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.textToBePresentInElementLocated(
    By.id("statusMsg"), "Completed"
));
```

### Playwright (JS)
```js
await expect(page.locator("#statusMsg")).toHaveText("Completed", { timeout: 10000 });
```

### Playwright (Python)
```python
expect(page.locator("#statusMsg")).to_have_text("Completed", timeout=10000)
```

---

## 5. Wait for element to disappear (spinner/loader)

### Selenium (Java)
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("loadingSpinner")));
```

### Playwright (JS)
```js
await page.locator("#loadingSpinner").waitFor({ state: "hidden", timeout: 15000 });
```

### Playwright (Python)
```python
page.locator("#loadingSpinner").wait_for(state="hidden", timeout=15000)
```

---

## 6. Wait for URL to change

### Selenium (Java)
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.urlContains("/dashboard"));
```

### Playwright (JS)
```js
await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
```

### Playwright (Python)
```python
expect(page).to_have_url(re.compile("dashboard"), timeout=10000)
```

---

## 7. Fluent Wait (poll until condition)

### Selenium (Java)
```java
Wait<WebDriver> fluentWait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(15))
    .pollingEvery(Duration.ofSeconds(2))
    .ignoring(NoSuchElementException.class);

WebElement element = fluentWait.until(
    d -> d.findElement(By.id("asyncData"))
);
```

### Playwright (JS)
```js
// Use waitForFunction for custom polling
await page.waitForFunction(() => {
  const el = document.getElementById("asyncData");
  return el && el.textContent.trim().length > 0;
}, { timeout: 15000, polling: 2000 });
```

### Playwright (Python)
```python
page.wait_for_function(
    "() => document.getElementById('asyncData')?.textContent?.trim().length > 0",
    timeout=15000,
    polling_interval=2000
)
```

---

## 8. Wait for page to fully load

### Selenium (Java)
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(driver -> ((JavascriptExecutor) driver)
    .executeScript("return document.readyState").equals("complete"));
```

### Playwright (JS)
```js
await page.waitForLoadState("networkidle"); // or "load" or "domcontentloaded"
```

### Playwright (Python)
```python
page.wait_for_load_state("networkidle")  # or "load" or "domcontentloaded"
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
