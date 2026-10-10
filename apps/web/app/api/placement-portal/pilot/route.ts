import { NextRequest, NextResponse } from "next/server";
import { db, sql } from "@repo/database";
import { sendEmail } from "@repo/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { collegeName, tpoName, email, phone, batchSize, plan } = body;

    if (!collegeName || !tpoName || !email) {
      return NextResponse.json(
        { error: "College Name, TPO Name, and Institutional Email are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCollege = String(collegeName).trim();
    const cleanTpo = String(tpoName).trim();
    const cleanPhone = phone ? String(phone).trim() : null;
    const cleanBatch = batchSize ? String(batchSize).trim() : "500-1000";
    const cleanPlan = plan === "SILVER" ? "SILVER" : "GOLD";

    // 1. Ensure tpo_pilot_requests table exists and insert lead
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS tpo_pilot_requests (
          id VARCHAR(64) PRIMARY KEY,
          college_name VARCHAR(255) NOT NULL,
          tpo_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(32),
          batch_size VARCHAR(64),
          plan_tier VARCHAR(32) DEFAULT 'GOLD',
          status VARCHAR(32) DEFAULT 'PENDING',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      const leadId = `tpo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.execute(sql`
        INSERT INTO tpo_pilot_requests (id, college_name, tpo_name, email, phone, batch_size, plan_tier, status)
        VALUES (${leadId}, ${cleanCollege}, ${cleanTpo}, ${cleanEmail}, ${cleanPhone}, ${cleanPlan}, ${cleanPlan}, 'PENDING');
      `);
    } catch (dbErr: any) {
      console.warn("[TPO DB Pilot Request Warning]:", dbErr.message || dbErr);
    }

    // 2. Dispatch Confirmation Email to TPO and Admin notification asynchronously
    (async () => {
      try {
        // Confirmation to TPO
        await sendEmail({
          to: cleanEmail,
          subject: `🎓 RoleNest Institutional TPO Pilot Activated — ${cleanCollege}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a;">
              <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px;">
                <h1 style="color: #065f46; font-size: 22px; margin: 0;">RoleNest Campus Placement Command Center</h1>
                <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Institutional TPO Pilot Provisioning</p>
              </div>

              <p style="font-size: 15px; line-height: 1.6;">Dear <strong>${cleanTpo}</strong>,</p>

              <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                Thank you for requesting access to the <strong>RoleNest Placement Cell Command Center</strong> for <strong>${cleanCollege}</strong>.
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <h3 style="font-size: 13px; text-transform: uppercase; color: #065f46; margin: 0 0 10px 0; letter-spacing: 0.5px;">Pilot Package Details</h3>
                <ul style="font-size: 13px; color: #334155; line-height: 1.8; margin: 0; padding-left: 18px;">
                  <li><strong>Institution:</strong> ${cleanCollege}</li>
                  <li><strong>Batch Size Scope:</strong> ${cleanBatch} Students</li>
                  <li><strong>Requested Tier:</strong> ${cleanPlan} Campus SaaS</li>
                  <li><strong>Included Trial:</strong> 14 Days Full TPO Dashboard Access</li>
                  <li><strong>Live Features:</strong> Real-time verified direct ATS feeds, automated Webhook syndication (Discord/Slack), and student readiness NAAC reports.</li>
                </ul>
              </div>

              <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                Our University Partnerships Director is reviewing your institution's profile and will reach out with your administrative credentials and onboarding deck within <strong>12 business hours</strong>.
              </p>

              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
                <p style="margin: 0;">RoleNest Institutional Partnerships • Sector 62, Noida, Uttar Pradesh 201301</p>
                <p style="margin: 4px 0 0 0;">Support Desk: <a href="mailto:support@rolenest.in" style="color: #059669;">support@rolenest.in</a> | Direct Helpline: +91 98765 43210</p>
              </div>
            </div>
          `,
        });

        // Notification to Admin
        await sendEmail({
          to: "support@rolenest.in",
          subject: `🚨 [NEW TPO PILOT LEAD] ${cleanCollege} - ${cleanTpo}`,
          html: `
            <p>New Institutional Placement Cell pilot requested:</p>
            <ul>
              <li><strong>College:</strong> ${cleanCollege}</li>
              <li><strong>TPO Name:</strong> ${cleanTpo}</li>
              <li><strong>Email:</strong> ${cleanEmail}</li>
              <li><strong>Phone:</strong> ${cleanPhone || "Not provided"}</li>
              <li><strong>Batch Size:</strong> ${cleanBatch}</li>
              <li><strong>Tier:</strong> ${cleanPlan}</li>
            </ul>
          `,
        });
      } catch (mailErr: any) {
        console.error("[TPO Email Notification Error]:", mailErr.message || mailErr);
      }
    })();

    return NextResponse.json({
      success: true,
      message: "Pilot request submitted successfully. A confirmation email has been dispatched to your institutional address.",
    });
  } catch (error: any) {
    console.error("Error processing TPO pilot request:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
