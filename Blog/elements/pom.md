---
title: Page Object Model (POM) in Selenium and Playwright
description: Learn how to implement the Page Object Model design pattern in Selenium WebDriver (Java), Playwright (JS), and Playwright (Python). Build maintainable and scalable test automation frameworks.
author: random coders
date: 18 march 2026
image: "/Images/blogs/b3.jpg"
keywords: "page object model selenium, POM design pattern, playwright page object, test automation framework, maintainable selenium tests"
---

## Introduction

The **Page Object Model (POM)** is the most widely used design pattern in test automation. It separates the test logic from the page interaction logic by representing each page (or section) as a class with:

- **Locators** — where elements are defined
- **Actions** — methods that interact with those elements

Benefits of POM:
1. **Maintainability** — change a locator in one place, tests stay intact
2. **Readability** — tests read like plain English
3. **Reusability** — page methods can be reused across many tests
4. **Scalability** — easy to add new pages and tests

## Key Concepts

| Concept | Description |
|---|---|
| Page Class | Represents one page or component |
| Locators | Defined as class fields |
| Actions | Methods that wrap element interactions |
| Test Class | Uses page classes — no locators here |
| BasePage | Optional parent class for shared utilities |

---

## 1. Bank Login Page — POM Example

The QA Playground Bank app (`/bank`) uses: `admin` / `admin123`

### Selenium (Java)
```java
// LoginPage.java
public class LoginPage {
    private WebDriver driver;

    // Locators
    private By usernameField = By.id("username");
    private By passwordField = By.id("password");
    private By loginButton   = By.id("loginBtn");
    private By errorMessage  = By.id("loginError");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public void enterUsername(String username) {
        driver.findElement(usernameField).sendKeys(username);
    }

    public void enterPassword(String password) {
        driver.findElement(passwordField).sendKeys(password);
    }

    public void clickLogin() {
        driver.findElement(loginButton).click();
    }

    public String getErrorMessage() {
        return driver.findElement(errorMessage).getText();
    }

    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }
}
```

```java
// LoginTest.java
public class LoginTest {
    WebDriver driver;
    LoginPage loginPage;

    @BeforeEach
    public void setup() {
        driver = new ChromeDriver();
        driver.get("https://www.qaplayground.com/bank");
        loginPage = new LoginPage(driver);
    }

    @Test
    public void testValidLogin() {
        loginPage.login("admin", "admin123");
        // assert dashboard loaded
    }

    @Test
    public void testInvalidLogin() {
        loginPage.login("admin", "wrongpass");
        assertEquals("Invalid credentials", loginPage.getErrorMessage());
    }
}
```

### Playwright (JS)
```js
// LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#password");
    this.loginBtn      = page.locator("#loginBtn");
    this.errorMsg      = page.locator("#loginError");
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }

  async getErrorMessage() {
    return this.errorMsg.textContent();
  }
}

module.exports = { LoginPage };
```

```js
// login.test.js
const { LoginPage } = require("./LoginPage");

test("valid login", async ({ page }) => {
  await page.goto("https://www.qaplayground.com/bank");
  const loginPage = new LoginPage(page);
  await loginPage.login("admin", "admin123");
  // assert dashboard
});

test("invalid login", async ({ page }) => {
  await page.goto("https://www.qaplayground.com/bank");
  const loginPage = new LoginPage(page);
  await loginPage.login("admin", "wrongpass");
  expect(await loginPage.getErrorMessage()).toContain("Invalid");
});
```

### Playwright (Python)
```python
# login_page.py
class LoginPage:
    def __init__(self, page):
        self.page = page
        self.username_input = page.locator("#username")
        self.password_input = page.locator("#password")
        self.login_btn      = page.locator("#loginBtn")
        self.error_msg      = page.locator("#loginError")

    def login(self, username: str, password: str):
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.login_btn.click()

    def get_error_message(self) -> str:
        return self.error_msg.text_content()
```

```python
# test_login.py
from login_page import LoginPage

def test_valid_login(page):
    page.goto("https://www.qaplayground.com/bank")
    login = LoginPage(page)
    login.login("admin", "admin123")
    # assert dashboard

def test_invalid_login(page):
    page.goto("https://www.qaplayground.com/bank")
    login = LoginPage(page)
    login.login("admin", "wrongpass")
    assert "Invalid" in login.get_error_message()
```

---

## 2. Dashboard Page Object

### Selenium (Java)
```java
public class DashboardPage {
    private WebDriver driver;

    private By totalBalance    = By.id("totalBalance");
    private By accountCount   = By.id("accountCount");
    private By logoutBtn      = By.id("logoutBtn");

    public DashboardPage(WebDriver driver) {
        this.driver = driver;
    }

    public String getTotalBalance() {
        return driver.findElement(totalBalance).getText();
    }

    public int getAccountCount() {
        return Integer.parseInt(driver.findElement(accountCount).getText());
    }

    public void logout() {
        driver.findElement(logoutBtn).click();
    }
}
```

### Playwright (JS)
```js
class DashboardPage {
  constructor(page) {
    this.totalBalance = page.locator("#totalBalance");
    this.accountCount = page.locator("#accountCount");
    this.logoutBtn    = page.locator("#logoutBtn");
  }

  async getTotalBalance() {
    return this.totalBalance.textContent();
  }

  async logout() {
    await this.logoutBtn.click();
  }
}
```

### Playwright (Python)
```python
class DashboardPage:
    def __init__(self, page):
        self.total_balance = page.locator("#totalBalance")
        self.account_count = page.locator("#accountCount")
        self.logout_btn    = page.locator("#logoutBtn")

    def get_total_balance(self) -> str:
        return self.total_balance.text_content()

    def logout(self):
        self.logout_btn.click()
```

> 📄 **Also Read:** [Top 10 Best Automation Practice Website](https://www.qaplayground.com/blog/top-10-best-automation-practice-website)
