# Automation Practice App — Feature & Locator Analysis

> What a demo banking app needs to be a complete automation practice ground for Selenium, Playwright, and Cypress.
> Cross-referenced against the current state documented in `docs/BANK_APP_FEATURES.md`.

---

## 1. The Benchmark: What Makes a Great Practice App

A well-designed automation practice app must cover every major interaction category that engineers encounter in real projects. These fall into seven buckets:

| # | Category | Why it matters |
|---|---|---|
| 1 | Forms & input types | Most apps are form-heavy; engineers need to handle all input variants |
| 2 | Locator strategies | Practice targeting by id, name, class, css, xpath, data-* attributes |
| 3 | Waits & async patterns | The #1 source of flaky tests in real projects |
| 4 | Dialogs & popups | Browser dialogs, modal dialogs, confirmation flows |
| 5 | Navigation & routing | URL changes, redirects, back/forward, query params |
| 6 | Tables & data grids | Filtering, sorting, pagination, dynamic row counts |
| 7 | State & session | localStorage, sessionStorage, cookies, cross-tab behavior |

---

## 2. Essential Locator Strategies to Cover

Every interactive element on a practice app should be reachable by multiple locator strategies. Below are all strategies an engineer should be able to practice:

### 2.1 By Attribute

| Strategy | Example | Priority |
|---|---|---|
| `id` | `#username`, `#login-btn` | Must-have |
| `name` | `input[name="username"]` | Must-have |
| `data-testid` | `[data-testid="login-button"]` | Must-have |
| `data-action` | `[data-action="login"]` | Should-have |
| `data-*` custom | `[data-account-id="123"]` | Should-have |
| `aria-label` | `[aria-label="Close dialog"]` | Should-have |
| `aria-role` | `[role="dialog"]`, `[role="alert"]` | Should-have |
| `placeholder` | `[placeholder="Enter username"]` | Nice-to-have |
| `type` | `input[type="checkbox"]` | Nice-to-have |

### 2.2 By CSS

| Pattern | Example |
|---|---|
| Tag + class | `button.btn-primary` |
| Descendant | `#login-form input` |
| Nth-child | `table tr:nth-child(2) td:nth-child(3)` |
| Sibling | `label + input` |
| Attribute contains | `[id*="account-row"]` |
| Attribute starts with | `[id^="transaction-"]` |

### 2.3 By XPath

| Pattern | Example |
|---|---|
| Absolute | `/html/body/...` (avoid in practice) |
| Relative | `//button[@data-testid="login-button"]` |
| Text match | `//button[text()="Login"]` |
| Contains text | `//td[contains(text(),"TXN")]` |
| Parent traversal | `//input[@id="username"]/ancestor::form` |
| Following sibling | `//label[text()="Username"]/following-sibling::input` |
| Index | `(//table//tr)[3]` |

### 2.4 Framework-Specific

| Framework | Strategy | Example |
|---|---|---|
| Playwright | `getByRole` | `page.getByRole('button', { name: 'Login' })` |
| Playwright | `getByLabel` | `page.getByLabel('Username')` |
| Playwright | `getByPlaceholder` | `page.getByPlaceholder('Enter username')` |
| Playwright | `getByText` | `page.getByText('Dashboard')` |
| Playwright | `getByTestId` | `page.getByTestId('login-button')` |
| Cypress | `cy.get` + `data-cy` | `cy.get('[data-cy="login-btn"]')` |
| Selenium | `By.cssSelector` | `driver.findElement(By.cssSelector('#login-btn'))` |
| Selenium | `By.xpath` | `driver.findElement(By.xpath('//button[@id="login-btn"]'))` |

---

## 3. Essential Feature Checklist for a Banking Practice App

### 3.1 Authentication

| Feature | Description | Automation value |
|---|---|---|
| Login form | Username + password | Form interaction baseline |
| Field validation | Required, inline errors per field | Assertion on error message text/visibility |
| Wrong credentials error | Alert/banner after submit | Negative test path |
| Password show/hide toggle | Eye icon button | Button state + input type change assertion |
| Remember me checkbox | Pre-fills username on return | localStorage read assertion |
| Redirect when logged in | Auto-redirect if session exists | Navigation assertion |
| Redirect when NOT logged in | Guard on all protected pages | Auth guard testing |
| Logout with confirm dialog | `confirm()` or modal | Native browser dialog handling |
| Session expiry / clear | Manual clear triggers re-login | Session state testing |
| Theme toggle | Dark/light mode switch | CSS class assertion |

