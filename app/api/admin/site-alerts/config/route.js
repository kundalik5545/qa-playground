import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

// GET /api/admin/site-alerts/config
export async function GET(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await prisma.siteAlertConfig.findFirst();
  return NextResponse.json({
    enabled: config?.enabled ?? true,
    durationDays: config?.durationDays ?? 7,
  });
}

// PUT /api/admin/site-alerts/config
// Body: { enabled?: boolean, durationDays?: number }
export async function PUT(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data = {};
  if (typeof body.enabled === "boolean") data.enabled = body.enabled;
  if (typeof body.durationDays === "number") data.durationDays = body.durationDays;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const existing = await prisma.siteAlertConfig.findFirst();
  let config;
  if (existing) {
    config = await prisma.siteAlertConfig.update({ where: { id: existing.id }, data });
  } else {
    config = await prisma.siteAlertConfig.create({ data: { enabled: true, durationDays: 7, ...data } });
  }

  return NextResponse.json({ enabled: config.enabled, durationDays: config.durationDays });
}
