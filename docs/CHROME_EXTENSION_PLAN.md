# QA Playground — Resource Saver Chrome Extension Plan

> Design and implementation plan for a "Save to QA Playground" Chrome extension.
> Similar to Save to Notion / Pocket. Uses API Key as auth. Posts to existing `/api/resources` endpoint.

---

## 1. Overview

**What it does:** One-click resource saving from any browser tab to the user's QA Playground Study Tracker. The extension auto-extracts page metadata, lets the user review/edit fields, then POSTs to the existing API.

**Auth mechanism:** API Key (`qapg_...`) generated on QA Playground → stored in `chrome.storage.local` → sent as `Authorization: Bearer <key>` on every request.

**Target API:** `https://www.qaplayground.com/api/resources` (POST — already supports Bearer token auth)

**No new backend needed.** The existing `resolveUserId()` in `app/api/resources/route.js` already handles API key auth for POST.

---

## 2. Resource Model Mapping

Fields the extension must capture or let the user fill:

| Field | Source | Required |
|---|---|---|
| `url` | `chrome.tabs` API — current tab URL | Yes (auto) |
| `title` | `document.title` or `og:title` meta tag | Yes (auto, editable) |
| `resourceType` | Auto-detect from URL + user select | Yes (editable) |
| `description` | `meta[name=description]` or `og:description` | No (auto, editable) |
| `image` | `og:image` meta tag | No (auto, editable) |
| `tags` | User input — tag pills | No (user fills) |

**ResourceType enum options:** `ARTICLE`, `VIDEO`, `COURSE`, `BOOK`, `TOOL`, `DOCUMENTATION`, `OTHER`

**Auto-detection rules for resourceType:**
- URL contains `youtube.com` or `vimeo.com` → `VIDEO`
- URL contains `github.com` → `TOOL`
- URL contains `docs.`, `/docs/`, `/documentation` → `DOCUMENTATION`
- URL contains `udemy.com`, `coursera.org`, `pluralsight.com`, `egghead.io` → `COURSE`
- Default → `ARTICLE`

---

## 3. Extension Architecture

```
chrome-extension/
├── manifest.json              Manifest V3
├── popup/
│   ├── popup.html             Main popup (save resource form)
│   ├── popup.js               Popup logic — tab query, form, API call
│   └── popup.css              Popup styles
├── settings/
│   ├── settings.html          Settings page — username + API key entry
│   ├── settings.js            Settings logic — save/load from chrome.storage
│   └── settings.css           Settings styles (shared tokens)
├── content/
│   └── content.js             Content script — extracts page metadata
├── background/
│   └── background.js          Service worker — handles messaging
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── shared/
    ├── tokens.css             CSS custom properties (colors, spacing, radius)
    └── utils.js               Shared helpers (resourceType detector, tag parser)
```

---

## 4. UI Design System

### Color Palette

Matches QA Playground's slate-based shadcn/ui theme exactly.

```css
/* shared/tokens.css */
:root {
  /* Background layers */
  --bg-base:       #ffffff;
  --bg-surface:    #f8fafc;   /* slate-50 */
  --bg-elevated:   #f1f5f9;   /* slate-100 */

  /* Text */
  --text-primary:  #0f172a;   /* slate-900 */
  --text-muted:    #64748b;   /* slate-500 */
  --text-subtle:   #94a3b8;   /* slate-400 */

  /* Brand / primary action */
  --primary:       #3b82f6;   /* blue-500 — matches site gradient start */
  --primary-hover: #2563eb;   /* blue-600 */
  --primary-fg:    #ffffff;

  /* Destructive */
  --destructive:   #ef4444;   /* red-500 */

  /* Border */
  --border:        #e2e8f0;   /* slate-200 */
  --border-focus:  #3b82f6;   /* blue-500 */

  /* Success */
  --success:       #22c55e;   /* green-500 */

  /* Radius — matches site's 0.5rem */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;

  /* Popup dimensions */
  --popup-width:   360px;
  --popup-padding: 16px;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-base:      #0f172a;   /* slate-900 */
    --bg-surface:   #1e293b;   /* slate-800 */
    --bg-elevated:  #334155;   /* slate-700 */
    --text-primary: #f8fafc;   /* slate-50 */
    --text-muted:   #94a3b8;   /* slate-400 */
    --text-subtle:  #64748b;   /* slate-500 */
    --border:       #334155;   /* slate-700 */
  }
}
```

### Typography

