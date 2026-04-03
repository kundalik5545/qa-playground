# Bank Demo App — Features & Reference

> Current state of the SecureBank Demo application at `/bank`. Use this as the source of truth when building new features or writing automation tests.

---

## Overview

**SecureBank Demo** is a simulated banking application built for QA automation practice. It has no real backend — all data lives in `localStorage`. The app is isolated from the main site header/footer via the `(bank)` route group and the `bank-page` CSS class.

**Entry point:** `/bank`  
**Credentials:** `admin` / `admin123`  
**Storage:** `localStorage` via `lib/bankStorage.js`  
**Auth session:** `sessionStorage` key `currentUser`

---

## Route Structure

```
app/(bank)/
├── layout.js                    # Adds/removes `bank-page` class on <body>; hides global header/footer
└── bank/
    ├── page.jsx                 # /bank — Login page
    ├── dashboard/page.jsx       # /bank/dashboard — Dashboard
    ├── accounts/page.jsx        # /bank/accounts — Account management
    └── transactions/page.jsx    # /bank/transactions — Transaction management

components/bank/
└── BankNavbar.jsx               # Navigation bar used on all post-login pages

lib/
└── bankStorage.js               # All localStorage read/write logic
```

---

## Pages

### 1. Login Page — `/bank`

**File:** `app/(bank)/bank/page.jsx`

**UI Components used:** Card, CardHeader, CardContent, CardFooter, Input, Label, Button, Checkbox, Alert

**Features:**
- Username + password form with client-side validation (required field checks on blur and submit)
- Password visibility toggle button (`Eye` / `EyeOff` icons)
- "Remember me" checkbox — saves username to `localStorage` key `rememberedUser`
- Login error alert shown on invalid credentials
- Clear button resets all fields and errors
- Demo credentials displayed in card footer (`admin` / `admin123`)
- Theme toggle button (dark/light) fixed top-right corner
- Auto-redirects to `/bank/dashboard` if already logged in (session found in `sessionStorage`)

**Validation logic:**
- Empty username → shows `"Username is required"` below the field
- Empty password → shows `"Password is required"` below the field
- Wrong credentials → shows destructive Alert: `"Invalid username or password. Please try again."`

**Key element IDs / test attributes:**

| Element | `id` | `data-testid` | `data-action` |
|---|---|---|---|
| Login form | `login-form` | `login-form` | — |
| Username input | `username` | `username-input` | — |
| Password input | `password` | `password-input` | — |
| Toggle password | `toggle-password` | `toggle-password-btn` | — |
| Remember me checkbox | `remember-me` | `remember-checkbox` | — |
| Login button | `login-btn` | `login-button` | `login` |
| Clear button | `clear-btn` | `clear-button` | `clear` |
| Error alert | `login-alert` | `login-alert` | — |
| Theme toggle | `theme-toggle` | `theme-toggle` | — |
| Demo username display | `demo-username-text` | `demo-username` | — |
| Demo password display | `demo-password-text` | `demo-password` | — |

---

### 2. Dashboard — `/bank/dashboard`

**File:** `app/(bank)/bank/dashboard/page.jsx`

**UI Components used:** Card, CardHeader, CardContent, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, BankNavbar

**Features:**

**Summary Cards (3 cards in a responsive grid):**
- Total Balance — sum of all account balances; purple `Wallet` icon
- Active Accounts — count of accounts; pink `CreditCard` icon
- Total Transactions — count of recent transactions; blue `TrendingUp` icon

**Quick Actions section:**
- "Add Account" button → links to `/bank/accounts?action=add`
- "New Transaction" button → links to `/bank/transactions?action=new`
- "View All Accounts" button → links to `/bank/accounts`

**Recent Transactions table:**
- Shows last 5 transactions (via `getRecentTransactions(5)`)
- Columns: Date, Type, Account, Amount, Status
- Type colored: deposit = green, withdrawal = red, transfer = blue
- Amount prefixed with `+` or `-` depending on type
- Status shown as green Badge (`Completed`)
- Empty state: `"No transactions yet"`

**Accounts Overview grid:**
- Responsive grid (1 col → 2 col → 3 col)
- Each account card shows: icon (🏦 savings / 💳 checking / 💎 credit), account name, balance (purple), account type + number
- Empty state: `"No accounts found. Create your first account!"`

**Key element IDs / test attributes:**

