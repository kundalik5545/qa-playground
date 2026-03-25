import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** POST /api/tracker/daily — add or update a daily task */
export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, task } = await request.json();
  if (!date || !task?.id)
    return NextResponse.json(
      { error: "date and task.id required" },
      { status: 400 }
    );

  await prisma.dailyTask.upsert({
    where: { userId_taskId: { userId, taskId: task.id } },
    create: {
      userId,
      date,
      taskId: task.id,
      title: task.title,
      done: task.done ?? false,
      timeMin: task.timeMin ?? 0,
    },
    update: {
      date,
      title: task.title,
      done: task.done ?? false,
      timeMin: task.timeMin ?? 0,
    },
  });

  return NextResponse.json({ ok: true });
}
