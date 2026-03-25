import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reshapeToState } from "@/lib/trackerDb";

async function getUserId(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user?.id ?? null;
}

/** GET /api/tracker/state — fetch full tracker state for the session user */
export async function GET(request) {
  const userId = await getUserId(request);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [progress, subtopics, dailyTasks, habits, habitLogs, syllabi, logs] =
    await Promise.all([
      prisma.topicProgress.findMany({ where: { userId } }),
      prisma.subtopicProgress.findMany({ where: { userId } }),
      prisma.dailyTask.findMany({ where: { userId } }),
      prisma.habit.findMany({ where: { userId } }),
      prisma.habitLog.findMany({
        where: { userId },
        include: { habit: { select: { habitId: true } } },
      }),
      prisma.userSyllabus.findMany({ where: { userId } }),
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 500,
      }),
    ]);

  const state = reshapeToState({
    progress,
    subtopics,
    dailyTasks,
    habits,
    habitLogs,
    syllabi,
    logs,
  });

  return NextResponse.json(state);
}

/** DELETE /api/tracker/state — wipe all tracker data for the session user */
export async function DELETE(request) {
  const userId = await getUserId(request);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Order matters: delete HabitLog before Habit (FK constraint)
  await prisma.$transaction([
    prisma.habitLog.deleteMany({ where: { userId } }),
    prisma.habit.deleteMany({ where: { userId } }),
    prisma.dailyTask.deleteMany({ where: { userId } }),
    prisma.subtopicProgress.deleteMany({ where: { userId } }),
    prisma.topicProgress.deleteMany({ where: { userId } }),
    prisma.userSyllabus.deleteMany({ where: { userId } }),
    prisma.activityLog.deleteMany({ where: { userId } }),
  ]);

  return new NextResponse(null, { status: 204 });
}
