import { NextRequest, NextResponse } from "next/server";
import { getFileBuffer, verifySignedToken } from "@repo/storage";
import { auth } from "@/auth";
import * as path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let key = searchParams.get("key") || searchParams.get("file") || searchParams.get("id");
    const token = searchParams.get("token");
    const expires = searchParams.get("expires");

    // Fallback: If key is missing but token was passed as the file hash or name
    if (!key && token) {
      if (token.endsWith(".pdf") || token.length === 64 || token.includes("-")) {
        key = token;
      }
    }

    // Sanitize in case key contains an embedded query string
    if (key && (key.includes("key=") || key.includes("token="))) {
      try {
        const dummyUrl = new URL(key.startsWith("http") ? key : `https://rolenest.in${key}`);
        key = dummyUrl.searchParams.get("key") || dummyUrl.searchParams.get("token") || path.basename(dummyUrl.pathname);
      } catch {}
    }

    if (!key) {
      return NextResponse.json(
        { error: "Missing required resume identifier (key or file parameter)." },
        { status: 400 }
      );
    }

    const safeKey = path.basename(key);

    // 1. Check SuperAdmin or Owner Session Authorization
    const session = await auth();
    const adminEmails = (
      process.env.ADMIN_EMAILS ||
      "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in"
    )
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const userEmail = session?.user?.email?.toLowerCase();
    const isAdmin =
      (session?.user as any)?.role === "ADMIN" ||
      (userEmail && adminEmails.includes(userEmail));

    let isAuthorized = Boolean(isAdmin);

    // 2. If not SuperAdmin, verify time-limited signed HMAC token
    if (!isAuthorized) {
      if (token && expires) {
        const expiresAt = parseInt(expires, 10);
        if (!isNaN(expiresAt)) {
          isAuthorized = verifySignedToken(safeKey, token, expiresAt);
          if (!isAuthorized && !safeKey.endsWith(".pdf")) {
            isAuthorized = verifySignedToken(`${safeKey}.pdf`, token, expiresAt);
          }
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Access Denied: Invalid, expired, or missing resume access credentials." },
        { status: 403 }
      );
    }

    // 3. Locate file buffer (try exact safeKey, or with/without .pdf extension)
    let buffer = await getFileBuffer(safeKey);
    if (!buffer && !safeKey.endsWith(".pdf")) {
      buffer = await getFileBuffer(`${safeKey}.pdf`);
    }
    if (!buffer && safeKey.endsWith(".pdf")) {
      buffer = await getFileBuffer(safeKey.replace(/\.pdf$/i, ""));
    }

    if (!buffer) {
      return NextResponse.json(
        { error: `Requested resume file (${safeKey}) was not found in storage.` },
        { status: 404 }
      );
    }

    const filename = safeKey.endsWith(".pdf") ? safeKey : `${safeKey}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    console.error("[Resume Stream Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to stream resume file." },
      { status: 500 }
    );
  }
}
