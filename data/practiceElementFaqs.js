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
};
