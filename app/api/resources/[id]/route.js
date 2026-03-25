import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.resource.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const { resourceType, title, url, description, tags, image } = body;

  const updated = await prisma.resource.update({
    where: { id },
    data: {
      ...(resourceType && { resourceType }),
      ...(title && { title }),
      ...(url && { url }),
      description: description ?? existing.description,
      tags: Array.isArray(tags) ? tags : existing.tags,
      image: image ?? existing.image,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.resource.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.resource.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
