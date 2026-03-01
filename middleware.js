import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/control-center"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/brand/") ||
    pathname.match(/\.(svg|png|jpg|jpeg|webp|gif|ico)$/)
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const isAdmin = request.cookies.get("blueline_admin")?.value === "1";

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};