import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support the Role Nest Community",
  description:
    "Support the 100% free, anti-ghosting tech careers movement for Indian students, freshers, and engineers.",
  alternates: {
    canonical: "/donate",
  },
  openGraph: {
    title: "Support Role Nest Community",
    description:
      "Support the 100% free, anti-ghosting tech careers movement for Indian students and freshers.",
    url: "https://rolenest.in/donate",
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
