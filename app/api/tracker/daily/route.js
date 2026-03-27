import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** GET /api/tracker/daily — fetch all daily tasks, habits, and habit logs for the session user */
export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [tasks, habits, habitLogs] = await Promise.all([
    prisma.dailyTask.findMany({ where: { userId } }),
    prisma.habit.findMany({ where: { userId } }),
    prisma.habitLog.findMany({
      where: { userId },
      include: { habit: { select: { habitId: true } } },
    }),
  ]);

  // Shape daily tasks: { "YYYY-MM-DD": [{ id, title, done, timeMin }] }
  const daily = {};
  for (const t of tasks) {
    if (!daily[t.date]) daily[t.date] = [];
    daily[t.date].push({
      id: t.taskId,
      title: t.title,
      done: t.done,
      timeMin: t.timeMin,
    });
  }

  // Shape habits array
  const habitsOut = habits.map((h) => ({
    id: h.habitId,
    title: h.title,
    timeMin: h.timeMin,
    recurrence: h.recurrence,
    customDays: h.customDays,
    startDate: h.startDate,
    endDate: h.endDate ?? "",
    timeSlot: h.timeSlot ?? "",
    active: h.active,
  }));

  // Shape habitLog: { "YYYY-MM-DD": { "h-xxx": true } }
  const habitLog = {};
  for (const log of habitLogs) {
    if (!habitLog[log.date]) habitLog[log.date] = {};
    habitLog[log.date][log.habit.habitId] = log.done;
  }

  return NextResponse.json({ daily, habits: habitsOut, habitLog });
}

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

  const taskId = String(task.id);
  await prisma.dailyTask.upsert({
    where: { userId_taskId: { userId, taskId } },
    create: {
      userId,
      date,
      taskId,
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