| Element | `id` | `data-testid` |
|---|---|---|
| Page title | `page-title` | `page-title` |
| Welcome message | `welcome-message` | `welcome-message` |
| Total balance card | `total-balance-card` | `total-balance-card` |
| Total balance value | `total-balance` | `total-balance` |
| Accounts count card | `accounts-count-card` | `accounts-count-card` |
| Accounts count value | `accounts-count` | `accounts-count` |
| Transactions count card | `transactions-count-card` | `transactions-count-card` |
| Transactions count value | `transactions-count` | `transactions-count` |
| Quick add account | `add-account-quick` | `quick-add-account` |
| Quick new transaction | `new-transaction-quick` | `quick-new-transaction` |
| Quick view accounts | `view-all-accounts` | `quick-view-accounts` |
| Recent transactions table | `recent-transactions-table` | `recent-transactions-table` |
| Transactions tbody | `transactions-tbody` | `transactions-tbody` |
| Accounts grid | `accounts-list` | `accounts-grid` |

---

### 3. Accounts Page — `/bank/accounts`

**File:** `app/(bank)/bank/accounts/page.jsx`

**UI Components used:** Table, Dialog, AlertDialog, Select, Input, Label, Button, Badge, RadioGroup, Checkbox, BankNavbar

**Features:**

**Accounts Table:**
- Columns: Account Number, Account Name, Type (Badge), Balance, Status (Badge), Actions
- Edit and Delete buttons per row
- Empty state: `"No accounts found"`

**Filters bar (4 controls in a responsive grid):**
- Search input — filters by account name or account number (substring, case-insensitive)
- Account Type select — filter by: All Types / Savings / Checking / Credit
- Sort By select — sort by: Account Name / Balance (desc) / Date Created (desc)
- Reset Filters button

**URL parameter support:** If `?action=add` is present on load, the Add Account modal opens automatically.

**Add / Edit Account Modal (Dialog):**
Fields:
- Account Name (text input, required)
- Account Type (select: Savings / Checking / Credit, required)
- Initial Balance (number input, min 0, required)
- Status (RadioGroup: Active / Inactive)
- Enable Overdraft Protection (Checkbox)

Modal title changes to "Edit Account" when editing.

**Delete Confirmation (AlertDialog):**
- Message: `"Are you sure you want to delete this account? This action cannot be undone."`
- Buttons: Cancel | Delete (destructive)

**Key element IDs / test attributes:**

| Element | `id` | `data-testid` | `data-action` |
|---|---|---|---|
| Add account button | `add-account-btn` | `add-account-button` | `add-account` |
| Search input | `search-input` | `search-input` | — |
| Filter type select | `filter-type` | `filter-type-select` | — |
| Sort by select | `sort-by` | `sort-by-select` | — |
| Reset filters button | `reset-filters-btn` | `reset-filters-button` | — |
| Accounts table | `accounts-table` | `accounts-table` | — |
| Accounts tbody | `accounts-tbody` | `accounts-tbody` | — |
| Each account row | `account-row-{id}` | `account-row-{id}` | — |
| Edit button (per row) | `edit-account-btn-{id}` | `edit-account-{id}` | `edit` |
| Delete button (per row) | `delete-account-btn-{id}` | `delete-account-{id}` | `delete` |
| Account modal | `account-modal` | `account-modal` | — |
| Modal title | `modal-title` | `modal-title` | — |
| Account name input | `account-name` | `account-name-input` | — |
| Account type select | `account-type` | `account-type-select` | — |
| Initial balance input | `initial-balance` | `initial-balance-input` | — |
| Status active radio | `status-active` | `status-active-radio` | — |
| Status inactive radio | `status-inactive` | `status-inactive-radio` | — |
| Overdraft checkbox | `enable-overdraft` | `overdraft-checkbox` | — |
| Cancel button | `cancel-btn` | `cancel-button` | — |
| Save account button | `save-account-btn` | `save-account-button` | — |
| Delete modal | `delete-modal` | `delete-modal` | — |
| Cancel delete button | `cancel-delete-btn` | `cancel-delete-button` | — |
| Confirm delete button | `confirm-delete-btn` | `confirm-delete-button` | — |

---

### 4. Transactions Page — `/bank/transactions`

**File:** `app/(bank)/bank/transactions/page.jsx`

**UI Components used:** Table, Dialog, Select, Input, Label, Button, Badge, Textarea, Checkbox, Alert, BankNavbar

**Features:**

**Transactions Table:**
- Columns: Transaction ID, Date & Time, Type, Account, Amount, Balance After, Description
- Type colored: deposit = green, withdrawal = red, transfer = blue
- Amount prefixed with `+` or `-`
- Empty state: `"No transactions found"`

