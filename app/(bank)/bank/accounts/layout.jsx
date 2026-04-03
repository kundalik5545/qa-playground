export const metadata = {
  title: "Manage Accounts – Bank Demo E2E Practice | QA Playground",
  description: "Practice creating, editing, filtering, and deleting bank accounts with the QA Playground Bank Demo. Perfect for Selenium and Playwright E2E test automation.",
  alternates: {
    canonical: "https://www.qaplayground.com/bank/accounts",
  },
  openGraph: {
    title: "Manage Accounts – Bank Demo E2E Practice | QA Playground",
    description: "Practice creating, editing, filtering, and deleting bank accounts with the QA Playground Bank Demo.",
    url: "https://www.qaplayground.com/bank/accounts",
    siteName: "QA Playground",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Accounts – Bank Demo E2E Practice | QA Playground",
    description: "Practice creating, editing, filtering, and deleting bank accounts with the QA Playground Bank Demo.",
  },
};

export default function AccountsLayout({ children }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": "Bank Account Management – E2E Testing Practice",
    "description": "Practise creating, editing, filtering and deleting bank accounts using Selenium WebDriver, Playwright, or Cypress.",
    "url": "https://www.qaplayground.com/bank/accounts",
    "educationalLevel": "Intermediate",
    "teaches": [
      "Selenium WebDriver",
      "Playwright",
      "E2E testing",
      "CRUD operations"
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
        "name": "Manage Accounts",
        "item": "https://www.qaplayground.com/bank/accounts"
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
