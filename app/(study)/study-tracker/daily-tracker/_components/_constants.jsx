/**
 * Shared constants used across Daily Tracker components.
 * Import from here to avoid duplication.
 */

/** White checkmark SVG rendered inside completed checkboxes */
export const CHECK_SVG = (
  <svg viewBox="0 0 12 12" width={10} height={10}>
    <polyline
      points="1.5,6 5,9.5 10.5,2.5"
      stroke="white"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

/** Day-of-week abbreviations (index 0 = Sunday) */
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Inline style object that forces all shadcn CSS variables back to their
 * light-mode values so the Daily Tracker always renders in light mode,
 * regardless of the site-wide dark/light theme toggle.
 */
export const LIGHT_MODE_STYLE = {
  colorScheme: "light",
  "--background": "0 0% 100%",
  "--foreground": "222.2 47.4% 11.2%",
  "--card": "0 0% 100%",
  "--card-foreground": "222.2 47.4% 11.2%",
  "--muted": "210 40% 96.1%",
  "--muted-foreground": "215.4 16.3% 46.9%",
  "--border": "214.3 31.8% 91.4%",
  "--primary": "222.2 47.4% 11.2%",
  "--primary-foreground": "210 40% 98%",
  "--secondary": "210 40% 96.1%",
  "--secondary-foreground": "222.2 47.4% 11.2%",
};

/** Shared card wrapper class used in analytics/habit sections */
export const CARD_CLS = "bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px]";

/** Shared section title class used inside cards */
export const CARD_TITLE_CLS = "text-sm font-semibold text-[#374151] mb-[14px] mt-0";
