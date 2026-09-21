export interface UploadOptions {
  key?: string;
  body: Uint8Array | Buffer;
  filename: string;
  contentType?: string;
  userId?: string;
}

export interface UploadResult {
  key: string;
  filename: string;
  sizeBytes: number;
  sha256Hash: string;
  contentType: string;
  url: string;
  isDuplicate: boolean;
  uploadedAt: string;
}

export interface StorageProvider {
  uploadFile(options: UploadOptions): Promise<UploadResult>;
  getFileBuffer(key: string): Promise<Buffer | null>;
  getSecureFileUrl(key: string, expiresInSeconds?: number): Promise<string>;
  deleteFile(key: string): Promise<boolean>;
  verifySignedToken(key: string, token: string, expiresAtUnix: number): boolean;
}
