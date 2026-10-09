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
 * Verifies Authorization: Bearer <secret> or query param / header secret against CRON_SECRET or ADMIN_SECRET.
 * Compares strictly in constant time.
 */
export function verifyCronOrAdminSecret(req: Request): boolean {
  const authHeader = req.headers.get("authorization") || "";
  const xCronSecret = req.headers.get("x-cron-secret") || "";
  const { searchParams } = new URL(req.url);
  const querySecret = searchParams.get("key") || searchParams.get("secret") || "";

  const providedBearer = authHeader.replace(/^Bearer\s+/i, "").trim();
  const candidates = [providedBearer, xCronSecret.trim(), querySecret.trim()].filter(Boolean);

  if (candidates.length === 0) {
    return false;
  }

  const validSecrets = [
    process.env.CRON_SECRET,
    process.env.ADMIN_SECRET,
  ]
    .filter(Boolean)
    .map((s) => (s as string).trim());

  // Also include dev fallback only if strictly not in production
  if (process.env.NODE_ENV !== "production") {
    validSecrets.push("jobmint_cron_secret", "dev-cron-secret");
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
 * Verifies if the request is made by an authorized SuperAdmin session.
 */
export async function verifyAdminSession(): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;

  const adminEmails = (
    process.env.ADMIN_EMAILS ||
    "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in"
  )
    .split(",")
    .map((e) => e.trim().toLowerCase());

  const userEmail = session.user.email?.toLowerCase();
  const isAdminRole = (session.user as any)?.role === "ADMIN";
  const isAdminEmail = Boolean(userEmail && adminEmails.includes(userEmail));

  return isAdminRole || isAdminEmail;
}
