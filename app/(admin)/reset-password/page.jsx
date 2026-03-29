"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = confirmPassword === "" || newPassword === confirmPassword;

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new reset link.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token. Please request a new reset link.");
      return;
    }

    setLoading(true);

    const { error: authError } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (authError) {
      setError(authError.message || "Failed to reset password. The link may have expired.");
      setLoading(false);
      return;
    }

    router.push("/login?reset=success");
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="reset-password-form"
      data-testid="reset-password-form"
    >
      <div className="space-y-5">
        {/* New Password */}
        <div className="flex flex-col gap-1.5" id="new-password-field-container">
          <Label htmlFor="new-password" id="new-password-label">
            New Password
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="new-password"
              name="newPassword"
              placeholder="••••••••"
              data-testid="new-password-input"
              autoComplete="new-password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11 rounded-lg pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
              aria-describedby={error ? "reset-password-error" : undefined}
              aria-invalid={!!error}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
              data-testid="toggle-new-password-visibility"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5" id="confirm-password-field-container">
          <Label htmlFor="confirm-password" id="confirm-password-label">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              placeholder="••••••••"
              data-testid="confirm-password-input"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`h-11 rounded-lg pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 ${!passwordsMatch ? "border-red-400 focus-visible:ring-red-400/30" : ""}`}
              aria-describedby={
                !passwordsMatch ? "confirm-password-error" : error ? "reset-password-error" : undefined
              }
              aria-invalid={!passwordsMatch || !!error}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              data-testid="toggle-confirm-password-visibility"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {!passwordsMatch && (
            <p
              className="text-xs text-red-500 mt-0.5"
              id="confirm-password-error"
              data-testid="confirm-password-error"
              role="alert"
            >
              Passwords do not match.
            </p>
          )}
        </div>

        {error && (
          <Alert
            variant="destructive"
            id="reset-password-error"
            data-testid="reset-password-error"
            role="alert"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 tracking-wide"
          id="reset-password-btn"
          data-testid="reset-password-button"
          data-action="reset-password"
          disabled={loading || !passwordsMatch || !token}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              Set new password
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      id="reset-password-page-container"
    >
      <div className="w-full max-w-[480px]" id="reset-password-wrapper">
        <Card
          className="auth-card-shadow backdrop-blur-sm bg-card/95 dark:bg-[rgba(15,10,30,0.95)] border border-violet-200/40 dark:border-violet-500/25"
          id="reset-password-card"
        >
          <CardHeader className="text-center space-y-2" id="reset-password-header">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-[0_4px_12px_rgba(124,58,237,0.25)] ring-[6px] ring-violet-500/[0.12]">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-title" id="reset-password-title">
              Reset Password
            </h1>
            <CardDescription
              className="text-slate-500 dark:text-gray-400"
              id="reset-password-subtitle"
            >
              Choose a new password for your account
            </CardDescription>
          </CardHeader>

          <CardContent id="reset-password-content">
            <Suspense fallback={<div className="text-center text-slate-400 py-4">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </CardContent>

          <CardFooter className="justify-center pb-6" id="reset-password-footer">
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
