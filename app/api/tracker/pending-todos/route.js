import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/tracker/pending-todos
 * Returns all undone daily tasks for the session user, sorted today → past.
 */
export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.dailyTask.findMany({
    where: { userId, done: false },
    orderBy: { date: "desc" },
  });

  const result = tasks.map((t) => ({
    taskId: t.taskId,
    date: t.date,
    title: t.title,
    timeMin: t.timeMin,
    reason: t.reason ?? null,
    done: t.done,
  }));

  return NextResponse.json({ tasks: result, total: result.length });
}

/**
 * PATCH /api/tracker/pending-todos
 * Body: { taskId: string, reason?: string, done?: boolean }
 * Updates the reason and/or done status of a specific task.
 */
export async function PATCH(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { taskId, reason, done } = body;
  if (!taskId)
    return NextResponse.json({ error: "taskId is required" }, { status: 400 });

  // Verify the task belongs to this user
  const existing = await prisma.dailyTask.findUnique({
    where: { userId_taskId: { userId, taskId: String(taskId) } },
  });
  if (!existing)
    return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const updateData = {};
  if (reason !== undefined) updateData.reason = reason || null;
  if (done !== undefined) updateData.done = Boolean(done);

  if (Object.keys(updateData).length === 0)
    return NextResponse.json(
      { error: "Nothing to update — provide reason or done" },
      { status: 400 }
    );

  const updated = await prisma.dailyTask.update({
    where: { userId_taskId: { userId, taskId: String(taskId) } },
    data: updateData,
  });

  return NextResponse.json({
    ok: true,
    task: {
      taskId: updated.taskId,
      date: updated.date,
      title: updated.title,
      reason: updated.reason ?? null,
      done: updated.done,
    },
  });
}
