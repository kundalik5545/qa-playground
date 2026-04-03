"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BankNavbar from "@/app/(bank)/bank/_components/BankNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getTransactionById,
  getAccountById,
  formatCurrency,
  formatDateTime,
  initializeData,
  getCurrentSession,
} from "@/lib/bankStorage";
import {
  ArrowLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  CheckCircle2,
} from "lucide-react";

const TYPE_CONFIG = {
  deposit: {
    icon: ArrowDownCircle,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    label: "Deposit",
  },
  withdrawal: {
    icon: ArrowUpCircle,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-900/20",
    label: "Withdrawal",
  },
  transfer: {
    icon: ArrowLeftRight,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    label: "Transfer",
  },
};

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [username, setUsername] = useState("Admin");
  const [transaction, setTransaction] = useState(null);
  const [account, setAccount] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = getCurrentSession();
      if (!session) {
        router.push("/bank");
        return;
      }
      setUsername(session.username);
      initializeData();

      const txn = getTransactionById(params.id);
      if (!txn) {
        setNotFound(true);
        return;
      }
      setTransaction(txn);
      setAccount(getAccountById(txn.accountId));
    }
  }, [router, params.id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-background" id="transaction-detail-page">
        <BankNavbar username={username} />
        <main className="container mx-auto p-6">
          <div
            className="text-center py-20"
            id="transaction-not-found"
            data-testid="not-found"
          >
            <p className="text-2xl text-muted-foreground mb-4">
              Transaction not found
            </p>
            <Button asChild variant="outline">
              <Link href="/bank/transactions">← Back to Transactions</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!transaction) return null;

  const config = TYPE_CONFIG[transaction.type] || TYPE_CONFIG.deposit;
  const TypeIcon = config.icon;
  const amountSign = transaction.type === "withdrawal" ? "-" : "+";

  return (
    <div className="min-h-screen bg-background" id="transaction-detail-page">
      <BankNavbar username={username} />

      <main
        className="container mx-auto p-6 space-y-6"
        id="transaction-detail-main"
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          id="breadcrumb"
          data-testid="breadcrumb"
          className="text-sm text-muted-foreground flex items-center gap-1"
        >
          <Link
            href="/bank/dashboard"
            className="hover:text-foreground transition-colors"
            data-testid="breadcrumb-item-1"
            id="breadcrumb-dashboard"
          >
            Dashboard
          </Link>
          <span className="mx-1">›</span>
          <Link
            href="/bank/transactions"
            className="hover:text-foreground transition-colors"
            data-testid="breadcrumb-item-2"
            id="breadcrumb-transactions"
          >
            Transactions
          </Link>
          <span className="mx-1">›</span>
          <span
            className="text-foreground font-medium font-mono"
            data-testid="breadcrumb-item-3"
            id="breadcrumb-current"
          >
            {transaction.transactionId}
          </span>
        </nav>

        {/* Back button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          id="back-button"
          data-testid="back-button"
          aria-label="Go back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Transaction Detail Card */}
        <Card
          id="transaction-detail-card"
          data-testid="transaction-detail-card"
          data-transaction-id={transaction.id}
        >
          <CardHeader className="pb-4" id="transaction-detail-header">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${config.bg} rounded-xl`}>
                  <TypeIcon className={`h-8 w-8 ${config.color}`} />
                </div>
                <div>
                  <CardTitle
                    className="text-2xl"
                    id="transaction-detail-title"
                    data-testid="transaction-detail-type"
                  >
                    {config.label}
                  </CardTitle>
                  <p
                    className="text-muted-foreground font-mono text-sm mt-1"
                    id="transaction-detail-id"
                    data-testid="transaction-detail-id"
                  >
                    {transaction.transactionId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                  id="transaction-detail-status"
                  data-testid="transaction-detail-status"
                >
                  {transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent id="transaction-detail-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <div
                className="md:col-span-2 p-4 rounded-lg bg-muted/50"
                id="transaction-detail-amount-section"
              >
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p
                  className={`text-4xl font-bold ${config.color}`}
                  id="transaction-detail-amount"
                  data-testid="transaction-detail-amount"
                >
                  {amountSign}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>

              {/* Date & Time */}
              <div id="detail-datetime">
                <p className="text-sm text-muted-foreground mb-1">
                  Date & Time
                </p>
                <p
                  className="font-semibold"
                  id="transaction-detail-datetime"
                  data-testid="transaction-detail-datetime"
                >
                  {formatDateTime(transaction.date)}
                </p>
              </div>

              {/* Account */}
              <div id="detail-account">
                <p className="text-sm text-muted-foreground mb-1">Account</p>
                <Link
                  href={`/bank/accounts/${transaction.accountId}`}
                  className="font-semibold text-purple-600 hover:underline"
                  id="transaction-detail-account-link"
                  data-testid="transaction-detail-account-link"
                >
                  {transaction.accountName}
                </Link>
                {account && (
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {account.accountNumber}
                  </p>
                )}
              </div>

              {/* Balance After */}
              <div id="detail-balance-after">
                <p className="text-sm text-muted-foreground mb-1">
                  Balance After
                </p>
                <p
                  className="font-semibold"
                  id="transaction-detail-balance-after"
                  data-testid="transaction-detail-balance-after"
                >
                  {formatCurrency(transaction.balanceAfter)}
                </p>
              </div>

              {/* Description */}
              <div id="detail-description">
                <p className="text-sm text-muted-foreground mb-1">
                  Description
                </p>
                <p
                  className="font-semibold"
                  id="transaction-detail-description"
                  data-testid="transaction-detail-description"
                >
                  {transaction.description || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
