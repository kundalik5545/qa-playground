import { basicDetails } from "@/data/BasicSetting";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Contact Us | QA Playground",
  description:
    "Have a question or want to collaborate? Reach out to the QA Playground team. We're happy to help with automation testing, project ideas, or anything else.",
  alternates: {
    canonical: `${basicDetails.websiteURL}/contact-us`,
  },
  openGraph: {
    title: "Contact Us | QA Playground",
    description:
      "Reach out to the QA Playground team for help with automation testing, collaboration, or general enquiries.",
    url: `${basicDetails.websiteURL}/contact-us`,
    siteName: basicDetails.websiteName,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | QA Playground",
    description:
      "Reach out to the QA Playground team for help with automation testing, collaboration, or general enquiries.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ContactUsPage = () => {
  return (
    <div className="contact-us min-h-screen container mx-auto max-w-5xl text-foreground bg-background pt-5">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <blockquote className="italic">
        <p className="text-lg mb-4">
          <strong>{basicDetails.websiteName}</strong> — 💡 Enhance your testing
          skills with us!
        </p>
        <p className="mb-4">
          A hub for testers seeking help with automation testing, project ideas,
          and collaboration opportunities. Our blog categorizes projects across
          various domains, making it easy to find the right challenge for your
          skill level. Whether you're a beginner or an experienced tester, you
          can explore, contribute, and collaborate on open-source projects.
        </p>
        <p className="mb-4">
          Join our <strong>community</strong>, where contributors can discover
          projects, connect with like-minded testers, and grow their testing
          skills. Stay updated with best practices, tutorials, and hands-on
          projects to sharpen your expertise.
        </p>

        <div>
          <h2 className="text-2xl font-bold">Get in Touch</h2>
          <p>If you have any questions, feel free to reach out to us at:</p>
          <p>
            Email:{" "}
            <Link
              className="underline text-blue-500"
              href={`mailto:${basicDetails.websiteEmail}`}
              aria-label="Contact QA via Email"
            >
              {basicDetails.websiteEmail}
            </Link>
          </p>
        </div>

        <p className="pt-3">— Automation Testing Team</p>
      </blockquote>
    </div>
  );
};

export default ContactUsPage;
