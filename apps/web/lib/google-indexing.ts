import crypto from "crypto";

interface GoogleIndexingResult {
  success: boolean;
  simulated?: boolean;
  url: string;
  type: "URL_UPDATED" | "URL_DELETED";
  status?: number;
  data?: any;
  message?: string;
  error?: string;
}

/**
 * Encodes an object to URL-safe base64
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Generates an OAuth2 access token for Google Indexing API using standard Node.js crypto
 */
async function getGoogleIndexingAccessToken(
  clientEmail: string,
  privateKey: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signInput = `${encodedHeader}.${encodedPayload}`;

  // Normalize private key formatting if passed with escaped newlines
  const formattedKey = privateKey.replace(/\\n/g, "\n");

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signInput);
  signer.end();
  const signature = signer.sign(formattedKey);
  const encodedSignature = signature
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${signInput}.${encodedSignature}`;

  // Exchange signed JWT for Google Bearer Token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || "Failed to exchange Google OAuth2 JWT token");
  }

  return tokenData.access_token;
}

/**
 * Pings Google Indexing API with a URL notification (URL_UPDATED or URL_DELETED)
 */
export async function notifyGoogleIndexing(
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<GoogleIndexingResult> {
  // Support either separate credentials or a full service account JSON
  let clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "";

  if (process.env.GOOGLE_INDEXING_CREDENTIALS) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_INDEXING_CREDENTIALS);
      clientEmail = parsed.client_email || clientEmail;
      privateKey = parsed.private_key || privateKey;
    } catch {}
  }

  // Graceful simulation mode if Google Service Account credentials are not yet populated in production env
  if (!clientEmail || !privateKey) {
    console.log(`[Google Indexing API] Simulation: Queued ${url} (${type}) — credentials pending in .env`);
    return {
      success: true,
      simulated: true,
      url,
      type,
      message:
        "Service Account credentials pending in .env. To enable live pings, set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in /opt/jobmint/app/.env.",
    };
  }

  try {
    const accessToken = await getGoogleIndexingAccessToken(clientEmail, privateKey);

    const apiRes = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url,
        type,
      }),
    });

    const data = await apiRes.json();
    if (!apiRes.ok) {
      return {
        success: false,
        url,
        type,
        status: apiRes.status,
        error: data.error?.message || "Google Indexing API rejected request",
        data,
      };
    }

    return {
      success: true,
      url,
      type,
      status: apiRes.status,
      data,
      message: `Google Indexing API notified successfully for ${url}`,
    };
  } catch (err: any) {
    console.error("[Google Indexing API Error]:", err.message || err);
    return {
      success: false,
      url,
      type,
      error: err.message || "Unknown error during Google Indexing publish",
    };
  }
}

/**
 * Convenient helper to publish a specific job slug
 */
export async function publishJobSlugToGoogle(
  slug: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<GoogleIndexingResult> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://rolenest.in";
  const url = `${baseUrl}/jobs/${slug}`;
  return notifyGoogleIndexing(url, type);
}
