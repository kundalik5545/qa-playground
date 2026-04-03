export const metadata = {
  title: "Transaction History – Bank Demo E2E Testing | QA Playground",
  description: "Practice automating bank transactions with QA Playground's SecureBank Demo. Filter by date, account, and export CSV. Ideal for Selenium and Playwright practice.",
  alternates: {
    canonical: "https://www.qaplayground.com/bank/transactions",
  },
  openGraph: {
    title: "Transaction History – Bank Demo E2E Testing | QA Playground",
    description: "Practice automating bank transactions with QA Playground's SecureBank Demo. Filter by date, account, and export CSV.",
    url: "https://www.qaplayground.com/bank/transactions",
    siteName: "QA Playground",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Transaction History – Bank Demo E2E Testing | QA Playground",
    description: "Practice automating bank transactions with QA Playground's SecureBank Demo. Filter by date, account, and export CSV.",
  },
};

export default function TransactionsLayout({ children }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": "Bank Transaction History – E2E Testing Practice",
    "description": "Practise filtering and interacting with bank transaction history using Selenium WebDriver, Playwright, or Cypress.",
    "url": "https://www.qaplayground.com/bank/transactions",
    "educationalLevel": "Intermediate",
    "teaches": [
      "Selenium WebDriver",
      "Playwright",
      "E2E testing",
      "Data formatting and filtering"
    ],
    "provider": {
      "@type": "Organization",
      "name": "QA Playground",
      "url": "https://www.qaplayground.com"
    }
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.qaplayground.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Bank Demo",
        "item": "https://www.qaplayground.com/bank"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Transactions",
        "item": "https://www.qaplayground.com/bank/transactions"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {children}
    </>
  );
}
