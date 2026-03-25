import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** DELETE /api/tracker/habits/[habitId] — delete a habit by client habitId */
export async function DELETE(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { habitId } = await params;

  // HabitLog rows cascade-delete via FK (onDelete: Cascade on Habit)
  await prisma.habit.deleteMany({
    where: { userId, habitId },
  });

  return new NextResponse(null, { status: 204 });
}
