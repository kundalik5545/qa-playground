---
title: How to Automate Form Submission in Selenium and Playwright
description: Learn how to fill, validate, and submit HTML forms using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Covers all field types, validation errors, and success state assertions.
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "form automation selenium, submit form selenium, form validation testing, playwright form fill, fill form python playwright, registration form automation"
---

## Introduction

Forms combine every element type — text inputs, dropdowns, radio buttons, checkboxes, and passwords. Automating them well means:

1. Filling all field types correctly
2. Triggering and asserting validation error messages
3. Submitting and verifying the success state
4. Resetting and verifying fields are cleared

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Fill text input | `sendKeys("text")` | `fill("text")` | `fill("text")` |
| Select dropdown | `selectByVisibleText()` | `selectOption({ label: ... })` | `select_option(label=...)` |
| Radio button | `click()` | `check()` | `check()` |
| Checkbox | `click()` | `check()` / `uncheck()` | `check()` / `uncheck()` |
| Submit form | `click()` on submit | `click()` on submit | `click()` on submit |
| Assert error | `getText()` on error el | `toHaveText(...)` | `to_have_text(...)` |
| Assert visible | `isDisplayed()` | `toBeVisible()` | `to_be_visible()` |

---

## 1. Fill text inputs

### Selenium (Java)
```java
driver.findElement(By.id("firstName")).sendKeys("John");
driver.findElement(By.id("lastName")).sendKeys("Doe");
driver.findElement(By.id("email")).sendKeys("john@example.com");
driver.findElement(By.id("phone")).sendKeys("9876543210");
driver.findElement(By.id("city")).sendKeys("Mumbai");
```

### Playwright (JS)
```js
await page.fill("#firstName", "John");
await page.fill("#lastName", "Doe");
await page.fill("#email", "john@example.com");
await page.fill("#phone", "9876543210");
await page.fill("#city", "Mumbai");
```

### Playwright (Python)
```python
page.fill("#firstName", "John")
page.fill("#lastName", "Doe")
page.fill("#email", "john@example.com")
page.fill("#phone", "9876543210")
page.fill("#city", "Mumbai")
```

---

## 2. Fill date of birth

### Selenium (Java)
```java
driver.findElement(By.id("dob")).sendKeys("1995-06-15");
```

### Playwright (JS)
```js
await page.fill("#dob", "1995-06-15");
```

### Playwright (Python)
```python
page.fill("#dob", "1995-06-15")
```

---

## 3. Select a radio button (Gender)

### Selenium (Java)
```java
driver.findElement(By.id("gender-male")).click();
assertTrue(driver.findElement(By.id("gender-male")).isSelected());
```

### Playwright (JS)
```js
await page.getByTestId("radio-gender-male").check();
await expect(page.getByTestId("radio-gender-male")).toBeChecked();
```

### Playwright (Python)
```python
page.get_by_test_id("radio-gender-male").check()
expect(page.get_by_test_id("radio-gender-male")).to_be_checked()
```

---

## 4. Select country from dropdown

### Selenium (Java)
```java
// shadcn Select is a custom component — click trigger, then option
driver.findElement(By.cssSelector("[data-testid='select-country']")).click();
driver.findElement(By.xpath("//div[text()='India']")).click();
```

### Playwright (JS)
```js
await page.getByTestId("select-country").click();
await page.getByText("India").click();
```

### Playwright (Python)
```python
page.get_by_test_id("select-country").click()
page.get_by_text("India").click()
```

---

## 5. Check interest checkboxes

### Selenium (Java)
```java
driver.findElement(By.id("interest-selenium")).click();
driver.findElement(By.id("interest-playwright")).click();
assertTrue(driver.findElement(By.id("interest-selenium")).isSelected());
```

### Playwright (JS)
```js
await page.getByTestId("checkbox-interest-selenium").check();
await page.getByTestId("checkbox-interest-playwright").check();
await expect(page.getByTestId("checkbox-interest-selenium")).toBeChecked();
```

