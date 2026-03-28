"use client";
import React, { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GraduationCap, Clock, ListChecks, Video } from "lucide-react";
import Link from "next/link";
import { dataTableTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";

const techMethods = {
  selenium: [
    { name: "findElements(By.tagName('tr'))", color: "bg-purple-500" },
    { name: "findElement(By.xpath(...))", color: "bg-blue-500" },
    { name: "getText()", color: "bg-emerald-500" },
    { name: "getAttribute()", color: "bg-orange-400" },
    { name: "Actions.moveToElement()", color: "bg-slate-500" },
  ],
  playwright: [
    { name: "locator('table tr')", color: "bg-blue-500" },
    { name: "locator.nth()", color: "bg-purple-500" },
    { name: "filter({hasText})", color: "bg-orange-400" },
    { name: "textContent()", color: "bg-emerald-500" },
    { name: "toHaveCount()", color: "bg-red-500" },
  ],
};

const SLUG = "data-table";

const SimpleTablePage = () => {
  const [activeTech, setActiveTech] = useState("selenium");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const res = practiceResources[SLUG];
  const badgeClass =
    difficultyStyles[res.difficultyColor]?.badge ?? difficultyStyles.green.badge;

  useEffect(() => {
    fetch("https://fakerapi.it/api/v2/books?_quantity=10&&_locale=en_IN")
      .then((r) => r.json())
      .then((json) => {
        setTableData(json.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* A. Hero Section */}
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
          Data Table Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Practice reading, counting, and locating rows and cells in a dynamically
          loaded HTML table — essential skills for Selenium &amp; Playwright table
          automation.
        </p>
      </div>

      {/* B. Main Layout Row */}
      <div className="flex md:flex-row flex-col items-start gap-5">

        {/* B1. Practice Card */}
        <section
          aria-label="Data table practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 space-y-5 text-sm">

              {/* Scenario 1: Verify table headers */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 1: Verify All Column Headers
                </span>
                <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
                  <Table id="books-table" data-testid="books-table">
                    <TableCaption className="text-xs text-gray-400 dark:text-gray-500">
                      Books data loaded from fakerapi — 10 rows
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          id="col-sr"
                          data-testid="col-sr"
                          className="w-[50px]"
                        >
                          Sr No.
                        </TableHead>
                        <TableHead id="col-title" data-testid="col-title">
                          Book Name
                        </TableHead>
                        <TableHead id="col-genre" data-testid="col-genre">
                          Book Genre
                        </TableHead>
                        <TableHead id="col-author" data-testid="col-author">
                          Book Author
                        </TableHead>
                        <TableHead id="col-isbn" data-testid="col-isbn">
                          Book ISBN
                        </TableHead>
                        <TableHead id="col-published" data-testid="col-published">
                          Book Published
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    {/* Scenario 2–6: Table body — rows, cells, data assertions */}
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-gray-400 dark:text-gray-500"
                            data-testid="table-loading"
                          >
                            Loading books...
                          </TableCell>
                        </TableRow>
                      ) : tableData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-gray-400 dark:text-gray-500"
                            data-testid="table-empty"
                          >
                            No data available.
                          </TableCell>
                        </TableRow>
                      ) : (
                        tableData.map((book, index) => (
                          <TableRow
                            key={book.id}
                            id={`row-${book.id}`}
                            data-testid={`table-row-${index + 1}`}
                          >
                            <TableCell
                              className="font-medium"
                              data-testid={`cell-sr-${index + 1}`}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell data-testid={`cell-title-${index + 1}`}>
                              {book.title}
                            </TableCell>
                            <TableCell data-testid={`cell-genre-${index + 1}`}>
                              {book.genre}
                            </TableCell>
                            <TableCell data-testid={`cell-author-${index + 1}`}>
                              {book.author}
                            </TableCell>
                            <TableCell data-testid={`cell-isbn-${index + 1}`}>
                              {book.isbn}
                            </TableCell>
                            <TableCell data-testid={`cell-published-${index + 1}`}>
                              {book.published}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

            </CardContent>
          </Card>
        </section>

        {/* B2. What You'll Learn */}
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
                    <li key={method.name} className="flex items-center gap-2 text-sm">
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

      {/* C. Test Cases */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Test Cases</h2>
        <Accordion type="multiple" className="space-y-2">
          {dataTableTC.map((tc) => (
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

export default SimpleTablePage;
