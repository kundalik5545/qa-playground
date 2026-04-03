import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

// GET /api/admin/stats
export async function GET(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalApiKeyUsers, totalTelegramConnected, totalResources, totalUsers] =
    await Promise.all([
      // distinct users who have at least one API key
      prisma.apiKey
        .groupBy({ by: ["userId"] })
        .then((rows) => rows.length),
      // users linked to telegram (chatId set = actually connected)
      prisma.telegramUser.count({ where: { chatId: { not: null } } }),
      // total resource rows across all users
      prisma.resource.count(),
      // total users (excluding ADMINs)
      prisma.user.count({ where: { role: "USER" } }),
    ]);

  return NextResponse.json({
    totalApiKeyUsers,
    totalTelegramConnected,
    totalResources,
    totalUsers,
  });
}
