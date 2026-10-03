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
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/well-known") ||
    pathname.includes("apple-developer-merchantid-domain-association") ||
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

    // Allow payment verification page on internship subdomain
    if (pathname === "/payment/verify") {
      return NextResponse.next();
    }

    // Rewrite /:slug (e.g. /ai-ml, /portal, /verify/...) to /internship-bootcamp/:slug
    return NextResponse.rewrite(new URL(`/internship-bootcamp${pathname}`, req.url));
  }

  const isDonationSubdomain =
    host.startsWith("donate.") ||
    host.startsWith("donation.") ||
    req.headers.get("x-is-donation") === "1";

  // 2. If accessed on donation.rolenest.in or donate.rolenest.in subdomain:
  if (isDonationSubdomain) {
    // If someone types /donate/..., redirect to clean URL /...
    if (pathname === "/donate" || pathname === "/donate/") {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl, 308);
    }

    // Rewrite root to /donate
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/donate", req.url));
    }

    // Allow payment verification page on donation subdomain
    if (pathname === "/payment/verify") {
      return NextResponse.next();
    }

    // Non-donation pages (like /jobs, /pricing) should NOT work on donation subdomain!
    // Rewriting to /donate${pathname} triggers 404 (e.g. /donate/jobs does not exist)
    return NextResponse.rewrite(new URL(`/donate${pathname}`, req.url));
  }

  // 3. If accessed on main web (rolenest.in):
  if (pathname === "/internship-bootcamp" || pathname.startsWith("/internship-bootcamp/")) {
    const subpath = pathname.replace(/^\/internship-bootcamp/, "") || "/";
    return NextResponse.redirect(new URL(`https://internship.rolenest.in${subpath}`), 308);
  }

  if (pathname === "/donate" || pathname.startsWith("/donate/")) {
    return NextResponse.redirect(new URL("https://donation.rolenest.in/"), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
