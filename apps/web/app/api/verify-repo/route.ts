import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || getClientIp(req);

    // Rate Limiting (15 repo verifications per 5 minutes)
    const rateLimit = await checkRateLimit(req, {
      maxRequests: 15,
      windowSeconds: 300,
      prefix: "rl:verify-repo",
      customKey: userId,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Verification rate limit reached. Please wait ${rateLimit.resetInSeconds}s.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetInSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetInSeconds),
          },
        }
      );
    }

    const body = await req.json();
    const repoUrl = body.repoUrl || body.url;

    if (!repoUrl) {
      return NextResponse.json(
        { error: "GitHub repository URL is required." },
        { status: 400 }
      );
    }

    // Match github.com/owner/repo
    const match = repoUrl.match(/github\.com\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL format. Example: https://github.com/facebook/react" },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;

    const headers: Record<string, string> = {
      "User-Agent": "JobMint-Repo-Verifier",
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: "Repository not found or is private." }, { status: 404 });
      }
      return NextResponse.json({ error: "GitHub API lookup failed." }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      repo: {
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        language: data.language,
        stars: data.stargazers_count,
        forks: data.forks_count,
        isFork: data.fork,
        updatedAt: data.updated_at,
        url: data.html_url,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to verify repository" }, { status: 500 });
  }
}
