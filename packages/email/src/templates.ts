import { APP_CONFIG } from "@repo/shared";

export function applicationSubmittedTemplate(
  candidateName: string,
  jobTitle: string,
  companyName: string
): { subject: string; html: string } {
  return {
    subject: `Application Submitted: ${jobTitle} at ${companyName} — ${APP_CONFIG.name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1e293b;">
        <div style="margin-bottom: 20px;">
          <strong style="color: #059669; font-size: 20px;">${APP_CONFIG.name}</strong>
          <span style="font-size: 12px; color: #64748b; margin-left: 8px;">Application Confirmed</span>
        </div>
        <h2 style="font-size: 18px; color: #0f172a; margin-bottom: 8px;">Application Received, ${candidateName}!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully registered on Role Nest.
        </p>
        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px; margin: 20px 0; font-size: 13px; color: #065f46;">
          ✓ <strong>Truth Teller Telemetry Active</strong>: You will be notified the moment the hiring team reviews your resume. If no review takes place within 7 days, you will receive an inactivity advisory.
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
          ${APP_CONFIG.tagline} • Delivered via Role Nest Verified Notification Gateway
        </p>
      </div>
    `,
  };
}

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
          ${APP_CONFIG.tagline} • Delivered via Role Nest Free Notification Gateway
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
          You applied for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> ${daysAgo} days ago. The employer has not viewed your application yet on Role Nest.
        </p>
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin: 20px 0; font-size: 13px; color: #92400e;">
          💡 We recommend exploring similar active opportunities rather than waiting.
        </div>
      </div>
    `,
  };
}

export function candidateWelcomeConfirmationTemplate(
  candidateName: string,
  confirmationLink: string
): { subject: string; html: string } {
  return {
    subject: `Confirm your ${APP_CONFIG.name} account — ${candidateName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="margin-bottom: 24px;">
          <strong style="color: #059669; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">${APP_CONFIG.name}</strong>
          <span style="font-size: 11px; color: #065f46; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 9999px; margin-left: 10px; font-weight: 600;">Account Verification</span>
        </div>
        
        <h2 style="font-size: 20px; color: #0f172a; margin-bottom: 12px; font-weight: 700;">Welcome to Role Nest, ${candidateName}!</h2>
        
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
          Thanks for joining Role Nest. To activate your candidate profile, discover verified tech openings in India, and track your applications with Truth Teller, please verify your email address.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${confirmationLink}" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 600; font-size: 14px; padding: 13px 32px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);">
            Verify My Account →
          </a>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin: 24px 0; font-size: 12px; color: #64748b;">
          <strong>Link not working?</strong> Copy and paste this URL into your browser:<br/>
          <a href="${confirmationLink}" style="color: #059669; word-break: break-all; text-decoration: underline;">${confirmationLink}</a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 24px;">
          If you didn't create an account on ${APP_CONFIG.name}, you can safely disregard this email.<br/>
          ${APP_CONFIG.name} • ${APP_CONFIG.tagline}
        </p>
      </div>
    `,
  };
}

export function passwordResetTemplate(
  candidateName: string,
  resetLink: string
): { subject: string; html: string } {
  return {
    subject: `Reset your password — ${APP_CONFIG.name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="margin-bottom: 24px;">
          <strong style="color: #059669; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">${APP_CONFIG.name}</strong>
          <span style="font-size: 11px; color: #92400e; background: #fffbeb; border: 1px solid #fde68a; padding: 3px 8px; border-radius: 9999px; margin-left: 10px; font-weight: 600;">Security</span>
        </div>
        
        <h2 style="font-size: 20px; color: #0f172a; margin-bottom: 12px; font-weight: 700;">Password Reset Request</h2>
        
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
          Hi ${candidateName}, we received a request to reset your ${APP_CONFIG.name} account password. Click the button below to choose a new secure password.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetLink}" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 600; font-size: 14px; padding: 13px 32px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);">
            Reset Password →
          </a>
        </div>

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin: 24px 0; font-size: 12px; color: #92400e;">
          ⚠️ <strong>Security Notice:</strong> This password reset link is valid for 60 minutes and can only be used once. If you did not request a password reset, you can safely ignore this message—your password will remain unchanged.
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin: 24px 0; font-size: 12px; color: #64748b;">
          <strong>Direct link:</strong><br/>
          <a href="${resetLink}" style="color: #059669; word-break: break-all; text-decoration: underline;">${resetLink}</a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 24px;">
          ${APP_CONFIG.name} Security Team • ${APP_CONFIG.tagline}
        </p>
      </div>
    `,
  };
}
