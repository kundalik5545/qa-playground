"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "Invalid email or password.");
      setLoading(false);
      return;
    }

    // Redirect based on role from the session user object
    if (data?.user?.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/study-tracker");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      id="login-page-container"
    >
      <div className="w-full max-w-md" id="login-wrapper">
        <Card
          className="backdrop-blur-sm bg-card/95 shadow-2xl"
          id="login-card"
        >
          <CardHeader className="text-center space-y-2" id="login-header">
            <div className="flex justify-center mb-2">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                <LogIn className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle
              className="text-3xl font-bold gradient-title"
              id="login-title"
            >
              Sign In
            </CardTitle>
            <CardDescription id="login-subtitle">
              QA PlayGround — access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent id="login-content">
            <form
              onSubmit={handleSubmit}
              id="login-form"
              data-testid="login-form"
            >
              <div className="space-y-4">
                <div className="space-y-2" id="email-field-container">
                  <Label htmlFor="email" id="email-label">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    data-testid="email-input"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2" id="password-field-container">
                  <Label htmlFor="password" id="password-label">
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    data-testid="password-input"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <Alert variant="destructive" id="login-error" data-testid="login-error">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  id="login-btn"
                  data-testid="login-button"
                  data-action="login"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
