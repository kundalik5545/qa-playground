/**
 * FAQ data for each practice element page.
 * Key = slug (matches componentMapping in [slug]/page.jsx).
 * Add a new key to extend FAQs for any practice element.
 */
export const practiceElementFaqs = {
  "input-fields": [
    {
      q: "How do I automate text input fields using Selenium WebDriver?",
      a: "Use driver.findElement() to locate the field by id, name, CSS selector, or XPath, then call .sendKeys('your text') to type into it. To clear an existing value first, call .clear() before sendKeys(). Example: driver.findElement(By.id('name')).sendKeys('John Doe').",
    },
    {
      q: "How do I clear and retype a value in an input field with Playwright?",
      a: "Use page.fill('selector', 'new value') — it automatically clears the field before typing. If you need to simulate real key-by-key typing (for event-driven validation), use page.type() instead. To only clear without typing, use page.fill('selector', '').",
    },
    {
      q: "How do I handle password input fields in automation testing?",
      a: "Password fields are just <input type='password'> elements — they behave the same as text inputs for automation purposes. Locate them by id, name, or data-testid and use sendKeys() in Selenium or fill() in Playwright. The masking is only visual; the underlying value is accessible for assertions.",
    },
    {
      q: "How do I verify that an input field is disabled in Selenium or Playwright?",
      a: "In Selenium, use element.isEnabled() — it returns false when the field is disabled. In Playwright, use await page.isDisabled('selector') or check the disabled attribute with page.getAttribute('selector', 'disabled'). On this practice page, look for the 'Disabled Input' field to run this assertion.",
    },
    {
      q: "How do I assert the placeholder text of an input field in Playwright or Cypress?",
      a: "In Playwright: await expect(page.locator('input')).toHaveAttribute('placeholder', 'expected text'). In Selenium: element.getAttribute('placeholder'). In Cypress: cy.get('input').should('have.attr', 'placeholder', 'expected text'). Placeholder assertions are useful for checking UI labels without interacting with the field.",
    },
    {
      q: "How do I simulate pressing Tab or Enter after typing in an input field?",
      a: "In Selenium (Java): element.sendKeys(Keys.TAB) or element.sendKeys(Keys.ENTER). In Playwright: await page.press('selector', 'Tab') or page.press('selector', 'Enter'). In Cypress: cy.get('input').type('{enter}'). This is useful for triggering form validation or moving focus to the next field.",
    },
  ],

  buttons: [
    {
      q: "How do I click a button using Selenium WebDriver?",
      a: "Locate the button with driver.findElement() and call .click(). Example: driver.findElement(By.id('submit-btn')).click(). For buttons that appear dynamically, add an explicit wait first: new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.elementToBeClickable(By.id('submit-btn'))).click().",
    },
    {
      q: "How do I perform a double-click on a button in Selenium WebDriver?",
      a: "Use the Actions class: new Actions(driver).doubleClick(element).perform(). In Playwright, use page.dblclick('selector'). Double-click scenarios are common in data table interactions (inline edit) and file managers — this practice page includes a dedicated double-click button to test this.",
    },
    {
      q: "How do I right-click a button to trigger a context menu in Selenium?",
      a: "Use the Actions class: new Actions(driver).contextClick(element).perform(). In Playwright, use page.click('selector', { button: 'right' }). In Cypress, cy.get('button').rightclick(). Right-click automation is useful for testing custom context menus in web applications.",
    },
    {
      q: "How do I check if a button is disabled before clicking it in automation?",
      a: "In Selenium, element.isEnabled() returns false for disabled buttons. In Playwright, await page.isDisabled('selector') or await expect(page.locator('button')).toBeDisabled(). In Cypress, cy.get('button').should('be.disabled'). Always assert the disabled state before attempting a click to avoid flaky test failures.",
    },
    {
      q: "How do I wait for a button to become clickable in Playwright or Selenium?",
      a: "Playwright auto-waits for elements to be clickable before interacting — no extra wait code needed in most cases. In Selenium, use WebDriverWait: wait.until(ExpectedConditions.elementToBeClickable(locator)). For buttons that appear after an API call or animation, this wait prevents ElementNotInteractableException errors.",
    },
  ],

  "radio-checkbox": [
    {
      q: "How do I select a radio button using Selenium WebDriver?",
      a: "Find the radio button element and call .click(). Before clicking, check if it's already selected with element.isSelected() to avoid unnecessary clicks. Example: driver.findElement(By.id('option-male')).click(). For a radio group, locate each option individually and click the one you want.",
    },
    {
      q: "How do I verify a specific radio button is selected in Playwright?",
      a: "Use await expect(page.locator('#option-male')).toBeChecked(). To check the currently selected value in a radio group, use page.getByRole('radio', { name: 'Male' }).isChecked(). In Cypress: cy.get('#option-male').should('be.checked').",
    },
    {
      q: "How do I check and uncheck a checkbox in automation testing?",
      a: "In Selenium: call element.click() to toggle — check element.isSelected() first if you need idempotent behavior. In Playwright: use page.check('selector') to check and page.uncheck('selector') to uncheck, regardless of current state. In Cypress: cy.get('input[type=checkbox]').check() and .uncheck().",
    },
    {
      q: "How do I select all checkboxes in a group with Selenium WebDriver?",
      a: "Find all checkboxes with driver.findElements(By.cssSelector('input[type=checkbox]')) and iterate: for (WebElement cb : checkboxes) { if (!cb.isSelected()) cb.click(); }. In Playwright: for (const cb of await page.locator('input[type=checkbox]').all()) { await cb.check(); }.",
    },
    {
      q: "What is the difference between isSelected() and isEnabled() for checkboxes in Selenium?",
      a: "isSelected() tells you whether the checkbox is checked (true) or unchecked (false). isEnabled() tells you whether the checkbox is interactive or disabled. A checkbox can be enabled but unchecked, or disabled and checked. Use isSelected() for state assertions and isEnabled() before attempting to click.",
    },
    {
      q: "How do I handle a radio group where options load dynamically in Playwright?",
      a: "Use Playwright's auto-waiting: page.getByRole('radio', { name: 'Option Name' }) will automatically wait for the element to appear. If options load after an API call, you can also use await page.waitForSelector('input[type=radio]') before interacting. Avoid hard-coded sleeps — rely on Playwright's built-in retrying assertions instead.",
    },
  ],

  forms: [
    {
      q: "How do I fill and submit a form with Selenium WebDriver?",
      a: "Fill each field with sendKeys(), then click the submit button or call element.submit() on any form field. Example: driver.findElement(By.id('email')).sendKeys('test@example.com'); driver.findElement(By.id('submit')).click(). For complex forms, use the Page Object Model to keep your test code maintainable.",
    },
    {
      q: "How do I test form validation errors in Playwright?",
      a: "Submit the form without filling required fields, then assert the error messages: await expect(page.locator('.error-message')).toBeVisible(). For HTML5 browser validation (required attribute), use page.evaluate() to check the validity state: page.evaluate(() => document.querySelector('#email').validity.valueMissing).",
    },
    {
      q: "How do I locate form inputs by their label text in Playwright?",
      a: "Use page.getByLabel('Email Address') — Playwright matches the <label> text to the associated input automatically. This is the most resilient locator strategy for forms as it doesn't rely on CSS ids or classes that change. In Selenium, find the label by text and use its 'for' attribute to find the linked input.",
    },
    {
      q: "How do I handle form dropdowns (select elements) in Selenium WebDriver?",
      a: "Use the Select class: Select dropdown = new Select(driver.findElement(By.id('country'))); dropdown.selectByVisibleText('India'); or dropdown.selectByValue('IN');. In Playwright, use page.selectOption('selector', { label: 'India' }) or page.selectOption('selector', 'IN'). In Cypress: cy.get('select').select('India').",
    },
    {
      q: "How do I reset or clear a form in automation testing?",
      a: "Click the form's reset button if one exists. To clear individual fields, use element.clear() in Selenium or page.fill('selector', '') in Playwright. For Cypress: cy.get('input').clear(). After resetting, assert that all fields are empty and any validation state is cleared before continuing.",
    },
    {
      q: "How do I automate a multi-step form or wizard in Playwright?",
      a: "Fill the fields on each step, click Next, wait for the next step to appear using await expect(page.locator('[data-step=\"2\"]')).toBeVisible(), then continue. Use Playwright's auto-waiting so you don't need hard waits between steps. Store reusable step-filling logic in helper functions or Page Object classes for clean, maintainable test code.",
    },
  ],

  dropdowns: [
    {
      q: "How do I select a dropdown option by visible text using Selenium WebDriver?",
      a: "Wrap the dropdown element with Selenium's Select class, then call selectByVisibleText(). Example: Select dropdown = new Select(driver.findElement(By.id('dropdown-fruit'))); dropdown.selectByVisibleText('Apple'). This matches the option text exactly as displayed in the browser — case-sensitive.",
    },
    {
      q: "How do I select a dropdown option by its value attribute in Selenium?",
      a: "Use Select.selectByValue('india') — this matches the HTML value attribute of the <option> tag, not the visible label. This is more stable than text-based selection because visible labels can change with localisation or UI updates. In Playwright, use page.selectOption('#dropdown-country', 'india').",
    },
    {
      q: "How do I get all available options from a dropdown in Playwright or Selenium?",
      a: "In Selenium: List<WebElement> options = new Select(element).getOptions(); — then iterate or assert size. In Playwright: const options = await page.locator('#dropdown-language option').allInnerTexts(); — returns a string array of all option labels. Use this to verify the complete option list without selecting anything.",
    },
    {
      q: "How do I handle a native HTML multi-select element in Selenium WebDriver?",
      a: "Use Select.isMultiple() first to confirm the element supports multi-select. Then call selectByVisibleText() multiple times — each call adds to the selection. Example: heroes.selectByVisibleText('Ant-Man'); heroes.selectByVisibleText('Batman'). Use getAllSelectedOptions() to assert which options are currently selected.",
    },
    {
      q: "How do I select multiple options in a multi-select dropdown with Playwright?",
      a: "Pass an array to page.selectOption(): await page.selectOption('#dropdown-heroes', ['ant-man', 'batman']). Playwright selects all values in the array in one call. To verify: await expect(page.locator('#dropdown-heroes')).toHaveValues(['ant-man', 'batman']).",
    },
    {
      q: "What is the difference between selectByVisibleText, selectByValue, and selectByIndex in Selenium?",
      a: "selectByVisibleText('Apple') matches the label the user sees. selectByValue('apple') matches the HTML value attribute. selectByIndex(0) selects the option at position 0 (zero-based). Use selectByValue for the most reliable automation since values rarely change; avoid selectByIndex as position-based selection breaks if options are reordered.",
    },
  ],

  "alerts-dialogs": [
    {
      q: "How do I handle a browser alert dialog in Selenium WebDriver?",
      a: "After triggering an alert, switch to it with driver.switchTo().alert(). Then call .accept() to click OK, .dismiss() to click Cancel, or .getText() to read the message. Example: Alert alert = driver.switchTo().alert(); String message = alert.getText(); alert.accept(). Always switch to the alert before any other interaction — attempting to click page elements while an alert is open throws UnhandledAlertException.",
    },
    {
      q: "How do I handle browser alert dialogs in Playwright?",
      a: "Register a dialog handler before the action that triggers the alert: page.on('dialog', dialog => dialog.accept()). For confirm dialogs, use dialog.dismiss() to click Cancel. For prompt dialogs, pass a value: dialog.accept('my input'). Read the message with dialog.message(). The handler must be registered before the trigger — Playwright auto-dismisses unhandled dialogs.",
    },
    {
      q: "How do I accept and dismiss a confirm dialog in Selenium WebDriver?",
      a: "Switch to the alert and call accept() for OK or dismiss() for Cancel: Alert confirm = driver.switchTo().alert(); confirm.accept(). To assert the result, check the page state after dismissal — on this practice page the result shows 'Accepted' or 'Dismissed' below the trigger button. In Playwright: page.on('dialog', d => d.dismiss()).",
    },
    {
      q: "How do I enter text in a prompt dialog using Selenium or Playwright?",
      a: "In Selenium: Alert prompt = driver.switchTo().alert(); prompt.sendKeys('my input'); prompt.accept(). In Playwright: page.on('dialog', async dialog => { await dialog.accept('my input'); }). The text is passed to sendKeys() in Selenium or as an argument to dialog.accept() in Playwright. Calling dismiss() on a prompt cancels it without capturing any input.",
    },
    {
      q: "How do I test toast notifications in Selenium or Playwright automation?",
      a: "Toast notifications are regular DOM elements that appear temporarily. In Selenium, add an explicit wait: wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector('.toast'))). In Playwright, use await expect(page.locator('.toast')).toBeVisible(). Assert the message text, then optionally wait for it to disappear: await expect(locator).not.toBeVisible(). Use data-testid attributes to make toast locators stable.",
    },
    {
      q: "How do I close a modal dialog (sweet alert or custom modal) in automation testing?",
      a: "Modal dialogs are custom HTML elements, not browser-native dialogs — do not use driver.switchTo().alert() for them. In Selenium: driver.findElement(By.cssSelector('[data-testid=\"modal-close-btn\"]')).click(). In Playwright: await page.click('[data-testid=\"modal-close-btn\"]'). You can also press Escape: page.keyboard.press('Escape'). Assert the modal is gone with element.isDisplayed() returning false or expect(locator).not.toBeVisible().",
    },
  ],

  links: [
    {
      q: "How do I click a link and verify it navigates to the correct URL in Selenium WebDriver?",
      a: "Click the link with element.click(), then assert the URL with driver.getCurrentUrl(). Example: driver.findElement(By.linkText('Home')).click(); assert driver.getCurrentUrl().equals('https://qaplayground.com/'). In Playwright: await page.click('[data-testid=\"link-internal-home\"]'); await expect(page).toHaveURL('/').",
    },
    {
      q: "How do I handle a link that opens in a new tab in Selenium WebDriver?",
      a: "After clicking a target='_blank' link, switch to the new window handle: String newTab = driver.getWindowHandles().stream().reduce((first, second) -> second).get(); driver.switchTo().window(newTab). In Playwright, use page.waitForEvent('popup') before the click: const popup = await page.waitForEvent('popup'); await page.click('[data-testid=\"link-external-selenium\"]'); await popup.waitForLoadState().",
    },
    {
      q: "How do I check for broken links in Selenium automation testing?",
      a: "Read the href attribute with element.getAttribute('href'), then send an HTTP GET request using Java's HttpURLConnection or Python's requests library. Assert the response status code is 200. Links returning 4xx or 5xx are broken. For Playwright, use page.request.get(url) and assert response.ok() is true.",
    },
    {
      q: "How do I get the href attribute of a link in Playwright or Selenium?",
      a: "In Selenium: String href = element.getAttribute('href'). In Playwright: const href = await page.getAttribute('[data-testid=\"link-external-selenium\"]', 'href'). Always read href before clicking — after navigation the element reference becomes stale in Selenium and you'll get a StaleElementReferenceException.",
    },
    {
      q: "How do I click an image link in Selenium WebDriver?",
      a: "Image links are anchor elements wrapping an img tag. Locate the parent anchor by data-testid, id, or by finding the img and calling .findElement(By.xpath('..')). Example: driver.findElement(By.id('link-image-ironman')).click(). In Playwright: page.click('[data-testid=\"link-image-ironman\"]').",
    },
    {
      q: "How do I assert HTTP status codes from API links in automation testing?",
      a: "In Playwright, intercept the response directly: page.on('response', response => { if (response.url().includes('api/users')) expect(response.status()).toBe(201); }); In Selenium (Java), use RestAssured or Java's HttpURLConnection to make the request separately and assert the status code. The API Status Code Links section on this page triggers real HTTP requests you can intercept in your tests.",
    },
  ],

  "multi-select": [
    {
      q: "How do I select multiple options from a native HTML multi-select in Selenium?",
      a: "Wrap the element with the Select class: Select select = new Select(driver.findElement(By.id('fruitMultiSelect'))). Then call selectByVisibleText() or selectByValue() for each option. To select non-contiguous options programmatically, use selectByVisibleText() repeatedly — Selenium handles the Ctrl+click internally. To get all selected options: select.getAllSelectedOptions().",
    },
    {
      q: "How do I select multiple values in a multi-select with Playwright?",
      a: "Use page.selectOption('selector', ['value1', 'value2', 'value3']) — pass an array of values, labels, or indices. Example: page.selectOption('#fruitMultiSelect', ['apple', 'banana']). To assert: await expect(page.locator('#fruitMultiSelect')).toHaveValues(['apple', 'banana']). This works only on native <select multiple> elements.",
    },
    {
      q: "How do I automate checkbox-based multi-select components in Selenium or Playwright?",
      a: "Checkboxes are individual input[type='checkbox'] elements — locate each by data-testid or id and call click() if not already checked. In Selenium: if (!checkbox.isSelected()) checkbox.click(). In Playwright: await page.check('[data-testid=\"tech-checkbox-react\"]') or await expect(locator).toBeChecked(). For chip/tag-based selects, treat each tag button as a clickable element.",
    },
  ],

  "file-upload": [
    {
      q: "How do I upload a file using Selenium WebDriver?",
      a: "Locate the file input (input[type='file']) and call sendKeys() with the absolute file path: driver.findElement(By.id('file-Upload')).sendKeys('/absolute/path/to/file.txt'). Do NOT click() the input first — sendKeys() handles the dialog automatically. On remote WebDriver, use setFileDetector: ((RemoteWebDriver) driver).setFileDetector(new LocalFileDetector()).",
    },
    {
      q: "How do I upload a file in Playwright?",
      a: "Use page.setInputFiles('selector', '/path/to/file.txt') or locator.setInputFiles(). You can also pass multiple files: page.setInputFiles('input[type=\"file\"]', ['file1.txt', 'file2.txt']). Playwright handles file dialogs automatically without needing to interact with OS-level dialogs. To clear a selection: page.setInputFiles('selector', []).",
    },
    {
      q: "How do I verify a file download was triggered in Playwright?",
      a: "Listen for the download event before clicking: const [download] = await Promise.all([page.waitForEvent('download'), page.click('[data-testid=\"btn-download-pdf\"]')]). Then use download.path() to get the local path or download.saveAs('./downloads/file.pdf'). In Selenium, configure ChromeOptions to set the download directory: options.addUserDataDir() or use the experimental prefs map.",
    },
  ],

  "dynamic-waits": [
    {
      q: "What is the difference between implicit wait and explicit wait in Selenium?",
      a: "Implicit wait sets a global timeout for finding elements: driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10)). It applies to every findElement call. Explicit wait waits for a specific condition: new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.visibilityOf(element)). Explicit waits are preferred because they target exact conditions, making tests faster and more reliable. Never mix both in the same test — it causes unpredictable wait times.",
    },
    {
      q: "How does Playwright handle waits differently from Selenium?",
      a: "Playwright has built-in auto-waiting — before every action (click, fill, etc.) it waits for the element to be visible, stable, and enabled. You rarely need explicit waits. For specific conditions use: page.waitForSelector('selector', { state: 'visible' }), page.waitForTimeout(ms) (sparingly), or expect(locator).toBeVisible(). For network: page.waitForResponse() or page.waitForLoadState('networkidle').",
    },
    {
      q: "How do I wait for a spinner or loading indicator to disappear in automation?",
      a: "In Selenium: wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id('spinner'))). In Playwright: await page.waitForSelector('[data-testid=\"spinner\"]', { state: 'hidden' }) or await page.waitForSelector('[data-testid=\"spinner\"]', { state: 'detached' }). Always wait for the spinner to disappear before asserting page content — interacting while the page is loading leads to StaleElementReferenceException in Selenium or timing failures in Playwright.",
    },
  ],

  "tabs-windows": [
    {
      q: "How do I switch between browser windows or tabs in Selenium WebDriver?",
      a: "Use driver.getWindowHandles() to get a Set of all open window handles, then driver.switchTo().window(handle) to focus on a specific one. Always store the parent handle before opening new windows: String parent = driver.getWindowHandle(). After switching, call driver.switchTo().window(parent) to return. In Playwright, use context.pages() which returns an array of all open pages.",
    },
    {
      q: "How do I wait for a new tab or popup to open in Playwright?",
      a: "Use context.waitForEvent('page') alongside the click that triggers the new tab: const [newPage] = await Promise.all([context.waitForEvent('page'), page.click('selector')]). This ensures you capture the new page reference the moment it opens. Then call await newPage.waitForLoadState() before interacting with its content.",
    },
    {
      q: "How do I close a specific tab and switch back to the parent in Selenium?",
      a: "After switching to the child tab, call driver.close() to close only that tab. Then switch back to the parent: driver.switchTo().window(parentHandle). Never call driver.quit() here — that closes the entire browser. In Playwright, call newPage.close() on the page object and the original page remains active automatically.",
    },
  ],

  "date-picker": [
    {
      q: "How do I fill a date input field using Selenium WebDriver?",
      a: "Use sendKeys() with the date in YYYY-MM-DD format for <input type='date'> elements: element.sendKeys('2024-03-28'). If sendKeys doesn't work due to browser locale handling, use JavascriptExecutor: ((JavascriptExecutor) driver).executeScript(\"arguments[0].value='2024-03-28';\", element). Always verify the value with getAttribute('value') after setting it.",
    },
    {
      q: "How do I set a date value in Playwright?",
      a: "Use page.fill('selector', '2024-03-28') for <input type='date'> elements — Playwright automatically clears and fills the value. Alternatively use page.locator('selector').fill('2024-03-28'). To verify: await expect(page.locator('selector')).toHaveValue('2024-03-28'). The date must be in YYYY-MM-DD format regardless of the browser's display locale.",
    },
    {
      q: "How do I verify that a date input enforces min and max date constraints in automation?",
      a: "Read the min and max attributes: element.getAttribute('min') and element.getAttribute('max') in Selenium; page.getAttribute('selector', 'min') in Playwright. To assert the constraint is present: expect(locator).toHaveAttribute('min', '2024-01-01'). Note that HTML5 date constraints are enforced by the browser UI but not always by sendKeys — use getAttribute('validity') or check the value is clamped after input.",
    },
  ],

  "data-table": [
    {
      q: "How do I read all rows from an HTML table in Selenium WebDriver?",
      a: "Use driver.findElements(By.cssSelector('table tbody tr')) to get a list of all row elements. Then iterate over each row and call findElements(By.tagName('td')) to access individual cells. Example: List<WebElement> rows = driver.findElements(By.cssSelector('tbody tr')); for (WebElement row : rows) { List<WebElement> cells = row.findElements(By.tagName('td')); }",
    },
    {
      q: "How do I locate a specific cell in an HTML table using XPath in Selenium?",
      a: "Use XPath row/column indexing: driver.findElement(By.xpath('(//tbody/tr)[2]/td[3]')).getText() reads the 3rd cell of the 2nd row. To find a row by cell content: driver.findElement(By.xpath(\"//tbody/tr[td[text()='BookTitle']]\")). In Playwright: page.locator('tbody tr').nth(1).locator('td').nth(2).textContent().",
    },
    {
      q: "How do I verify the number of rows in a data table in Playwright?",
      a: "Use await expect(page.locator('tbody tr')).toHaveCount(10) to assert an exact count. For a minimum count assertion: const count = await page.locator('tbody tr').count(); expect(count).toBeGreaterThan(0). This is useful for verifying that an API-driven table has loaded its data before running further assertions.",
    },
    {
      q: "How do I wait for a dynamically loaded table to finish rendering in automation?",
      a: "In Playwright, use page.waitForSelector('tbody tr') which resolves when at least one row appears. In Selenium, use WebDriverWait: new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.presenceOfElementLocated(By.cssSelector('tbody tr'))). For API-driven tables like this one (fakerapi), always wait for a row to be present before asserting counts or cell values.",
    },
    {
      q: "How do I filter table rows by text content in Playwright?",
      a: "Use the filter option on a locator: page.locator('tbody tr').filter({ hasText: 'Fantasy' }) returns all rows containing the text 'Fantasy'. You can then assert the count or read specific cells from filtered rows. In Selenium, use XPath: driver.findElements(By.xpath(\"//tbody/tr[td[contains(text(),'Fantasy')]]\")).",
    },
  ],
};
