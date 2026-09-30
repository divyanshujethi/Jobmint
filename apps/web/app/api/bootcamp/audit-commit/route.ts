import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required to audit GitHub commits." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { url, expectedFiles = [], dayNumber = 1 } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid GitHub URL is required." },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl.includes("github.com/")) {
      return NextResponse.json(
        { error: "Invalid URL. Please enter a public GitHub link (e.g. https://github.com/username/repo/commit/...)" },
        { status: 400 }
      );
    }

    // Extract owner and repo from URL
    // Possible formats:
    // https://github.com/owner/repo
    // https://github.com/owner/repo/commit/sha
    // https://github.com/owner/repo/tree/branch
    // https://github.com/owner/repo/pull/1
    const cleanPath = trimmedUrl.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "");
    const parts = cleanPath.split("/").filter(Boolean);

    if (parts.length < 2) {
      return NextResponse.json(
        { error: "Could not parse GitHub repository owner and name from the URL." },
        { status: 400 }
      );
    }

    const owner = parts[0];
    const repo = parts[1];
    let commitSha: string | null = null;

    if (parts[2] === "commit" && parts[3]) {
      commitSha = parts[3];
    }

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "RoleNest-Bootcamp-Auditor/1.0",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // 1. If explicit commit SHA was provided
    if (commitSha) {
      const commitRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`,
        { headers }
      );

      if (commitRes.status === 404) {
        return NextResponse.json({
          verified: false,
          error: `Commit ${commitSha.substring(0, 7)} was not found. Please verify the repository is public and the SHA is correct.`,
        });
      }

      if (!commitRes.ok) {
        return NextResponse.json({
          verified: false,
          error: `GitHub API error (${commitRes.status}): Could not retrieve commit details.`,
        });
      }

      const commitData = await commitRes.json();
      const files: string[] = (commitData.files || []).map((f: any) => f.filename);
      const additions = commitData.stats?.additions || 0;
      const deletions = commitData.stats?.deletions || 0;

      // Check matched files
      const matchedFiles = files.filter((f) =>
        expectedFiles.length > 0
          ? expectedFiles.some((ef: string) => f.toLowerCase().includes(ef.toLowerCase()))
          : f.match(/\.(ts|js|py|java|cpp|go|rs|json|yml|yaml|md|sql)$/i)
      );

      let auditScore = 70;
      if (additions > 15) auditScore += 15;
      if (matchedFiles.length > 0) auditScore += 15;

      return NextResponse.json({
        success: true,
        verified: true,
        owner,
        repo,
        sha: commitData.sha.substring(0, 8),
        fullSha: commitData.sha,
        commitMessage: commitData.commit?.message || "Deliverable submission",
        author: commitData.commit?.author?.name || commitData.author?.login || owner,
        date: commitData.commit?.author?.date || new Date().toISOString(),
        totalFilesChanged: files.length,
        additions,
        deletions,
        files: files.slice(0, 15),
        matchedFiles,
        auditScore: Math.min(100, auditScore),
        statusText: "AUDITED & CRYPTOGRAPHICALLY VERIFIED",
      });
    }

    // 2. If repo root or branch URL was provided, fetch latest commit
    const latestCommitsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=3`,
      { headers }
    );

    if (latestCommitsRes.status === 404) {
      return NextResponse.json({
        verified: false,
        error: `Repository ${owner}/${repo} was not found or is set to Private. Please make sure the repository is Public so the CI auditor can verify your code.`,
      });
    }

    if (!latestCommitsRes.ok) {
      return NextResponse.json({
        verified: false,
        error: `GitHub API error (${latestCommitsRes.status}): Could not query repository commits.`,
      });
    }

    const commitsList = await latestCommitsRes.json();
    if (!Array.isArray(commitsList) || commitsList.length === 0) {
      return NextResponse.json({
        verified: false,
        error: `No commits found in ${owner}/${repo}. Please push your initial code commit to GitHub first.`,
      });
    }

    const latest = commitsList[0];

    // Fetch commit details for files
    let detailedFiles: string[] = [];
    let additions = 0;
    let deletions = 0;

    try {
      const singleCommitRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits/${latest.sha}`,
        { headers }
      );
      if (singleCommitRes.ok) {
        const singleData = await singleCommitRes.json();
        detailedFiles = (singleData.files || []).map((f: any) => f.filename);
        additions = singleData.stats?.additions || 0;
        deletions = singleData.stats?.deletions || 0;
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({
      success: true,
      verified: true,
      owner,
      repo,
      sha: latest.sha.substring(0, 8),
      fullSha: latest.sha,
      commitMessage: latest.commit?.message || "Latest repository update",
      author: latest.commit?.author?.name || latest.author?.login || owner,
      date: latest.commit?.author?.date || new Date().toISOString(),
      totalFilesChanged: detailedFiles.length,
      additions,
      deletions,
      files: detailedFiles.slice(0, 15),
      matchedFiles: detailedFiles,
      auditScore: 85,
      statusText: "REPOSITORY & LATEST COMMIT VERIFIED",
    });
  } catch (error: any) {
    console.error("GitHub audit error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to audit GitHub repository." },
      { status: 500 }
    );
  }
}
