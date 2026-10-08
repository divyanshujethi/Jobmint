import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Salaries & Engineering Compensation in India",
  description:
    "Explore real, verified engineering salaries and fresher compensation ranges across top Indian startups and tech companies.",
  alternates: {
    canonical: "https://rolenest.in/salaries",
  },
  openGraph: {
    title: "Tech Salaries in India — Role Nest",
    description:
      "Explore real, verified engineering salaries and fresher compensation ranges across Indian tech companies.",
    url: "https://rolenest.in/salaries",
    siteName: "Role Nest",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Role Nest Engineering Salaries",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Salaries in India — Role Nest",
    description:
      "Explore real, verified engineering salaries and fresher compensation ranges across Indian tech companies.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function SalariesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
