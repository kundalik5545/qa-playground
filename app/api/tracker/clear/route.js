import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** DELETE /api/tracker/clear — wipe all daily tracker data (DailyTask, Habit, HabitLog) for the session user */
export async function DELETE(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // HabitLog must go first — it has a FK constraint on Habit
  await prisma.habitLog.deleteMany({ where: { userId } });
  await prisma.habit.deleteMany({ where: { userId } });
  await prisma.dailyTask.deleteMany({ where: { userId } });

  return NextResponse.json({ ok: true });
}
