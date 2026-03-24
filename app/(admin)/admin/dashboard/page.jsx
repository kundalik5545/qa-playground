"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogOut, ShieldCheck, Mail, User } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.user?.role !== "ADMIN") {
      router.replace("/study-tracker");
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  if (isPending || !session || session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { name, email, role } = session.user;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      id="admin-dashboard-container"
    >
      <div className="w-full max-w-md" id="admin-dashboard-wrapper">
        <Card
          className="backdrop-blur-sm bg-card/95 shadow-2xl"
          id="admin-dashboard-card"
        >
          <CardHeader className="text-center space-y-2" id="admin-dashboard-header">
            <div className="flex justify-center mb-2">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle
              className="text-3xl font-bold gradient-title"
              id="admin-dashboard-title"
            >
              Admin Dashboard
            </CardTitle>
            <CardDescription id="admin-dashboard-subtitle">
              QA PlayGround — admin panel
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4" id="admin-dashboard-content">
            <div
              className="space-y-3 rounded-lg border p-4"
              id="user-info-section"
              data-testid="user-info-section"
            >
              <div className="flex items-center gap-3" id="user-name-row">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p
                    className="font-medium"
                    id="user-name"
                    data-testid="user-name"
                  >
                    {name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3" id="user-email-row">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p
                    className="font-medium"
                    id="user-email"
                    data-testid="user-email"
                  >
                    {email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3" id="user-role-row">
                <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <Badge
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                    id="user-role"
                    data-testid="user-role"
                  >
                    {role}
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
              id="logout-btn"
              data-testid="logout-button"
              data-action="logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
