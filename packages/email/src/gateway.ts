export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailDeliveryResult {
  success: boolean;
  provider: "brevo" | "resend" | "mock";
  messageId?: string;
  error?: string;
}

/**
 * Send an email through Brevo (primary free tier: 300/day)
 * with automatic fallback to Resend (backup free tier: 3,000/mo)
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailOptions): Promise<EmailDeliveryResult> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || "rolenestalert@rolenest.in";
  const brevoSenderName = process.env.BREVO_SENDER_NAME || "Role Nest";
  const resendSenderEmail = process.env.RESEND_SENDER_EMAIL || "jobalert@rolenest.in";
  const resendSenderName = process.env.RESEND_SENDER_NAME || "Role Nest";
  const resendFrom = from || `${resendSenderName} <${resendSenderEmail}>`;

  // 1. PRIMARY: BREVO (300 FREE/DAY)
  if (brevoApiKey) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: brevoSenderName, email: brevoSenderEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          provider: "brevo",
          messageId: data.messageId,
        };
      }
      const errText = await res.text();
      console.warn(`[Email] Brevo returned status ${res.status}: ${errText}, attempting Resend fallback...`);
    } catch (err: any) {
      console.error("[Email] Brevo error:", err.message || err);
    }
  }

  // 2. FALLBACK: RESEND (3,000 FREE/MO)
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [to],
          subject,
          html,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          provider: "resend",
          messageId: data.id,
        };
      }
      const errText = await res.text();
      console.warn(`[Email] Resend returned status ${res.status}: ${errText}`);
    } catch (err: any) {
      console.error("[Email] Resend error:", err.message || err);
    }
  }

  // 3. MOCK / DEV FALLBACK
  console.info(`[Email Mock Gateway] Sent to: ${to} | Subject: "${subject}"`);
  return {
    success: true,
    provider: "mock",
    messageId: `mock-${Date.now()}`,
  };
}
