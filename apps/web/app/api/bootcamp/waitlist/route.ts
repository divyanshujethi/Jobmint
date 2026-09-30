import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { addWaitlistEntry, getWaitlistEntries } from "@/lib/bootcamp-settings-db";

export const dynamic = "force-dynamic";

// GET: Admin-only to view/export all waitlist leads
export async function GET() {
  try {
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

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: SuperAdmin privileges required to view waitlist leads." },
        { status: 403 }
      );
    }

    const leads = await getWaitlistEntries();
    return NextResponse.json({
      success: true,
      total: leads.length,
      leads,
    });
  } catch (error: any) {
    console.error("Error fetching waitlist leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlist leads", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Public endpoint for student joining the waitlist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trackId, trackTitle, name, email, phone, college, degreeBranch, notes } = body;

    if (!trackId || !name || !email) {
      return NextResponse.json(
        { error: "Name, email, and track are required to join the priority waitlist." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const entry = await addWaitlistEntry({
      trackId,
      trackTitle: trackTitle || trackId,
      name,
      email,
      phone: phone || null,
      college: college || null,
      degreeBranch: degreeBranch || null,
      notes: notes || null,
    });

    return NextResponse.json({
      success: true,
      message: "You have been added to the Priority Waitlist! We'll alert you the moment admissions unlock.",
      entry,
    });
  } catch (error: any) {
    console.error("Error adding to waitlist:", error);
    return NextResponse.json(
      { error: "Failed to submit waitlist registration", details: error.message },
      { status: 500 }
    );
  }
}
