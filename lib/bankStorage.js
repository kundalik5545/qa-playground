// Local Storage Management Module for Bank Demo
// Handles all data persistence using localStorage

// Initialize default data
export function initializeData() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem('bankAccounts')) {
        const defaultAccounts = [
            {
                id: generateId(),
                accountNumber: '1001234567',
                name: 'Primary Savings',
                type: 'savings',
                balance: 5000.00,
                status: 'active',
                overdraft: false,
                createdDate: new Date().toISOString()
            },
            {
                id: generateId(),
                accountNumber: '1001234568',
                name: 'Checking Account',
                type: 'checking',
                balance: 2500.00,
                status: 'active',
                overdraft: true,
                createdDate: new Date().toISOString()
            }
        ];
        localStorage.setItem('bankAccounts', JSON.stringify(defaultAccounts));
    }

    if (!localStorage.getItem('bankTransactions')) {
        const accounts = JSON.parse(localStorage.getItem('bankAccounts') || '[]');
        const defaultTransactions = accounts.length > 0 ? [
            {
                id: generateId(),
                transactionId: 'TXN' + Date.now(),
                date: new Date().toISOString(),
                type: 'deposit',
                accountId: accounts[0].id,
                accountName: accounts[0].name,
                amount: 1000.00,
                balanceAfter: 5000.00,
                description: 'Initial deposit',
                status: 'completed'
            }
        ] : [];
        localStorage.setItem('bankTransactions', JSON.stringify(defaultTransactions));
    }
}

// Generate unique ID
export function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generate account number
export function generateAccountNumber() {
    return '100' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
}

// Account operations
export function getAccounts() {
    if (typeof window === 'undefined') return [];
    const accounts = localStorage.getItem('bankAccounts');
    return accounts ? JSON.parse(accounts) : [];
}

export function getAccountById(id) {
    const accounts = getAccounts();
    return accounts.find(acc => acc.id === id);
}

export function getTransactionById(id) {
    const transactions = getTransactions();
    return transactions.find(t => t.id === id);
}

export function saveAccount(account) {
    if (typeof window === 'undefined') return account;
    const accounts = getAccounts();

    if (account.id) {
        // Update existing account
        const index = accounts.findIndex(acc => acc.id === account.id);
        if (index !== -1) {
            accounts[index] = account;
        }
    } else {
        // Add new account
        account.id = generateId();
        account.accountNumber = generateAccountNumber();
        account.createdDate = new Date().toISOString();
        accounts.push(account);
    }

    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
    return account;
}

export function deleteAccount(id) {
    if (typeof window === 'undefined') return;
    let accounts = getAccounts();
    accounts = accounts.filter(acc => acc.id !== id);
    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
}

export function updateAccountBalance(accountId, newBalance) {
    if (typeof window === 'undefined') return;
    const accounts = getAccounts();
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
        account.balance = newBalance;
        localStorage.setItem('bankAccounts', JSON.stringify(accounts));
    }
}

// Transaction operations
export function getTransactions() {
    if (typeof window === 'undefined') return [];
    const transactions = localStorage.getItem('bankTransactions');
    return transactions ? JSON.parse(transactions) : [];
}

export function saveTransaction(transaction) {
    if (typeof window === 'undefined') return transaction;
    const transactions = getTransactions();

    transaction.id = generateId();
    transaction.transactionId = 'TXN' + Date.now();
    transaction.date = new Date().toISOString();
    transaction.status = 'completed';

    transactions.unshift(transaction);
    localStorage.setItem('bankTransactions', JSON.stringify(transactions));

    return transaction;
}

// Get recent transactions
export function getRecentTransactions(limit = 5) {
    const transactions = getTransactions();
    return transactions.slice(0, limit);
}

// Filter transactions
export function filterTransactions(filters) {
    let transactions = getTransactions();

    if (filters.accountId && filters.accountId !== 'all') {
        transactions = transactions.filter(t => t.accountId === filters.accountId);
    }

    if (filters.type && filters.type !== 'all') {
        transactions = transactions.filter(t => t.type === filters.type);
    }

    if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        transactions = transactions.filter(t => new Date(t.date) >= fromDate);
    }

    if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59);
        transactions = transactions.filter(t => new Date(t.date) <= toDate);
    }

    return transactions;
}

// Calculate total balance
export function getTotalBalance() {
    const accounts = getAccounts();
    return accounts.reduce((total, acc) => total + parseFloat(acc.balance), 0);
}

// Session helpers (P3-B)
export function getCurrentSession() {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem('currentUser');
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.username) return parsed;
        // backward-compat: old string value
        return { username: String(parsed), role: 'admin' };
    } catch {
        return { username: raw, role: 'admin' };
    }
}

export function setCurrentSession(username, role) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('currentUser', JSON.stringify({ username, role }));
}

// Pinned accounts order (P3-C)
export function getPinnedAccountsOrder() {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem('pinnedAccountsOrder') || '[]');
    } catch { return []; }
}

export function savePinnedAccountsOrder(order) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('pinnedAccountsOrder', JSON.stringify(order));
}

// Clear all data
export function clearAllData() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('bankAccounts');
    localStorage.removeItem('bankTransactions');
    initializeData();
}

// Format currency
export function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Format date
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format datetime
export function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
