/**
 * Telegram Bot — Parsing Rules Config
 *
 * Edit this file to change message format rules without touching handler logic.
 * All triggers are matched case-insensitively.
 */

export const TELEGRAM_RULES = {
  // ── Todo ──────────────────────────────────────────────────────────────────
  todo: {
    trigger: "#todo",              // message must start with this (case-insensitive)
    timePrefix: "@",               // inline time marker e.g. @30min @1hr
    // Supported time unit suffixes → multiplier to convert to minutes
    timeUnits: {
      min: 1,
      mins: 1,
      m: 1,
      hr: 60,
      hrs: 60,
      h: 60,
      hour: 60,
      hours: 60,
    },
    maxTitleLen: 200,
    defaultTimeMin: 0,
  },

  // ── Resource ──────────────────────────────────────────────────────────────
  resource: {
    // Matches the first http/https URL in the message
    urlPattern: /https?:\/\/[^\s]+/,
    // Quoted description: "some text here"
    descriptionPattern: /"([^"]{1,500})"/,
    // Hashtags anywhere in the message
    tagPattern: /#(\w{1,30})/g,
    maxDescLen: 500,
    maxTags: 10,
    maxTagLen: 30,
    defaultResourceType: "OTHER",
    // Timeout for fetching URL metadata (ms)
    fetchTimeoutMs: 5000,
    // OG/meta tag priority order for title extraction
    titleMetaTags: ["og:title", "twitter:title"],
    descMetaTags: ["og:description", "twitter:description", "description"],
    imageMetaTags: ["og:image", "twitter:image"],
  },

  // ── Note ──────────────────────────────────────────────────────────────────
  note: {
    trigger: "#note",              // message must start with this (case-insensitive)
    // Trailing hashtags (at the end of message) are extracted as tags
    tagPattern: /#(\w{1,30})/g,
    // Auto-generated title: first N chars of content, cut at word boundary
    autoTitleMaxLen: 60,
    maxContentLen: 10000,
    maxTags: 10,
  },

  // ── Connect ───────────────────────────────────────────────────────────────
  connect: {
    command: "/connect",           // Telegram slash command
    tokenPrefix: "qatg_",
    tokenExpiryMinutes: 15,
  },

  // ── Help ──────────────────────────────────────────────────────────────────
  help: {
    command: "/help",
  },

  // ── Rate limiting ─────────────────────────────────────────────────────────
  rateLimit: {
    requests: 10,                  // max requests
    windowSeconds: 60,             // per this window
    redisPrefix: "rl:tg:",         // Redis key prefix (appended with chatId)
  },

  // ── Input sanitization ────────────────────────────────────────────────────
  sanitize: {
    // Tags stripped from all text fields
    htmlTagPattern: /<[^>]*>/g,
    // Max length for generic text if no specific limit defined
    defaultMaxLen: 1000,
  },
};
