/**
 * Telegram Bot — Send Message Helper
 *
 * Server-side only. Sends a message to a Telegram chat via Bot API.
 * Fails silently — never throws, so a reply failure never breaks the webhook flow.
 */

const TELEGRAM_API = "https://api.telegram.org";

/**
 * Send a text message to a Telegram chat.
 *
 * @param {string|number} chatId  Telegram chat ID
 * @param {string}        text    Message text (supports Markdown)
 * @param {"Markdown"|"MarkdownV2"|"HTML"} [parseMode="Markdown"]
 */
export async function sendTelegramMessage(chatId, text, parseMode = "Markdown") {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("[TelegramBot] TELEGRAM_BOT_TOKEN not set — skipping reply");
    return;
  }

  try {
    await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
        // Disable link previews for cleaner bot replies
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error("[TelegramBot] Failed to send message:", err?.message);
  }
}
