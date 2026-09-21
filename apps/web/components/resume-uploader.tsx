"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Copy,
  HardDrive,
  Lock,
} from "lucide-react";
import { Button } from "./ui/button";

export interface UploadedFileInfo {
  key: string;
  filename: string;
  sizeBytes: number;
  sha256Hash: string;
  url: string;
  isDuplicate: boolean;
  uploadedAt: string;
}

export function ResumeUploader({
  onUploadSuccess,
}: {
  onUploadSuccess?: (file: UploadedFileInfo) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setUploadedFile(null);

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please upload a smaller PDF.");
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only valid PDF files (.pdf) are supported.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file");
      }

      setUploadedFile(data.file);
      if (onUploadSuccess) {
        onUploadSuccess(data.file);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrl = () => {
    if (!uploadedFile?.url) return;
    navigator.clipboard.writeText(window.location.origin + uploadedFile.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              OCI 200 GB Persistent Resume Storage
            </h3>
            <p className="text-xs text-slate-500">
              Zero cloud fees - SHA-256 deduplicated - Encrypted token streaming
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <Lock className="h-3.5 w-3.5" />
          Private and Secure
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) handleFileSelect(droppedFile);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-emerald-500 bg-emerald-50/50"
            : "border-slate-300 hover:border-emerald-500 hover:bg-slate-50/50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) handleFileSelect(selected);
          }}
          accept="application/pdf"
          className="hidden"
        />

        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          {isUploading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          ) : (
            <UploadCloud className="h-6 w-6 text-emerald-600" />
          )}
        </div>

        <p className="text-sm font-medium text-slate-800">
          {isUploading ? (
            "Streaming file to OCI disk and verifying integrity..."
          ) : (
            <>
              <span className="font-semibold text-emerald-600">Click to upload</span> or drag and drop your PDF resume
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          PDF format only - Max 5MB - Instant binary magic-byte validation
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {uploadedFile && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  {uploadedFile.filename}
                  {uploadedFile.isDuplicate ? (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      Deduplicated on Disk
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Freshly Stored
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {(uploadedFile.sizeBytes / 1024).toFixed(1)} KB - Stored on OCI 200 GB SSD
                </p>
                <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  SHA-256: <span className="truncate max-w-[200px]">{uploadedFile.sha256Hash}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href={uploadedFile.url} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View PDF
                </Button>
              </a>
              <Button size="sm" variant="ghost" onClick={copyUrl} className="gap-1.5 text-xs">
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Token Link"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}