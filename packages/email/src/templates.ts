import { APP_CONFIG } from "@repo/shared";

export function applicationViewedTemplate(
  candidateName: string,
  jobTitle: string,
  companyName: string
): { subject: string; html: string } {
  return {
    subject: `Your application was viewed by ${companyName} — ${APP_CONFIG.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1e293b;">
        <div style="margin-bottom: 20px;">
          <strong style="color: #059669; font-size: 20px;">${APP_CONFIG.name}</strong>
          <span style="font-size: 12px; color: #64748b; margin-left: 8px;">Truth Teller Alert</span>
        </div>
        <h2 style="font-size: 18px; color: #0f172a; margin-bottom: 8px;">Great news, ${candidateName}!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          A hiring manager at <strong>${companyName}</strong> has just opened and reviewed your resume for the <strong>${jobTitle}</strong> position.
        </p>
        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px; margin: 20px 0; font-size: 13px; color: #065f46;">
          ✓ Timestamp logged in your Application Tracker.
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
          ${APP_CONFIG.tagline} • Delivered via JobMint Free Notification Gateway
        </p>
      </div>
    `,
  };
}

export function interviewInvitationTemplate(
  candidateName: string,
  jobTitle: string,
  companyName: string,
  details: string
): { subject: string; html: string } {
  return {
    subject: `Interview Invitation from ${companyName}! — ${APP_CONFIG.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1e293b;">
        <div style="margin-bottom: 20px;">
          <strong style="color: #059669; font-size: 20px;">${APP_CONFIG.name}</strong>
        </div>
        <h2 style="font-size: 18px; color: #0f172a;">Congratulations, ${candidateName}!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          <strong>${companyName}</strong> was impressed by your profile and has invited you for an interview for the <strong>${jobTitle}</strong> role.
        </p>
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; margin: 20px 0; font-size: 13px; color: #1e40af;">
          <strong>Next Steps:</strong> ${details}
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
          Best of luck from the team at ${APP_CONFIG.name}!
        </p>
      </div>
    `,
  };
}

export function inactivityNoticeTemplate(
  candidateName: string,
  jobTitle: string,
  companyName: string,
  daysAgo: number
): { subject: string; html: string } {
  return {
    subject: `Truth Teller Inactivity Notice (${companyName}) — ${APP_CONFIG.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1e293b;">
        <div style="margin-bottom: 20px;">
          <strong style="color: #059669; font-size: 20px;">${APP_CONFIG.name}</strong>
          <span style="font-size: 12px; color: #d97706; margin-left: 8px;">7-Day Ghosting Notice</span>
        </div>
        <h2 style="font-size: 18px; color: #0f172a;">Application Update</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          You applied for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> ${daysAgo} days ago. The employer has not viewed your application yet on JobMint.
        </p>
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin: 20px 0; font-size: 13px; color: #92400e;">
          💡 We recommend exploring similar active opportunities rather than waiting.
        </div>
      </div>
    `,
  };
}
