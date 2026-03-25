import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** PATCH /api/tracker/subtopics — update single subtopic checked state */
export async function PATCH(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { topicId, subtopicTitle, checked } = await request.json();
  if (!topicId || subtopicTitle === undefined)
    return NextResponse.json(
      { error: "topicId and subtopicTitle required" },
      { status: 400 }
    );

  await prisma.subtopicProgress.upsert({
    where: {
      userId_topicId_subtopicTitle: { userId, topicId, subtopicTitle },
    },
    create: { userId, topicId, subtopicTitle, checked: !!checked },
    update: { checked: !!checked },
  });

  return NextResponse.json({ ok: true });
}
