// ─── Forms ────────────────────────────────────────────────────────────────────

export const formsTC = [
  {
    TestId: "TC01",
    TestCaseName: "Fill all fields with valid data and submit successfully",
    steps: [
      "Navigate to /practice/forms",
      "Fill input-first-name with 'John'",
      "Fill input-last-name with 'Doe'",
      "Fill input-email with 'john@example.com'",
      "Fill input-phone with '9876543210'",
      "Fill input-dob with a valid date",
      "Select radio-gender-male",
      "Select 'India' from select-country dropdown",
      "Fill input-city with 'Mumbai'",
      "Fill input-password with 'pass123'",
      "Fill input-confirm-password with 'pass123'",
      "Check checkbox-terms",
      "Click submit-form-btn",
      "Assert form-success-msg is visible",
    ],
  },
  {
    TestId: "TC02",
    TestCaseName: "Verify required field errors appear on empty submit",
    steps: [
      "Navigate to /practice/forms",
      "Leave all fields empty",
      "Click submit-form-btn",
      "Assert error-first-name is visible with required message",
      "Assert error-last-name is visible",
      "Assert error-email is visible",
      "Assert error-phone is visible",
      "Assert error-dob is visible",
      "Assert error-gender is visible",
      "Assert error-country is visible",
      "Assert error-city is visible",
      "Assert error-password is visible",
      "Assert error-confirm-password is visible",
      "Assert error-terms is visible",
    ],
  },
  {
    TestId: "TC03",
    TestCaseName: "Verify invalid email format shows validation error",
    steps: [
      "Navigate to /practice/forms",
      "Fill input-email with 'notanemail'",
      "Click submit-form-btn",
      "Assert error-email shows 'Enter a valid email address'",
    ],
  },
  {
    TestId: "TC04",
    TestCaseName: "Verify invalid phone number format shows error",
    steps: [
      "Navigate to /practice/forms",
      "Fill input-phone with '12345' (less than 10 digits)",
      "Click submit-form-btn",
      "Assert error-phone shows '10-digit phone number' message",
    ],
  },
  {
    TestId: "TC05",
    TestCaseName: "Verify password minimum length validation",
    steps: [
      "Navigate to /practice/forms",
      "Fill input-password with 'abc' (less than 6 characters)",
      "Click submit-form-btn",
      "Assert error-password shows 'at least 6 characters' message",
    ],
  },
  {
    TestId: "TC06",
    TestCaseName: "Verify password mismatch shows confirm password error",
    steps: [
      "Navigate to /practice/forms",
      "Fill input-password with 'pass123'",
      "Fill input-confirm-password with 'pass456'",
      "Click submit-form-btn",
      "Assert error-confirm-password shows 'Passwords do not match' message",
    ],
  },
  {
    TestId: "TC07",
    TestCaseName: "Verify T&C checkbox required error appears",
    steps: [
      "Navigate to /practice/forms",
      "Fill all required fields with valid data",
      "Leave checkbox-terms unchecked",
      "Click submit-form-btn",
      "Assert error-terms shows 'You must accept the terms' message",
    ],
  },
  {
    TestId: "TC08",
    TestCaseName: "Verify success message displays submitted name",
    steps: [
      "Navigate to /practice/forms",
      "Fill input-first-name with 'Jane'",
      "Fill input-last-name with 'Smith'",
      "Fill all other required fields with valid data",
      "Check checkbox-terms and click submit-form-btn",
      "Assert form-success-msg is visible",
      "Assert submitted-name text contains 'Jane Smith'",
    ],
  },
  {
    TestId: "TC09",
    TestCaseName: "Verify reset button clears all fields",
    steps: [
      "Navigate to /practice/forms",
      "Fill input-first-name with 'John'",
      "Fill input-email with 'john@example.com'",
      "Click reset-form-btn",
      "Assert input-first-name value is empty",
      "Assert input-email value is empty",
      "Assert no error messages are visible",
    ],
  },
  {
    TestId: "TC10",
    TestCaseName: "Verify gender radio button selection",
    steps: [
      "Navigate to /practice/forms",
      "Locate gender-group element",
      "Click radio-gender-female",
      "Assert radio-gender-female is selected (isSelected() / isChecked())",
      "Assert radio-gender-male and radio-gender-other are not selected",
    ],
  },
  {
    TestId: "TC11",
    TestCaseName: "Verify country dropdown selection",
    steps: [
      "Navigate to /practice/forms",
      "Locate select-country element",
      "Open the dropdown and select 'USA'",
      "Assert the displayed value is 'USA'",
    ],
  },
  {
    TestId: "TC12",
    TestCaseName: "Verify multiple interest checkboxes can be selected",
    steps: [
      "Navigate to /practice/forms",
      "Locate interests-group element",
      "Check checkbox-interest-selenium",
      "Check checkbox-interest-playwright",
      "Assert checkbox-interest-selenium is checked",
      "Assert checkbox-interest-playwright is checked",
      "Assert both remain checked simultaneously",
    ],
  },
  {
    TestId: "TC13",
    TestCaseName: "Verify form fields retain values after validation failure",
    steps: [
      "Navigate to /practice/forms",
      "Fill input-first-name with 'John'",
      "Fill input-email with 'john@example.com'",
      "Leave required fields empty and click submit-form-btn",
      "Assert input-first-name still shows 'John'",
      "Assert input-email still shows 'john@example.com'",
    ],
  },
  {
    TestId: "TC14",
    TestCaseName: "Verify Fill Again button returns to empty form from success state",
    steps: [
      "Navigate to /practice/forms",
      "Fill and submit the form successfully",
      "Assert form-success-msg is visible",
      "Click reset-form-btn (Fill Again)",
      "Assert user-registration-form is visible again",
      "Assert all fields are empty",
    ],
  },
  {
    TestId: "TC15",
    TestCaseName: "Verify form page loads without errors",
    steps: [
      "Navigate to /practice/forms",
      "Assert the page loads with HTTP 200 status",
      "Assert no JS console errors are present",
      "Assert user-registration-form is visible in the DOM",
      "Assert submit-form-btn and reset-form-btn are visible",
    ],
  },
];

