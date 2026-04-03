"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import TablePagination from "@/components/bank/TablePagination";
import {
  getAccounts,
  saveAccount,
  deleteAccount,
  formatCurrency,
  initializeData,
} from "@/lib/bankStorage";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

function SkeletonRows({ cols, rows = 5 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i} className="animate-pulse">
      {Array.from({ length: cols }).map((__, j) => (
        <TableCell key={j}>
          <div className="h-4 bg-muted rounded w-3/4" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function AccountsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("Admin");
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(true);

  // Column-level sort state (takes precedence over dropdown sort when set)
  const [colSort, setColSort] = useState({ field: null, direction: "asc" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [deleteAccountName, setDeleteAccountName] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    balance: "",
    status: "active",
    overdraft: false,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUser = sessionStorage.getItem("currentUser");
      if (!currentUser) {
        router.push("/bank");
        return;
      }
      setUsername(currentUser);
      initializeData();

      // 600ms artificial load delay — lets engineers practice skeleton wait strategies
      setTimeout(() => {
        loadAccounts();
        setIsLoading(false);
      }, 600);

      if (searchParams.get("action") === "add") {
        handleAddAccount();
      }
    }
  }, [router, searchParams]);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset page when filters change
  }, [accounts, searchTerm, filterType, sortBy, colSort]);

  const loadAccounts = () => {
    const accountsData = getAccounts();
    setAccounts(accountsData);
  };

  const applyFilters = () => {
    let filtered = [...accounts];

    if (searchTerm) {
      filtered = filtered.filter(
        (acc) =>
          acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          acc.accountNumber.includes(searchTerm)
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((acc) => acc.type === filterType);
    }

    // Column sort takes precedence over dropdown sort
    if (colSort.field) {
      const dir = colSort.direction === "asc" ? 1 : -1;
      filtered.sort((a, b) => {
        if (colSort.field === "name") return a.name.localeCompare(b.name) * dir;
        if (colSort.field === "balance") return (a.balance - b.balance) * dir;
        if (colSort.field === "status")
          return a.status.localeCompare(b.status) * dir;
        return 0;
      });
    } else {
      filtered.sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "balance") return b.balance - a.balance;
        if (sortBy === "date")
          return new Date(b.createdDate) - new Date(a.createdDate);
        return 0;
      });
    }

    setFilteredAccounts(filtered);
  };

  // Derived: current page slice
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleAddAccount = () => {
    setCurrentAccount(null);
    setFormData({
      id: "",
      name: "",
      type: "",
      balance: "",
      status: "active",
      overdraft: false,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditAccount = (account) => {
    setCurrentAccount(account);
    setFormData({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      status: account.status,
      overdraft: account.overdraft || false,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteClick = (accountId, accountName) => {
    setDeleteAccountId(accountId);
    setDeleteAccountName(accountName);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteAccount(deleteAccountId);
    setIsDeleteModalOpen(false);
    loadAccounts();
    toast.success("Account deleted successfully.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) errors.name = "Account name is required";
    if (!formData.type) errors.type = "Please select account type";
    if (!formData.balance || parseFloat(formData.balance) < 0)
      errors.balance = "Please enter a valid balance";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const isEdit = !!formData.id;
    saveAccount({
      id: formData.id || undefined,
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      status: formData.status,
      overdraft: formData.overdraft,
    });
    setIsModalOpen(false);
    loadAccounts();
    toast.success(
      isEdit ? "Account updated successfully!" : "Account created successfully!"
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setSortBy("name");
    setColSort({ field: null, direction: "asc" });
    setCurrentPage(1);
  };

  return (
    <div
      className="min-h-screen bg-background"
      id="accounts-page-container"
      data-loading={isLoading ? "true" : "false"}
    >
      <BankNavbar username={username} />

      <main
        className="container mx-auto p-6 space-y-6"
        id="accounts-main-content"
      >
        <header
          className="flex justify-between items-center"
          id="accounts-header"
        >
          <h1
            className="text-4xl font-bold"
            id="page-title"
            data-testid="page-title"
          >
            Manage Accounts
          </h1>
          <Button
            onClick={handleAddAccount}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            id="add-account-btn"
            data-testid="add-account-button"
            data-action="add-account"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Account
          </Button>
        </header>

        {/* Filters */}
        <section
          className="bg-card p-6 rounded-lg shadow-md"
          id="filters-section"
        >
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            id="filters-grid"
          >
            <div className="space-y-2" id="search-filter-container">
              <Label htmlFor="search-input" id="search-label">
                Search:
              </Label>
              <div className="relative" id="search-input-wrapper">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-input"
                  placeholder="Search by name or number"
                  data-testid="search-input"
                  data-filter="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2" id="filter-type-container">
              <Label htmlFor="filter-type" id="filter-type-label">
                Account Type:
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger
                  id="filter-type"
                  data-testid="filter-type-select"
                  data-filter="type"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2" id="sort-by-container">
              <Label htmlFor="sort-by" id="sort-by-label">
                Sort By:
              </Label>
              <Select
                value={sortBy}
                onValueChange={(v) => {
                  setSortBy(v);
                  setColSort({ field: null, direction: "asc" });
                }}
              >
                <SelectTrigger
                  id="sort-by"
                  data-testid="sort-by-select"
                  data-sort="field"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Account Name</SelectItem>
                  <SelectItem value="balance">Balance</SelectItem>
                  <SelectItem value="date">Date Created</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end" id="reset-filters-container">
              <Button
                variant="outline"
                onClick={resetFilters}
                id="reset-filters-btn"
                data-testid="reset-filters-button"
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </section>

        {/* Accounts Table */}
        <section
          className="bg-card rounded-lg shadow-md"
          id="accounts-table-section"
        >
          <div className="rounded-md border" id="accounts-table-wrapper">
            <Table id="accounts-table" data-testid="accounts-table">
              <TableHeader id="accounts-table-header">
                <TableRow id="accounts-header-row">
                  <TableHead data-column="number" id="header-account-number">
                    Account Number
                  </TableHead>
                  <TableHead
                    data-column="name"
                    id="header-account-name"
                    data-testid="sort-name-header"
                    data-sort-direction={
                      colSort.field === "name" ? colSort.direction : "none"
                    }
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleColSort("name")}
                  >
                    Account Name {getSortIcon("name")}
                  </TableHead>
                  <TableHead data-column="type" id="header-account-type">
                    Type
                  </TableHead>
                  <TableHead
                    data-column="balance"
                    id="header-account-balance"
                    data-testid="sort-balance-header"
                    data-sort-direction={
                      colSort.field === "balance" ? colSort.direction : "none"
                    }
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleColSort("balance")}
                  >
                    Balance {getSortIcon("balance")}
                  </TableHead>
                  <TableHead
                    data-column="status"
                    id="header-account-status"
                    data-testid="sort-status-header"
                    data-sort-direction={
                      colSort.field === "status" ? colSort.direction : "none"
                    }
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleColSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </TableHead>
                  <TableHead data-column="actions" id="header-account-actions">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody id="accounts-tbody" data-testid="accounts-tbody">
                {isLoading ? (
                  <SkeletonRows cols={6} rows={5} />
                ) : paginatedAccounts.length === 0 ? (
                  <TableRow id="empty-accounts" data-testid="empty-state">
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                      id="empty-accounts-message"
                    >
                      No accounts found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAccounts.map((account) => (
                    <TableRow
                      key={account.id}
                      data-account-id={account.id}
                      data-testid={`account-row-${account.id}`}
                      id={`account-row-${account.id}`}
                    >
                      <TableCell
                        data-testid="account-number"
                        id={`account-number-${account.id}`}
                      >
                        {account.accountNumber}
                      </TableCell>
                      <TableCell
                        data-testid="account-name"
                        id={`account-name-${account.id}`}
                      >
                        <Link
                          href={`/bank/accounts/${account.id}`}
                          id={`account-name-link-${account.id}`}
                          data-testid={`account-name-link-${account.id}`}
                          className="text-purple-600 hover:underline font-medium"
                        >
                          {account.name}
                        </Link>
                      </TableCell>
                      <TableCell
                        data-testid="account-type"
                        id={`account-type-${account.id}`}
                      >
                        <Badge
                          variant="outline"
                          id={`account-type-badge-${account.id}`}
                        >
                          {account.type.charAt(0).toUpperCase() +
                            account.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell
                        data-testid="account-balance"
                        id={`account-balance-${account.id}`}
                      >
                        {formatCurrency(account.balance)}
                      </TableCell>
                      <TableCell
                        data-testid="account-status"
                        id={`account-status-${account.id}`}
                      >
                        <Badge
                          variant={
                            account.status === "active" ? "default" : "secondary"
                          }
                          id={`account-status-badge-${account.id}`}
                        >
                          {account.status.charAt(0).toUpperCase() +
                            account.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell id={`account-actions-${account.id}`}>
                        <div
                          className="flex gap-2"
                          id={`account-actions-container-${account.id}`}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAccount(account)}
                            data-testid={`edit-account-${account.id}`}
                            data-action="edit"
                            id={`edit-account-btn-${account.id}`}
                            aria-label={`Edit account ${account.name}`}
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDeleteClick(account.id, account.name)
                            }
                            data-testid={`delete-account-${account.id}`}
                            data-action="delete"
                            id={`delete-account-btn-${account.id}`}
                            aria-label={`Delete account ${account.name}`}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {!isLoading && filteredAccounts.length > 0 && (
              <TablePagination
                totalItems={filteredAccounts.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </div>
        </section>
      </main>

      {/* Add/Edit Account Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-[500px]"
          id="account-modal"
          data-testid="account-modal"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <DialogHeader id="account-modal-header">
            <DialogTitle id="modal-title" data-testid="modal-title">
              {currentAccount ? "Edit Account" : "Add New Account"}
            </DialogTitle>
            <DialogDescription id="modal-description">
              {currentAccount
                ? "Update account details below."
                : "Fill in the details to create a new account."}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            id="account-form"
            data-testid="account-form"
          >
            <div className="space-y-4 py-4" id="account-form-fields">
              <div className="space-y-2" id="account-name-field">
                <Label htmlFor="account-name" id="account-name-label">
                  Account Name *
                </Label>
                <Input
                  id="account-name"
                  name="accountName"
                  placeholder="e.g., My Savings Account"
                  data-testid="account-name-input"
                  value={formData.name}
                  aria-invalid={formErrors.name ? "true" : undefined}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {formErrors.name && (
                  <p
                    className="text-sm text-destructive"
                    id="account-name-error"
                    role="alert"
                  >
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2" id="account-type-field">
                <Label htmlFor="account-type" id="account-type-label">
                  Account Type *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger
                    id="account-type"
                    data-testid="account-type-select"
                    aria-invalid={formErrors.type ? "true" : undefined}
                  >
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="checking">Checking Account</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.type && (
                  <p
                    className="text-sm text-destructive"
                    id="account-type-error"
                    role="alert"
                  >
                    {formErrors.type}
                  </p>
                )}
              </div>

              <div className="space-y-2" id="initial-balance-field">
                <Label htmlFor="initial-balance" id="initial-balance-label">
                  Initial Balance *
                </Label>
                <Input
                  id="initial-balance"
                  name="initialBalance"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  data-testid="initial-balance-input"
                  value={formData.balance}
                  aria-invalid={formErrors.balance ? "true" : undefined}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: e.target.value })
                  }
                />
                {formErrors.balance && (
                  <p
                    className="text-sm text-destructive"
                    id="initial-balance-error"
                    role="alert"
                  >
                    {formErrors.balance}
                  </p>
                )}
              </div>

              <div className="space-y-2" id="account-status-field">
                <Label id="status-label">Status</Label>
                <RadioGroup
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                  id="status-radio-group"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="active"
                      id="status-active"
                      data-testid="status-active-radio"
                    />
                    <Label
                      htmlFor="status-active"
                      className="font-normal cursor-pointer"
                    >
                      Active
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="inactive"
                      id="status-inactive"
                      data-testid="status-inactive-radio"
                    />
                    <Label
                      htmlFor="status-inactive"
                      className="font-normal cursor-pointer"
                    >
                      Inactive
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-overdraft"
                  name="enableOverdraft"
                  data-testid="overdraft-checkbox"
                  checked={formData.overdraft}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, overdraft: checked })
                  }
                />
                <Label
                  htmlFor="enable-overdraft"
                  className="font-normal cursor-pointer"
                >
                  Enable Overdraft Protection
                </Label>
              </div>
            </div>

            <DialogFooter id="account-modal-footer">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                id="cancel-btn"
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600"
                id="save-account-btn"
                data-testid="save-account-button"
              >
                Save Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      >
        <AlertDialogContent
          id="delete-modal"
          data-testid="delete-modal"
          role="alertdialog"
          aria-labelledby="delete-modal-title-text"
          aria-describedby="delete-message"
        >
          <AlertDialogHeader id="delete-modal-header">
            <AlertDialogTitle
              data-testid="delete-modal-title"
              id="delete-modal-title-text"
            >
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription
              id="delete-message"
              data-testid="delete-message"
            >
              Are you sure you want to delete this account? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter id="delete-modal-footer">
            <AlertDialogCancel
              id="cancel-delete-btn"
              data-testid="cancel-delete-button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              id="confirm-delete-btn"
              data-testid="confirm-delete-button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <AccountsContent />
    </Suspense>
  );
}
