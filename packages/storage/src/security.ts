import * as crypto from "crypto";

const DEFAULT_SECRET = process.env.STORAGE_SECRET || process.env.NEXTAUTH_SECRET  || "jobmint-secure-oci-200gb-storage-key";

/**
 * Inspects binary header for PDF magic bytes (%PDF-)
 * Prevents disguised malicious executables or scripts from being saved
 */
export function validatePdfMagicBytes(buffer: Buffer | Uint8Array): boolean {
  if (!buffer || buffer.length < 5) return false;
  // %PDF- is [0x25, 0x50, 0x44, 0x46, 0x2D]
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2D
  );
}

/**
 * Calculates cryptographic SHA-256 checksum for deduplication and integrity
 */
export function computeSha256(buffer: Buffer | Uint8Array): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Generates an HMAC-SHA256 access token for time-limited, private resume viewing
 */
export function signAccessToken(key: string, expiresAtUnix: number, secret = DEFAULT_SECRET): string {
  const payload = `${key}:${expiresAtUnix}`;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Validates token signature and expiration timestamp
 */
export function verifyAccessToken(key: string, token: string, expiresAtUnix: number, secret = DEFAULT_SECRET): boolean {
  const now = Math.floor(Date.now() / 1000);
  if (now > expiresAtUnix) {
    return false; // Token expired
  }
  const expected = signAccessToken(key, expiresAtUnix, secret);
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
