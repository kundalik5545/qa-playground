import { basicDetails } from "@/data/BasicSetting";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | QA Playground",
  description:
    "Read the QA Playground Privacy Policy to understand how we collect, use, and protect your personal information when you use our platform.",
  alternates: {
    canonical: `${basicDetails.websiteURL}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy | QA Playground",
    description:
      "Read the QA Playground Privacy Policy to understand how we collect, use, and protect your personal information.",
    url: `${basicDetails.websiteURL}/privacy-policy`,
    siteName: basicDetails.websiteName,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | QA Playground",
    description:
      "Read the QA Playground Privacy Policy to understand how we collect, use, and protect your personal information.",
  },
  robots: {
    index: true,
    follow: false,
  },
};

const PrivacyPolicy = () => {
  return (
    <>
      <main className="mx-auto text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">Effective Date: 25 February 2025</p>
        <p className="mb-4">
          Thank you for visiting <strong>{basicDetails.websiteName}</strong>{" "}
          ("the Platform"). This Privacy Policy explains how we collect, use,
          and protect your personal information when you use our Platform. We
          are committed to protecting your privacy and complying with applicable
          data protection laws.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Information We Collect</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>
            <strong>Personal Information You Provide:</strong> Information you
            submit when creating an account or contacting us (e.g., name, email
            address).
          </li>
          <li>
            <strong>Automatically Collected Information:</strong> Includes log
            data (IP address, browser type, pages viewed) and cookies.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">
          How We Use Your Information
        </h2>
        <ul className="list-disc pl-5 mb-4">
          <li>To provide and improve the Platform.</li>
          <li>To communicate with you (e.g., responses to enquiries).</li>
          <li>To analyse platform usage for a better user experience.</li>
          <li>To protect our rights and comply with legal obligations.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">
          Sharing Your Information
        </h2>
        <p className="mb-4">
          We do not sell or rent your personal information. However, we may
          share it with:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Service providers (e.g., hosting, analytics).</li>
          <li>Legal authorities if required by law.</li>
          <li>Third parties in the event of a business transfer (e.g., merger or acquisition).</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">Your Choices</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>Manage cookies through your browser settings.</li>
          <li>Request access to or correction of your personal data.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">Data Security</h2>
        <p className="mb-4">
          We take reasonable measures to protect your data. However, no online
          transmission is 100% secure.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Children's Privacy</h2>
        <p className="mb-4">
          Our Platform is not intended for children under 13. If you believe a
          child under 13 has provided us with personal data, please contact us
          so we can take appropriate action.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this policy, please reach out:
          <br />
          <strong>Email:</strong>{" "}
          <Link
            href={`mailto:${basicDetails.websiteEmail}`}
            className="underline text-blue-500"
          >
            {basicDetails.websiteEmail}
          </Link>
          <br />
          <strong>Contact page:</strong>{" "}
          <Link href="/contact-us" className="underline text-blue-500">
            Contact Us
          </Link>
        </p>
      </main>
    </>
  );
};

export default PrivacyPolicy;
