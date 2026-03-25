import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** PATCH /api/tracker/habit-log — toggle habit completion for a date */
export async function PATCH(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { habitId: clientHabitId, date, done } = await request.json();
  if (!clientHabitId || !date)
    return NextResponse.json(
      { error: "habitId and date required" },
      { status: 400 }
    );

  // Resolve client habitId → DB Habit.id
  const habit = await prisma.habit.findUnique({
    where: { userId_habitId: { userId, habitId: clientHabitId } },
    select: { id: true },
  });
  if (!habit)
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });

  await prisma.habitLog.upsert({
    where: { userId_habitId_date: { userId, habitId: habit.id, date } },
    create: { userId, habitId: habit.id, date, done: !!done },
    update: { done: !!done },
  });

  return NextResponse.json({ ok: true });
}