// ─── Basic Details (Accordion) ────────────────────────────────────────────────

//basicDetailsTC TC
export const basicDetailsTC = [
  {
    TestId: "TC01",
    TestCaseName: "Verify that the accordion expands upon clicking a header",
  },
  {
    TestId: "TC02",
    TestCaseName:
      "Verify that the accordion collapses upon clicking an expanded header",
  },
  {
    TestId: "TC03",
    TestCaseName:
      "Verify that only one accordion section is expanded at a time",
  },
  {
    TestId: "TC04",
    TestCaseName: "Verify the content of each accordion section upon expansion",
  },
  {
    TestId: "TC05",
    TestCaseName:
      "Verify that the accordion retains its state after a page refresh",
  },
  {
    TestId: "TC06",
    TestCaseName:
      "Verify the responsiveness of the accordion on different screen sizes",
  },
  {
    TestId: "TC07",
    TestCaseName:
      "Verify that the accordion sections can be navigated using keyboard interactions",
  },
  {
    TestId: "TC08",
    TestCaseName: "Verify the smoothness of the expand/collapse animation",
  },
  {
    TestId: "TC09",
    TestCaseName:
      "Verify that the accordion headers are accessible via screen readers",
  },
  {
    TestId: "TC10",
    TestCaseName:
      "Verify that the content within an accordion section is interactable (e.g., links, buttons)",
  },
  {
    TestId: "TC11",
    TestCaseName:
      "Verify that the accordion collapses when clicking outside the accordion (if applicable)",
  },
  {
    TestId: "TC12",
    TestCaseName:
      "Verify the accessibility of the accordion for users with disabilities",
  },
  {
    TestId: "TC13",
    TestCaseName:
      "Verify that the accordion does not overlap with other page elements when expanded",
  },
  {
    TestId: "TC14",
    TestCaseName:
      "Verify the styling of the accordion headers and content sections",
  },
  {
    TestId: "TC15",
    TestCaseName:
      "Verify that the accordion sections load correctly without any errors",
  },
];
