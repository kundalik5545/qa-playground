"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

function formatDisplayDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DatePickerInput({
  id,
  "data-testid": dataTestId,
  "aria-label": ariaLabel,
  value, // Date | null
  onChange, // (date: Date | null) => void
  placeholder = "Pick a date",
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date) => {
    onChange(date ?? null);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          data-testid={dataTestId}
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          {value && (
            <X
              className="ml-2 h-3 w-3 shrink-0 opacity-50 hover:opacity-100"
              onClick={handleClear}
              aria-label="Clear date"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        data-testid="date-picker-calendar"
      >
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
