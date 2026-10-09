import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const host = (
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    ""
  ).toLowerCase();

  let body = "";

  if (host.includes("problem.") || host.includes("arena.") || host.includes("code.")) {
    body = [
      "User-agent: *",
      "Allow: /",
      "Allow: /potd",
      "Allow: /problems",
      "Disallow: /api/",
      "Disallow: /admin/",
      "",
      "# AI Search Engine Indexing",
      "User-agent: GPTBot",
      "Allow: /",
      "User-agent: PerplexityBot",
      "Allow: /",
      "User-agent: Claude-Web",
      "Allow: /",
      "",
      "Sitemap: https://problem.rolenest.in/sitemap.xml",
      "Host: https://problem.rolenest.in",
    ].join("\n");
  } else if (host.includes("study.") || host.includes("learn.")) {
    body = [
      "User-agent: *",
      "Allow: /",
      "Allow: /courses",
      "Allow: /roadmaps",
      "Allow: /playlists",
      "Allow: /certificates",
      "Disallow: /api/",
      "Disallow: /admin/",
      "",
      "# AI Search Engine Indexing",
      "User-agent: GPTBot",
      "Allow: /",
      "User-agent: PerplexityBot",
      "Allow: /",
      "User-agent: Claude-Web",
      "Allow: /",
      "",
      "Sitemap: https://study.rolenest.in/sitemap.xml",
      "Host: https://study.rolenest.in",
    ].join("\n");
  } else if (host.includes("internship.")) {
    body = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /admin/",
      "",
      "Sitemap: https://internship.rolenest.in/sitemap.xml",
      "Host: https://internship.rolenest.in",
    ].join("\n");
  } else {
    // Default rolenest.in
    body = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /admin/",
      "Disallow: /api/",
      "Disallow: /settings/",
      "Disallow: /account/",
      "Disallow: /canvas",
      "Disallow: /employer/applicants",
      "",
      "# AI Search Engine Discovery",
      "User-agent: GPTBot",
      "Allow: /",
      "User-agent: PerplexityBot",
      "Allow: /",
      "User-agent: Claude-Web",
      "Allow: /",
      "User-agent: Google-Extended",
      "Allow: /",
      "",
      "Sitemap: https://rolenest.in/sitemap.xml",
      "Host: https://rolenest.in",
    ].join("\n");
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
