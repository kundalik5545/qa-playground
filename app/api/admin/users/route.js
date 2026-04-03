import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

// GET /api/admin/users?page=1&limit=20
export async function GET(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = [20, 50].includes(parseInt(searchParams.get("limit"), 10))
    ? parseInt(searchParams.get("limit"), 10)
    : 20;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            resources: true,
            apiKeys: true,
          },
        },
        telegramUser: {
          select: { chatId: true },
        },
      },
    }),
    prisma.user.count({ where: { role: "USER" } }),
  ]);

  return NextResponse.json({ users, total, page, limit });
}