**Filters bar (5 controls in a responsive grid):**
- Account select — filters by specific account or all
- Type select — filter by: All Types / Deposit / Withdrawal / Transfer
- Date From input (date picker)
- Date To input (date picker)
- Apply button, Reset button, Export CSV button (Download icon)

**URL parameter support:** If `?action=new` is present on load, the New Transaction modal opens automatically.

**New Transaction Modal (Dialog):**
Fields:
- Transaction Type (select: Deposit / Withdrawal / Transfer, required)
- From Account (select, required — shows account name + balance)
- To Account (select — only shown when type is "Transfer")
- Amount (number input, min 0.01, required)
- Available balance hint shown below amount field
- Description (Textarea, optional, max 200 chars with char counter)
- Send email notification (Checkbox — UI only, no real email sent)

**Validation / business rules:**
- Cannot transfer to the same account → alert: `"Cannot transfer to the same account"`
- Insufficient balance for withdrawal or transfer → alert: `"Insufficient balance for this transaction"`
- On successful transfer: two transaction records created (debit on source, deposit on destination)
- On success: native `alert("Transaction completed successfully!")`

**Export CSV:**
- Exports all currently filtered transactions as a `.csv` file
- Filename: `transactions_YYYY-MM-DD.csv`
- Columns: Transaction ID, Date, Type, Account, Amount, Balance After, Description

**Key element IDs / test attributes:**

| Element | `id` | `data-testid` | `data-action` |
|---|---|---|---|
| New transaction button | `new-transaction-btn` | `new-transaction-button` | `new-transaction` |
| Filter account select | `filter-account` | `filter-account-select` | — |
| Filter type select | `filter-transaction-type` | `filter-transaction-type-select` | — |
| Date from input | `date-from` | `date-from-input` | — |
| Date to input | `date-to` | `date-to-input` | — |
| Apply filters button | `apply-filters-btn` | `apply-filters-button` | — |
| Reset filters button | `reset-filters-btn` | `reset-filters-button` | — |
| Export CSV button | `export-btn` | `export-button` | `export` |
| Transactions table | `transactions-table` | `transactions-table` | — |
| Transactions tbody | `transactions-tbody` | `transactions-tbody` | — |
| Each row | `transaction-row-{id}` | `transaction-row` | — |
| Transaction modal | `transaction-modal` | `transaction-modal` | — |
| Transaction type select | `transaction-type` | `transaction-type-select` | — |
| From account select | `from-account` | `from-account-select` | — |
| To account select | `to-account` | `to-account-select` | — |
| Amount input | `transaction-amount` | `transaction-amount-input` | — |
| Description textarea | `transaction-description` | `transaction-description-input` | — |
| Notification checkbox | `send-notification` | `notification-checkbox` | — |
| Transaction alert | `transaction-alert` | `transaction-alert` | — |
| Cancel button | `cancel-transaction-btn` | `cancel-transaction-button` | — |
| Submit button | `submit-transaction-btn` | `submit-transaction-button` | — |

---

## Navigation — `BankNavbar`

**File:** `components/bank/BankNavbar.jsx`

Present on all post-login pages (dashboard, accounts, transactions). Not shown on `/bank` login page.

**Elements:**
- Brand logo: `Building2` icon + "SecureBank" gradient text
- Nav links: Dashboard (`📊`), Accounts (`💳`), Transactions (`💸`) — active link gets purple-to-pink gradient
- User display: `👤 {username}`
- Logout button — triggers `confirm()` dialog, then clears `sessionStorage` and redirects to `/bank`

**Key test attributes:**

| Element | `id` | `data-testid` | `data-action` |
|---|---|---|---|
| Navbar | `main-navbar` | `main-navbar` | — |
| Brand name | `brand-name` | — | — |
| Dashboard link | `nav-dashboard` | `nav-dashboard` | — |
| Accounts link | `nav-accounts` | `nav-accounts` | — |
| Transactions link | `nav-transactions` | `nav-transactions` | — |
| User info | `user-info` | `user-info` | — |
| Logout button | `logout-btn` | `logout-button` | `logout` |

---

## Data Storage — `lib/bankStorage.js`

All state is in browser `localStorage`. No API calls, no backend.

**Keys:**
| Key | Contents |
|---|---|
| `bankAccounts` | JSON array of account objects |
| `bankTransactions` | JSON array of transaction objects |
| `rememberedUser` | Username string (from "Remember me") |
| `currentUser` | (sessionStorage) Logged-in username |

**Default seed data (on first load):**
- Account 1: "Primary Savings" — savings — $5,000.00 — active
- Account 2: "Checking Account" — checking — $2,500.00 — active — overdraft enabled
- Transaction 1: initial deposit of $1,000 to Primary Savings

