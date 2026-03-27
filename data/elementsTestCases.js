// ─── Dropdowns / Select ──────────────────────────────────────────────────────

export const dropdownTC = [
  {
    TestId: "TC01",
    TestCaseName: "Select 'Apple' from fruit dropdown by visible text",
    steps: [
      "Navigate to /practice/dropdowns",
      "Locate the fruit dropdown using id='dropdown-fruit' or data-testid='dropdown-fruit'",
      "In Selenium: wrap with Select class → selectByVisibleText('Apple')",
      "In Playwright: use page.selectOption('#dropdown-fruit', { label: 'Apple' })",
      "Assert the dropdown now shows 'Apple' as the selected value",
    ],
  },
  {
    TestId: "TC02",
    TestCaseName: "Select 'India' from country dropdown by value attribute",
    steps: [
      "Navigate to /practice/dropdowns",
      "Locate the country dropdown using id='dropdown-country' or data-testid='dropdown-country'",
      "In Selenium: wrap with Select class → selectByValue('india')",
      "In Playwright: use page.selectOption('#dropdown-country', 'india')",
      "Assert the selected option text is 'India'",
    ],
  },
  {
    TestId: "TC03",
    TestCaseName: "Verify selected value is displayed after selection",
    steps: [
      "Navigate to /practice/dropdowns",
      "Select 'Banana' from the fruit dropdown",
      "Locate the result display element below the dropdown (data-testid='result-fruit')",
      "Assert the result element text contains 'Banana'",
    ],
  },
  {
    TestId: "TC04",
    TestCaseName: "Get all available options from the programming language dropdown",
    steps: [
      "Navigate to /practice/dropdowns",
      "Locate the language dropdown using data-testid='dropdown-language'",
      "In Selenium: Select.getOptions() — assert size is 3",
      "In Playwright: page.locator('#dropdown-language option').allInnerTexts()",
      "Assert the returned list contains: Python, Java, JavaScript",
    ],
  },
  {
    TestId: "TC05",
    TestCaseName: "Select the last option from the programming language dropdown",
    steps: [
      "Navigate to /practice/dropdowns",
      "Locate the language dropdown using data-testid='dropdown-language'",
      "In Selenium: get all options with getOptions(); click the last one",
      "In Playwright: const opts = await page.locator('#dropdown-language option').all(); await opts[opts.length - 1].click()",
      "Assert the last option ('JavaScript') is now selected",
    ],
  },
  {
    TestId: "TC06",
    TestCaseName: "Multi-select: select multiple superheroes using CTRL+click",
    steps: [
      "Navigate to /practice/dropdowns",
      "Locate the multi-select element using data-testid='dropdown-heroes'",
      "In Selenium: Select heroes = new Select(element); heroes.selectByVisibleText('Ant-Man'); heroes.selectByVisibleText('Batman')",
      "In Playwright: page.selectOption('#dropdown-heroes', ['ant-man', 'batman'])",
      "Assert getAllSelectedOptions() returns 2 items: Ant-Man and Batman",
    ],
  },
  {
    TestId: "TC07",
    TestCaseName: "Multi-select: deselect a previously selected option",
    steps: [
      "Navigate to /practice/dropdowns",
      "Select 'Ant-Man' and 'Aquaman' from the heroes multi-select",
      "In Selenium: Select.deselectByVisibleText('Ant-Man')",
      "In Playwright: hold Ctrl and click 'Ant-Man' again to deselect, or re-selectOption with only 'aquaman'",
      "Assert getAllSelectedOptions() now contains only 'Aquaman'",
    ],
  },
  {
    TestId: "TC08",
    TestCaseName: "Verify default placeholder text before any selection",
    steps: [
      "Navigate to /practice/dropdowns",
      "Locate the fruit dropdown before interacting with it",
      "Assert the trigger/placeholder text reads 'Select Fruit'",
      "In Playwright: await expect(page.locator('[data-testid=\"dropdown-fruit\"]')).toHaveText('Select Fruit')",
    ],
  },
  {
    TestId: "TC09",
    TestCaseName: "Verify a dropdown is enabled and interactable",
    steps: [
      "Navigate to /practice/dropdowns",
      "Locate the country dropdown using data-testid='dropdown-country'",
      "In Selenium: assert element.isEnabled() returns true",
      "In Playwright: assert await page.isDisabled('[data-testid=\"dropdown-country\"]') returns false",
      "Attempt to select an option and assert it succeeds without error",
    ],
  },
  {
    TestId: "TC10",
    TestCaseName: "Verify the total count of options in the country dropdown",
    steps: [
      "Navigate to /practice/dropdowns",
      "Locate the country dropdown using data-testid='dropdown-country'",
      "In Selenium: assert Select.getOptions().size() equals 4",
      "In Playwright: await expect(page.locator('#dropdown-country option')).toHaveCount(4)",
      "Assert all four country names are present: India, USA, UK, Argentina",
    ],
  },
];

