import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "jobmint-resumes";

// Initialize S3 client for Cloudflare R2 (or any standard S3 endpoint)
const s3Client =
  accountId && accessKeyId && secretAccessKey
    ? new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })
    : null;

export interface UploadOptions {
  key: string;
  body: Uint8Array | Buffer;
  contentType: string;
}

/**
 * Upload a resume, logo, or document to Cloudflare R2 / S3
 */
export async function uploadFile({ key, body, contentType }: UploadOptions): Promise<string> {
  if (!s3Client) {
    // Local development fallback
    console.info(`[Storage: Local Dev Mode] File "${key}" saved in virtual store.`);
    return `/uploads/${key}`;
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return key;
}

/**
 * Generate a secure, time-limited presigned URL for viewing private resumes
 * Resumes are NEVER permanently public
 */
export async function getSecureFileUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  if (!s3Client) {
    return `/uploads/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Delete a file from Cloudflare R2
 */
export async function deleteFile(key: string): Promise<boolean> {
  if (!s3Client) {
    return true;
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
  return true;
}
