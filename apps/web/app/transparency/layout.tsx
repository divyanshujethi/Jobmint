import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Truth & Transparency Manifesto",
  description:
    "Learn how Role Nest fights ghost jobs, protects student data, eliminates synthetic claims, and verifies every employer posting.",
  alternates: {
    canonical: "/transparency",
  },
  openGraph: {
    title: "Truth & Transparency Manifesto — Role Nest",
    description:
      "Learn how Role Nest fights ghost jobs, protects student data, and verifies every employer posting.",
    url: "https://rolenest.in/transparency",
  },
};

export default function TransparencyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