// ─── Alerts & Dialogs ────────────────────────────────────────────────────────

export const alertTC = [
  {
    TestId: "TC01",
    TestCaseName: "Accept a simple browser alert and verify it closes",
    steps: [
      "Navigate to /practice/alerts-dialogs",
      "Set up an alert listener before clicking: page.on('dialog', d => d.accept()) in Playwright",
      "Click the 'Simple Alert' button using data-testid='btn-simple-alert'",
      "In Selenium: driver.switchTo().alert().accept()",
      "Assert the alert is dismissed and the page remains interactive",
    ],
  },
  {
    TestId: "TC02",
    TestCaseName: "Get text from a simple browser alert before accepting",
    steps: [
      "Navigate to /practice/alerts-dialogs",
      "In Playwright: page.on('dialog', async d => { expect(d.message()).toBe('Welcome to QA PlayGround!'); await d.accept(); })",
      "Click the 'Simple Alert' button",
      "In Selenium: String alertText = driver.switchTo().alert().getText(); assert alertText.equals('Welcome to QA PlayGround!')",
      "Accept the alert after reading the text",
    ],
  },
  {
    TestId: "TC03",
    TestCaseName: "Accept a confirm dialog and verify accepted state",
    steps: [
      "Navigate to /practice/alerts-dialogs",
      "In Playwright: page.on('dialog', d => d.accept())",
      "Click the 'Confirm Alert' button using data-testid='btn-confirm-alert'",
      "In Selenium: driver.switchTo().alert().accept()",
      "Assert the result display shows 'Accepted'",
    ],
  },
  {
    TestId: "TC04",
    TestCaseName: "Dismiss a confirm dialog and verify dismissed state",
    steps: [
      "Navigate to /practice/alerts-dialogs",
      "In Playwright: page.on('dialog', d => d.dismiss())",
      "Click the 'Confirm Alert' button",
      "In Selenium: driver.switchTo().alert().dismiss()",
      "Assert the result display shows 'Dismissed'",
    ],
  },
  {
    TestId: "TC05",
    TestCaseName: "Enter text in a prompt dialog and accept it",
    steps: [
      "Navigate to /practice/alerts-dialogs",
      "In Playwright: page.on('dialog', d => d.accept('John Doe'))",
      "Click the 'Prompt Alert' button using data-testid='btn-prompt-alert'",
      "In Selenium: Alert prompt = driver.switchTo().alert(); prompt.sendKeys('John Doe'); prompt.accept()",
      "Assert the prompt result display shows 'Your name is - John Doe'",
    ],
  },
  {
    TestId: "TC06",
    TestCaseName: "Dismiss a prompt dialog and verify no input is captured",
    steps: [
      "Navigate to /practice/alerts-dialogs",
      "In Playwright: page.on('dialog', d => d.dismiss())",
      "Click the 'Prompt Alert' button",
      "In Selenium: driver.switchTo().alert().dismiss()",
      "Assert the prompt result display is empty or not visible",
    ],
  },
  {
    TestId: "TC07",
    TestCaseName: "Verify toast notification appears after triggering",
    steps: [
      "Navigate to /practice/alerts-dialogs",
      "Click the 'Toast Alert' button using data-testid='btn-toast-alert'",
      "Wait for the toast element to appear in the DOM",
      "In Playwright: await expect(page.locator('[data-sonner-toast]')).toBeVisible()",
      "Assert the toast text contains 'This is simple toast'",
    ],
  },
  {
    TestId: "TC08",
    TestCaseName: "Close a modal/sweet alert using the Cancel button",
    steps: [
      "Navigate to /practice/alerts-dialogs",
      "Click the 'Sweet Alert' button using data-testid='btn-modal-alert'",
      "Wait for the modal dialog to appear",
      "Click the 'You Are!' cancel button inside the modal",
      "Assert the modal is no longer visible",
    ],
  },
  {
    TestId: "TC09",
    TestCaseName: "Close an advanced dialog using the Close button",
    steps: [
      "Navigate to /practice/alerts-dialogs",
      "Click the 'Share' button using data-testid='btn-dialog-share'",
      "Wait for the dialog to open and assert the link input is visible",
      "Assert the input value contains 'qaplayground.com/practice/alerts-dialogs'",
      "Click the 'Close' button and assert the dialog is dismissed",
    ],
  },
  {
    TestId: "TC10",
    TestCaseName: "Verify alerts page loads without errors",
    steps: [
      "Navigate to /practice/alerts-dialogs",
      "Assert HTTP 200 response",
      "Assert no JS console errors are present",
      "Assert all 6 alert trigger buttons are visible in the DOM",
    ],
  },
];

