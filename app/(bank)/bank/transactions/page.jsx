"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BankNavbar from "@/app/(bank)/bank/_components/BankNavbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import TablePagination from "@/app/(bank)/bank/_components/TablePagination";
import DatePickerInput from "@/app/(bank)/bank/_components/DatePickerInput";
import ScrollToTop from "@/app/(bank)/bank/_components/ScrollToTop";
import BankTestCases from "@/app/(bank)/bank/_components/BankTestCases";
import { bankTransactionsTC } from "@/data/bankTestCases";
import {
  getAccounts,
  getTransactions,
  saveTransaction,
  updateAccountBalance,
  getAccountById,
  filterTransactions,
  formatCurrency,
  formatDateTime,
  initializeData,
  getCurrentSession,
} from "@/lib/bankStorage";
import {
  Plus,
  Download,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  Loader2,
} from "lucide-react";

// Transaction type display config (UI-10)
const TX_TYPE_CONFIG = {
  deposit: { icon: ArrowDownCircle, color: "text-green-600", label: "Deposit" },
  withdrawal: {
    icon: ArrowUpCircle,
    color: "text-red-600",
    label: "Withdrawal",
  },
  transfer: { icon: ArrowLeftRight, color: "text-blue-600", label: "Transfer" },
};
import { toast } from "sonner";

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("Admin");
  const [role, setRole] = useState("admin");
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states — dateFrom/dateTo are Date|null (not strings)
  const [filterAccount, setFilterAccount] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  // Column sort state
  const [colSort, setColSort] = useState({ field: null, direction: "asc" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form states
  const [formData, setFormData] = useState({
    type: "",
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: "",
    sendNotification: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = getCurrentSession();
      if (!session) {
        router.push("/bank");
        return;
      }
      setUsername(session.username);
      setRole(session.role || "admin");
      initializeData();
      loadData();

      if (searchParams.get("action") === "new") {
        handleNewTransaction();
      }
    }
  }, [router, searchParams]);

  const loadData = () => {
    setAccounts(getAccounts());
    setTransactions(getTransactions());
  };

  const handleNewTransaction = () => {
    setFormData({
      type: "",
      fromAccount: "",
      toAccount: "",
      amount: "",
      description: "",
      sendNotification: true,
    });
    setFormErrors({});
    setAlertMessage("");
    setIsModalOpen(true);
  };

  const handleFromAccountChange = (accountId) => {
    setFormData({ ...formData, fromAccount: accountId });
    const account = getAccountById(accountId);
    if (account) setAvailableBalance(account.balance);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});
    setAlertMessage("");

    const errors = {};
    if (!formData.type) errors.type = "Please select transaction type";
    if (!formData.fromAccount) errors.fromAccount = "Please select an account";
    if (formData.type === "transfer" && !formData.toAccount)
      errors.toAccount = "Please select destination account";
    if (
      formData.type === "transfer" &&
      formData.fromAccount === formData.toAccount
    ) {
      setAlertMessage("Cannot transfer to the same account");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      errors.amount = "Please enter a valid amount";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const amount = parseFloat(formData.amount);
    const fromAccount = getAccountById(formData.fromAccount);

    if (
      (formData.type === "withdrawal" || formData.type === "transfer") &&
      fromAccount.balance < amount
    ) {
      setAlertMessage("Insufficient balance for this transaction");
      return;
    }

    // 300ms "processing" delay — lets engineers practice submit-button wait strategies
    setIsSubmitting(true);
    setTimeout(() => {
      let newBalance = fromAccount.balance;

      if (formData.type === "deposit") {
        newBalance += amount;
      } else if (formData.type === "withdrawal") {
        newBalance -= amount;
      } else if (formData.type === "transfer") {
        newBalance -= amount;
        const toAccount = getAccountById(formData.toAccount);
        updateAccountBalance(formData.toAccount, toAccount.balance + amount);
        saveTransaction({
          type: "deposit",
          accountId: formData.toAccount,
          accountName: toAccount.name,
          amount,
          balanceAfter: toAccount.balance + amount,
          description: `Transfer from ${fromAccount.name}`,
        });
      }

      updateAccountBalance(formData.fromAccount, newBalance);
      saveTransaction({
        type: formData.type,
        accountId: formData.fromAccount,
        accountName: fromAccount.name,
        amount,
        balanceAfter: newBalance,
        description:
          formData.description ||
          (formData.type === "transfer"
            ? `Transfer to ${getAccountById(formData.toAccount).name}`
            : ""),
      });

      setIsSubmitting(false);
      setIsModalOpen(false);
      loadData();
      setCurrentPage(1);
      toast.success("Transaction completed successfully!");
    }, 300);
  };

  const applyFilters = () => {
    const filters = {
      accountId: filterAccount,
      type: filterType,
      dateFrom: dateFrom ? dateFrom.toISOString().split("T")[0] : "",
      dateTo: dateTo ? dateTo.toISOString().split("T")[0] : "",
    };
    setTransactions(filterTransactions(filters));
    setColSort({ field: null, direction: "asc" });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterAccount("all");
    setFilterType("all");
    setDateFrom(null);
    setDateTo(null);
    setColSort({ field: null, direction: "asc" });
    setCurrentPage(1);
    loadData();
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export.");
      return;
    }
    const headers = [
      "Transaction ID",
      "Date",
      "Type",
      "Account",
      "Amount",
      "Balance After",
      "Description",
    ];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          t.transactionId,
          formatDateTime(t.date),
          t.type,
          t.accountName,
          t.amount,
          t.balanceAfter,
          t.description || "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Transactions exported successfully!");
  };

  // 'n' keyboard shortcut → open New Transaction modal (P4-C)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "n" && e.key !== "N") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable)
        return;
      if (role === "viewer") return;
      e.preventDefault();
      handleNewTransaction();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [role]);

  const handleColSort = (field) => {
    setColSort((prev) => {
      if (prev.field === field) {
        if (prev.direction === "asc") return { field, direction: "desc" };
        return { field: null, direction: "asc" };
      }
      return { field, direction: "asc" };
    });
  };

  const getSortIcon = (field) => {
    if (colSort.field !== field)
      return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-40" />;
    if (colSort.direction === "asc")
      return <ArrowUp className="ml-1 h-3 w-3 inline" />;
    return <ArrowDown className="ml-1 h-3 w-3 inline" />;
  };

  // Apply column sort (non-destructive — doesn't mutate transactions state)
  const sortedTransactions = (() => {
    if (!colSort.field) return transactions;
    const dir = colSort.direction === "asc" ? 1 : -1;
    return [...transactions].sort((a, b) => {
      if (colSort.field === "date")
        return (new Date(a.date) - new Date(b.date)) * dir;
      if (colSort.field === "type") return a.type.localeCompare(b.type) * dir;
      if (colSort.field === "amount") return (a.amount - b.amount) * dir;
      return 0;
    });
  })();

  // Pagination slice
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getTransactionIcon = (type) => {
    const icons = { deposit: "💰", withdrawal: "💸", transfer: "🔄" };
    return icons[type] || "💵";
  };

  return (
    <div
      className="min-h-screen bg-background"
      id="transactions-page-container"
    >
      <BankNavbar username={username} role={role} />
      <ScrollToTop />

      <main
        className="container mx-auto p-6 space-y-6"
        id="transactions-main-content"
      >
        <header
          className="flex justify-between items-center"
          id="transactions-header"
        >
          <h1
            className="text-4xl font-bold"
            id="page-title"
            data-testid="page-title"
          >
            Transactions
          </h1>
          {role !== "viewer" && (
            <Button
              onClick={handleNewTransaction}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
              id="new-transaction-btn"
              data-testid="new-transaction-button"
              data-action="new-transaction"
              data-permission="admin"
              data-hotkey="n"
            >
              <Plus className="mr-2 h-4 w-4" /> New Transaction
              <kbd className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded font-mono">
                N
              </kbd>
            </Button>
          )}
        </header>

        {/* Filters */}
        <section
          className="bg-card p-6 rounded-lg shadow-md"
          id="filters-section"
        >
          <div
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
            id="filters-grid"
          >
            <div className="space-y-2" id="filter-account-container">
              <Label htmlFor="filter-account" id="filter-account-label">
                Account:
              </Label>
              <Select value={filterAccount} onValueChange={setFilterAccount}>
                <SelectTrigger
                  id="filter-account"
                  data-testid="filter-account-select"
                  data-filter="account"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name} ({acc.accountNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2" id="filter-type-container">
              <Label htmlFor="filter-transaction-type" id="filter-type-label">
                Type:
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger
                  id="filter-transaction-type"
                  data-testid="filter-transaction-type-select"
                  data-filter="type"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2" id="filter-date-from-container">
              <Label id="date-from-label">From:</Label>
              <DatePickerInput
                id="date-from"
                data-testid="date-from-input"
                aria-label="Filter from date"
                value={dateFrom}
                onChange={setDateFrom}
                placeholder="Pick start date"
              />
            </div>

            <div className="space-y-2" id="filter-date-to-container">
              <Label id="date-to-label">To:</Label>
              <DatePickerInput
                id="date-to"
                data-testid="date-to-input"
                aria-label="Filter to date"
                value={dateTo}
                onChange={setDateTo}
                placeholder="Pick end date"
              />
            </div>

            <div className="flex items-end gap-2" id="filter-actions-container">
              <Button
                onClick={applyFilters}
                id="apply-filters-btn"
                data-testid="apply-filters-button"
              >
                Apply
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
                id="reset-filters-btn"
                data-testid="reset-filters-button"
              >
                Reset
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                id="export-btn"
                data-testid="export-button"
                data-action="export"
                aria-label="Export transactions as CSV"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Summary bar (UI-9) */}
        {sortedTransactions.length > 0 &&
          (() => {
            const deps = sortedTransactions
              .filter((t) => t.type === "deposit")
              .reduce((s, t) => s + t.amount, 0);
            const wdrs = sortedTransactions
              .filter((t) => t.type === "withdrawal")
              .reduce((s, t) => s + t.amount, 0);
            const net = deps - wdrs;
            return (
              <section
                className="flex flex-wrap gap-3"
                id="transactions-summary-bar"
                data-testid="transactions-summary-bar"
              >
                <div
                  className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-4 py-1.5"
                  id="summary-deposits"
                >
                  <ArrowDownCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Deposits: {formatCurrency(deps)}
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full px-4 py-1.5"
                  id="summary-withdrawals"
                >
                  <ArrowUpCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Withdrawals: {formatCurrency(wdrs)}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 border ${net >= 0 ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"}`}
                  id="summary-net"
                >
                  <ArrowLeftRight
                    className={`h-4 w-4 ${net >= 0 ? "text-blue-600" : "text-orange-600"}`}
                  />
                  <span
                    className={`text-sm font-medium ${net >= 0 ? "text-blue-700 dark:text-blue-300" : "text-orange-700 dark:text-orange-300"}`}
                  >
                    Net: {net >= 0 ? "+" : ""}
                    {formatCurrency(Math.abs(net))}
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 bg-muted rounded-full px-4 py-1.5 border"
                  id="summary-count"
                >
                  <span className="text-sm text-muted-foreground">
                    {sortedTransactions.length} transaction
                    {sortedTransactions.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </section>
            );
          })()}

        {/* Transactions Table */}
        <section
          className="bg-card rounded-lg shadow-md"
          id="transactions-table-section"
        >
          <div className="rounded-md border" id="transactions-table-wrapper">
            <Table id="transactions-table" data-testid="transactions-table">
              <TableHeader
                id="transactions-table-header"
                className="sticky top-0 z-10 bg-card"
              >
                <TableRow id="transactions-header-row">
                  <TableHead data-column="id" id="header-transaction-id">
                    Transaction ID
                  </TableHead>
                  <TableHead
                    data-column="date"
                    id="header-transaction-date"
                    data-testid="sort-date-header"
                    data-sort-direction={
                      colSort.field === "date" ? colSort.direction : "none"
                    }
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleColSort("date")}
                  >
                    Date & Time {getSortIcon("date")}
                  </TableHead>
                  <TableHead
                    data-column="type"
                    id="header-transaction-type"
                    data-testid="sort-type-header"
                    data-sort-direction={
                      colSort.field === "type" ? colSort.direction : "none"
                    }
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleColSort("type")}
                  >
                    Type {getSortIcon("type")}
                  </TableHead>
                  <TableHead
                    data-column="account"
                    id="header-transaction-account"
                  >
                    Account
                  </TableHead>
                  <TableHead
                    data-column="amount"
                    id="header-transaction-amount"
                    data-testid="sort-amount-header"
                    data-sort-direction={
                      colSort.field === "amount" ? colSort.direction : "none"
                    }
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleColSort("amount")}
                  >
                    Amount {getSortIcon("amount")}
                  </TableHead>
                  <TableHead data-column="balance" id="header-balance-after">
                    Balance After
                  </TableHead>
                  <TableHead
                    data-column="description"
                    id="header-transaction-description"
                  >
                    Description
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody
                id="transactions-tbody"
                data-testid="transactions-tbody"
              >
                {paginatedTransactions.length === 0 ? (
                  <TableRow id="empty-transactions" data-testid="empty-state">
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                      id="empty-transactions-message"
                    >
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      data-transaction-id={transaction.id}
                      data-testid="transaction-row"
                      id={`transaction-row-${transaction.id}`}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell
                        data-testid="transaction-id"
                        id={`transaction-id-${transaction.id}`}
                      >
                        <Link
                          href={`/bank/transactions/${transaction.id}`}
                          id={`transaction-id-link-${transaction.id}`}
                          data-testid="transaction-id-link"
                          className="text-purple-600 hover:underline font-mono text-sm"
                        >
                          {transaction.transactionId}
                        </Link>
                      </TableCell>
                      <TableCell
                        data-testid="transaction-date"
                        id={`transaction-date-${transaction.id}`}
                      >
                        {formatDateTime(transaction.date)}
                      </TableCell>
                      <TableCell
                        data-testid="transaction-type"
                        id={`transaction-type-${transaction.id}`}
                      >
                        {(() => {
                          const cfg =
                            TX_TYPE_CONFIG[transaction.type] ||
                            TX_TYPE_CONFIG.deposit;
                          const Icon = cfg.icon;
                          return (
                            <span
                              className={`flex items-center gap-1.5 font-medium ${cfg.color}`}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              {cfg.label}
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell
                        data-testid="transaction-account"
                        id={`transaction-account-${transaction.id}`}
                      >
                        {transaction.accountName}
                      </TableCell>
                      <TableCell
                        className={
                          transaction.type === "withdrawal"
                            ? "text-red-600"
                            : "text-green-600"
                        }
                        data-testid="transaction-amount"
                        id={`transaction-amount-${transaction.id}`}
                      >
                        {transaction.type === "withdrawal" ? "-" : "+"}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell
                        data-testid="balance-after"
                        id={`balance-after-${transaction.id}`}
                      >
                        {formatCurrency(transaction.balanceAfter)}
                      </TableCell>
                      <TableCell
                        data-testid="transaction-description"
                        id={`transaction-description-${transaction.id}`}
                      >
                        {transaction.description || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {sortedTransactions.length > 0 && (
              <TablePagination
                totalItems={sortedTransactions.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </div>
        </section>

        {/* Test Cases */}
        <BankTestCases
          testCases={bankTransactionsTC}
          title="Transactions Page — Test Cases"
        />
      </main>

      {/* New Transaction Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-[500px]"
          id="transaction-modal"
          data-testid="transaction-modal"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <DialogHeader id="transaction-modal-header">
            <DialogTitle id="modal-title" data-testid="modal-title">
              New Transaction
            </DialogTitle>
            <DialogDescription id="modal-description">
              Fill in the details to create a new transaction.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            id="transaction-form"
            data-testid="transaction-form"
          >
            <div className="space-y-4 py-4" id="transaction-form-fields">
              <div className="space-y-2">
                <Label htmlFor="transaction-type">Transaction Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger
                    id="transaction-type"
                    data-testid="transaction-type-select"
                    aria-invalid={formErrors.type ? "true" : undefined}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.type && (
                  <p className="text-sm text-destructive" role="alert">
                    {formErrors.type}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-account">From Account *</Label>
                <Select
                  value={formData.fromAccount}
                  onValueChange={handleFromAccountChange}
                >
                  <SelectTrigger
                    id="from-account"
                    data-testid="from-account-select"
                    aria-invalid={formErrors.fromAccount ? "true" : undefined}
                  >
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name} - {formatCurrency(acc.balance)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.fromAccount && (
                  <p className="text-sm text-destructive" role="alert">
                    {formErrors.fromAccount}
                  </p>
                )}
              </div>

              {formData.type === "transfer" && (
                <div className="space-y-2" id="to-account-group">
                  <Label htmlFor="to-account">To Account *</Label>
                  <Select
                    value={formData.toAccount}
                    onValueChange={(value) =>
                      setFormData({ ...formData, toAccount: value })
                    }
                  >
                    <SelectTrigger
                      id="to-account"
                      data-testid="to-account-select"
                      aria-invalid={formErrors.toAccount ? "true" : undefined}
                    >
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name} ({acc.accountNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.toAccount && (
                    <p className="text-sm text-destructive" role="alert">
                      {formErrors.toAccount}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="transaction-amount">Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  id="transaction-amount"
                  placeholder="0.00"
                  data-testid="transaction-amount-input"
                  value={formData.amount}
                  aria-invalid={formErrors.amount ? "true" : undefined}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
                {formErrors.amount && (
                  <p className="text-sm text-destructive" role="alert">
                    {formErrors.amount}
                  </p>
                )}
                <p
                  className="text-sm text-muted-foreground"
                  id="available-balance"
                >
                  Available balance: {formatCurrency(availableBalance)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-description">Description</Label>
                <Textarea
                  id="transaction-description"
                  placeholder="Optional description"
                  rows={3}
                  maxLength={200}
                  data-testid="transaction-description-input"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <p
                  className="text-xs text-right text-muted-foreground"
                  id="char-count"
                >
                  {formData.description.length}/200
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-notification"
                  data-testid="notification-checkbox"
                  checked={formData.sendNotification}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, sendNotification: checked })
                  }
                />
                <Label
                  htmlFor="send-notification"
                  className="font-normal cursor-pointer"
                >
                  Send email notification
                </Label>
              </div>

              {alertMessage && (
                <Alert
                  variant="destructive"
                  id="transaction-alert"
                  data-testid="transaction-alert"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription id="transaction-alert-message">
                    {alertMessage}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter id="transaction-modal-footer">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                id="cancel-transaction-btn"
                data-testid="cancel-transaction-button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600"
                id="submit-transaction-btn"
                data-testid="submit-transaction-button"
                data-state={isSubmitting ? "loading" : "idle"}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      data-testid="loading-spinner"
                    />
                    Processing…
                  </>
                ) : (
                  "Submit Transaction"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <TransactionsContent />
    </Suspense>
  );
}
