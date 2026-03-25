import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** PATCH /api/tracker/progress — update single topic progress */
export async function PATCH(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { topicId, done, notes, doneAt } = await request.json();
  if (!topicId)
    return NextResponse.json({ error: "topicId required" }, { status: 400 });

  await prisma.topicProgress.upsert({
    where: { userId_topicId: { userId, topicId } },
    create: {
      userId,
      topicId,
      done: done ?? false,
      notes: notes ?? null,
      doneAt: doneAt ? new Date(doneAt) : null,
    },
    update: {
      done: done ?? false,
      notes: notes ?? null,
      doneAt: doneAt ? new Date(doneAt) : null,
    },
  });

  return NextResponse.json({ ok: true });
}