// ─── Radio & Checkbox ────────────────────────────────────────────────────────

export const radioBoxTC = [
  {
    TestId: "TC01",
    TestCaseName: "Verify radio button is selected on click",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Locate the first radio button using its data-testid or id",
      "Click the radio button",
      "Assert the radio button is now selected (isSelected() / isChecked())",
    ],
  },
  {
    TestId: "TC02",
    TestCaseName: "Verify selecting another radio deselects the previous one",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Click the first radio button and assert it is selected",
      "Click the second radio button",
      "Assert the first radio button is now deselected",
      "Assert the second radio button is now selected",
    ],
  },
  {
    TestId: "TC03",
    TestCaseName: "Verify only one radio button can be selected at a time",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Click each radio button in the group one by one",
      "After each click assert only the clicked radio is selected",
      "Assert all others are deselected",
    ],
  },
  {
    TestId: "TC04",
    TestCaseName: "Verify radio button label text is correct",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Locate each radio button label",
      "Assert the label text matches the expected value for each option",
    ],
  },
  {
    TestId: "TC05",
    TestCaseName: "Verify radio button state persists after page interaction",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Select a radio button",
      "Interact with other elements on the page",
      "Assert the originally selected radio button is still selected",
    ],
  },
  {
    TestId: "TC06",
    TestCaseName: "Verify checkbox can be checked",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Locate a checkbox using its data-testid or id",
      "Click the checkbox to check it",
      "Assert isSelected() or isChecked() returns true",
    ],
  },
  {
    TestId: "TC07",
    TestCaseName: "Verify checkbox can be unchecked",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Locate a checked checkbox",
      "Click the checkbox to uncheck it",
      "Assert isSelected() or isChecked() returns false",
    ],
  },
  {
    TestId: "TC08",
    TestCaseName: "Verify multiple checkboxes can be selected simultaneously",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Click the first checkbox and assert it is checked",
      "Click the second checkbox and assert it is checked",
      "Assert both checkboxes remain checked at the same time",
    ],
  },
  {
    TestId: "TC09",
    TestCaseName: "Verify radio buttons are keyboard navigable",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Tab to the radio button group",
      "Use arrow keys to navigate between options",
      "Assert each focused radio button is selected on focus",
    ],
  },
  {
    TestId: "TC10",
    TestCaseName: "Verify checkbox is keyboard togglable",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Tab to a checkbox element",
      "Press Space to check it",
      "Assert the checkbox is now checked",
      "Press Space again and assert it is unchecked",
    ],
  },
  {
    TestId: "TC11",
    TestCaseName: "Verify disabled radio button cannot be selected",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Locate a disabled radio button",
      "Attempt to click the disabled radio button",
      "Assert the radio button remains unselected",
      "Assert isEnabled() returns false",
    ],
  },
  {
    TestId: "TC12",
    TestCaseName: "Verify disabled checkbox cannot be toggled",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Locate a disabled checkbox",
      "Attempt to click the disabled checkbox",
      "Assert the checkbox state does not change",
    ],
  },
  {
    TestId: "TC13",
    TestCaseName: "Verify radio button group is accessible to screen readers",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Verify each radio button has an associated label (for/id linkage)",
      "Verify the radio group has a fieldset and legend or aria-label",
      "Assert aria-checked attribute reflects current selection state",
    ],
  },
  {
    TestId: "TC14",
    TestCaseName: "Verify radio button visual state changes on selection",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Observe unselected radio button appearance",
      "Click the radio button",
      "Assert the visual indicator (filled circle) appears",
    ],
  },
  {
    TestId: "TC15",
    TestCaseName: "Verify radio and checkbox elements load without errors",
    steps: [
      "Navigate to /practice/radio-checkbox",
      "Assert the page loads with HTTP 200 status",
      "Assert no console errors are present",
      "Assert all radio buttons and checkboxes are visible on the page",
    ],
  },
];

