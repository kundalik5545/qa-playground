import Link from "next/link";
import { SignOutButton } from "./_components/SignOutButton";
import { BodyClassSetter } from "./_components/BodyClassSetter";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Admin — QA Playground",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <>
      <BodyClassSetter className="admin-page" />
      <div className="min-h-screen bg-muted/30">
        <header id="admin-navbar" className="bg-card border-b sticky top-0 z-30">
          <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <nav className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Admin</span>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  href="/admin/site-alerts"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Site Alerts
                </Link>
                <Link
                  href="/admin/responses"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Responses
                </Link>
              </div>
            </nav>
            <SignOutButton />
          </div>
        </header>
        {/* Use div instead of main — body.admin-page main { padding:0 } would override padding */}
        <div className="container mx-auto max-w-4xl px-4 py-16">
          {children}
        </div>
      </div>
    </>
  );
}