- **Font:** Inter (loaded via `@import` from Google Fonts in CSS, or bundled)
- **Base size:** 13px (compact popup context)
- **Scale:** 11px (label/hint), 13px (body/input), 15px (heading)

### Component Styles

```
Inputs:      border-radius: var(--radius-md); border: 1px solid var(--border);
             padding: 8px 10px; font-size: 13px; width: 100%;
             focus → border-color: var(--border-focus); outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,0.15)

Buttons:     Primary → bg: var(--primary); color: var(--primary-fg); border-radius: var(--radius-md); padding: 8px 16px
             Ghost   → bg: transparent; border: 1px solid var(--border); color: var(--text-primary)

Tags/pills:  bg: var(--bg-elevated); border-radius: 999px; padding: 3px 10px; font-size: 11px
             "x" button on each pill to remove

Select:      Same as input styling; custom arrow via CSS

Divider:     1px solid var(--border); margin: 12px 0
```

---

## 5. Screen Designs

### Screen 1 — Save Resource Popup (`popup/popup.html`)

**Triggered:** User clicks the extension icon on any tab.

**Behavior on open:**
1. Query `chrome.tabs.query({ active: true, currentWindow: true })` → get current tab URL
2. Send message to content script → get `{ title, description, image, ogTitle, ogDescription, ogImage }`
3. Pre-fill form fields
4. If no API key stored → show inline prompt to go to Settings

**Layout (360px wide, auto height):**

```
┌─────────────────────────────────────────┐
│  [QP logo 20px]  Save Resource    [⚙ Settings icon] │
├─────────────────────────────────────────┤
│  [favicon 14px] qaplayground.com        │  ← extracted hostname, muted text
│                                         │
│  Title *                                │
│  ┌───────────────────────────────────┐  │
│  │ Introduction to Playwright Testing│  │
│  └───────────────────────────────────┘  │
│                                         │
│  Type *                                 │
│  ┌───────────────────────────────────┐  │
│  │ ARTICLE                        ▼  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Description                            │
│  ┌───────────────────────────────────┐  │
│  │ A beginner's guide to...          │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │  ← 3 rows textarea
│                                         │
│  Tags  (press Enter or comma to add)    │
│  ┌───────────────────────────────────┐  │
│  │ [playwright x] [testing x]  + ... │  │  ← tag pills inside input area
│  └───────────────────────────────────┘  │
│                                         │
│  Image URL  (optional)                  │
│  ┌───────────────────────────────────┐  │
│  │ https://...                       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─────────────────┐  ┌─────────────┐  │
│  │    Cancel       │  │  Save       │  │  ← Ghost | Primary
│  └─────────────────┘  └─────────────┘  │
│                                         │
│  [spinner or success state replaces buttons on submit] │
└─────────────────────────────────────────┘
```

**States:**
- **Loading:** Skeleton shimmer on title + description fields while content script responds
- **Submitting:** Save button shows spinner + "Saving..." text, disabled
- **Success:** Button area replaced with green checkmark + "Saved!" message for 1.5s, then popup closes
- **Error (401):** Red inline banner: "Invalid API key. Go to Settings to update it."
- **Error (network):** Red inline banner: "Could not connect. Check your connection."
- **No API key:** Yellow banner at top: "No API key set. [Open Settings]" — form is disabled

### Screen 2 — Settings Page (`settings/settings.html`)

**Triggered:** Gear icon in popup header → `chrome.runtime.openOptionsPage()` or `chrome.tabs.create({ url: 'settings/settings.html' })`

**Layout (full options page, centered card 480px wide):**

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [QP Logo]  QA Playground Extension Settings     │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  CONNECTION                                      │  ← section label, muted, uppercase 10px
│                                                  │
│  Your Name                                       │
│  ┌────────────────────────────────────────────┐  │
│  │ John Doe                                   │  │
│  └────────────────────────────────────────────┘  │
│  Displayed only locally to identify your setup   │  ← hint text, muted
│                                                  │
│  API Key *                                       │
│  ┌────────────────────────────────────────────┐  │
│  │ qapg_••••••••••••••••••••  [Show/Hide]     │  │  ← masked by default
│  └────────────────────────────────────────────┘  │
│  Generate your API key at qaplayground.com/       │
│  study-tracker → Settings → API Keys             │  ← hint with link
│                                                  │
│  API Base URL                                    │
│  ┌────────────────────────────────────────────┐  │
│  │ https://www.qaplayground.com               │  │  ← editable for local dev
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────┐  ┌─────────────────────────┐  │
│  │  Test Connection  │  │  Save Settings          │  │
│  └──────────────┘  └─────────────────────────┘  │
│                                                  │
│  [connection status badge — green/red]           │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  ABOUT                                           │
│  Version 1.0.0  ·  QA Playground Extension       │
│  Report an issue on GitHub                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