**Account object shape:**
```js
{
  id: "id_...",
  accountNumber: "100XXXXXXX",
  name: "Account Name",
  type: "savings" | "checking" | "credit",
  balance: 5000.00,
  status: "active" | "inactive",
  overdraft: true | false,
  createdDate: "ISO string"
}
```

**Transaction object shape:**
```js
{
  id: "id_...",
  transactionId: "TXN...",
  date: "ISO string",
  type: "deposit" | "withdrawal" | "transfer",
  accountId: "id_...",
  accountName: "Account Name",
  amount: 100.00,
  balanceAfter: 5100.00,
  description: "optional string",
  status: "completed"
}
```

**Exported functions:**
- `initializeData()` — seeds defaults if keys don't exist
- `getAccounts()` / `getAccountById(id)`
- `saveAccount(account)` — creates or updates
- `deleteAccount(id)`
- `updateAccountBalance(accountId, newBalance)`
- `getTransactions()` / `getRecentTransactions(limit)`
- `saveTransaction(transaction)` — always inserts at front (newest first)
- `filterTransactions(filters)` — filters by accountId, type, dateFrom, dateTo
- `getTotalBalance()` — sum of all account balances
- `clearAllData()` — removes both keys and re-seeds defaults
- `formatCurrency(amount)` — returns `$X,XXX.XX`
- `formatDate(dateString)` — returns `"Apr 3, 2026"`
- `formatDateTime(dateString)` — returns `"Apr 3, 2026, 02:30 PM"`

---

## Styling

**Theme:** shadcn/ui `new-york` style, slate base, with dark mode support via `next-themes`.

**Primary color pattern:** `bg-gradient-to-r from-purple-600 to-pink-600` — used on all primary buttons, the login card logo, active nav links, account balances, and brand name.

**Type color coding:**
- Deposit → `text-green-600`
- Withdrawal → `text-red-600`
- Transfer → `text-blue-600`

**Layout:** `container mx-auto max-w-5xl` wrapper from `(bank)/layout.js`. Pages use `p-6 space-y-6` for main content spacing.

**Cards/sections:** `bg-card p-6 rounded-lg shadow-md` is the standard section wrapper.

**Responsive breakpoints used:**
- `grid-cols-1 md:grid-cols-3` — summary cards
- `grid-cols-1 md:grid-cols-4` — account filters
- `grid-cols-1 md:grid-cols-5` — transaction filters
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — accounts overview grid

**Global CSS:** `globals.css` has `.bank-page header, .bank-page footer { display: none }` which hides the site-wide header and footer when on bank pages (except the login page).

---

## Auth / Session Flow

```
/bank (login)
  → valid credentials → sessionStorage.setItem("currentUser", username)
  → redirect to /bank/dashboard

/bank/dashboard | /bank/accounts | /bank/transactions
  → useEffect on mount: sessionStorage.getItem("currentUser")
  → if not found: router.push("/bank")

BankNavbar logout
  → confirm() dialog
  → sessionStorage.removeItem("currentUser")
  → document.body.classList.remove("bank-page")
  → router.push("/bank")
```

---

## Known Automation Testing Scenarios

### Login
- Valid login (`admin` / `admin123`)
- Invalid credentials — error alert appears
- Empty username or password — inline field errors
- Remember me — username pre-filled on next visit
- Password visibility toggle
- Theme toggle (dark ↔ light)
- Auto-redirect when already logged in

### Accounts
- Create account (all 3 types)
- Edit account — verify prefilled form
- Delete account — confirm dialog flow
- Search by name, search by account number
- Filter by type (savings / checking / credit)
- Sort by name, balance, date
- Reset filters
- Form validation on empty required fields
- URL param `?action=add` auto-opens modal

### Transactions
- Create deposit
- Create withdrawal
- Create transfer (two records created)
- Insufficient balance error
- Same-account transfer error
- Filter by account, type, date range
- Reset filters
- Export CSV download
- Character counter in description (0/200)
- Send notification checkbox (UI only)
- URL param `?action=new` auto-opens modal

### Navigation
- Dashboard → Accounts → Transactions links
- Active link styling
- Logout via confirm dialog
- Redirect to `/bank` when session missing
- Quick action buttons on dashboard

---

## What Does NOT Exist Yet

- No server-side auth (all client-side)
- No real email notifications (checkbox is decorative)
- No transaction edit or delete (create-only)
- No pagination on any table
- No account balance history chart
- No multi-user support
- No API endpoints — purely `localStorage`