// ─── Buttons ─────────────────────────────────────────────────────────────────

export const buttonTC = [
  {
    TestId: "TC01",
    TestCaseName: "Verify button is clickable and triggers action",
    steps: [
      "Navigate to /practice/buttons",
      "Locate the primary button using data-testid or id",
      "Click the button using click() or locator.click()",
      "Assert the expected action or message appears after click",
    ],
  },
  {
    TestId: "TC02",
    TestCaseName: "Verify button displays the correct label text",
    steps: [
      "Navigate to /practice/buttons",
      "Locate the button element",
      "Read the button text using getText() or textContent()",
      "Assert the text matches the expected label",
    ],
  },
  {
    TestId: "TC03",
    TestCaseName: "Verify button triggers the correct action on click",
    steps: [
      "Navigate to /practice/buttons",
      "Identify the expected result of clicking the button",
      "Click the button",
      "Assert the resulting state or message matches expectation",
    ],
  },
  {
    TestId: "TC04",
    TestCaseName: "Verify double-click button triggers double-click action",
    steps: [
      "Navigate to /practice/buttons",
      "Locate the double-click button using data-testid",
      "Perform a double-click using doubleClick() or dblclick()",
      "Assert the double-click message or state change appears",
    ],
  },
  {
    TestId: "TC05",
    TestCaseName: "Verify right-click button triggers context menu action",
    steps: [
      "Navigate to /practice/buttons",
      "Locate the right-click button using data-testid",
      "Perform a right-click using contextClick() or click({button:'right'})",
      "Assert the right-click feedback message appears",
    ],
  },
  {
    TestId: "TC06",
    TestCaseName: "Verify disabled button cannot be clicked",
    steps: [
      "Navigate to /practice/buttons",
      "Locate the disabled button",
      "Assert isEnabled() returns false (Selenium) or toBeDisabled() passes (Playwright)",
      "Attempt to click the button",
      "Assert no action is triggered",
    ],
  },
  {
    TestId: "TC07",
    TestCaseName: "Verify button is enabled when it should be",
    steps: [
      "Navigate to /practice/buttons",
      "Locate an active button",
      "Assert isEnabled() returns true",
      "Assert the button does not have the disabled attribute",
    ],
  },
  {
    TestId: "TC08",
    TestCaseName: "Verify button is responsive on different screen sizes",
    steps: [
      "Navigate to /practice/buttons",
      "Resize the browser to mobile viewport (375px)",
      "Assert the button is fully visible and not cut off",
      "Assert the button is still clickable at mobile size",
    ],
  },
  {
    TestId: "TC09",
    TestCaseName: "Verify button is accessible via keyboard",
    steps: [
      "Navigate to /practice/buttons",
      "Tab to the button element",
      "Press Enter or Space to activate the button",
      "Assert the button action fires correctly",
    ],
  },
  {
    TestId: "TC10",
    TestCaseName: "Verify button is accessible to screen readers",
    steps: [
      "Navigate to /practice/buttons",
      "Assert each button has a text label or aria-label",
      "Assert role='button' is present or the element is a native button",
    ],
  },
  {
    TestId: "TC11",
    TestCaseName: "Verify button hover state is visually distinct",
    steps: [
      "Navigate to /practice/buttons",
      "Hover over the button using Actions.moveToElement() or locator.hover()",
      "Assert the button CSS changes (e.g. background color or shadow)",
    ],
  },
  {
    TestId: "TC12",
    TestCaseName: "Verify button state resets after page refresh",
    steps: [
      "Navigate to /practice/buttons",
      "Click a button that changes state",
      "Refresh the page",
      "Assert the button returns to its default state",
    ],
  },
  {
    TestId: "TC13",
    TestCaseName: "Verify button does not overlap other page elements",
    steps: [
      "Navigate to /practice/buttons",
      "Assert each button bounding box does not intersect with adjacent elements",
    ],
  },
  {
    TestId: "TC14",
    TestCaseName: "Verify button styling matches design specification",
    steps: [
      "Navigate to /practice/buttons",
      "Assert the button background color matches the expected value",
      "Assert the button font size and weight are correct",
      "Assert border-radius and padding match the design",
    ],
  },
  {
    TestId: "TC15",
    TestCaseName: "Verify button page loads without errors",
    steps: [
      "Navigate to /practice/buttons",
      "Assert the page loads successfully (HTTP 200)",
      "Assert no JS console errors are present",
      "Assert all buttons are visible in the DOM",
    ],
  },
];

