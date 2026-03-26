"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { ArrowRight, Eye, EyeOff, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // T16
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      if (session.user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/study-tracker/dashboard");
      }
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    if (data?.user?.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/study-tracker/dashboard");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      id="login-page-container"
    >
      <div className="w-full max-w-[480px]" id="login-wrapper">
        <Card
          className="auth-card-shadow backdrop-blur-sm bg-card/95 dark:bg-[rgba(15,10,30,0.95)] border border-violet-200/40 dark:border-violet-500/25"
          id="login-card"
        >
          <CardHeader className="text-center space-y-2" id="login-header">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-[0_4px_12px_rgba(124,58,237,0.25)] ring-[6px] ring-violet-500/[0.12]">
                <LogIn className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-title" id="login-title">
              Sign In
            </h1>
            <CardDescription
              className="text-slate-500 dark:text-gray-400"
              id="login-subtitle"
            >
              QA PlayGround — access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent id="login-content">
            <form
              onSubmit={handleSubmit}
              id="login-form"
              data-testid="login-form"
            >
              <div className="space-y-5">
                {/* Email — T17: aria-describedby + aria-invalid wired to global error */}
                <div
                  className="flex flex-col gap-1.5"
                  id="email-field-container"
                >
                  <Label htmlFor="email" id="email-label">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    data-testid="email-input"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                    aria-describedby={error ? "login-error" : undefined}
                    aria-invalid={!!error}
                  />
                </div>

                {/* Password — T16: show/hide toggle | T17: aria wired */}
                <div
                  className="flex flex-col gap-1.5"
                  id="password-field-container"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" id="password-label">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-violet-600 dark:text-violet-400 hover:underline underline-offset-2"
                      id="forgot-password-link"
                      data-testid="forgot-password-link"
                      prefetch={false}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      data-testid="password-input"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-lg pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                      aria-describedby={error ? "login-error" : undefined}
                      aria-invalid={!!error}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      data-testid="toggle-password-visibility"
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

                {/* Remember Me */}
                <div
                  className="flex items-center gap-2"
                  id="remember-me-container"
                >
                  <Checkbox
                    id="remember-me"
                    name="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    data-testid="remember-me-checkbox"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm text-slate-600 dark:text-gray-400 font-normal cursor-pointer"
                  >
                    Remember me for 30 days
                  </Label>
                </div>

                {error && (
                  <Alert
                    variant="destructive"
                    id="login-error"
                    data-testid="login-error"
                    role="alert"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 tracking-wide"
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
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="justify-center pb-6" id="login-footer">
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-violet-600 dark:text-violet-400 font-medium hover:underline underline-offset-2"
                id="signup-link"
                prefetch={false}
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
