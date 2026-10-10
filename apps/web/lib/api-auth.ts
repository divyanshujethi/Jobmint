import crypto from "node:crypto";
import { auth } from "@/auth";

/**
 * Constant-time string comparison to prevent timing attacks on secrets/tokens.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const aBuf = Buffer.from(a, "utf-8");
  const bBuf = Buffer.from(b, "utf-8");
  if (aBuf.length !== bBuf.length) {
    // Constant-time dummy comparison so execution time doesn't leak length
    crypto.timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

/**
 * Verifies Authorization: Bearer <secret> or x-cron-secret header against CRON_SECRET or ADMIN_SECRET.
 * Secrets in URL query parameters (?key=, ?secret=) are strictly disallowed to prevent leaking
 * into Cloudflare / Nginx access logs and HTTP Referer headers.
 * Compares strictly in constant time. Fails closed when secrets are not configured.
 */
export function verifyCronOrAdminSecret(req: Request): boolean {
  const authHeader = req.headers.get("authorization") || "";
  const xCronSecret = req.headers.get("x-cron-secret") || "";

  const providedBearer = authHeader.replace(/^Bearer\s+/i, "").trim();
  const candidates = [providedBearer, xCronSecret.trim()].filter(Boolean);

  if (candidates.length === 0) {
    return false;
  }

  const validSecrets = [
    process.env.CRON_SECRET,
    process.env.ADMIN_SECRET,
  ]
    .filter(Boolean)
    .map((s) => (s as string).trim());

  if (validSecrets.length === 0) {
    // Fail closed: No secrets configured in environment
    return false;
  }

  for (const candidate of candidates) {
    for (const valid of validSecrets) {
      if (timingSafeEqualString(candidate, valid)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Returns the list of authorized admin emails configured in ADMIN_EMAILS.
 * Fails closed (empty array) if unset or empty.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Checks if a given email is present in the configured ADMIN_EMAILS environment variable.
 * Fails closed if ADMIN_EMAILS is unset or empty.
 */
export function isConfiguredAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return false;
  return adminEmails.includes(email.trim().toLowerCase());
}

/**
 * Verifies if the request is made by an authorized SuperAdmin session.
 * Enforces:
 * 1. Active authenticated session with valid user email.
 * 2. User MUST have emailVerified (prevents unverified account impersonation).
 * 3. Email MUST match configured ADMIN_EMAILS (strictly fails closed if unset).
 */
export async function verifyAdminSession(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) return false;

  // Strict email verification gate - unverified accounts cannot hold admin privileges
  const isEmailVerified = Boolean((session.user as any)?.emailVerified);
  if (!isEmailVerified) return false;

  return isConfiguredAdminEmail(session.user.email);
}
