import { NextRequest, NextResponse } from "next/server";
import { getFileBuffer, verifySignedToken } from "@repo/storage";
import * as path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const token = searchParams.get("token");
  const expires = searchParams.get("expires");

  if (!key || !token || !expires) {
    return NextResponse.json(
      { error: "Missing required authentication parameters (key, token, expiresAt)." },
      { status: 400 }
    );
  }

  const expiresAt = parseInt(expires, 10);
  if (isNaN(expiresAt)) {
    return NextResponse.json(
      { error: "Invalid expires timestamp." },
      { status: 400 }
    );
  }

  const isValid = verifySignedToken(key, token, expiresAt);
  if (!isValid) {
    return NextResponse.json(
      { error: "Access Denied: Invalid or expired resume access token." },
      { status: 403 }
    );
  }

  const buffer = await getFileBuffer(key);
  if (!buffer) {
    return NextResponse.json(
      { error: "Requested resume file was not found on storage." },
      { status: 404 }
    );
  }

  const filename = path.basename(key);

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
}
