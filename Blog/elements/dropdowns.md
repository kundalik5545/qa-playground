---
title: How to Handle Dropdowns using Select Class in Selenium and Playwright
description: Learn how to automate dropdowns using the Select class in Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Covers selectByText, selectByIndex, selectByValue, and multi-select.
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "Select class selenium, selectByVisibleText, selectByIndex, selectByValue, dropdown automation, playwright select option"
---

## Introduction

HTML `<select>` dropdowns are handled differently across frameworks:

- **Selenium** provides a dedicated `Select` helper class
- **Playwright** uses `selectOption()` with flexible matchers
- Both support **single-select** and **multi-select** dropdowns

Common scenarios:
1. Select by visible text
2. Select by index
3. Select by value attribute
4. Get all available options
5. Get the currently selected option
6. Multi-select

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| By visible text | `selectByVisibleText("text")` | `selectOption({ label: "text" })` | `select_option(label="text")` |
| By index | `selectByIndex(n)` | `selectOption({ index: n })` | `select_option(index=n)` |
| By value | `selectByValue("val")` | `selectOption("val")` | `select_option("val")` |
| Get selected | `getFirstSelectedOption().getText()` | `inputValue()` | `input_value()` |
| Get all options | `getOptions()` | `locator("option").allTextContents()` | `locator("option").all_text_contents()` |

---

## 1. Select by visible text

### Selenium (Java)
```java
Select select = new Select(driver.findElement(By.id("fruitSelect")));
select.selectByVisibleText("Apple");
assertEquals("Apple", select.getFirstSelectedOption().getText());
```

### Playwright (JS)
```js
await page.locator("#fruitSelect").selectOption({ label: "Apple" });
await expect(page.locator("#fruitSelect")).toHaveValue("apple");
```

### Playwright (Python)
```python
page.locator("#fruitSelect").select_option(label="Apple")
expect(page.locator("#fruitSelect")).to_have_value("apple")
```

---

## 2. Select by index

### Selenium (Java)
```java
Select select = new Select(driver.findElement(By.id("languageSelect")));
select.selectByIndex(2); // selects the 3rd option (0-based)
System.out.println(select.getFirstSelectedOption().getText());
```

### Playwright (JS)
```js
await page.locator("#languageSelect").selectOption({ index: 2 });
const value = await page.locator("#languageSelect").inputValue();
console.log(value);
```

### Playwright (Python)
```python
page.locator("#languageSelect").select_option(index=2)
value = page.locator("#languageSelect").input_value()
print(value)
```

---

## 3. Select by value attribute

### Selenium (Java)
```java
Select select = new Select(driver.findElement(By.id("countrySelect")));
select.selectByValue("india");
assertEquals("India", select.getFirstSelectedOption().getText());
```

### Playwright (JS)
```js
await page.locator("#countrySelect").selectOption("india");
await expect(page.locator("#countrySelect")).toHaveValue("india");
```

### Playwright (Python)
```python
page.locator("#countrySelect").select_option("india")
expect(page.locator("#countrySelect")).to_have_value("india")
```

---

## 4. Get all available options

### Selenium (Java)
```java
Select select = new Select(driver.findElement(By.id("languageSelect")));
List<WebElement> options = select.getOptions();
for (WebElement opt : options) {
    System.out.println(opt.getText());
}
System.out.println("Total options: " + options.size());
```

### Playwright (JS)
```js
const options = await page.locator("#languageSelect option").allTextContents();
console.log(options); // ["Python", "Java", "JavaScript"]
```

### Playwright (Python)
```python
options = page.locator("#languageSelect option").all_text_contents()
print(options)
```

---

## 5. Verify currently selected option

### Selenium (Java)
```java
Select select = new Select(driver.findElement(By.id("countrySelect")));
String selected = select.getFirstSelectedOption().getText();
assertEquals("Argentina", selected);
```

### Playwright (JS)
```js
await expect(page.locator("#countrySelect")).toHaveValue("argentina");
```

### Playwright (Python)
```python
expect(page.locator("#countrySelect")).to_have_value("argentina")
```

---

## 6. Multi-select dropdown

### Selenium (Java)
```java
Select multiSelect = new Select(driver.findElement(By.id("heroSelect")));
assertTrue(multiSelect.isMultiple());

multiSelect.selectByVisibleText("Batman");
multiSelect.selectByVisibleText("Aquaman");

List<WebElement> selected = multiSelect.getAllSelectedOptions();
assertEquals(2, selected.size());
```

### Playwright (JS)
```js
await page.locator("#heroSelect").selectOption([
  { label: "Batman" },
  { label: "Aquaman" }
]);
const selected = await page.locator("#heroSelect option:checked").count();
expect(selected).toBe(2);
```

### Playwright (Python)
```python
page.locator("#heroSelect").select_option([
    {"label": "Batman"},
    {"label": "Aquaman"}
])
selected_count = page.locator("#heroSelect option:checked").count()
assert selected_count == 2
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
