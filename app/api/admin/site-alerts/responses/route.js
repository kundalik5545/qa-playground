import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

// GET /api/admin/site-alerts/responses
// Query params: ?questionId=<id>&page=1&limit=50
export async function GET(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get("questionId") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
  const skip = (page - 1) * limit;

  const where = questionId ? { questionId } : {};

  const [total, responses] = await Promise.all([
    prisma.siteAlertResponse.count({ where }),
    prisma.siteAlertResponse.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        question: { select: { text: true, type: true } },
      },
    }),
  ]);

  return NextResponse.json({
    total,
    page,
    limit,
    responses: responses.map((r) => ({
      id: r.id,
      questionId: r.questionId,
      questionText: r.question.text,
      questionType: r.question.type,
      answer: r.answer,
      visitorId: r.visitorId,
      createdAt: r.createdAt,
    })),
  });
}
