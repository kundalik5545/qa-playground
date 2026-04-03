# Plan: Telegram Bot Webhook Integration

## Context
Add a Telegram bot webhook to qaplayground.com so the user can send structured messages from Telegram and have them automatically saved to their account's database (Todos, Resources, Notes). A connect-token flow links the user's Telegram chatId to their platform User record. The webhook validates identity, rate-limits, sanitizes input, saves to PostgreSQL via Prisma, and replies to the user on Telegram.

---

## Scope Summary

| What | Where | Status |
|---|---|---|
| New Prisma models | `TelegramUser`, `Note` — `prisma/schema.prisma` | ✅ Done |
| Reused Prisma models | `DailyTask` (Todos), `Resource` (Resources) | ✅ Exists |
| Parsing rules config | `lib/telegramRules.js` | ✅ Done |
| Parser & sanitizer | `lib/telegramParser.js` | ✅ Done |
| Bot send helper | `lib/telegramBot.js` | ✅ Done |
| Connect-token API | `app/api/telegram/connect-token/route.js` | ✅ Done |
| Telegram Bot UI panel | `resources/_components/TelegramBotPanel.jsx` | ✅ Done |
| Webhook endpoint | `app/api/telegram/webhook/route.js` | ✅ Done |
| Rate limiting | Reuse Upstash pattern from `proxy.js` | ✅ Built into webhook |

---

## Phase 1 — Prisma Schema ✅ DONE

Migration `20260403032502_add_telegram_note_models` applied.

Changes made:
- Added `TelegramUser` model (chatId ↔ userId link, hashed connect token)
- Added `Note` model (trigger, title, content, source, tags index)
- Added `source String @default("web")` to `Resource` and `DailyTask`
- Added `telegramUser` and `notes` relations to `User`

---

## Phase 2 — Message Format

Parsing rules are stored in `lib/telegramRules.js` so they can be changed without touching handler logic.

### Todo
```
#todo Learn GitHub
#todo Learn GitHub @30min
#todo Review PR @1hr
```
- Starts with `#todo` (case-insensitive)
- Everything after `#todo` up to `@` is the title
- `@<value>` is optional time: supports `30min`, `1hr`, `1h`, `45m`, `2hours`
- Time defaults to 0 if omitted
- Date always defaults to today

### Resource
```
https://javascript.info/promises
https://example.com/guide #js #tutorial
https://example.com/guide "My custom description" #js
```
- Message contains a URL (starts with `http://` or `https://`)
- Bot auto-fetches URL and extracts title + OG description + OG image from HTML meta tags
- Description in `"double quotes"` overrides the auto-extracted one (optional)
- `#hashtags` anywhere in the message become tags (optional)
- User can edit full details on qaplayground.com after saving

### Note
```
#note Content goes here
#note Copied text or thoughts... #selenium #tips
```
- Starts with `#note` (case-insensitive)
- Everything after `#note` up to the first trailing `#hashtag` is the content
- `#hashtags` at the end become tags; first tag becomes the `trigger` field
- Both content and tags can span multiple lines
- Title is auto-generated: first 60 chars of content (truncated at word boundary)

### Connect (one-time registration)
```
/connect qatg_abc123xyz
```
- Uses Telegram slash command syntax for discoverability
- Links Telegram chatId to platform account

### Help
```
/help
```

---

## Phase 3 — New Env Vars

```
TELEGRAM_BOT_TOKEN=<from BotFather>
TELEGRAM_WEBHOOK_SECRET=<random 32-char string>
```

Existing: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `DATABASE_URL`

### Register webhook with Telegram
```
https://api.telegram.org/bot<TOKEN>/setWebhook
  ?url=https://www.qaplayground.com/api/telegram/webhook
  &secret_token=<TELEGRAM_WEBHOOK_SECRET>
```

---

## Phase 4 — Parsing Rules Config (`lib/telegramRules.js`)

A single exported object `TELEGRAM_RULES` containing all parsing constants. Edit this file to change behavior without touching handler logic.

```js
export const TELEGRAM_RULES = {
  todo: {
    trigger: "#todo",            // trigger prefix (case-insensitive)
    timePrefix: "@",             // time marker
    timeUnits: { ... },          // maps "min","m","hr","h","hour","hours" → multiplier
    maxTitleLen: 200,
    defaultTimeMin: 0,
  },
  resource: {
    descriptionPattern: /"([^"]+)"/,   // extract "quoted description"
    tagPattern: /#(\w+)/g,             // extract #hashtags
    maxDescLen: 500,
    maxTags: 10,
    maxTagLen: 30,
    defaultResourceType: "OTHER",
    fetchTimeoutMs: 5000,              // URL metadata fetch timeout
  },
  note: {
    trigger: "#note",
    tagPattern: /#(\w+)/g,
    autoTitleMaxLen: 60,               // chars for auto-generated title
    maxContentLen: 10000,
    maxTags: 10,
  },
  connect: {
    command: "/connect",
    tokenPrefix: "qatg_",
    tokenExpiryMinutes: 15,
  },
  rateLimit: {
    requests: 10,
    windowSeconds: 60,
    redisPrefix: "rl:tg:",
  },
}
```

---

## Phase 5 — Helper Files

### `lib/telegramBot.js`
```
sendTelegramMessage(chatId, text)  → calls Telegram sendMessage API
```
Fails silently. Supports Markdown parse mode for bold/italic in replies.

### `lib/telegramParser.js`
Uses `TELEGRAM_RULES` from `lib/telegramRules.js` for all constants.

