import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Certificates & Diplomas — StudyNest Academy",
  },
  description:
    "Earn and verify cryptographic Proof-of-Work diplomas and certificates from StudyNest Academy.",
  alternates: {
    canonical: "https://study.rolenest.in/certificates",
  },
  openGraph: {
    title: "Certificates & Diplomas — StudyNest Academy",
    description:
      "Earn and verify cryptographic Proof-of-Work diplomas and certificates from StudyNest Academy.",
    url: "https://study.rolenest.in/certificates",
    siteName: "StudyNest Academy",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "StudyNest Certificates & Diplomas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certificates & Diplomas — StudyNest Academy",
    description:
      "Earn and verify cryptographic Proof-of-Work diplomas and certificates from StudyNest Academy.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function CertificatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
