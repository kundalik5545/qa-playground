"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const allElements = [
  {
    title: "Input Fields",
    logo: "/mainicons/edit.svg",
    Description: "Interact with different types of input fields",
    footerTitle: "Practice Now",
    link: "/practice/input",
  },
  {
    title: "Buttons",
    logo: "/mainicons/buttons.svg",
    Description: "Click, double-click, right-click, and disabled buttons",
    footerTitle: "Practice Now",
    link: "/practice/button",
  },
  {
    title: "Forms",
    logo: "/mainicons/sign-form.svg",
    Description: "Fill and submit forms with validation scenarios",
    footerTitle: "Practice Now",
    link: "/practice/forms",
  },
  {
    title: "Dropdowns",
    logo: "/mainicons/select.svg",
    Description: "Handle single and multi-option dropdown selections",
    footerTitle: "Practice Now",
    link: "/practice/select",
  },
  {
    title: "Data Table",
    logo: "/mainicons/simtable.svg",
    Description: "Practice reading, sorting, and filtering table data",
    footerTitle: "Practice Now",
    link: "/practice/simple-table",
  },
  {
    title: "Alerts & Dialogs",
    logo: "/mainicons/alert.svg",
    Description: "Handle browser alerts, confirms, and prompt dialogs",
    footerTitle: "Practice Now",
    link: "/practice/alert",
  },
  {
    title: "Radio & Checkbox",
    logo: "/mainicons/radio.svg",
    Description: "Toggle radio buttons and checkboxes in different states",
    footerTitle: "Practice Now",
    link: "/practice/radio",
  },
  {
    title: "Date Picker",
    logo: "/mainicons/calendar.svg",
    Description: "Interact with date pickers and time selection elements",
    footerTitle: "Practice Now",
    link: "/practice/calendar",
  },
  {
    title: "Links",
    logo: "/mainicons/edit.svg",
    Description: "Interact with different types of links and navigation",
    footerTitle: "Practice Now",
    link: "/practice/links",
  },
  {
    title: "Tabs & Windows",
    logo: "/mainicons/window.svg",
    Description: "Switch between browser tabs and pop-up windows",
    footerTitle: "Practice Now",
    link: "/practice/window",
  },
  {
    title: "Dynamic Waits",
    logo: "/mainicons/waits.svg",
    Description: "Practice explicit and implicit waits for dynamic content",
    footerTitle: "Practice Now",
    link: "/practice/waits",
  },
  {
    title: "Multi Select",
    logo: "/mainicons/alert.svg",
    Description: "Practice selecting multiple items from lists and dropdowns",
    footerTitle: "Practice Now",
    link: "/practice/multi-select",
  },
  {
    title: "File Upload",
    logo: "/mainicons/download.svg",
    Description: "Practice file upload and download automation scenarios",
    footerTitle: "Practice Now",
    link: "/practice/upload-download",
  },
  {
    title: "Bank App",
    logo: "/mainicons/edit.svg",
    Description: "End-to-end POM practice with a realistic bank demo app",
    footerTitle: "Start Practice",
    link: "/bank",
    isBankDemo: true,
  },
];

export default function PracticeClientContent() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return allElements;
    return allElements.filter(
      (el) =>
        el.title.toLowerCase().includes(q) ||
        el.Description.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search practice elements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-600"
          aria-label="Search practice elements"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-lg font-semibold mb-1">No elements found</p>
          <p className="text-sm">Try a different search term.</p>
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filtered.map((el, i) => (
          <Link
            key={i}
            href={el.link}
            prefetch={false}
            aria-label={`Practice ${el.title} – ${el.Description}`}
            className="block group cursor-pointer"
          >
            <Card className="h-56 transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1 group-hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between p-1 shadow-lg dark:shadow-md dark:shadow-gray-800 space-y-0">
                <p className="px-2 text-xl font-semibold">{el.title}</p>
                {el.isBankDemo && (
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded-full">
                    Bank Demo
                  </span>
                )}
                <Image
                  src={el.logo}
                  width={50}
                  height={50}
                  className="p-1"
                  alt=""
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent className="p-3 h-28">
                <p className="py-7 text-base dark:text-gray-200 text-center">
                  {el.Description}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-center justify-center p-2 border-t">
                <span className="underline text-blue-600 dark:text-teal-200 font-light group-hover:text-blue-800 dark:group-hover:text-teal-100 transition-colors duration-150">
                  {el.footerTitle}
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