### 3.2 Dashboard / Summary

| Feature | Description | Automation value |
|---|---|---|
| Stat cards | Numeric values that change based on data | Dynamic value assertions |
| Quick action buttons | Shortcuts to add/create workflows | Navigation via button |
| Data table (read-only) | Recent records with multiple columns | Table scraping basics |
| Empty state | Different UI when no records | Conditional element assertion |
| Currency formatting | `$1,234.56` format | Text content assertion |
| Page load data | Data visible without any user action | Wait for element strategies |

### 3.3 CRUD — Create

| Feature | Description | Automation value |
|---|---|---|
| Modal/dialog trigger | Button opens a form in a Dialog | Waiting for modal visibility |
| Text input | Short text field | `fill()` / `sendKeys()` |
| Number input | Numeric with min/max/step | Input constraints |
| Select / dropdown | Single-select options | `selectOption()` / `Select` class |
| Radio buttons | Single choice from a group | Radio group interaction |
| Checkbox | Boolean toggle | Check/uncheck + state assertion |
| Textarea | Multi-line text | `fill()` with long text |
| Character counter | Live count (e.g., 45/200) | Dynamic text assertion |
| Required field validation | Error shown on empty submit | Error state assertion |
| Form submit | Button inside modal | Submit via button or Enter key |
| Cancel / close modal | Dismiss without saving | Modal close + no record created |
| URL param triggers modal | `?action=add` opens form | URL manipulation testing |

### 3.4 CRUD — Read / List

| Feature | Description | Automation value |
|---|---|---|
| Data table | Rows + columns | Row count assertion, cell value read |
| Dynamic row IDs | `data-account-id`, `id="row-{id}"` | Dynamic locator construction |
| Column headers | `data-column` attributes | Column-specific assertions |
| Empty state row | `colspan` row when no data | Empty state assertion |
| Badges / status chips | Color-coded status | CSS class / text assertion |
| Currency values | Formatted `$X.XX` | Text matching |
| Date formatting | Human-readable dates | Date assertion patterns |

### 3.5 CRUD — Update (Edit)

| Feature | Description | Automation value |
|---|---|---|
| Edit button per row | Opens pre-filled modal | Dynamic locator by row id |
| Pre-filled form | Existing values loaded into fields | Assert input values before editing |
| Save changes | Updates table row | Post-edit assertion |
| Edit vs Add modal title | Same modal, different title | Conditional text assertion |

### 3.6 CRUD — Delete

| Feature | Description | Automation value |
|---|---|---|
| Delete button per row | Triggers confirmation dialog | Dynamic locator |
| AlertDialog / confirm | "Are you sure?" flow | Modal interaction |
| Cancel delete | Record remains in table | Negative action assertion |
| Confirm delete | Record removed from table | Count decrease assertion |

### 3.7 Search, Filter, Sort

| Feature | Description | Automation value |
|---|---|---|
| Text search | Filters table rows in real-time | Dynamic table assertion after typing |
| Dropdown filter | Narrows by category | Select + assert filtered rows |
| Date range filter | From/To date inputs | Date input interaction |
| Sort by dropdown | Re-orders table | First/last row value assertion |
| Apply + Reset buttons | Manual apply vs auto-filter | Button-triggered filter vs reactive |
| Combined filters | Multiple active at once | Multi-condition assertion |
| Empty filter result | Zero rows shown | Empty state assertion |

### 3.8 Dialogs

| Type | Trigger | Automation value |
|---|---|---|
| Browser `alert()` | Native browser dialog | `accept()` / `dismiss()` / `on('dialog')` |
| Browser `confirm()` | Logout confirmation | Accept vs cancel paths |
| shadcn Dialog | Add/Edit modal | Wait for visibility, interact inside |
| shadcn AlertDialog | Delete confirmation | Wait + click nested button inside overlay |
| Inline error Alert | Form validation failure | Alert component text assertion |

### 3.9 Navigation & URLs

