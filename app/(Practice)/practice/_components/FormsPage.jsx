"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { GraduationCap, CircleCheckBig } from "lucide-react";
import Link from "next/link";

const youtubeLink = "";

const FormsPage = () => {
  return (
    <div className="pt-2">
      <h2 className="text-4xl font-semibold pl-1 py-4">Forms</h2>
      <div className="flex flex-col sm:flex-row w-full gap-4">
        {/* Main Card Section */}
        <div className="w-full sm:w-2/3 pb-5 md:pb-0">
          <Card className="w-full shadow-lg rounded-xl dark:bg-gray-800">
            <CardContent className="space-y-6 pt-5 text-sm sm:text-base text-gray-900 dark:text-gray-200">
              <QAPlayGround />
            </CardContent>
          </Card>
        </div>

        {/* Insight Card */}
        <div className="w-full sm:w-1/3">
          <Card className="w-full shadow-lg rounded-xl dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between p-4 shadow-md dark:shadow-gray-800">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Insight
              </p>
              <GraduationCap className="text-gray-700 dark:text-teal-300" />
            </CardHeader>
            <CardContent className="p-4 text-center text-gray-800 dark:text-gray-300">
              <p className="font-light py-3 text-base">
                On completion of this exercise, you can learn the following
                concepts:
              </p>
              <LearningInsight />
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-200 dark:border-gray-700 p-4">
              <Link
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="underline text-blue-600 dark:text-teal-200 font-light hover:text-blue-800 dark:hover:text-teal-300">
                  Watch tutorial
                </span>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormsPage;

// ─── QA Playground Section ────────────────────────────────────────────────────

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

const QAPlayGround = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── handlers ──────────────────────────────────────────────────────────────

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

  // ── success state ──────────────────────────────────────────────────────────

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

  // ── form ───────────────────────────────────────────────────────────────────

  return (
    <form
      id="userRegistrationForm"
      data-testid="user-registration-form"
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {/* ── Personal Details ─────────────────────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold mb-3 border-b pb-1 dark:border-gray-600">
          Personal Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
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
              <p
                id="firstNameError"
                data-testid="error-first-name"
                className="text-xs text-red-500"
              >
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
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
              <p
                id="lastNameError"
                data-testid="error-last-name"
                className="text-xs text-red-500"
              >
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
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
              <p
                id="emailError"
                data-testid="error-email"
                className="text-xs text-red-500"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
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
              <p
                id="phoneError"
                data-testid="error-phone"
                className="text-xs text-red-500"
              >
                {errors.phone}
              </p>
            )}
          </div>

          {/* Date of Birth */}
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
              <p
                id="dobError"
                data-testid="error-dob"
                className="text-xs text-red-500"
              >
                {errors.dob}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <Label>
              Gender <span className="text-red-500">*</span>
            </Label>
            <div
              id="genderGroup"
              data-testid="gender-group"
              className="flex gap-5 pt-1"
            >
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
              <p
                id="genderError"
                data-testid="error-gender"
                className="text-xs text-red-500"
              >
                {errors.gender}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Address ──────────────────────────────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold mb-3 border-b pb-1 dark:border-gray-600">
          Address
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Country */}
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
              <p
                id="countryError"
                data-testid="error-country"
                className="text-xs text-red-500"
              >
                {errors.country}
              </p>
            )}
          </div>

          {/* City */}
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
              <p
                id="cityError"
                data-testid="error-city"
                className="text-xs text-red-500"
              >
                {errors.city}
              </p>
            )}
          </div>

          {/* Bio */}
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
              className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>
        </div>
      </section>

      {/* ── Interests ────────────────────────────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold mb-3 border-b pb-1 dark:border-gray-600">
          Interests
        </h3>
        <div
          id="interestsGroup"
          data-testid="interests-group"
          className="flex flex-wrap gap-4"
        >
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

      {/* ── Account Details ──────────────────────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold mb-3 border-b pb-1 dark:border-gray-600">
          Account Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password */}
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
              <p
                id="passwordError"
                data-testid="error-password"
                className="text-xs text-red-500"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
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
              <p
                id="confirmPasswordError"
                data-testid="error-confirm-password"
                className="text-xs text-red-500"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Terms ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="terms"
          className="flex items-center gap-3 cursor-pointer"
        >
          <Checkbox
            id="terms"
            data-testid="checkbox-terms"
            checked={form.terms}
            onCheckedChange={handleTermsToggle}
            className={errors.terms ? "border-red-500" : ""}
          />
          <span className="text-sm">
            I agree to the{" "}
            <span className="text-blue-600 dark:text-teal-300 underline">
              Terms &amp; Conditions
            </span>
          </span>
        </label>
        {errors.terms && (
          <p
            id="termsError"
            data-testid="error-terms"
            className="text-xs text-red-500 pl-7"
          >
            {errors.terms}
          </p>
        )}
      </div>

      {/* ── Action Buttons ───────────────────────────────────────────────── */}
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

// ─── Learning Insight Section ─────────────────────────────────────────────────

const LearningInsight = () => {
  return (
    <>
      <ol className="font-light list-decimal pl-6 text-left space-y-1">
        <li>sendKeys() — text inputs</li>
        <li>clear() — reset fields</li>
        <li>click() — radio &amp; checkbox</li>
        <li>Select — dropdowns</li>
        <li>isSelected() — verify state</li>
        <li>submit() / click submit</li>
        <li>isDisplayed() — errors</li>
        <li>getAttribute(&quot;value&quot;)</li>
        <li>Form validation flow</li>
        <li>Success state assertion</li>
      </ol>
    </>
  );
};
