import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificates & Diplomas — StudyNest Academy",
  description:
    "Earn and verify cryptographic Proof-of-Work diplomas and certificates from StudyNest Academy.",
  openGraph: {
    title: "Certificates & Diplomas — StudyNest Academy",
    description:
      "Earn and verify cryptographic Proof-of-Work diplomas and certificates from StudyNest Academy.",
    siteName: "StudyNest Academy",
  },
};

export default function CertificatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
