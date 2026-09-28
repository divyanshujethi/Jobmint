import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase();
  const isInternshipSubdomain =
    host.startsWith("internship.") ||
    host.startsWith("internships.") ||
    req.headers.get("x-is-internship") === "1";

  const { pathname } = req.nextUrl;

  // Static assets and internal next requests pass through directly
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/materials") ||
    pathname.includes(".") // file extensions like .png, .ico, .svg
  ) {
    return NextResponse.next();
  }

  // If accessed via internship.rolenest.in, rewrite paths to /internship-bootcamp
  if (isInternshipSubdomain) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/internship-bootcamp", req.url));
    }

    if (!pathname.startsWith("/internship-bootcamp")) {
      return NextResponse.rewrite(new URL(`/internship-bootcamp${pathname}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
