import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Salaries & Engineering Compensation in India",
  description:
    "Explore real, verified engineering salaries and fresher compensation ranges across top Indian startups and tech companies.",
  alternates: {
    canonical: "/salaries",
  },
  openGraph: {
    title: "Tech Salaries in India — Role Nest",
    description:
      "Explore real, verified engineering salaries and fresher compensation ranges across Indian tech companies.",
    url: "https://rolenest.in/salaries",
  },
};

export default function SalariesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
