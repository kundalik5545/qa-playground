import { basicDetails } from "@/data/BasicSetting";

export const metadata = {
  title: "Raise an Issue | QA Playground",
  description:
    "Found a bug or have a suggestion for QA Playground? Report issues on GitHub or send your ideas directly to our inbox. Every piece of feedback helps improve the platform.",
  alternates: {
    canonical: `${basicDetails.websiteURL}/raise-issue`,
  },
  openGraph: {
    title: "Raise an Issue or Share a Suggestion | QA Playground",
    description:
      "Report bugs on GitHub or send feature suggestions directly. Help make QA Playground better for the entire QA automation community.",
    url: `${basicDetails.websiteURL}/raise-issue`,
    siteName: basicDetails.websiteName,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Raise an Issue | QA Playground",
    description:
      "Report bugs on GitHub or send feature suggestions directly to QA Playground.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RaiseIssueLayout({ children }) {
  return children;
}
