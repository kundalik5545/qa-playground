"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BankNavbar from "@/app/(bank)/bank/_components/BankNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  getAccountById,
  getTransactions,
  formatCurrency,
  formatDate,
  formatDateTime,
  initializeData,
  getCurrentSession,
} from "@/lib/bankStorage";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Gem,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";

const TYPE_ICONS = {
  savings: Building2,
  checking: CreditCard,
  credit: Gem,
};

export default function AccountDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [username, setUsername] = useState("Admin");
  const [account, setAccount] = useState(null);
  const [accountTransactions, setAccountTransactions] = useState([]);
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

      const acc = getAccountById(params.id);
      if (!acc) {
        setNotFound(true);
        return;
      }
      setAccount(acc);

      const txns = getTransactions().filter((t) => t.accountId === params.id);
      setAccountTransactions(txns);
    }
  }, [router, params.id]);

  const getTransactionIcon = (type) => {
    const icons = { deposit: "💰", withdrawal: "💸", transfer: "🔄" };
    return icons[type] || "💵";
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-background" id="account-detail-page">
        <BankNavbar username={username} />
        <main className="container mx-auto p-6">
          <div
            className="text-center py-20"
            id="account-not-found"
            data-testid="not-found"
          >
            <p className="text-2xl text-muted-foreground mb-4">
              Account not found
            </p>
            <Button asChild variant="outline">
              <Link href="/bank/accounts">← Back to Accounts</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!account) return null;

  const TypeIcon = TYPE_ICONS[account.type] || Building2;

  return (
    <div className="min-h-screen bg-background" id="account-detail-page">
      <BankNavbar username={username} />

      <main
        className="container mx-auto p-6 space-y-6"
        id="account-detail-main"
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
            href="/bank/accounts"
            className="hover:text-foreground transition-colors"
            data-testid="breadcrumb-item-2"
            id="breadcrumb-accounts"
          >
            Accounts
          </Link>
          <span className="mx-1">›</span>
          <span
            className="text-foreground font-medium"
            data-testid="breadcrumb-item-3"
            id="breadcrumb-current"
          >
            {account.name}
          </span>
        </nav>

        {/* Back button + Open Statement */}
        <div className="flex items-center gap-3">
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
          <a
            href={`/bank/accounts/${params.id}?statement=true`}
            target="_blank"
            rel="noopener noreferrer"
            id="open-statement-link"
            data-testid="open-statement-link"
            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 border rounded-md hover:bg-accent transition-colors"
          >
            📄 Open Statement
          </a>
        </div>

        {/* Account Header Card */}
        <Card
          id="account-detail-card"
          data-testid="account-detail-card"
          data-account-id={account.id}
        >
          <CardHeader className="pb-4" id="account-detail-card-header">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                  <TypeIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <CardTitle
                    className="text-2xl"
                    id="account-detail-name"
                    data-testid="account-detail-name"
                  >
                    {account.name}
                  </CardTitle>
                  <p
                    className="text-muted-foreground font-mono text-sm mt-1"
                    id="account-detail-number"
                    data-testid="account-detail-number"
                  >
                    {account.accountNumber}
                  </p>
                </div>
              </div>
              <Badge
                variant={account.status === "active" ? "default" : "secondary"}
                id="account-detail-status-badge"
                data-testid="account-detail-status"
              >
                {account.status.charAt(0).toUpperCase() +
                  account.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent id="account-detail-card-content">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div id="detail-balance">
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <p
                  className="text-3xl font-bold text-purple-600"
                  id="account-detail-balance"
                  data-testid="account-detail-balance"
                >
                  {formatCurrency(account.balance)}
                </p>
              </div>
              <div id="detail-type">
                <p className="text-sm text-muted-foreground mb-1">
                  Account Type
                </p>
                <p
                  className="font-semibold capitalize"
                  id="account-detail-type"
                  data-testid="account-detail-type"
                >
                  {account.type}
                </p>
              </div>
              <div id="detail-overdraft">
                <p className="text-sm text-muted-foreground mb-1">
                  Overdraft Protection
                </p>
                <div
                  className="flex items-center gap-1 font-semibold"
                  id="account-detail-overdraft"
                  data-testid="account-detail-overdraft"
                >
                  {account.overdraft ? (
                    <>
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Enabled</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Disabled</span>
                    </>
                  )}
                </div>
              </div>
              <div id="detail-created">
                <p className="text-sm text-muted-foreground mb-1">Opened On</p>
                <p
                  className="font-semibold"
                  id="account-detail-created"
                  data-testid="account-detail-created"
                >
                  {formatDate(account.createdDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Transactions */}
        <section
          className="bg-card rounded-lg shadow-md"
          id="account-transactions-section"
        >
          <div className="p-6 pb-0">
            <h2
              className="text-xl font-bold"
              id="account-transactions-title"
              data-testid="account-transactions-title"
            >
              Transaction History
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({accountTransactions.length})
              </span>
            </h2>
          </div>
          <div
            className="rounded-md border m-6"
            id="account-transactions-table-wrapper"
          >
            <Table
              id="account-transactions-table"
              data-testid="account-transactions-table"
            >
              <TableHeader>
                <TableRow>
                  <TableHead data-column="id">Transaction ID</TableHead>
                  <TableHead data-column="date">Date & Time</TableHead>
                  <TableHead data-column="type">Type</TableHead>
                  <TableHead data-column="amount">Amount</TableHead>
                  <TableHead data-column="balance">Balance After</TableHead>
                  <TableHead data-column="description">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody
                id="account-transactions-tbody"
                data-testid="account-transactions-tbody"
              >
                {accountTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                      data-testid="empty-state"
                    >
                      No transactions for this account
                    </TableCell>
                  </TableRow>
                ) : (
                  accountTransactions.map((txn) => (
                    <TableRow
                      key={txn.id}
                      id={`acct-txn-row-${txn.id}`}
                      data-testid={`acct-txn-row-${txn.id}`}
                      data-transaction-id={txn.id}
                    >
                      <TableCell className="font-mono text-sm">
                        <Link
                          href={`/bank/transactions/${txn.id}`}
                          data-testid="transaction-id-link"
                          className="text-purple-600 hover:underline"
                        >
                          {txn.transactionId}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDateTime(txn.date)}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            txn.type === "deposit"
                              ? "text-green-600"
                              : txn.type === "withdrawal"
                                ? "text-red-600"
                                : "text-blue-600"
                          }`}
                        >
                          {getTransactionIcon(txn.type)}{" "}
                          {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell
                        className={
                          txn.type === "withdrawal"
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {txn.type === "withdrawal" ? "-" : "+"}
                        {formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell>{formatCurrency(txn.balanceAfter)}</TableCell>
                      <TableCell>{txn.description || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    </div>
  );
}
