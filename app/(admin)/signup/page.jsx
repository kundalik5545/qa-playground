"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowRight, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";

// T15 — full-string Tailwind classes in a lookup (no dynamic class construction)
const strengthConfig = {
  0: { label: "", barWidth: "w-0", barColor: "" },
  1: { label: "Weak", barWidth: "w-1/4", barColor: "bg-red-500" },
  2: { label: "Fair", barWidth: "w-2/4", barColor: "bg-orange-400" },
  3: { label: "Good", barWidth: "w-3/4", barColor: "bg-yellow-400" },
  4: { label: "Strong", barWidth: "w-full", barColor: "bg-green-500" },
};

const strengthLabelColor = {
  0: "",
  1: "text-red-500",
  2: "text-orange-400",
  3: "text-yellow-500",
  4: "text-green-500",
};

function getPasswordStrength(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // T16
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // T16
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const { label, barWidth, barColor } = strengthConfig[passwordStrength];
  const passwordsMatch = confirmPassword === "" || password === confirmPassword;

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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error: authError } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "Sign-up failed. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/study-tracker/dashboard");
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      id="signup-page-container"
    >
      <div className="w-full max-w-[480px]" id="signup-wrapper">
        <Card
          className="auth-card-shadow backdrop-blur-sm bg-card/95 dark:bg-[rgba(15,10,30,0.95)] border border-violet-200/40 dark:border-violet-500/25"
          id="signup-card"
        >
          <CardHeader className="text-center space-y-2" id="signup-header">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-[0_4px_12px_rgba(124,58,237,0.25)] ring-[6px] ring-violet-500/[0.12]">
                <UserPlus className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-title" id="signup-title">
              Create Account
            </h1>
            <CardDescription
              className="text-slate-500 dark:text-gray-400"
              id="signup-subtitle"
            >
              QA PlayGround — join to track your progress
            </CardDescription>
          </CardHeader>

          <CardContent id="signup-content">
            <form
              onSubmit={handleSubmit}
              id="signup-form"
              data-testid="signup-form"
            >
              <div className="space-y-5">
                {/* Full Name */}
                <div
                  className="flex flex-col gap-1.5"
                  id="name-field-container"
                >
                  <Label htmlFor="name" id="name-label">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    data-testid="name-input"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  />
                </div>

                {/* Email — T17: aria-describedby wired to global error */}
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
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                    aria-describedby={error ? "signup-error" : undefined}
                    aria-invalid={!!error}
                  />
                </div>

                {/* Password — T15: strength bar | T16: show/hide | T17: aria */}
                <div
                  className="flex flex-col gap-1.5"
                  id="password-field-container"
                >
                  <Label htmlFor="password" id="password-label">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      data-testid="password-input"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-lg pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                      aria-describedby={
                        password.length > 0
                          ? "password-strength-container"
                          : error
                            ? "signup-error"
                            : undefined
                      }
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
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div
                      id="password-strength-container"
                      data-testid="password-strength"
                    >
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${barWidth} ${barColor}`}
                          data-testid="strength-bar"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          Use 8+ characters with uppercase, numbers &amp;
                          symbols.
                        </p>
                        {label && (
                          <span
                            className={`text-xs font-medium ${strengthLabelColor[passwordStrength]}`}
                            data-testid="strength-label"
                          >
                            {label}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password — T14: match validation | T16: show/hide | T17: aria */}
                <div
                  className="flex flex-col gap-1.5"
                  id="confirm-password-field-container"
                >
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
                        !passwordsMatch
                          ? "confirm-password-error"
                          : error
                            ? "signup-error"
                            : undefined
                      }
                      aria-invalid={!passwordsMatch || !!error}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
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
                    id="signup-error"
                    data-testid="signup-error"
                    role="alert"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 tracking-wide"
                  id="signup-btn"
                  data-testid="signup-button"
                  data-action="signup"
                  disabled={loading || !passwordsMatch}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="justify-center pb-6" id="signup-footer">
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
              Already have an account?{" "}
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
