---
title: How to Automate Tables in Selenium and Playwright
description: Learn how to automate HTML tables using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Covers reading rows, columns, cells, sorting, and searching within tables.
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "table automation selenium, read table row column, get cell value selenium, playwright table, HTML table testing, iterate table rows"
---

## Introduction

HTML tables are everywhere — dashboards, reports, transaction lists. Automating them requires:

1. **Count rows and columns** — verify table size
2. **Read a specific cell** — by row and column index
3. **Find a row by content** — search for specific data
4. **Verify table headers** — assert column names
5. **Verify all rows** — loop through and check values

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Count rows | `findElements(By.cssSelector("tbody tr")).size()` | `locator("tbody tr").count()` | `locator("tbody tr").count()` |
| Count cols | `findElements(By.cssSelector("thead th")).size()` | `locator("thead th").count()` | `locator("thead th").count()` |
| Get cell text | `findElement(By.cssSelector("tr:nth-child(2) td:nth-child(1)")).getText()` | `locator("tr:nth-child(2) td:nth-child(1)").textContent()` | `text_content()` |
| Get headers | `findElements(By.tagName("th"))` | `locator("th").allTextContents()` | `all_text_contents()` |

---

## 1. Count rows and columns

### Selenium (Java)
```java
List<WebElement> rows = driver.findElements(By.cssSelector("#dataTable tbody tr"));
System.out.println("Row count: " + rows.size());

List<WebElement> cols = driver.findElements(By.cssSelector("#dataTable thead th"));
System.out.println("Column count: " + cols.size());
```

### Playwright (JS)
```js
const rowCount = await page.locator("#dataTable tbody tr").count();
const colCount = await page.locator("#dataTable thead th").count();
console.log("Rows:", rowCount, "Cols:", colCount);
```

### Playwright (Python)
```python
row_count = page.locator("#dataTable tbody tr").count()
col_count = page.locator("#dataTable thead th").count()
print(f"Rows: {row_count}, Cols: {col_count}")
```

---

## 2. Read a specific cell by row and column

### Selenium (Java)
```java
// Row 1, Column 1 (1-based in CSS)
String cellText = driver.findElement(
    By.cssSelector("#dataTable tbody tr:nth-child(1) td:nth-child(1)")
).getText();
System.out.println("Cell value: " + cellText);
```

### Playwright (JS)
```js
const cellText = await page
  .locator("#dataTable tbody tr:nth-child(1) td:nth-child(1)")
  .textContent();
console.log("Cell value:", cellText);
```

### Playwright (Python)
```python
cell_text = page.locator(
    "#dataTable tbody tr:nth-child(1) td:nth-child(1)"
).text_content()
print("Cell value:", cell_text)
```

---

## 3. Read all header names

### Selenium (Java)
```java
List<WebElement> headers = driver.findElements(By.cssSelector("#dataTable thead th"));
for (WebElement header : headers) {
    System.out.println(header.getText());
}
```

### Playwright (JS)
```js
const headers = await page.locator("#dataTable thead th").allTextContents();
console.log(headers); // ["Name", "Age", "City", "Action"]
```

### Playwright (Python)
```python
headers = page.locator("#dataTable thead th").all_text_contents()
print(headers)
```

---

## 4. Find a row containing specific text

### Selenium (Java)
```java
List<WebElement> rows = driver.findElements(By.cssSelector("#dataTable tbody tr"));
for (WebElement row : rows) {
    if (row.getText().contains("Alice")) {
        System.out.println("Found row: " + row.getText());
        // click edit button in this row
        row.findElement(By.cssSelector("button[data-action='edit']")).click();
        break;
    }
}
```

### Playwright (JS)
```js
const row = page.locator("#dataTable tbody tr").filter({ hasText: "Alice" });
await expect(row).toBeVisible();
await row.locator("button[data-action='edit']").click();
```

### Playwright (Python)
```python
row = page.locator("#dataTable tbody tr").filter(has_text="Alice")
expect(row).to_be_visible()
row.locator("button[data-action='edit']").click()
```

---

## 5. Read all rows and build a list

### Selenium (Java)
```java
List<WebElement> rows = driver.findElements(By.cssSelector("#dataTable tbody tr"));
List<String> names = new ArrayList<>();
for (WebElement row : rows) {
    String name = row.findElement(By.cssSelector("td:nth-child(1)")).getText();
    names.add(name);
}
System.out.println(names);
```

### Playwright (JS)
```js
const rows = page.locator("#dataTable tbody tr");
const count = await rows.count();
const names = [];
for (let i = 0; i < count; i++) {
  const name = await rows.nth(i).locator("td:nth-child(1)").textContent();
  names.push(name.trim());
}
console.log(names);
```

### Playwright (Python)
```python
rows = page.locator("#dataTable tbody tr")
count = rows.count()
names = []
for i in range(count):
    name = rows.nth(i).locator("td:nth-child(1)").text_content()
    names.append(name.strip())
print(names)
```

---

## 6. Verify table has no data (empty state)

### Selenium (Java)
```java
List<WebElement> rows = driver.findElements(By.cssSelector("#dataTable tbody tr"));
assertTrue(rows.isEmpty() || rows.get(0).getText().contains("No data"));
```

### Playwright (JS)
```js
const rowCount = await page.locator("#dataTable tbody tr").count();
expect(rowCount).toBe(0);
// or check empty message
await expect(page.locator("#emptyTableMsg")).toBeVisible();
```

### Playwright (Python)
```python
row_count = page.locator("#dataTable tbody tr").count()
assert row_count == 0
# or
expect(page.locator("#emptyTableMsg")).to_be_visible()
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
