import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Jobs in India & Remote",
  description:
    "Explore verified software engineering, AI, and developer jobs across India and remote. Direct ATS apply links with ghosting protection.",
  alternates: {
    canonical: "/jobs",
  },
  openGraph: {
    title: "Tech Jobs in India & Remote — Role Nest",
    description:
      "Explore verified software engineer jobs across India and remote. Direct ATS apply links with ghosting protection.",
    url: "https://rolenest.in/jobs",
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