| Feature | Description | Automation value |
|---|---|---|
| Link-based navigation | `<Link>` between pages | `click()` + URL assertion |
| Programmatic redirect | `router.push()` on auth guard | URL assertion after trigger |
| URL query params | `?action=add` triggers modal | URL manipulation + UI side effect |
| Active link styling | Navbar active state | CSS class assertion |
| Browser back/forward | Navigate history | Framework navigation APIs |

### 3.10 Async / Wait Scenarios

| Scenario | Description | Wait strategy |
|---|---|---|
| Page load | Elements appear after mount | `waitForSelector` / `waitForElement` |
| Modal open | Dialog renders after button click | Wait for dialog visibility |
| Modal close | Dialog gone after cancel | Wait for dialog to be hidden |
| Data refresh after save | Table updates after form submit | Wait for row count change |
| Alert message appears | Error shows after bad submit | Wait for alert visibility |
| Redirect on login | URL changes after submit | Wait for URL to contain `/dashboard` |
| localStorage read on load | Username pre-filled on mount | Wait for input value |

### 3.11 File Operations

| Feature | Automation value |
|---|---|
| CSV export / download | File download assertion, content verification |
| File upload | `setInputFiles()` / `sendKeys(path)` |

### 3.12 Accessibility Locators

| Feature | Automation value |
|---|---|
| `aria-label` on icon buttons | Playwright `getByRole` / `getByLabel` |
| `role="dialog"` on modals | Role-based locators |
| `role="alert"` on error messages | Alert role assertion |
| `aria-invalid` on invalid inputs | Accessibility-driven assertions |
| `htmlFor` / `id` label linkage | `getByLabel()` in Playwright |

---

## 4. Current Bank App Status vs Requirements

> Reference: `docs/BANK_APP_FEATURES.md`

### 4.1 What the Bank App Already Has

| Category | Coverage | Notes |
|---|---|---|
| Login form | Full | username, password, validation, remember me, show/hide, clear |
| Auth guard | Full | All 3 post-login pages redirect if no session |
| Logout | Full | `confirm()` dialog + sessionStorage clear |
| Dashboard stats | Full | 3 stat cards, correct values |
| Dashboard table | Full | Recent 5 transactions table |
| Dashboard empty states | Full | Both accounts grid and transactions table |
| Quick action buttons | Full | 3 buttons with links |
| Accounts CRUD | Full | Create, Read, Update, Delete all implemented |
| Accounts search | Full | Name + account number |
| Accounts filter | Full | By type (savings/checking/credit) |
| Accounts sort | Full | Name, balance, date |
| Accounts reset | Full | Reset filters button |
| Account form fields | Full | Name, type, balance, status radio, overdraft checkbox |
| Account delete confirm | Full | AlertDialog with cancel + confirm |
| Transaction create | Full | Deposit, withdrawal, transfer |
| Transaction table | Full | 7-column table with formatting |
| Transaction filter | Full | Account, type, date range |
| Transaction export CSV | Full | File download |
| URL param modal trigger | Full | `?action=add`, `?action=new` |
| `id` attributes | Full | Every interactive element |
| `data-testid` attributes | Full | Every interactive element |
| `data-action` attributes | Partial | Only on key action buttons |
| `data-column` attributes | Partial | Table headers |
| Native browser dialogs | Partial | `confirm()` only on logout |
| Browser `alert()` | Partial | Only on transaction success and export |
| shadcn Dialog | Full | Add/Edit account, New transaction |
| shadcn AlertDialog | Full | Delete account confirmation |
| Theme toggle | Full | Login page only |
| Responsive layout | Full | Mobile-first grids |
| Dark mode | Full | Via next-themes CSS vars |

### 4.2 What is Missing — Gaps to Fill

These are features not yet in the bank app that would significantly increase automation practice value:

---

#### GAP 1 — No Pagination on Tables

**Impact:** Engineers never practice:
- Clicking "Next page" / "Previous page"
- Asserting page number / total pages
- Navigating to a specific page
- Changing rows-per-page select

**What to add:**
- Pagination controls below each table (Accounts + Transactions)
- Rows-per-page dropdown (10 / 25 / 50)
- Page X of Y indicator
- First / Last page buttons

