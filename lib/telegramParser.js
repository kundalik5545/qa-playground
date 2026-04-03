/**
 * Telegram Bot — Message Parser & Sanitizer
 *
 * All parsing is driven by TELEGRAM_RULES — edit lib/telegramRules.js
 * to change triggers, limits, or patterns without touching this file.
 *
 * Server-side only.
 */

import { TELEGRAM_RULES } from "@/lib/telegramRules";

const { todo: TODO, resource: RESOURCE, note: NOTE, connect: CONNECT, help: HELP, sanitize: SANITIZE } = TELEGRAM_RULES;

// ── Type detection ────────────────────────────────────────────────────────────

/**
 * Detect what kind of message was sent.
 * @param {string} text
 * @returns {"todo"|"resource"|"note"|"connect"|"help"|"unknown"}
 */
export function detectMessageType(text) {
  if (!text || typeof text !== "string") return "unknown";
  const t = text.trim();
  const lower = t.toLowerCase();

  if (lower.startsWith(CONNECT.command + " ")) return "connect";
  if (lower === HELP.command || lower.startsWith(HELP.command + " ")) return "help";
  if (lower.startsWith(TODO.trigger.toLowerCase())) return "todo";
  if (lower.startsWith(NOTE.trigger.toLowerCase())) return "note";
  if (RESOURCE.urlPattern.test(t)) return "resource";

  return "unknown";
}

// ── Todo parser ───────────────────────────────────────────────────────────────

/**
 * Parse a #todo message.
 * @param {string} text  Full message text
 * @returns {{ title: string, timeMin: number } | null}  null if title is missing
 */
export function parseTodo(text) {
  // Strip the #todo trigger
  let body = text.trim().slice(TODO.trigger.length).trim();

  let timeMin = TODO.defaultTimeMin;

  // Extract @time e.g. @30min @1hr @2h
  const timeMatch = body.match(new RegExp(`${escapeRegex(TODO.timePrefix)}(\\d+)(\\w+)`, "i"));
  if (timeMatch) {
    const num = parseInt(timeMatch[1], 10);
    const unit = timeMatch[2].toLowerCase();
    const multiplier = TODO.timeUnits[unit] ?? 1;
    timeMin = num * multiplier;
    // Remove the @time part from the body
    body = body.replace(timeMatch[0], "").trim();
  }

  const title = sanitizeText(body, TODO.maxTitleLen);
  if (!title) return null;

  return { title, timeMin };
}

// ── Resource parser ───────────────────────────────────────────────────────────

/**
 * Parse a resource message (message containing a URL).
 * @param {string} text  Full message text
 * @returns {{ url: string, description: string|null, tags: string[] } | null}
 */
export function parseResource(text) {
  const urlMatch = text.match(RESOURCE.urlPattern);
  if (!urlMatch) return null;

  const url = sanitizeUrl(urlMatch[0]);
  if (!url) return null;

  // Extract quoted description
  const descMatch = text.match(RESOURCE.descriptionPattern);
  const description = descMatch
    ? sanitizeText(descMatch[1], RESOURCE.maxDescLen)
    : null;

  // Extract hashtags
  const tags = extractHashtags(text, RESOURCE.maxTags, RESOURCE.maxTagLen);

  return { url, description, tags };
}

// ── Note parser ───────────────────────────────────────────────────────────────

/**
 * Parse a #note message.
 * @param {string} text  Full message text
 * @returns {{ title: string, content: string, trigger: string, tags: string[] } | null}
 */
export function parseNote(text) {
  // Strip #note trigger
  let body = text.trim().slice(NOTE.trigger.length).trim();

  // Extract all hashtags
  const tags = extractHashtags(body, NOTE.maxTags, NOTE.maxTagLen);

  // Remove hashtags from content (replace each #tag with empty string)
  let content = body.replace(NOTE.tagPattern, "").trim();
  // Collapse multiple spaces/newlines left by tag removal
  content = content.replace(/[ \t]{2,}/g, " ").trim();

  content = sanitizeText(content, NOTE.maxContentLen);
  if (!content) return null;

  // Auto-generate title from first N chars, cut at word boundary
  const title = autoTitle(content, NOTE.autoTitleMaxLen);

  // First tag becomes the trigger (category), fallback to "general"
  const trigger = tags.length > 0 ? tags[0] : "general";

  return { title, content, trigger, tags };
}

