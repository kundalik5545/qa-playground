"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BankNavbar from "@/components/bank/BankNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
} from "@/lib/bankStorage";
import { Plus, Download, AlertCircle } from "lucide-react";

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("Admin");
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [filterAccount, setFilterAccount] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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
      const currentUser = sessionStorage.getItem("currentUser");
      if (!currentUser) {
        router.push("/bank");
        return;
      }
      setUsername(currentUser);
      initializeData();
      loadData();

      if (searchParams.get("action") === "new") {
        handleNewTransaction();
      }
    }
  }, [router, searchParams]);

  const loadData = () => {
    const accountsData = getAccounts();
    const transactionsData = getTransactions();
    setAccounts(accountsData);
    setTransactions(transactionsData);
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
    if (account) {
      setAvailableBalance(account.balance);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});
    setAlertMessage("");

    // Validation
    const errors = {};
    if (!formData.type) {
      errors.type = "Please select transaction type";
    }
    if (!formData.fromAccount) {
      errors.fromAccount = "Please select an account";
    }
    if (formData.type === "transfer" && !formData.toAccount) {
      errors.toAccount = "Please select destination account";
    }
    if (
      formData.type === "transfer" &&
      formData.fromAccount === formData.toAccount
    ) {
      setAlertMessage("Cannot transfer to the same account");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = "Please enter a valid amount";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const amount = parseFloat(formData.amount);
    const fromAccount = getAccountById(formData.fromAccount);

    // Check sufficient balance
    if (
      (formData.type === "withdrawal" || formData.type === "transfer") &&
      fromAccount.balance < amount
    ) {
      setAlertMessage("Insufficient balance for this transaction");
      return;
    }

    // Process transaction
    let newBalance = fromAccount.balance;

    if (formData.type === "deposit") {
      newBalance += amount;
    } else if (formData.type === "withdrawal") {
      newBalance -= amount;
    } else if (formData.type === "transfer") {
      newBalance -= amount;
      const toAccount = getAccountById(formData.toAccount);
      updateAccountBalance(formData.toAccount, toAccount.balance + amount);

      // Create deposit transaction for recipient
      saveTransaction({
        type: "deposit",
        accountId: formData.toAccount,
        accountName: toAccount.name,
        amount: amount,
        balanceAfter: toAccount.balance + amount,
        description: `Transfer from ${fromAccount.name}`,
      });
    }

    updateAccountBalance(formData.fromAccount, newBalance);

    // Save transaction
    saveTransaction({
      type: formData.type,
      accountId: formData.fromAccount,
      accountName: fromAccount.name,
      amount: amount,
      balanceAfter: newBalance,
      description:
        formData.description ||
        (formData.type === "transfer"
          ? `Transfer to ${getAccountById(formData.toAccount).name}`
          : ""),
    });

    setIsModalOpen(false);
    loadData();
    alert("Transaction completed successfully!");
  };

  const applyFilters = () => {
    const filters = {
      accountId: filterAccount,
      type: filterType,
      dateFrom: dateFrom,
      dateTo: dateTo,
    };
    const filtered = filterTransactions(filters);
    setTransactions(filtered);
  };

  const resetFilters = () => {
    setFilterAccount("all");
    setFilterType("all");
    setDateFrom("");
    setDateTo("");
    loadData();
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      alert("No transactions to export");
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
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    alert("Transactions exported successfully!");
  };

  const getTransactionIcon = (type) => {
    const icons = {
      deposit: "💰",
      withdrawal: "💸",
      transfer: "🔄",
    };
    return icons[type] || "💵";
  };

  return (
    <div
      className="min-h-screen bg-background"
      id="transactions-page-container"
    >
      <BankNavbar username={username} />

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
          <Button
            onClick={handleNewTransaction}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            id="new-transaction-btn"
            data-testid="new-transaction-button"
            data-action="new-transaction"
          >
            <Plus className="mr-2 h-4 w-4" id="new-transaction-icon" /> New
            Transaction
          </Button>
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
              <Label htmlFor="date-from" id="date-from-label">
                From:
              </Label>
              <Input
                type="date"
                id="date-from"
                data-testid="date-from-input"
                data-filter="date-from"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2" id="filter-date-to-container">
              <Label htmlFor="date-to" id="date-to-label">
                To:
              </Label>
              <Input
                type="date"
                id="date-to"
                data-testid="date-to-input"
                data-filter="date-to"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
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
              >
                <Download className="h-4 w-4" id="export-icon" />
              </Button>
            </div>
          </div>
        </section>

        {/* Transactions Table */}
        <section
          className="bg-card rounded-lg shadow-md"
          id="transactions-table-section"
        >
          <div className="rounded-md border" id="transactions-table-wrapper">
            <Table id="transactions-table" data-testid="transactions-table">
              <TableHeader id="transactions-table-header">
                <TableRow id="transactions-header-row">
                  <TableHead data-column="id" id="header-transaction-id">
                    Transaction ID
                  </TableHead>
                  <TableHead data-column="date" id="header-transaction-date">
                    Date & Time
                  </TableHead>
                  <TableHead data-column="type" id="header-transaction-type">
                    Type
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
                  >
                    Amount
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
                {transactions.length === 0 ? (
                  <TableRow id="empty-transactions">
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                      id="empty-transactions-message"
                    >
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      data-transaction-id={transaction.id}
                      data-testid="transaction-row"
                      id={`transaction-row-${transaction.id}`}
                    >
                      <TableCell
                        data-testid="transaction-id"
                        id={`transaction-id-${transaction.id}`}
                      >
                        {transaction.transactionId}
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
                        <span
                          className={`font-medium ${
                            transaction.type === "deposit"
                              ? "text-green-600"
                              : transaction.type === "withdrawal"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {getTransactionIcon(transaction.type)}{" "}
                          {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                        </span>
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
          </div>
        </section>
      </main>

      {/* New Transaction Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-[500px]"
          id="transaction-modal"
          data-testid="transaction-modal"
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
              <div className="space-y-2" id="transaction-type-field">
                <Label htmlFor="transaction-type" id="transaction-type-label">
                  Transaction Type *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger
                    id="transaction-type"
                    data-testid="transaction-type-select"
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
                  <p
                    className="text-sm text-destructive"
                    id="transaction-type-error"
                  >
                    {formErrors.type}
                  </p>
                )}
              </div>

              <div className="space-y-2" id="from-account-field">
                <Label htmlFor="from-account" id="from-account-label">
                  From Account *
                </Label>
                <Select
                  value={formData.fromAccount}
                  onValueChange={handleFromAccountChange}
                >
                  <SelectTrigger
                    id="from-account"
                    data-testid="from-account-select"
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
                  <p
                    className="text-sm text-destructive"
                    id="from-account-error"
                  >
                    {formErrors.fromAccount}
                  </p>
                )}
              </div>

              {formData.type === "transfer" && (
                <div className="space-y-2" id="to-account-group">
                  <Label htmlFor="to-account" id="to-account-label">
                    To Account *
                  </Label>
                  <Select
                    value={formData.toAccount}
                    onValueChange={(value) =>
                      setFormData({ ...formData, toAccount: value })
                    }
                  >
                    <SelectTrigger
                      id="to-account"
                      data-testid="to-account-select"
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
                    <p
                      className="text-sm text-destructive"
                      id="to-account-error"
                    >
                      {formErrors.toAccount}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2" id="transaction-amount-field">
                <Label
                  htmlFor="transaction-amount"
                  id="transaction-amount-label"
                >
                  Amount *
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  id="transaction-amount"
                  placeholder="0.00"
                  data-testid="transaction-amount-input"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
                {formErrors.amount && (
                  <p
                    className="text-sm text-destructive"
                    id="transaction-amount-error"
                  >
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

              <div className="space-y-2" id="transaction-description-field">
                <Label
                  htmlFor="transaction-description"
                  id="transaction-description-label"
                >
                  Description
                </Label>
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

              <div
                className="flex items-center space-x-2"
                id="notification-checkbox-container"
              >
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
                  id="send-notification-label"
                >
                  Send email notification
                </Label>
              </div>

              {alertMessage && (
                <Alert
                  variant="destructive"
                  id="transaction-alert"
                  data-testid="transaction-alert"
                >
                  <AlertCircle className="h-4 w-4" id="alert-icon" />
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600"
                id="submit-transaction-btn"
                data-testid="submit-transaction-button"
              >
                Submit Transaction
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
