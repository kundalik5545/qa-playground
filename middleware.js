import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // /admin root — redirect based on auth state
  if (pathname === "/admin") {
    const dest = sessionCookie ? "/admin/site-alerts" : "/admin/login";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // /admin/login — if already logged in, send to dashboard
  if (pathname === "/admin/login") {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/admin/site-alerts", request.url));
    }
    return NextResponse.next();
  }

  // All other /admin/* routes — require auth
  if (!sessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