// ── Connect parser ────────────────────────────────────────────────────────────

/**
 * Parse a /connect message and extract the token.
 * @param {string} text
 * @returns {{ token: string } | null}
 */
export function parseConnect(text) {
  const parts = text.trim().split(/\s+/);
  // parts[0] = "/connect", parts[1] = token
  const token = parts[1]?.trim();
  if (!token || !token.startsWith(CONNECT.tokenPrefix)) return null;
  return { token };
}

// ── URL metadata fetcher ──────────────────────────────────────────────────────

/**
 * Fetch a URL and extract title, description, and image from OG/meta tags.
 * Server-side only — no CORS issues.
 * @param {string} url
 * @returns {Promise<{ title: string|null, description: string|null, image: string|null }>}
 */
export async function fetchUrlMetadata(url) {
  const result = { title: null, description: null, image: null };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), RESOURCE.fetchTimeoutMs);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "QAPlaygroundBot/1.0" },
    });
    clearTimeout(timeout);

    if (!res.ok) return result;

    const html = await res.text();

    result.title = extractMeta(html, RESOURCE.titleMetaTags) || extractTitle(html);
    result.description = extractMeta(html, RESOURCE.descMetaTags);
    result.image = extractMeta(html, RESOURCE.imageMetaTags);

    // Truncate to reasonable lengths
    if (result.title) result.title = result.title.slice(0, 200).trim();
    if (result.description) result.description = result.description.slice(0, 500).trim();
  } catch (_) {
    // Silently fail — caller handles null values
  }

  return result;
}

// ── Sanitization helpers ──────────────────────────────────────────────────────

/**
 * Strip HTML tags, trim whitespace, enforce max length.
 * @param {string} str
 * @param {number} [maxLen]
 * @returns {string}
 */
export function sanitizeText(str, maxLen = SANITIZE.defaultMaxLen) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(SANITIZE.htmlTagPattern, "")
    .trim()
    .slice(0, maxLen);
}

/**
 * Validate a URL — must be http or https.
 * @param {string} str
 * @returns {string|null}  The URL string, or null if invalid
 */
export function sanitizeUrl(str) {
  if (!str || typeof str !== "string") return null;
  try {
    const url = new URL(str.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch (_) {
    return null;
  }
}

/**
 * Extract #hashtags from text, stripping # prefix and filtering by rules.
 * Does NOT include the word "note" or "todo" themselves as tags.
 * @param {string} text
 * @param {number} [maxTags]
 * @param {number} [maxTagLen]
 * @returns {string[]}
 */
export function extractHashtags(text, maxTags = 10, maxTagLen = 30) {
  const reserved = new Set(["note", "todo"]);
  const matches = [];
  const pattern = new RegExp(RESOURCE.tagPattern.source, "gi");
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const tag = match[1].toLowerCase().slice(0, maxTagLen);
    if (!reserved.has(tag) && !matches.includes(tag)) {
      matches.push(tag);
    }
    if (matches.length >= maxTags) break;
  }
  return matches;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function autoTitle(content, maxLen) {
  if (content.length <= maxLen) return content;
  const cut = content.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractMeta(html, names) {
  for (const name of names) {
    // Match <meta property="og:title" content="..."> or <meta name="description" content="...">
    const pattern = new RegExp(
      `<meta[^>]+(?:property|name)=["']${escapeRegex(name)}["'][^>]+content=["']([^"']+)["']`,
      "i"
    );
    const alt = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapeRegex(name)}["']`,
      "i"
    );
    const m = html.match(pattern) || html.match(alt);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1]?.trim() || null;
}
