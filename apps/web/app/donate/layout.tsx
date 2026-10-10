import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support the Open Platform Community — Donation & Mission",
  description:
    "Support the 100% free, anti-ghosting tech careers movement for Indian students, freshers, and engineers.",
  alternates: {
    canonical: "https://donation.rolenest.in",
  },
  openGraph: {
    title: "Support RoleNest Community — Anti-Ghosting Tech Careers",
    description:
      "Support the transparent, anti-ghosting tech careers movement for Indian engineering students and freshers.",
    url: "https://donation.rolenest.in",
    siteName: "RoleNest Community",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Support RoleNest Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support RoleNest Community — Anti-Ghosting Tech Careers",
    description:
      "Support the transparent, anti-ghosting tech careers movement for Indian engineering students and freshers.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
