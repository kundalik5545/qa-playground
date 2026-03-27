"use client";

/**
 * TimeSlotPicker
 * ---------------
 * Shows only the "From" selectors (Hour / Minute / AM-PM via shadcn Select).
 * The "To" time is auto-computed from From + durationMin and displayed read-only.
 *
 * Props:
 *  fromHour    string   "1"–"12" or ""
 *  fromMin     string   "00","05",…,"55"
 *  fromPeriod  string   "AM" | "PM"
 *  computedTo  string   Auto-computed display string e.g. "06:30 PM" (pass "" when not ready)
 *  onChange    fn       ({ fromHour, fromMin, fromPeriod }) => void
 *  disabled    boolean  Disables all selectors (shown when Time (min) not filled)
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HOURS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const MINUTES = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];
const PERIODS = ["AM", "PM"];

export default function TimeSlotPicker({
  fromHour,
  fromMin,
  fromPeriod,
  computedTo,
  onChange,
  disabled = false,
}) {
  function patch(updates) {
    onChange({ fromHour, fromMin, fromPeriod, ...updates });
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* "From" inline label */}
      {/* <span className="text-[0.72rem] font-semibold text-gray-500 uppercase tracking-[0.4px] shrink-0">
        From
      </span> */}

      {/* Hour */}
      <Select
        value={fromHour}
        onValueChange={(v) => patch({ fromHour: v })}
        disabled={disabled}
      >
        <SelectTrigger className="w-[52px] h-[30px] text-[0.78rem] px-2 py-0 rounded-[6px] border-[#e9eaed]">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((h) => (
            <SelectItem key={h} value={h} className="text-[0.78rem] py-[5px]">
              {h.padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-gray-400 text-sm font-bold leading-none">:</span>

      {/* Minute */}
      <Select
        value={fromMin}
        onValueChange={(v) => patch({ fromMin: v })}
        disabled={disabled}
      >
        <SelectTrigger className="w-[52px] h-[30px] text-[0.78rem] px-2 py-0 rounded-[6px] border-[#e9eaed]">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m} className="text-[0.78rem] py-[5px]">
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* AM / PM */}
      <Select
        value={fromPeriod}
        onValueChange={(v) => patch({ fromPeriod: v })}
        disabled={disabled}
      >
        <SelectTrigger className="w-[58px] h-[30px] text-[0.78rem] px-2 py-0 rounded-[6px] border-[#e9eaed]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((p) => (
            <SelectItem key={p} value={p} className="text-[0.78rem] py-[5px]">
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Auto-computed "To" — read-only */}
      {computedTo ? (
        <>
          <span className="text-gray-300 text-sm leading-none">→</span>
          <div className="h-[30px] px-3 flex items-center bg-purple-50 border border-purple-100 rounded-[6px] text-[0.78rem] font-semibold text-purple-700 whitespace-nowrap">
            {computedTo}
          </div>
        </>
      ) : fromHour && !disabled ? (
        <span className="text-[0.7rem] text-amber-500">
          Fill Time (min) to see end time
        </span>
      ) : null}
    </div>
  );
}

/**
 * Compute the "To" time from start + durationMin.
 * Returns { hour, min, period, str } or null if inputs are missing.
 */
export function computeToTime(fromHour, fromMin, fromPeriod, durationMin) {
  if (!fromHour || !durationMin || Number(durationMin) <= 0) return null;
  let h = Number(fromHour);
  const m = Number(fromMin || "0");
  if (fromPeriod === "PM" && h !== 12) h += 12;
  if (fromPeriod === "AM" && h === 12) h = 0;
  const totalMin = h * 60 + m + Number(durationMin);
  const toH = Math.floor(totalMin / 60) % 24;
  const toM = totalMin % 60;
  const toPeriod = toH >= 12 ? "PM" : "AM";
  const toHour12 = toH % 12 || 12;
  const str = `${String(toHour12).padStart(2, "0")}:${String(toM).padStart(2, "0")} ${toPeriod}`;
  return {
    hour: String(toHour12),
    min: String(toM).padStart(2, "0"),
    period: toPeriod,
    str,
  };
}

/**
 * Build the full "HH:MM AM – HH:MM PM" string from From parts + duration.
 * Returns "" if fromHour is not set.
 */
export function buildTimeSlot(fromHour, fromMin, fromPeriod, durationMin) {
  if (!fromHour) return "";
  const fromStr = `${String(Number(fromHour)).padStart(2, "0")}:${fromMin || "00"} ${fromPeriod}`;
  const to = computeToTime(fromHour, fromMin, fromPeriod, durationMin);
  return to ? `${fromStr} – ${to.str}` : fromStr;
}

/**
 * Parse "06:30 PM – 07:00 PM" → { fromHour, fromMin, fromPeriod }.
 * Only the "From" part is stored; "To" is always re-derived from From + timeMin.
 */
export function parseTimeSlot(s) {
  if (!s) return { fromHour: "", fromMin: "00", fromPeriod: "AM" };
  const first = s.split(" – ")[0] || "";
  const match = first.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return { fromHour: "", fromMin: "00", fromPeriod: "AM" };
  return {
    fromHour: String(parseInt(match[1])),
    fromMin: match[2],
    fromPeriod: match[3].toUpperCase(),
  };
}
