import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** POST /api/tracker/log — append an activity log entry */
export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entry } = await request.json();
  if (!entry?.date || !entry?.action)
    return NextResponse.json(
      { error: "entry.date and entry.action required" },
      { status: 400 }
    );

  await prisma.activityLog.create({
    data: {
      userId,
      date: entry.date,
      topicId: entry.topicId ?? null,
      syllabusId: entry.syllabusId ?? null,
      action: entry.action,
    },
  });

  return NextResponse.json({ ok: true });
}
