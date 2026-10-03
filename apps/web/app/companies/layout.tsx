import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Tech Companies & Startups Hiring in India",
  description:
    "Browse verified tech employers, unicorns, and emerging startups actively hiring engineers in India with Truth Teller transparency metrics.",
  alternates: {
    canonical: "/companies",
  },
  openGraph: {
    title: "Top Tech Companies — Role Nest",
    description:
      "Browse verified tech employers and emerging startups actively hiring in India.",
    url: "https://rolenest.in/companies",
  },
};

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