```
detectMessageType(text)     → "todo" | "resource" | "note" | "connect" | "help" | "unknown"
parseTodo(text)             → { title, timeMin }
parseResource(text)         → { url, description, tags }
parseNote(text)             → { title, content, tags, trigger }
parseConnect(text)          → { token }
sanitizeText(str, maxLen)   → strip HTML, trim
sanitizeUrl(str)            → validate http/https, return null if invalid
fetchUrlMetadata(url)       → { title, description, image } from OG/meta tags
extractHashtags(text)       → string[]
parseTime(str)              → minutes as integer
```

---

## Registration Flow (How Users Link Their Account)

**Step 1** — User logs in to qaplayground.com → goes to **Resources** page → clicks **"Telegram Bot"** button (next to API Keys button)

**Step 2** — A dialog opens showing:
- If not linked: instructions + "Generate Token" button
- Token displayed as `qatg_abc123xyz` with a copy button (valid 15 min)

**Step 3** — User opens the bot on Telegram and sends:
```
/connect qatg_abc123xyz
```

**Step 4** — Bot replies: `✅ Telegram linked to your QA Playground account!`

Done. All future `#todo`, `#note`, URL messages are auto-saved to their account.
To unlink: click "Disconnect" in the same dialog.

---

## Phase 6 — Connect Token API (`app/api/telegram/connect-token/route.js`)

Auth: Better-Auth session required.

- `GET` → return active pending token or generate new `qatg_` + 16 random bytes (SHA-256 hashed in DB, 15-min expiry). Returns `{ linked, token?, expiresAt?, username? }`
- `DELETE` → unlink Telegram (delete `TelegramUser` row)

Token hashing: `createHash('sha256').update(rawToken).digest('hex')` — same `crypto` module used in `app/api/api-keys/route.js`.

---

## Phase 7 — Webhook Handler (`app/api/telegram/webhook/route.js`)

### Security (in order)
1. Verify `X-Telegram-Bot-Api-Secret-Token` header → 401 on mismatch
2. Rate limit by chatId using Upstash (10 req/min) → reply "⏳ Too many requests..." and return 200
3. Extract `message.text`, `message.chat.id`, `message.from.username`

### `/connect` flow
1. Hash token with SHA-256
2. Find `TelegramUser` where `tokenHash = hash AND tokenExpiry > now()`
3. If found → set chatId, username, clear tokenHash/tokenExpiry → reply "✅ Telegram linked!"
4. If not found → reply "❌ Invalid or expired token. Get a new one at qaplayground.com"

### `#todo` flow
1. `parseTodo(text)` → `{ title, timeMin }`
2. Validate: title required
3. Sanitize title
4. Create `DailyTask`: `{ userId, date: today, taskId: cuid(), title, done: false, timeMin, source: "telegram" }`
5. Reply: `✅ Todo saved: *{title}*`

### Resource (URL detected) flow
1. `parseResource(text)` → `{ url, description, tags }`
2. Validate URL
3. `fetchUrlMetadata(url)` → `{ title, description: metaDesc, image }`
4. Use quoted description if provided, else use metaDesc, else empty
5. Create `Resource`: `{ userId, resourceType: "OTHER", title, url, description, tags, image, source: "telegram" }`
6. Reply: `✅ Resource saved: *{title}*\nEdit details at qaplayground.com/study-tracker`

### `#note` flow
1. `parseNote(text)` → `{ title, content, tags, trigger }`
2. Validate: content required
3. Sanitize content, title, tags
4. Create `Note`: `{ userId, trigger, title, content, source: "telegram" }`
5. Reply: `✅ Note saved: *{title}*`

### `/help` reply template
```
📋 *QA Playground Bot — Commands*

*Todo*
#todo Task title @30min
#todo Review PR @1hr
_(time is optional)_

*Resource* — just paste a URL
https://example.com
https://example.com "my description" #js #tutorial
_(description and tags are optional)_

*Note*
#note Your note content here #tag1 #tag2
_(tags are optional)_

*Link your account (one-time)*
/connect <token>
_Get token at: qaplayground.com_

*Help*
/help
```

### Unlinked / unknown cases
- Not linked + not `/connect` → reply with link instructions
- Unknown message (no trigger, no URL) → ignore, return 200

---

## Phase 8 — Critical Files

| File | Action | Status |
|---|---|---|
| `prisma/schema.prisma` | Add models + source fields + chatId nullable | ✅ Done |
| `lib/telegramRules.js` | Parsing constants config | ✅ Done |
| `lib/telegramParser.js` | Parsing & sanitization | ✅ Done |
| `lib/telegramBot.js` | sendMessage helper | ✅ Done |
| `app/api/telegram/webhook/route.js` | Main webhook handler | ✅ Done |
| `app/api/telegram/connect-token/route.js` | Connect token CRUD | ✅ Done |
| `resources/_components/TelegramBotPanel.jsx` | UI panel for linking | ✅ Done |

---

## Verification Checklist

- [ ] `pnpm prisma migrate dev` runs cleanly ✅
- [ ] `GET /api/telegram/connect-token` returns a `qatg_` token
- [ ] `/connect <token>` in Telegram → TelegramUser row created
- [ ] `#todo Buy milk` → DailyTask row, Telegram reply received
- [ ] `#todo Buy milk @30min` → DailyTask with timeMin=30
- [ ] `https://javascript.info` → Resource saved with auto-extracted title
- [ ] `https://example.com "custom desc" #js` → Resource with description + tag
- [ ] `#note My thought here #selenium` → Note with trigger="selenium"
- [ ] `/help` → formatted help message
- [ ] 11 rapid messages → rate limit reply on 11th
- [ ] Wrong webhook secret → 401
- [ ] `#todo <script>alert(1)</script>` → stripped plain text saved
- [ ] Invalid URL → error reply, nothing saved
- [ ] `DELETE /api/telegram/connect-token` → TelegramUser row removed
