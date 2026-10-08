import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Tech Companies & Startups Hiring in India",
  description:
    "Browse verified tech employers, unicorns, and emerging startups actively hiring engineers in India with Truth Teller transparency metrics.",
  alternates: {
    canonical: "https://rolenest.in/companies",
  },
  openGraph: {
    title: "Top Tech Companies — Role Nest",
    description:
      "Browse verified tech employers and emerging startups actively hiring in India.",
    url: "https://rolenest.in/companies",
    siteName: "Role Nest",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Role Nest Top Tech Employers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Tech Companies — Role Nest",
    description:
      "Browse verified tech employers and emerging startups actively hiring in India.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
