"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

/**
 * Reusable FAQ accordion for practice element pages.
 * Props:
 *   faqs  — array of { q: string, a: string }
 *           (looked up in data/practiceElementFaqs.js by the parent server component)
 *
 * To add FAQs for a new element, add a key to data/practiceElementFaqs.js.
 * No changes needed here.
 */
const PracticeElementFAQ = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto mt-16 mb-10 px-1">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle size={20} className="text-primary flex-shrink-0" />
        <h2 className="text-xl font-semibold text-foreground">
          Frequently Asked Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {faqs.map((item, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-border rounded-lg px-4 data-[state=open]:border-primary/50 transition-colors"
          >
            <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default PracticeElementFAQ;
