import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Jobs in India & Remote",
  description:
    "Explore verified software engineering, AI, and developer jobs across India and remote. Direct ATS apply links with ghosting protection.",
  alternates: {
    canonical: "https://rolenest.in/jobs",
  },
  openGraph: {
    title: "Tech Jobs in India & Remote — RoleNest",
    description:
      "Explore verified software engineer jobs across India and remote. Direct ATS apply links with ghosting protection.",
    url: "https://rolenest.in/jobs",
    siteName: "RoleNest",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "RoleNest Verified Tech Jobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Jobs in India & Remote — RoleNest",
    description:
      "Explore verified software engineer jobs across India and remote. Direct ATS apply links with ghosting protection.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
