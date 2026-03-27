"use client";

/**
 * TimeSlotPicker
 * ---------------
 * Shadcn-Select–based time range picker. Produces output like "06:00 PM – 06:30 PM".
 *
 * Props (all controlled — no internal state):
 *  fromHour    string  "1"–"12" or ""
 *  fromMin     string  "00","05","10",…,"55"
 *  fromPeriod  string  "AM" | "PM"
 *  toHour      string  "1"–"12" or ""
 *  toMin       string  "00","05","10",…,"55"
 *  toPeriod    string  "AM" | "PM"
 *  onChange    fn      ({ fromHour, fromMin, fromPeriod, toHour, toMin, toPeriod }) => void
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HOURS = ["1","2","3","4","5","6","7","8","9","10","11","12"];
const MINUTES = ["00","05","10","15","20","25","30","35","40","45","50","55"];
const PERIODS = ["AM","PM"];

/** One time-group (From or To): H : M AM/PM */
function TimeGroup({ hour, min, period, onHour, onMin, onPeriod, label }) {
  return (
    <div className="flex flex-col gap-[3px]">
      <span className="text-[0.67rem] text-gray-400 font-semibold uppercase tracking-[0.4px]">
        {label}
      </span>
      <div className="flex items-center gap-[3px]">
        {/* Hour */}
        <Select value={hour} onValueChange={onHour}>
          <SelectTrigger className="w-[50px] h-[30px] text-[0.78rem] px-2 py-0 rounded-[6px] border-[#e9eaed]">
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
        <Select value={min} onValueChange={onMin}>
          <SelectTrigger className="w-[50px] h-[30px] text-[0.78rem] px-2 py-0 rounded-[6px] border-[#e9eaed]">
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
        <Select value={period} onValueChange={onPeriod}>
          <SelectTrigger className="w-[56px] h-[30px] text-[0.78rem] px-2 py-0 rounded-[6px] border-[#e9eaed]">
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
      </div>
    </div>
  );
}

export default function TimeSlotPicker({
  fromHour, fromMin, fromPeriod,
  toHour, toMin, toPeriod,
  onChange,
}) {
  function patch(updates) {
    onChange({
      fromHour, fromMin, fromPeriod,
      toHour, toMin, toPeriod,
      ...updates,
    });
  }

  return (
    <div className="flex items-end gap-2 flex-wrap">
      <TimeGroup
        label="From"
        hour={fromHour}
        min={fromMin}
        period={fromPeriod}
        onHour={(v) => patch({ fromHour: v })}
        onMin={(v) => patch({ fromMin: v })}
        onPeriod={(v) => patch({ fromPeriod: v })}
      />
      <span className="text-gray-300 text-sm pb-[6px]">→</span>
      <TimeGroup
        label="To"
        hour={toHour}
        min={toMin}
        period={toPeriod}
        onHour={(v) => patch({ toHour: v })}
        onMin={(v) => patch({ toMin: v })}
        onPeriod={(v) => patch({ toPeriod: v })}
      />
    </div>
  );
}

/** Format the 6 parts into "06:30 PM – 07:00 AM" or "" */
export function formatTimeSlot({ fromHour, fromMin, fromPeriod, toHour, toMin, toPeriod }) {
  function fmt(h, m, p) {
    if (!h) return "";
    return `${String(Number(h)).padStart(2, "0")}:${m} ${p}`;
  }
  const from = fmt(fromHour, fromMin, fromPeriod);
  const to = fmt(toHour, toMin, toPeriod);
  if (from && to) return `${from} – ${to}`;
  return from || "";
}

/** Parse "06:30 PM – 07:00 PM" back into the 6-part object */
export function parseTimeSlot(s) {
  const defaults = {
    fromHour: "", fromMin: "00", fromPeriod: "AM",
    toHour: "",   toMin: "00",  toPeriod: "AM",
  };
  if (!s) return defaults;
  const halves = s.split(" – ");
  function parsePart(str) {
    if (!str) return { h: "", m: "00", p: "AM" };
    const match = str.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return { h: "", m: "00", p: "AM" };
    return { h: String(parseInt(match[1])), m: match[2], p: match[3].toUpperCase() };
  }
  const f = parsePart(halves[0]);
  const t = parsePart(halves[1]);
  return {
    fromHour: f.h, fromMin: f.m, fromPeriod: f.p,
    toHour:   t.h, toMin:   t.m, toPeriod:   t.p,
  };
}
