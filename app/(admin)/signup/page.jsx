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
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Loader2, UserPlus } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      if (session.user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/study-tracker");
      }
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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

    // New users are always USER role — redirect to study tracker
    router.push("/study-tracker");
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      id="signup-page-container"
    >
      <div className="w-full max-w-md" id="signup-wrapper">
        <Card
          className="backdrop-blur-sm bg-card/95 shadow-2xl"
          id="signup-card"
        >
          <CardHeader className="text-center space-y-2" id="signup-header">
            <div className="flex justify-center mb-2">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle
              className="text-3xl font-bold gradient-title"
              id="signup-title"
            >
              Create Account
            </CardTitle>
            <CardDescription id="signup-subtitle">
              QA PlayGround — join to track your progress
            </CardDescription>
          </CardHeader>

          <CardContent id="signup-content">
            <form
              onSubmit={handleSubmit}
              id="signup-form"
              data-testid="signup-form"
            >
              <div className="space-y-4">
                <div className="space-y-2" id="name-field-container">
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
                  />
                </div>

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
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <Alert variant="destructive" id="signup-error" data-testid="signup-error">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  id="signup-btn"
                  data-testid="signup-button"
                  data-action="signup"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="justify-center" id="signup-footer">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
                id="login-link"
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
