'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Building2, Menu } from 'lucide-react';

export default function BankNavbar({ username, role }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('currentUser');
                document.body.classList.remove('bank-page');
            }
            router.push('/bank');
        }
    };

    const navLinks = [
        { href: '/bank/dashboard', label: '📊 Dashboard', testId: 'nav-dashboard' },
        { href: '/bank/accounts', label: '💳 Accounts', testId: 'nav-accounts' },
        { href: '/bank/transactions', label: '💸 Transactions', testId: 'nav-transactions' },
    ];

    const linkClass = (href) =>
        `px-4 py-2 rounded-md font-medium transition-all ${
            pathname === href
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-foreground hover:bg-accent hover:-translate-y-0.5'
        }`;

    return (
        <nav
            className="bg-card shadow-md border-b"
            id="main-navbar"
            data-testid="main-navbar"
            role="navigation"
            aria-label="Bank navigation"
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Brand */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Building2 className="h-8 w-8 text-primary" />
                        <span
                            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                            id="brand-name"
                        >
                            SecureBank
                        </span>
                    </div>

                    {/* Desktop nav links */}
                    <ul className="hidden md:flex items-center gap-2" id="nav-menu">
                        {navLinks.map((link) => (
                            <li key={link.href} className="nav-item">
                                <Link
                                    href={link.href}
                                    id={link.testId}
                                    data-testid={link.testId}
                                    className={linkClass(link.href)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right side: help, user info, logout, mobile hamburger */}
                    <div className="flex items-center gap-2">
                        {/* Help link — desktop only */}
                        <Link
                            href="/docs/bank-demo"
                            id="help-link"
                            data-testid="help-link"
                            className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
                        >
                            Help &amp; Docs
                        </Link>

                        {/* User info — hidden on small screens */}
                        <span
                            className="hidden md:inline text-muted-foreground font-medium"
                            id="user-info"
                            data-testid="user-info"
                        >
                            👤 <span id="username-display">{username}</span>
                            {role === 'viewer' && (
                                <span
                                    className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700 px-2 py-0.5 rounded-full font-normal"
                                    id="viewer-badge"
                                    data-testid="viewer-badge"
                                >
                                    Read-only
                                </span>
                            )}
                        </span>

                        {/* Logout — desktop */}
                        <Button
                            variant="destructive"
                            size="sm"
                            id="logout-btn"
                            data-testid="logout-button"
                            data-action="logout"
                            aria-label="Logout"
                            onClick={handleLogout}
                            className="hidden md:inline-flex"
                        >
                            Logout
                        </Button>

                        {/* Mobile hamburger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    id="mobile-menu-btn"
                                    data-testid="mobile-menu-button"
                                    aria-label="Open navigation menu"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-72"
                                id="mobile-nav-sheet"
                                data-testid="mobile-nav-sheet"
                            >
                                <SheetHeader>
                                    <SheetTitle className="text-left bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        SecureBank
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="mt-4 space-y-1" id="mobile-nav-links">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            data-testid={`mobile-${link.testId}`}
                                            className={`block px-4 py-3 rounded-md font-medium transition-all ${
                                                pathname === link.href
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                    : 'text-foreground hover:bg-accent'
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    <Link
                                        href="/docs/bank-demo"
                                        className="block px-4 py-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                    >
                                        Help &amp; Docs
                                    </Link>
                                </div>

                                <div className="mt-6 px-4 border-t pt-4 space-y-2">
                                    <p
                                        className="text-sm text-muted-foreground"
                                        id="mobile-user-info"
                                        data-testid="user-info"
                                    >
                                        👤 {username}
                                        {role === 'viewer' && (
                                            <span
                                                className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700 px-2 py-0.5 rounded-full"
                                                data-testid="viewer-badge"
                                            >
                                                Read-only
                                            </span>
                                        )}
                                    </p>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full"
                                        onClick={handleLogout}
                                        data-testid="mobile-logout-button"
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
