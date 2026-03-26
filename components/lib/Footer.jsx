import Link from "next/link";
import { basicDetails, allUrls } from "@/data/BasicSetting";
import { FaYoutube, FaGithub, FaTwitter, FaTelegram } from "react-icons/fa";
import { LayoutGrid, CreditCard, BookOpen } from "lucide-react";

const platformLinks = [
  {
    href: "/practice",
    label: "Practice Elements",
    icon: <LayoutGrid className="h-3.5 w-3.5" />,
    badge: "22+ elements",
    badgeClass:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    href: "/bank",
    label: "Bank Demo App",
    icon: <CreditCard className="h-3.5 w-3.5" />,
    badge: "E2E testing",
    badgeClass:
      "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
  },
  {
    href: "/study-tracker/dashboard",
    label: "Study Tracker",
    icon: <BookOpen className="h-3.5 w-3.5" />,
    badge: "New",
    badgeClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  },
  {
    href: "/blog",
    label: "Blog & Tutorials",
    icon: null,
    badge: null,
  },
];

const learnLinks = [
  { href: "/learn/courses", label: "Free Courses" },
  { href: "/learn/automation-test-cases", label: "Automation Test Cases" },
  {
    href: "/learn/logical-programs-list-to-crack-interviews",
    label: "Logical Programs",
  },
  {
    href: "https://github.com/kundalik5545/QA_PlayGround_Automation_Framework",
    label: "Automation Framework",
    external: true,
  },
];

const companyLinks = [
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/login", label: "Login" },
];

const socialLinks = [
  {
    href: allUrls.youtubeURL,
    icon: <FaYoutube size={18} />,
    label: "YouTube",
  },
  {
    href: "https://github.com/kundalik5545/qatesting",
    icon: <FaGithub size={18} />,
    label: "GitHub",
  },
  {
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(basicDetails.websiteURL)}`,
    icon: <FaTwitter size={18} />,
    label: "Twitter",
  },
  {
    href: `https://t.me/share/url?url=${encodeURIComponent(basicDetails.websiteURL)}`,
    icon: <FaTelegram size={18} />,
    label: "Telegram",
  },
];

const Footer = () => {
  return (
    <footer aria-label="Site footer">
      <div className="container mx-auto px-4 pt-4 pb-2 max-w-7xl">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 pb-10 border-b border-border">
          {/* Column 1 — Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="gradient-subTitle text-xl font-bold">
                QA PlayGround
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed">
              A purpose-built practice platform for QA automation engineers.
              Learn Selenium, Playwright, and Cypress through hands-on
              interactive elements and real-world scenarios.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                <LayoutGrid className="h-3 w-3" />
                Practice Elements
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                <CreditCard className="h-3 w-3" />
                Bank Demo
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                <BookOpen className="h-3 w-3" />
                Study Tracker
              </span>
            </div>

            {/* Social icons */}
            <div
              className="flex items-center gap-3 mt-2"
              aria-label="Social media links"
            >
              {socialLinks.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 — Platform */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Platform
            </h4>
            <nav className="flex flex-col gap-2.5" aria-label="Platform links">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors group"
                >
                  {link.icon && (
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {link.icon}
                    </span>
                  )}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${link.badgeClass}`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Learn */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Learn
            </h4>
            <nav className="flex flex-col gap-2.5" aria-label="Learn links">
              {learnLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4 — Company */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </h4>
            <nav className="flex flex-col gap-2.5" aria-label="Company links">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                No login required.
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                All data stored locally in your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 pb-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} {basicDetails.websiteName}. All rights
            reserved.
          </span>
          <span>
            Built for QA Engineers by{" "}
            <Link
              href={allUrls.blogLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f18b42] hover:text-[#e07b35] transition-colors font-medium"
            >
              Random Coders
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
