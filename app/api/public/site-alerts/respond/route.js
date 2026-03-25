import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/public/site-alerts/respond
// Saves visitor answers to DB. No auth required.
// Rate-limited per visitorId: one batch per durationDays window.
export async function POST(request) {
  try {
    const body = await request.json();
    const { visitorId, responses } = body;

    if (!visitorId || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Enforce durationDays cooldown: check the most recent response for this visitor
    const config = await prisma.siteAlertConfig.findFirst();
    const durationDays = config?.durationDays ?? 7;

    const lastResponse = await prisma.siteAlertResponse.findFirst({
      where: { visitorId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    if (lastResponse) {
      const diffMs = Date.now() - new Date(lastResponse.createdAt).getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays < durationDays) {
        return NextResponse.json(
          { ok: false, reason: "cooldown" },
          { status: 429 }
        );
      }
    }

    const userAgent = request.headers.get("user-agent") ?? null;

    // Validate that all referenced question IDs exist and are active
    const questionIds = responses.map((r) => r.questionId);
    const activeQuestions = await prisma.siteAlertQuestion.findMany({
      where: { id: { in: questionIds }, isActive: true },
      select: { id: true },
    });
    const activeIds = new Set(activeQuestions.map((q) => q.id));

    const validResponses = responses.filter((r) => activeIds.has(r.questionId));
    if (validResponses.length === 0) {
      return NextResponse.json(
        { error: "No valid active questions in payload" },
        { status: 400 }
      );
    }

    await prisma.siteAlertResponse.createMany({
      data: validResponses.map((r) => ({
        questionId: r.questionId,
        answer: String(r.answer),
        visitorId,
        userAgent,
      })),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[site-alerts/respond POST]", err);
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }
}
