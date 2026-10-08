import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Truth & Transparency Manifesto",
  description:
    "Learn how Role Nest fights ghost jobs, protects student data, eliminates synthetic claims, and verifies every employer posting.",
  alternates: {
    canonical: "https://rolenest.in/transparency",
  },
  openGraph: {
    title: "Truth & Transparency Manifesto — Role Nest",
    description:
      "Learn how Role Nest fights ghost jobs, protects student data, and verifies every employer posting.",
    url: "https://rolenest.in/transparency",
    siteName: "Role Nest",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Role Nest Transparency Manifesto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truth & Transparency Manifesto — Role Nest",
    description:
      "Learn how Role Nest fights ghost jobs, protects student data, and verifies every employer posting.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function TransparencyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
