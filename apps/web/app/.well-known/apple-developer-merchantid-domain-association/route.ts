import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

/**
 * Serves the Apple Pay domain verification file directly at:
 * /.well-known/apple-developer-merchantid-domain-association
 * Required for Cashfree / Apple Pay Web Domain Association.
 */
export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      ".well-known",
      "apple-developer-merchantid-domain-association"
    );
    const content = await fs.promises.readFile(filePath);

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    return new NextResponse("Not Found", { status: 404 });
  }
}
