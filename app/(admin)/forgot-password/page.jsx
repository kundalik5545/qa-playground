"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (authError) {
      setError(authError.message || "Failed to send reset email. Please try again.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      id="forgot-password-page-container"
    >
      <div className="w-full max-w-[480px]" id="forgot-password-wrapper">
        <Card
          className="auth-card-shadow backdrop-blur-sm bg-card/95 dark:bg-[rgba(15,10,30,0.95)] border border-violet-200/40 dark:border-violet-500/25"
          id="forgot-password-card"
        >
          <CardHeader className="text-center space-y-2" id="forgot-password-header">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-[0_4px_12px_rgba(124,58,237,0.25)] ring-[6px] ring-violet-500/[0.12]">
                <KeyRound className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-title" id="forgot-password-title">
              Forgot Password
            </h1>
            <CardDescription
              className="text-slate-500 dark:text-gray-400"
              id="forgot-password-subtitle"
            >
              Enter your email and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>

          <CardContent id="forgot-password-content">
            {sent ? (
              <div
                className="text-center space-y-4 py-4"
                id="forgot-password-success"
                data-testid="forgot-password-success"
              >
                <div className="text-4xl">📧</div>
                <p className="text-slate-700 dark:text-gray-300 font-medium">
                  Check your inbox
                </p>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  If an account exists for <span className="font-medium text-violet-600 dark:text-violet-400">{email}</span>, you&apos;ll receive a password reset link shortly.
                </p>
                <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">
                  Didn&apos;t receive it? Check your spam folder or{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="text-violet-600 dark:text-violet-400 hover:underline underline-offset-2"
                    data-testid="try-again-link"
                  >
                    try again
                  </button>
                  .
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                id="forgot-password-form"
                data-testid="forgot-password-form"
              >
                <div className="space-y-5">
                  <div className="flex flex-col gap-1.5" id="email-field-container">
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
                      className="h-11 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                      aria-describedby={error ? "forgot-password-error" : undefined}
                      aria-invalid={!!error}
                    />
                  </div>

                  {error && (
                    <Alert
                      variant="destructive"
                      id="forgot-password-error"
                      data-testid="forgot-password-error"
                      role="alert"
                    >
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 tracking-wide"
                    id="forgot-password-btn"
                    data-testid="forgot-password-button"
                    data-action="forgot-password"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send reset link
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center pb-6" id="forgot-password-footer">
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-violet-600 dark:text-violet-400 font-medium hover:underline underline-offset-2"
                id="login-link"
                prefetch={false}
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
