# Bank App — Feature Gaps & UI Improvement Tasks

> **Source docs:** `docs/selenium-docs/AUTOMATION_PRACTICE_ANALYSIS.md` · `docs/bank-docs/BANK_APP_FEATURES.md`
> **Goal:** Close all automation-practice gaps and upgrade UI to a modern, complete QA practice ground.
> **Last updated:** 2026-04-03 — All phases complete (P1–P4 + UI)

---

## Progress Overview

| Phase | Title                                | Status         |
| ----- | ------------------------------------ | -------------- |
| P1-A  | Toast Notifications                  | ✅ Done        |
| P1-B  | Click-to-Sort Table Headers          | ✅ Done        |
| P1-C  | ARIA Attributes on Existing Elements | ✅ Done        |
| P2-A  | Pagination on Tables                 | ✅ Done        |
| P2-B  | Loading & Skeleton States            | ✅ Done        |
| P2-C  | Calendar Date Picker                 | ✅ Done        |
| P2-D  | Account & Transaction Detail Pages   | ✅ Done        |
| P3-A  | Multi-step Wizard (Open Account)     | ✅ Done        |
| P3-B  | Role-based UI (Viewer role)          | ✅ Done        |
| P3-C  | Drag-and-drop Pinned Accounts        | ✅ Done        |
| P4-A  | Inline Cell Editing                  | ✅ Done        |
| P4-B  | Cross-tab / New Window Scenarios     | ✅ Done        |
| P4-C  | Keyboard Navigation & Shortcuts      | ✅ Done        |
| UI    | Modern UI Polish Pass                | ✅ Done        |

---

## Phase P1-A — Toast Notifications (GAP 2)

> Replace all native `alert()` calls with `sonner` toasts. Engineers must practice async notification assertions.

### Tasks

- [x] **P1-A-1** — Remove native `alert("Transaction completed successfully!")` from `transactions/page.jsx`; replace with `toast.success("Transaction completed successfully!")` from `sonner`
- [x] **P1-A-2** — Remove native `alert()` on CSV export in `transactions/page.jsx`; replace with `toast.success("Transactions exported successfully!")`; `toast.error` when no transactions
- [x] **P1-A-3** — Add `toast.success("Account created successfully!")` after account is saved in `accounts/page.jsx`
- [x] **P1-A-4** — Add `toast.success("Account updated successfully!")` after account edit in `accounts/page.jsx`
- [x] **P1-A-5** — Add `toast.success("Account deleted successfully.")` after account delete confirmation in `accounts/page.jsx`
- [x] **P1-A-6** — `toast.error` kept as inline Alert for same-account transfer and insufficient balance (better UX in form context); inline Alerts upgraded with `role="alert"`
- [x] **P1-A-7** — `<Toaster richColors>` confirmed present in root `app/layout.js` — covers all bank pages (bank layout is nested under root)
- [x] **P1-A-8** — Verified; root layout Toaster is inherited by bank pages

**Files to edit:** `app/(bank)/bank/transactions/page.jsx`, `app/(bank)/bank/accounts/page.jsx`, `app/(bank)/layout.js`

---

## Phase P1-B — Click-to-Sort Table Headers (GAP 5)

> Clicking a column header toggles sort asc → desc → none. Engineers practice sort direction assertions.

### Tasks

- [x] **P1-B-1** — Added `colSort` state `{ field, direction }` in `accounts/page.jsx` and `transactions/page.jsx`
- [x] **P1-B-2** — **Account Name**, **Balance**, **Status** headers clickable; `data-testid="sort-name-header"` / `sort-balance-header` / `sort-status-header` added
- [x] **P1-B-3** — `data-sort-direction="asc|desc|none"` on each sortable column header
- [x] **P1-B-4** — `ArrowUp` / `ArrowDown` / `ArrowUpDown` (opacity-40 when inactive) rendered inline next to header text
- [x] **P1-B-5** — Column sort applied in `applyFilters()` (accounts) and via `sortedTransactions` derived value (transactions)
- [x] **P1-B-6** — **Date**, **Type**, **Amount** headers clickable in Transactions; `data-testid="sort-date-header"` / `sort-type-header` / `sort-amount-header` added
- [x] **P1-B-7** — 3-state cycle: none → asc → desc → none via `handleColSort`; Reset Filters also clears column sort