**"Test Connection" behavior:**
- POST to `{baseUrl}/api/resources` with a dry-run flag (or GET `/api/auth/get-session` won't work with API key)
- Actually: make a real POST with a dummy payload and immediately DELETE it, OR add a `GET /api/api-keys/verify` endpoint (recommended — see Section 8)
- Show "Connected as [name from API response]" in green, or "Invalid key" in red

**Storage schema (`chrome.storage.local`):**
```json
{
  "qapg_settings": {
    "userName": "John Doe",
    "apiKey": "qapg_abc123...",
    "baseUrl": "https://www.qaplayground.com"
  }
}
```

---

## 6. Content Script (`content/content.js`)

Injected into every page (or on-demand via `scripting.executeScript`). Extracts metadata and responds to messages from the popup.

```
Extracted fields:
  title         → document.title  (fallback: og:title)
  ogTitle       → meta[property="og:title"] content
  description   → meta[name="description"] content
  ogDescription → meta[property="og:description"] content
  image         → meta[property="og:image"] content
  favicon       → link[rel="icon"] href  (for display only in popup)
  hostname      → window.location.hostname
  url           → window.location.href
```

**Priority resolution (popup.js applies this):**
```
title       = ogTitle || document.title || url
description = ogDescription || metaDescription || ""
image       = ogImage || ""
```

**Auto resourceType detection (shared/utils.js):**
```js
function detectResourceType(url) {
  if (/youtube\.com|youtu\.be|vimeo\.com/.test(url)) return "VIDEO";
  if (/github\.com/.test(url))                        return "TOOL";
  if (/\/docs\/|docs\.|\/documentation|\/api-reference/.test(url)) return "DOCUMENTATION";
  if (/udemy\.com|coursera\.org|pluralsight\.com|egghead\.io|frontendmasters\.com/.test(url)) return "COURSE";
  return "ARTICLE";
}
```

---

## 7. Manifest V3 (`manifest.json`)

```json
{
  "manifest_version": 3,
  "name": "Save to QA Playground",
  "version": "1.0.0",
  "description": "Save any webpage as a learning resource to your QA Playground Study Tracker.",
  "icons": {
    "16":  "icons/icon16.png",
    "32":  "icons/icon32.png",
    "48":  "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon":  "icons/icon32.png",
    "default_title": "Save to QA Playground"
  },
  "options_ui": {
    "page":       "settings/settings.html",
    "open_in_tab": true
  },
  "background": {
    "service_worker": "background/background.js"
  },
  "content_scripts": [
    {
      "matches":       ["<all_urls>"],
      "js":            ["content/content.js"],
      "run_at":        "document_idle"
    }
  ],
  "permissions": [
    "activeTab",
    "storage",
    "scripting"
  ],
  "host_permissions": [
    "https://www.qaplayground.com/*",
    "<all_urls>"
  ]
}
```

---

## 8. API Integration

### Saving a Resource

```
POST {baseUrl}/api/resources
Authorization: Bearer qapg_abc123...
Content-Type: application/json

{
  "resourceType": "ARTICLE",
  "title": "Introduction to Playwright",
  "url": "https://playwright.dev/docs/intro",
  "description": "Getting started with Playwright for browser automation.",
  "tags": ["playwright", "automation", "testing"],
  "image": "https://playwright.dev/img/playwright-logo.svg"
}

→ 201 { id, userId, resourceType, title, url, ... }
→ 401 { error: "Unauthorized" }          ← invalid/missing API key
→ 400 { error: "...required" }           ← missing required fields
```

### Recommended: Add a Verify Endpoint (optional but useful for "Test Connection")

Add `GET /api/api-keys/verify` to the QA Playground backend:

```js
// app/api/api-keys/verify/route.js
export async function GET(request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = authHeader.slice(7).trim();
  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!apiKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }
  return NextResponse.json({ valid: true, userName: apiKey.user.name });
}
```

This lets the Settings page do a clean connection test without side effects.

---

## 9. Settings Integration on QA Playground Website

The user needs a place to generate their API key. This already exists at `/admin/dashboard` but should also be accessible from the Study Tracker or a dedicated extension settings page.

### Recommended: Add "Extension" tab or card to Study Tracker

Location: `app/(study)/study-tracker/_components/` — new view or section.

**UI mockup:**

```
┌────────────────────────────────────────────────────┐
│  Chrome Extension                                  │
├────────────────────────────────────────────────────┤
│                                                    │
│  Install the "Save to QA Playground" extension     │
│  to save resources from any webpage in one click.  │
│                                                    │
│  [Install from Chrome Web Store]  ← link button   │
│                                                    │
│  ── Your API Keys ──────────────────────────────── │
│                                                    │
│  Key Name           Created        Key             │
│  ─────────────────────────────────────────────── │
│  Chrome Extension   Mar 24, 2026   qapg_••••  [Copy] [Delete] │
│                                                    │
│  [+ Generate New API Key]                          │
│                                                    │
│  How to use:                                       │
│  1. Install the extension                          │
│  2. Open extension → Settings (gear icon)          │
│  3. Paste your API key above                       │
│  4. Click any page → Save to QA Playground         │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 10. Extension Folder Location

The Chrome extension is a **separate project** — do not put it inside the Next.js app.

**Recommended repo structure:**

```
Option A — Separate repo:
  github.com/kundalik5545/qa-playground-extension/

Option B — Monorepo subfolder (outside Next.js app):
  qa-playground/          ← existing Next.js app
  qa-playground-ext/      ← Chrome extension (sibling folder)
    manifest.json
    popup/
    settings/
    content/
    background/
    icons/
    shared/
```

---

## 11. Development Workflow

### Setup

```bash
# No build step needed for v1 — plain HTML/CSS/JS
# Just load unpacked in Chrome:
# chrome://extensions → Developer mode ON → Load unpacked → select qa-playground-ext/
```

### Testing locally

1. Set `baseUrl` in Settings to `http://localhost:3000`
2. Generate API key while logged in locally
3. Paste key in extension Settings
4. Click extension on any tab → save → verify in Study Tracker resources

### Icons

Generate icons from the QA Playground logo at 16×16, 32×32, 48×48, 128×128 PNG.
Use ImageKit CDN already in use for the main site (`ik.imagekit.io`).

---

## 12. Build Plan (Phases)

### Phase 1 — Core (MVP)

- [ ] `manifest.json` with correct permissions
- [ ] Content script metadata extraction
- [ ] Popup form with all Resource fields
- [ ] Settings page — API key + username + baseUrl storage
- [ ] POST to `/api/resources` with Bearer token
- [ ] Success/error states in popup
- [ ] Icons (placeholder or real)

### Phase 2 — Polish

- [ ] Dark mode support (CSS `prefers-color-scheme`)
- [ ] "Test Connection" button in Settings using verify endpoint
- [ ] Tag autocomplete from previously saved tags (store locally)
- [ ] Keyboard shortcut to open popup (`Alt+Shift+S`)
- [ ] Favicon display in popup header
- [ ] Add verify endpoint to QA Playground backend

### Phase 3 — Enhancements

- [ ] Recent saves list in popup (last 5, fetched from API)
- [ ] Duplicate detection — check if URL already saved before submitting
- [ ] Badge count on extension icon (resources saved today)
- [ ] Context menu integration — right-click any link → "Save link to QA Playground"
- [ ] Chrome Web Store submission

---

## 13. Security Notes

- API key stored in `chrome.storage.local` — not accessible by page scripts (safer than `localStorage`)
- Never log the API key to console
- `baseUrl` should be validated to prevent SSRF-like misuse (only allow `http://localhost:*` or `https://www.qaplayground.com`)
- The API key has full write access to the user's resources — treat it like a password

---

## 14. File-by-File Summary

| File | Purpose |
|---|---|
| `manifest.json` | Extension config, permissions, entry points |
| `popup/popup.html` | Save form UI |
| `popup/popup.js` | Tab query, content script messaging, form submit, API call |
| `popup/popup.css` | Popup styles (imports tokens.css) |
| `settings/settings.html` | API key + username form |
| `settings/settings.js` | Read/write chrome.storage, test connection |
| `settings/settings.css` | Settings page styles |
| `content/content.js` | Extract og:title, description, og:image from active tab |
| `background/background.js` | Service worker — context menu registration (Phase 3) |
| `shared/tokens.css` | CSS custom properties — colors, radius, spacing |
| `shared/utils.js` | `detectResourceType()`, tag parsing, storage helpers |
| `icons/` | PNG icons at 4 sizes |