// ─── Links ───────────────────────────────────────────────────────────────────

export const linksTC = [
  {
    TestId: "TC01",
    TestCaseName: "Verify link navigates to the correct URL on click",
    steps: [
      "Navigate to /practice/links",
      "Locate a link element using its text or data-testid",
      "Click the link",
      "Assert the current URL matches the expected destination",
    ],
  },
  {
    TestId: "TC02",
    TestCaseName: "Verify link text matches expected label",
    steps: [
      "Navigate to /practice/links",
      "Locate the link element",
      "Read link text using getText() or textContent()",
      "Assert the text equals the expected value",
    ],
  },
  {
    TestId: "TC03",
    TestCaseName: "Verify external link opens in a new tab",
    steps: [
      "Navigate to /practice/links",
      "Locate an external link (target='_blank')",
      "Assert the link has target='_blank' and rel='noopener noreferrer'",
      "Click the link and switch to the new window handle",
      "Assert the new tab URL matches the expected external URL",
    ],
  },
  {
    TestId: "TC04",
    TestCaseName: "Verify internal link stays in the same tab",
    steps: [
      "Navigate to /practice/links",
      "Locate an internal link (no target='_blank')",
      "Record the current window handle count",
      "Click the link",
      "Assert no new window or tab was opened",
      "Assert the browser URL changed to the expected internal path",
    ],
  },
  {
    TestId: "TC05",
    TestCaseName: "Verify broken link returns HTTP error status",
    steps: [
      "Navigate to /practice/links",
      "Locate a link marked as broken or invalid",
      "Send an HTTP GET request to the link's href",
      "Assert the response status is 404 or another error code",
    ],
  },
  {
    TestId: "TC06",
    TestCaseName: "Verify link is keyboard accessible",
    steps: [
      "Navigate to /practice/links",
      "Tab to the link element",
      "Assert the link receives focus and a visible focus ring appears",
      "Press Enter to activate the link",
      "Assert navigation occurs as expected",
    ],
  },
  {
    TestId: "TC07",
    TestCaseName: "Verify link href attribute contains the correct URL",
    steps: [
      "Navigate to /practice/links",
      "Locate the link element",
      "Read the href attribute using getAttribute('href')",
      "Assert the value matches the expected URL or path",
    ],
  },
  {
    TestId: "TC08",
    TestCaseName: "Verify link has accessible label for screen readers",
    steps: [
      "Navigate to /practice/links",
      "Locate each link element",
      "Assert each link has descriptive text or an aria-label",
      "Assert no link text is ambiguous (e.g. 'click here', 'read more' alone)",
    ],
  },
  {
    TestId: "TC09",
    TestCaseName: "Verify link hover state is visually distinct",
    steps: [
      "Navigate to /practice/links",
      "Hover over a link",
      "Assert an underline or color change appears on hover",
    ],
  },
  {
    TestId: "TC10",
    TestCaseName: "Verify right-click on link shows browser context menu",
    steps: [
      "Navigate to /practice/links",
      "Right-click a standard anchor link",
      "Assert the browser context menu appears with 'Open in new tab' option",
    ],
  },
  {
    TestId: "TC11",
    TestCaseName: "Verify link with dynamic URL resolves correctly",
    steps: [
      "Navigate to /practice/links",
      "Locate a link whose URL is generated dynamically",
      "Read the href attribute",
      "Assert the full URL is valid and matches the expected pattern",
    ],
  },
  {
    TestId: "TC12",
    TestCaseName: "Verify link page loads without console errors",
    steps: [
      "Navigate to /practice/links",
      "Assert the page loads with HTTP 200",
      "Assert no JS console errors are present",
      "Assert all link elements are visible and clickable",
    ],
  },
];

