"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ListChecks } from "lucide-react";

/**
 * BankTestCases
 * Renders FAQ-style accordion test cases for any bank page.
 *
 * Props:
 *   testCases  — array of { TestId, TestCaseName, steps[] }
 *   title      — optional section heading (default: "Test Cases")
 */
export default function BankTestCases({ testCases, title = "Test Cases" }) {
  if (!testCases || testCases.length === 0) return null;

  return (
    <section
      className="bg-card border rounded-lg p-6 space-y-4"
      id="bank-test-cases-section"
      data-testid="bank-test-cases-section"
    >
      <div className="flex items-center gap-2">
        <ListChecks className="h-5 w-5 text-purple-600 shrink-0" />
        <h2 className="text-lg font-semibold" id="test-cases-heading">
          {title}
        </h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Expand each test case to see step-by-step automation instructions for
        Selenium and Playwright.
      </p>

      <Accordion
        type="multiple"
        className="space-y-2"
        id="test-cases-accordion"
        data-testid="test-cases-accordion"
      >
        {testCases.map((tc) => (
          <AccordionItem
            key={tc.TestId}
            value={tc.TestId}
            className="border rounded-lg px-4 bg-background"
            id={`tc-item-${tc.TestId}`}
            data-testid={`tc-item-${tc.TestId}`}
          >
            <AccordionTrigger
              className="text-sm py-3 hover:no-underline"
              id={`tc-trigger-${tc.TestId}`}
              data-testid={`tc-trigger-${tc.TestId}`}
            >
              <span className="font-medium text-left">
                <span className="text-purple-600 mr-1">{tc.TestId}:</span>
                {tc.TestCaseName}
              </span>
            </AccordionTrigger>

            <AccordionContent
              className="pb-3"
              id={`tc-content-${tc.TestId}`}
              data-testid={`tc-content-${tc.TestId}`}
            >
              <ol
                className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800"
                id={`tc-steps-${tc.TestId}`}
              >
                {tc.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 py-2 text-xs xl:text-sm text-gray-600 dark:text-gray-400"
                    id={`tc-step-${tc.TestId}-${i + 1}`}
                    data-testid={`tc-step-${tc.TestId}-${i + 1}`}
                  >
                    <span className="shrink-0 font-medium text-purple-400 dark:text-purple-500 w-5 text-right">
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
    </section>
  );
}
