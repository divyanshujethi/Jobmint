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
 * Scans PDF buffer for malicious payloads, active code execution vectors, and structural validity.
 */
export function sanitizeAndValidatePdf(buffer: Buffer | Uint8Array): {
  isValid: boolean;
  error?: string;
} {
  if (!buffer || buffer.length < 32) {
    return { isValid: false, error: "File is too small to be a valid PDF document." };
  }

  // 1. Verify Magic Header (%PDF-)
  if (!validatePdfMagicBytes(buffer)) {
    return { isValid: false, error: "Invalid file signature: header does not match PDF format (%PDF-)." };
  }

  // 2. Scan file content for dangerous active execution directives
  const rawString = Buffer.from(buffer).toString("latin1");

  // Check for End-of-File marker in last 2048 bytes
  const tail = rawString.slice(-2048);
  if (!tail.includes("%%EOF")) {
    return { isValid: false, error: "Malformed PDF: Missing standard %%EOF termination marker." };
  }

  // Detect dangerous launch actions that attempt to run external binaries
  if (/\/Launch\b/i.test(rawString)) {
    return { isValid: false, error: "Security violation: Prohibited /Launch directive detected." };
  }

  // Detect embedded executable attachments
  if (/\/EmbeddedFiles\b/i.test(rawString)) {
    return { isValid: false, error: "Security violation: Prohibited /EmbeddedFiles attachment detected." };
  }

  // Detect dangerous automatic JavaScript execution hooks
  if (/\/OpenAction\s*<<[^>]*\/JS/i.test(rawString) || /\/AA\s*<<[^>]*\/JS/i.test(rawString)) {
    return { isValid: false, error: "Security violation: Prohibited automated script execution hook detected." };
  }

  return { isValid: true };
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
