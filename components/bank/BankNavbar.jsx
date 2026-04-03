'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

export default function BankNavbar({ username }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('currentUser');
                // Remove bank-page class to show main navbar on login page
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
                    <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-primary" />
                        <span
                            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                            id="brand-name"
                        >
                            SecureBank
                        </span>
                    </div>

                    <ul className="flex items-center gap-2" id="nav-menu">
                        {navLinks.map((link) => (
                            <li key={link.href} className="nav-item">
                                <Link
                                    href={link.href}
                                    id={link.testId.replace('nav-', 'nav-')}
                                    data-testid={link.testId}
                                    className={`px-4 py-2 rounded-md font-medium transition-all ${pathname === link.href
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                        : 'text-foreground hover:bg-accent hover:-translate-y-0.5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        <span
                            className="text-muted-foreground font-medium"
                            id="user-info"
                            data-testid="user-info"
                        >
                            👤 <span id="username-display">{username}</span>
                        </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            id="logout-btn"
                            data-testid="logout-button"
                            data-action="logout"
                            aria-label="Logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
