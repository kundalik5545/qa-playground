import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes, createHash } from "crypto";

const TOKEN_EXPIRY_MINUTES = 15;
const TOKEN_PREFIX = "qatg_";

function hashToken(raw) {
  return createHash("sha256").update(raw).digest("hex");
}

// GET — return linked status or generate a new connect token
export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.telegramUser.findUnique({
    where: { userId: session.user.id },
  });

  // Already fully linked (has a chatId)
  if (existing?.chatId) {
    return NextResponse.json({
      linked: true,
      username: existing.username,
      createdAt: existing.createdAt,
    });
  }

  // Has an active pending token — re-return it (can't recover raw token, so generate fresh)
  // Always generate a fresh token so user can copy it
  const rawToken = TOKEN_PREFIX + randomBytes(16).toString("hex");
  const tokenHash = hashToken(rawToken);
  const tokenExpiry = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

  await prisma.telegramUser.upsert({
    where: { userId: session.user.id },
    update: { tokenHash, tokenExpiry },
    create: { userId: session.user.id, chatId: null, tokenHash, tokenExpiry },
  });

  return NextResponse.json({
    linked: false,
    token: rawToken,
    expiresAt: tokenExpiry,
  });
}

// DELETE — unlink Telegram from this account
export async function DELETE(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.telegramUser.deleteMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