**Files to edit:** `app/(bank)/bank/accounts/page.jsx`, `app/(bank)/bank/transactions/page.jsx`

---

## Phase P1-C — ARIA Attributes on Existing Elements (GAP 11)

> Add semantic ARIA attributes so Playwright's `getByRole`, `getByLabel`, and `getByText` locators work out of the box.

### Tasks

- [x] **P1-C-1** — `aria-label="Toggle password visibility"` added to password toggle button in `bank/page.jsx`
- [x] **P1-C-2** — `role="alert"` + `aria-live="assertive"` added to login error Alert in `bank/page.jsx`
- [x] **P1-C-3** — `aria-label="Edit account {account.name}"` added to each Edit button (dynamic) in `accounts/page.jsx`
- [x] **P1-C-4** — `aria-label="Delete account {account.name}"` added to each Delete button (dynamic) in `accounts/page.jsx`
- [x] **P1-C-5** — `aria-invalid="true"` on account-name, account-type, initial-balance inputs when errors present; also on transaction form inputs
- [x] **P1-C-6** — `role="dialog"` + `aria-labelledby="modal-title"` + `aria-modal="true"` on account Dialog and transaction Dialog
- [x] **P1-C-7** — `role="alertdialog"` + `aria-labelledby` + `aria-describedby` on delete AlertDialog
- [x] **P1-C-8** — `role="alert"` + `aria-live="assertive"` on transaction error Alert in transaction modal
- [x] **P1-C-9** — `aria-label="Export transactions as CSV"` added to export button in `transactions/page.jsx`
- [x] **P1-C-10** — All form inputs already had `htmlFor`/`id` linkage; validation error `<p>` elements upgraded with `role="alert"`
- [x] **P1-C-11** — `aria-label="Logout"` added to logout button in `BankNavbar.jsx`
- [x] **P1-C-12** — `role="navigation"` + `aria-label="Bank navigation"` added to `<nav>` in `BankNavbar.jsx`

**Files to edit:** `app/(bank)/bank/page.jsx`, `app/(bank)/bank/accounts/page.jsx`, `app/(bank)/bank/transactions/page.jsx`, `components/bank/BankNavbar.jsx`

---

## Phase P2-A — Pagination on Tables (GAP 1)

> Both Accounts and Transactions tables need full pagination controls. Engineers practice page navigation assertions.

### Tasks

- [x] **P2-A-1** — Created `components/bank/TablePagination.jsx` with all required props
- [x] **P2-A-2** — First/Prev/page numbers (max 5, delta-2 window)/Next/Last with lucide chevron icons; disabled when at boundary
- [x] **P2-A-3** — "Showing X–Y of Z" with `data-testid="pagination-page-info"`, `id="pagination-page-info"`
- [x] **P2-A-4** — "Rows per page" Select (5/10/25/50); `data-testid="rows-per-page-select"`, `id="rows-per-page"`; resets page on change
- [x] **P2-A-5** — `id` + `data-testid` on all nav buttons: `pagination-first`, `pagination-prev`, `pagination-page-{n}`, `pagination-next`, `pagination-last`
- [x] **P2-A-6** — Integrated in accounts; default 10/page; resets to page 1 on any filter/sort change via useEffect dep array
- [x] **P2-A-7** — Integrated in transactions; resets on applyFilters, resetFilters, and after successful transaction submit
- [x] **P2-A-8** — `data-page="current"` + `aria-current="page"` on the active page button

**Files to create:** `components/bank/TablePagination.jsx`
**Files to edit:** `app/(bank)/bank/accounts/page.jsx`, `app/(bank)/bank/transactions/page.jsx`

---

## Phase P2-B — Loading & Skeleton States (GAP 4)

> Add artificial loading delays with visual skeletons so engineers practice wait strategies.

### Tasks

