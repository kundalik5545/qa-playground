export const metadata = {
  title: "Bank Dashboard – SecureBank Demo | QA Playground",
  description:
    "Explore the SecureBank Demo dashboard for QA automation practice. View account balances, pinned accounts, and recent transactions. Free testing playground.",
  keywords: [
    "bank demo automation testing",
    "Selenium bank dashboard test",
    "Playwright E2E banking app",
    "QA automation practice bank",
    "SecureBank QA Playground",
  ],
  alternates: {
    canonical: "https://www.qaplayground.com/bank/dashboard",
  },
  openGraph: {
    title: "Bank Dashboard – SecureBank Demo | QA Playground",
    description: "Explore the SecureBank Demo dashboard for QA automation practice. View account balances, pinned accounts, and recent transactions. Free testing playground.",
    url: "https://www.qaplayground.com/bank/dashboard",
    siteName: "QA Playground",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bank Dashboard – SecureBank Demo | QA Playground",
    description: "Explore the SecureBank Demo dashboard for QA automation practice. View account balances, pinned accounts, and recent transactions. Free testing playground.",
  },
};

export default function DashboardLayout({ children }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SecureBank Demo – QA Playground",
    "description": "A demo banking application for practising E2E test automation with Selenium and Playwright.",
    "url": "https://www.qaplayground.com/bank/dashboard",
    "applicationCategory": "EducationalApplication",
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
        "name": "Dashboard",
        "item": "https://www.qaplayground.com/bank/dashboard"
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
