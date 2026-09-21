import * as fs from "fs";
import * as path from "path";
import { StorageProvider, UploadOptions, UploadResult } from "./types";
import {
  computeSha256,
  signAccessToken,
  validatePdfMagicBytes,
  verifyAccessToken,
} from "./security";

export class LocalDiskStorageDriver implements StorageProvider {
  private baseDir: string;

  constructor(customDir?: string) {
    this.baseDir =
      customDir ||
      process.env.STORAGE_LOCAL_DIR ||
      (process.env.NODE_ENV === "production"
        ? "/data/resumes"
        : path.resolve(process.cwd(), "uploads/resumes"));

    this.ensureDirExists();
  }

  private ensureDirExists(): void {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private getSafeFilePath(key: string): string {
    const safeKey = path.basename(key);
    return path.join(this.baseDir, safeKey);
  }

  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const buffer = Buffer.isBuffer(options.body)
      ? options.body
      : Buffer.from(options.body);

    // 1. Security Check: Validate PDFile Magic Bytes
    if (!validatePdfMagicBytes(buffer)) {
      throw new Error(
        "Security validation failed: File does not match valid PDFile binary signature."
      );
    }

    // 2. Compute SHA-256 Checksum for Deduplication
    const hash = computeSha256(buffer);
    const safeFilename = path.basename(options.filename).replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = options.key || `${hash}.pdf`;
    const targetPath = this.getSafeFilePath(key);

    let isDuplicate = false;
    if (fs.existsSync(targetPath)) {
      isDuplicate = true;
    } else {
      // Atomic write: write to temp file then rename
      const tempPath = `${targetPath}.${Date.now()}.tmp`;
      fs.writeFileSync(tempPath, buffer);
      fs.renameSync(tempPath, targetPath);
    }

    const expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour token
    const token = signAccessToken(key, expiresAt);
    const url = `/api/resumes/stream?key=${encodeURIComponent(key)}&token=${token}&expires=${expiresAt}`;

    return {
      key,
      filename: safeFilename,
      sizeBytes: buffer.length,
      sha256Hash: hash,
      contentType: options.contentType || "application/pdf",
      url,
      isDuplicate,
      uploadedAt: new Date().toISOString(),
    };
  }


  async getFileBuffer(key: string): Promise<Buffer | null> {
    const targetPath = this.getSafeFilePath(key);
    if (!fs.existsSync(targetPath)) {
      return null;
    }
    return fs.readFileSync(targetPath);
  }

  async getSecureFileUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const token = signAccessToken(key, expiresAt);
    return `/api/resumes/stream?key=${encodeURIComponent(key)}&token=${token}&expires=${expiresAt}`;
  }


  async deleteFile(key: string): Promise<boolean> {
    const targetPath = this.getSafeFilePath(key);
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      return true;
    }
    return false;
  }

  verifySignedToken(key: string, token: string, expiresAtUnix: number): boolean {
    return verifyAccessToken(key, token, expiresAtUnix);
  }
}