**Suggested element IDs:**
```
#pagination-prev        data-testid="pagination-prev"
#pagination-next        data-testid="pagination-next"
#pagination-page-info   data-testid="pagination-page-info"
#rows-per-page          data-testid="rows-per-page-select"
```

---

#### GAP 2 — No Toast / Snackbar Notifications

**Impact:** Engineers never practice:
- Waiting for a toast to appear
- Reading toast message text
- Waiting for toast to auto-dismiss

**What to add:**
- Replace `alert()` calls (transaction success, export success) with `sonner` toasts (already installed)
- Toast for: account created, account updated, account deleted, transaction completed, CSV exported

**Suggested test attributes:**
```
data-testid="toast-message"
data-testid="toast-close"
```

---

#### GAP 3 — No Inline/Row-Level Confirmation

**Impact:** Engineers only see AlertDialog for delete. Missing practice with:
- Inline "Are you sure?" toggle within a table row
- Undo-style interactions

**What to add:**
- After clicking Delete, show inline confirmation within the same row (toggle state) as an alternative flow
- Or add a "Deactivate" button that shows inline confirm text with Yes/No in the same row

---

#### GAP 4 — No Loading / Skeleton States

**Impact:** Engineers never practice:
- Waiting for a spinner to disappear
- Waiting for skeleton placeholder to be replaced by real content
- Handling intermittent loading states

**What to add:**
- Artificial delay (e.g., 800ms) on the dashboard data load with a skeleton card UI
- Loading spinner on the transaction submit button while "processing"
- `data-loading="true"` attribute on the page while data is being loaded

**Suggested test attributes:**
```
data-testid="loading-spinner"
data-testid="skeleton-card"
data-loading="true|false"   ← on the page container
```

---

#### GAP 5 — No Sortable Table Columns (Click-to-Sort)

**Impact:** Engineers only practice sort via a dropdown. Missing practice with:
- Clicking a column header to sort
- Asserting sort direction icon change (▲ / ▼)
- Clicking same header again to reverse sort

**What to add:**
- Make Accounts table columns (Name, Balance, Status) clickable for sort
- Add sort direction indicator inside column header
- `data-sort-direction="asc|desc"` attribute on the active sort header

**Suggested test attributes:**
```
[data-column="name"][data-sort-direction="asc"]
[data-testid="sort-name-header"]
[data-testid="sort-balance-header"]
```

---

#### GAP 6 — No Multi-step / Wizard Form

**Impact:** Engineers never practice:
- Progressing through steps (Step 1 of 3)
- Going back to a previous step
- Asserting step indicators
- Data persisting across steps

**What to add:**
- "Open New Account" wizard with 3 steps:
  - Step 1: Account type selection (card-based radio)
  - Step 2: Account details (name, initial deposit)
  - Step 3: Review + confirm
- Step indicator with `data-step="1|2|3"` and `data-step-status="active|complete|pending"`

---

#### GAP 7 — No Drag-and-Drop

**Impact:** Engineers never practice drag-and-drop in a realistic business context.

**What to add:**
- "Pinned Accounts" section on dashboard where users can reorder accounts via drag
- Or a "Priority Transfer" list where accounts are ordered by drag

**Suggested test attributes:**
```
data-testid="draggable-account-{id}"
data-testid="drop-zone"
```

---

#### GAP 8 — No Inline Editing

**Impact:** Engineers only see edit via modal. Missing practice with:
- Clicking a cell to make it editable (contenteditable or toggled input)
- Pressing Enter to save, Escape to cancel
- Asserting cell reverts on Escape

**What to add:**
- Account Name cell on the Accounts table becomes an inline `<input>` on double-click
- Save on Enter key or blur, cancel on Escape
- `data-editable="true"` on the cell, `data-editing="true"` when active

---

#### GAP 9 — No Date Picker (Calendar Widget)

**Impact:** Date inputs are native `<input type="date">`. Engineers never practice:
- Opening a calendar widget
- Clicking a specific day
- Navigating months
- Asserting selected date display

**What to add:**
- Replace the "Date From" and "Date To" filter inputs in Transactions with a `react-day-picker` calendar (already installed)
- Transaction form could optionally include a "Schedule Date" field with a calendar picker

---

