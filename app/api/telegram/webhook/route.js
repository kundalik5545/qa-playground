import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash, randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegramBot";
import {
  detectMessageType,
  parseTodo,
  parseResource,
  parseNote,
  parseConnect,
  fetchUrlMetadata,
  sanitizeText,
} from "@/lib/telegramParser";
import { TELEGRAM_RULES } from "@/lib/telegramRules";

const { rateLimit: RL } = TELEGRAM_RULES;

// Rate limiter keyed by chatId — only initialised when Upstash vars are present.
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(RL.requests, `${RL.windowSeconds} s`),
        prefix: RL.redisPrefix,
        analytics: false,
      })
    : null;

// Telegram always expects HTTP 200 — non-200 causes it to retry the update.
const ok = () => new NextResponse(null, { status: 200 });

const HELP_TEXT = `📋 *QA Playground Bot*

*Todo*
\`#todo Task title\`
\`#todo Review PR @30min\`
_time is optional_

*Resource* — paste a URL
\`https://example.com\`
\`https://example.com "my desc" #js\`
_description and tags are optional_

*Note*
\`#note Your content here #tag\`
_tags are optional_

*Link account (one-time)*
\`/connect <token>\`
_Get token: qaplayground.com → Resources → Telegram Bot_`;

export async function POST(request) {
  // ── 1. Verify webhook secret ──────────────────────────────────────────────
  // Hard-fail if secret is not configured — never allow unauthenticated access.
  if (!process.env.TELEGRAM_WEBHOOK_SECRET) {
    console.error("[Webhook] TELEGRAM_WEBHOOK_SECRET is not set. Rejecting request.");
    return new NextResponse(null, { status: 503 });
  }
  const incomingSecret = request.headers.get("x-telegram-bot-api-secret-token");
  if (incomingSecret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new NextResponse(null, { status: 401 });
  }

  // ── 2. Parse Telegram update ──────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return ok();
  }

  const message = body?.message;
  if (!message?.text) return ok();

  const chatId = String(message.chat?.id);
  const text = sanitizeText(message.text?.trim(), 10000);
  const username = message.from?.username ?? null;

  if (!chatId || !text) return ok();

  // ── 3. Rate limit by chatId ───────────────────────────────────────────────
  if (ratelimit) {
    const { success } = await ratelimit.limit(chatId);
    if (!success) {
      await sendTelegramMessage(chatId, "⏳ Too many requests. Please wait a minute.");
      return ok();
    }
  }

  // ── 4. Detect type and route ──────────────────────────────────────────────
  const type = detectMessageType(text);

  if (type === "help") {
    await sendTelegramMessage(chatId, HELP_TEXT);
    return ok();
  }

  if (type === "connect") {
    await handleConnect(chatId, username, text);
    return ok();
  }

  // All save commands require a linked account
  const telegramUser = await prisma.telegramUser.findUnique({
    where: { chatId },
    select: { userId: true },
  });

  if (!telegramUser?.userId) {
    await sendTelegramMessage(
      chatId,
      "🔗 *Link your account first*\n\nSend: `/connect <token>`\n_Get your token: qaplayground.com → Resources → Telegram Bot_"
    );
    return ok();
  }

  const { userId } = telegramUser;

  switch (type) {
    case "todo":     await handleTodo(chatId, userId, text);     break;
    case "resource": await handleResource(chatId, userId, text); break;
    case "note":     await handleNote(chatId, userId, text);     break;
    // "unknown" — ignore silently, no reply
  }

  return ok();
}

// ── /connect ──────────────────────────────────────────────────────────────────

async function handleConnect(chatId, username, text) {
  const parsed = parseConnect(text);
  if (!parsed) {
    await sendTelegramMessage(chatId, "❌ Invalid format. Use:\n`/connect qatg_<token>`");
    return;
  }

  const tokenHash = createHash("sha256").update(parsed.token).digest("hex");

  // Find a pending TelegramUser record with a matching, non-expired token
  const record = await prisma.telegramUser.findFirst({
    where: {
      tokenHash,
      tokenExpiry: { gt: new Date() },
    },
  });

  if (!record) {
    await sendTelegramMessage(
      chatId,
      "❌ *Invalid or expired token.*\n\nGenerate a new one at qaplayground.com → Resources → Telegram Bot"
    );
    return;
  }

  // Guard: this chatId is already linked to a different account
  const alreadyLinked = await prisma.telegramUser.findUnique({ where: { chatId } });
  if (alreadyLinked && alreadyLinked.userId !== record.userId) {
    await sendTelegramMessage(chatId, "⚠️ This Telegram account is already linked to another QA Playground account.");
    return;
  }

  await prisma.telegramUser.update({
    where: { id: record.id },
    data: { chatId, username, tokenHash: null, tokenExpiry: null },
  });

  await sendTelegramMessage(
    chatId,
    "✅ *Telegram linked to your QA Playground account!*\n\nSend /help to see available commands."
  );
}

// ── #todo ─────────────────────────────────────────────────────────────────────

async function handleTodo(chatId, userId, text) {
  const parsed = parseTodo(text);
  if (!parsed) {
    await sendTelegramMessage(chatId, "❌ *Todo needs a title.*\n\nExample: `#todo Buy groceries @30min`");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    await prisma.dailyTask.create({
      data: {
        userId,
        date: today,
        taskId: randomUUID(),
        title: parsed.title,
        done: false,
        timeMin: parsed.timeMin,
        source: "telegram",
      },
    });

    const timeNote = parsed.timeMin > 0 ? ` _(${parsed.timeMin} min)_` : "";
    await sendTelegramMessage(chatId, `✅ *Todo saved*\n${parsed.title}${timeNote}`);
  } catch (err) {
    console.error("[Webhook] handleTodo:", err?.message);
    await sendTelegramMessage(chatId, "❌ Failed to save todo. Please try again.");
  }
}

// ── resource (URL) ────────────────────────────────────────────────────────────

async function handleResource(chatId, userId, text) {
  const parsed = parseResource(text);
  if (!parsed) {
    await sendTelegramMessage(chatId, "❌ Could not find a valid URL in your message.");
    return;
  }

  try {
    const meta = await fetchUrlMetadata(parsed.url);
    const title = meta.title || parsed.url;
    const description = parsed.description ?? meta.description ?? null;
    const image = meta.image ?? null;

    await prisma.resource.create({
      data: {
        userId,
        resourceType: "OTHER",
        title,
        url: parsed.url,
        description,
        tags: parsed.tags,
        image,
        source: "telegram",
      },
    });

    await sendTelegramMessage(
      chatId,
      `✅ *Resource saved*\n${title}\n_Edit at qaplayground.com → Resources_`
    );
  } catch (err) {
    console.error("[Webhook] handleResource:", err?.message);
    await sendTelegramMessage(chatId, "❌ Failed to save resource. Please try again.");
  }
}

// ── #note ─────────────────────────────────────────────────────────────────────

async function handleNote(chatId, userId, text) {
  const parsed = parseNote(text);
  if (!parsed) {
    await sendTelegramMessage(chatId, "❌ *Note needs content.*\n\nExample: `#note Your thoughts here #tag`");
    return;
  }

  try {
    await prisma.note.create({
      data: {
        userId,
        trigger: parsed.trigger,
        title: parsed.title,
        content: parsed.content,
        source: "telegram",
      },
    });

    await sendTelegramMessage(chatId, `✅ *Note saved*\n${parsed.title}`);
  } catch (err) {
    console.error("[Webhook] handleNote:", err?.message);
    await sendTelegramMessage(chatId, "❌ Failed to save note. Please try again.");
  }
}