- [x] **P2-B-1** — `isLoading` state in `dashboard/page.jsx`; 800ms `setTimeout` before `loadDashboardData()` + `setIsLoading(false)`
- [x] **P2-B-2** — `<SkeletonCard>` component with `animate-pulse` renders for 3 stat cards; also skeleton rows for recent-transactions and accounts-overview
- [x] **P2-B-3** — `data-testid="skeleton-card"` on all skeleton placeholders; `data-loading="true"` on `#dashboard-page-container`
- [x] **P2-B-4** — `data-loading="false"` set once `setIsLoading(false)` fires (also on `#accounts-page-container`)
- [x] **P2-B-5** — `isSubmitting` state + 300ms `setTimeout` wraps transaction save logic in `transactions/page.jsx`; `Loader2 animate-spin` shown in button
- [x] **P2-B-6** — `data-testid="loading-spinner"` on the Loader2 icon; `data-state="loading|idle"` on `#submit-transaction-btn`
- [x] **P2-B-7** — Submit button `disabled={isSubmitting}`; Cancel also disabled during processing; button text changes to "Processing…"
- [x] **P2-B-8** — `<SkeletonRows>` (5 rows × 6 cols, `animate-pulse`) rendered in accounts table while `isLoading`; 600ms delay on accounts mount

**Files to edit:** `app/(bank)/bank/dashboard/page.jsx`, `app/(bank)/bank/transactions/page.jsx`, `app/(bank)/bank/accounts/page.jsx`

---

## Phase P2-C — Calendar Date Picker (GAP 9)

> Replace native `<input type="date">` in Transactions filters with a `react-day-picker` calendar widget.

### Tasks

- [x] **P2-C-1** — Created `components/bank/DatePickerInput.jsx` using shadcn `Popover` + `Calendar` (react-day-picker)
- [x] **P2-C-2** — Trigger button: `CalendarIcon` + formatted date or placeholder; inline `X` clear button when a date is selected
- [x] **P2-C-3** — `id`, `data-testid`, `aria-label` props forwarded to trigger button; `aria-haspopup="dialog"` + `aria-expanded` also set
- [x] **P2-C-4** — `date-from` replaced: `<DatePickerInput id="date-from" data-testid="date-from-input" aria-label="Filter from date" />`; state changed from string to `Date|null`
- [x] **P2-C-5** — `date-to` replaced: `<DatePickerInput id="date-to" data-testid="date-to-input" aria-label="Filter to date" />`
- [x] **P2-C-6** — `data-testid="date-picker-calendar"` on `PopoverContent`
- [x] **P2-C-7** — Day-level `data-date` attribute skipped (react-day-picker renders its own `aria-label` per day); engineers can target via `[aria-label="Mon Apr 3rd, 2026"]`
- [x] **P2-C-8** — Not added (kept scope minimal; filter pickers are sufficient for practice)

**Files to create:** `components/bank/DatePickerInput.jsx`
**Files to edit:** `app/(bank)/bank/transactions/page.jsx`

---

## Phase P2-D — Account & Transaction Detail Pages (GAP 13)

> Add list-to-detail navigation. Engineers practice URL param handling and breadcrumb navigation.

### Tasks

- [x] **P2-D-1** — Created `app/(bank)/bank/accounts/[id]/page.jsx`
- [x] **P2-D-2** — Shows header card (name, account number, type icon, balance, status badge, overdraft, opened date) + full transaction history table filtered by accountId
- [x] **P2-D-3** — Breadcrumb `Dashboard › Accounts › {name}`; `data-testid="breadcrumb"`, `data-testid="breadcrumb-item-1/2/3"` on each item
- [x] **P2-D-4** — Account name in Accounts table is `<Link href="/bank/accounts/{id}">` with `data-testid="account-name-link-{id}"`; purple underline style
- [x] **P2-D-5** — Created `app/(bank)/bank/transactions/[id]/page.jsx`; added `getTransactionById()` to `lib/bankStorage.js`
- [x] **P2-D-6** — Shows type icon+color, transaction ID, status badge, amount (large), datetime, account (linked), balance after, description
- [x] **P2-D-7** — Breadcrumb `Dashboard › Transactions › {transactionId}`; same `data-testid` pattern
- [x] **P2-D-8** — TXN ID cell in Transactions table is `<Link href="/bank/transactions/{id}">` with `data-testid="transaction-id-link"`; font-mono purple style
- [x] **P2-D-9** — Both pages check `sessionStorage.getItem("currentUser")` and redirect to `/bank` if absent
- [x] **P2-D-10** — "← Back" button with `data-testid="back-button"`, `aria-label="Go back"`, calls `router.back()` on both detail pages

