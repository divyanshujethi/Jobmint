import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Membership Plans",
  description:
    "Explore transparent Role Nest plans for students and developers. 100% free core job portal and application tracker with transparent AI career tools.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing & Plans — Role Nest",
    description:
      "Explore transparent Role Nest plans for students and developers. 100% free core job portal.",
    url: "https://rolenest.in/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
