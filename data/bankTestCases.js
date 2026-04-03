// ─── Bank Application — FAQ-style Test Cases ─────────────────────────────────
// Pattern matches elementsTestCases.js: { TestId, TestCaseName, steps[] }

// ─── Login Page (/bank) ───────────────────────────────────────────────────────
export const bankLoginTC = [
  {
    TestId: "TC-LOGIN-01",
    TestCaseName: "Successful login with admin credentials",
    steps: [
      "Navigate to /bank",
      "Locate the username field: id='username' or data-testid='username-input'",
      "Type 'admin' into the username field",
      "Locate the password field: id='password' or data-testid='password-input'",
      "Type 'admin123' into the password field",
      "Click the Login button: id='login-btn' or data-testid='login-button'",
      "Assert the browser redirects to /bank/dashboard",
      "Assert the element data-testid='page-title' has text 'Dashboard'",
    ],
  },
  {
    TestId: "TC-LOGIN-02",
    TestCaseName: "Failed login shows error alert for invalid credentials",
    steps: [
      "Navigate to /bank",
      "Enter 'wrong' in the username field and 'wrong123' in the password field",
      "Click the Login button: data-testid='login-button'",
      "Assert the error alert is visible: data-testid='login-alert'",
      "Assert the alert text contains 'Invalid username or password'",
      "Assert the current URL is still /bank (no redirect)",
    ],
  },
  {
    TestId: "TC-LOGIN-03",
    TestCaseName: "Toggle password visibility hides and reveals password text",
    steps: [
      "Navigate to /bank",
      "Enter any text in the password field: data-testid='password-input'",
      "Assert the input type attribute is 'password' (text is hidden)",
      "Click the toggle button: data-testid='toggle-password-btn' or aria-label='Toggle password visibility'",
      "Assert the input type attribute is now 'text' (text is visible)",
      "Click the toggle button again",
      "Assert the input type attribute reverts to 'password'",
    ],
  },
  {
    TestId: "TC-LOGIN-04",
    TestCaseName: "Pressing Enter in the password field submits the login form",
    steps: [
      "Navigate to /bank",
      "Enter 'admin' in the username field",
      "Click into the password field and type 'admin123'",
      "Press the Enter key while the password field is focused",
      "Assert the browser redirects to /bank/dashboard without clicking the Login button",
    ],
  },
  {
    TestId: "TC-LOGIN-05",
    TestCaseName: "Read-only viewer login grants restricted access",
    steps: [
      "Navigate to /bank",
      "Enter 'viewer' in the username field and 'viewer123' in the password field",
      "Click the Login button: data-testid='login-button'",
      "Assert redirect to /bank/dashboard",
      "Assert the viewer badge is visible: data-testid='viewer-badge' with text 'Read-only'",
      "Assert the role indicator: data-testid='role-indicator' contains 'Read-only Viewer'",
      "Navigate to /bank/accounts and assert the Add New Account button is NOT present",
    ],
  },
];

