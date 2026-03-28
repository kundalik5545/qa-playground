"use client";

import { useState } from "react";
import Link from "next/link";
import { basicDetails } from "@/data/BasicSetting";
import {
  Bug,
  Lightbulb,
  ExternalLink,
  Github,
  Mail,
  Send,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Wrench,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const CATEGORY_OPTIONS = [
  { value: "bug", label: "Bug Report", icon: Bug, color: "text-red-500" },
  {
    value: "feature",
    label: "Feature Request",
    icon: Lightbulb,
    color: "text-yellow-500",
  },
  {
    value: "improvement",
    label: "Improvement",
    icon: Wrench,
    color: "text-blue-500",
  },
  {
    value: "feedback",
    label: "General Feedback",
    icon: MessageSquare,
    color: "text-purple-500",
  },
];

const AUTO_SUBJECTS = {
  bug: "[QA Playground] Bug Report",
  feature: "[QA Playground] Feature Request",
  improvement: "[QA Playground] Improvement Suggestion",
  feedback: "[QA Playground] General Feedback",
};

const GITHUB_ISSUES_URL =
  "https://github.com/kundalik5545/qa-playground/issues";

export default function RaiseIssuePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "bug",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategorySelect = (value) => {
    setForm((prev) => ({ ...prev, category: value }));
  };

  const autoSubject = AUTO_SUBJECTS[form.category];

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCategory =
      CATEGORY_OPTIONS.find((c) => c.value === form.category)?.label ||
      form.category;

    const subject = encodeURIComponent(autoSubject);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCategory: ${selectedCategory}\n\n${form.message}`,
    );

    window.location.href = `mailto:${basicDetails.websiteEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const isFormValid =
    form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 text-xs font-medium border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
            >
              Community Support
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="gradient-title">Raise an Issue</span>
              <br />
              <span className="text-foreground text-3xl md:text-4xl">
                or Share a Suggestion
              </span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Found a bug? Have a feature idea? Want to improve the platform?
              We&apos;re all ears. Report issues on GitHub or send your
              suggestions directly to us.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            {[
              {
                icon: Bug,
                label: "Bugs tracked on GitHub",
                color: "text-red-500",
              },
              {
                icon: Lightbulb,
                label: "Feature ideas welcome",
                color: "text-yellow-500",
              },
              {
                icon: Star,
                label: "Every feedback counts",
                color: "text-purple-500",
              },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon className={`h-4 w-4 ${color}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto max-w-5xl px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — GitHub Issues */}
          <div className="flex flex-col gap-6">
            <Card className="border-2 border-dashed border-border hover:border-blue-400 dark:hover:border-blue-600 transition-colors group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 transition-colors">
                    <Github className="h-6 w-6 text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border-0"
                  >
                    Recommended for Bugs
                  </Badge>
                </div>
                <CardTitle className="text-xl">Raise a GitHub Issue</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  For bug reports, reproducible issues, or feature requests with
                  detailed discussion — GitHub Issues is the best place. Issues
                  are tracked, versioned, and visible to the whole community.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <div className="space-y-2.5">
                  {[
                    {
                      icon: Bug,
                      text: "Broken UI elements",
                      color: "text-red-500",
                    },
                    {
                      icon: AlertCircle,
                      text: "Automation test hooks missing",
                      color: "text-orange-500",
                    },
                    {
                      icon: Lightbulb,
                      text: "New practice element ideas",
                      color: "text-yellow-500",
                    },
                    {
                      icon: Wrench,
                      text: "Performance or accessibility issues",
                      color: "text-blue-500",
                    },
                  ].map(({ icon: Icon, text, color }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${color}`} />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={GITHUB_ISSUES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2"
                >
                  <Button className="w-full gap-2 group/btn" size="lg">
                    <Github className="h-4 w-4" />
                    Open GitHub Issues
                    <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center">
                  A GitHub account is required to submit issues.
                </p>
              </CardContent>
            </Card>

            {/* Tips card */}
            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
              <CardContent className="pt-5">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Tips for a Good Issue Report
                </h3>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {[
                    "Include the page URL where the issue occurs",
                    "Describe steps to reproduce the problem",
                    "Mention your browser and OS version",
                    "Attach screenshots or screen recordings if possible",
                    "Check if a similar issue already exists before posting",
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 flex-shrink-0 mt-0.5 text-blue-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right — Email Suggestion Form */}
          <div>
            <Card className="border-2 border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30">
                    <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border-0"
                  >
                    Suggestions & Feedback
                  </Badge>
                </div>
                <CardTitle className="text-xl">Send a Suggestion</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Have an idea, general feedback, or want to collaborate? Send
                  it directly to our inbox. We read every message.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                    <div className="p-4 rounded-full bg-green-50 dark:bg-green-950/30">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      Your email client should open!
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Your message has been pre-filled in your email client.
                      Just hit send and we&apos;ll get back to you.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category selector */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {CATEGORY_OPTIONS.map(
                          ({ value, label, icon: Icon, color }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleCategorySelect(value)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                                form.category === value
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                                  : "border-border text-muted-foreground hover:border-border/80 hover:bg-muted/50"
                              }`}
                            >
                              <Icon className={`h-3.5 w-3.5 ${color}`} />
                              <span className="text-xs">{label}</span>
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Name + Email row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Your Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Your Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Subject — auto-generated, read-only */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">
                        Subject{" "}
                        <span className="text-xs font-normal text-muted-foreground ml-1">
                          (auto-generated)
                        </span>
                      </Label>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/50 text-sm text-muted-foreground select-none">
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                        <span className="font-medium text-foreground">
                          {autoSubject}
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Describe your suggestion, idea, or feedback in detail..."
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="text-sm resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={!isFormValid}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Send className="h-4 w-4" />
                      Send Suggestion
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      This opens your email client with the message pre-filled.
                      Your email:{" "}
                      <Link
                        href={`mailto:${basicDetails.websiteEmail}`}
                        className="underline hover:text-foreground transition-colors"
                      >
                        {basicDetails.websiteEmail}
                      </Link>
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">
            Every Report Makes QA Playground Better
          </h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto text-sm leading-relaxed">
            This platform is built for the QA community, by the QA community.
            Your feedback directly shapes the features, elements, and tools we
            build next.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={GITHUB_ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                className="gap-2 bg-white text-blue-700 hover:bg-blue-50"
              >
                <Github className="h-4 w-4" />
                GitHub Issues
                <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </Link>
            <Link href="/practice">
              <Button
                variant="outline"
                className="gap-2 bg-white text-blue-700 hover:bg-blue-50"
              >
                Back to Practice
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