#### GAP 10 — No Dynamic Row Addition Without Modal

**Impact:** Engineers only see data appear via modal submit. Missing practice with:
- An inline "quick add" row at the bottom of the table
- Typing directly in the new row cells and pressing Enter to save

**What to add:**
- "Quick Add" row at the bottom of the Accounts table with inline inputs
- Saves on Enter or "+" button click at end of row

---

#### GAP 11 — No Accessible ARIA Attributes

**Impact:** Engineers cannot practice Playwright's `getByRole`, `getByLabel`, or accessibility-driven locators.

**What to add to existing elements:**
- `aria-label` on icon-only buttons (the password toggle, export icon button)
- `role="alert"` on error Alert components
- `aria-invalid="true"` on inputs that have validation errors
- `aria-live="polite"` on the toast/notification area
- `aria-label` on the Delete/Edit buttons: `aria-label="Edit account Primary Savings"`

---

#### GAP 12 — No Keyboard Navigation / Shortcut Testing

**Impact:** Engineers never practice keyboard-only workflows.

**What to add:**
- Tab order that is logical and testable
- Pressing Enter on the login form submits it (already works via form submit)
- Pressing Escape closes modals
- Add a keyboard shortcut hint (e.g., `N` for new transaction) with a corresponding `data-hotkey="n"` attribute

---

#### GAP 13 — No Account Detail / Transaction Detail Page

**Impact:** All data is in tables. Engineers never practice:
- Click-through navigation from a list to a detail page
- Breadcrumb navigation
- URL with dynamic ID parameter (`/bank/accounts/[id]`)
- Deep linking to a specific record

**What to add:**
- `/bank/accounts/[id]` — Account detail page showing account info + its transactions only
- `/bank/transactions/[id]` — Transaction detail page (read-only)
- Breadcrumb: Dashboard → Accounts → Primary Savings

---

#### GAP 14 — No Role-Based UI Differences

**Impact:** All views are identical for all users. Engineers never practice:
- Asserting that certain buttons are hidden/shown based on role
- Role-based navigation items

**What to add:**
- Support a `viewer` role (read-only) alongside `admin`
- Viewer sees no Add/Edit/Delete buttons — those elements have `data-permission="admin"` and are hidden
- Login page supports `viewer` / `viewer123` as a second credential set

---

#### GAP 15 — No Cross-Tab / Cross-Window Scenarios

**Impact:** Engineers never practice window switching.

**What to add:**
- "Open in New Tab" link on the account detail that opens the account statement in a new window
- Help link in the navbar that opens the QA Playground homepage in a new tab

---

## 5. Priority Recommendations

Order these gaps by ROI for a QA practice app:

| Priority | Gap | Effort | Automation Value |
|---|---|---|---|
| P1 | GAP 2 — Toast notifications | Low | High — nearly every app has toasts |
| P1 | GAP 5 — Click-to-sort table headers | Low | High — standard table pattern |
| P1 | GAP 11 — ARIA attributes on existing elements | Low | High — Playwright getByRole/getByLabel |
| P2 | GAP 1 — Pagination | Medium | High — universal pattern |
| P2 | GAP 4 — Loading states | Medium | High — wait strategy practice |
| P2 | GAP 9 — Calendar date picker | Medium | High — already have react-day-picker installed |
| P2 | GAP 13 — Detail pages | Medium | High — list-to-detail navigation is universal |
| P3 | GAP 6 — Multi-step wizard | High | High — complex form flow |
| P3 | GAP 14 — Role-based UI | Medium | Medium — good for auth testing |
| P3 | GAP 7 — Drag and drop | High | Medium — already have DnD on practice page |
| P4 | GAP 8 — Inline editing | Medium | Medium — niche but real pattern |
| P4 | GAP 15 — Cross-tab scenarios | Low | Medium — window switching basics |
| P4 | GAP 3 — Inline row confirmation | Medium | Low — covered by AlertDialog |
| P4 | GAP 10 — Quick add row | High | Low — uncommon in real apps |
| P4 | GAP 12 — Keyboard shortcuts | Medium | Low — specialized use case |

---

## 6. Element Attribute Standard for New Features

Any new element added to the bank app must follow this convention:

```jsx
<Button
  id="unique-descriptive-id"              // Required — used by id locator
  name="camelCaseName"                    // Required on form fields
  data-testid="kebab-case-testid"         // Required — used by automation
  data-action="verb-noun"                 // Required on action buttons (add-account, delete-account, etc.)
  aria-label="Human readable description" // Required on icon-only buttons
  data-state="loading|idle|error"         // Where applicable — for wait assertions
>
```

For table rows:
```jsx
<TableRow
  id="row-type-{id}"                      // e.g., account-row-123
  data-testid="row-type-{id}"             // e.g., account-row-123
  data-{entity}-id="{id}"                // e.g., data-account-id="123"
>
```

For table cells:
```jsx
<TableCell
  id="cell-{entity}-{field}-{id}"        // e.g., account-name-123
  data-testid="{field}-cell"             // e.g., account-name
  data-column="{field}"                  // e.g., name, balance, status
>
```

---

## 7. Framework-Specific Test Examples for Current Bank App

### Selenium (Java)

```java
// Login
driver.findElement(By.id("username")).sendKeys("admin");
driver.findElement(By.id("password")).sendKeys("admin123");
driver.findElement(By.cssSelector("[data-testid='login-button']")).click();

// Assert redirect to dashboard
new WebDriverWait(driver, Duration.ofSeconds(5))
    .until(ExpectedConditions.urlContains("/bank/dashboard"));

// Read total balance
String balance = driver.findElement(By.id("total-balance")).getText();
Assert.assertTrue(balance.startsWith("$"));

// Delete an account — find first delete button in table
WebElement firstDeleteBtn = driver.findElement(
    By.cssSelector("[data-action='delete']"));
firstDeleteBtn.click();

// Handle AlertDialog
driver.findElement(By.cssSelector("[data-testid='confirm-delete-button']")).click();
```

### Playwright (JavaScript)

```javascript
// Login
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('admin123');
await page.getByTestId('login-button').click();
await expect(page).toHaveURL('/bank/dashboard');

// Assert stat card value
await expect(page.getByTestId('total-balance')).toHaveText(/\$[\d,]+\.\d{2}/);

// Open Add Account modal via URL param
await page.goto('/bank/accounts?action=add');
await expect(page.getByTestId('account-modal')).toBeVisible();

// Fill and submit account form
await page.getByTestId('account-name-input').fill('Test Savings');
await page.getByTestId('account-type-select').selectOption('savings');
await page.getByTestId('initial-balance-input').fill('1000');
await page.getByTestId('save-account-button').click();

// Assert new row in table
await expect(page.getByText('Test Savings')).toBeVisible();
```

### Cypress

```javascript
// Login
cy.visit('/bank');
cy.get('[data-testid="username-input"]').type('admin');
cy.get('[data-testid="password-input"]').type('admin123');
cy.get('[data-testid="login-button"]').click();
cy.url().should('include', '/bank/dashboard');

// Filter transactions by type
cy.get('[data-testid="filter-transaction-type-select"]').select('deposit');
cy.get('[data-testid="apply-filters-button"]').click();
cy.get('[data-testid="transactions-tbody"] tr').each(($row) => {
  cy.wrap($row).find('[data-testid="transaction-type"]').should('contain', 'Deposit');
});

// Export CSV
cy.get('[data-testid="export-button"]').click();
cy.readFile('cypress/downloads/transactions_' + new Date().toISOString().split('T')[0] + '.csv')
  .should('contain', 'Transaction ID');
```

---

## 8. Summary

The current bank demo app is a solid foundation covering login, CRUD, filtering, sorting, dialogs, and export. The highest-value gaps to close are:

1. **Toasts** over native `alert()` — engineers must practice async notification assertions
2. **Click-to-sort table headers** — universal table pattern not covered
3. **ARIA attributes** — unlocks Playwright's semantic locator APIs
4. **Pagination** — nearly every real data table has it
5. **Loading states** — the #1 source of flaky tests is missing wait targets
6. **Detail pages** — list → detail navigation is fundamental to real app flows
7. **Calendar date picker** — input[type="date"] is too simple; real apps use widget pickers

Addressing the P1 and P2 gaps would make the bank app a near-complete practice environment for Selenium, Playwright, and Cypress at both beginner and intermediate levels.