// ─── File Upload ──────────────────────────────────────────────────────────────

export const fileUploadTC = [
  {
    TestId: "TC01",
    TestCaseName: "Verify a file can be selected for upload",
    steps: [
      "Navigate to /practice/file-upload",
      "Locate the file input element using data-testid or id",
      "Use sendKeys('/path/to/file.txt') or setInputFiles() to select a file",
      "Assert the file name appears in the upload field or label",
    ],
  },
  {
    TestId: "TC02",
    TestCaseName: "Verify selected file name is displayed after selection",
    steps: [
      "Navigate to /practice/file-upload",
      "Select a file using the file input",
      "Assert the displayed file name matches the selected file",
    ],
  },
  {
    TestId: "TC03",
    TestCaseName: "Verify upload button is enabled after file selection",
    steps: [
      "Navigate to /practice/file-upload",
      "Assert the upload button is initially disabled or absent",
      "Select a file",
      "Assert the upload button is now enabled",
    ],
  },
  {
    TestId: "TC04",
    TestCaseName: "Verify file upload starts on clicking upload button",
    steps: [
      "Navigate to /practice/file-upload",
      "Select a valid file",
      "Click the upload button",
      "Assert upload progress indicator or success state appears",
    ],
  },
  {
    TestId: "TC05",
    TestCaseName: "Verify success message appears after upload",
    steps: [
      "Navigate to /practice/file-upload",
      "Select a valid file and click upload",
      "Wait for the upload to complete",
      "Assert a success message or confirmation is visible",
    ],
  },
  {
    TestId: "TC06",
    TestCaseName: "Verify error message for unsupported file type",
    steps: [
      "Navigate to /practice/file-upload",
      "Select a file with an unsupported extension (e.g. .exe)",
      "Attempt to upload",
      "Assert an error message about unsupported file type appears",
    ],
  },
  {
    TestId: "TC07",
    TestCaseName: "Verify error message for files exceeding size limit",
    steps: [
      "Navigate to /practice/file-upload",
      "Select a file larger than the allowed size limit",
      "Attempt to upload",
      "Assert an error message about file size appears",
    ],
  },
  {
    TestId: "TC08",
    TestCaseName: "Verify uploaded file appears in the file list",
    steps: [
      "Navigate to /practice/file-upload",
      "Upload a valid file",
      "After upload succeeds assert the file name appears in the file list",
    ],
  },
  {
    TestId: "TC09",
    TestCaseName: "Verify file upload can be cancelled",
    steps: [
      "Navigate to /practice/file-upload",
      "Select a file and begin upload",
      "Click the cancel button if available during upload",
      "Assert the upload is stopped and the field is reset",
    ],
  },
  {
    TestId: "TC10",
    TestCaseName: "Verify multiple files can be selected when allowed",
    steps: [
      "Navigate to /practice/file-upload",
      "Locate a file input that accepts multiple files",
      "Select two or more files using setInputFiles([file1, file2])",
      "Assert both file names are displayed",
    ],
  },
  {
    TestId: "TC11",
    TestCaseName: "Verify file input accepts only allowed extensions",
    steps: [
      "Navigate to /practice/file-upload",
      "Read the accept attribute of the file input",
      "Assert it contains only the expected file types",
    ],
  },
  {
    TestId: "TC12",
    TestCaseName: "Verify file upload is responsive on mobile viewport",
    steps: [
      "Navigate to /practice/file-upload at 375px width",
      "Assert the upload control is fully visible and usable",
      "Select and upload a file",
      "Assert the success state is visible without horizontal scroll",
    ],
  },
  {
    TestId: "TC13",
    TestCaseName: "Verify file upload is accessible via keyboard",
    steps: [
      "Navigate to /practice/file-upload",
      "Tab to the file input",
      "Press Enter or Space to open the file dialog",
      "Assert the file dialog opens",
    ],
  },
  {
    TestId: "TC14",
    TestCaseName: "Verify file upload component has accessible label",
    steps: [
      "Navigate to /practice/file-upload",
      "Assert the file input has an associated label or aria-label",
      "Assert screen readers can identify the upload control",
    ],
  },
  {
    TestId: "TC15",
    TestCaseName: "Verify file upload page loads without errors",
    steps: [
      "Navigate to /practice/file-upload",
      "Assert HTTP 200 response",
      "Assert no JS console errors are present",
      "Assert the upload input element is visible in the DOM",
    ],
  },
];