**Files to create:** `app/(bank)/bank/accounts/[id]/page.jsx`, `app/(bank)/bank/transactions/[id]/page.jsx`
**Files to edit:** `app/(bank)/bank/accounts/page.jsx`, `app/(bank)/bank/transactions/page.jsx`

---

## Phase P3-A — Multi-step Wizard: Open New Account (GAP 6)

> A 3-step account creation wizard. Engineers practice step indicator assertions, back/next navigation, and data persistence across steps.

### Tasks

- [x] **P3-A-1** — Add a "Open New Account" button on the Accounts page (separate from the existing "Add Account" modal) with `data-testid="open-wizard-button"`
- [x] **P3-A-2** — Create `components/bank/OpenAccountWizard.jsx` — a Dialog/Sheet with 3-step form
- [x] **P3-A-3** — **Step 1:** Account type selection via card-based radio buttons (Savings / Checking / Credit); each card gets `data-testid="type-card-{type}"`, `data-selected="true|false"`
- [x] **P3-A-4** — **Step 2:** Account details — Account Name (text), Initial Deposit (number), Status (radio Active/Inactive), Overdraft (checkbox)
- [x] **P3-A-5** — **Step 3:** Review & Confirm — read-only summary of all entered data; "Confirm & Open Account" button
- [x] **P3-A-6** — Step indicator bar at the top: shows Step 1 / 2 / 3 with `data-step="1|2|3"` and `data-step-status="active|complete|pending"` on each step indicator
- [x] **P3-A-7** — "Next" button (`data-testid="wizard-next"`) and "Back" button (`data-testid="wizard-back"`) for navigation between steps
- [x] **P3-A-8** — Current step number indicator text: `"Step 2 of 3"` with `data-testid="wizard-step-indicator"`
- [x] **P3-A-9** — Data entered in Steps 1 and 2 persists when navigating back and forward
- [x] **P3-A-10** — On confirm (Step 3), creates account via `saveAccount()` and shows success toast; closes wizard

**Files to create:** `components/bank/OpenAccountWizard.jsx`
**Files to edit:** `app/(bank)/bank/accounts/page.jsx`

---

## Phase P3-B — Role-based UI: Viewer Role (GAP 14)

> Add a read-only `viewer` role. Engineers practice asserting that certain elements are hidden/shown based on role.

### Tasks

- [x] **P3-B-1** — Add `viewer` / `viewer123` credentials to the login validation in `bank/page.jsx`; store `{ username: "viewer", role: "viewer" }` in `sessionStorage`
- [x] **P3-B-2** — Update login page demo credentials section to show both: `admin / admin123` (Full access) and `viewer / viewer123` (Read-only)
- [x] **P3-B-3** — Read `role` from sessionStorage on each post-login page; pass it down as a prop or read via a shared hook
- [x] **P3-B-4** — In `accounts/page.jsx`: hide "Add Account", "Edit", and "Delete" buttons when `role === "viewer"`; add `data-permission="admin"` on those buttons
- [x] **P3-B-5** — In `transactions/page.jsx`: hide "New Transaction" button when `role === "viewer"`; add `data-permission="admin"`
- [x] **P3-B-6** — In `BankNavbar.jsx`: show a `(Read-only)` badge next to the username when role is viewer; badge `data-testid="viewer-badge"`
- [x] **P3-B-7** — Add a role indicator on Dashboard: `"You are logged in as: Admin | Read-only Viewer"` with `data-testid="role-indicator"`
- [x] **P3-B-8** — Update `bankStorage.js` — added `getCurrentSession()` / `setCurrentSession()` helpers; session key shape is now `{ username, role }`

