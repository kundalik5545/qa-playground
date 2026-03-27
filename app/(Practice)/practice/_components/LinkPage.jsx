"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap,
  Clock,
  ListChecks,
  Video,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";
import { linksTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";

const API_KEY = process.env.REGRESS_FREE_API_KEY || "";

const SLUG = "links";

const techMethods = {
  selenium: [
    { name: "click()", color: "bg-purple-500" },
    { name: 'getAttribute("href")', color: "bg-blue-500" },
    { name: 'getAttribute("target")', color: "bg-orange-400" },
    { name: "driver.navigate().back()", color: "bg-emerald-500" },
    { name: "driver.getWindowHandles()", color: "bg-slate-500" },
  ],
  playwright: [
    { name: "click()", color: "bg-blue-500" },
    { name: 'getAttribute("href")', color: "bg-purple-500" },
    { name: "page.goBack()", color: "bg-orange-400" },
    { name: 'page.waitForEvent("popup")', color: "bg-emerald-500" },
    { name: "context.pages()", color: "bg-red-500" },
  ],
};

const API_CALLS = [
  { label: "Create User (201)", func: createUser },
  { label: "No Content (204)", func: noContent },
  { label: "Moved (301)", func: moved },
  { label: "Bad Request (400)", func: badRequest },
  { label: "Unauthorized (401)", func: unAuthorized },
  { label: "Forbidden (403)", func: forbidden },
  { label: "Not Found (404)", func: notFound },
  { label: "Delete (204)", func: deleteReq },
];

async function createUser(setCode, setText) {
  setCode(201);
  setText("Created");
}

async function noContent(setCode, setText) {
  setCode(204);
  setText("No Content");
}

async function moved(setCode, setText) {
  setCode(301);
  setText("Moved");
}
async function badRequest(setCode, setText) {
  setCode(400);
  setText("Bad Request");
}
async function unAuthorized(setCode, setText) {
  setCode(401);
  setText("Unauthorized");
}
async function forbidden(setCode, setText) {
  setCode(403);
  setText("Forbidden");
}
async function notFound(setCode, setText) {
  setCode(404);
  setText("Not Found");
}
async function deleteReq(setCode, setText) {
  setCode(204);
  setText("Deleted");
}

// ─── Links Practice Scenarios ─────────────────────────────────────────────────

const LinksPractice = () => {
  const [statusCode, setStatusCode] = useState(null);
  const [statusText, setStatusText] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApiCall = async (fn) => {
    setLoading(true);
    setStatusCode(null);
    setStatusText(null);
    try {
      await fn(setStatusCode, setStatusText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Scenario 1 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 1: Internal Following Links
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Click an internal link and assert the URL changes within the same tab.
        </p>
        <div className="flex flex-col gap-1.5">
          <Link
            href="/"
            id="link-internal-home"
            data-testid="link-internal-home"
            className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 w-fit"
          >
            Home
          </Link>
          <Link
            href="/about-us"
            id="link-internal-about"
            data-testid="link-internal-about"
            className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 w-fit"
          >
            About Us
          </Link>
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 2 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 2: External Links (New Tab)
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Assert{" "}
          <code className="bg-muted px-1 rounded text-[11px]">
            target=&quot;_blank&quot;
          </code>{" "}
          and switch to the new window handle after clicking.
        </p>
        <div className="flex flex-col gap-1.5">
          <Link
            href="https://www.javatpoint.com/selenium-tutorial"
            target="_blank"
            rel="noopener noreferrer"
            id="link-external-selenium"
            data-testid="link-external-selenium"
            className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 w-fit"
          >
            Selenium Automation Notes
          </Link>
          <Link
            href="https://www.udemy.com/course/selenium-real-time-examplesinterview-questions/"
            target="_blank"
            rel="noopener noreferrer"
            id="link-external-course"
            data-testid="link-external-course"
            className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 w-fit"
          >
            Selenium Complete Course
          </Link>
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 3 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 3: Broken Links
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Send an HTTP GET to the link&apos;s{" "}
          <code className="bg-muted px-1 rounded text-[11px]">href</code> and
          assert the response status is 4xx/5xx.
        </p>
        <div className="flex flex-col gap-1.5">
          <Link
            href="https://the-internet.herokuapp.com/status_codes/500"
            target="_blank"
            rel="noopener noreferrer"
            id="link-broken-newtab"
            data-testid="link-broken-newtab"
            className="text-sm text-red-600 dark:text-red-400 underline hover:text-red-800 dark:hover:text-red-300 w-fit"
          >
            Broken Link — Opens in New Tab
          </Link>
          <Link
            href="https://the-internet.herokuapp.com/status_codes/500"
            id="link-broken-same"
            data-testid="link-broken-same"
            className="text-sm text-red-600 dark:text-red-400 underline hover:text-red-800 dark:hover:text-red-300 w-fit"
          >
            Broken Link — Same Tab
          </Link>
          <Link
            href=""
            id="link-broken-empty"
            data-testid="link-broken-empty"
            className="text-sm text-red-600 dark:text-red-400 underline hover:text-red-800 dark:hover:text-red-300 w-fit"
          >
            Broken Link — Empty href
          </Link>
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 4 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 4: Image Links
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Click a link that wraps an image and assert navigation. Check{" "}
          <code className="bg-muted px-1 rounded text-[11px]">alt</code> text
          for accessibility.
        </p>
        <div className="flex items-center gap-3">
          {/* Intentionally broken image src for practice */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <a
            href=""
            id="link-image-broken"
            data-testid="link-image-broken"
            aria-label="Broken image link"
          >
            <img
              src=""
              className="w-16 h-16 rounded border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
              alt="Broken image link"
            />
          </a>
          <a
            href="https://ashisheditz.com/?s=iron+man"
            target="_blank"
            rel="noopener noreferrer"
            id="link-image-ironman"
            data-testid="link-image-ironman"
            aria-label="Iron Man image link"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ashisheditz.com/wp-content/uploads/2023/10/4k-iron-man-wallpaper.jpg"
              className="w-20 h-14 object-cover rounded shadow"
              alt="Iron Man"
              width={80}
            />
          </a>
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 5 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 5: Button Links
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Locate a{" "}
          <code className="bg-muted px-1 rounded text-[11px]">
            &lt;button&gt;
          </code>{" "}
          wrapped in a link and assert both click behaviour and navigation.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="" id="link-btn-broken" data-testid="link-btn-broken">
            <Button variant="default">Broken Button</Button>
          </Link>
          <Link href="" id="link-btn-broken-2" data-testid="link-btn-broken-2">
            <Button variant="destructive">Broken Link Button</Button>
          </Link>
          <Link href="/" id="link-btn-home" data-testid="link-btn-home">
            <Button variant="outline">Home Button</Button>
          </Link>
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 6 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 6: Text Links &amp; Anchor
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Assert link text with{" "}
          <code className="bg-muted px-1 rounded text-[11px]">getText()</code>.
          Test same-page anchor navigation.
        </p>
        <div className="flex flex-col gap-1.5">
          <Link
            href="/"
            id="link-text-garbled-1"
            data-testid="link-text-garbled-1"
            className="text-sm text-blue-700 dark:text-blue-400 underline w-fit"
          >
            Homdf56e
          </Link>
          <Link
            href="/about-us"
            id="link-text-garbled-2"
            data-testid="link-text-garbled-2"
            className="text-sm text-blue-700 dark:text-blue-400 underline w-fit"
          >
            About 32 yhs
          </Link>
          <Link
            href=""
            id="link-text-long"
            data-testid="link-text-long"
            className="text-sm text-blue-700 dark:text-blue-400 underline w-fit"
          >
            Test Links Page using Selenium Webdriver with Java and C#
          </Link>
          <Link
            href="#anchor-target"
            id="link-text-anchor"
            data-testid="link-text-anchor"
            className="text-sm text-blue-700 dark:text-blue-400 underline w-fit"
          >
            Links Anchor Text — Test Cases TC09
          </Link>
        </div>
        <div
          id="anchor-target"
          data-testid="anchor-target"
          className="text-xs text-muted-foreground mt-1 scroll-mt-24"
        >
          ↑ Anchor target reached
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 7 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 7: API Status Code Links
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Click a button, intercept the HTTP response, and assert the status
          code matches the expected value.
        </p>
        <div className="flex flex-wrap gap-2">
          {API_CALLS.map((api, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => handleApiCall(api.func)}
              disabled={loading}
              className="text-xs"
            >
              {api.label}
            </Button>
          ))}
        </div>
        <div
          id="api-status-result"
          data-testid="api-status-result"
          className="text-sm rounded-md px-3 py-2 bg-muted border border-border"
        >
          {statusCode ? (
            <>
              Status:{" "}
              <span className="font-semibold text-red-500">{statusCode}</span>
              &nbsp;·&nbsp;
              <span className="font-semibold text-red-500">{statusText}</span>
            </>
          ) : (
            <span className="text-muted-foreground">
              {loading
                ? "Calling API…"
                : "Click a button above to see the HTTP status code."}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Page Component ───────────────────────────────────────────────────────────

const LinksPage = () => {
  const [activeTech, setActiveTech] = useState("selenium");
  const res = practiceResources[SLUG];
  const badgeClass =
    difficultyStyles[res.difficultyColor]?.badge ??
    difficultyStyles.green.badge;

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="px-1">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badgeClass}`}
          >
            <GraduationCap size={12} /> {res.difficulty}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
            <Clock size={12} /> {res.timeMin} min
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
            <ListChecks size={12} /> {res.scenarioCount} scenarios
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          Links Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Master link interactions in Selenium &amp; Playwright — internal
          links, external links, broken links, image links, button links, anchor
          navigation, and HTTP status code assertions.
        </p>
      </div>

      {/* Main layout: Practice card + What You'll Learn */}
      <div className="flex md:flex-row flex-col items-start gap-5">
        {/* Practice Card */}
        <section
          aria-label="Links practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 text-sm">
              <LinksPractice />
            </CardContent>
          </Card>
        </section>

        {/* What You'll Learn + Up Next sidebar */}
        <div className="shrink-0 w-64 md:w-72">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 border-b space-y-0">
              <p className="text-base font-semibold">What You&apos;ll Learn</p>
              <GraduationCap size={18} />
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {/* Tech toggle */}
              <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 gap-0.5">
                <button
                  onClick={() => setActiveTech("selenium")}
                  className={`flex-1 text-xs font-medium py-1.5 px-2 rounded-md transition-colors ${
                    activeTech === "selenium"
                      ? "bg-white dark:bg-gray-700 shadow text-foreground"
                      : "text-gray-500 dark:text-gray-400 hover:text-foreground"
                  }`}
                >
                  Selenium (Java)
                </button>
                <button
                  onClick={() => setActiveTech("playwright")}
                  className={`flex-1 text-xs font-medium py-1.5 px-2 rounded-md transition-colors ${
                    activeTech === "playwright"
                      ? "bg-white dark:bg-gray-700 shadow text-foreground"
                      : "text-gray-500 dark:text-gray-400 hover:text-foreground"
                  }`}
                >
                  Playwright (JS/PY)
                </button>
              </div>

              {/* Method list */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
                  {activeTech === "selenium"
                    ? "Selenium (Java)"
                    : "Playwright (JS / Python)"}
                </p>
                <ul className="space-y-1.5">
                  {techMethods[activeTech].map((method) => (
                    <li
                      key={method.name}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${method.color}`}
                      />
                      <span className="font-light">{method.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-center gap-1.5 p-3 border-t">
              <Video size={14} className="text-gray-400 dark:text-gray-500" />
              {res.youtubeUrl ? (
                <Link
                  href={res.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Watch Tutorial
                </Link>
              ) : (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Tutorial video coming soon
                </span>
              )}
            </CardFooter>
          </Card>

          <NextElementCard currentSlug={SLUG} />
        </div>
      </div>

      {/* Test Cases */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Test Cases</h2>
        <Accordion type="multiple" className="space-y-2">
          {linksTC.map((tc) => (
            <AccordionItem
              key={tc.TestId}
              value={tc.TestId}
              className="border rounded-lg px-4 bg-background"
            >
              <AccordionTrigger className="text-sm py-3 hover:no-underline">
                <span className="font-medium text-left">
                  {tc.TestId}: {tc.TestCaseName}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <ol className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
                  {tc.steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 py-2 text-xs xl:text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="shrink-0 font-medium text-gray-400 dark:text-gray-500 w-4 text-right">
                        {i + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default LinksPage;
