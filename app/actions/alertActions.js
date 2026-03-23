"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function saveAlertResponse(responses) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || null;
  // Vercel sets x-vercel-ip-country automatically (ISO 3166-1 alpha-2 code)
  const country = headersList.get("x-vercel-ip-country") || null;

  await prisma.alertResponse.create({
    data: {
      responses,
      userAgent,
      country,
    },
  });
}
