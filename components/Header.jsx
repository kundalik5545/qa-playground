"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import SheetOpen from "./NavbarSheet";
import { ModeToggle } from "./lib/Mode-toggle";
import Image from "next/image";

const Header = () => {
  const mainNavLinks = [
    { to: "/", text: "Home" },
    { to: "/study-tracker/dashboard", text: "Study Tracker", badge: "New" },
    { to: "/bank", text: "Bank Demo" },
    { to: "/practice", text: "Practice" },
    { to: "/blog", text: "Blog" },
    { to: "/login", text: "Login" },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-black backdrop-blur-md z-50 border-b shadow-sm py-2">
      <nav className="container mx-auto px-1  flex items-center justify-between">
        <Link href="/" passHref>
          <span className="text-2xl flex items-center justify-center gap-2">
            <Image
              src="/mainicons/edit.svg"
              width={30}
              height={30}
              alt="QA PlayGround - Automation Testing Practice Platform"
            />
            <span className="gradient-subTitle font-semibold">
              QA PlayGround
            </span>
          </span>
        </Link>
        {/* Mobile Menu */}
        <div className="block md:hidden">
          <ModeToggle />
        </div>
        <SheetOpen>
          <Menu className="lg:hidden cursor-pointer" size={28} />
        </SheetOpen>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-4"
        >
          {mainNavLinks.map(({ to, text, badge }, index) => (
            <Link
              key={index}
              href={to}
              prefetch={false}
              className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {text}
              {badge && (
                <span
                  aria-label="(New feature)"
                  className="ml-1.5 rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
                >
                  {badge}
                </span>
              )}
            </Link>
          ))}

          {/* Dark Mode Toggle */}
          <ModeToggle />
        </nav>
      </nav>
    </header>
  );
};

export default Header;