### Playwright (Python)
```python
page.get_by_test_id("checkbox-interest-selenium").check()
page.get_by_test_id("checkbox-interest-playwright").check()
expect(page.get_by_test_id("checkbox-interest-selenium")).to_be_checked()
```

---

## 6. Fill password and confirm password

### Selenium (Java)
```java
driver.findElement(By.id("password")).sendKeys("secret123");
driver.findElement(By.id("confirmPassword")).sendKeys("secret123");
```

### Playwright (JS)
```js
await page.fill("#password", "secret123");
await page.fill("#confirmPassword", "secret123");
```

### Playwright (Python)
```python
page.fill("#password", "secret123")
page.fill("#confirmPassword", "secret123")
```

---

## 7. Accept terms and submit

### Selenium (Java)
```java
driver.findElement(By.id("terms")).click();
driver.findElement(By.id("submitFormBtn")).click();
```

### Playwright (JS)
```js
await page.getByTestId("checkbox-terms").check();
await page.getByTestId("submit-form-btn").click();
```

### Playwright (Python)
```python
page.get_by_test_id("checkbox-terms").check()
page.get_by_test_id("submit-form-btn").click()
```

---

## 8. Assert validation errors on empty submit

### Selenium (Java)
```java
driver.findElement(By.id("submitFormBtn")).click();

assertTrue(driver.findElement(By.id("firstNameError")).isDisplayed());
assertEquals("Email is required.", driver.findElement(By.id("emailError")).getText());
assertTrue(driver.findElement(By.id("genderError")).isDisplayed());
```

### Playwright (JS)
```js
await page.getByTestId("submit-form-btn").click();
await expect(page.getByTestId("error-first-name")).toBeVisible();
await expect(page.getByTestId("error-email")).toHaveText("Email is required.");
await expect(page.getByTestId("error-gender")).toBeVisible();
```

### Playwright (Python)
```python
page.get_by_test_id("submit-form-btn").click()
expect(page.get_by_test_id("error-first-name")).to_be_visible()
expect(page.get_by_test_id("error-email")).to_have_text("Email is required.")
expect(page.get_by_test_id("error-gender")).to_be_visible()
```

---

## 9. Assert password mismatch error

### Selenium (Java)
```java
driver.findElement(By.id("password")).sendKeys("secret123");
driver.findElement(By.id("confirmPassword")).sendKeys("wrong456");
driver.findElement(By.id("submitFormBtn")).click();

assertEquals("Passwords do not match.", driver.findElement(By.id("confirmPasswordError")).getText());
```

### Playwright (JS)
```js
await page.fill("#password", "secret123");
await page.fill("#confirmPassword", "wrong456");
await page.getByTestId("submit-form-btn").click();
await expect(page.getByTestId("error-confirm-password")).toHaveText("Passwords do not match.");
```

### Playwright (Python)
```python
page.fill("#password", "secret123")
page.fill("#confirmPassword", "wrong456")
page.get_by_test_id("submit-form-btn").click()
expect(page.get_by_test_id("error-confirm-password")).to_have_text("Passwords do not match.")
```

---

## 10. Assert success state after valid submit

### Selenium (Java)
```java
// after filling all fields correctly...
driver.findElement(By.id("submitFormBtn")).click();
assertTrue(driver.findElement(By.id("formSuccessMsg")).isDisplayed());
assertTrue(driver.findElement(By.id("submittedName")).getText().contains("John"));
```

### Playwright (JS)
```js
await page.getByTestId("submit-form-btn").click();
await expect(page.getByTestId("form-success-msg")).toBeVisible();
await expect(page.getByTestId("submitted-name")).toContainText("John");
```

### Playwright (Python)
```python
page.get_by_test_id("submit-form-btn").click()
expect(page.get_by_test_id("form-success-msg")).to_be_visible()
expect(page.get_by_test_id("submitted-name")).to_contain_text("John")
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
