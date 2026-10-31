// frontend/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("@imolakaya:token")?.value || 
                // Si w ap sèvi ak localStorage (pa rekòmande pou middleware paske middleware pa wè localStorage, 
                // men si w gen token nan localStorage, middleware a pa ka li l. 
                // Pi bon pratik: sove token an nan yon Cookie tou lè w ap konekte).
                request.headers.get("authorization")?.replace("Bearer ", "");

  const { pathname } = request.nextUrl;

  // Pwoteje wout admin ak propriyetè
  const isProtectedRoute = pathname.startsWith("/admin") || pathname.startsWith("/proprietaire");
  const isAuthRoute = pathname.includes("/connexion") || pathname.includes("/inscription");

  if (isProtectedRoute && !isAuthRoute && !token) {
    return NextResponse.redirect(new URL("/proprietaire/connexion", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/proprietaire/:path*"],
};