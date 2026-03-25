import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** DELETE /api/tracker/daily/[taskId] — delete a daily task by client taskId */
export async function DELETE(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId } = await params;

  await prisma.dailyTask.deleteMany({
    where: { userId, taskId },
  });

  return new NextResponse(null, { status: 204 });
}
