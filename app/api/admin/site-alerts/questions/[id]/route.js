import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

// PUT /api/admin/site-alerts/questions/[id]
// Partial update: text, type, order, isActive
export async function PUT(request, { params }) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const data = {};

  if (typeof body.text === "string" && body.text.trim()) data.text = body.text.trim();
  if (body.type === "YESNO" || body.type === "THUMBS") data.type = body.type;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  try {
    const question = await prisma.siteAlertQuestion.update({ where: { id }, data });
    return NextResponse.json(question);
  } catch {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }
}

// DELETE /api/admin/site-alerts/questions/[id]
// Hard-deletes the question and all its responses (cascade).
export async function DELETE(request, { params }) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.siteAlertQuestion.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }
}
