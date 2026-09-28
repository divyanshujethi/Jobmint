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

  // 1. If accessed on internship.rolenest.in subdomain:
  if (isInternshipSubdomain) {
    // If someone types /internship-bootcamp/..., redirect to clean URL /...
    if (pathname.startsWith("/internship-bootcamp")) {
      const cleanPath = pathname.replace(/^\/internship-bootcamp/, "") || "/";
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = cleanPath;
      return NextResponse.redirect(redirectUrl, 308);
    }

    // Rewrite root to /internship-bootcamp
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/internship-bootcamp", req.url));
    }

    // Rewrite /:slug (e.g. /ai-ml, /portal, /verify/...) to /internship-bootcamp/:slug
    return NextResponse.rewrite(new URL(`/internship-bootcamp${pathname}`, req.url));
  }

  // 2. If accessed on main web (rolenest.in):
  // User explicitly requested: "this will not we rolenest.in/internship-bootcamp in this, only in internship.rolenest.in"
  if (pathname === "/internship-bootcamp" || pathname.startsWith("/internship-bootcamp/")) {
    const subpath = pathname.replace(/^\/internship-bootcamp/, "") || "/";
    return NextResponse.redirect(new URL(`https://internship.rolenest.in${subpath}`), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
