import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** PUT /api/tracker/syllabus/[syllabusId] — save a custom syllabus */
export async function PUT(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { syllabusId } = await params;
  const { data } = await request.json();
  if (!data)
    return NextResponse.json({ error: "data required" }, { status: 400 });

  await prisma.userSyllabus.upsert({
    where: { userId_syllabusId: { userId, syllabusId } },
    create: { userId, syllabusId, data },
    update: { data },
  });

  return NextResponse.json({ ok: true });
}
