"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { GraduationCap, Clock, Lock, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const InputPage = () => {
  const [text, setText] = useState("QA PlayGround Clear Me");

  return (
    <div>
      {/* Hero section */}
      <div className="mb-6 px-1">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
            Beginner
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock size={12} /> ~15 min
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            6 scenarios
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          Input Field Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Master text input interactions in Selenium &amp; Playwright — typing,
          clearing, reading values, and detecting disabled/readonly states.
        </p>
      </div>

      <div className="flex md:flex-row flex-col items-start gap-5">
        {/* Practice Card */}
        <section
          aria-label="Input field practice exercises"
          className="main-section"
        >
          <div className="flex justify-center items-center">
            <Card className="w-[350px] sm:w-[500px] shadow-lg rounded-lg">
              <CardContent className="space-y-4 pt-4 sm:pt-3 text-sm sm:text-base">

                {/* 1. Movie Name Input */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="movieName" className="text-sm sm:text-base">
                    Enter any movie name
                  </Label>
                  <Input
                    id="movieName"
                    name="movieName"
                    data-testid="input-movie-name"
                    placeholder="Enter hollywood movie name"
                    className="text-sm md:text-base"
                  />
                </div>

                {/* 2. Append & Tab */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="appendText" className="text-sm sm:text-base">
                    Append a text and press keyboard tab
                  </Label>
                  <Input
                    id="appendText"
                    name="appendText"
                    data-testid="input-append-text"
                    defaultValue="I am good "
                    className="text-sm sm:text-base"
                  />
                </div>

                {/* 3. Verify text */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="insideText" className="text-sm sm:text-base">
                    Verify text present inside input field
                  </Label>
                  <Input
                    id="insideText"
                    name="insideText"
                    data-testid="input-verify-text"
                    defaultValue="QA PlayGround"
                    className="text-sm sm:text-base"
                  />
                </div>

                {/* 4. Clear the text */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="clearText" className="text-sm sm:text-base">
                    Clear the text
                  </Label>
                  <Input
                    id="clearText"
                    name="clearText"
                    data-testid="input-clear-text"
                    value={text}
                    className="text-sm sm:text-base"
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                {/* 5. Disabled */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="disabledInput"
                      className="text-sm sm:text-base"
                    >
                      Check edit field is disabled
                    </Label>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      <Lock size={9} /> DISABLED
                    </span>
                  </div>
                  <Input
                    id="disabledInput"
                    name="disabledInput"
                    data-testid="input-disabled"
                    value="Enter"
                    disabled
                    className="text-sm sm:text-base border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20"
                  />
                </div>

                {/* 6. Readonly */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="readonlyInput"
                      className="text-sm sm:text-base"
                    >
                      Check text is readonly
                    </Label>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      <Eye size={9} /> READ-ONLY
                    </span>
                  </div>
                  <Input
                    id="readonlyInput"
                    name="readonlyInput"
                    data-testid="input-readonly"
                    value="This text is readonly"
                    readOnly
                    className="text-sm sm:text-base border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20"
                  />
                </div>

              </CardContent>
            </Card>
          </div>
        </section>

        {/* Insight Card */}
        <div className="insights-section p-2 shrink-0">
          <Card className="w-72 md:w-80">
            <CardHeader className="flex flex-row items-center justify-between p-2 shadow-lg dark:shadow-md dark:shadow-gray-800 space-y-0">
              <p className="px-2 text-xl font-semibold">What You&apos;ll Learn</p>
              <GraduationCap />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} />
                <span>~15 minutes</span>
                <span className="ml-auto text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full">
                  Beginner
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Selenium (Java)
                </p>
                <ul className="text-sm space-y-0.5 font-light">
                  <li>✅ sendKeys()</li>
                  <li>✅ clear()</li>
                  <li>✅ getAttribute()</li>
                  <li>✅ isEnabled()</li>
                  <li>✅ Keys.TAB</li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Playwright (JS / Python)
                </p>
                <ul className="text-sm space-y-0.5 font-light">
                  <li>✅ fill()</li>
                  <li>✅ press(&quot;Tab&quot;)</li>
                  <li>✅ inputValue()</li>
                  <li>✅ toBeDisabled()</li>
                  <li>✅ toHaveAttribute()</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center p-2 py-4 border-t">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Tutorial video coming soon
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InputPage;
