import { basicDetails } from "@/data/BasicSetting";
import React from "react";

// export const metadata = {
//   title: "About - QA PlayGround",
//   description:
//     "QA Testing Playground is a hub for automation testers to practice and enhance their skills. Join our community to explore, contribute, and collaborate.",
//   alternates: {
//     canonical: `${basicDetails.websiteURL}/about-us`,
//   },
// };

export const metadata = {
  title: "About - QA PlayGround",
  description:
    "QA Testing Playground is the leading platform for automation testers to practice skills, access 50+ exercises, join 10k+ community members, and master Selenium, Cypress & Playwright testing frameworks.",
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
    title: "About QA PlayGround - Premier Automation Testing Hub",
    description:
      "Join 10k+ automation testers practicing skills with 50+ exercises. Master Selenium, Cypress & Playwright testing frameworks.",
    url: `${basicDetails.websiteURL}/about-us`,
    siteName: basicDetails.websiteName,
    type: "website",
    images: [
      {
        url: `${basicDetails.websiteURL}/og-about.jpg`,
        width: 1200,
        height: 630,
        alt: "QA PlayGround About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About QA PlayGround - Premier Automation Testing Hub",
    description:
      "Join 10k+ automation testers practicing skills with 50+ exercises.",
    images: [`${basicDetails.websiteURL}/twitter-about.jpg`],
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
            <strong>{basicDetails.websiteName}</strong> - 🛠️ Practice, learn,
            and excel in automation testing!
          </p>
          <p className="mb-4">
            A hub for automation testers seeking hands-on practice, project
            ideas, and collaboration opportunities. Our platform categorizes
            projects across various domains, making it easy to find the right
            challenge for your skill level.
          </p>
          <p className="mb-4">
            Join our <strong>community guide</strong>, where contributors can
            discover projects, connect with like-minded testers, and enhance
            their automation skills. Stay updated with best practices,
            tutorials, and hands-on projects to sharpen your expertise.
          </p>
          <p>By -</p>
          <p>{basicDetails.websiteName}</p>
        </blockquote>
      </div>
    </>
  );
};

export default AboutPage;
