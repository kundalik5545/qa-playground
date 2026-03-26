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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Clock,
  ListChecks,
  Video,
  CircleCheckBig,
} from "lucide-react";
import Link from "next/link";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";
import { formsTC } from "@/data/formsTestCases";

const SLUG = "forms";

const techMethods = {
  selenium: [
    { name: "sendKeys()", color: "bg-purple-500" },
    { name: "click()", color: "bg-blue-500" },
    { name: "selectByVisibleText()", color: "bg-orange-400" },
    { name: "submit()", color: "bg-emerald-500" },
    { name: "isDisplayed()", color: "bg-slate-500" },
  ],
  playwright: [
    { name: "fill()", color: "bg-blue-500" },
    { name: "check()", color: "bg-emerald-500" },
    { name: "selectOption()", color: "bg-orange-400" },
    { name: "locator.click()", color: "bg-purple-500" },
    { name: "toBeVisible()", color: "bg-red-400" },
  ],
};

const INTERESTS = [
  { id: "selenium", label: "Selenium" },
  { id: "playwright", label: "Playwright" },
  { id: "cypress", label: "Cypress" },
  { id: "appium", label: "Appium" },
  { id: "jest", label: "Jest" },
];

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  country: "",
  city: "",
  bio: "",
  password: "",
  confirmPassword: "",
  interests: [],
  terms: false,
};

