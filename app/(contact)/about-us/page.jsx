import { basicDetails } from "@/data/BasicSetting";
import React from "react";

export const metadata = {
  title: "About Us | QA Playground",
  description:
    "QA Playground is a purpose-built platform for automation testers to practice Selenium, Playwright, and Cypress through 22+ interactive elements, a Bank Demo app, and a Study Tracker.",
  keywords: [
    "automation testing",
    "QA testing playground",
    "selenium practice",
    "cypress testing",
    "playwright automation",
    "software testing community",
    "test automation learning",
    "QA skills development",
  ],
  alternates: {
    canonical: `${basicDetails.websiteURL}/about-us`,
  },
  openGraph: {
    title: "About Us | QA Playground",
    description:
      "A purpose-built platform for automation testers to practice Selenium, Playwright, and Cypress. Explore 22+ interactive elements, a Bank Demo app, and a QA Study Tracker.",
    url: `${basicDetails.websiteURL}/about-us`,
    siteName: basicDetails.websiteName,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Us | QA Playground",
    description:
      "A purpose-built platform for automation testers to practice Selenium, Playwright, and Cypress.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const AboutPage = () => {
  return (
    <>
      <div className="min-h-screen container mx-auto max-w-5xl text-foreground bg-background pt-5">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <blockquote className="italic">
          <p className="text-lg mb-4">
            <strong>{basicDetails.websiteName}</strong> — 🛠️ Practice, learn,
            and excel in automation testing!
          </p>
          <p className="mb-4">
            A hub for automation testers seeking hands-on practice, project
            ideas, and collaboration opportunities. Our platform categorizes
            projects across various domains, making it easy to find the right
            challenge for your skill level.
          </p>
          <p className="mb-4">
            Join our <strong>community</strong>, where contributors can discover
            projects, connect with like-minded testers, and grow their
            automation skills. Stay updated with best practices, tutorials, and
            hands-on projects to sharpen your expertise.
          </p>
          <p className="pt-3">— {basicDetails.websiteName}</p>
        </blockquote>
      </div>
    </>
  );
};

export default AboutPage;
