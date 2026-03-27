import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** POST /api/tracker/habits — create or update a habit */
export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { habit } = await request.json();
  if (!habit?.id)
    return NextResponse.json({ error: "habit.id required" }, { status: 400 });

  await prisma.habit.upsert({
    where: { userId_habitId: { userId, habitId: habit.id } },
    create: {
      userId,
      habitId: habit.id,
      title: habit.title,
      timeMin: habit.timeMin ?? 0,
      recurrence: habit.recurrence ?? "daily",
      customDays: habit.customDays ?? [],
      startDate: habit.startDate,
      endDate: habit.endDate ?? null,
      timeSlot: habit.timeSlot ?? null,
      active: habit.active ?? true,
    },
    update: {
      title: habit.title,
      timeMin: habit.timeMin ?? 0,
      recurrence: habit.recurrence ?? "daily",
      customDays: habit.customDays ?? [],
      startDate: habit.startDate,
      endDate: habit.endDate ?? null,
      timeSlot: habit.timeSlot ?? null,
      active: habit.active ?? true,
    },
  });

  return NextResponse.json({ ok: true });
}

/** DELETE /api/tracker/habits — delete a single habit (HabitLogs cascade via schema) */
export async function DELETE(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { habitId } = await request.json();
  if (!habitId)
    return NextResponse.json({ error: "habitId required" }, { status: 400 });

  await prisma.habit.deleteMany({
    where: { userId, habitId },
  });

  return NextResponse.json({ ok: true });
}