// ─── File Download ────────────────────────────────────────────────────────────

export const fileDownloadTC = [
  {
    TestId: "TC01",
    TestCaseName: "Verify download starts on clicking the download button",
    steps: [
      "Navigate to /practice/file-upload (download section)",
      "Locate the download button using data-testid or id",
      "Set up download listener or configure download directory",
      "Click the download button",
      "Assert the file is saved in the expected directory",
    ],
  },
  {
    TestId: "TC02",
    TestCaseName: "Verify downloaded file name matches expected value",
    steps: [
      "Navigate to the file download section",
      "Click the download button",
      "Assert the downloaded file name matches the expected filename",
    ],
  },
  {
    TestId: "TC03",
    TestCaseName: "Verify downloaded file is not empty",
    steps: [
      "Navigate to the file download section",
      "Click the download button",
      "Read the downloaded file",
      "Assert the file size is greater than 0 bytes",
    ],
  },
  {
    TestId: "TC04",
    TestCaseName: "Verify downloaded file content matches expected data",
    steps: [
      "Navigate to the file download section",
      "Click the download button",
      "Read the file contents",
      "Assert the content matches the expected data or format",
    ],
  },
  {
    TestId: "TC05",
    TestCaseName: "Verify download button has accessible label",
    steps: [
      "Navigate to the file download section",
      "Assert the download button has descriptive text or aria-label",
      "Assert screen readers can identify the download action",
    ],
  },
  {
    TestId: "TC06",
    TestCaseName: "Verify download button is keyboard accessible",
    steps: [
      "Navigate to the file download section",
      "Tab to the download button",
      "Press Enter to trigger the download",
      "Assert the download starts",
    ],
  },
  {
    TestId: "TC07",
    TestCaseName: "Verify download link href attribute is correct",
    steps: [
      "Navigate to the file download section",
      "Read the href or download attribute of the download anchor",
      "Assert the URL or file path is valid and matches expected",
    ],
  },
  {
    TestId: "TC08",
    TestCaseName: "Verify download works on different browsers",
    steps: [
      "Run the download test on Chrome, Firefox, and Edge",
      "Assert the file downloads successfully on each browser",
      "Assert the file content is identical across browsers",
    ],
  },
  {
    TestId: "TC09",
    TestCaseName: "Verify download is responsive on mobile viewport",
    steps: [
      "Navigate to the download section at 375px width",
      "Assert the download button is visible and tappable",
      "Trigger a download and assert it initiates",
    ],
  },
  {
    TestId: "TC10",
    TestCaseName: "Verify multiple downloads can occur sequentially",
    steps: [
      "Navigate to the file download section",
      "Click the download button twice in sequence",
      "Assert two separate files are saved or the same file is overwritten",
    ],
  },
  {
    TestId: "TC11",
    TestCaseName: "Verify download does not navigate away from page",
    steps: [
      "Navigate to the file download section",
      "Click the download button",
      "Assert the page URL has not changed after the download triggers",
    ],
  },
  {
    TestId: "TC12",
    TestCaseName: "Verify download section is accessible via keyboard",
    steps: [
      "Navigate to /practice/file-upload",
      "Tab through the page to reach the download section",
      "Assert the download button receives visible focus",
    ],
  },
  {
    TestId: "TC13",
    TestCaseName: "Verify file download page loads without errors",
    steps: [
      "Navigate to /practice/file-upload",
      "Assert HTTP 200 response",
      "Assert no JS console errors are present",
      "Assert the download button is visible",
    ],
  },
  {
    TestId: "TC14",
    TestCaseName: "Verify download file type matches expected MIME type",
    steps: [
      "Navigate to the file download section",
      "Intercept the download network request",
      "Assert the Content-Type header matches the expected file type",
    ],
  },
];

