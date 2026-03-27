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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Clock,
  ListChecks,
  Video,
  BookOpen,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";
import { alertTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";

const SLUG = "alerts-dialogs";

const techMethods = {
  selenium: [
    { name: "driver.switchTo().alert()", color: "bg-purple-500" },
    { name: "Alert.accept()", color: "bg-blue-500" },
    { name: "Alert.dismiss()", color: "bg-orange-400" },
    { name: "Alert.getText()", color: "bg-emerald-500" },
    { name: "Alert.sendKeys()", color: "bg-slate-500" },
  ],
  playwright: [
    { name: 'page.on("dialog")', color: "bg-blue-500" },
    { name: "dialog.accept()", color: "bg-purple-500" },
    { name: "dialog.dismiss()", color: "bg-orange-400" },
    { name: "dialog.message()", color: "bg-emerald-500" },
    { name: "dialog.type()", color: "bg-red-500" },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ModalAlert = ({ children }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Modern Alert</AlertDialogTitle>
        <AlertDialogDescription>
          Modern Alert — some people call this a &ldquo;sweet alert&rdquo; as
          well.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel id="btn-modal-cancel" data-testid="btn-modal-cancel">
          You Are!
        </AlertDialogCancel>
        <AlertDialogAction
          id="btn-modal-confirm"
          data-testid="btn-modal-confirm"
        >
          Sometime
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const DialogShareButton = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        id="btn-dialog-share"
        data-testid="btn-dialog-share"
      >
        Share
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Share link</DialogTitle>
        <DialogDescription>Share this link with friends.</DialogDescription>
      </DialogHeader>
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="share-link" className="sr-only">
            Link
          </Label>
          <Input
            id="share-link"
            data-testid="input-share-link"
            defaultValue="https://www.qaplayground.com/practice/alerts-dialogs"
            readOnly
          />
        </div>
        <Button
          type="button"
          size="sm"
          className="px-3"
          id="btn-copy-link"
          data-testid="btn-copy-link"
        >
          <span className="sr-only">Copy</span>
          <Copy />
        </Button>
      </div>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            id="btn-dialog-close"
            data-testid="btn-dialog-close"
          >
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ─── Alerts Practice Scenarios ────────────────────────────────────────────────

const AlertsPractice = () => {
  const [promptText, setPromptText] = useState("");
  const [confirmResult, setConfirmResult] = useState("");

  return (
    <div className="space-y-5">
      {/* Scenario 1 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 1: Simple Alert
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Click the button, then use{" "}
          <code className="bg-muted px-1 rounded text-[11px]">
            driver.switchTo().alert()
          </code>{" "}
          to accept it and verify the alert text.
        </p>
        <Button
          id="btn-simple-alert"
          data-testid="btn-simple-alert"
          variant="outline"
          onClick={() => alert("Welcome to QA PlayGround!")}
        >
          Simple Alert
        </Button>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 2 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 2: Confirm Alert
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Accept or dismiss the confirm dialog, then assert the returned boolean
          value.
        </p>
        <Button
          id="btn-confirm-alert"
          data-testid="btn-confirm-alert"
          variant="secondary"
          onClick={() => {
            const result = window.confirm("Do you know QA Playground?");
            setConfirmResult(result ? "Accepted" : "Dismissed");
          }}
        >
          Confirm Alert
        </Button>
        {confirmResult && (
          <p
            data-testid="result-confirm"
            className={`text-xs rounded-md px-3 py-1.5 border w-fit font-medium ${
              confirmResult === "Accepted"
                ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
            }`}
          >
            Result: {confirmResult}
          </p>
        )}
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 3 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 3: Prompt Alert
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Use{" "}
          <code className="bg-muted px-1 rounded text-[11px]">
            Alert.sendKeys()
          </code>{" "}
          to type in the prompt, then accept and assert the captured value.
        </p>
        <Button
          id="btn-prompt-alert"
          data-testid="btn-prompt-alert"
          variant="destructive"
          onClick={() => {
            const entered = window.prompt("Enter your name");
            if (entered !== null) setPromptText(entered);
          }}
        >
          Prompt Alert
        </Button>
        {promptText && (
          <p
            data-testid="result-prompt"
            className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-1.5 w-fit"
          >
            Your name is — <span className="font-semibold">{promptText}</span>
          </p>
        )}
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 4 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 4: Toast Alert
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Trigger the toast, then assert the{" "}
          <code className="bg-muted px-1 rounded text-[11px]">
            [data-sonner-toast]
          </code>{" "}
          element is visible in the DOM.
        </p>
        <Button
          id="btn-toast-alert"
          data-testid="btn-toast-alert"
          variant="exportBtn"
          onClick={() => toast.success("This is simple toast.")}
        >
          Toast Alert
        </Button>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 5 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 5: Sweet Alert (Modal)
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Open the modal dialog, then assert the title text and click Accept or
          Cancel.
        </p>
        <ModalAlert>
          <Button
            id="btn-modal-alert"
            variant="importBtn"
            data-testid="btn-modal-alert"
          >
            Sweet Alert
          </Button>
        </ModalAlert>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 6 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 6: Advanced UI Dialog
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Open the dialog, assert the share link input value, copy it, then
          close with the Close button.
        </p>
        <DialogShareButton />
      </div>
    </div>
  );
};

// ─── Page Component ───────────────────────────────────────────────────────────

const AlertPage = () => {
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
          Alerts &amp; Dialogs Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Master alert and dialog handling in Selenium &amp; Playwright — simple
          alerts, confirm dialogs, prompt inputs, toast notifications, modal
          alerts, and advanced dialogs.
        </p>
      </div>

      {/* Main layout: Practice card + What You'll Learn */}
      <div className="flex md:flex-row flex-col items-start gap-5">
        {/* Practice Card */}
        <section
          aria-label="Alerts and dialogs practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 text-sm">
              <AlertsPractice />
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
          {alertTC.map((tc) => (
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

export default AlertPage;
