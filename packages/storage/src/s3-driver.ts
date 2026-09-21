import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StorageProvider, UploadOptions, UploadResult } from "./types";
import {
  computeSha256,
  validatePdfMagicBytes,
  signAccessToken,
  verifyAccessToken,
} from "./security";
import * as path from "path";

export class S3StorageDriver implements StorageProvider {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || "";
    const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || "";
    this.bucketName = process.env.STORAGE_BUCKET_NAME || process.env.R2_BUCKET_NAME || "jobmint-resumes";

    const endpoint = process.env.STORAGE_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
    const region = process.env.STORAGE_REGION || "auto";

    this.client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const buffer = Buffer.isBuffer(options.body)
      ? options.body
      : Buffer.from(options.body);

    if (!validatePdfMagicBytes(buffer)) {
      throw new Error("security validation failed: File does not match valid PDFile binary signature.");
    }

    const hash = computeSha256(buffer);
    const safeFilename = path.basename(options.filename).replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = options.key || `resumes/${hash}.pdf`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: options.contentType || "application/pdf",
    });

    await this.client.send(command);

    const url = await this.getSecureFileUrl(key, 3600);

    return {
      key,
      filename: safeFilename,
      sizeBytes: buffer.length,
      sha256Hash: hash,
      contentType: options.contentType || "application/pdf",
      url,
      isDuplicate: false,
      uploadedAt: new Date().toISOString(),
    };
  }

  async getFileBuffer(key: string): Promise<Buffer | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      const res = await this.client.send(command);
      if (!res.Body) return null;
      const byteArray = await res.Body.transformToByteArray();
      return Buffer.from(byteArray);
    } catch {
      return null;
    }
  }

  async getSecureFileUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  verifySignedToken(key: string, token: string, expiresAtUnix: number): boolean {
    return verifyAccessToken(key, token, expiresAtUnix);
  }
}
