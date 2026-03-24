import { NextResponse } from "next/server";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    try {
      // Fetch session from the Better-Auth API endpoint.
      // Using native fetch avoids importing Prisma (which can't run on the Edge runtime).
      const sessionRes = await fetch(
        new URL("/api/auth/get-session", request.nextUrl.origin),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (!sessionRes.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const session = await sessionRes.json();

      if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // On any error (network, parse, etc.) deny access
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
