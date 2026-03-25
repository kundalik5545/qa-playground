---
title: How to Handle Alerts in Selenium and Playwright
description: Learn how to automate JavaScript alert, confirm, and prompt dialogs using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Covers accept, dismiss, getText, and sendKeys.
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "handle alert selenium, confirm dialog automation, prompt alert selenium, switchTo alert, playwright dialog python js"
---

## Introduction

JavaScript dialogs are browser-native popups that pause page execution. There are three types:

1. **Simple Alert** — shows a message with only an OK button
2. **Confirm Dialog** — shows OK and Cancel buttons
3. **Prompt Dialog** — shows a text input with OK and Cancel

Selenium uses `switchTo().alert()` to interact with them. Playwright uses event-based dialog listeners.

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Switch to alert | `driver.switchTo().alert()` | `page.on("dialog", ...)` | `page.on("dialog", ...)` |
| Accept (OK) | `alert.accept()` | `dialog.accept()` | `dialog.accept()` |
| Dismiss (Cancel) | `alert.dismiss()` | `dialog.dismiss()` | `dialog.dismiss()` |
| Read message | `alert.getText()` | `dialog.message` | `dialog.message` |
| Type in prompt | `alert.sendKeys("text")` | `dialog.accept("text")` | `dialog.accept("text")` |

---

## 1. Simple Alert — accept it

### Selenium (Java)
```java
driver.findElement(By.id("simpleAlertBtn")).click();

Alert alert = driver.switchTo().alert();
System.out.println(alert.getText());
alert.accept();
```

### Playwright (JS)
```js
page.once("dialog", async (dialog) => {
  console.log(dialog.message());
  await dialog.accept();
});
await page.locator("#simpleAlertBtn").click();
```

### Playwright (Python)
```python
page.once("dialog", lambda dialog: dialog.accept())
page.locator("#simpleAlertBtn").click()
```

---

## 2. Confirm Dialog — accept and dismiss

### Selenium (Java)
```java
// Accept
driver.findElement(By.id("confirmAlertBtn")).click();
driver.switchTo().alert().accept();

// Dismiss
driver.findElement(By.id("confirmAlertBtn")).click();
driver.switchTo().alert().dismiss();
```

### Playwright (JS)
```js
// Accept
page.once("dialog", (dialog) => dialog.accept());
await page.locator("#confirmAlertBtn").click();

// Dismiss
page.once("dialog", (dialog) => dialog.dismiss());
await page.locator("#confirmAlertBtn").click();
```

### Playwright (Python)
```python
# Accept
page.once("dialog", lambda d: d.accept())
page.locator("#confirmAlertBtn").click()

# Dismiss
page.once("dialog", lambda d: d.dismiss())
page.locator("#confirmAlertBtn").click()
```

---

## 3. Prompt Dialog — type text and accept

### Selenium (Java)
```java
driver.findElement(By.id("promptAlertBtn")).click();
Alert prompt = driver.switchTo().alert();
System.out.println(prompt.getText());
prompt.sendKeys("QA Playground");
prompt.accept();
```

### Playwright (JS)
```js
page.once("dialog", async (dialog) => {
  console.log(dialog.defaultValue());
  await dialog.accept("QA Playground");
});
await page.locator("#promptAlertBtn").click();
```

### Playwright (Python)
```python
page.once("dialog", lambda d: d.accept("QA Playground"))
page.locator("#promptAlertBtn").click()
```

---

## 4. Verify result after alert interaction

### Selenium (Java)
```java
driver.findElement(By.id("confirmAlertBtn")).click();
driver.switchTo().alert().accept();

WebElement result = driver.findElement(By.id("alertResult"));
assertTrue(result.isDisplayed());
assertEquals("You clicked OK!", result.getText());
```

### Playwright (JS)
```js
page.once("dialog", (d) => d.accept());
await page.locator("#confirmAlertBtn").click();
await expect(page.locator("#alertResult")).toHaveText("You clicked OK!");
```

### Playwright (Python)
```python
page.once("dialog", lambda d: d.accept())
page.locator("#confirmAlertBtn").click()
expect(page.locator("#alertResult")).to_have_text("You clicked OK!")
```

---

## 5. Wait for alert to appear

### Selenium (Java)
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
Alert alert = wait.until(ExpectedConditions.alertIsPresent());
alert.accept();
```

### Playwright (JS)
```js
// Playwright auto-waits — register handler before triggering
page.once("dialog", (d) => d.dismiss());
await page.locator("#triggerBtn").click();
```

### Playwright (Python)
```python
# Register before triggering
page.once("dialog", lambda d: d.dismiss())
page.locator("#triggerBtn").click()
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
