import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

// GET /api/admin/site-alerts/questions
// Returns all questions including inactive ones.
export async function GET(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const questions = await prisma.siteAlertQuestion.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { responses: true } },
    },
  });

  return NextResponse.json(questions);
}

// POST /api/admin/site-alerts/questions
// Body: { text: string, type: "YESNO"|"THUMBS", order?: number }
export async function POST(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.text?.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const type = body.type === "THUMBS" ? "THUMBS" : "YESNO";

  // Place at end by default
  const last = await prisma.siteAlertQuestion.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const order = typeof body.order === "number" ? body.order : (last?.order ?? -1) + 1;

  const question = await prisma.siteAlertQuestion.create({
    data: { text: body.text.trim(), type, order, isActive: true },
  });

  return NextResponse.json(question, { status: 201 });
}