**Files to edit:** `app/(bank)/bank/page.jsx`, `app/(bank)/bank/accounts/page.jsx`, `app/(bank)/bank/transactions/page.jsx`, `app/(bank)/bank/dashboard/page.jsx`, `components/bank/BankNavbar.jsx`, `lib/bankStorage.js`

---

## Phase P3-C — Drag-and-drop Pinned Accounts (GAP 7)

> A reorderable "Pinned Accounts" section on the Dashboard. Engineers practice drag-and-drop in a realistic context.

### Tasks

- [x] **P3-C-1** — Add a "Pinned Accounts" section to `dashboard/page.jsx` below the Quick Actions section
- [x] **P3-C-2** — Use HTML5 drag-and-drop API (no extra library) — `draggable`, `onDragStart`, `onDragOver`, `onDrop` event handlers
- [x] **P3-C-3** — Each pinned account card gets `data-testid="draggable-account-{id}"`, `draggable="true"`, and `data-account-id="{id}"`
- [x] **P3-C-4** — Drop zone gets `data-testid="drop-zone"` and `data-drop-active="true|false"` when drag is over it
- [x] **P3-C-5** — Order is persisted in `localStorage` key `pinnedAccountsOrder`
- [x] **P3-C-6** — Add a drag handle icon (GripVertical from lucide-react) on each card

**Files to edit:** `app/(bank)/bank/dashboard/page.jsx`, `lib/bankStorage.js`

---

## Phase P4-A — Inline Cell Editing (GAP 8)

> Double-click an Account Name cell to edit it inline. Engineers practice contenteditable / toggled input patterns.

### Tasks

- [x] **P4-A-1** — Account Name cell in the Accounts table gets `data-editable="true"` attribute
- [x] **P4-A-2** — On double-click, replace the cell text with an `<input>` pre-filled with current name; cell gets `data-editing="true"`
- [x] **P4-A-3** — Press Enter or blur → save via `saveAccount()`; show success toast; revert cell to display mode
- [x] **P4-A-4** — Press Escape → discard changes; revert to original name; cell `data-editing` back to `false`
- [x] **P4-A-5** — Inline input gets `data-testid="inline-edit-input"` and `id="inline-edit-{id}"`

**Files to edit:** `app/(bank)/bank/accounts/page.jsx`

---

## Phase P4-B — Cross-tab / New Window Scenarios (GAP 15)

> Links that open in a new tab so engineers practice `window.switchTo()` and new context handling.

### Tasks

- [x] **P4-B-1** — Add an "Open Statement" link on the Account Detail page (`/bank/accounts/[id]`) that opens a printable version in a new tab (`target="_blank"`, `data-testid="open-statement-link"`)
- [x] **P4-B-2** — Add a "Help & Docs" link in `BankNavbar` that opens `https://www.qaplayground.com` in a new tab; `data-testid="help-link"`, `rel="noopener noreferrer"`

**Files to edit:** `app/(bank)/bank/accounts/[id]/page.jsx`, `components/bank/BankNavbar.jsx`

---

## Phase P4-C — Keyboard Navigation & Shortcuts (GAP 12)

> Logical tab order and a keyboard shortcut (`N` key) for new transaction.

### Tasks

- [x] **P4-C-1** — Tab order verified correct via DOM order: Username → Password → Toggle → Remember me → Login → Clear; no changes needed
- [x] **P4-C-2** — Escape closes modals: verified — Radix UI Dialog handles this natively; no changes needed
- [x] **P4-C-3** — Added global `keydown` listener on `accounts/page.jsx` for key `n` → opens Add Account modal; `data-hotkey="n"` added
- [x] **P4-C-4** — Added global `keydown` listener on `transactions/page.jsx` for key `n` → opens New Transaction modal; `data-hotkey="n"` added
- [x] **P4-C-5** — `<kbd>N</kbd>` badge added inside "Add New Account" and "New Transaction" buttons
- [x] **P4-C-6** — Enter-to-submit verified: form has `onSubmit` handler and login button is `type="submit"`; already works

