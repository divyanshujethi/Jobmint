import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paid Tech Internships for Students & Freshers",
  description:
    "Discover verified software engineering, data, and web development internships across India with official stipends and zero ghosting.",
  alternates: {
    canonical: "/internships",
  },
  openGraph: {
    title: "Paid Tech Internships — Role Nest",
    description:
      "Verified tech internships across India with official stipends and ghosting protection.",
    url: "https://rolenest.in/internships",
  },
};

export default function InternshipsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
