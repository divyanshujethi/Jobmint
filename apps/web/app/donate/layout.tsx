import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support the Role Nest Community — Donation & Open Platform",
  description:
    "Support the 100% free, anti-ghosting tech careers movement for Indian students, freshers, and engineers.",
  alternates: {
    canonical: "https://donation.rolenest.in",
  },
  openGraph: {
    title: "Support Role Nest Community — Anti-Ghosting Tech Careers",
    description:
      "Support the transparent, anti-ghosting tech careers movement for Indian engineering students and freshers.",
    url: "https://donation.rolenest.in",
    siteName: "Role Nest Community",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Support Role Nest Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support Role Nest Community — Anti-Ghosting Tech Careers",
    description:
      "Support the transparent, anti-ghosting tech careers movement for Indian engineering students and freshers.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
