import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paid Tech Internships for Students & Freshers",
  description:
    "Discover verified software engineering, data, and web development internships across India with official stipends, direct ATS links, and smart follow-up tracking.",
  alternates: {
    canonical: "https://rolenest.in/internships",
  },
  openGraph: {
    title: "Paid Tech Internships — Role Nest",
    description:
      "Verified tech internships across India with official stipends and smart application follow-up tracking.",
    url: "https://rolenest.in/internships",
    siteName: "Role Nest",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Role Nest Paid Tech Internships",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paid Tech Internships — Role Nest",
    description:
      "Verified tech internships across India with official stipends and smart application follow-up tracking.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function InternshipsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
