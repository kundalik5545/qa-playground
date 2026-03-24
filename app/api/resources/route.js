import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

async function resolveUserId(request) {
  // 1. API key auth (for Chrome extension)
  const authHeader = request.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const key = authHeader.slice(7).trim();
    const apiKey = await prisma.apiKey.findUnique({
      where: { key },
      select: { userId: true },
    });
    if (apiKey) return apiKey.userId;
    return null;
  }

  // 2. Session auth (for QA Playground website)
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user?.id ?? null;
}

export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const type   = searchParams.get("type")   || "";
  const tag    = searchParams.get("tag")    || "";

  const where = { userId: session.user.id };
  if (type) where.resourceType = type;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (tag) {
    where.tags = { has: tag };
  }

  const resources = await prisma.resource.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(resources, { headers: CORS_HEADERS });
}

export async function POST(request) {
  const userId = await resolveUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  const body = await request.json();
  const { resourceType, title, url, description, tags, image } = body;

  if (!resourceType || !title || !url) {
    return NextResponse.json(
      { error: "resourceType, title, and url are required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const resource = await prisma.resource.create({
    data: {
      userId,
      resourceType,
      title,
      url,
      description: description || null,
      tags: Array.isArray(tags) ? tags : [],
      image: image || null,
    },
  });

  return NextResponse.json(resource, { status: 201, headers: CORS_HEADERS });
}
