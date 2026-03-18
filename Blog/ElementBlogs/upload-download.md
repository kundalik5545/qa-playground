---
title: How to Automate File Upload and Download in Selenium and Playwright
description: Learn how to automate file upload and download using Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Covers sendKeys for upload, download path setup, and file verification.
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "file upload selenium, sendKeys upload, file download automation, playwright download, verify file downloaded, input type file"
---

## Introduction

File upload and download are common test scenarios that often trip up beginners. Key points:

- **File upload** — use `sendKeys` with the absolute file path on `<input type="file">` (no clicking dialog)
- **File download** — configure the browser to download to a specific folder, then verify the file exists
- **Playwright** makes downloads especially easy with built-in download event handling

## Key Methods Summary

| Action | Selenium (Java) | Playwright (JS) | Playwright (Python) |
|---|---|---|---|
| Upload file | `element.sendKeys("/path/file.txt")` | `locator.setInputFiles("path")` | `locator.set_input_files("path")` |
| Start download | click download button | `page.waitForEvent("download")` | `page.expect_download()` |
| Save download | browser profile path | `download.saveAs("path")` | `download.save_as("path")` |
| Get filename | check file system | `download.suggestedFilename()` | `download.suggested_filename` |
| Verify file | `Files.exists(path)` | `fs.existsSync(path)` | `os.path.exists(path)` |

---

## 1. Upload a file using sendKeys

### Selenium (Java)
```java
WebElement uploadInput = driver.findElement(By.id("fileUploadInput"));
uploadInput.sendKeys("/absolute/path/to/test-file.txt");

// Verify file name is shown
String fileName = driver.findElement(By.id("uploadedFileName")).getText();
assertEquals("test-file.txt", fileName);
```

### Playwright (JS)
```js
await page.locator("#fileUploadInput").setInputFiles("./test-file.txt");
await expect(page.locator("#uploadedFileName")).toHaveText("test-file.txt");
```

### Playwright (Python)
```python
page.locator("#fileUploadInput").set_input_files("./test-file.txt")
expect(page.locator("#uploadedFileName")).to_have_text("test-file.txt")
```

---

## 2. Upload multiple files

### Selenium (Java)
```java
// For multiple file inputs, send multiple paths separated by newline
WebElement input = driver.findElement(By.id("multiFileInput"));
input.sendKeys("/path/file1.txt\n/path/file2.txt");
```

### Playwright (JS)
```js
await page.locator("#multiFileInput").setInputFiles([
  "./file1.txt",
  "./file2.txt"
]);
```

### Playwright (Python)
```python
page.locator("#multiFileInput").set_input_files(["./file1.txt", "./file2.txt"])
```

---

## 3. Clear a selected file

### Selenium (Java)
```java
// Selenium cannot clear a file input directly — reload or use JS
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("arguments[0].value = '';", driver.findElement(By.id("fileUploadInput")));
```

### Playwright (JS)
```js
await page.locator("#fileUploadInput").setInputFiles([]);
```

### Playwright (Python)
```python
page.locator("#fileUploadInput").set_input_files([])
```

---

## 4. Download a file and verify it

### Selenium (Java)
```java
// Configure Chrome to download to a specific folder
ChromeOptions options = new ChromeOptions();
Map<String, Object> prefs = new HashMap<>();
prefs.put("download.default_directory", "/path/to/downloads");
options.setExperimentalOption("prefs", prefs);
WebDriver driver = new ChromeDriver(options);

// Click download button
driver.findElement(By.id("downloadBtn")).click();

// Wait and verify the file exists
Thread.sleep(3000); // use explicit wait in real tests
File downloadedFile = new File("/path/to/downloads/report.csv");
assertTrue(downloadedFile.exists());
```

### Playwright (JS)
```js
// Playwright handles downloads natively
const [download] = await Promise.all([
  page.waitForEvent("download"),
  page.locator("#downloadBtn").click(),
]);

// Save to a specific path
await download.saveAs("./downloads/" + download.suggestedFilename());

// Verify filename
console.log("Downloaded:", download.suggestedFilename());
expect(download.suggestedFilename()).toContain("report");
```

### Playwright (Python)
```python
with page.expect_download() as download_info:
    page.locator("#downloadBtn").click()
download = download_info.value

# Save the file
download.save_as(f"./downloads/{download.suggested_filename}")

# Verify filename
print("Downloaded:", download.suggested_filename)
assert "report" in download.suggested_filename
```

---

## 5. Verify uploaded file is accepted (success message)

### Selenium (Java)
```java
driver.findElement(By.id("fileUploadInput")).sendKeys("/path/to/image.png");
driver.findElement(By.id("uploadSubmitBtn")).click();

WebElement success = driver.findElement(By.id("uploadSuccess"));
assertTrue(success.isDisplayed());
assertEquals("File uploaded successfully!", success.getText());
```

### Playwright (JS)
```js
await page.locator("#fileUploadInput").setInputFiles("./image.png");
await page.locator("#uploadSubmitBtn").click();
await expect(page.locator("#uploadSuccess")).toHaveText("File uploaded successfully!");
```

### Playwright (Python)
```python
page.locator("#fileUploadInput").set_input_files("./image.png")
page.locator("#uploadSubmitBtn").click()
expect(page.locator("#uploadSuccess")).to_have_text("File uploaded successfully!")
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
