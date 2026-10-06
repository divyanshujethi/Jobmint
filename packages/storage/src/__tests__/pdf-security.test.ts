import { describe, it, expect } from "vitest";
import { validatePdfMagicBytes, sanitizeAndValidatePdf } from "../security";

describe("PDF Upload Security & Malware Prevention", () => {
  it("rejects non-PDF files disguised as .pdf (e.g., shell scripts, executables, HTML)", () => {
    const maliciousBat = Buffer.from("@echo off\nstart calc.exe\n");
    expect(validatePdfMagicBytes(maliciousBat)).toBe(false);
    expect(sanitizeAndValidatePdf(maliciousBat).isValid).toBe(false);

    const maliciousHtml = Buffer.from("<html><script>alert('XSS')</script></html>");
    expect(validatePdfMagicBytes(maliciousHtml)).toBe(false);
    expect(sanitizeAndValidatePdf(maliciousHtml).isValid).toBe(false);

    const maliciousElf = Buffer.from([0x7f, 0x45, 0x4c, 0x46, 0x02, 0x01]);
    expect(validatePdfMagicBytes(maliciousElf)).toBe(false);
    expect(sanitizeAndValidatePdf(maliciousElf).isValid).toBe(false);
  });

  it("accepts authentic valid PDF documents with standard %%EOF marker", () => {
    const validPdfContent =
      "%PDF-1.7\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n" +
      "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n" +
      "3 0 obj\n<< /Type /Page /Parent 2 0 R >>\nendobj\nxref\n0 4\ntrailer\n<< /Root 1 0 R >>\nstartxref\n180\n%%EOF";
    const validBuffer = Buffer.from(validPdfContent);

    expect(validatePdfMagicBytes(validBuffer)).toBe(true);
    const result = sanitizeAndValidatePdf(validBuffer);
    expect(result.isValid).toBe(true);
  });

  it("rejects truncated PDFs missing the %%EOF termination marker", () => {
    const truncatedPdf = Buffer.from("%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj");
    const result = sanitizeAndValidatePdf(truncatedPdf);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("%%EOF");
  });

  it("blocks weaponized PDFs containing /Launch action exploit payloads", () => {
    const exploitPdf = Buffer.from(
      "%PDF-1.7\n1 0 obj\n<< /Type /Action /S /Launch /F (powershell.exe) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF"
    );
    const result = sanitizeAndValidatePdf(exploitPdf);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("/Launch");
  });

  it("blocks PDFs containing /EmbeddedFiles attachments hiding malware binaries", () => {
    const embeddedPayloadPdf = Buffer.from(
      "%PDF-1.7\n1 0 obj\n<< /Type /Names /EmbeddedFiles << /Names [(malware.exe) 2 0 R] >> >>\nendobj\n%%EOF"
    );
    const result = sanitizeAndValidatePdf(embeddedPayloadPdf);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("/EmbeddedFiles");
  });

  it("blocks PDFs containing automated execution hooks (/OpenAction JS)", () => {
    const jsExploitPdf = Buffer.from(
      "%PDF-1.7\n1 0 obj\n<< /Type /Catalog /OpenAction << /S /JavaScript /JS (app.alert('PWNED')) >> >>\nendobj\n%%EOF"
    );
    const result = sanitizeAndValidatePdf(jsExploitPdf);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("automated script execution");
  });
});
