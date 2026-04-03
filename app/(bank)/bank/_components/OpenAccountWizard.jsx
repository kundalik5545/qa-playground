"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { saveAccount } from "@/lib/bankStorage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  PiggyBank,
  CreditCard,
  Gem,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

const STEPS = ["Account Type", "Account Details", "Review & Confirm"];

const TYPE_OPTIONS = [
  {
    value: "savings",
    label: "Savings",
    description: "High-yield savings with interest",
    icon: PiggyBank,
  },
  {
    value: "checking",
    label: "Checking",
    description: "Day-to-day spending account",
    icon: CreditCard,
  },
  {
    value: "credit",
    label: "Credit",
    description: "Credit card with flexible limit",
    icon: Gem,
  },
];

export default function OpenAccountWizard({ open, onOpenChange, onAccountCreated }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    balance: "",
    status: "active",
    overdraft: false,
  });
  const [errors, setErrors] = useState({});

  const resetWizard = () => {
    setStep(1);
    setFormData({ type: "", name: "", balance: "", status: "active", overdraft: false });
    setErrors({});
  };

  const handleClose = (isOpen) => {
    if (!isOpen) resetWizard();
    onOpenChange(isOpen);
  };

  const validateStep1 = () => {
    if (!formData.type) return { type: "Please select an account type" };
    return {};
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Account name is required";
    if (!formData.balance || parseFloat(formData.balance) < 0)
      errs.balance = "Please enter a valid initial deposit";
    return errs;
  };

  const handleNext = () => {
    const errs = step === 1 ? validateStep1() : step === 2 ? validateStep2() : {};
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleConfirm = () => {
    saveAccount({
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      status: formData.status,
      overdraft: formData.overdraft,
    });
    toast.success("Account opened successfully!");
    onAccountCreated?.();
    handleClose(false);
  };

  const stepStatus = (n) => {
    if (n < step) return "complete";
    if (n === step) return "active";
    return "pending";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[560px]"
        id="open-account-wizard"
        data-testid="open-account-wizard"
        role="dialog"
        aria-labelledby="wizard-dialog-title"
        aria-modal="true"
      >
        <DialogHeader>
          <DialogTitle id="wizard-dialog-title">Open New Account</DialogTitle>
        </DialogHeader>

        {/* Step indicator bar */}
        <div
          className="flex items-center mt-2 mb-2"
          id="wizard-step-bar"
          data-testid="wizard-step-bar"
        >
          {STEPS.map((label, idx) => {
            const n = idx + 1;
            const status = stepStatus(n);
            return (
              <div key={n} className="flex items-center flex-1">
                <div
                  className="flex flex-col items-center"
                  data-step={n}
                  data-step-status={status}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                      status === "complete" && "bg-green-500 text-white",
                      status === "active" &&
                        "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
                      status === "pending" && "bg-muted text-muted-foreground"
                    )}
                  >
                    {status === "complete" ? <Check className="h-4 w-4" /> : n}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground hidden sm:block whitespace-nowrap">
                    {label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 mb-4",
                      step > n ? "bg-green-500" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <p
          className="text-sm text-muted-foreground text-center mb-4"
          data-testid="wizard-step-indicator"
          id="wizard-step-indicator"
        >
          Step {step} of {STEPS.length}
        </p>

        {/* Step 1: Account Type */}
        {step === 1 && (
          <div className="space-y-3" id="wizard-step-1-content">
            <p className="text-sm font-medium">
              Select the type of account you want to open:
            </p>
            <div className="grid grid-cols-1 gap-3">
              {TYPE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  data-testid={`type-card-${value}`}
                  data-selected={formData.type === value ? "true" : "false"}
                  onClick={() => setFormData({ ...formData, type: value })}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all w-full",
                    formData.type === value
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full shrink-0",
                      formData.type === value
                        ? "bg-purple-600 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  {formData.type === value && (
                    <Check className="h-5 w-5 text-purple-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
            {errors.type && (
              <p className="text-sm text-destructive" role="alert">
                {errors.type}
              </p>
            )}
          </div>
        )}

        {/* Step 2: Account Details */}
        {step === 2 && (
          <div className="space-y-4" id="wizard-step-2-content">
            <div className="space-y-2">
              <Label htmlFor="wizard-account-name">Account Name *</Label>
              <Input
                id="wizard-account-name"
                data-testid="wizard-account-name"
                placeholder="e.g., My Savings Account"
                value={formData.name}
                aria-invalid={errors.name ? "true" : undefined}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="wizard-initial-deposit">Initial Deposit *</Label>
              <Input
                id="wizard-initial-deposit"
                data-testid="wizard-initial-deposit"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.balance}
                aria-invalid={errors.balance ? "true" : undefined}
                onChange={(e) =>
                  setFormData({ ...formData, balance: e.target.value })
                }
              />
              {errors.balance && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.balance}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
                id="wizard-status-group"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="active"
                    id="wizard-status-active"
                    data-testid="wizard-status-active"
                  />
                  <Label
                    htmlFor="wizard-status-active"
                    className="font-normal cursor-pointer"
                  >
                    Active
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="inactive"
                    id="wizard-status-inactive"
                    data-testid="wizard-status-inactive"
                  />
                  <Label
                    htmlFor="wizard-status-inactive"
                    className="font-normal cursor-pointer"
                  >
                    Inactive
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="wizard-overdraft"
                data-testid="wizard-overdraft"
                checked={formData.overdraft}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, overdraft: checked })
                }
              />
              <Label
                htmlFor="wizard-overdraft"
                className="font-normal cursor-pointer"
              >
                Enable Overdraft Protection
              </Label>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-4" id="wizard-step-3-content">
            <p className="text-sm text-muted-foreground">
              Please review your account details before confirming.
            </p>
            <dl
              className="bg-muted rounded-lg p-4 space-y-3"
              id="wizard-review-summary"
              data-testid="wizard-review-summary"
            >
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Account Type</dt>
                <dd className="font-semibold capitalize">{formData.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Account Name</dt>
                <dd className="font-semibold">{formData.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Initial Deposit</dt>
                <dd className="font-semibold">
                  ${parseFloat(formData.balance || 0).toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="font-semibold capitalize">{formData.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">
                  Overdraft Protection
                </dt>
                <dd className="font-semibold">
                  {formData.overdraft ? "Enabled" : "Disabled"}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={step === 1 ? () => handleClose(false) : handleBack}
            id="wizard-back-btn"
            data-testid="wizard-back"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
              id="wizard-next-btn"
              data-testid="wizard-next"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleConfirm}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
              id="wizard-confirm-btn"
              data-testid="wizard-confirm"
            >
              <Check className="h-4 w-4 mr-1" /> Confirm &amp; Open Account
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}