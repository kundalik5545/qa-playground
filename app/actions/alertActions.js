"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function saveAlertResponse(responses) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || null;

  await prisma.alertResponse.create({
    data: {
      responses,
      userAgent,
    },
  });
}