// ─── Input Fields ─────────────────────────────────────────────────────────────

export const inputFieldTC = [
  {
    TestId: "TC01",
    TestCaseName: "Verify successful movie name input",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the movie name input using data-testid='input-movie-name'",
      "Type a valid movie name e.g. 'Inception' using sendKeys() or fill()",
      "Read the input value using getAttribute('value') or inputValue()",
      "Assert the returned value equals 'Inception'",
    ],
  },
  {
    TestId: "TC02",
    TestCaseName: "Verify input placeholder disappears on typing",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the movie name input using data-testid='input-movie-name'",
      "Verify placeholder text 'Enter hollywood movie name' is visible",
      "Type any text into the input field",
      "Assert the placeholder text is no longer visible",
    ],
  },
  {
    TestId: "TC03",
    TestCaseName: "Verify keyboard tab triggers focus change after append",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the append input using data-testid='input-append-text'",
      "Click the input to focus it",
      "Append text to the existing value 'I am good'",
      "Press Tab using Keys.TAB (Selenium) or press('Tab') (Playwright)",
      "Verify focus has shifted to the next focusable element",
    ],
  },
  {
    TestId: "TC04",
    TestCaseName: "Verify appended text value is retained in the field",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the append input using data-testid='input-append-text'",
      "Note the existing value 'I am good'",
      "Append additional text to the input",
      "Assert the input value contains both the original and appended text",
    ],
  },
  {
    TestId: "TC05",
    TestCaseName: "Verify text present inside input field matches expected value",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the verify text input using data-testid='input-verify-text'",
      "Read the current value of the input field",
      "Assert the value equals 'QA PlayGround'",
    ],
  },
  {
    TestId: "TC06",
    TestCaseName: "Verify getAttribute returns the correct input value",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the verify text input using data-testid='input-verify-text'",
      "Call getAttribute('value') on the input element",
      "Assert the returned string equals 'QA PlayGround'",
    ],
  },
  {
    TestId: "TC07",
    TestCaseName: "Verify input field text can be cleared successfully",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the clear text input using data-testid='input-clear-text'",
      "Verify the input contains the value 'QA PlayGround Clear Me'",
      "Call clear() (Selenium) or fill('') (Playwright) on the input",
      "Assert the input field is now empty",
    ],
  },
  {
    TestId: "TC08",
    TestCaseName: "Verify field is empty after executing clear action",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the clear text input using data-testid='input-clear-text'",
      "Execute clear action on the input field",
      "Assert getAttribute('value') returns an empty string",
      "Or assert inputValue() returns '' (Playwright)",
    ],
  },
  {
    TestId: "TC09",
    TestCaseName: "Verify disabled input field cannot be edited by user",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the disabled input using data-testid='input-disabled'",
      "Verify the input element has the disabled attribute",
      "Attempt to type text in the disabled field",
      "Assert the value remains 'Enter' unchanged",
    ],
  },
  {
    TestId: "TC10",
    TestCaseName: "Verify isEnabled() returns false for disabled input",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the disabled input using data-testid='input-disabled'",
      "Call isEnabled() on the element (Selenium)",
      "Assert the result is false",
      "Or use expect(locator).toBeDisabled() assertion (Playwright)",
    ],
  },
  {
    TestId: "TC11",
    TestCaseName: "Verify readonly input field does not accept user typing",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the readonly input using data-testid='input-readonly'",
      "Attempt to type text into the readonly field",
      "Assert the value remains 'This text is readonly' unchanged",
    ],
  },
  {
    TestId: "TC12",
    TestCaseName: "Verify getAttribute returns correct readonly attribute value",
    steps: [
      "Open browser and navigate to /practice/input-fields",
      "Locate the readonly input using data-testid='input-readonly'",
      "Call getAttribute('readonly') on the element (Selenium)",
      "Assert the attribute is present on the element",
      "Or use expect(locator).toHaveAttribute('readonly') (Playwright)",
    ],
  },
];