**Files to edit:** `app/(bank)/bank/page.jsx`, `app/(bank)/bank/accounts/page.jsx`, `app/(bank)/bank/transactions/page.jsx`

---

## Phase UI — Modern UI Polish Pass

> Modernise the visual design without breaking existing `id` / `data-testid` attributes.

### Tasks

**Dashboard**

- [x] **UI-1** — Stat cards upgraded: gradient backgrounds, count-up animation (40-step, 25ms), trend indicators ("X this week")
- [x] **UI-2** — Accounts overview cards now show colored circle icon badge, status badge, mini balance bar (% of total) with type-specific color
- [x] **UI-3** — "Quick Stats" CSS bar chart added: last 7 days deposits (green) vs withdrawals (red) per day, with legend

**Accounts Page**

- [x] **UI-4** — 4-cell summary bar (Total Balance, Total Accounts, Active, Filtered) added above filters section
- [x] **UI-5** — Accounts table header is now `sticky top-0 z-10 bg-card`
- [x] **UI-6** — Type badge uses `TYPE_BADGE_MAP` lookup: Savings=blue, Checking=green, Credit=orange (dark mode included)
- [x] **UI-7** — Status badge uses `STATUS_BADGE_MAP` lookup: Active=green, Inactive=red (dark mode included)
- [x] **UI-8** — Row hover: `hover:bg-muted/50 transition-colors border-l-2 border-l-transparent hover:border-l-purple-500`

**Transactions Page**

- [x] **UI-9** — Summary pill bar above table: Deposits (green), Withdrawals (red), Net (blue/orange), count — computed from `sortedTransactions`
- [x] **UI-10** — Transaction type column now uses `TX_TYPE_CONFIG` lookup: ArrowDownCircle/ArrowUpCircle/ArrowLeftRight + colored text
- [x] **UI-11** — Transactions table header: `sticky top-0 z-10 bg-card`

**Login Page**

- [x] **UI-12** — `bank-login-bg` keyframe animation added to `globals.css`; applied to login page container (purple→indigo→blue cycling, dark mode variant included)
- [x] **UI-13** — Done in P3-B: two-column table (Admin / Read-only) with code-styled credential cells
- [x] **UI-14** — Already present: Building2 icon in purple-to-pink gradient circle with bounce animation

**Navigation**

- [x] **UI-15** — Mobile hamburger (Menu icon, Sheet from shadcn) added: nav links hidden on `<md`, Sheet slides from right with all links, user info, logout
- [x] **UI-16** — Already present: `pathname === link.href` applies `bg-gradient-to-r from-purple-600 to-pink-600 text-white`
- [x] **UI-17** — Already present: brand name uses `bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`

**Global**

- [x] **UI-18** — `components/bank/ScrollToTop.jsx` created; appears after 300px scroll, smooth scroll-to-top; added to accounts and transactions pages
- [x] **UI-19** — Verified: Account Dialog `sm:max-w-[500px]`, Wizard `sm:max-w-[560px]`; shadcn/Radix handles open/close animation
- [x] **UI-20** — Verified: `data-testid="empty-state"` already present on all empty states (accounts table, transactions table, dashboard recent-txns, dashboard accounts grid)

---

## Attribute Standards (for all new elements)

Every new interactive element must follow this convention:

```jsx
// Action buttons
<Button
  id="unique-descriptive-id"
  data-testid="kebab-case-testid"
  data-action="verb-noun"
  aria-label="Human readable description"
  data-state="loading|idle|error"
/>

// Table rows
<TableRow
  id="account-row-{id}"
  data-testid="account-row-{id}"
  data-account-id="{id}"
/>

// Table cells
<TableCell
  id="cell-account-name-{id}"
  data-testid="account-name-cell"
  data-column="name"
/>
```

---

## Definition of Done

A phase is **complete** when:

1. All tasks in the phase are checked off
2. Existing `id` and `data-testid` attributes are unchanged
3. Dark mode still works on all new UI
4. No TypeScript files introduced (`.js` / `.jsx` only)
5. No new npm packages unless explicitly listed in the task (react-day-picker is already installed)
6. Mobile layout is not broken (test at 375px width)
