import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "leadyfy_session";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next.js internals, static assets, APIs, and image optimization
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // e.g. favicon.ico, images, svgs
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let session: any = null;
  if (sessionCookie) {
    try {
      const decoded = Buffer.from(sessionCookie, "base64").toString("utf-8");
      session = JSON.parse(decoded);
    } catch {
      session = null;
    }
  }

  const isAuthenticated = !!(session && session.email && session.id);
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // Case 1: Unauthenticated user trying to access protected routes or root
  if (!isAuthenticated) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    // Redirect to login page
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Authenticated user visiting /login or /signup
  if (isAuthenticated && isPublicRoute) {
    const destination = session.role === "CLIENT" ? "/portal" : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Case 3: Authenticated user visiting root /
  if (isAuthenticated && pathname === "/") {
    const destination = session.role === "CLIENT" ? "/portal" : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Case 4: Client role trying to access internal agency pages -> redirect to /portal
  if (
    isAuthenticated &&
    session.role === "CLIENT" &&
    !pathname.startsWith("/portal") &&
    pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