// ─── Dashboard Page (/bank/dashboard) ────────────────────────────────────────
export const bankDashboardTC = [
  {
    TestId: "TC-DASH-01",
    TestCaseName: "Skeleton loading state appears on page load then data renders",
    steps: [
      "Navigate to /bank/dashboard (must be logged in)",
      "Immediately assert data-loading='true' on id='dashboard-page-container'",
      "Assert skeleton placeholder elements with data-testid='skeleton-card' are visible",
      "Wait for data-loading='false' on id='dashboard-page-container' (max 2s)",
      "Assert data-testid='total-balance-card' is visible and contains a dollar amount",
      "Assert data-testid='accounts-count-card' is visible with a numeric value",
      "Assert data-testid='transactions-count-card' is visible with a numeric value",
    ],
  },
  {
    TestId: "TC-DASH-02",
    TestCaseName: "Stat card values match actual account and transaction data",
    steps: [
      "Log in as admin and navigate to /bank/dashboard",
      "Wait for data-loading='false' on id='dashboard-page-container'",
      "Read the value of data-testid='total-balance'",
      "Navigate to /bank/accounts and sum all account balances from data-testid='account-balance' cells",
      "Assert the dashboard total balance matches the computed sum",
      "Read data-testid='accounts-count' and assert it equals the number of account rows in /bank/accounts",
    ],
  },
  {
    TestId: "TC-DASH-03",
    TestCaseName: "Quick Actions navigate to correct pages",
    steps: [
      "Log in as admin and wait for dashboard to load",
      "Click the 'Add Account' quick action button: data-testid='quick-add-account'",
      "Assert the URL is /bank/accounts and the Add Account modal is open (data-testid='account-modal')",
      "Navigate back to /bank/dashboard",
      "Click 'New Transaction': data-testid='quick-new-transaction'",
      "Assert URL is /bank/transactions and the New Transaction modal is open",
    ],
  },
  {
    TestId: "TC-DASH-04",
    TestCaseName: "Recent Transactions table shows up to 5 latest transactions",
    steps: [
      "Log in as admin and wait for dashboard to load",
      "Locate the recent transactions table: data-testid='recent-transactions-table'",
      "Assert the number of rows in data-testid='transactions-tbody' is between 0 and 5",
      "Assert each row contains a date, type (Deposit/Withdrawal/Transfer), account name, amount, and status",
      "Assert the status badge in each row shows 'Completed'",
    ],
  },
  {
    TestId: "TC-DASH-05",
    TestCaseName: "Pinned Accounts section supports drag-and-drop reorder",
    steps: [
      "Log in as admin and wait for dashboard to load (requires at least 2 accounts)",
      "Locate the Pinned Accounts section: data-testid='pinned-accounts-section'",
      "Assert at least one card with data-testid starting with 'draggable-account-' is present",
      "Assert the draggable attribute on each card is 'true'",
      "Perform drag-and-drop: drag the first card and drop onto the second card position",
      "Assert the drop zone container data-testid='drop-zone' had data-drop-active='true' during the drag",
      "Reload the page and assert the reordered position is preserved (persisted in localStorage)",
    ],
  },
];

// ─── Accounts Page (/bank/accounts) ──────────────────────────────────────────
export const bankAccountsTC = [
  {
    TestId: "TC-ACC-01",
    TestCaseName: "Create a new account using the 3-step Open Account wizard",
    steps: [
      "Log in as admin and navigate to /bank/accounts",
      "Click 'Open New Account': data-testid='open-wizard-button'",
      "Assert the wizard dialog is open: data-testid='open-account-wizard'",
      "Assert step indicator shows 'Step 1 of 3': data-testid='wizard-step-indicator'",
      "Click the Savings card: data-testid='type-card-savings' and assert data-selected='true'",
      "Click Next: data-testid='wizard-next' — assert step indicator shows 'Step 2 of 3'",
      "Fill in Account Name: data-testid='wizard-account-name' and Initial Deposit: data-testid='wizard-initial-deposit'",
      "Click Next — assert step indicator shows 'Step 3 of 3' and the review summary is visible",
      "Click 'Confirm & Open Account': data-testid='wizard-confirm'",
      "Assert a success toast appears and the new account appears in the accounts table",
    ],
  },
  {
    TestId: "TC-ACC-02",
    TestCaseName: "Edit account name inline by double-clicking the name cell",
    steps: [
      "Log in as admin and navigate to /bank/accounts (wait for table to load)",
      "Locate the first account name cell with data-editable='true'",
      "Assert the cell's data-editing attribute is 'false'",
      "Double-click the account name cell to enter edit mode",
      "Assert data-editing='true' on the cell and data-testid='inline-edit-input' is visible and focused",
      "Clear the input and type a new account name",
      "Press Enter to save — assert the inline input disappears and the new name appears in the cell",
      "Assert a success toast 'Account name updated' appears",
    ],
  },
  {
    TestId: "TC-ACC-03",
    TestCaseName: "Delete an account with confirmation and verify it is removed",
    steps: [
      "Log in as admin and navigate to /bank/accounts",
      "Locate the Delete button for a target account: data-testid='delete-account-{id}'",
      "Click the Delete button",
      "Assert the delete confirmation dialog is visible: data-testid='delete-modal'",
      "Assert the dialog message: data-testid='delete-message' contains 'cannot be undone'",
      "Click Cancel: data-testid='cancel-delete-button' — assert dialog closes and account still exists",
      "Click Delete again, then click Confirm: data-testid='confirm-delete-button'",
      "Assert the account row is no longer present in the accounts table",
      "Assert a success toast 'Account deleted successfully' appears",
    ],
  },
  {
    TestId: "TC-ACC-04",
    TestCaseName: "Filter accounts by account type",
    steps: [
      "Log in as admin and navigate to /bank/accounts",
      "Note the total number of rows in data-testid='accounts-tbody'",
      "Open the Account Type filter: data-testid='filter-type-select'",
      "Select 'Savings' from the dropdown",
      "Assert all visible rows have a Type badge showing 'Savings'",
      "Assert no row shows 'Checking' or 'Credit' in the type badge",
      "Click Reset Filters: data-testid='reset-filters-button'",
      "Assert the row count returns to the original total",
    ],
  },
  {
    TestId: "TC-ACC-05",
    TestCaseName: "Sort accounts by Balance column header (ascending → descending → none)",
    steps: [
      "Log in as admin and navigate to /bank/accounts",
      "Click the Balance column header: data-testid='sort-balance-header'",
      "Assert data-sort-direction='asc' on the header",
      "Assert the first row has the lowest balance value in the table",
      "Click the Balance header again",
      "Assert data-sort-direction='desc' and the first row now has the highest balance",
      "Click the Balance header a third time",
      "Assert data-sort-direction='none' — rows return to default sort order",
    ],
  },
];

