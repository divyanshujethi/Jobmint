import { StorageProvider, UploadOptions, UploadResult } from "./types";
import { LocalDiskStorageDriver } from "./local-driver";
import { S3StorageDriver } from "./s3-driver";

export * from "./types";
export * from "./security";
export * from "./local-driver";
export * from "./s3-driver";

let instance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (instance) return instance;

  const driverType = process.env.STORAGE_DRIVER ? process.env.STORAGE_DRIVER.toLowerCase() : "local";

  if (driverType === "s3" || driverType === "r2") {
    instance = new S3StorageDriver();
  } else {
    // Default to OCI 200 GB Local Persistent Disk Storage
    instance = new LocalDiskStorageDriver();
  }

  return instance;
}

/**
 * Upload a resume, document, or asset with security checks & deduplication
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const provider = getStorageProvider();
  return provider.uploadFile(options);
}

/**
 * Retrieve secure streaming URL for a private resume
 */
export async function getSecureFileUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  const provider = getStorageProvider();
  return provider.getSecureFileUrl(key, expiresInSeconds);
}

/**
 * Retrieve raw file buffer (used by background virus scans, parsers, or streaming endpoints)
 */
export async function getFileBuffer(key: string): Promise<Buffer | null> {
  const provider = getStorageProvider();
  return provider.getFileBuffer(key);
}

/**
 * Delete a file by key
 */
export async function deleteFile(key: string): Promise<boolean> {
  const provider = getStorageProvider();
  return provider.deleteFile(key);
}

/**
 * Verify HMAC token for secure resume streaming
 */
export function verifySignedToken(key: string, token: string, expiresAtUnix: number): boolean {
  const provider = getStorageProvider();
  return provider.verifySignedToken(key, token, expiresAtUnix);
}
