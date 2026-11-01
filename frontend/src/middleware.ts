// frontend/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("imolakaya_token")?.value ||
                request.headers.get("authorization")?.replace("Bearer ", "");

  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/admin") || pathname.startsWith("/proprietaire");
  const isAuthRoute = pathname.includes("/connexion") || pathname.includes("/inscription");

  if (isProtectedRoute && !isAuthRoute && !token) {
    const loginPath = pathname.startsWith("/admin") ? "/admin/connexion" : "/proprietaire/connexion";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/proprietaire/:path*"],
};
