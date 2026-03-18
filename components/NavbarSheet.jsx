"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { Button } from "./ui/button";
import { basicDetails } from "@/data/BasicSetting";

const SheetOpen = ({ children }) => {
  const [open, setOpen] = useState(false);

  // Centralized navigation links data
  const navigationLinks = [
    { href: "/", label: "Home", altText: "Navigate to homepage" },
    { href: "/study-tracker", label: "Study Tracker", altText: "Track your study progress", badge: "New" },
    { href: "/blog", label: "Blog", altText: "Read our latest blog posts" },
    {
      href: "/elements/text-box",
      label: "Elements",
      altText: "Browse UI elements",
    },
    {
      href: "/forms/basic-details",
      label: "Forms",
      altText: "Explore form components",
    },
    {
      href: "/alert-window/browser-window",
      label: "Alert & Window",
      altText: "Alert and window examples",
    },
    {
      href: "widget/basic-details",
      label: "Widget",
      altText: "Interactive widgets",
    },
    {
      href: "/interactions/basic-details",
      label: "Interactions",
      altText: "User interaction examples",
    },
    {
      href: "/about-us",
      label: "About-Us",
      altText: "About us page",
    },
    {
      href: "/contact-us",
      label: "Contact-Us",
      altText: "Contac Us page",
    },
    {
      href: "/privacy-policy",
      label: "Privacy Policy",
      altText: "Privacy Policy page",
    },
  ];

  // Handle navigation click
  const handleNavigationClick = () => {
    setOpen(false);
  };

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>{basicDetails.websiteName}</SheetTitle>
            <SheetDescription>
              <div className="flex flex-col items-start space-y-2">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-label={link.altText}
                    onClick={handleNavigationClick}
                  >
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-base text-left"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="ml-1.5 rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                          {link.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SheetOpen;
