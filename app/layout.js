import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import Script from "next/script";
import { ThemeProvider } from "@/components/lib/theme-provider";
import Footer from "@/components/lib/Footer";
import { basicDetails } from "@/data/BasicSetting";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: `${basicDetails.websiteName}: Practice Automation Testing with Selenium`,
    template: `%s`,
  },
  description: basicDetails.websiteDescription,
  keywords: [
    "QA Playground",
    "automation testing",
    "Selenium testing",
    "Playwright testing",
    "Cypress testing",
    "Selenium WebDriver",
    "test automation",
    "QA automation practice",
    "QA study tracker",
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    site_name: basicDetails.websiteName,
    title: `${basicDetails.websiteName}: Practice Automation Testing with Selenium`,
    description: basicDetails.websiteDescription,
    icons: {
      icon: "/favicon.ico",
    },
    url: basicDetails.websiteURL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${basicDetails.websiteName} - Selenium Automation Testing Playground`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@qaplayground",
    title: `${basicDetails.websiteName}: Practice Automation Testing with Selenium`,
    description: basicDetails.websiteDescription,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Buy Me Coffee */}
        <Script
          type="text/javascript"
          src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
          data-name="bmc-button"
          data-slug="randomcoders"
          data-color="#FFDD00"
          data-emoji=""
          data-font="Cookie"
          data-text="Buy me a coffee"
          data-outline-color="#000000"
          data-font-color="#000000"
          data-coffee-color="#ffffff"
        />

        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z4H9RTYGS4"
        ></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z4H9RTYGS4');
          `}
        </Script>

        <Script
          id="usercentrics-cmp"
          src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
          data-settings-id="RCGf52YH07pmK7"
          async
        />
      </head>

      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Head tag */}

          {/* Header/Navbar */}
          <Header />

          {/* Main Content */}
          <main
            className="container mx-auto py-3 max-w-7xl min-h-screen"
            role="main"
          >
            {children}
          </main>

          {/* Toaster Notifications */}
          <Toaster richColors />

          {/* Vercel Analytics */}
          <Analytics />

          {/* Footer */}
          <footer className="bg-[#F3F4F6] dark:bg-[#1F2227] p-1 pt-8">
            <Footer />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
