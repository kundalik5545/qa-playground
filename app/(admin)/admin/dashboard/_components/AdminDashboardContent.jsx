"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  KeyRound,
  Send,
  BookOpen,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AdminDashboardContent({
  adminName,
  initialStats,
  initialUsers,
  initialTotal,
}) {
  const router = useRouter();

  const [stats, setStats] = useState(initialStats);
  const [statsLoading, setStatsLoading] = useState(false);

  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [usersLoading, setUsersLoading] = useState(false);

  // Skip the first fetch — page.jsx already pre-fetched page 1 / limit 20.
  const isInitialMount = useRef(true);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?page=${page}&limit=${limit}`
      );
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
    } finally {
      setUsersLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(total / limit);

  const handleLimitChange = (val) => {
    setLimit(Number(val));
    setPage(1);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  const statCards = [
    {
      label: "Users with API Key",
      value: stats?.totalApiKeyUsers,
      icon: KeyRound,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      label: "Telegram Connected",
      value: stats?.totalTelegramConnected,
      icon: Send,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Total Resources",
      value: stats?.totalResources,
      icon: BookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Total Users",
      value: stats?.totalUsers,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-title leading-none">
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Welcome, {adminName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/site-alerts">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Bell size={14} />
                Site Alerts
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleLogout}
            >
              <LogOut size={14} />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    {statsLoading ? (
                      <div className="h-7 w-12 bg-muted animate-pulse rounded" />
                    ) : (
                      <p className="text-2xl font-bold">
                        {value?.toLocaleString() ?? "—"}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                      {label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users size={16} />
                Registered Users
                {!usersLoading && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({total.toLocaleString()} total)
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Rows per page:
                <Select
                  value={String(limit)}
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger
                    className="h-8 w-16 text-xs"
                    id="admin-users-limit-select"
                    data-testid="admin-users-limit-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table id="admin-users-table" data-testid="admin-users-table">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-6">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead className="text-center">Resources</TableHead>
                    <TableHead className="text-center">API Key</TableHead>
                    <TableHead className="text-center">Telegram</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-16 text-center">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-12 text-center text-muted-foreground text-sm"
                      >
                        No users yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user, idx) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-muted/30"
                        data-testid={`user-row-${user.id}`}
                      >
                        <TableCell className="pl-6 text-muted-foreground text-xs">
                          {(page - 1) * limit + idx + 1}
                        </TableCell>
                        <TableCell className="font-medium max-w-[140px] truncate">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          {user.emailVerified ? (
                            <CheckCircle2
                              size={15}
                              className="text-emerald-500"
                            />
                          ) : (
                            <XCircle size={15} className="text-red-400" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs px-1.5">
                            {user._count.resources}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {user._count.apiKeys > 0 ? (
                            <CheckCircle2
                              size={15}
                              className="text-emerald-500 mx-auto"
                            />
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {user.telegramUser?.chatId ? (
                            <CheckCircle2
                              size={15}
                              className="text-blue-500 mx-auto"
                            />
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t text-sm text-muted-foreground">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || usersLoading}
                    id="admin-users-prev-btn"
                    data-testid="admin-users-prev-btn"
                  >
                    <ChevronLeft size={14} />
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || usersLoading}
                    id="admin-users-next-btn"
                    data-testid="admin-users-next-btn"
                  >
                    Next
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
