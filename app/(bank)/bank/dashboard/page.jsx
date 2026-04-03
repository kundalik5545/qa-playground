"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BankNavbar from "@/app/(bank)/bank/_components/BankNavbar";
import BankBreadcrumb from "@/app/(bank)/bank/_components/BankBreadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAccounts,
  getTransactions,
  getRecentTransactions,
  getTotalBalance,
  formatCurrency,
  formatDate,
  initializeData,
  getCurrentSession,
  getPinnedAccountsOrder,
  savePinnedAccountsOrder,
} from "@/lib/bankStorage";
import {
  Wallet,
  CreditCard,
  TrendingUp,
  Plus,
  Eye,
  GripVertical,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
} from "lucide-react";
import BankTestCases from "@/app/(bank)/bank/_components/BankTestCases";
import { bankDashboardTC } from "@/data/bankTestCases";

// Account type styles for richer cards (UI-2)
const ACCOUNT_TYPE_STYLES = {
  savings: {
    bg: "bg-blue-100   dark:bg-blue-900/30",
    text: "text-blue-600   dark:text-blue-400",
    bar: "bg-blue-400   dark:bg-blue-600",
    label: "Savings",
    emoji: "🏦",
  },
  checking: {
    bg: "bg-green-100  dark:bg-green-900/30",
    text: "text-green-600  dark:text-green-400",
    bar: "bg-green-400  dark:bg-green-600",
    label: "Checking",
    emoji: "💳",
  },
  credit: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-600 dark:text-orange-400",
    bar: "bg-orange-400 dark:bg-orange-600",
    label: "Credit",
    emoji: "💎",
  },
};

const STATUS_STYLES = {
  active:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  inactive:
    "bg-red-100   text-red-700   border-red-200   dark:bg-red-900/30   dark:text-red-300   dark:border-red-800",
};

