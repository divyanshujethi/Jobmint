import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Explicit test error requested by user: myUndefinedFunction();
    // @ts-ignore
    myUndefinedFunction();
    return NextResponse.json({ message: "Should not reach here" });
  } catch (error: any) {
    // Capture in Sentry
    Sentry.captureException(error);
    return NextResponse.json(
      {
        success: true,
        message: "Triggered test error: myUndefinedFunction()",
        errorName: error.name,
        errorMessage: error.message,
        sentryReported: true,
      },
      { status: 500 }
    );
  }
}
