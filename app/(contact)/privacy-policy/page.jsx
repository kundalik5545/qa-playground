import { basicDetails } from "@/data/BasicSetting";
import Link from "next/link";

export const metadata = {
  title: { absolute: "Privacy Policy | Personal Finance" },
  description:
    "Read our Privacy Policy to understand how we collect, use, and protect your personal information when visiting our Personal Finance Blog.",
  alternates: {
    canonical: `${basicDetails.websiteURL}/privacy-policy`,
  },
};

const PrivacyPolicy = () => {
  return (
    <>
      <main className=" mx-auto text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">Effective Date: [25 Feb 2025]</p>
        <p className="mb-4">
          Thank you for visiting <strong>{basicDetails.websiteName}</strong>{" "}
          ("the Blog"). This Privacy Policy explains how we collect, use, and
          protect your personal information when you visit our Blog. We are
          committed to protecting your privacy and complying with applicable
          data protection laws.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Information We Collect</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>
            <strong>Personal Information You Provide:</strong> Information you
            submit when subscribing, commenting, or contacting us (e.g., name,
            email address).
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
          <li>To provide and improve the Blog.</li>
          <li>To communicate with you (e.g., newsletters, responses).</li>
          <li>To analyze blog usage for better user experience.</li>
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
          <li>Business transfers (e.g., mergers, acquisitions).</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">Your Choices</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>Manage cookies through browser settings.</li>
          <li>Unsubscribe from emails anytime.</li>
          <li>Request access to or correction of your personal data.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">Data Security</h2>
        <p className="mb-4">
          We take reasonable measures to protect your data. However, no online
          transmission is 100% secure.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Children’s Privacy</h2>
        <p className="mb-4">
          Our Blog is not intended for children under 13. If a child under 13
          provides us with personal data, please contact us.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy. Changes will be posted here.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
        <p className="mb-4">
          If you have questions, contact us at:
          <br />
          <strong>Email:</strong>{" "}
          <Link
            href={`mailto:${basicDetails.websiteEmail}`}
            className="underline text-blue-500"
          >
            Admin Email
          </Link>
          <br />
          <strong>Contact Us:</strong>{" "}
          <Link href="/contact-us" className="underline text-blue-500">
            Click Here
          </Link>
        </p>
      </main>
    </>
  );
};

export default PrivacyPolicy;
