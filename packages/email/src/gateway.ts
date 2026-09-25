export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailDeliveryResult {
  success: boolean;
  provider: "brevo" | "resend" | "mailtrap" | "mock";
  messageId?: string;
  error?: string;
}

/**
 * Send an email through Brevo (primary free tier: 300/day)
 * with automatic fallback to Resend (backup free tier: 3,000/mo)
 * and tertiary fallback to Mailtrap (backup free tier: 1,000/mo)
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailOptions): Promise<EmailDeliveryResult> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const mailtrapApiKey = process.env.MAILTRAP_API_KEY;

  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || "alert@news.rolenest.in";
  const brevoSenderName = process.env.BREVO_SENDER_NAME || "Role Nest";

  const resendSenderEmail = process.env.RESEND_SENDER_EMAIL || "jobalert@mail.rolenest.in";
  const resendSenderName = process.env.RESEND_SENDER_NAME || "Role Nest";
  const resendFrom = from || `${resendSenderName} <${resendSenderEmail}>`;

  const mailtrapSenderEmail = process.env.MAILTRAP_SENDER_EMAIL || "notifications@alert.rolenest.in";
  const mailtrapSenderName = process.env.MAILTRAP_SENDER_NAME || "Role Nest";

  // 1. PRIMARY: BREVO (300 FREE/DAY = 9,000/MO)
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

  // 2. SECONDARY: RESEND (3,000 FREE/MO)
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
      console.warn(`[Email] Resend returned status ${res.status}: ${errText}, attempting Mailtrap fallback...`);
    } catch (err: any) {
      console.error("[Email] Resend error:", err.message || err);
    }
  }

  // 3. TERTIARY: MAILTRAP (1,000 FREE/MO)
  if (mailtrapApiKey) {
    try {
      const res = await fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mailtrapApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: { name: mailtrapSenderName, email: mailtrapSenderEmail },
          to: [{ email: to }],
          subject,
          html,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          provider: "mailtrap",
          messageId: data.message_ids?.[0],
        };
      }
      const errText = await res.text();
      console.warn(`[Email] Mailtrap returned status ${res.status}: ${errText}`);
    } catch (err: any) {
      console.error("[Email] Mailtrap error:", err.message || err);
    }
  }

  // 4. MOCK / DEV FALLBACK
  console.info(`[Email Mock Gateway] Sent to: ${to} | Subject: "${subject}"`);
  return {
    success: true,
    provider: "mock",
    messageId: `mock-${Date.now()}`,
  };
}
