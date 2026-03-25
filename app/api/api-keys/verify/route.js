import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  const key = authHeader.slice(7).trim();
  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!apiKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401, headers: CORS_HEADERS });
  }

  return NextResponse.json(
    { valid: true, userName: apiKey.user.name, email: apiKey.user.email },
    { headers: CORS_HEADERS }
  );
}