// ─── Transactions Page (/bank/transactions) ───────────────────────────────────
export const bankTransactionsTC = [
  {
    TestId: "TC-TXN-01",
    TestCaseName: "Create a deposit transaction and verify balance update",
    steps: [
      "Log in as admin and navigate to /bank/accounts — note the balance of 'Primary Savings'",
      "Navigate to /bank/transactions",
      "Click 'New Transaction': data-testid='new-transaction-button'",
      "Assert the transaction modal is open: data-testid='account-modal'",
      "Select 'Deposit' as the transaction type",
      "Select 'Primary Savings' as the account: data-testid='from-account-select'",
      "Enter '500' in the Amount field and click Submit",
      "Assert a success toast appears and the new transaction row appears in the table",
      "Navigate back to /bank/accounts and assert Primary Savings balance increased by $500",
    ],
  },
  {
    TestId: "TC-TXN-02",
    TestCaseName: "Filter transactions by account and verify only matching rows appear",
    steps: [
      "Log in as admin and navigate to /bank/transactions",
      "Note the total transaction count in data-testid='transactions-tbody'",
      "Open the Account filter: data-testid='filter-account-select'",
      "Select a specific account (e.g., 'Primary Savings')",
      "Click Apply Filters: data-testid='apply-filters-button'",
      "Assert every row in the table shows 'Primary Savings' in the Account column",
      "Assert the transactions summary bar updates to reflect filtered totals",
      "Click Reset: data-testid='reset-filters-button' and assert all rows return",
    ],
  },
  {
    TestId: "TC-TXN-03",
    TestCaseName: "Filter transactions by date range using the calendar date picker",
    steps: [
      "Log in as admin and navigate to /bank/transactions",
      "Click the From date picker: data-testid='date-from-input' — assert a calendar popover opens (data-testid='date-picker-calendar')",
      "Select today's date by clicking the day cell with the correct aria-label",
      "Click the To date picker: data-testid='date-to-input' and select today's date",
      "Click Apply Filters: data-testid='apply-filters-button'",
      "Assert every row in the results table has a date matching today",
      "Click the clear (×) button on the From date picker and assert the date resets",
    ],
  },
  {
    TestId: "TC-TXN-04",
    TestCaseName: "Export transactions as CSV and verify file is downloaded",
    steps: [
      "Log in as admin and navigate to /bank/transactions with at least one transaction present",
      "Click the Export button: data-testid='export-button' or aria-label='Export transactions as CSV'",
      "Assert a success toast 'Transactions exported successfully!' appears",
      "Verify the browser triggers a file download with a .csv extension",
      "Navigate to /bank/transactions when no transactions exist (reset data)",
      "Click Export and assert a toast error 'No transactions to export' appears",
    ],
  },
  {
    TestId: "TC-TXN-05",
    TestCaseName: "Open transaction detail page and verify all fields via breadcrumb navigation",
    steps: [
      "Log in as admin and navigate to /bank/transactions",
      "Click a Transaction ID link in the table: data-testid='transaction-id-link'",
      "Assert the URL changes to /bank/transactions/{id}",
      "Assert the breadcrumb: data-testid='breadcrumb-item-1' = 'Dashboard', data-testid='breadcrumb-item-2' = 'Transactions'",
      "Assert the transaction type, amount, date, account, balance-after, and status are all visible",
      "Click the Back button: data-testid='back-button'",
      "Assert the browser navigates back to /bank/transactions",
    ],
  },
];
