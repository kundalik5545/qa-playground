import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/site-alerts/config
// Returns the active config + active questions for SiteAlertPopup.
// No auth required. Edge-cached for 5 minutes.
export async function GET() {
  try {
    const [config, questions] = await Promise.all([
      prisma.siteAlertConfig.findFirst(),
      prisma.siteAlertQuestion.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: { id: true, text: true, type: true },
      }),
    ]);

    const payload = {
      enabled: config?.enabled ?? true,
      durationDays: config?.durationDays ?? 7,
      questions: questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type.toLowerCase(), // "yesno" | "thumbs" — matches popup expectations
      })),
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[site-alerts/config GET]", err);
    return NextResponse.json(
      { error: "Failed to load alert config" },
      { status: 500 }
    );
  }
}
