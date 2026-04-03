import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardContent from "./_components/AdminDashboardContent";

export const metadata = {
  title: "Admin Dashboard — QA Playground",
};

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/study-tracker/dashboard");

  // Fetch stats + first page of users on the server — eliminates 2 client-side
  // fetches and 2 redundant getSession() calls on initial load.
  const [
    totalApiKeyUsers,
    totalTelegramConnected,
    totalResources,
    totalUsers,
    initialUsers,
  ] = await Promise.all([
    prisma.apiKey.groupBy({ by: ["userId"] }).then((rows) => rows.length),
    prisma.telegramUser.count({ where: { chatId: { not: null } } }),
    prisma.resource.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { resources: true, apiKeys: true } },
        telegramUser: { select: { chatId: true } },
      },
    }),
  ]);

  return (
    <AdminDashboardContent
      adminName={session.user.name}
      initialStats={{
        totalApiKeyUsers,
        totalTelegramConnected,
        totalResources,
        totalUsers,
      }}
      initialUsers={initialUsers}
      initialTotal={totalUsers}
    />
  );
}