function SkeletonCard({ id, testId }) {
  return (
    <Card
      className="animate-pulse"
      id={id}
      data-testid={testId}
      data-testid-skeleton="skeleton-card"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-8 w-8 bg-muted rounded-full" />
      </CardHeader>
      <CardContent>
        <div
          className="h-8 bg-muted rounded w-1/2"
          data-testid="skeleton-card"
        />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState("Admin");
  const [role, setRole] = useState("admin");
  const [pinnedAccounts, setPinnedAccounts] = useState([]);
  const [dragOverActive, setDragOverActive] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [accountsCount, setAccountsCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Count-up display values (UI-1)
  const [displayBalance, setDisplayBalance] = useState(0);
  const [displayAccountsCount, setDisplayAccountsCount] = useState(0);
  const [displayTransactionsCount, setDisplayTransactionsCount] = useState(0);

  // Trend data (UI-1)
  const [accountsThisWeek, setAccountsThisWeek] = useState(0);
  const [transactionsThisWeek, setTransactionsThisWeek] = useState(0);
  const [depositsThisWeek, setDepositsThisWeek] = useState(0);

  // 7-day chart data (UI-3)
  const [chartStats, setChartStats] = useState([]);

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

      // Artificial 800ms load delay — lets engineers practice wait-for-element strategies
      setTimeout(() => {
        loadDashboardData();
        setIsLoading(false);
      }, 800);
    }
  }, [router]);

  const loadDashboardData = () => {
    const accountsData = getAccounts();
    const allTxns = getTransactions();
    const recentTxns = allTxns.slice(0, 5);
    const balance = getTotalBalance();

    setAccounts(accountsData);
    setAccountsCount(accountsData.length);
    setTotalBalance(balance);
    setTransactionsCount(allTxns.length);
    setRecentTransactions(recentTxns);

    // Trend data — last 7 days (UI-1)
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    const newAccounts = accountsData.filter(
      (a) => new Date(a.createdDate) >= weekAgo,
    ).length;
    const newTxns = allTxns.filter((t) => new Date(t.date) >= weekAgo).length;
    const weekDeposits = allTxns
      .filter((t) => t.type === "deposit" && new Date(t.date) >= weekAgo)
      .reduce((s, t) => s + t.amount, 0);
    setAccountsThisWeek(newAccounts);
    setTransactionsThisWeek(newTxns);
    setDepositsThisWeek(weekDeposits);

    // 7-day chart stats (UI-3)
    const stats = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const datePrefix = d.toISOString().split("T")[0];
      const dayTxns = allTxns.filter((t) => t.date.startsWith(datePrefix));
      return {
        label: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        deposits: dayTxns
          .filter((t) => t.type === "deposit")
          .reduce((s, t) => s + t.amount, 0),
        withdrawals: dayTxns
          .filter((t) => t.type === "withdrawal")
          .reduce((s, t) => s + t.amount, 0),
      };
    });
    setChartStats(stats);

    // Build pinned accounts list ordered by saved order
    const savedOrder = getPinnedAccountsOrder();
    if (savedOrder.length > 0) {
      const ordered = [];
      savedOrder.forEach((id) => {
        const acc = accountsData.find((a) => a.id === id);
        if (acc) ordered.push(acc);
      });
      // append any accounts not yet in the saved order
      accountsData.forEach((a) => {
        if (!savedOrder.includes(a.id)) ordered.push(a);
      });
      setPinnedAccounts(ordered);
    } else {
      setPinnedAccounts(accountsData);
    }
  };

  // Count-up animation (UI-1) — triggers when loading completes
  useEffect(() => {
    if (isLoading) return;
    const steps = 40;
    const interval = 25; // ms
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const p = step / steps;
      setDisplayBalance(totalBalance * p);
      setDisplayAccountsCount(Math.round(accountsCount * p));
      setDisplayTransactionsCount(Math.round(transactionsCount * p));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [isLoading, totalBalance, accountsCount, transactionsCount]);

  // Drag-and-drop handlers (P3-C)
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverActive(true);
  };

  const handleDragLeave = () => {
    setDragOverActive(false);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    setDragOverActive(false);
    if (!draggedId || draggedId === targetId) return;

    setPinnedAccounts((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((a) => a.id === draggedId);
      const toIdx = next.findIndex((a) => a.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      savePinnedAccountsOrder(next.map((a) => a.id));
      return next;
    });
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverActive(false);
  };

  const getTransactionIcon = (type) => {
    const icons = { deposit: "💰", withdrawal: "💸", transfer: "🔄" };
    return icons[type] || "💵";
  };

  const getAccountIcon = (type) => {
    const icons = { savings: "🏦", checking: "💳", credit: "💎" };
    return icons[type] || "💰";
  };

  return (
    <div
      className="min-h-screen bg-background"
      id="dashboard-page-container"
      data-loading={isLoading ? "true" : "false"}
    >
      <BankNavbar username={username} role={role} />

      <main
        className="container mx-auto p-6 space-y-6"
        id="dashboard-main-content"
      >
        <header
          className="flex justify-between items-center"
          id="dashboard-header"
        >
          <div id="dashboard-header-content">
            <BankBreadcrumb items={[
              { label: 'Home', href: '/' },
              { label: 'Bank Demo', href: '/bank' },
              { label: 'Dashboard' }
            ]} />
            <h1
              className="text-4xl font-bold"
              id="page-title"
              data-testid="page-title"
            >
              SecureBank Dashboard — QA Automation Practice
            </h1>
            <p
              className="text-muted-foreground mt-2"
              id="welcome-message"
              data-testid="welcome-message"
            >
              Welcome back, <span id="user-name">{username}</span>!
            </p>
            <p
              className={`text-sm mt-1 font-medium ${
                role === "viewer"
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-purple-600"
              }`}
              id="role-indicator"
              data-testid="role-indicator"
            >
              You are logged in as:{" "}
              {role === "viewer" ? "Read-only Viewer" : "Admin"}
            </p>
          </div>
        </header>

        {/* Summary Cards */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          id="summary-section"
        >
          {isLoading ? (
            <>
              <SkeletonCard
                id="total-balance-card"
                testId="total-balance-card"
              />
              <SkeletonCard
                id="accounts-count-card"
                testId="accounts-count-card"
              />
              <SkeletonCard
                id="transactions-count-card"
                testId="transactions-count-card"
              />
            </>
          ) : (
            <>
              {/* Total Balance */}
              <Card
                className="hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/10 border-purple-200 dark:border-purple-800"
                id="total-balance-card"
                data-testid="total-balance-card"
              >
                <CardHeader
                  className="flex flex-row items-center justify-between pb-2"
                  id="total-balance-card-header"
                >
                  <CardTitle
                    className="text-sm font-medium text-muted-foreground"
                    id="total-balance-title"
                  >
                    Total Balance
                  </CardTitle>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                    <Wallet
                      className="h-5 w-5 text-purple-600"
                      id="total-balance-icon"
                    />
                  </div>
                </CardHeader>
                <CardContent id="total-balance-card-content">
                  <div
                    className="text-3xl font-bold text-purple-600"
                    id="total-balance"
                    data-testid="total-balance"
                  >
                    {formatCurrency(displayBalance)}
                  </div>
                  {depositsThisWeek > 0 && (
                    <p
                      className="text-xs text-muted-foreground mt-1"
                      id="balance-trend"
                    >
                      +{formatCurrency(depositsThisWeek)} in deposits this week
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Active Accounts */}
              <Card
                className="hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-950/30 dark:to-pink-900/10 border-pink-200 dark:border-pink-800"
                id="accounts-count-card"
                data-testid="accounts-count-card"
              >
                <CardHeader
                  className="flex flex-row items-center justify-between pb-2"
                  id="accounts-count-card-header"
                >
                  <CardTitle
                    className="text-sm font-medium text-muted-foreground"
                    id="accounts-count-title"
                  >
                    Active Accounts
                  </CardTitle>
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-full">
                    <CreditCard
                      className="h-5 w-5 text-pink-600"
                      id="accounts-count-icon"
                    />
                  </div>
                </CardHeader>
                <CardContent id="accounts-count-card-content">
                  <div
                    className="text-3xl font-bold text-pink-600"
                    id="accounts-count"
                    data-testid="accounts-count"
                  >
                    {displayAccountsCount}
                  </div>
                  <p
                    className="text-xs text-muted-foreground mt-1"
                    id="accounts-trend"
                  >
                    {accountsThisWeek > 0
                      ? `+${accountsThisWeek} new this week`
                      : "No new accounts this week"}
                  </p>
                </CardContent>
              </Card>

              {/* Total Transactions */}
              <Card
                className="hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/10 border-blue-200 dark:border-blue-800"
                id="transactions-count-card"
                data-testid="transactions-count-card"
              >
                <CardHeader
                  className="flex flex-row items-center justify-between pb-2"
                  id="transactions-count-card-header"
                >
                  <CardTitle
                    className="text-sm font-medium text-muted-foreground"
                    id="transactions-count-title"
                  >
                    Total Transactions
                  </CardTitle>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                    <TrendingUp
                      className="h-5 w-5 text-blue-600"
                      id="transactions-count-icon"
                    />
                  </div>
                </CardHeader>
                <CardContent id="transactions-count-card-content">
                  <div
                    className="text-3xl font-bold text-blue-600"
                    id="transactions-count"
                    data-testid="transactions-count"
                  >
                    {displayTransactionsCount}
                  </div>
                  <p
                    className="text-xs text-muted-foreground mt-1"
                    id="transactions-trend"
                  >
                    {transactionsThisWeek > 0
                      ? `+${transactionsThisWeek} this week`
                      : "No transactions this week"}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </section>

        {/* Quick Actions */}
        <section
          className="bg-card p-6 rounded-lg shadow-md"
          id="quick-actions"
        >
          <h2 className="text-2xl font-bold mb-4" id="quick-actions-title">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4" id="quick-actions-buttons">
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600"
              id="add-account-quick"
              data-testid="quick-add-account"
              data-action="add-account"
            >
              <Link href="/bank/accounts?action=add" id="add-account-link">
                <Plus className="mr-2 h-4 w-4" id="add-account-icon" /> Add
                Account
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600"
              id="new-transaction-quick"
              data-testid="quick-new-transaction"
              data-action="new-transaction"
            >
              <Link
                href="/bank/transactions?action=new"
                id="new-transaction-link"
              >
                <Plus className="mr-2 h-4 w-4" id="new-transaction-icon" /> New
                Transaction
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              id="view-all-accounts"
              data-testid="quick-view-accounts"
              data-action="view-accounts"
            >
              <Link href="/bank/accounts" id="view-accounts-link">
                <Eye className="mr-2 h-4 w-4" id="view-accounts-icon" /> View
                All Accounts
              </Link>
            </Button>
          </div>
        </section>

        {/* Quick Stats — 7-day CSS bar chart (UI-3) */}
        {!isLoading &&
          chartStats.some((d) => d.deposits > 0 || d.withdrawals > 0) && (
            <section
              className="bg-card p-6 rounded-lg shadow-md"
              id="quick-stats-section"
              data-testid="quick-stats-section"
            >
              <h2 className="text-2xl font-bold mb-1" id="quick-stats-title">
                Quick Stats
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Last 7 days — deposits vs withdrawals
              </p>
              <div
                className="flex items-end gap-3 h-24"
                id="quick-stats-chart"
                data-testid="quick-stats-chart"
                aria-label="7-day deposit vs withdrawal chart"
              >
                {(() => {
                  const maxVal = Math.max(
                    ...chartStats.flatMap((d) => [d.deposits, d.withdrawals]),
                    1,
                  );
                  return chartStats.map((day, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 flex-1"
                      title={`${day.label}: +${formatCurrency(day.deposits)} / -${formatCurrency(day.withdrawals)}`}
                    >
                      <div className="flex items-end gap-0.5 h-16 w-full justify-center">
                        <div
                          className="w-3 rounded-t bg-green-400 dark:bg-green-600 transition-all"
                          style={{
                            height: `${Math.max((day.deposits / maxVal) * 100, day.deposits > 0 ? 4 : 0)}%`,
                          }}
                          aria-label={`Deposits ${formatCurrency(day.deposits)}`}
                        />
                        <div
                          className="w-3 rounded-t bg-red-400 dark:bg-red-600 transition-all"
                          style={{
                            height: `${Math.max((day.withdrawals / maxVal) * 100, day.withdrawals > 0 ? 4 : 0)}%`,
                          }}
                          aria-label={`Withdrawals ${formatCurrency(day.withdrawals)}`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {day.label}
                      </span>
                    </div>
                  ));
                })()}
              </div>
              <div className="flex gap-4 mt-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="w-3 h-3 rounded bg-green-400 dark:bg-green-600 inline-block" />{" "}
                  Deposits
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="w-3 h-3 rounded bg-red-400 dark:bg-red-600 inline-block" />{" "}
                  Withdrawals
                </span>
              </div>
            </section>
          )}

        {/* Pinned Accounts (P3-C) */}
        {!isLoading && pinnedAccounts.length > 0 && (
          <section
            className="bg-card p-6 rounded-lg shadow-md"
            id="pinned-accounts-section"
            data-testid="pinned-accounts-section"
          >
            <h2 className="text-2xl font-bold mb-1" id="pinned-accounts-title">
              Pinned Accounts
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Drag to reorder your pinned accounts.
            </p>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg transition-colors ${
                dragOverActive ? "bg-purple-50 dark:bg-purple-900/10" : ""
              }`}
              id="pinned-accounts-drop-zone"
              data-testid="drop-zone"
              data-drop-active={dragOverActive ? "true" : "false"}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {pinnedAccounts.map((account) => (
                <div
                  key={account.id}
                  id={`pinned-account-card-${account.id}`}
                  data-testid={`draggable-account-${account.id}`}
                  data-account-id={account.id}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, account.id)}
                  onDrop={(e) => handleDrop(e, account.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-4 border rounded-lg bg-background cursor-grab active:cursor-grabbing transition-opacity ${
                    draggedId === account.id ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <GripVertical
                    className="h-5 w-5 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                  <div className="text-2xl shrink-0">
                    {getAccountIcon(account.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold truncate"
                      id={`pinned-account-name-${account.id}`}
                    >
                      {account.name}
                    </p>
                    <p
                      className="text-purple-600 font-bold text-sm"
                      id={`pinned-account-balance-${account.id}`}
                    >
                      {formatCurrency(account.balance)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {account.type} • {account.accountNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Transactions */}
        <section
          className="bg-card p-6 rounded-lg shadow-md"
          id="recent-transactions-section"
        >
          <h2
            className="text-2xl font-bold mb-4"
            id="recent-transactions-title"
          >
            Recent Transactions
          </h2>
          <div
            className="rounded-md border"
            id="recent-transactions-table-wrapper"
          >
            {isLoading ? (
              <div
                className="p-4 space-y-3 animate-pulse"
                data-testid="skeleton-card"
              >
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-4 bg-muted rounded flex-1" />
                    <div className="h-4 bg-muted rounded flex-1" />
                    <div className="h-4 bg-muted rounded flex-1" />
                    <div className="h-4 bg-muted rounded w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <Table
                id="recent-transactions-table"
                data-testid="recent-transactions-table"
              >
                <TableHeader id="recent-transactions-header">
                  <TableRow id="recent-transactions-header-row">
                    <TableHead data-column="date" id="header-date">
                      Date
                    </TableHead>
                    <TableHead data-column="type" id="header-type">
                      Type
                    </TableHead>
                    <TableHead data-column="account" id="header-account">
                      Account
                    </TableHead>
                    <TableHead data-column="amount" id="header-amount">
                      Amount
                    </TableHead>
                    <TableHead data-column="status" id="header-status">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody
                  id="transactions-tbody"
                  data-testid="transactions-tbody"
                >
                  {recentTransactions.length === 0 ? (
                    <TableRow id="empty-transactions">
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                        id="empty-transactions-message"
                        data-testid="empty-state"
                      >
                        No transactions yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        data-transaction-id={transaction.id}
                        id={`recent-transaction-row-${transaction.id}`}
                      >
                        <TableCell
                          id={`recent-transaction-date-${transaction.id}`}
                        >
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell
                          id={`recent-transaction-type-${transaction.id}`}
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
                          id={`recent-transaction-account-${transaction.id}`}
                        >
                          {transaction.accountName}
                        </TableCell>
                        <TableCell
                          className={
                            transaction.type === "withdrawal"
                              ? "text-red-600"
                              : "text-green-600"
                          }
                          id={`recent-transaction-amount-${transaction.id}`}
                        >
                          {transaction.type === "withdrawal" ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell
                          id={`recent-transaction-status-${transaction.id}`}
                        >
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                            id={`recent-transaction-badge-${transaction.id}`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </section>

        {/* Accounts Overview */}
        <section
          className="bg-card p-6 rounded-lg shadow-md"
          id="accounts-overview"
        >
          <h2 className="text-2xl font-bold mb-4" id="accounts-overview-title">
            Accounts Overview
          </h2>
          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse"
              data-testid="skeleton-card"
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-muted rounded-lg p-6 space-y-3">
                  <div className="h-10 w-10 bg-muted-foreground/20 rounded-full" />
                  <div className="h-5 bg-muted-foreground/20 rounded w-3/4" />
                  <div className="h-7 bg-muted-foreground/20 rounded w-1/2" />
                  <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              id="accounts-list"
              data-testid="accounts-grid"
            >
              {accounts.length === 0 ? (
                <div
                  className="col-span-full bg-muted p-8 rounded-lg text-center"
                  id="empty-accounts"
                  data-testid="empty-state"
                >
                  <p
                    className="text-muted-foreground"
                    id="empty-accounts-message"
                  >
                    No accounts found. Create your first account!
                  </p>
                </div>
              ) : (
                accounts.map((account) => {
                  const typeStyle =
                    ACCOUNT_TYPE_STYLES[account.type] ||
                    ACCOUNT_TYPE_STYLES.savings;
                  const balancePct =
                    totalBalance > 0
                      ? Math.min((account.balance / totalBalance) * 100, 100)
                      : 0;
                  return (
                    <Card
                      key={account.id}
                      className="hover:shadow-lg transition-all"
                      data-account-id={account.id}
                      id={`account-card-${account.id}`}
                    >
                      <CardHeader
                        className="flex flex-row items-center justify-between pb-2"
                        id={`account-card-header-${account.id}`}
                      >
                        <div
                          className={`p-3 rounded-full ${typeStyle.bg}`}
                          id={`account-icon-${account.id}`}
                        >
                          <span className="text-xl">{typeStyle.emoji}</span>
                        </div>
                        <Badge
                          className={STATUS_STYLES[account.status] || "border"}
                          id={`account-overview-status-${account.id}`}
                        >
                          {account.status.charAt(0).toUpperCase() +
                            account.status.slice(1)}
                        </Badge>
                      </CardHeader>
                      <CardContent id={`account-card-content-${account.id}`}>
                        <h3
                          className="font-semibold text-lg mb-1 truncate"
                          id={`account-name-${account.id}`}
                        >
                          {account.name}
                        </h3>
                        <p
                          className={`text-2xl font-bold mb-1 ${typeStyle.text}`}
                          id={`account-balance-${account.id}`}
                        >
                          {formatCurrency(account.balance)}
                        </p>
                        <p
                          className="text-xs text-muted-foreground mb-3"
                          id={`account-details-${account.id}`}
                        >
                          {typeStyle.label} • {account.accountNumber}
                        </p>
                        {/* Mini balance bar */}
                        <div
                          className="w-full bg-muted rounded-full h-1.5"
                          id={`account-balance-bar-bg-${account.id}`}
                        >
                          <div
                            className={`h-1.5 rounded-full transition-all ${typeStyle.bar}`}
                            style={{ width: `${balancePct}%` }}
                            id={`account-balance-bar-${account.id}`}
                            title={`${balancePct.toFixed(1)}% of total balance`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {balancePct.toFixed(1)}% of total
                        </p>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </section>
      </main>

      {/* Test Cases */}
      <div className="container mx-auto px-6 pb-6 mt-8">
        <BankTestCases
          testCases={bankDashboardTC}
          title="Dashboard — Test Cases"
        />
      </div>

      <footer
        className="bg-card border-t mt-8 py-6 text-center text-muted-foreground"
        id="app-footer"
      >
        <p id="footer-text">
          &copy; 2025 SecureBank Demo - For Testing Purposes Only
        </p>
      </footer>
    </div>
  );
}