const RegistrationForm = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInterestToggle = (id) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleTermsToggle = (checked) => {
    setForm((prev) => ({ ...prev, terms: checked }));
    if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }
    if (!form.dob) newErrors.dob = "Date of birth is required.";
    if (!form.gender) newErrors.gender = "Please select a gender.";
    if (!form.country) newErrors.country = "Please select a country.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!form.terms) newErrors.terms = "You must accept the terms.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div
        id="formSuccessMsg"
        data-testid="form-success-msg"
        className="flex flex-col items-center justify-center gap-4 py-12 text-center"
      >
        <CircleCheckBig
          size={56}
          className="text-green-500"
          data-testid="success-icon"
        />
        <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400">
          Form Submitted Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">
          Hi{" "}
          <span
            id="submittedName"
            data-testid="submitted-name"
            className="font-semibold"
          >
            {form.firstName} {form.lastName}
          </span>
          , your details have been recorded.
        </p>
        <Button
          id="resetFormBtn"
          data-testid="reset-form-btn"
          variant="outline"
          onClick={handleReset}
        >
          Fill Again
        </Button>
      </div>
    );
  }

  return (
    <form
      id="userRegistrationForm"
      data-testid="user-registration-form"
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {/* Personal Details */}
      <section>
        <h3 className="text-base font-semibold mb-3 border-b pb-1 dark:border-gray-700">
          Personal Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              name="firstName"
              data-testid="input-first-name"
              placeholder="John"
              value={form.firstName}
              onChange={handleChange}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p id="firstNameError" data-testid="error-first-name" className="text-xs text-red-500">
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              data-testid="input-last-name"
              placeholder="Doe"
              value={form.lastName}
              onChange={handleChange}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p id="lastNameError" data-testid="error-last-name" className="text-xs text-red-500">
                {errors.lastName}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              data-testid="input-email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p id="emailError" data-testid="error-email" className="text-xs text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="phone">
              Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              data-testid="input-phone"
              placeholder="9876543210"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p id="phoneError" data-testid="error-phone" className="text-xs text-red-500">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="dob">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              data-testid="input-dob"
              value={form.dob}
              onChange={handleChange}
              className={errors.dob ? "border-red-500" : ""}
            />
            {errors.dob && (
              <p id="dobError" data-testid="error-dob" className="text-xs text-red-500">
                {errors.dob}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>
              Gender <span className="text-red-500">*</span>
            </Label>
            <div id="genderGroup" data-testid="gender-group" className="flex gap-5 pt-1">
              {["Male", "Female", "Other"].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    id={`gender-${g.toLowerCase()}`}
                    data-testid={`radio-gender-${g.toLowerCase()}`}
                    name="gender"
                    value={g.toLowerCase()}
                    checked={form.gender === g.toLowerCase()}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
            {errors.gender && (
              <p id="genderError" data-testid="error-gender" className="text-xs text-red-500">
                {errors.gender}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Address */}
      <section>
        <h3 className="text-base font-semibold mb-3 border-b pb-1 dark:border-gray-700">
          Address
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="country">
              Country <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) => handleSelectChange("country", val)}
              value={form.country}
            >
              <SelectTrigger
                id="country"
                data-testid="select-country"
                className={errors.country ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && (
              <p id="countryError" data-testid="error-country" className="text-xs text-red-500">
                {errors.country}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="city">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              name="city"
              data-testid="input-city"
              placeholder="Mumbai"
              value={form.city}
              onChange={handleChange}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p id="cityError" data-testid="error-city" className="text-xs text-red-500">
                {errors.city}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="bio">About You</Label>
            <textarea
              id="bio"
              name="bio"
              data-testid="textarea-bio"
              placeholder="Tell us a little about yourself..."
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Interests */}
      <section>
        <h3 className="text-base font-semibold mb-3 border-b pb-1 dark:border-gray-700">
          Interests
        </h3>
        <div id="interestsGroup" data-testid="interests-group" className="flex flex-wrap gap-4">
          {INTERESTS.map((item) => (
            <label
              key={item.id}
              htmlFor={`interest-${item.id}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                id={`interest-${item.id}`}
                data-testid={`checkbox-interest-${item.id}`}
                checked={form.interests.includes(item.id)}
                onCheckedChange={() => handleInterestToggle(item.id)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Account Details */}
      <section>
        <h3 className="text-base font-semibold mb-3 border-b pb-1 dark:border-gray-700">
          Account Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              data-testid="input-password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p id="passwordError" data-testid="error-password" className="text-xs text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="confirmPassword">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              data-testid="input-confirm-password"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p id="confirmPasswordError" data-testid="error-confirm-password" className="text-xs text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Terms */}
      <div className="flex flex-col gap-1">
        <label htmlFor="terms" className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            id="terms"
            data-testid="checkbox-terms"
            checked={form.terms}
            onCheckedChange={handleTermsToggle}
            className={errors.terms ? "border-red-500" : ""}
          />
          <span className="text-sm">
            I agree to the{" "}
            <span className="text-blue-600 dark:text-blue-400 underline">
              Terms &amp; Conditions
            </span>
          </span>
        </label>
        {errors.terms && (
          <p id="termsError" data-testid="error-terms" className="text-xs text-red-500 pl-7">
            {errors.terms}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          id="submitFormBtn"
          data-testid="submit-form-btn"
          type="submit"
          className="flex-1"
        >
          Submit
        </Button>
        <Button
          id="resetFormBtn"
          data-testid="reset-form-btn"
          type="button"
          variant="outline"
          className="flex-1"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const FormsPage = () => {
  const [activeTech, setActiveTech] = useState("selenium");

  const res = practiceResources[SLUG];
  const badgeClass =
    difficultyStyles[res.difficultyColor]?.badge ?? difficultyStyles.green.badge;

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
          Form Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Practice end-to-end form automation in Selenium &amp; Playwright —
          filling inputs, selecting dropdowns, toggling checkboxes, triggering
          validation errors, and asserting success states.
        </p>
      </div>

      {/* Main layout: Practice card + What You'll Learn */}
      <div className="flex md:flex-row flex-col items-start gap-5">

        {/* Practice Card */}
        <section
          aria-label="Form practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-5 px-5 text-sm">
              <RegistrationForm />
            </CardContent>
          </Card>
        </section>

        {/* What You'll Learn card */}
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
        </div>
      </div>

      {/* Test Cases */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Test Cases</h2>
        <Accordion type="multiple" className="space-y-2">
          {formsTC.map((tc) => (
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

export default FormsPage;
