export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailDeliveryResult {
  success: boolean;
  provider: "resend" | "brevo" | "ses" | "mailtrap" | "mock";
  messageId?: string;
  error?: string;
}

/**
 * Send transactional email through Resend (primary)
 * with automatic fallback to Brevo and Mailtrap.
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailOptions): Promise<EmailDeliveryResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;
  const mailtrapApiKey = process.env.MAILTRAP_API_KEY;

  const resendSenderEmail = process.env.RESEND_SENDER_EMAIL || process.env.EMAIL_FROM || "alert@mail.rolenest.in";
  const resendSenderName = process.env.RESEND_SENDER_NAME || "Role Nest";
  const resendFrom = from || `${resendSenderName} <${resendSenderEmail}>`;

  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || "alert@news.rolenest.in";
  const brevoSenderName = process.env.BREVO_SENDER_NAME || "Role Nest";

  const mailtrapSenderEmail = process.env.MAILTRAP_SENDER_EMAIL || "alert@alert.rolenest.in";
  const mailtrapSenderName = process.env.MAILTRAP_SENDER_NAME || "Role Nest";

  // 1. PRIMARY: RESEND (High-reputation transactional delivery)
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
        console.info(`[Email] Transactional email delivered via Resend to ${to} (ID: ${data.id})`);
        return {
          success: true,
          provider: "resend",
          messageId: data.id,
        };
      }
      const errText = await res.text();
      console.warn(`[Email] Resend returned status ${res.status}: ${errText}, attempting Brevo fallback...`);
    } catch (err: any) {
      console.error("[Email] Resend error:", err.message || err);
    }
  }

  // 2. SECONDARY: BREVO (300 Free/day SMTP API)
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
        console.info(`[Email] Transactional email delivered via Brevo to ${to} (ID: ${data.messageId})`);
        return {
          success: true,
          provider: "brevo",
          messageId: data.messageId,
        };
      }
      const errText = await res.text();
      console.warn(`[Email] Brevo returned status ${res.status}: ${errText}, attempting Mailtrap fallback...`);
    } catch (err: any) {
      console.error("[Email] Brevo error:", err.message || err);
    }
  }

  // 3. TERTIARY: MAILTRAP (1,000 Free/mo)
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
        console.info(`[Email] Transactional email delivered via Mailtrap to ${to} (ID: ${data.message_ids?.[0]})`);
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
