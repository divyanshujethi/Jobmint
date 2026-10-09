const DEFAULT_PATH = "/recommendations";

function isTrustedHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "rolenest.in" || h.endsWith(".rolenest.in")) return true;
  // Local development only; never trusted in production.
  if (process.env.NODE_ENV !== "production" && (h === "localhost" || h === "127.0.0.1")) return true;
  return false;
}

/** True for same-origin paths like "/jobs" but not "//evil.com" or "/\evil.com". */
export function isSafeRelativePath(raw: string): boolean {
  return raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\") && !/[\r\n]/.test(raw);
}

/**
 * Returns a post-login redirect target that is either a safe relative path or an
 * https URL on rolenest.in / *.rolenest.in. Anything else falls back to the default.
 */
export function getSafeCallbackUrl(raw: string | null | undefined, fallback: string = DEFAULT_PATH): string {
  if (!raw) return fallback;
  if (isSafeRelativePath(raw)) return raw;
  try {
    const parsed = new URL(raw);
    const secureEnough = parsed.protocol === "https:" || (process.env.NODE_ENV !== "production" && parsed.protocol === "http:");
    if (secureEnough && isTrustedHost(parsed.hostname)) return raw;
  } catch {}
  return fallback;
}
